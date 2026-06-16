# BookFactory Daily Brief — 2026-06-16

---

## ACTION REQUIRED (6 items — start with the price check)

### 1. 🔴 Verify £6.99 price on Cathedral Close — OVERDUE DAY 7 (revenue at risk)
Countdown Deal ended 2026-06-09. Price restoration **not manually confirmed for 7 days**. 7 days of potential revenue collected at an unknown price.
- Open amazon.co.uk → search ASIN `B0GZD1S8HF` → confirm price shows **£6.99**
- If wrong: KDP → Pricing → correct immediately
- Then update `books/untitled-cosy-mystery/pipeline-state.json` → `post_launch.countdown_deal_run: true`
- **Reply PRICE-CONFIRMED when done**

### 2. 🔴 Fix ASIN records — OVERDUE DAY 10
| Book | Problem |
|------|---------|
| Fix Your Gut for Good | `publishing.asin = null` — book treated as unpublished in all reports |
| Death in the Cathedral Close | `publishing.asin = AT25QRT6FPTE6` — 13 chars, **invalid ASIN** (must be 10 chars) |
Log into KDP Bookshelf, copy correct 10-char ASINs for both titles, update both `pipeline-state.json` files.
- **Reply ASINS-FIXED when done**

### 3. 🔴 Choose a scrape fix — OVERDUE DAY 10 (run 9 of 9 blocked; watchdog completely blind)
Every automated monitoring run has failed. Amazon returns 403 on every attempt. Rating, reviews, BSR, price — unmonitorable for both books. Pick one:
- **Reply MANUAL** — Open both ASINs in browser today, paste BSR/rating/reviews into `pipeline-state.json` (free, immediate)
- **Reply KEEPA** — Use Keepa Chrome extension for one-off BSR history export (free)
- **Reply ADD-API-KEY** — Subscribe to Keepa API or RainforestAPI for permanent automated fix

### 4. 🟠 Run ARC + Ads for Cathedral Close — 44 days post-launch, 0 reviews, 0 ads
`arc_emails_sent = 0`, `review_count = 0`, `ads_active = false`. Neither programme has been started. Run `arc-manager-agent` + `amazon-ads-agent` (can run in parallel).
- **Reply LAUNCH-ARC-ADS to approve both**

### 5. 🟡 Update Fix Your Gut pipeline-state.json — 58 days stale
File says `kdp_status = not_started`, `published = false` — book went live 2026-04-21. All downstream reports for this book are unreliable. Run `agent-log MODE 2` after fixing ASINs (item 2).
- **Reply UPDATE-STATE to approve**

### 6. 🟡 Cathedral Close — final_approval_score missing on a live book (integrity)
`human_gates.final_approval_passed: true` but `quality_scores.final_approval_score: null`. The 300-point gate score cannot be verified for this already-published book. Retrieve original report or re-run `final-approval-agent` to produce a verifiable score (must be ≥ 270).
- **Reply REGEN-SCORE to approve re-run**

---

## Live Book Status

*All scrapes failed — Amazon 403 (bot-block) on every attempt. Run 9 of 9 blocked (06-07 through 06-16; one missing run: 06-11). No metric values available. Last known values from pipeline-state.json:*

| Book | ASIN | Reviews | Rating | BSR | Price |
|------|------|---------|--------|-----|-------|
| Fix Your Gut for Good | B0GXYLWS1W (unconfirmed) | 0 | — | no baseline | SCRAPE FAILED |
| Death in the Cathedral Close | B0GZD1S8HF (state ASIN invalid) | 0 | — | no baseline | 🔴 UNVERIFIED — £6.99 unconfirmed since 2026-06-09 |

---

## Upcoming Deadlines (next 14 days: 2026-06-16 → 2026-06-30)

**No calendar-triggered deadlines fire in this window.**

| Date | Event |
|------|-------|
| 2026-07-19 | Fix Your Gut KDP Select term ends (33 days — renew or opt out) |
| 2026-08-01 | Cathedral Close KDP Select term ends (46 days); next Countdown window ~2026-09-01 |

*post-launch-agent for Cathedral Close is 44 days overdue — no hard date but treat as urgent.*

---

## Standing Gaps (open until explicitly resolved)

| Gap | Affects | Status |
|-----|---------|--------|
| No BookFunnel capture link live | Both books | Unresolved — no reader emails being collected |
| Category mismatch (Cozy > General?) | Cathedral Close | Unconfirmed — treat as flagged until KDP categories verified |
| Missing watchdog run 2026-06-11 | Monitoring | Check automated scheduling config |

---

## Intelligence

- **gut-health niche: STALE** — last harvested 2026-05-13 (33 days, 19 days overdue). Must run locally with Playwright: `harvest gut-health ; analyse opportunities gut-health`
- **cozy-mystery:** Fresh (14 days). **vagus-nerve:** Fresh (12 days).
- **ALGO-INTELLIGENCE-CANDIDATE.md:** Not found — Job 4 (monthly) has not filed a candidate.

---

## All Clear

Nothing is green today. 6 action items open, 3 escalated to day 7–10. Start with the price check — 2 minutes, protects 7 days of potentially wrong-priced revenue.

---

*Sources: watchdog-2026-06-16.md · milestones-2026-06-16.md · intel-freshness-2026-06-15.md · integrity-2026-06-14.md · ALGO candidate: not found. No metrics invented.*
