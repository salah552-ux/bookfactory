# BookFactory Daily Brief — 2026-06-07

---

## ACTION REQUIRED

| # | Severity | Item | Approve with |
|---|----------|------|-------------|
| 1 | **URGENT** | **Cathedral Close Countdown Deal ends 2026-06-09 (2 days).** Confirm deal is still active on KDP dashboard, queue price restoration to GBP 6.99 for 09-Jun, then reply to unlock pipeline-state update. | reply **COUNTDOWN** |
| 2 | HIGH | Fix Your Gut pipeline-state.json has never been updated since publication (47 days stale). File still shows `kdp_status: not_started`, `published: false`. Run `agent-log MODE 2` to update all publishing fields. | reply **UPDATE-GUT** |
| 3 | HIGH | Cathedral Close 10-postlaunch stage stuck for 35 days: ads not active, A+ content not live, ARC emails sent = 0, review count = 0. Run `post-launch-agent` → `ams-optimizer-agent` → `aplus-content-agent`. | reply **POSTLAUNCH** |
| 4 | MEDIUM | ASIN mismatch on both books — watchdog manifest and pipeline-state disagree. Monitoring is blind until reconciled. Confirm correct ASINs and update state files. | reply **RECONCILE** |
| 5 | MEDIUM | Cathedral Close possible category mismatch (Cozy > General). Verify KDP categories match market-intelligence recommendations; update if wrong. | reply **CATEGORIES** |
| 6 | MEDIUM | BookFunnel reader-magnet link missing on both books (standing gap, repeats daily). | reply **BOOKFUNNEL** |

---

## Live Book Status

> Amazon returned HTTP 403 on all scrape attempts today — both ASINs could not be fetched. No metrics below are invented; all values are from state files only.

| Book | ASIN (watchdog) | ASIN (state file) | Rating | Reviews | BSR |
|------|----------------|-------------------|--------|---------|-----|
| Fix Your Gut for Good | B0GXYLWS1W | **null** (mismatch) | — | 0 (baseline, never updated) | — |
| Death in the Cathedral Close | B0GZD1S8HF | **AT25QRT6FPTE6** (mismatch) | — | 0 (baseline, never updated) | — |

Countdown Deal: Cathedral Close deal window 2026-06-02 → 2026-06-09 (day 5 of 7). Price alert suppressed.

---

## Upcoming Deadlines (next 14 days)

| Date | Book | Event |
|------|------|-------|
| **2026-06-09** | Cathedral Close | Countdown Deal ends — price must revert to GBP 6.99 |

Nothing else fires in the next 14 days. Next KDP Select renewals: Fix Your Gut 2026-07-19 (42 days), Cathedral Close 2026-08-01 (55 days).

---

## Standing Gaps

| Gap | Affected | Status |
|-----|----------|--------|
| BookFunnel reader-magnet link not live | Both books | Open — repeats daily until resolved |
| Cathedral Close category mismatch (Cozy > General) | Cathedral Close | Unverified — needs KDP dashboard check |
| ASIN discrepancies (watchdog vs state files) | Both books | Blocking daily monitoring |

---

## Intelligence

- **Job 3 (intel-freshness):** Report not found for today — runs Mondays only; last run expected 2026-06-02.
- **Job 5 (integrity):** Report not found for today — runs Sundays only; last run expected 2026-06-01.
- **Job 4 (ALGO-INTELLIGENCE-CANDIDATE.md):** File not found — no new algo candidate this month.

---

## All Clear

Nothing is all-clear today — 6 action items open, 1 urgent deadline in 48 hours.

---

*Sources: watchdog-2026-06-07.md (Job 1), milestones-2026-06-07.md (Job 2). Jobs 3, 4, 5 reports absent — noted above, not fabricated.*
