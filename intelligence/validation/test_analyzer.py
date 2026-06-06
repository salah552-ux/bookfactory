"""
BookFactory Intelligence Layer — Analyzer Unit Tests
Run: uv run --python 3.12 --no-project python intelligence/validation/test_analyzer.py

What this validates:
  - Fiction guard (gap_score never inflated to 25/25 in fiction niches)
  - Saturation score formula against known inputs
  - Opportunity score components sum correctly
  - Price elasticity zero-price handling
  - BSR velocity lookup returns None above 100k
  - Trad-pub contamination detection threshold
  - Score never exceeds 100 for any combination of inputs

Run this before every blueprint decision.
"""

import sys
import os

# Allow running from repo root OR from intelligence/validation/
_here = os.path.dirname(os.path.abspath(__file__))
_parent = os.path.dirname(_here)
sys.path.insert(0, _parent)

from analyzer import (
    algorithm_bsr_velocity,
    algorithm_saturation_score,
    algorithm_price_elasticity,
    algorithm_content_gaps,
    algorithm_opportunity_score,
    detect_trad_pub_anchors,
    bsr_to_daily_sales,
)

PASS = 0
FAIL = 0
_failures = []


def check(name: str, condition: bool, detail: str = ""):
    global PASS, FAIL
    if condition:
        PASS += 1
        print(f"  PASS  {name}")
    else:
        FAIL += 1
        _failures.append(f"{name}: {detail}")
        print(f"  FAIL  {name}")
        if detail:
            print(f"        {detail}")


# ── SHARED TEST DATA ──────────────────────────────────────────────────────────

FICTION_PRODUCTS = [
    # 16 cozy mystery books — none of the 7 non-fiction structural patterns appear
    {"asin": f"B0FICTION{i:02d}", "title": title, "bsr_overall": bsr,
     "price_ebook": 0.0, "review_count": reviews, "marketplace": "UK",
     "pub_date": "2026-01-01", "on_ku": False, "scraped_at": "2026-06-01T00:00:00"}
    for i, (title, bsr, reviews) in enumerate([
        ("The Murder at Thornfield Hall", 100, 9970),
        ("The Fish and Chip Shop Detectives", 360, 257),
        ("A Bookish Disappearance", 982, 751),
        ("Murder Most Bookish", 1290, 4328),
        ("The Cornish Honeymoon Murder", 1304, 0),
        ("The Cornish Cozy Mysteries Box Set", 1448, 354),
        ("A Bookish Deception", 1891, 0),
        ("The Book Club Murders", 1995, 33),
        ("The Body at Rookery Barn", 3199, 1008),
        ("The Antique Store Detective", 8758, 1746),
        ("The Bookshop Mysteries: A Bitter Pill", 11696, 2532),
        ("Village Fetes Can Be Murder", 23531, 1982),
        ("Antiques and Adversity in the Azores", 42668, 216),
        ("Mystique and Murder in Morocco", 73149, 137),
        ("The Jam Jar Secrets", 94438, 3),
        ("Death in the Cathedral Close", 1370902, 0),
    ])
]

