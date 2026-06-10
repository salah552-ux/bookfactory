# BookFactory Milestone Sentinel — 2026-06-10
## ACTION REQUIRED (6 items)

Generated: 2026-06-10 | All calculations use today's date.
Books scanned: Fix Your Gut for Good · Death in the Cathedral Close (slug: untitled-cosy-mystery)

---

## Book 1: Fix Your Gut for Good
**File slug:** fix-your-gut-for-good | **File status:** Stage 6 complete, `kdp_status: not_started`
**Anchor:** live 2026-04-21 · KDP Select ends 2026-07-19 · countdown eligible from 2026-05-21 · next window ~2026-08-18

---

### Rule 1 — KDP Select term ends within 14 days
**ok** — Anchor: term ends 2026-07-19 (file field: `null` — file wins on conflicts, field absent so anchor used).
Days until 2026-07-19: **39 days**. Threshold not met.
> Watch-list: decision window opens **2026-07-05** (14 days before end). KDP Select auto-renews unless opted out — set a calendar reminder.

### Rule 2 — Countdown Deal ends within 3 days
**ok** — No Countdown Deal scheduled or active per file.

### Rule 3 — Countdown-eligibility window opens within 7 days
**ok** — Eligibility already opened 2026-05-21 (anchor; 20 days ago). Next Countdown window ~2026-08-18 (anchor). Days until: **69 days**. Threshold not met.

### Rule 4 — bookfunnel_link_live == false
**FIRED** — Field absent from state file; anchor confirms `false`. BookFunnel lead-magnet link is not live.
Standing GAP — repeats every sentinel run until resolved.
> **Action:** Activate BookFunnel link, then update state file with `bookfunnel_link_live: true` via agent-log MODE 2.

### Rule 5 — category_mismatch_flagged == true
**ok** — Field not set and no anchor concern for this book.

### Rule 6 — Stage in_progress > 14 days ago
**ok** — No stage is currently `in_progress`. Stage 07-publishing: `not_started`.

### Rule 7 — Human gate false on live book that should be done
**FIRED** — Critical state integrity failure. Anchor records the book as live since **2026-04-21** (50 days ago). File shows:
- `kdp_status: "not_started"` (should be `"live"`)
- `live_date: null` (should be `"2026-04-21"`)
- `published: false` (should be `true`)
- `ai_questionnaire_confirmed: false` (should be `true` if published)
- `kdp_select: null`, `countdown_deal_eligible_from: null`, `kdp_select_term_end`: missing

The state file was never reconciled after KDP go-live. All post-launch tracking (KDP Select term, countdown eligibility, ASIN, ads) is unrecorded and untrackable.
> **Action required (urgent):** Reconcile pipeline-state.json immediately:
> - `kdp_status: "live"`, `live_date: "2026-04-21"`
> - `published: true`, `ai_questionnaire_confirmed: true`
> - `kdp_select: true`, `kdp_select_term_end: "2026-07-19"` (anchor)
> - `countdown_deal_eligible_from: "2026-05-21"` (anchor)
> - Add ASIN if known. Invoke agent-log MODE 2.

---

**Fix Your Gut for Good — FIRED: 2 / 7 rules**

---

## Book 2: Death in the Cathedral Close
**File slug:** untitled-cosy-mystery | **File status:** Stage 10 in_progress | `live_date: 2026-05-03`
**Anchor:** Countdown Deal 2026-06-02–2026-06-09 · bookfunnel_link_live=false · category_mismatch may be true

---

### Rule 1 — KDP Select term ends within 14 days
**ok** — `kdp_select: true`, `live_date: "2026-05-03"`. Computed term end (90 days from live date): **2026-08-01**. Days until: **52 days**. Threshold not met.
> Watch-list: re-enrollment decision needed by **2026-07-18** (14 days before computed end).

### Rule 2 — Countdown Deal ends within 3 days
**FIRED** — Anchor: deal ran **2026-06-02 to 2026-06-09**. Today (2026-06-10) is **1 day past end date**. File shows `countdown_deal_run: false`. The deal either was not activated or state was not updated post-deal.
> **Action required (same day):** Verify in KDP dashboard whether the deal ran.
> - If it **ran**: update `countdown_deal_run: true` in state file via agent-log MODE 2.
> - If it **did not run**: the promotion window has lapsed. Next eligible window: **2026-07-09** (30 days after 2026-06-09 per KDP rules). Plan and schedule now.

### Rule 3 — Countdown-eligibility window opens within 7 days
**ok** — `countdown_deal_eligible_from: "2026-06-02"` (file). Eligibility already open. If deal just ended, next window opens **2026-07-09** (29 days away). Threshold not met.

