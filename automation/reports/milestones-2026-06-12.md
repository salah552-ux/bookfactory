# BookFactory Milestone Sentinel — 2026-06-12
## ACTION REQUIRED (5 items)

Generated: 2026-06-12 | All calculations use today's date.
Books scanned: Fix Your Gut for Good · Death in the Cathedral Close (slug: untitled-cosy-mystery)

---

## Book 1: Fix Your Gut for Good
**File slug:** fix-your-gut-for-good | **File status:** Stage 6 complete, `kdp_status: not_started`
**Anchor:** live 2026-04-21 · KDP Select ends 2026-07-19 · countdown eligible from 2026-05-21 · next window ~2026-08-18

---

### Rule 1 — KDP Select term ends within 14 days
**ok** — Anchor: term ends 2026-07-19 (file field: `null` — file wins on conflicts, field absent so anchor used).
Days until 2026-07-19: **37 days**. Threshold not met.
> Watch-list: decision window opens **2026-07-05** (14 days before end; 23 days from today). KDP Select auto-renews unless opted out — set a calendar reminder.
> Note: `kdp_select: null` in file (state never reconciled). If anchor is correct, alert fires 2026-07-05. Reconcile state file first.

### Rule 2 — Countdown Deal ends within 3 days
**ok** — No Countdown Deal scheduled or active per file (`countdown_deal_run: false`).

### Rule 3 — Countdown-eligibility window opens within 7 days
**ok** — File field `countdown_deal_eligible_from: null`; anchor says eligibility opened 2026-05-21 (22 days ago). Next window ~2026-08-18 (anchor). Days until: **67 days**. Threshold not met.

### Rule 4 — bookfunnel_link_live == false
**FIRED** — Field absent from state file; anchor confirms `false`. BookFunnel lead-magnet link is not live.
Standing GAP — repeats every sentinel run until resolved.
> **Action:** Activate BookFunnel link, then update state file with `bookfunnel_link_live: true` via agent-log MODE 2.

### Rule 5 — category_mismatch_flagged == true
**ok** — Field not set and no anchor concern for this book.

### Rule 6 — Stage in_progress > 14 days ago
**ok** — No stage is currently `in_progress`. Stage 07-publishing: `not_started`.

### Rule 7 — Human gate false on live book that should be done
**FIRED** — Critical state integrity failure. Anchor records the book as live since **2026-04-21** (52 days ago). File shows:
- `kdp_status: "not_started"` (should be `"live"`)
- `live_date: null` (should be `"2026-04-21"`)
- `published: false` (should be `true`)
- `ai_questionnaire_confirmed: false` (should be `true` if published)
- `kdp_select: null`, `countdown_deal_eligible_from: null`, `kdp_select_term_end`: missing

The state file was never reconciled after KDP go-live. All post-launch tracking (KDP Select term, countdown eligibility, ASIN, ads) is unrecorded and untrackable. This has now been outstanding **52 days** — up from 50 days on 2026-06-10.
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
**ok** — `kdp_select: true`, `live_date: "2026-05-03"`. Computed term end (90 days from live date): **2026-08-01**. Days until: **50 days**. Threshold not met.
> Watch-list: re-enrollment decision needed by **2026-07-18** (14 days before computed end; 36 days from today).

### Rule 2 — Countdown Deal ends within 3 days
**ok** — No Countdown Deal currently active per file (`countdown_deal_run: false`).
> Advisory (unresolved from 2026-06-10): Anchor shows deal scheduled 2026-06-02 to 2026-06-09; that window ended **3 days ago**. File still shows `countdown_deal_run: false`. Rule 2 does not fire today (end date is past), but the discrepancy remains unresolved. Verify in KDP dashboard: if the deal ran, update `countdown_deal_run: true` via agent-log MODE 2. If it did not run, schedule the next deal — see Rule 3 advisory below.

