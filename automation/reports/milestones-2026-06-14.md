# BookFactory Milestone Sentinel — 2026-06-14
## ACTION REQUIRED (4 items)

Generated: 2026-06-14 | Today's date used for all day-count arithmetic.

---

## DATA NOTES

- **Fix Your Gut for Good** pipeline-state.json contradicts known anchors on live status.
  - File: `kdp_status = not_started`, `published = false`, `last_updated = 2026-04-19` (56 days stale).
  - Anchor: live 2026-04-21. **Files win per HARD RULES** — book treated as NOT live for gate evaluation.
  - All file-null fields are reported as "unknown — needs Architect input".
- **Death in the Cathedral Close** lives under slug `untitled-cosy-mystery` (no dedicated folder).
  - Anchor Countdown Deal dates (2026-06-02 – 2026-06-09) used where not present in file.

---

## BOOK 1 — Fix Your Gut for Good

**File state:** Stage 6 complete. Stage 7 not started. Last updated 2026-04-19 (56 days ago).
**Anchor state:** Live 2026-04-21. KDP Select term ends 2026-07-19. Files win where contradicted.

| # | Rule | Status | Detail |
|---|------|--------|--------|
| 1 | KDP Select term ends ≤14 days | **ok** | File: `kdp_select = null` (unknown). Anchor: 2026-07-19 = **35 days away**. Neither source triggers the 14-day window. |
| 2 | Countdown Deal ends ≤3 days | **ok** | No active countdown deal in file. |
| 3 | Countdown eligibility opens ≤7 days | **ok** | File: `countdown_deal_eligible_from = null` (unknown). Anchor: 2026-05-21 = 24 days ago (window already open). Next window: anchor ~2026-08-18 = 65 days away. |
| 4 | `bookfunnel_link_live == false` | **FIRED** | Anchor states `bookfunnel_link_live = false`. Field absent from file. Standing GAP — no BookFunnel capture link is live for this title. |
| 5 | `category_mismatch_flagged == true` | **ok** | Not flagged in file or anchor for this book. |
| 6 | `in_progress` stage stale >14 days | **ok** | No stages currently in `in_progress` status. |
| 7 | Human gate false on a live book | **ok** (file) | File says `published = false` → not treated as live. **However:** anchor says live 2026-04-21; if accurate, `ai_questionnaire_confirmed = false` is an open gate that should be resolved. Recommend verifying KDP dashboard and updating pipeline-state.json. |

### Additional Flag — Fix Your Gut
> **PIPELINE-STATE.JSON IS 56 DAYS STALE.** Last updated 2026-04-19. Stage 07-publishing shows `not_started` while anchor confirms live date 2026-04-21. This file must be updated via `agent-log MODE 2` to reflect actual KDP status, live date, ASIN, KDP Select enrollment, and `ai_questionnaire_confirmed`. Without this, all downstream sentinel runs for this book produce unreliable results.

---

## BOOK 2 — Death in the Cathedral Close (slug: untitled-cosy-mystery)

**File state:** Stage 10-postlaunch in_progress since 2026-05-03 (42 days). All human gates true.
**Live date:** 2026-05-03. KDP Select = true. ASIN: AT25QRT6FPTE6.

| # | Rule | Status | Detail |
|---|------|--------|--------|
| 1 | KDP Select term ends ≤14 days | **ok** | Computed from `live_date = 2026-05-03` + 90 days = **2026-08-01** (47 days away). Not within 14-day window. |
| 2 | Countdown Deal ends ≤3 days | **ok** | Anchor: Countdown Deal ran 2026-06-02 – 2026-06-09. Deal **ended 5 days ago** (2026-06-09). No current deal active. |
| 3 | Countdown eligibility opens ≤7 days | **ok** | `countdown_deal_eligible_from = 2026-06-02` in file. Window opened 12 days ago. Next window not calculable from file data (no deal-end date recorded). |
| 4 | `bookfunnel_link_live == false` | **FIRED** | Anchor states `bookfunnel_link_live = false`. Field absent from file. Standing GAP — no BookFunnel capture link is live for this title. |
| 5 | `category_mismatch_flagged == true` | **FIRED (conditional)** | Anchor: `category_mismatch_flagged may be true` (Cozy category concern). Field absent from file. Cannot confirm or clear. **Treat as FIRED until explicitly cleared** — run compliance-officer or verify KDP category selection matches the enrolled Cozy > General + British & Irish > Contemporary categories. |
| 6 | `in_progress` stage stale >14 days | **FIRED** | `10-postlaunch` status = `in_progress`, `started_at = 2026-05-03`. Days elapsed: **42 days**. Threshold: 14 days. post-launch-agent should be actively running weekly (first 30 days) then monthly. No agent run recorded in this stage since launch. |
| 7 | Human gate false on live book | **ok** | `published = true`. All six human gates are `true`. No open gates. |

### Additional Flag — Cathedral Close
> **MISSED COUNTDOWN DEAL WINDOW.** Anchor records Countdown Deal 2026-06-02 – 2026-06-09 but `countdown_deal_run = false` in file. Either the deal ran and the file was never updated, or the deal window was missed. Clarify with KDP dashboard. If the deal ran, update pipeline-state.json. If missed, next opportunity is after the current 90-day KDP Select term renews (~2026-08-01), then 30-day wait → earliest next window **~2026-09-01**.

> **ZERO REVIEWS at 42 days post-launch.** `review_count = 0`, `arc_emails_sent = 0`. ARC programme has not been activated. Recommend running `arc-manager-agent` immediately.

---

## SUMMARY

| Book | Fired Rules | Most Urgent |
|------|-------------|-------------|
| Fix Your Gut for Good | 1 (+ stale file flag) | Update pipeline-state.json (56 days stale) |
| Death in the Cathedral Close | 3 | Stage 10 stuck 42 days — run post-launch-agent |

**Total rules fired: 4**
**Single most urgent item:** Death in the Cathedral Close — Stage 10-postlaunch `in_progress` for **42 days** with no recorded agent activity. post-launch-agent should have run weekly for the first 30 days. Run immediately. Deadline: overdue.

---

*Sentinel run completed 2026-06-14. Next scheduled run: 2026-06-15.*
