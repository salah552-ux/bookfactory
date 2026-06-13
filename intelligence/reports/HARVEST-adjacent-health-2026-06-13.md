# Harvest — Adjacent-Health Niches (first pass)
**Date:** 2026-06-13 · **Source:** Amazon.co.uk Books search, live (Playwright browser_evaluate) · **Marketplace:** UK
**Harvested by:** master orchestrator (data collection only). **Scoring + BUILD decision DEFERRED** — see caveats.

> **What this is / isn't.** This is SEARCH-PAGE competition data: result count, sponsored density, how many competitors are established (have ratings/reviews), and the top review counts (a proxy for entrenchment / review barrier). It measures **competition/barrier, NOT demand.** Demand (BSR distribution / sales velocity) lives on product pages and was NOT harvested here — a low-barrier niche with no demand is still a dead niche. The opportunity SCORE and the BUILD/NO-BUILD decision require the analyzer (BSR niche-health screen) + opus-brain on the full data, run on a confirmed strong model. Nothing here is a build recommendation. No invented numbers — every figure is from the live search results on the date above.

## Data (per term, 22 results/page)

| Niche term | Results | Sponsored | Established (have ratings) | Top review counts (entrenchment) | Barrier read |
|---|---|---|---|---|---|
| anti-inflammatory diet | 22 | 6 | 22 / 22 | 16,937 · 2,348 · 220 · 157 · 135 | **HIGH (saturated)** — huge review wall |
| low FODMAP diet | 22 | 6 | 21 / 22 | 3,297 · 1,710 · 1,426 · 1,306 · 849 | **HIGH (saturated)** — mature, entrenched |
| histamine intolerance | 22 | ~4 | partial (smaller players) | (small; not fully captured term 1) | **MODERATE** — recheck review counts |
| perimenopause gut health | 22 | 6 | 17 / 22 | 733 · 88 · 38 · 35 · 35 | **MODERATE-LOW** — one incumbent, thin tail; *gut-specific menopause* angle lightly contested (e.g. "Menopause Gut Health" 27, "The Menopause Gut" 31) |
| bloating relief | 22 | 6 | 14 / 22 (8 unestablished) | 129 · 48 · 45 · 30 · 12 | **LOW** — thin review wall, many new/unestablished entrants |

## First-pass barrier ranking (lower barrier = easier for a new entrant, demand unverified)
1. **bloating relief** — lowest review wall; a third of page-1 results have no reviews at all
2. **perimenopause / menopause GUT angle** — general perimenopause is busier, but the gut-specific sub-angle is thinly contested
3. **histamine intolerance** — moderate; needs a review-count recapture to rank confidently
4. **low FODMAP diet** — saturated, high barrier
5. **anti-inflammatory diet** — most saturated, very high barrier

## Required before any BUILD decision (No-Assumptions lock)
- [ ] Product-page **BSR harvest** for the low-barrier candidates → the analyzer's niche-health screen (#1 / #20 / #100 BSR distribution) to confirm there is real **demand**, not just low competition.
- [ ] Reader-language harvest (review mining) for the chosen candidate → for the avatar + blurb.
- [ ] `analyzer` + `opus-brain` opportunity scoring on the full dataset, **run on a confirmed strong model** (the scoring/judgment is model-sensitive; this session flagged a possible model fallback).
- [ ] opus-brain logs its Stage-00 prediction via `calibration_engine.py add-prediction` (loop now wired).

## Note
The harvest path is **confirmed working** as of 2026-06-13 — Amazon.co.uk search was reachable and `browser_evaluate` extracted clean structured data (titles, ratings, review counts, sponsored flags). This clears the [BLOCKED] status that previously stalled niche harvesting.
