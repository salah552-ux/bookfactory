# BookFactory Milestone Sentinel — 2026-07-27

## ACTION REQUIRED (7 items fired across both books)

---

## Fix Your Gut for Good (ASIN B0GXYLWS1W)

Today: 2026-07-27 | Live: 2026-04-21 | KDP Select term: 2026-04-21 → 2026-07-19

| Rule | Condition | Status | Detail |
|------|-----------|--------|--------|
| 1 | KDP Select term ends within 14 days | **FIRED — OVERDUE** | Term ended 2026-07-19 — **8 days ago**. Re-enrollment or exit decision has not been recorded. Auto-renewal may have fired; confirm KDP dashboard immediately. |
| 2 | Countdown Deal ends within 3 days | ok | No active Countdown Deal this term (both free promo slots were used Apr/May). |
| 3 | Countdown-eligibility window opens within 7 days | ok | Next window ~2026-08-18 (22 days away, requires new Select term re-enrollment). |
| 4 | bookfunnel_link_live == false | **FIRED — standing GAP** | `post_launch.bookfunnel_link_live = false`. Flag has been set since 2026-05-31. Lead magnet and email sequence are written; BookFunnel link is the only missing piece. |
| 5 | category_mismatch_flagged | ok | Field absent from this book's file — no mismatch flagged. |
| 6a | Stage 08-products in_progress >14 days stale | **FIRED** | Status `in_progress` since ~2026-05-28. Last system update: 2026-06-07 (50 days stale). BookFunnel link is the open blocker. Stage should either be closed or updated. |
| 6b | Stage 10-postlaunch in_progress >14 days stale | **FIRED** | Status `in_progress`. Last system update: 2026-06-07 (50 days stale). APLUS-CONTENT.md written; Brand Registry enrollment and A+ submission still pending. No weekly metric data logged since baseline. |
| 7 | Human gate false on live book | ok | All nine human gates are `true`. |

**Fired this book: 4**

---

## Death in the Cathedral Close (ASIN B0GZD1S8HF)

Today: 2026-07-27 | Live: 2026-05-03 | KDP Select: enrolled; term-end date absent from file

| Rule | Condition | Status | Detail |
|------|-----------|--------|--------|
| 1 | KDP Select term ends within 14 days | **UNKNOWN — needs Architect input** | `kdp_select_term_end` field is absent from pipeline-state.json. Standard 90-day term from 2026-05-03 would expire ~2026-08-01 (5 days away), but this is not confirmed in the file. Architect must confirm the actual term end date from KDP dashboard and add it to the file. If the term is expiring around 2026-08-01, a re-enrollment decision is needed this week. |
| 2 | Countdown Deal ends within 3 days | ok | Countdown Deal ran 2026-06-02 → 2026-06-09 (ended 48 days ago). |
| 3 | Countdown-eligibility window opens within 7 days | ok | Next window date unknown (depends on Select term re-enrollment). |
| 4 | bookfunnel_link_live == false | **FIRED — standing GAP** | `post_launch.bookfunnel_link_live = false`. Flag set since 2026-05-31. |
| 5 | category_mismatch_flagged == true | **FIRED — standing GAP** | `post_launch.category_mismatch_flagged = true`. Note: metadata corrected locally 2026-06-07 but KDP live categories unconfirmed — blocked on Architect KDP login. Correct target: Amateur Sleuth + Cozy + British & Irish > Mystery & Thrillers. |
| 6 | Stage 10-postlaunch in_progress >14 days stale | **FIRED** | Status `in_progress` since 2026-05-03. File last_updated: 2026-05-28 (60 days stale). No weekly metrics logged since the W5 entry on 2026-06-02. |
| 7 | Human gate false on live book | ok | All six recorded human gates are `true`. |

**Fired this book: 3 (plus 1 unknown requiring urgent clarification)**

---

## Summary

| Book | Fired | Most urgent |
|------|-------|-------------|
| Fix Your Gut for Good | 4 | KDP Select term ENDED 2026-07-19 — 8 days overdue, check KDP dashboard now |
| Death in the Cathedral Close | 3 + 1 unknown | KDP Select term-end date unknown — likely ~2026-08-01 (5 days); confirm today |

**Total fired: 7**

**Single most urgent item:** Fix Your Gut for Good — KDP Select term ended 2026-07-19, 8 days ago. Re-enrollment or exit decision is overdue. If KDP auto-enrolled a new 90-day term, note it in pipeline-state.json; if not, a decision is needed immediately (Select exit or manual re-enroll). The next Countdown Deal window (~2026-08-18) depends on this being resolved correctly.