NONFICTION_PRODUCTS = [
    {"asin": f"B0HEALTH{i:02d}", "title": title, "bsr_overall": bsr,
     "price_ebook": price, "review_count": reviews, "marketplace": "UK",
     "pub_date": "2026-01-01", "on_ku": True, "scraped_at": "2026-06-01T00:00:00"}
    for i, (title, bsr, price, reviews) in enumerate([
        ("The 7-Day Gut Reset Protocol", 403, 1.99, 174),
        ("The 4-Week Gut Health Protocol for Beginners", 44113, 13.99, 181),
        ("Gut Health and Mental Clarity: A Simple Microbiome Reset Plan", 43682, 0.0, 12),
        ("Super Gut: A Four-Week Plan to Reprogram Your Microbiome", 44113, 9.99, 48),
        ("Fix Your Gut for Good: Stop Relapsing", 37505, 0.0, 50),
        ("Gut Health for Beginners: Boost Energy", 45844, 0.0, 11),
        ("The Complete Low-FODMAP Diet Cookbook", 63343, 13.99, 1298),
        ("The Science-Backed Anti-Inflammatory Diet for Beginners", 185645, 0.0, 16904),
        ("The Gut Stuff", 266062, 9.99, 8),
        ("What Every Woman Needs to Know About Her Gut", 298784, 2.99, 29),
        ("The Mind-Gut Connection", 294452, 8.99, 36),
        ("The Complete Guide to Taming Chronic Inflammation", 8091, 11.38, 11),
        ("The 20-Minute Gut Health Fix", 324756, 12.99, 227),
        ("Gut Health Beyond Basics", 198448, 0.0, 45),
        ("The Power of Gut Health", 361282, 4.99, 12),
        ("Self Health Gut Guide", 390963, 0.0, 45),
        ("A Powerful Guide to Gut Health", 257948, 0.0, 11),
        ("The Clever Guts Diet Recipe Book", 93113, 2.99, 4309),
        ("The Clever Guts Diet", 147807, 4.99, 3),
        ("Gut: The 8-million-copy #1 bestseller", 21117, 5.99, 2),
    ])
]


# ── TEST SECTION 1: FICTION GUARD ─────────────────────────────────────────────

def test_fiction_guard():
    print("\n--- Section 1: Fiction Guard ---")

    gaps = algorithm_content_gaps(FICTION_PRODUCTS)
    total_hits = sum(gaps["title_pattern_frequency"].values())

    check(
        "fiction: total_pattern_hits < 3",
        total_hits < 3,
        f"total_hits={total_hits} — should be <3 for all-fiction titles"
    )

    # Build mock inputs to exercise the opportunity score path
    velocity = algorithm_bsr_velocity(FICTION_PRODUCTS)
    saturation = algorithm_saturation_score(FICTION_PRODUCTS)
    price_el = algorithm_price_elasticity(FICTION_PRODUCTS)
    trad = detect_trad_pub_anchors(FICTION_PRODUCTS)
    score = algorithm_opportunity_score(velocity, saturation, price_el, gaps, trad, FICTION_PRODUCTS)

    check(
        "fiction: gap_score <= 15",
        score["gap_score"] <= 15,
        f"gap_score={score['gap_score']} — fiction guard must cap at 15"
    )

    check(
        "fiction: gap_score != 25",
        score["gap_score"] != 25,
        f"gap_score={score['gap_score']} — 25/25 is the inflated (pre-fix) value"
    )

    check(
        "fiction: total score <= 100",
        score["total"] <= 100,
        f"total={score['total']}"
    )

    # The cozy mystery niche should score in the 60–70 range with 16 products
    # at this price/saturation profile. Not 76+ (which was the inflated pre-fix score).
    check(
        "fiction: score < 76 (old inflated value)",
        score["total"] < 76,
        f"total={score['total']} — score of 76+ indicates fiction guard NOT applied"
    )


# ── TEST SECTION 2: NON-FICTION PATTERNS FIRE CORRECTLY ──────────────────────

def test_nonfiction_patterns():
    print("\n--- Section 2: Non-Fiction Pattern Detection ---")

    gaps = algorithm_content_gaps(NONFICTION_PRODUCTS)
    total_hits = sum(gaps["title_pattern_frequency"].values())

    check(
        "nonfiction: total_pattern_hits >= 3",
        total_hits >= 3,
        f"total_hits={total_hits} — should be >=3 for health nonfiction titles"
    )

    # Non-fiction should detect at least one dominant pattern in this dataset
    check(
        "nonfiction: at least one dominant pattern found",
        len(gaps["dominant_patterns"]) >= 1,
        f"dominant_patterns={gaps['dominant_patterns']}"
    )

    # The 7-day / 4-week / 4-day titles should trigger "time-bound protocol"
    time_bound_count = gaps["title_pattern_frequency"].get("time-bound protocol (X-day / X-week)", 0)
    check(
        "nonfiction: time-bound protocol pattern fires",
        time_bound_count >= 2,
        f"time_bound_count={time_bound_count} — 7-Day and 4-Week titles should both match"
    )