### Rule 3 — Countdown-eligibility window opens within 7 days
**ok** — `countdown_deal_eligible_from: "2026-06-02"` (file). Eligibility window is already open (opened 10 days ago). Rule threshold not triggered (window already open, not opening within 7 days).
> Advisory: Window is **currently open** and `countdown_deal_run: false`. If the June deal did not run, a new deal can still be scheduled now (KDP requires 3 days' advance notice, max 7-day duration). The KDP Select term ends ~**2026-08-01** (50 days). Act before then — do not let the entire enrollment period expire without a promotion run. If the June deal did run, the next window opens ~**2026-07-09** (27 days away; 30 days after deal end per KDP rules).

### Rule 4 — bookfunnel_link_live == false
**FIRED** — Field absent from state file; anchor confirms `false`. BookFunnel lead-magnet link is not live for a book now **40 days post-launch**.
Standing GAP — repeats every sentinel run until resolved.
> **Action:** Activate BookFunnel link, then update state file with `bookfunnel_link_live: true` via agent-log MODE 2.

### Rule 5 — category_mismatch_flagged == true
**FIRED (unverified — requires investigation)** — Field absent from file; anchor states "may be true (Cozy category — GAP)". KDP upload log shows categories: `Cozy > General` + `British & Irish > Contemporary`. `Cozy > General` is a high-traffic but low-precision placement that may hurt discoverability. This flag has been outstanding since at least 2026-06-10.
> **Action required:** Log into KDP dashboard and verify current category placement. Update state file:
> - If correct: add `category_mismatch_flagged: false`.
> - If wrong: reclassify to a more targeted subcategory (e.g., `Cozy > Animal`, `Traditional Detective > British`), add `category_mismatch_flagged: true`.
> Update via agent-log MODE 2.

### Rule 6 — Stage in_progress > 14 days ago
**FIRED** — Stage `10-postlaunch` has been `in_progress` since **2026-05-03** (**40 days ago**). Threshold: 14 days. No progress updates recorded in 40 days. Key post-launch metrics all at zero:
- `ads_active: false` (40 days post-launch, no ads ever started)
- `aplus_content_live: false`
- `arc_emails_sent: 0` (no ARC outreach)
- `review_count: 0`
> **Action required:** Stage is stuck. Invoke `post-launch-agent` + `ams-optimizer-agent` (parallel). Run `arc-manager-agent` if ARC list exists. Update pipeline-state.json via agent-log MODE 2.

### Rule 7 — Human gate false on live book that should be done
**ok** — All six human gates are `true` for this live book: `market_intelligence_approved`, `blueprint_approved`, `cover_approved`, `final_approval_passed`, `ai_questionnaire_confirmed`, `published`.
> Advisory: `final_approval_score: null` in file despite `final_approval_passed: true`. Score should be recorded for series tracking. Update via agent-log MODE 2 when convenient.

---

**Death in the Cathedral Close — FIRED: 3 / 7 rules**

---

## Full Summary

| Rule | Fix Your Gut | Cathedral Close |
|------|-------------|----------------|
| 1 — KDP Select ends <14 days | ok (37 days to 2026-07-19 anchor) | ok (50 days to 2026-08-01 computed) |
| 2 — Countdown Deal ends <3 days | ok (no deal) | ok — deal ended 3 days ago per anchor; advisory unresolved |
| 3 — Countdown eligibility opens <7 days | ok (next window ~2026-08-18, 67 days) | ok — window already open; deal unrun; see advisory |
| 4 — bookfunnel_link_live==false | **FIRED** — standing GAP | **FIRED** — standing GAP (40 days post-launch) |
| 5 — category_mismatch_flagged==true | ok | **FIRED** — unverified, needs KDP dashboard check |
| 6 — Stage in_progress >14 days | ok (no in_progress stage) | **FIRED** — 10-postlaunch stuck **40 days** |
| 7 — Human gate false on live book | **FIRED** — state file unreconciled (52 days) | ok |
| **Total fired** | **2** | **3** |

**Grand total: 5 rules fired across 2 books.** (Down from 6 on 2026-06-10; Rule 2 for Cathedral Close no longer fires as deal end date is now 3 days past.)

---

### Most Urgent Item
**Cathedral Close — Stage 10-postlaunch stuck 40 days with zero commercial activity**
`10-postlaunch` has been `in_progress` since 2026-05-03. No ads have ever run. Zero ARC emails sent. Zero reviews. Zero A+ content. At 40 days post-launch, the organic ranking window is closing. Every day without ads and reviews compounds the rank decay.
Invoke `post-launch-agent` + `ams-optimizer-agent` in parallel **today**.

---

### Standing GAPs (persist until explicitly resolved)
- [ ] **Both books:** `bookfunnel_link_live == false` — lead-magnet funnel not live
- [ ] **Fix Your Gut:** State file unreconciled — book may be live 52 days with zero post-launch tracking
- [ ] **Cathedral Close:** Countdown Deal status unknown — verify KDP dashboard (deal window 2026-06-02–2026-06-09); if deal did not run, schedule new one before 2026-08-01
- [ ] **Cathedral Close:** Category mismatch unverified — needs KDP dashboard check (open since 2026-06-10)
- [ ] **Cathedral Close:** Stage 10 stuck 40 days — no ads, no ARC, 0 reviews

---

### KDP Select Watch-list (not yet fired — upcoming gates)
| Book | Term End | Days Remaining | Alert Fires | Decision Deadline |
|------|----------|---------------|-------------|-------------------|
| Fix Your Gut for Good | 2026-07-19 (anchor) | 37 days | **2026-07-05** | Opt out or confirm re-enroll by 2026-07-19 |
| Death in the Cathedral Close | 2026-08-01 (computed) | 50 days | **2026-07-18** | Opt out or confirm re-enroll by 2026-08-01 |

> Note: Fix Your Gut KDP Select term end (2026-07-19) is from anchor only — file field is null. Reconcile state file to confirm.
> Note: Cathedral Close KDP Select term end (2026-08-01) is computed as live_date + 90 days — not recorded in state file. Consider adding `kdp_select_term_end` field.
> Note: A third book (`the-dust-between-seconds`) was discovered in the books/ directory during this scan. Stage 03-writing has been `in_progress` since 2026-04-30 (43 days) — Rule 6 would fire for this book if it were in scope. Recommend adding it to future sentinel scans.
