"""
BookFactory KDP Intelligence — Opportunity Analyzer
Implements the algorithms defined in analyzer-agent.md exactly.

Usage: python intelligence/analyzer.py "gut health"
       python intelligence/analyzer.py "cozy mystery" UK

Outputs:
  - intelligence/reports/{niche}_analysis.json   (machine-readable, feeds opus-brain-agent)
  - prints structured summary to stdout
"""

import sys
import json
import sqlite3
import statistics
from datetime import datetime, timedelta
from pathlib import Path

DB_PATH = Path(__file__).parent / "opportunity.db"
REPORTS_DIR = Path(__file__).parent / "reports"
REPORTS_DIR.mkdir(exist_ok=True)


# ──────────────────────────────────────────────
# BSR → DAILY SALES VELOCITY TABLE (UK)
# Community-derived estimates. Label as ESTIMATE everywhere.
# ──────────────────────────────────────────────
BSR_VELOCITY_UK = [
    (100,    (300, 500)),
    (1_000,  (50,  300)),
    (10_000, (5,   50)),
    (50_000, (1,   5)),
    (100_000,(0.5, 1)),
]  # (bsr_ceiling, (min_sales_day, max_sales_day))


def bsr_to_daily_sales(bsr: int) -> tuple[float, float] | None:
    """Returns (min_sales/day, max_sales/day) for a given BSR. Returns None if BSR > 100k."""
    if bsr is None:
        return None
    for ceiling, sales_range in BSR_VELOCITY_UK:
        if bsr <= ceiling:
            return sales_range
    return (0.0, 0.5)  # BSR > 100k


def calibrate_bsr_velocity(real_bsr: int, real_sales_per_day: float, book_title: str = "") -> dict:
    """
    Calibration function: call this when you have REAL sales data from KDP reports.
    Compares real observed sales/day against the current BSR_VELOCITY_UK table estimate
    and returns a calibration record. Calibration records are written to
    intelligence/BSR-CALIBRATION.md for manual review by the Architect.

    The calibration record does NOT automatically update the velocity table —
    it accumulates real observations. Once 5+ calibration points exist for a BSR
    range, the Architect can update BSR_VELOCITY_UK manually from the evidence.

    Usage (from analyzer-agent or post-launch-tracker):
        python intelligence/analyzer.py calibrate <BSR> <sales_per_day> "<book_title>"

    Example:
        python intelligence/analyzer.py calibrate 8500 4.2 "Fix Your Gut for Good"
    """
    estimate = bsr_to_daily_sales(real_bsr)
    est_min = estimate[0] if estimate else 0.0
    est_max = estimate[1] if estimate else 0.5

    within_range = est_min <= real_sales_per_day <= est_max if estimate else False
    ratio = round(real_sales_per_day / ((est_min + est_max) / 2), 2) if (est_min + est_max) > 0 else None

    record = {
        "timestamp": datetime.now().isoformat(),
        "book_title": book_title,
        "bsr": real_bsr,
        "real_sales_per_day": real_sales_per_day,
        "estimated_min": est_min,
        "estimated_max": est_max,
        "within_estimated_range": within_range,
        "real_vs_estimate_ratio": ratio,
        "assessment": (
            "ACCURATE" if within_range
            else ("UNDERESTIMATE" if real_sales_per_day > est_max else "OVERESTIMATE")
        ),
    }

    # Append to BSR-CALIBRATION.md
    cal_path = Path(__file__).parent / "BSR-CALIBRATION.md"
    header = (
        "# BSR Velocity Calibration Log\n"
        "## Purpose: Accumulate real KDP sales data against community-derived BSR estimates.\n"
        "## When 5+ observations exist for a BSR range, review and update BSR_VELOCITY_UK in analyzer.py.\n"
        "## Source: analyzer.py calibrate command — called by post-launch-tracker or Architect.\n\n"
        "| Timestamp | Book | BSR | Real Sales/Day | Est Min | Est Max | In Range | Ratio | Assessment |\n"
        "|-----------|------|-----|----------------|---------|---------|----------|-------|------------|\n"
    )
    if not cal_path.exists():
        cal_path.write_text(header)

    row = (
        f"| {record['timestamp'][:19]} | {book_title[:40]} | {real_bsr:,} "
        f"| {real_sales_per_day} | {est_min} | {est_max} "
        f"| {'YES' if within_range else 'NO'} | {ratio} | {record['assessment']} |\n"
    )
    with cal_path.open("a") as f:
        f.write(row)

    print(f"[Calibration] Recorded to {cal_path}")
    print(f"  BSR {real_bsr:,} → estimated {est_min}–{est_max}/day | real: {real_sales_per_day}/day | {record['assessment']}")
    if not within_range:
        print(f"  ⚠ Estimate is {'too low' if real_sales_per_day > est_max else 'too high'} by ratio {ratio}x")

    return record


