# BookFactory Milestone Sentinel — 2026-06-07

## ACTION REQUIRED (6 items)

Generated: 2026-06-07 | Pipeline version: 2.0

---

## Fix Your Gut for Good (`fix-your-gut-for-good`)

**File:** `books/fix-your-gut-for-good/pipeline-state.json`
**File last_updated:** 2026-04-19
**File kdp_status:** `not_started` | **File live_date:** `null`
**Known anchor:** live 2026-04-21

> ⚠️ STATE FILE IS STALE — last_updated is 2026-04-19, known anchor reports book went live 2026-04-21 (47 days ago). The file has never been updated post-publication. All date-dependent rules below are evaluated against file values per hard rule; known anchor dates are cited where the file shows null.

---

### Rule 1 — KDP Select term ends within 14 days
**Status: ok**
- File `kdp_select`: `null` | File `live_date`: `null` → cannot compute term-end from file alone.
- Known anchor: KDP Select term ends 2026-07-19 → **42 days away** — outside the 14-day alert window.
- Action: no immediate action required; sentinel will fire around 2026-07-05 if state file is updated before then.

### Rule 2 — Countdown Deal ends within 3 days
**Status: ok**
- No active countdown deal referenced in file or known anchors for this title.

### Rule 3 — Countdown eligibility window opens within 7 days
**Status: ok**
- File `countdown_deal_eligible_from`: `null` → unknown from file.
- Known anchor: eligible from 2026-05-21 (already opened, 17 days ago); next window ~2026-08-18 (**72 days away**).
- No window opening imminent.

### Rule 4 — bookfunnel_link_live == false
**Status: FIRED — STANDING GAP**
- Field `bookfunnel_link_live` is absent from pipeline-state.json. Known anchor flags this as `false`.
- **Action required:** Create BookFunnel reader magnet link and set `bookfunnel_link_live: true` in pipeline-state.json.
- Repeats every sentinel run until fixed.

### Rule 5 — category_mismatch_flagged == true
**Status: ok**
- Field absent from file; known anchors do not flag a category mismatch for this title.

### Rule 6 — Stage in_progress older than 14 days
**Status: ok**
- No stages show `in_progress` in the file (all are `complete` or `not_started`).

### Rule 7 — Human gate false on live book
**Status: FIRED**
- Known anchor confirms book went live 2026-04-21 (47 days ago).
- File shows: `published: false`, `kdp_status: "not_started"`, `ai_questionnaire_confirmed: false`, stage `07-publishing: not_started`.
- **Pipeline-state.json has never been updated post-publication.** All publishing fields are pre-live placeholders.
- **Action required:** Run `agent-log` MODE 2 to update: `kdp_status → live`, `live_date → 2026-04-21`, `kdp_select → true`, `countdown_deal_eligible_from → 2026-05-21`, `published → true`, `ai_questionnaire_confirmed → true`, stage `07-publishing → complete`.

---

**Fix Your Gut fired rules: 2 (Rule 4, Rule 7)**

---

## Death in the Cathedral Close (`untitled-cosy-mystery`)

**File:** `books/untitled-cosy-mystery/pipeline-state.json`
**File last_updated:** 2026-05-03
**File kdp_status:** `live` | **File live_date:** `2026-05-03`
**Known anchor:** live 2026-05-03 ✓ (matches file)

> ⚠️ STATE FILE IS PARTIALLY STALE — last_updated is 2026-05-03. The Countdown Deal period (2026-06-02 to 2026-06-09) started after the last file update; `countdown_deal_run` remains `false` in the file and several post-launch fields are unset.

---

### Rule 1 — KDP Select term ends within 14 days
**Status: ok**
- File `kdp_select`: `true` | File `live_date`: `2026-05-03`
- KDP Select term = 90 days from enrollment → term end: **2026-08-01**
  - Calculation: 2026-05-03 + 90 days = 2026-08-01
- Days until term end: **55 days** — outside the 14-day alert window.
- Action: no immediate action; sentinel will fire around 2026-07-18.