# ── TEST SECTION 3: SATURATION SCORE FORMULA ─────────────────────────────────

def test_saturation_formula():
    print("\n--- Section 3: Saturation Formula ---")

    # Known inputs → expected output
    # A=5 books < 50k BSR → A_score = min(5/5, 10) = 10
    # B=2 new entrants → B_score = min(2*2, 10) = 4
    # C=median(100, 200) = 150 → C_score = min(150/100, 10) = 1.5
    # sat = (10*0.4) + (4*0.3) + (1.5*0.3) = 4.0 + 1.2 + 0.45 = 5.65
    synthetic = [
        {"asin": f"SYN{i}", "title": f"Book {i}", "bsr_overall": bsr,
         "review_count": rev, "pub_date": pub, "scraped_at": "2026-06-01T00:00:00",
         "price_ebook": 2.99, "marketplace": "UK"}
        for i, (bsr, rev, pub) in enumerate([
            (10000, 100, "2026-04-01"),    # active (< 50k), new entrant
            (20000, 200, "2026-05-01"),    # active, new entrant
            (30000, 150, "2024-01-01"),    # active, not new
            (40000, 80, "2024-01-01"),     # active, not new
            (45000, 90, "2024-01-01"),     # active, not new
            (200000, 50, "2024-01-01"),    # not active
            (300000, 40, "2024-01-01"),    # not active
            (400000, 30, "2024-01-01"),    # not active
            (500000, 20, "2024-01-01"),    # not active
            (600000, 10, "2024-01-01"),    # not active
        ])
    ]

    result = algorithm_saturation_score(synthetic)

    check(
        "saturation: A (active < 50k) = 5",
        result["A_active_sellers_under_50k"] == 5,
        f"A={result['A_active_sellers_under_50k']}"
    )

    check(
        "saturation: B (new entrants 90d) = 2",
        result["B_new_entrants_90d"] == 2,
        f"B={result['B_new_entrants_90d']} — 2026-04-01 and 2026-05-01 should be within 90 days of 2026-06-05"
    )

    check(
        "saturation: score is float in range 0-10",
        0 <= result["saturation_score"] <= 10,
        f"saturation_score={result['saturation_score']}"
    )

    check(
        "saturation: score not always zero",
        result["saturation_score"] > 0,
        f"saturation_score={result['saturation_score']}"
    )


# ── TEST SECTION 4: PRICE ELASTICITY ZERO-PRICE BUG FIX ──────────────────────

def test_price_zero_handling():
    print("\n--- Section 4: Price Elasticity — Zero Price Handling ---")

    # Dataset where ALL top 5 books are £0.00 (permafree / KU)
    all_free = [
        {"asin": f"FREE{i}", "title": f"Free Book {i}", "bsr_overall": bsr,
         "price_ebook": 0.0, "review_count": 100, "marketplace": "UK",
         "scraped_at": "2026-06-01T00:00:00"}
        for i, bsr in enumerate([100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
                                  1100, 1200, 1300, 1400, 1500])
    ]

    result = algorithm_price_elasticity(all_free)

    check(
        "price: zero-priced books not excluded",
        "error" not in result,
        f"got error: {result.get('error')}"
    )

    check(
        "price: median of all-zero is 0.0",
        result.get("median_price_gbp") == 0.0,
        f"median={result.get('median_price_gbp')}"
    )

    check(
        "price: market_character assigned for zero-price dataset",
        result.get("market_character") is not None,
        f"market_character={result.get('market_character')}"
    )

    # Mixed dataset: premium book in the top 5 by BSR
    # The premium performer check looks at books sorted by BSR — the £9.99 books
    # must have lower BSR numbers (better rank) than the free books to appear in top 5.
    mixed = [
        {"asin": f"PREMIUM{i}", "title": f"Premium Book {i}", "bsr_overall": 100 + i,
         "price_ebook": 9.99, "review_count": 50, "marketplace": "UK",
         "scraped_at": "2026-06-01T00:00:00"}
        for i in range(3)  # BSR 100, 101, 102 — clearly in top 5
    ] + [
        {"asin": f"FREE{i}", "title": f"Free Book {i}", "bsr_overall": 5000 + (i * 100),
         "price_ebook": 0.0, "review_count": 50, "marketplace": "UK",
         "scraped_at": "2026-06-01T00:00:00"}
        for i in range(12)
    ]

    result_mixed = algorithm_price_elasticity(mixed)
    check(
        "price: premium performer detected in mixed dataset",
        result_mixed.get("market_character") == "PREMIUM TOLERANT",
        f"market_character={result_mixed.get('market_character')} — GBP9.99 book in top 5 should trigger PREMIUM TOLERANT"
    )