def load_products(niche: str, marketplace: str | None = None) -> list:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    if marketplace:
        rows = conn.execute(
            "SELECT * FROM products WHERE niche=? AND marketplace=? ORDER BY scraped_at DESC",
            (niche, marketplace)
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM products WHERE niche=? ORDER BY scraped_at DESC",
            (niche,)
        ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def deduplicate_by_asin(products: list) -> list:
    """Keep only the most recently scraped record per ASIN."""
    seen = {}
    for p in products:
        asin = p.get("asin")
        if asin and asin not in seen:
            seen[asin] = p
    return list(seen.values())


# ──────────────────────────────────────────────
# ALGORITHM 1: BSR → SALES VELOCITY
# ──────────────────────────────────────────────
def algorithm_bsr_velocity(products: list) -> dict:
    top20 = sorted(
        [p for p in products if p.get("bsr_overall")],
        key=lambda x: x["bsr_overall"]
    )[:20]

    velocity_rows = []
    top10_daily_min = 0.0
    top10_daily_max = 0.0

    for i, p in enumerate(top20):
        bsr = p.get("bsr_overall")
        vel = bsr_to_daily_sales(bsr)
        ku = bool(p.get("on_ku"))
        # KU adds 30-50% revenue equivalent; represent as a velocity note, not a sales adjustment
        velocity_rows.append({
            "rank": i + 1,
            "asin": p.get("asin"),
            "title": p.get("title", ""),
            "bsr": bsr,
            "sales_day_min_est": vel[0] if vel else None,
            "sales_day_max_est": vel[1] if vel else None,
            "ku": ku,
            "reviews": p.get("review_count"),
            "price_gbp": p.get("price_ebook"),
        })
        if i < 10 and vel:
            top10_daily_min += vel[0]
            top10_daily_max += vel[1]

    return {
        "top20": velocity_rows,
        "top10_category_daily_min_est": round(top10_daily_min, 1),
        "top10_category_daily_max_est": round(top10_daily_max, 1),
        "note": "ESTIMATE ONLY - community-derived BSR-to-sales conversion. Not a guarantee.",
    }


# ──────────────────────────────────────────────
# ALGORITHM 2: NICHE SATURATION SCORE (0–10)
# Matches analyzer-agent.md exactly.
# Lower = less saturated = more opportunity.
# ──────────────────────────────────────────────
def algorithm_saturation_score(products: list) -> dict:
    cutoff_90d = (datetime.now() - timedelta(days=90)).isoformat()

    # A = count of books with BSR < 50,000
    A = sum(1 for p in products if p.get("bsr_overall") and p["bsr_overall"] < 50_000)

    # B = count of new entrants (pub_date within last 90 days)
    # Handles ISO dates ("2024-04-13") and natural language dates ("14 April 2024").
    # Silently skipping unparseable dates produces B=0 which collapses saturation score;
    # we now try multiple formats before giving up on a record.
    B = 0
    _PUB_DATE_FORMATS = [
        "%Y-%m-%d",          # 2024-04-13  (ISO, most common)
        "%d %B %Y",          # 14 April 2024
        "%-d %B %Y",         # 4 April 2024  (Linux only — guarded below)
        "%B %d, %Y",         # April 14, 2024
        "%d/%m/%Y",          # 14/04/2024
        "%m/%d/%Y",          # 04/14/2024
        "%Y/%m/%d",          # 2024/04/13
    ]
    for p in products:
        pd_raw = p.get("pub_date")
        if pd_raw:
            parsed = None
            # First try ISO fromisoformat on the first 10 chars (handles ISO with time suffix)
            try:
                parsed = datetime.fromisoformat(str(pd_raw)[:10])
            except (ValueError, TypeError):
                pass
            # If that failed, try each known format against the full string
            if parsed is None:
                for fmt in _PUB_DATE_FORMATS:
                    try:
                        parsed = datetime.strptime(str(pd_raw).strip(), fmt)
                        break
                    except (ValueError, TypeError):
                        continue
            if parsed and parsed >= datetime.now() - timedelta(days=90):
                B += 1

    # C = median review count across top 20 books
    reviews = sorted([p.get("review_count") or 0 for p in products], key=lambda x: x)
    reviews_nonzero = [r for r in reviews if r > 0]
    C = statistics.median(reviews_nonzero) if reviews_nonzero else 0

    A_score = min(A / 5, 10)
    B_score = min(B * 2, 10)
    C_score = min(C / 100, 10)

    saturation_score = round((A_score * 0.4) + (B_score * 0.3) + (C_score * 0.3), 2)

    if saturation_score <= 3:
        interpretation = "Low saturation — strong opportunity"
    elif saturation_score <= 6:
        interpretation = "Moderate saturation — enter with a clear angle"
    else:
        interpretation = "High saturation — only enter with exceptional differentiation"

    return {
        "A_active_sellers_under_50k": A,
        "B_new_entrants_90d": B,
        "C_median_reviews": C,
        "A_score": round(A_score, 2),
        "B_score": round(B_score, 2),
        "C_score": round(C_score, 2),
        "saturation_score": saturation_score,
        "interpretation": interpretation,
    }


# ──────────────────────────────────────────────
# ALGORITHM 3: PRICE ELASTICITY SIGNAL
# ──────────────────────────────────────────────
def algorithm_price_elasticity(products: list) -> dict:
    # Use `is not None` — price 0.0 (perma-free / KU) is a valid market price.
    # The old `if p.get("price_ebook")` treated 0.0 as falsy, excluding the
    # majority of books in zero-price-dominant niches (e.g. KU cozy mystery).
    all_prices = [p["price_ebook"] for p in products if p.get("price_ebook") is not None]
    if not all_prices:
        return {"error": "No price data available"}

    # For the top5/bottom10 slices, include zero-priced books (same correction).
    top5 = sorted(
        [p for p in products if p.get("bsr_overall") and p.get("price_ebook") is not None],
        key=lambda x: x["bsr_overall"]
    )[:5]
    bottom10 = sorted(
        [p for p in products if p.get("bsr_overall") and p.get("price_ebook") is not None],
        key=lambda x: x["bsr_overall"]
    )[10:20]

    median_price = statistics.median(all_prices)
    top5_avg = statistics.mean([p["price_ebook"] for p in top5]) if top5 else None
    bottom10_avg = statistics.mean([p["price_ebook"] for p in bottom10]) if bottom10 else None

    # Premium tier: any book priced > £6.99 in top 5
    premium_performers = [
        {"title": p.get("title"), "price": p.get("price_ebook"), "bsr": p.get("bsr_overall")}
        for p in top5 if p.get("price_ebook") is not None and p["price_ebook"] > 6.99
    ]

    if premium_performers:
        market_character = "PREMIUM TOLERANT"
    elif all_prices and max(all_prices) - min(all_prices) < 2.00:
        market_character = "COMPRESSED"
    else:
        market_character = "WIDE SPREAD"

    return {
        "median_price_gbp": round(median_price, 2),
        # Use `is not None` guard — 0.0 average is valid (all-free-book top 5)
        "top5_avg_price_gbp": round(top5_avg, 2) if top5_avg is not None else None,
        "bottom10_avg_price_gbp": round(bottom10_avg, 2) if bottom10_avg is not None else None,
        "price_min_gbp": round(min(all_prices), 2),
        "price_max_gbp": round(max(all_prices), 2),
        "premium_tier_performers": premium_performers,
        "market_character": market_character,
    }


# ──────────────────────────────────────────────
# ALGORITHM 4: CONTENT GAP DETECTION
# Derived from TITLE keyword frequency — NOT hardcoded angle strings.
# Flags subtopics present in 0-2 of top 20 titles (potential gaps).
# ──────────────────────────────────────────────
def algorithm_content_gaps(products: list) -> dict:
    top20 = sorted(
        [p for p in products if p.get("bsr_overall") and p.get("title")],
        key=lambda x: x["bsr_overall"]
    )[:20]

    titles = [p.get("title", "").lower() for p in top20]

    # Build a keyword frequency map from all title words (filter out stop words)
    stop_words = {
        "the", "a", "an", "and", "or", "for", "to", "in", "of", "with", "your",
        "by", "on", "at", "is", "it", "its", "from", "how", "what", "why", "that",
        "this", "my", "our", "are", "be", "book", "guide", "complete", "edition",
        "new", "best", "top", "all", "get", "has", "have", "you", "can", "will",
    }

    word_freq = {}
    for title in titles:
        # Split on spaces and punctuation
        words = [w.strip(",:;'\"()[]!?-") for w in title.split()]
        seen_in_this_title = set()
        for w in words:
            if len(w) >= 4 and w not in stop_words and w not in seen_in_this_title:
                word_freq[w] = word_freq.get(w, 0) + 1
                seen_in_this_title.add(w)

    # Title structural patterns
    pattern_checks = {
        "time-bound protocol (X-day / X-week)": lambda t: any(
            x in t for x in ["day", "week", "hour", "minute", "month"]
        ) and any(c.isdigit() for c in t),
        "beginner-targeted": lambda t: any(
            x in t for x in ["beginner", "simple", "easy", "starter", "basic"]
        ),
        "number-led title (N tips / N steps / N ways)": lambda t: (
            t.split()[0].isdigit() if t.split() else False
        ),
        "protocol / plan": lambda t: any(
            x in t for x in ["protocol", "plan", "programme", "program", "blueprint"]
        ),
        "root cause / why": lambda t: any(
            x in t for x in ["root cause", "real reason", "why", "understand", "science"]
        ),
        "outcome-led (heal / fix / reset / boost)": lambda t: any(
            x in t for x in ["heal", "fix", "reset", "boost", "cure", "repair", "restore"]
        ),
        "audience-specific": lambda t: any(
            x in t for x in ["women", "men", "woman", "man", "child", "senior", "athlete"]
        ),
    }

    pattern_frequency = {}
    for pattern_name, check_fn in pattern_checks.items():
        count = sum(1 for t in titles if check_fn(t))
        pattern_frequency[pattern_name] = count

    # Dominant patterns: 4+ of top 20
    dominant = [p for p, c in pattern_frequency.items() if c >= 4]
    # Sparse patterns: 0-2 of top 20 (potential title differentiation)
    sparse = [p for p, c in pattern_frequency.items() if c <= 2]

    # High frequency keywords (in 4+ titles) — already well covered
    high_freq_keywords = {k: v for k, v in word_freq.items() if v >= 4}
    # Low frequency keywords (in 1-2 titles) — potential differentiation terms
    low_freq_keywords = {k: v for k, v in word_freq.items() if 1 <= v <= 2 and v >= 1}
    # Take top 10 low-freq by length (longer = more specific = more interesting)
    sparse_keywords = sorted(low_freq_keywords.keys(), key=len, reverse=True)[:10]

    return {
        "sample_size": len(top20),
        "keyword_frequency": dict(sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:30]),
        "high_frequency_keywords": high_freq_keywords,
        "potential_gap_keywords": sparse_keywords,
        "title_pattern_frequency": pattern_frequency,
        "dominant_patterns": dominant,
        "sparse_patterns": sparse,
        "note": (
            "Content gap detection is based on title keyword frequency only. "
            "Review mining (competitive-positioning-agent) provides deeper gap data — "
            "run it after blueprint approval to get verbatim reader complaints."
        ),
    }


