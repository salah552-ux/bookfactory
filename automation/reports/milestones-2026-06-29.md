# BookFactory Milestone Sentinel — 2026-06-29
## ACTION REQUIRED (5 items)

Generated: 2026-06-29 | Today's date used for all day-count arithmetic.

---

## DATA NOTES

- **Fix Your Gut for Good** pipeline-state.json contradicts known anchors on live status.
  - File: `kdp_status = not_started`, `published = false`, `last_updated = 2026-04-19` (**71 days stale**).
  - Anchor: live 2026-04-21. **Files win per HARD RULES** — book treated as NOT live for gate evaluation.
  - All file-null fields reported as "unknown — needs Architect input".
- **Death in the Cathedral Close** lives under slug `untitled-cosy-mystery` (no dedicated folder at `books/death-in-the-cathedral-close/`). Treated as slug alias.
- **The Dust Between Seconds** — not in original brief but found during scan with a fired Rule 6; included below.

---

## BOOK 1 — Fix Your Gut for Good

**File state:** Stage 6 complete. Stage 7 not started. Last updated 2026-04-19 (71 days ago).
**Anchor state:** Live 2026-04-21. KDP Select term ends 2026-07-19. Files win where contradicted.

| # | Rule | Status | Detail |
|---|------|--------|--------|
| 1 | KDP Select term ends ≤14 days | **ok** | File: `kdp_select = null` (unknown — needs Architect input). Anchor: 2026-07-19 = **20 days away**. Not within 14-day window today. ⚠️ **FIRES IN 6 DAYS on 2026-07-05.** Re-enrollment / KU decision must be made before then. |
| 2 | Countdown Deal ends ≤3 days | **ok** | No active countdown deal in file. |
| 3 | Countdown eligibility opens ≤7 days | **ok** | File: `countdown_deal_eligible_from = null` (unknown — needs Architect input). Anchor: next window ~2026-08-18 = **50 days away**. |
| 4 | `bookfunnel_link_live == false` | **FIRED** | Anchor states `bookfunnel_link_live = false`. Field absent from file. Standing GAP — no BookFunnel capture link is live for this title. |
| 5 | `category_mismatch_flagged == true` | **ok** | Not flagged in file or anchor for this book. |
| 6 | `in_progress` stage stale >14 days | **ok** | No stages currently in `in_progress` status. |
| 7 | Human gate false on a live book | **ok** (file) | File says `published = false` — not treated as live. However: anchor says live 2026-04-21; if accurate, `ai_questionnaire_confirmed = false` is an open gate. Verify KDP dashboard and update pipeline-state.json. |

### Additional Flags — Fix Your Gut

> **PIPELINE-STATE.JSON IS 71 DAYS STALE.** Last updated 2026-04-19. Stage 07-publishing shows `not_started` while anchor confirms live date 2026-04-21. This file must be updated via `agent-log MODE 2` to reflect actual KDP status, live date, ASIN, KDP Select enrollment, and `ai_questionnaire_confirmed`. Every sentinel run will produce unreliable results until this is fixed.

> **KDP SELECT TERM FIRES IN 6 DAYS (anchor, 2026-07-05).** Anchor: KDP Select term ends 2026-07-19 — **20 days away**. Rule 1 fires in 6 days. Re-enrollment or KU opt-out decision required before 2026-07-05. If the anchor date is wrong, verify KDP dashboard immediately and update pipeline-state.json with the real term-end date.

> **EPUB / PDF NOT BUILT.** `epub_built = false`, `pdf_built = false`. The production deliverables were never confirmed in the file. Cannot be uploaded to KDP without these. Run `bash build-manuscript.sh fix-your-gut-for-good` then update state.

---

## BOOK 2 — Death in the Cathedral Close (slug: untitled-cosy-mystery)

**File state:** Stage 10-postlaunch in_progress since 2026-05-03 (57 days). All human gates true.
**Live date:** 2026-05-03. KDP Select = true. ASIN: AT25QRT6FPTE6.

