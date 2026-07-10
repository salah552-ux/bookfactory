# BookFactory Milestone Sentinel — 2026-06-22
## ACTION REQUIRED (4 items)

Generated: 2026-06-22 | Today's date used for all day-count arithmetic.

---

## DATA NOTES

- **Fix Your Gut for Good** pipeline-state.json contradicts known anchors on live status.
  - File: `kdp_status = not_started`, `published = false`, `last_updated = 2026-04-19` (**64 days stale**).
  - Anchor: live 2026-04-21. **Files win per HARD RULES** — book treated as NOT live for gate evaluation.
  - All file-null fields are reported as "unknown — needs Architect input".
- **Death in the Cathedral Close** lives under slug `untitled-cosy-mystery` (no dedicated folder).
  - No `death-in-the-cathedral-close/` directory exists in `books/`. Treated as slug alias — no action required unless a rename is desired.
  - Anchor Countdown Deal dates (2026-06-02 – 2026-06-09) used where not present in file.

---

## BOOK 1 — Fix Your Gut for Good

**File state:** Stage 6 complete. Stage 7 not started. Last updated 2026-04-19 (64 days ago).
**Anchor state:** Live 2026-04-21. KDP Select term ends 2026-07-19. Files win where contradicted.

| # | Rule | Status | Detail |
|---|------|--------|--------|
| 1 | KDP Select term ends ≤14 days | **ok** | File: `kdp_select = null` (unknown — needs Architect input). Anchor: 2026-07-19 = **27 days away**. Neither triggers the 14-day window. ⚠️ Approaching — will fire in 13 days. |
| 2 | Countdown Deal ends ≤3 days | **ok** | No active countdown deal in file. |
| 3 | Countdown eligibility opens ≤7 days | **ok** | File: `countdown_deal_eligible_from = null` (unknown — needs Architect input). Anchor: next window ~2026-08-18 = **57 days away**. |
| 4 | `bookfunnel_link_live == false` | **FIRED** | Anchor states `bookfunnel_link_live = false`. Field absent from file. Standing GAP — no BookFunnel capture link is live for this title. |
| 5 | `category_mismatch_flagged == true` | **ok** | Not flagged in file or anchor for this book. |
| 6 | `in_progress` stage stale >14 days | **ok** | No stages currently in `in_progress` status. |
| 7 | Human gate false on a live book | **ok** (file) | File says `published = false` → not treated as live. **However:** anchor says live 2026-04-21; if accurate, `ai_questionnaire_confirmed = false` is an open gate that should be resolved. Verify KDP dashboard and update pipeline-state.json. |

### Additional Flags — Fix Your Gut

> **PIPELINE-STATE.JSON IS 64 DAYS STALE.** Last updated 2026-04-19. Stage 07-publishing shows `not_started` while anchor confirms live date 2026-04-21. This file must be updated via `agent-log MODE 2` to reflect actual KDP status, live date, ASIN, KDP Select enrollment, and `ai_questionnaire_confirmed`. Without this, all downstream sentinel runs produce unreliable results.

> **KDP SELECT TERM APPROACHING (anchor).** Anchor: KDP Select term ends 2026-07-19 — **27 days away**. Re-enrollment / KU decision required before that date. Not file-confirmed, but worth acting on now to avoid missing the renewal window.

---

## BOOK 2 — Death in the Cathedral Close (slug: untitled-cosy-mystery)

**File state:** Stage 10-postlaunch in_progress since 2026-05-03 (50 days). All human gates true.
**Live date:** 2026-05-03. KDP Select = true. ASIN: AT25QRT6FPTE6.

| # | Rule | Status | Detail |
|---|------|--------|--------|
| 1 | KDP Select term ends ≤14 days | **ok** | Computed from `live_date = 2026-05-03` + 90 days = **2026-08-01** (40 days away). Not within 14-day window. |
| 2 | Countdown Deal ends ≤3 days | **ok** | No current countdown deal active in file (`countdown_deal_run = false`). Anchor deal 2026-06-02 – 2026-06-09 ended 13 days ago. |
| 3 | Countdown eligibility opens ≤7 days | **ok** | `countdown_deal_eligible_from = 2026-06-02` in file — window already opened 20 days ago. If the anchor deal (2026-06-02 – 2026-06-09) ran, next window is earliest ~2026-09-01 (new KDP Select term + 30-day wait). If deal was missed, opportunity may still exist within current term — verify with KDP dashboard. |
| 4 | `bookfunnel_link_live == false` | **FIRED** | Anchor states `bookfunnel_link_live = false`. Field absent from file. Standing GAP — no BookFunnel capture link is live for this title. |
| 5 | `category_mismatch_flagged == true` | **FIRED (conditional)** | Anchor: `category_mismatch_flagged may be true` (Cozy category concern). Field absent from file. **Treat as FIRED until explicitly cleared** — verify KDP category selection (enrolled as Cozy > General + British & Irish > Contemporary). Run compliance-officer or check KDP dashboard. |
| 6 | `in_progress` stage stale >14 days | **FIRED** | `10-postlaunch` status = `in_progress`, `started_at = 2026-05-03`. Days elapsed: **50 days**. Threshold: 14 days. post-launch-agent should have run weekly for first 30 days, then monthly. No agent run recorded in this stage since launch. |
| 7 | Human gate false on live book | **ok** | `published = true`. All six human gates are `true`. No open gates. |

### Additional Flags — Cathedral Close

> **STAGE 10 STUCK 50 DAYS.** `10-postlaunch` has been `in_progress` since launch (2026-05-03) with zero recorded agent activity. post-launch-agent has not run. BSR, review velocity, and KU page reads are unmonitored. Run `post-launch-agent` immediately. This is the most urgent item in this run.

> **COUNTDOWN DEAL AMBIGUITY UNRESOLVED (6 days since last report).** Anchor records Countdown Deal 2026-06-02 – 2026-06-09. File shows `countdown_deal_run = false`. Either the deal ran and pipeline-state.json was never updated, or the window was missed. Verify KDP dashboard. If deal ran: update file via `agent-log MODE 2`. If missed: next window earliest ~2026-09-01 (post-KDP Select renewal at 2026-08-01 + 30-day wait).

> **ZERO REVIEWS at 50 days post-launch.** `review_count = 0`, `arc_emails_sent = 0`. ARC programme has not been activated. Run `arc-manager-agent` immediately.

> **ADS NOT ACTIVE at 50 days post-launch.** `ads_active = false`. Amazon Ads have not been started. Run `amazon-ads-agent`.

---

## SUMMARY

| Book | Fired Rules | Most Urgent |
|------|-------------|-------------|
| Fix Your Gut for Good | 1 (+ stale file flag + KDP Select approaching) | Update pipeline-state.json (64 days stale) |
| Death in the Cathedral Close | 3 | Stage 10 stuck 50 days — run post-launch-agent immediately |

**Total rules fired: 4**
**Single most urgent item:** Death in the Cathedral Close — Stage 10-postlaunch `in_progress` for **50 days** with no recorded agent activity. post-launch-agent is overdue. 0 reviews, 0 ARC emails, ads inactive. Run `post-launch-agent` now. Deadline: **overdue**.

---

*Sentinel run completed 2026-06-22. Next scheduled run: 2026-06-23.*