# ──────────────────────────────────────────────
# TRAD-PUB CONTAMINATION DETECTION
# Identifies traditional publisher anchors in the top 20.
# A trad-pub anchor is a book with review count >10x the sample median.
# When 2+ anchors exist, the niche score is computed twice:
#   - full_niche: all books included (raw score)
#   - self_pub_accessible: trad-pub anchors stripped out (actionable score for indie)
# ──────────────────────────────────────────────
def detect_trad_pub_anchors(products: list) -> dict:
    """
    Returns a dict describing trad-pub contamination in the sample.
    A book is flagged as a trad-pub anchor if its review count is >10x the
    sample median review count.  These books have years of review accumulation
    and marketing budgets that make them non-comparable baselines for indie strategy.
    """
    reviews = [p.get("review_count") or 0 for p in products]
    nonzero = [r for r in reviews if r > 0]
    if not nonzero:
        return {"anchors": [], "anchor_count": 0, "sample_median_reviews": 0}

    median_reviews = statistics.median(nonzero)
    threshold = median_reviews * 10

    anchors = []
    for p in products:
        rc = p.get("review_count") or 0
        if rc > threshold and threshold > 0:
            anchors.append({
                "asin": p.get("asin"),
                "title": p.get("title", ""),
                "review_count": rc,
                "bsr": p.get("bsr_overall"),
                "pub_date": p.get("pub_date"),
            })

    return {
        "anchors": anchors,
        "anchor_count": len(anchors),
        "sample_median_reviews": round(median_reviews, 0),
        "anchor_threshold_used": round(threshold, 0),
        "note": (
            "Anchors are books with review counts >10x the sample median. "
            "They are likely traditional publisher titles or long-established "
            "self-pub titles with years of accumulation. Strip them for a "
            "self-pub-accessible opportunity score."
        ) if anchors else "No trad-pub anchors detected — full niche is self-pub comparable.",
    }


