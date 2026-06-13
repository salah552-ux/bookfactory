# BSR Calibration Log
## BookFactory Intelligence Layer — Persistent, never delete
## Purpose: Convert community-derived BSR estimates to actuals for this pipeline's niches

**How to add an entry:** Run `calibrate bsr [book-slug] [week-number]` and paste the template
from BSR-CALIBRATION-PROMPT.md. Or paste data directly to the post-launch-tracker agent.

**Automated engine (2026-06-12):** the self-learning loop is now operational via
`intelligence/calibration_engine.py`. Each weekly KDP reading is logged with:

```
python calibration_engine.py add-observation <book> <niche> <week> <bsr> <units_paid> <kenp> <price_gbp> <promo:0|1> "<source>"
```

Once a niche has >= 8 non-promo observations the engine fits the real BSR->units
power law (with an R^2 fit-quality figure) and `python calibration_engine.py report`
replaces the community [EST] table below with the CALIBRATED rate. `add-prediction`
records the Stage-00 opportunity scorer's expectation so `accuracy` can later measure
prediction error and improve the scorer. The engine never invents values — empty is
correct until real data is logged. The post-launch-tracker agent should call
`add-observation` every week, and opus-brain should call `add-prediction` at Stage 00.

**Format:** Each entry is one row. PROMO entries are excluded from the conversion baseline.

---

## LOG

| Date | Book | Week | BSR Overall | Units (paid) | KENP | Price £ | Promo | Notes |
|------|------|------|-------------|--------------|------|---------|-------|-------|
| — | — | — | — | — | — | — | — | No entries yet. Submit from KDP dashboard. See BSR-CALIBRATION-PROMPT.md. |

---

## CALIBRATION STATUS

| Book | Niche | Entries | Baseline ready | Calibrated rate |
|------|-------|---------|----------------|-----------------|
| fix-your-gut-for-good | gut-health | 0 | No (need 8) | Using community table |
| death-in-the-cathedral-close | cozy-mystery | 0 | No (need 8) | Using community table |

---

## COMMUNITY-DERIVED TABLE (in use until calibrated)

Source: KDP community data, self-pub forums, circa 2024–2026.
Labels: EST = estimate only. Actual conversion varies by niche, price, and KU enrolment.

| BSR Range (UK Kindle) | Est. Daily Sales | Confidence |
|-----------------------|------------------|------------|
| < 1,000 | 50–500 [EST] | LOW |
| 1,000–5,000 | 10–50 [EST] | LOW |
| 5,000–20,000 | 5–15 [EST] | LOW |
| 20,000–100,000 | 1–5 [EST] | LOW |
| 100,000–500,000 | 0.1–1 [EST] | VERY LOW |
| > 500,000 | < 0.1 [EST] | VERY LOW |

**These numbers will be replaced with actuals once 8+ entries are logged per book.**

---

## CALIBRATED RATE (populated after 8 entries)

*Not yet populated. Submit weekly data to build this.*

When calibrated, this section will show the verified BSR → units/day conversion rate for
each niche at current price points, based on actual KDP data.