### Rule 2 — Countdown Deal ends within 3 days
**Status: FIRED — URGENT**
- File `countdown_deal_eligible_from`: `2026-06-02` | File `countdown_deal_run`: `false` (stale — file predates deal start).
- Known anchor: Countdown Deal running **2026-06-02 to 2026-06-09**.
- Today: 2026-06-07 → deal end: **2026-06-09** → **2 days remaining**.
- **Action required by 2026-06-09:**
  - Confirm deal is still active on KDP dashboard.
  - Queue post-deal price restoration reminder.
  - Update pipeline-state.json: `countdown_deal_run: true`, `last_updated` timestamp.
  - Run `post-launch-agent` to capture deal-period sales metrics.

### Rule 3 — Countdown eligibility window opens within 7 days
**Status: ok**
- File `countdown_deal_eligible_from`: `2026-06-02` — window opened 5 days ago (2026-06-07 − 2026-06-02 = 5 days past).
- Window is already active; no new window opening imminent.

### Rule 4 — bookfunnel_link_live == false
**Status: FIRED — STANDING GAP**
- Field `bookfunnel_link_live` is absent from pipeline-state.json. Known anchor flags this as `false`.
- **Action required:** Create BookFunnel reader magnet link and set `bookfunnel_link_live: true` in pipeline-state.json.
- Repeats every sentinel run until fixed.

### Rule 5 — category_mismatch_flagged == true
**Status: FIRED**
- Field absent from file. Known anchor: "category_mismatch_flagged may be true (Cozy category — GAP)".
- KDP upload log notes: "Categories: Cozy > General + British & Irish > Contemporary."
- **Action required:** Verify current KDP category assignments match market-intelligence recommendations. If mismatch confirmed, update categories via KDP dashboard and set `category_mismatch_flagged: false` once resolved.

### Rule 6 — Stage in_progress older than 14 days
**Status: FIRED**
- Stage `10-postlaunch`: `in_progress` | `started_at`: `2026-05-03`
- Days in_progress: **35 days** (threshold: 14 days).
- Post-launch activities not tracked: `ads_active: false`, `aplus_content_live: false`, `arc_emails_sent: 0`, `review_count: 0`, `countdown_deal_run: false` (stale).
- **Action required:** Run `post-launch-agent` to assess 35-day performance, activate AMS ads, and update all post_launch fields. Then run `ams-optimizer-agent` and `aplus-content-agent` to execute outstanding stage tasks.

### Rule 7 — Human gate false on live book
**Status: ok**
- All human_gates are `true` for a published book: `market_intelligence_approved`, `blueprint_approved`, `cover_approved`, `final_approval_passed`, `ai_questionnaire_confirmed`, `published` — all `true`. ✓
- Note: `quality_scores.final_approval_score` is `null` despite `final_approval_passed: true`. This score should be backfilled (expected: 270+/300).

---

**Cathedral Close fired rules: 4 (Rule 2, Rule 4, Rule 5, Rule 6)**

---

## Summary

| # | Book | Rule | Severity | Deadline |
|---|------|------|----------|----------|
| 1 | Cathedral Close | Rule 2 — Countdown Deal ends | URGENT | 2026-06-09 (2 days) |
| 2 | Fix Your Gut | Rule 7 — State file stale / published=false | HIGH | Immediate |
| 3 | Cathedral Close | Rule 6 — 10-postlaunch stuck 35 days | HIGH | Immediate |
| 4 | Cathedral Close | Rule 5 — category_mismatch_flagged | MEDIUM | Verify + fix |
| 5 | Fix Your Gut | Rule 4 — bookfunnel_link_live=false | MEDIUM | Standing GAP |
| 6 | Cathedral Close | Rule 4 — bookfunnel_link_live=false | MEDIUM | Standing GAP |

**Total fired: 6**
**Most urgent: Cathedral Close Countdown Deal ends 2026-06-09 — 2 days remaining. Confirm deal active and queue price restoration.**

---

*Sentinel computed from pipeline-state.json files only. Date arithmetic based on file field values; known anchors cited where file fields are null. Next sentinel run recommended: 2026-06-09 (deal-end day).*