# ──────────────────────────────────────────────
# ALGORITHM 5: OPPORTUNITY SCORE (0–100)
# Matches analyzer-agent.md Section 8 exactly.
# When trad-pub anchors are present, computes two scores:
#   full_niche and self_pub_accessible.
# ──────────────────────────────────────────────
def algorithm_opportunity_score(
    velocity: dict,
    saturation: dict,
    price_elasticity: dict,
    content_gaps: dict,
    trad_pub: dict | None = None,
    products_stripped: list | None = None,
) -> dict:

    # Component 1: Demand strength (0–25) — best BSR in niche
    best_bsr = None
    if velocity.get("top20"):
        bsrs = [r["bsr"] for r in velocity["top20"] if r.get("bsr")]
        best_bsr = min(bsrs) if bsrs else None

    if best_bsr is None:
        demand_score = 0
    elif best_bsr <= 1_000:
        demand_score = 25
    elif best_bsr <= 10_000:
        demand_score = 20
    elif best_bsr <= 50_000:
        demand_score = 12
    else:
        demand_score = 5

    # Component 2: Saturation (0–25) — inverted saturation score
    sat = saturation.get("saturation_score", 5)
    saturation_component = round((10 - sat) / 10 * 25, 1)

    # Component 3: Price elasticity (0–25)
    char = price_elasticity.get("market_character", "UNKNOWN")
    if char == "PREMIUM TOLERANT":
        price_score = 25
    elif char == "WIDE SPREAD":
        price_score = 15
    elif char == "COMPRESSED":
        price_score = 10
    else:
        price_score = 10  # unknown / no data

    # Component 4: Content gap (0–25)
    # Bug fix: the 7 structural patterns in content_gaps are non-fiction patterns
    # (protocol, beginner-targeted, outcome-led, etc.).  In fiction niches none of
    # them fire, so ALL 7 land in sparse_patterns — producing a false 25/25 every
    # time.  Guard: if the total pattern-match count across all patterns is < 3,
    # the structural pattern set is not applicable to this genre (fiction).
    # In that case, score on keyword gaps only, capped at 15 to reflect genuine
    # uncertainty rather than a confirmed structural gap.
    pattern_freq = content_gaps.get("title_pattern_frequency", {})
    total_pattern_hits = sum(pattern_freq.values())
    sparse = content_gaps.get("sparse_patterns", [])
    sparse_kw = content_gaps.get("potential_gap_keywords", [])

    if total_pattern_hits < 3:
        # Non-fiction structural patterns are inapplicable (likely a fiction niche).
        # Score on keyword differentiation only; cap at 15 (uncertain signal).
        if len(sparse_kw) >= 5:
            gap_score = 15
        elif len(sparse_kw) >= 2:
            gap_score = 10
        else:
            gap_score = 5
    else:
        # Non-fiction niche: patterns are meaningful.
        if len(sparse) >= 2 or len(sparse_kw) >= 5:
            gap_score = 25
        elif len(sparse) == 1 or len(sparse_kw) >= 2:
            gap_score = 15
        else:
            gap_score = 5

    total = round(demand_score + saturation_component + price_score + gap_score)

    def _verdict(score: int) -> str:
        if score >= 80:
            return "ENTER — strong signal"
        elif score >= 60:
            return "ENTER WITH ANGLE — moderate signal, specific positioning required"
        elif score >= 40:
            return "CAUTION — only enter with a confirmed content gap advantage"
        else:
            return "AVOID — insufficient opportunity signal"

    result = {
        "demand_score": demand_score,
        "demand_best_bsr": best_bsr,
        "saturation_component": saturation_component,
        "saturation_score_input": sat,
        "price_score": price_score,
        "price_character": char,
        "gap_score": gap_score,
        "total": total,
        "verdict": _verdict(total),
        "trad_pub_contamination": None,
        "self_pub_accessible_score": None,
        "self_pub_accessible_verdict": None,
    }

    # ── Self-pub-accessible score (strips trad-pub anchors) ──────────────────
    # If trad-pub anchors are present AND stripped products are provided,
    # compute a second opportunity score from the stripped dataset so the
    # brain-agent can evaluate the niche as an indie entrant would experience it,
    # not as a comparison to trad-pub juggernauts.
    if trad_pub and trad_pub.get("anchor_count", 0) >= 1 and products_stripped:
        result["trad_pub_contamination"] = trad_pub

        # Re-run the three data-dependent algorithms on the stripped set.
        # Content gaps are title-frequency based — recalculate from stripped titles.
        stripped_velocity = algorithm_bsr_velocity(products_stripped)
        stripped_sat = algorithm_saturation_score(products_stripped)
        stripped_price = algorithm_price_elasticity(products_stripped)
        stripped_gaps = algorithm_content_gaps(products_stripped)

        # Re-derive demand score from stripped top BSR
        sp_best_bsr = None
        if stripped_velocity.get("top20"):
            bsrs2 = [r["bsr"] for r in stripped_velocity["top20"] if r.get("bsr")]
            sp_best_bsr = min(bsrs2) if bsrs2 else None

        if sp_best_bsr is None:
            sp_demand = 0
        elif sp_best_bsr <= 1_000:
            sp_demand = 25
        elif sp_best_bsr <= 10_000:
            sp_demand = 20
        elif sp_best_bsr <= 50_000:
            sp_demand = 12
        else:
            sp_demand = 5

        sp_sat_val = stripped_sat.get("saturation_score", 5)
        sp_sat_component = round((10 - sp_sat_val) / 10 * 25, 1)

        sp_char = stripped_price.get("market_character", "UNKNOWN")
        if sp_char == "PREMIUM TOLERANT":
            sp_price = 25
        elif sp_char == "WIDE SPREAD":
            sp_price = 15
        else:
            sp_price = 10

        sp_pattern_freq = stripped_gaps.get("title_pattern_frequency", {})
        sp_total_hits = sum(sp_pattern_freq.values())
        sp_sparse = stripped_gaps.get("sparse_patterns", [])
        sp_sparse_kw = stripped_gaps.get("potential_gap_keywords", [])
        if sp_total_hits < 3:
            sp_gap = 15 if len(sp_sparse_kw) >= 5 else (10 if len(sp_sparse_kw) >= 2 else 5)
        else:
            sp_gap = 25 if (len(sp_sparse) >= 2 or len(sp_sparse_kw) >= 5) else (15 if (len(sp_sparse) == 1 or len(sp_sparse_kw) >= 2) else 5)

        sp_total = round(sp_demand + sp_sat_component + sp_price + sp_gap)

        result["self_pub_accessible_score"] = sp_total
        result["self_pub_accessible_verdict"] = _verdict(sp_total)
        result["self_pub_accessible_note"] = (
            f"Score computed after stripping {trad_pub['anchor_count']} trad-pub anchor(s) "
            f"({', '.join(a['title'][:40] for a in trad_pub['anchors'][:3])}). "
            "This is the actionable opportunity signal for an indie entrant."
        )
    elif trad_pub and trad_pub.get("anchor_count", 0) == 0:
        result["trad_pub_contamination"] = trad_pub  # record the clean result

    return result