| # | Rule | Status | Detail |
|---|------|--------|--------|
| 1 | KDP Select term ends ≤14 days | **ok** | Computed from `live_date = 2026-05-03` + 90 days = **2026-08-01** (33 days away). Not within 14-day window. |
| 2 | Countdown Deal ends ≤3 days | **ok** | No current countdown deal active (`countdown_deal_run = false`). |
| 3 | Countdown eligibility opens ≤7 days | **ok** | `countdown_deal_eligible_from = 2026-06-02` in file — window already opened 27 days ago. |
| 4 | `bookfunnel_link_live == false` | **FIRED** | Anchor states `bookfunnel_link_live = false`. Field absent from file. Standing GAP — no BookFunnel capture link is live for this title. |
| 5 | `category_mismatch_flagged == true` | **FIRED (conditional)** | Anchor: `category_mismatch_flagged may be true` (Cozy category concern). Field absent from file. **Treated as FIRED until explicitly cleared** — verify KDP category selection (enrolled as Cozy > General + British & Irish > Contemporary). Run compliance-officer or check KDP dashboard and update file. |
| 6 | `in_progress` stage stale >14 days | **FIRED** | `10-postlaunch` status = `in_progress`, `started_at = 2026-05-03`. Days elapsed: **57 days**. Threshold: 14 days. No agent run recorded in this stage since launch. post-launch-agent is 27 days overdue on its monthly cadence. |
| 7 | Human gate false on live book | **ok** | `published = true`. All six human gates are `true`. No open gates. |

### Additional Flags — Cathedral Close

> **STAGE 10 STUCK 57 DAYS.** `10-postlaunch` has been `in_progress` since 2026-05-03 with zero recorded agent activity. post-launch-agent has not run. BSR, review velocity, and KU page reads are unmonitored. Run `post-launch-agent` immediately.

> **COUNTDOWN DEAL WINDOW CLOSING IN 19 DAYS — HARD DEADLINE 2026-07-18.** Countdown Deal eligible from 2026-06-02 (file). `countdown_deal_run = false` (file). Within the current KDP Select term (ends 2026-08-01), a Countdown Deal must **end at least 14 days before term close** → last eligible end date is **2026-07-18**. Today is 2026-06-29. **19 days remain.** If no deal is scheduled now, the window in this term is lost. Next opportunity: earliest ~2026-09-01 (new term from 2026-08-01 + 30-day wait). Schedule immediately via KDP dashboard.

> **ZERO REVIEWS at 57 days post-launch.** `review_count = 0`, `arc_emails_sent = 0`. ARC programme never activated. Run `arc-manager-agent` immediately. Every day without reviews costs ranking.

> **ADS NOT ACTIVE at 57 days post-launch.** `ads_active = false`. Amazon Ads have not been started. Run `amazon-ads-agent`.

> **COUNTDOWN DEAL ANCHOR DISCREPANCY.** Anchor records Countdown Deal 2026-06-02 – 2026-06-09. File shows `countdown_deal_run = false`. Either the deal ran and pipeline-state.json was never updated (update it via `agent-log MODE 2` now), or the window was missed. Verify KDP dashboard. If deal ran: update file. If missed: act on the 19-day window above.

---

## BOOK 3 — The Dust Between Seconds (not in brief — Rule 6 fired)

**File state:** Stage 03-writing in_progress since 2026-04-30 (60 days). Not yet live.

| # | Rule | Status | Detail |
|---|------|--------|--------|
| 6 | `in_progress` stage stale >14 days | **FIRED** | `03-writing` status = `in_progress`, `started_at = 2026-04-30`. Days elapsed: **60 days**. Threshold: 14 days. `completed_chapters = 1` of 32 target. Last agent run: fiction-writer (Chapter 3 complete, resuming from Chapter 4). No progress recorded since 2026-05-01. |

---

## SUMMARY

| Book | Fired Rules | Most Urgent |
|------|-------------|-------------|
| Fix Your Gut for Good | 1 (Rule 4) + stale file + Rule 1 fires in 6 days | KDP Select re-enrollment decision due **2026-07-05** (6 days) |
| Death in the Cathedral Close | 3 (Rules 4, 5, 6) | Countdown Deal window closes **2026-07-18** (19 days) + stage stuck 57 days |
| The Dust Between Seconds | 1 (Rule 6) | Writing stage stuck 60 days |

**Total rules fired: 5**
**Single most urgent item with hard deadline:** Death in the Cathedral Close — Countdown Deal must end by **2026-07-18** (19 days). Failure to act loses the entire current KDP Select term window; next opportunity earliest 2026-09-01. Schedule via KDP dashboard now.

---

*Sentinel run completed 2026-06-29. Next scheduled run: 2026-06-30.*
