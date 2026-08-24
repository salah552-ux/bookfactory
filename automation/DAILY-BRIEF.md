# BookFactory Daily Brief — 2026-08-24

---

## ACTION REQUIRED

**9 items need a decision. Top priorities:**

| # | Item | Age | What to do |
|---|------|-----|------------|
| 1 | **Fix Your Gut — KDP Select expired** | 36 days overdue (2026-07-19) | Log in to KDP, confirm re-enrollment, write the new term-end date to pipeline-state.json. Reply **CONFIRM** once done. |
| 2 | **Fix Your Gut — Countdown Deal window OPEN** | 6 days unused (opened 2026-08-18) | Blocked by #1 above. Once Select is confirmed active, schedule the Countdown Deal in KDP NOW. Every day is a burned promo slot. Reply **SCHEDULE** once booked. |
| 3 | **Cathedral Close — KDP Select term unknown** | ~23 days overdue (est. 2026-08-01) | No `kdp_select_term_end` field exists. Log in to KDP, confirm status, add the field. Reply **CONFIRM** once done. |
| 4 | **Cathedral Close — Category mismatch** | 78 days open | Log in to KDP, change category to Cozy Mystery + British & Irish + Amateur Sleuths. Set `category_mismatch_flagged: false`. Reply **FIXED** once done. |
| 5 | **h-pylori-recovery-plan — 0 post-launch monitoring** | Live 67 days, stage 10 never started | CRITICAL (6th consecutive week). Run `post-launch-tracker` with current KDP dashboard data. Reply **TRACKED** once done. |
| 6 | **Both books — BookFunnel links missing** | 85 days open | Create BookFunnel pages (Gut Trigger Cheat Sheet + Cathedral Close magnet), add links to back matter, rebuild + re-upload EPUBs. Reply **BOOKFUNNEL** once live. |
| 7 | **Stages stuck (3 books)** | 78–88 days | Invoke `pipeline-orchestrator` on fix-your-gut (stages 08+10) and cathedral-close (stage 10). |
| 8 | **Amazon egress blocked** | Ongoing | Allow-list `www.amazon.co.uk` in the scheduled routine's network egress policy so the watchdog can check live BSR and reviews. |
| 9 | **ALGO-INTELLIGENCE candidate not promoted** | Drafted 2026-08-01 | Review `intelligence/ALGO-INTELLIGENCE-CANDIDATE.md` (1 HIGH + 1 MEDIUM finding vs v1.2). Merge approved entries into ALGO-INTELLIGENCE.md and bump version. Reply **PROMOTED** once done. |

---

## Live Book Status

**Watchdog scrape FAILED today** — `www.amazon.co.uk` is blocked at the egress proxy. No live BSR or review data was retrieved for either book. Last known values only:

| Book | ASIN | Reviews | BSR (last recorded) | Note |
|------|------|---------|---------------------|------|
| Fix Your Gut for Good | B0GXYLWS1W | 0 | unknown | Live since 2026-04-21 |
| Death in the Cathedral Close | B0GZD1S8HF | 0 | 1,370,902 (2026-06-02 only) | Live since 2026-05-03 |

*(h-pylori-recovery-plan — B0H5TZTPRT — live since 2026-06-17; no monitoring active.)*

---

## Upcoming Deadlines (next 14 days)

- **Countdown Deal window for Fix Your Gut:** OPEN NOW — closes at end of current KDP Select term (~2026-10-17 if already renewed). Schedule immediately.
- **Cathedral Close Countdown Deal window:** Unknown — dependent on KDP Select term resolution (item #3 above).

No other hard deadlines logged in the next 14 days.

---

## Standing Gaps

| Gap | Book(s) | Age | Status |
|-----|---------|-----|--------|
| BookFunnel page not built | Fix Your Gut + Cathedral Close | 85 days | Unchanged |
| Cathedral Close category mismatch | Cathedral Close | 78 days | Unchanged |
| Author Central UK/US + Goodreads not live | Fix Your Gut | 125 days | No action recorded |
| h-pylori stage 10 not started | h-pylori-recovery-plan | 67 days live | No action (6 weeks flagged) |

---

## Intelligence

- **ALL 4 niches are stale** (78–103 days). 11th consecutive week failing the 14-day freshness threshold.
  - gut-health: 103 days | cozy-mystery: 84 days | vagus-nerve: 82 days | h-pylori-gut-health: 78 days
  - Must be run in a **local Playwright session** — the cloud agent cannot execute harvests.
  - Priority order: `harvest gut-health` → `harvest cozy-mystery` → `harvest vagus-nerve` → `harvest h-pylori-gut-health`

- **New ALGO-INTELLIGENCE candidate available** (drafted 2026-08-01, not yet promoted). Covers Jun 12 → Aug 1 vs current v1.2. Contains 1 HIGH-confidence and 1 MEDIUM-confidence finding. See `intelligence/ALGO-INTELLIGENCE-CANDIDATE.md`. Needs Architect review and merge. *(See ACTION REQUIRED #9.)*

---

## All Clear

Nothing is all clear today. 9 open actions, 19 unresolved state contradictions across 5 books, 1 CRITICAL revenue asset unmonitored for 67 days.

---

*Sources: watchdog-2026-08-24.md · milestones-2026-08-24.md · intel-freshness-2026-08-24.md · integrity-2026-08-23.md · ALGO-INTELLIGENCE-CANDIDATE.md*
*Generated: 2026-08-24 (automated Job 6)*