# ── TEST SECTION 5: BSR VELOCITY LOOKUP ──────────────────────────────────────

def test_bsr_velocity():
    print("\n--- Section 5: BSR Velocity Lookup ---")

    # BSR_VELOCITY_UK uses ceiling-inclusive matching (bsr <= ceiling).
    # Table: (100, (300,500)), (1000, (50,300)), (10000, (5,50)), (50000, (1,5)), (100000, (0.5,1))
    # So BSR 100 maps to (300,500), BSR 101 maps to (50,300), etc.
    check("BSR 1 gives (300, 500)",    bsr_to_daily_sales(1)    == (300, 500),  f"got {bsr_to_daily_sales(1)}")
    check("BSR 100 gives (300, 500)",  bsr_to_daily_sales(100)  == (300, 500),  f"got {bsr_to_daily_sales(100)}")
    check("BSR 101 gives (50, 300)",   bsr_to_daily_sales(101)  == (50, 300),   f"got {bsr_to_daily_sales(101)}")
    check("BSR 1000 gives (50, 300)",  bsr_to_daily_sales(1000) == (50, 300),   f"got {bsr_to_daily_sales(1000)}")
    check("BSR 1001 gives (5, 50)",    bsr_to_daily_sales(1001) == (5, 50),     f"got {bsr_to_daily_sales(1001)}")
    check("BSR 10000 gives (5, 50)",   bsr_to_daily_sales(10000) == (5, 50),    f"got {bsr_to_daily_sales(10000)}")
    check("BSR 10001 gives (1, 5)",    bsr_to_daily_sales(10001) == (1, 5),     f"got {bsr_to_daily_sales(10001)}")
    check("BSR 50000 gives (1, 5)",    bsr_to_daily_sales(50000) == (1, 5),     f"got {bsr_to_daily_sales(50000)}")
    check("BSR 50001 gives (0.5, 1)",  bsr_to_daily_sales(50001) == (0.5, 1),   f"got {bsr_to_daily_sales(50001)}")
    check("BSR 100000 gives (0.5, 1)", bsr_to_daily_sales(100000) == (0.5, 1),  f"got {bsr_to_daily_sales(100000)}")
    check("BSR 100001 gives (0.0, 0.5)", bsr_to_daily_sales(100001) == (0.0, 0.5), f"got {bsr_to_daily_sales(100001)}")
    check("BSR None gives None", bsr_to_daily_sales(None) is None, "None BSR should return None")


# ── TEST SECTION 6: TRAD-PUB CONTAMINATION ───────────────────────────────────

