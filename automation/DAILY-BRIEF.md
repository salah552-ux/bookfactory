# BookFactory Daily Brief — 2026-06-12

---

## ACTION REQUIRED (5 items)

| # | Book | Issue | Reply to approve |
|---|------|-------|-----------------|
| 1 | Cathedral Close | **Price unverified — Countdown Deal ended 3 days ago (2026-06-09). £6.99 restoration NOT confirmed. Every day wrong price = lost revenue.** Open amazon.co.uk → search B0GZD1S8HF → confirm £6.99. If not: KDP → Pricing → fix now. | reply **PRICE-OK** (or report what you see) |
| 2 | Cathedral Close | **Stage 10-postlaunch stuck 40 days. Zero ads ever run. Zero ARC emails. Zero reviews.** Ranking window is closing. Invoke `post-launch-agent` + `ams-optimizer-agent` in parallel today. | reply **LAUNCH-ADS** |
| 3 | Fix Your Gut | **State file unreconciled for 52 days** — shows `kdp_status: not_started`, `published: false` despite book live since 2026-04-21. KDP Select term, ASIN, and all post-launch tracking are unrecorded. | reply **RECONCILE** |
| 4 | Both books | **ASIN discrepancies** — Fix Your Gut: ASIN null in state file (watchdog shows B0GXYLWS1W). Cathedral Close: state has 13-char invalid ASIN `AT25QRT6FPTE6` (should be 10 chars, watchdog shows B0GZD1S8HF). Log into KDP Bookshelf and confirm correct ASINs. | reply **ASINS-FIXED** |
| 5 | Both books | **Automated scraping blocked 6 consecutive days** (Amazon 403). No BSR, rating, or review data obtainable. Pick a resolution: (A) manual browser check today, (B) Keepa API key, (C) Keepa Chrome extension one-off export. | reply **KEEPA** / **MANUAL** / **API** |

---

## Live Book Status

Scraping has failed on every watchdog run since 2026-06-07 (5 consecutive runs, all HTTP 403). No live metrics available.

| Book | ASIN (watchdog) | Rating | Reviews | BSR | Price |
|------|-----------------|--------|---------|-----|-------|
| Fix Your Gut for Good | B0GXYLWS1W | — | — | — | — |
| Death in the Cathedral Close | B0GZD1S8HF | — | — | — | **🔴 UNVERIFIED post-deal** |

*Last recorded (state files): both books at 0 reviews, null rating, no BSR baseline.*
*Note: No watchdog report filed for 2026-06-11 — check scheduling config.*

---

## Upcoming Deadlines (next 14 days)

None triggered. Upcoming watch-list items:

| Date | Book | Event |
|------|------|-------|
| 2026-07-05 | Fix Your Gut | KDP Select re-enrollment decision window opens (term ends 2026-07-19, 37 days away) |
| 2026-07-18 | Cathedral Close | KDP Select re-enrollment decision window opens (term ends ~2026-08-01, 50 days away) |

*Also: Cathedral Close countdown deal eligibility window is currently open. If the June deal ran (unconfirmed), next window opens ~2026-07-09. If it did not run, you can still schedule now (KDP needs 3 days' notice).*

---

## Standing Gaps

These repeat every day until resolved:

- **BookFunnel link not live — both books.** Lead-magnet funnel inactive. Set up link → update `bookfunnel_link_live: true` in each state file.
- **Cathedral Close category mismatch unverified.** Current placement: `Cozy > General` — may hurt discoverability. Check KDP dashboard; reclassify if wrong (e.g., `Cozy > Animal`, `Traditional Detective > British`). Open since 2026-06-10.
- **Third book discovered:** `the-dust-between-seconds` — Stage 03-writing `in_progress` for 43 days. Not in sentinel scope. Recommend adding to future scans.

---

## Intelligence

- Job 3 (intel-freshness) report not found for this week.
- Job 4 (ALGO-INTELLIGENCE-CANDIDATE.md) not found — no new algo candidate this month.
- Job 5 (integrity) report not found for this week.

---

## All Clear

Nothing is all clear today. 5 action items pending; top priority is confirming Cathedral Close price restoration (item 1) and unblocking 40 days of stalled post-launch activity (item 2).