### Rule 4 — bookfunnel_link_live == false
**FIRED** — Field absent from state file; anchor confirms `false`. BookFunnel lead-magnet link is not live for a book 38 days post-launch.
Standing GAP — repeats every sentinel run until resolved.
> **Action:** Activate BookFunnel link, then update state file with `bookfunnel_link_live: true` via agent-log MODE 2.

### Rule 5 — category_mismatch_flagged == true
**FIRED (unverified — requires investigation)** — Field absent from file; anchor states "may be true (Cozy category — GAP)". KDP upload log shows categories: `Cozy > General` + `British & Irish > Contemporary`. `Cozy > General` is a high-traffic but low-precision placement that may hurt discoverability.
> **Action required:** Log into KDP dashboard and verify current category placement. Update state file:
> - If correct: add `category_mismatch_flagged: false`.
> - If wrong: reclassify to a more targeted subcategory (e.g., `Cozy > Animal`, `Traditional Detective > British`), add `category_mismatch_flagged: true`.
> Update via agent-log MODE 2.

### Rule 6 — Stage in_progress > 14 days ago
**FIRED** — Stage `10-postlaunch` has been `in_progress` since **2026-05-03** (38 days ago). Threshold: 14 days. No progress updates recorded. Key post-launch metrics all at zero:
- `ads_active: false` (38 days post-launch, no ads ever started)
- `aplus_content_live: false`
- `arc_emails_sent: 0` (no ARC outreach)
- `review_count: 0`
> **Action required:** Stage is stuck. Invoke `post-launch-agent` + `ams-optimizer-agent` (parallel). Run `arc-manager-agent` if ARC list exists. Update pipeline-state.json via agent-log MODE 2.

### Rule 7 — Human gate false on live book that should be done
**ok** — All six human gates are `true` for this live book: `market_intelligence_approved`, `blueprint_approved`, `cover_approved`, `final_approval_passed`, `ai_questionnaire_confirmed`, `published`.
> Advisory: `final_approval_score: null` in file despite `final_approval_passed: true`. Score should be recorded for series tracking. Update via agent-log MODE 2 when convenient.

---

**Death in the Cathedral Close — FIRED: 4 / 7 rules**

---

## Full Summary

| Rule | Fix Your Gut | Cathedral Close |
|------|-------------|----------------|
| 1 — KDP Select ends <14 days | ok (39 days to 2026-07-19) | ok (52 days to 2026-08-01) |
| 2 — Countdown Deal ends <3 days | ok (no deal) | **FIRED** — deal ended 2026-06-09 (1 day ago), state=unrun |
| 3 — Countdown eligibility opens <7 days | ok (already open, next ~2026-08-18) | ok (already open, next 2026-07-09) |
| 4 — bookfunnel_link_live==false | **FIRED** — standing GAP | **FIRED** — standing GAP |
| 5 — category_mismatch_flagged==true | ok | **FIRED** — unverified, needs KDP check |
| 6 — Stage in_progress >14 days | ok (no in_progress stage) | **FIRED** — 10-postlaunch stuck 38 days |
| 7 — Human gate false on live book | **FIRED** — state file never reconciled | ok |
| **Total fired** | **2** | **4** |

**Grand total: 6 rules fired across 2 books.**

---

### Most Urgent Item
**Cathedral Close — Countdown Deal window closed 2026-06-09 (yesterday)**
Anchor scheduled deal 2026-06-02 to 2026-06-09. File shows `countdown_deal_run: false`. If deal was not activated, the window is gone. Next window: **2026-07-09**. Verify in KDP dashboard **today**.

---

### Standing GAPs (persist until explicitly resolved)
- [ ] **Both books:** `bookfunnel_link_live == false` — lead-magnet funnel not live
- [ ] **Fix Your Gut:** State file unreconciled — book may be live 50 days with zero post-launch tracking
- [ ] **Cathedral Close:** Countdown Deal status unknown — verify today
- [ ] **Cathedral Close:** Category mismatch unverified — needs KDP dashboard check
- [ ] **Cathedral Close:** Stage 10 stuck 38 days — no ads, no ARC, 0 reviews

---

### KDP Select Watch-list (not yet fired — upcoming gates)
| Book | Term End | Days Remaining | Alert Fires | Decision Deadline |
|------|----------|---------------|-------------|-------------------|
| Fix Your Gut for Good | 2026-07-19 (anchor) | 39 days | 2026-07-05 | Opt out or confirm re-enroll by 2026-07-19 |
| Death in the Cathedral Close | 2026-08-01 (computed) | 52 days | 2026-07-18 | Opt out or confirm re-enroll by 2026-08-01 |

> Note: Fix Your Gut KDP Select term end (2026-07-19) is from anchor only — file field is null. Reconcile state file to confirm.
> Note: Cathedral Close KDP Select term end (2026-08-01) is computed as live_date + 90 days — not recorded in state file. Consider adding `kdp_select_term_end` field.
