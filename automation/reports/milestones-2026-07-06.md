# BookFactory Milestone Sentinel — 2026-07-06
## ACTION REQUIRED (5 items)

Generated: 2026-07-06 | Today's date used for all day-count arithmetic.

---

## DATA NOTES

- **Fix Your Gut for Good** pipeline-state.json contradicts known anchors on live status.
  - File: `kdp_status = not_started`, `published = false`, `last_updated = 2026-04-19` (**78 days stale**).
  - Anchor: live 2026-04-21. **Files win per HARD RULES** — book treated as NOT live for gate evaluation.
  - All file-null fields reported as "unknown — needs Architect input".
- **Death in the Cathedral Close** lives under slug `untitled-cosy-mystery` (no dedicated folder at `books/death-in-the-cathedral-close/`). Treated as slug alias.
- **The Dust Between Seconds** — not in original brief but found during scan with a fired Rule 6; included below.

---

## BOOK 1 — Fix Your Gut for Good

**File state:** Stage 6 complete. Stage 7 not started. Last updated 2026-04-19 (78 days ago).
**Anchor state:** Live 2026-04-21. KDP Select term ends 2026-07-19. Files win where contradicted.

| # | Rule | Status | Detail |
|---|------|--------|--------|
| 1 | KDP Select term ends ≤14 days | **🔴 FIRED** | File: `kdp_select = null` (unknown — needs Architect input). **Anchor: 2026-07-19 = 13 days away. RULE 1 FIRES TODAY** — just crossed the 14-day threshold (was 20 days on 2026-06-29). Re-enrollment / KU drop decision required **before 2026-07-19**. If the anchor is correct, this is the highest-priority action across the entire catalogue. |
| 2 | Countdown Deal ends ≤3 days | **ok** | No active countdown deal in file. |
| 3 | Countdown eligibility opens ≤7 days | **ok** | File: `countdown_deal_eligible_from = null` (unknown — needs Architect input). Anchor: next window ~2026-08-18 = 43 days away. |
| 4 | `bookfunnel_link_live == false` | **🔴 FIRED** | Anchor states `bookfunnel_link_live = false`. Field absent from file. Standing GAP — no BookFunnel capture link is live for this title. |
| 5 | `category_mismatch_flagged == true` | **ok** | Not flagged in file or anchor for this book. |
| 6 | `in_progress` stage stale >14 days | **ok** | No stages currently in `in_progress` status. Stage 07-publishing is `not_started`. |
| 7 | Human gate false on a live book | **ok** (file) | File says `published = false` — not treated as live. However: anchor says live 2026-04-21; if accurate, `ai_questionnaire_confirmed = false` is an open gate. Verify KDP dashboard and update pipeline-state.json. |

### Additional Flags — Fix Your Gut

> **🚨 RULE 1 FIRES TODAY — KDP SELECT TERM ENDS IN 13 DAYS (2026-07-19).** This deadline crossed the 14-day alert window as of today. Anchor: KDP Select term ends 2026-07-19. Re-enrollment / KU opt-out decision must be made **immediately**. Failing to act means auto-renewal into the next 90-day KDP Select term by default, blocking wide distribution until ~2026-10-17.

> **PIPELINE-STATE.JSON IS 78 DAYS STALE.** Last updated 2026-04-19. Stage 07-publishing shows `not_started` while anchor confirms live date 2026-04-21. This file must be updated via `agent-log MODE 2` to reflect actual KDP status, live date, ASIN, KDP Select enrollment, and `ai_questionnaire_confirmed`. Every sentinel run will continue producing unreliable results until this is fixed.

> **EPUB / PDF NOT BUILT (per file).** `epub_built = false`, `pdf_built = false`. Confirmed in file. If the book is actually live, these fields are also stale. Run `bash build-manuscript.sh fix-your-gut-for-good` and update state.

---

## BOOK 2 — Death in the Cathedral Close (slug: untitled-cosy-mystery)

**File state:** Stage 10-postlaunch in_progress since 2026-05-03 (64 days). All human gates true.
**Live date:** 2026-05-03. KDP Select = true. ASIN: AT25QRT6FPTE6.