# ──────────────────────────────────────────────
# MAIN ANALYSIS
# ──────────────────────────────────────────────
def analyze(niche: str, marketplace: str | None = None) -> dict:
    products = load_products(niche, marketplace)
    products = deduplicate_by_asin(products)

    if len(products) < 10:
        return {
            "error": f"Insufficient data for '{niche}' (found {len(products)} records). "
                     f"Run harvester-agent first."
        }

    # Warn if data is stale (oldest record > 14 days)
    scrape_dates = [p.get("scraped_at") for p in products if p.get("scraped_at")]
    most_recent = max(scrape_dates) if scrape_dates else None
    stale_warning = None
    if most_recent:
        age_days = (datetime.now() - datetime.fromisoformat(most_recent[:19])).days
        if age_days > 14:
            stale_warning = f"Data is {age_days} days old. Consider re-running the harvester."

    marketplaces_present = list(set(p.get("marketplace") for p in products if p.get("marketplace")))

    velocity = algorithm_bsr_velocity(products)
    saturation = algorithm_saturation_score(products)
    price_el = algorithm_price_elasticity(products)
    gaps = algorithm_content_gaps(products)

    # Detect trad-pub anchors and compute self-pub-accessible score when present.
    trad_pub = detect_trad_pub_anchors(products)
    anchor_asins = {a["asin"] for a in trad_pub.get("anchors", [])}
    products_stripped = [p for p in products if p.get("asin") not in anchor_asins] if anchor_asins else products

    opp_score = algorithm_opportunity_score(
        velocity, saturation, price_el, gaps,
        trad_pub=trad_pub,
        products_stripped=products_stripped if anchor_asins else None,
    )

    ku_count = sum(1 for p in products if p.get("on_ku"))
    ku_pct = round(ku_count / len(products) * 100) if products else 0

    report = {
        "niche": niche,
        "marketplace_filter": marketplace,
        "marketplaces_present": marketplaces_present,
        "total_products_analyzed": len(products),
        "most_recent_scrape": most_recent,
        "stale_warning": stale_warning,
        "ku_penetration_pct": ku_pct,
        "algorithms": {
            "bsr_velocity": velocity,
            "saturation_score": saturation,
            "price_elasticity": price_el,
            "content_gaps": gaps,
            "opportunity_score": opp_score,
        },
        "generated_at": datetime.now().isoformat(),
    }

    # Save report
    slug = niche.replace(" ", "_").lower()
    if marketplace:
        slug += f"_{marketplace.lower()}"
    report_path = REPORTS_DIR / f"{slug}_analysis.json"
    report_path.write_text(json.dumps(report, indent=2))
    print(f"[Analyzer] Report saved: {report_path}")

    return report


