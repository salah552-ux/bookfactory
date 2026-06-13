#!/usr/bin/env python3
"""
calibration_engine.py - BookFactory self-learning calibration loop.

Turns REAL KDP dashboard data into calibrated BSR->units conversions, and measures
how well the Stage-00 opportunity scorer predicted reality so the scorer improves
over time. This is the operational core of the pipeline's "data-driven, no guesses"
principle.

HARD RULE: this engine never invents numbers. Every figure it emits is computed
from logged real observations, or it prints "NEEDS REAL DATA". An empty ledger is
the correct state until real KDP data is recorded.

Method: book sales vs BSR follow a power law (units ~= A * BSR^b, b < 0). The engine
fits log(units) = log(A) + b*log(BSR) by ordinary least squares once a niche has
>= MIN_POINTS non-promo observations, and reports the fit quality (R^2) so a weak
fit is never mistaken for a strong one.

Usage:
  python calibration_engine.py report
  python calibration_engine.py add-prediction <book> <niche> <opp_score> <pred_bsr_low> <pred_bsr_high> <confidence>
  python calibration_engine.py add-observation <book> <niche> <week> <bsr> <units_paid> <kenp> <price_gbp> <promo:0|1> "<source>"
  python calibration_engine.py calibrate <niche>
  python calibration_engine.py accuracy
  python calibration_engine.py selftest      # proves the math on synthetic fixtures; writes nothing
"""

import json
import sys
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
LEDGER = os.path.join(HERE, "calibration-ledger.json")
MIN_POINTS = 8  # matches the system's existing "need 8" calibration gate


def load():
    with open(LEDGER, "r", encoding="utf-8") as f:
        return json.load(f)


def save(d):
    with open(LEDGER, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2)
        f.write("\n")


def power_fit(points):
    """points: [(bsr, units), ...] with bsr>0, units>0. Returns (A, b, r2) for units = A * bsr**b."""
    xs = [math.log(b) for b, u in points]
    ys = [math.log(u) for b, u in points]
    n = len(xs)
    mx = sum(xs) / n
    my = sum(ys) / n
    sxx = sum((x - mx) ** 2 for x in xs)
    sxy = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    if sxx == 0:
        return None  # all BSR identical - cannot fit
    b = sxy / sxx
    log_a = my - b * mx
    ss_tot = sum((y - my) ** 2 for y in ys)
    ss_res = sum((y - (log_a + b * x)) ** 2 for x, y in zip(xs, ys))
    r2 = (1 - ss_res / ss_tot) if ss_tot > 0 else 0.0
    return math.exp(log_a), b, r2


def _clean_points(d, niche):
    obs = [o for o in d["observations"]
           if o.get("niche") == niche and not o.get("promo")
           and isinstance(o.get("bsr_overall"), (int, float)) and o["bsr_overall"] > 0
           and isinstance(o.get("units_paid"), (int, float)) and o["units_paid"] > 0]
    return [(o["bsr_overall"], o["units_paid"]) for o in obs]


def calibrate(niche):
    d = load()
    pts = _clean_points(d, niche)
    if len(pts) < MIN_POINTS:
        return {"niche": niche, "status": "NEEDS REAL DATA",
                "have": len(pts), "need": MIN_POINTS}
    fit = power_fit(pts)
    if fit is None:
        return {"niche": niche, "status": "INSUFFICIENT VARIANCE", "have": len(pts)}
    A, b, r2 = fit
    return {"niche": niche, "status": "CALIBRATED",
            "A": A, "b": b, "r2": r2, "points": len(pts),
            "predict_units": "units_per_day = %.6g * BSR ** (%.4f)" % (A, b)}


def accuracy():
    """For every prediction that has a matching post-launch observation, report the
    absolute log-ratio error of the opportunity scorer. Real data only."""
    d = load()
    rows = []
    for p in d["predictions"]:
        matched = [o for o in d["observations"]
                   if o.get("book") == p.get("book") and not o.get("promo")
                   and isinstance(o.get("bsr_overall"), (int, float)) and o["bsr_overall"] > 0]
        if not matched:
            continue
        best = min(matched, key=lambda o: o.get("week", 9999))  # earliest real reading
        lo, hi = p.get("pred_bsr_low"), p.get("pred_bsr_high")
        actual = best["bsr_overall"]
        if isinstance(lo, (int, float)) and isinstance(hi, (int, float)) and lo > 0 and hi > 0:
            mid = math.sqrt(lo * hi)  # geometric centre of the predicted range
            err = abs(math.log10(actual) - math.log10(mid))  # orders-of-magnitude error
            rows.append({"book": p["book"], "niche": p.get("niche"),
                         "predicted_bsr_geo": round(mid), "actual_bsr": actual,
                         "log10_error": round(err, 3), "within_range": lo <= actual <= hi})
    return rows


