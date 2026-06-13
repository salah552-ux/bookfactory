# BookFactory Daily Brief — 2026-06-13

---

## ACTION REQUIRED (5 items)

| # | Book | Issue | Days open | Reply to approve |
|---|------|-------|-----------|-----------------|
| 1 | Cathedral Close | **Post-deal price unverified** — Countdown Deal ended 2026-06-09; £6.99 restoration not confirmed | 4 | reply **PRICECHECK** to confirm you've verified in browser |
| 2 | Cathedral Close | **Post-launch stuck 41 days** — no ads ever run, 0 ARC emails, 0 reviews; ranking window closing | 41 | reply **LAUNCH** to invoke `post-launch-agent` + `ams-optimizer-agent` |
| 3 | Fix Your Gut | **State file unreconciled** — book live since 2026-04-21 (53 days) but `kdp_status: not_started`, `published: false`, ASIN null; all post-launch tracking blind | 53 | reply **RECONCILE** to fix state via agent-log |
| 4 | Both books | **ASIN discrepancies** — Fix Your Gut: ASIN null in state; Cathedral Close: invalid 13-char ASIN `AT25QRT6FPTE6` (should be 10 chars) | 7 | reply **FIXASIN** after pulling correct values from KDP dashboard |
| 5 | Both books | **BookFunnel links not live** — lead-magnet funnel inactive on both titles | standing | reply **FUNNEL** to activate |

---

## Live Book Status

> Watchdog run 6 of 6 — Amazon.co.uk returned HTTP 403 on all attempts. No live metrics available for either book. Data below is last recorded only.

| Book | ASIN (watchdog) | Rating | Reviews | BSR | Price | Note |
|------|----------------|--------|---------|-----|-------|------|
| Fix Your Gut for Good | B0GXYLWS1W | — | 0 (last recorded) | no baseline | — | State shows unpublished; likely live since 2026-04-21 |
| Death in the Cathedral Close | B0GZD1S8HF | — | 0 (last recorded) | no baseline | 🔴 UNVERIFIED post-deal | Countdown Deal ended 2026-06-09 |

Monitoring is effectively blind until scraping is resolved. Options: (A) paste BSR/rating manually from browser into pipeline-state.json, (B) Keepa API, (C) Keepa Chrome extension one-off export.

Missing watchdog run: 2026-06-11 — check scheduler config.

---

## Upcoming Deadlines (next 14 days)

Nothing hard-deadline fires in the next 14 days. Watch-list:

| Book | Event | Date | Days away |
|------|-------|------|-----------|
| Cathedral Close | Countdown Deal window is **open now** — schedule before term ends | 2026-08-01 term end | 49 days |
| Fix Your Gut | KDP Select re-enroll **alert fires** (14-day warning) | 2026-07-05 | 22 days |
| Cathedral Close | KDP Select re-enroll alert fires | 2026-07-18 | 35 days |

---

## Standing Gaps

- [ ] **Both books** — BookFunnel lead-magnet link not live (`bookfunnel_link_live: false`)
- [ ] **Fix Your Gut** — State file never reconciled after go-live (53 days); all KDP Select, ASIN, and post-launch fields missing
- [ ] **Cathedral Close** — Countdown Deal June run status unknown; if it ran, update state; if not, schedule before 2026-08-01 (window open now)
- [ ] **Cathedral Close** — Category mismatch unverified (`Cozy > General` may hurt discoverability); check KDP dashboard, open since 2026-06-10
- [ ] **Cathedral Close** — Stage 10-postlaunch stuck 41 days with zero commercial activity
- [ ] **Third book** — `the-dust-between-seconds` (Stage 03-writing `in_progress` 44 days) is not in sentinel scope; recommend adding

---

## Intelligence

- **Job 3 (intel-freshness):** Report not found for today — weekly Monday report; next expected 2026-06-16.
- **Job 5 (integrity):** Report not found for today — weekly Sunday report; next expected 2026-06-14.
- **Job 4 (ALGO-INTELLIGENCE-CANDIDATE.md):** File not found — monthly; none issued yet or not committed.

---

## All Clear

Nothing is green. Five rules fired across two books; scraping has been blind for 7 days; most urgent item is Cathedral Close 41-day post-launch stall with zero revenue activity.

---

*Sources: watchdog-2026-06-13.md · milestones-2026-06-13.md · intel-freshness: not found · integrity: not found · ALGO-INTELLIGENCE-CANDIDATE.md: not found*