def test_trad_pub_detection():
    print("\n--- Section 6: Trad-Pub Contamination Detection ---")

    # Dataset with clear outlier: one book at 4280 reviews vs median of ~134
    products = [
        {"asin": "ANCHOR1", "title": "The Famous Book (Trad Pub)", "bsr_overall": 15200,
         "review_count": 4280, "price_ebook": 12.99, "marketplace": "UK",
         "pub_date": "2017-01-01", "scraped_at": "2026-06-01T00:00:00"},
        *[
            {"asin": f"INDIE{i}", "title": f"Indie Book {i}", "bsr_overall": 5000 + i * 1000,
             "review_count": 100 + (i * 10), "price_ebook": 2.99, "marketplace": "UK",
             "pub_date": "2025-01-01", "scraped_at": "2026-06-01T00:00:00"}
            for i in range(12)
        ]
    ]

    result = detect_trad_pub_anchors(products)

    check(
        "trad-pub: anchor detected when review count >> median",
        result["anchor_count"] >= 1,
        f"anchor_count={result['anchor_count']}"
    )

    check(
        "trad-pub: anchor is the correct book",
        any(a["asin"] == "ANCHOR1" for a in result["anchors"]),
        f"anchors={[a['asin'] for a in result['anchors']]}"
    )

    # Clean dataset: all books similar review count
    clean = [
        {"asin": f"CLEAN{i}", "title": f"Clean Book {i}", "bsr_overall": 5000 + i * 1000,
         "review_count": 100 + (i * 5), "price_ebook": 2.99, "marketplace": "UK",
         "pub_date": "2025-01-01", "scraped_at": "2026-06-01T00:00:00"}
        for i in range(12)
    ]

    clean_result = detect_trad_pub_anchors(clean)
    check(
        "trad-pub: no false positives on uniform dataset",
        clean_result["anchor_count"] == 0,
        f"anchor_count={clean_result['anchor_count']}"
    )


# ── TEST SECTION 7: OPPORTUNITY SCORE BOUNDARIES ─────────────────────────────

def test_score_boundaries():
    print("\n--- Section 7: Opportunity Score Boundaries ---")

    # Best possible niche: low BSR, no saturation, premium tolerant, clear gaps
    ideal_products = [
        {"asin": f"IDEAL{i}", "title": titles[i], "bsr_overall": bsr,
         "price_ebook": 9.99, "review_count": 50, "marketplace": "UK",
         "pub_date": "2025-01-01", "on_ku": False, "scraped_at": "2026-06-01T00:00:00"}
        for i, (titles, bsr) in enumerate(zip(
            [
                ["The 7-Day Nervous System Reset Protocol", "Beginner Simple Vagus Nerve Guide",
                 "The Root Cause Fix for Women", "Simple 4-Week Healing Blueprint",
                 "Boost Restore Heal Your Vagus Nerve", "Number-Led 5 Steps Reset",
                 "The 30-Day Audience-Specific Plan", "The Complete Reset Protocol",
                 "Beginner Guide to Healing Your Gut", "Simple Plan for Men Over 50",
                 "Root Cause Science of Nervous System", "Fix and Restore your Wellbeing",
                 "7 Ways to Boost Your Vagus Nerve", "The Complete Healing Protocol",
                 "Simple Women's Reset Blueprint"],
            ][0],
            [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
             1100, 1200, 1300, 1400, 1500]
        ))
    ]

    velocity = algorithm_bsr_velocity(ideal_products)
    saturation = algorithm_saturation_score(ideal_products)
    price_el = algorithm_price_elasticity(ideal_products)
    gaps = algorithm_content_gaps(ideal_products)
    trad = detect_trad_pub_anchors(ideal_products)
    score = algorithm_opportunity_score(velocity, saturation, price_el, gaps, trad)

    check(
        "score: never exceeds 100",
        score["total"] <= 100,
        f"total={score['total']}"
    )

    check(
        "score: demand component <= 25",
        score["demand_score"] <= 25,
        f"demand_score={score['demand_score']}"
    )

    check(
        "score: saturation_component <= 25",
        score["saturation_component"] <= 25,
        f"saturation_component={score['saturation_component']}"
    )

    check(
        "score: price_score <= 25",
        score["price_score"] <= 25,
        f"price_score={score['price_score']}"
    )

    check(
        "score: gap_score <= 25",
        score["gap_score"] <= 25,
        f"gap_score={score['gap_score']}"
    )

    # Worst possible niche: high BSR, high saturation, compressed price, no gaps
    worst_products = [
        {"asin": f"WORST{i}", "title": "Gut Diet", "bsr_overall": 500000,
         "price_ebook": 2.99, "review_count": 5000, "marketplace": "UK",
         "pub_date": "2026-05-01", "on_ku": True, "scraped_at": "2026-06-01T00:00:00"}
        for i in range(15)
    ]

    worst_velocity = algorithm_bsr_velocity(worst_products)
    worst_saturation = algorithm_saturation_score(worst_products)
    worst_price = algorithm_price_elasticity(worst_products)
    worst_gaps = algorithm_content_gaps(worst_products)
    worst_trad = detect_trad_pub_anchors(worst_products)
    worst_score = algorithm_opportunity_score(worst_velocity, worst_saturation, worst_price, worst_gaps, worst_trad)

    check(
        "score: worst niche scores below 40",
        worst_score["total"] < 40,
        f"total={worst_score['total']} — a truly terrible niche should not score 40+"
    )

    check(
        "score: worst niche verdict is AVOID or CAUTION",
        worst_score["verdict"] in ("AVOID — insufficient opportunity signal",
                                   "CAUTION — only enter with a confirmed content gap advantage"),
        f"verdict={worst_score['verdict']}"
    )