def report():
    d = load()
    niches = sorted({o.get("niche") for o in d["observations"] if o.get("niche")} |
                    {p.get("niche") for p in d["predictions"] if p.get("niche")})
    print("\nBookFactory Calibration Engine - status")
    print("=" * 60)
    print("predictions logged:  %d" % len(d["predictions"]))
    print("observations logged: %d" % len(d["observations"]))
    if not niches:
        print("\nNo niches tracked yet. Ledger is empty - this is correct until")
        print("real KDP data is logged. Add data with add-observation / add-prediction.")
        print("=" * 60)
        return
    print("\n%-22s %-8s %s" % ("niche", "points", "conversion"))
    print("-" * 60)
    for n in niches:
        c = calibrate(n)
        if c["status"] == "CALIBRATED":
            print("%-22s %-8d CALIBRATED  units/day = %.4g * BSR^%.3f  (R2=%.2f)"
                  % (n, c["points"], c["A"], c["b"], c["r2"]))
        else:
            print("%-22s %-8s %s (have %s / need %s)"
                  % (n, c.get("have", 0), c["status"], c.get("have", 0), MIN_POINTS))
    acc = accuracy()
    if acc:
        print("\nprediction accuracy (real launches only):")
        for r in acc:
            flag = "in-range" if r["within_range"] else "MISS"
            print("  %-28s predicted~%s  actual %s  [%s]"
                  % (r["book"], r["predicted_bsr_geo"], r["actual_bsr"], flag))
    print("=" * 60)


def add_prediction(book, niche, opp_score, lo, hi, conf):
    d = load()
    d["predictions"].append({
        "book": book, "niche": niche, "opportunity_score": float(opp_score),
        "pred_bsr_low": int(lo), "pred_bsr_high": int(hi), "confidence": conf,
    })
    save(d)
    print("Logged prediction for %s (%s): BSR %s-%s, opp %s, conf %s"
          % (book, niche, lo, hi, opp_score, conf))


def add_observation(book, niche, week, bsr, units, kenp, price, promo, source):
    if not source or source.strip() == "":
        print("REFUSED: every observation must carry a real source.")
        sys.exit(2)
    d = load()
    d["observations"].append({
        "book": book, "niche": niche, "week": int(week),
        "bsr_overall": int(bsr), "units_paid": float(units), "kenp": float(kenp),
        "price_gbp": float(price), "promo": bool(int(promo)), "source": source,
    })
    save(d)
    print("Logged observation for %s wk%s: BSR %s, units %s (source: %s)"
          % (book, week, bsr, units, source))


def selftest():
    """Prove the power-law fit on a SYNTHETIC fixture. Writes nothing to the ledger.
    These numbers are test fixtures, not market data."""
    A_true, b_true = 5000.0, -0.55
    pts = [(bsr, A_true * bsr ** b_true) for bsr in
           [800, 1500, 3000, 6000, 12000, 30000, 80000, 200000]]
    A, b, r2 = power_fit(pts)
    ok = abs(b - b_true) < 1e-6 and r2 > 0.999
    print("SELFTEST (synthetic fixtures, not real data):")
    print("  recovered b=%.4f (true %.4f), A=%.1f (true %.1f), R2=%.5f" % (b, b_true, A, A_true, r2))
    print("  PASS" if ok else "  FAIL")
    sys.exit(0 if ok else 1)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    cmd = sys.argv[1]
    a = sys.argv[2:]
    if cmd == "report":
        report()
    elif cmd == "selftest":
        selftest()
    elif cmd == "calibrate":
        print(json.dumps(calibrate(a[0]), indent=2))
    elif cmd == "accuracy":
        print(json.dumps(accuracy(), indent=2))
    elif cmd == "add-prediction":
        add_prediction(*a)
    elif cmd == "add-observation":
        add_observation(*a)
    else:
        print("Unknown command: %s" % cmd)
        print(__doc__)
        sys.exit(2)


if __name__ == "__main__":
    main()
