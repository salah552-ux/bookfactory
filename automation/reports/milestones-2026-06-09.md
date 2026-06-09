# Milestone Sentinel — 2026-06-09
## ACTION REQUIRED (6 items)

Generated: 2026-06-09 | Source files authoritative (files win over known anchors where values differ)

---

## BOOK 1 — Fix Your Gut for Good
**Slug:** `fix-your-gut-for-good` | **File:** `books/fix-your-gut-for-good/pipeline-state.json`

> **FILE vs ANCHOR CONFLICT — FILE WINS:**
> Known anchors stated: live 2026-04-21, KDP Select ends 2026-07-19, countdown eligible 2026-05-21.
> File records: `kdp_status = "not_started"`, `live_date = null`, `kdp_select = null`, `countdown_deal_eligible_from = null`.
> Per sentinel rules, the file is authoritative. All KDP Select and countdown date calculations are therefore unknown.

| Rule | Condition | Status | Detail |
|------|-----------|--------|--------|
| Rule 1 | KDP Select term ends within 14 days | **unknown — needs Architect input** | `kdp_select = null` in file; term end cannot be computed. Anchor claimed 2026-07-19 but file does not confirm enrollment. |
| Rule 2 | Active Countdown Deal ends within 3 days | ok | No active deal; book not live per file. |
| Rule 3 | Countdown eligibility window opens within 7 days | **unknown — needs Architect input** | `countdown_deal_eligible_from = null` in file. Anchor claimed 2026-05-21 but file does not confirm. |
| Rule 4 | `bookfunnel_link_live == false` | **FIRED — standing GAP** | Field absent from pipeline-state.json; anchor confirms false. No BookFunnel link live. |
| Rule 5 | `category_mismatch_flagged == true` | ok | Book not live per file; not applicable. |
| Rule 6 | Stage in_progress > 14 days without update | ok | No stage currently in_progress. |
| Rule 7 | Human gate false on live book | ok | Book not live per file (`published = false`). Not applicable. |

### Additional Observations (not formal rule violations but actionable)

**PIPELINE STALL — 51 days since final approval with no publishing action.**
- `final-approval-agent` completed: 2026-04-19 (score 274/300, conditional pass)
- Stage 07-publishing: `not_started`
- `ai_questionnaire_confirmed`: false
- `published`: false
- Days elapsed since conditional pass: **51 days**
- This book is ready to publish but has never entered the publishing stage. Requires human decision to unblock. Run `pre-launch-agent` → `kdp-upload-agent`.

---

## BOOK 2 — Death in the Cathedral Close
**Slug:** `untitled-cosy-mystery` | **File:** `books/untitled-cosy-mystery/pipeline-state.json`

> Note: No file exists at `books/death-in-the-cathedral-close/`; book found at `books/untitled-cosy-mystery/pipeline-state.json` (`book_title: "Death in the Cathedral Close"`).

| Rule | Condition | Status | Detail |
|------|-----------|--------|--------|
| Rule 1 | KDP Select term ends within 14 days | ok | `kdp_select = true`; `live_date = 2026-05-03`; computed term end = 2026-08-01 (+90 days). Days until: **53 days**. Re-enrollment decision due ~2026-07-18. |
| Rule 2 | Active Countdown Deal ends within 3 days | ok | `countdown_deal_run = false` in file — no deal is currently active per pipeline state. |
| Rule 3 | Countdown eligibility window opens within 7 days | **FIRED — OVERDUE, IMMEDIATE ACTION** | `countdown_deal_eligible_from = 2026-06-02` (7 days ago). `countdown_deal_run = false`. Known anchor indicated a deal window of 2026-06-02 → 2026-06-09. **TODAY (2026-06-09) is the last day of that anchor window.** Deal has not been initiated in the pipeline. Launch countdown deal immediately or the current eligibility window expires. |
| Rule 4 | `bookfunnel_link_live == false` | **FIRED — standing GAP** | Field absent from pipeline-state.json; anchor confirms false. No BookFunnel link live 37 days after launch. |
| Rule 5 | `category_mismatch_flagged == true` | **UNVERIFIED — needs review** | Field absent from file. Anchor flagged "may be true (Cozy category — GAP)". KDP agent log confirms categories: "Cozy > General + British & Irish > Contemporary." Verify these map correctly to KDP Browse Nodes for cosy mystery. Cannot confirm as FIRED without file value, but cannot clear without verification. |
| Rule 6 | Stage in_progress > 14 days without update | **FIRED — stage stuck** | Stage `10-postlaunch` status = `in_progress`, `started_at = 2026-05-03`. Top-level `last_updated = 2026-05-03`. Days elapsed: **37 days** (threshold: 14). No post-launch agent has run. `ads_active = false`, `aplus_content_live = false`, `arc_emails_sent = 0`, `review_count = 0`. Stage is active but completely inactive. |
| Rule 7 | Human gate false on live book | ok | All human gates = true (`market_intelligence_approved`, `blueprint_approved`, `cover_approved`, `final_approval_passed`, `ai_questionnaire_confirmed`, `published`). |

---

## BOOK 3 — The Dust Between Seconds *(bonus — found in repo, outside original scope)*
**Slug:** `the-dust-between-seconds` | **File:** `books/the-dust-between-seconds/pipeline-state.json`

| Rule | Condition | Status | Detail |
|------|-----------|--------|--------|
| Rule 6 | Stage in_progress > 14 days without update | **FIRED — stage stuck** | Stage `03-writing` status = `in_progress`, `started_at = 2026-04-30`. `last_updated = 2026-05-01`. Days elapsed: **39 days** (threshold: 14). Only 1 of 32 target chapters approved; `word_count_current = 3,200` of 95,000 target. Writing has stalled. |

---

## FIRED RULES SUMMARY

| Priority | Book | Rule | Action | Deadline |
|----------|------|------|--------|----------|
| 1 — CRITICAL | Cathedral Close | Rule 3 | Initiate Countdown Deal — window opened 7 days ago, anchor end date is TODAY | **2026-06-09** |
| 2 — HIGH | Cathedral Close | Rule 6 | Run `post-launch-agent` — stage stuck 37 days; zero post-launch activity | Immediate |
| 3 — HIGH | Fix Your Gut | (stall) | Unblock publishing — 51 days since final approval, stage 07 never started | Immediate |
| 4 — MEDIUM | Cathedral Close | Rule 4 | Create and link BookFunnel lead magnet page | Standing GAP |
| 5 — MEDIUM | Fix Your Gut | Rule 4 | Create and link BookFunnel lead magnet page | Standing GAP |
| 6 — MEDIUM | Cathedral Close | Rule 5 | Verify KDP category Browse Nodes for cosy mystery match | Needs review |
| 7 — LOW | Dust Between Seconds | Rule 6 | Resume writing — stage stuck 39 days, 1/32 chapters done | Immediate |

**Total fired (confirmed):** 5  
**Unverified / needs Architect input:** 3 (Fix Your Gut KDP Select dates ×2, Cathedral Close category flag ×1)

---

## MOST URGENT ITEM

**Cathedral Close Countdown Deal — deadline TODAY 2026-06-09**

The eligibility window opened 2026-06-02. The anchor window closes 2026-06-09. `countdown_deal_run = false` in the pipeline state. If this deal is to run in the current eligibility window, it must be initiated today. After today the next window cannot open until 30 days have elapsed from the end of this window (KDP Select rule: deals must be separated by at least 30 days within a 90-day term).

Action: open KDP Bookshelf → Promotions → Countdown Deal → set dates → confirm. Then run `post-launch-agent` and update pipeline-state.json.