def print_summary(report: dict):
    if "error" in report:
        print(f"\n[ERROR] {report['error']}")
        return

    opp = report["algorithms"]["opportunity_score"]
    sat = report["algorithms"]["saturation_score"]
    vel = report["algorithms"]["bsr_velocity"]
    pel = report["algorithms"]["price_elasticity"]
    gaps = report["algorithms"]["content_gaps"]

    print(f"\n{'='*60}")
    print(f"ANALYSIS COMPLETE -- {report['niche']}")
    if report.get("stale_warning"):
        print(f"  [!] {report['stale_warning']}")
    print(f"{'='*60}")
    print(f"  Products analyzed:  {report['total_products_analyzed']}")
    print(f"  KU penetration:     {report['ku_penetration_pct']}%")
    print(f"\n  OPPORTUNITY SCORE:  {opp['total']}/100 — {opp['verdict']}")
    print(f"    Demand:      {opp['demand_score']}/25  (best BSR: {opp['demand_best_bsr']})")
    print(f"    Saturation:  {opp['saturation_component']}/25  (sat score: {sat['saturation_score']}/10 — {sat['interpretation']})")
    print(f"    Price:       {opp['price_score']}/25  (market: {pel.get('market_character', 'unknown')})")
    print(f"    Content gap: {opp['gap_score']}/25")
    print(f"\n  SATURATION INPUTS:")
    print(f"    A (active sellers BSR<50k): {sat['A_active_sellers_under_50k']}")
    print(f"    B (new entrants 90d):       {sat['B_new_entrants_90d']}")
    print(f"    C (median reviews):         {sat['C_median_reviews']}")
    print(f"\n  PRICE ELASTICITY: {pel.get('market_character', 'insufficient data')}")
    if pel.get("median_price_gbp"):
        print(f"    Median:   £{pel['median_price_gbp']}")
        print(f"    Top5 avg: £{pel.get('top5_avg_price_gbp', 'n/a')}")
    print(f"\n  CATEGORY DAILY SALES (ESTIMATE):")
    print(f"    Top 10 sum: {vel['top10_category_daily_min_est']}–{vel['top10_category_daily_max_est']} sales/day")
    print(f"    {vel['note']}")
    print(f"\n  DOMINANT TITLE PATTERNS: {', '.join(gaps['dominant_patterns']) if gaps['dominant_patterns'] else 'none identified'}")
    print(f"  SPARSE PATTERNS (potential angle): {', '.join(gaps['sparse_patterns']) if gaps['sparse_patterns'] else 'none'}")

    # Trad-pub contamination summary
    tp = opp.get("trad_pub_contamination")
    if tp and tp.get("anchor_count", 0) > 0:
        print(f"\n  TRAD-PUB CONTAMINATION: {tp['anchor_count']} anchor(s) detected")
        for a in tp.get("anchors", [])[:3]:
            print(f"    {a['title'][:50]} — {a['review_count']:,} reviews (BSR {a['bsr']})")
        print(f"\n  FULL NICHE SCORE:    {opp['total']}/100 — {opp['verdict']}")
        sp_score = opp.get("self_pub_accessible_score")
        sp_verdict = opp.get("self_pub_accessible_verdict")
        if sp_score is not None:
            print(f"  SELF-PUB ACCESSIBLE: {sp_score}/100 — {sp_verdict}")
            print(f"  Use the self-pub accessible score for indie entry decision.")
    else:
        print(f"  Trad-pub contamination: none")

    print(f"\n  NEXT STEP: run brain {report['niche']}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analyzer.py \"niche name\" [marketplace]")
        print("  marketplace: UK or US (optional — analyzes all if omitted)")
        print("")
        print("  Calibration mode (run when you have real KDP sales data):")
        print("  python analyzer.py calibrate <BSR> <real_sales_per_day> [\"book title\"]")
        print("  Example: python analyzer.py calibrate 8500 4.2 \"Fix Your Gut for Good\"")
        sys.exit(1)

    if sys.argv[1].lower() == "calibrate":
        if len(sys.argv) < 4:
            print("Usage: python analyzer.py calibrate <BSR> <sales_per_day> [\"book title\"]")
            sys.exit(1)
        try:
            cal_bsr = int(sys.argv[2])
            cal_sales = float(sys.argv[3])
            cal_title = sys.argv[4] if len(sys.argv) > 4 else ""
        except ValueError:
            print("Error: BSR must be an integer, sales_per_day must be a float.")
            sys.exit(1)
        calibrate_bsr_velocity(cal_bsr, cal_sales, cal_title)
        sys.exit(0)

    niche_arg = sys.argv[1]
    marketplace_arg = sys.argv[2] if len(sys.argv) > 2 else None

    result = analyze(niche_arg, marketplace_arg)
    print_summary(result)