| # | Rule | Status | Detail |
|---|------|--------|--------|
| 1 | KDP Select term ends ≤14 days | **ok** | Computed from `live_date = 2026-05-03` + 90 days = **2026-08-01** (26 days away). Not yet within 14-day window. |
| 2 | Countdown Deal ends ≤3 days | **ok** | No current countdown deal active (`countdown_deal_run = false`). |
| 3 | Countdown eligibility opens ≤7 days | **ok** | `countdown_deal_eligible_from = 2026-06-02` — window already opened 34 days ago. |
| 4 | `bookfunnel_link_live == false` | **🔴 FIRED** | Anchor states `bookfunnel_link_live = false`. Field absent from file. Standing GAP — no BookFunnel capture link is live for this title. |
| 5 | `category_mismatch_flagged == true` | **🔴 FIRED (conditional)** | Anchor: `category_mismatch_flagged may be true` (Cozy category concern). Field absent from file. **Treated as FIRED until explicitly cleared** — verify KDP category selection (enrolled as Cozy > General + British & Irish > Contemporary). Run compliance-officer or check KDP dashboard and update file. |
| 6 | `in_progress` stage stale >14 days | **🔴 FIRED** | `10-postlaunch` status = `in_progress`, `started_at = 2026-05-03`. Days elapsed: **64 days**. Threshold: 14 days. No agent run recorded in this stage since launch. post-launch-agent is overdue on its monthly cadence. |
| 7 | Human gate false on live book | **ok** | `published = true`. All six human gates are `true`. No open gates. |

### Additional Flags — Cathedral Close

> **🚨 COUNTDOWN DEAL WINDOW CLOSES IN 12 DAYS — HARD DEADLINE 2026-07-18.** Countdown Deal eligible from 2026-06-02 (file). `countdown_deal_run = false` (file). Within the current KDP Select term (ends 2026-08-01), a Countdown Deal must **end at least 14 days before term close** → last eligible end date is **2026-07-18**. Today is 2026-07-06. **12 days remain.** Window has shrunk from 19 days (last report 2026-06-29) to 12 days today. If no deal is scheduled now, the window in this term is lost. Next opportunity: earliest ~2026-09-01 (new term from 2026-08-01 + 30-day wait). Schedule immediately via KDP dashboard.

> **STAGE 10 STUCK 64 DAYS.** `10-postlaunch` has been `in_progress` since 2026-05-03 with zero recorded agent activity. post-launch-agent has not run since launch. BSR, review velocity, and KU page reads are unmonitored. Run `post-launch-agent` immediately.

> **ZERO REVIEWS at 64 days post-launch.** `review_count = 0`, `arc_emails_sent = 0`. ARC programme never activated. Run `arc-manager-agent` immediately. Every day without reviews costs ranking position.

> **ADS NOT ACTIVE at 64 days post-launch.** `ads_active = false`. Amazon Ads have not been started. Run `amazon-ads-agent`.

> **COUNTDOWN DEAL ANCHOR DISCREPANCY.** Anchor records Countdown Deal 2026-06-02 – 2026-06-09. File shows `countdown_deal_run = false`. Either the deal ran and pipeline-state.json was never updated (update via `agent-log MODE 2` now), or the window was missed. Verify KDP dashboard before scheduling new deal.

---

## BOOK 3 — The Dust Between Seconds (not in brief — Rule 6 fired)

**File state:** Stage 03-writing in_progress since 2026-04-30 (67 days). Not yet live.

| # | Rule | Status | Detail |
|---|------|--------|--------|
| 6 | `in_progress` stage stale >14 days | **🔴 FIRED** | `03-writing` status = `in_progress`, `started_at = 2026-04-30`. Days elapsed: **67 days**. Threshold: 14 days. `completed_chapters = 1` of 32 target. Last agent run: fiction-writer (Chapter 3 complete, resuming from Chapter 4). No progress recorded since 2026-05-01. |

---

## SUMMARY

| Book | Fired Rules | Most Urgent |
|------|-------------|-------------|
| Fix Your Gut for Good | 2 (Rules 1, 4) + stale file | KDP Select re-enrollment decision due **2026-07-19 (13 days)** 🔴 |
| Death in the Cathedral Close | 3 (Rules 4, 5, 6) | Countdown Deal window closes **2026-07-18 (12 days)** + stage stuck 64 days |
| The Dust Between Seconds | 1 (Rule 6) | Writing stage stuck 67 days |

**Total rules fired: 5 (mandated books) + 1 (Dust Between Seconds)**

**🔴 SINGLE MOST URGENT ITEM:** Fix Your Gut for Good — KDP Select term ends **2026-07-19** (13 days). Rule 1 crossed the 14-day threshold today. Re-enrollment default kicks in automatically if no action is taken — this locks the title into another 90-day exclusive term and blocks wide distribution until ~2026-10-17. Decide immediately: re-enroll in KDP Select OR opt out for wide distribution. Verify live status on KDP dashboard (pipeline-state.json is 78 days stale and may not reflect reality).

---

*Sentinel run completed 2026-07-06. Next scheduled run: 2026-07-07.*