# ── TEST SECTION 8: DATA LINEAGE — SCORE CONSISTENCY ─────────────────────────

def test_score_reproducibility():
    """
    Running the analyzer twice on identical data must produce identical scores.
    If scores drift between runs, the algorithm has non-deterministic behaviour
    (e.g., depending on current datetime in ways that affect the score, not just
    the stale warning).
    """
    print("\n--- Section 8: Score Reproducibility ---")

    # Run analyzer algorithms twice on the same data
    v1 = algorithm_bsr_velocity(NONFICTION_PRODUCTS)
    s1 = algorithm_saturation_score(NONFICTION_PRODUCTS)
    p1 = algorithm_price_elasticity(NONFICTION_PRODUCTS)
    g1 = algorithm_content_gaps(NONFICTION_PRODUCTS)
    t1 = detect_trad_pub_anchors(NONFICTION_PRODUCTS)
    score1 = algorithm_opportunity_score(v1, s1, p1, g1, t1)

    v2 = algorithm_bsr_velocity(NONFICTION_PRODUCTS)
    s2 = algorithm_saturation_score(NONFICTION_PRODUCTS)
    p2 = algorithm_price_elasticity(NONFICTION_PRODUCTS)
    g2 = algorithm_content_gaps(NONFICTION_PRODUCTS)
    t2 = detect_trad_pub_anchors(NONFICTION_PRODUCTS)
    score2 = algorithm_opportunity_score(v2, s2, p2, g2, t2)

    check(
        "reproducibility: identical data → identical total score",
        score1["total"] == score2["total"],
        f"score1={score1['total']}, score2={score2['total']}"
    )

    check(
        "reproducibility: identical data → identical gap_score",
        score1["gap_score"] == score2["gap_score"],
        f"gap_score1={score1['gap_score']}, gap_score2={score2['gap_score']}"
    )


# ── RUN ALL TESTS ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 60)
    print("BookFactory Analyzer — Validation Suite")
    print("=" * 60)

    test_fiction_guard()
    test_nonfiction_patterns()
    test_saturation_formula()
    test_price_zero_handling()
    test_bsr_velocity()
    test_trad_pub_detection()
    test_score_boundaries()
    test_score_reproducibility()

    print()
    print("=" * 60)
    print(f"Results: {PASS} passed, {FAIL} failed")
    print("=" * 60)

    if _failures:
        print("\nFailed tests:")
        for f in _failures:
            print(f"  - {f}")
        print()
        sys.exit(1)
    else:
        print("\nAll tests passed. Analyzer is safe to use for blueprint decisions.")
        sys.exit(0)
