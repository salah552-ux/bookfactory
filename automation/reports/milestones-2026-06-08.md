# BookFactory Milestone Sentinel — 2026-06-08
# ACTION REQUIRED (5 items)

_Today: 2026-06-08. All day-counts computed from pipeline-state.json values. Fields absent from files are noted; anchor values are used only where the file has no contradicting entry._

---

## Book 1 — Fix Your Gut for Good
**Slug:** `fix-your-gut-for-good` | **Genre:** NON-FICTION-HEALTH | **pipeline-state.json last_updated:** 2026-04-19 (50 days ago)

> **FILE vs ANCHOR DISCREPANCY — CRITICAL:** KNOWN ANCHORS state this book went live 2026-04-21. The file records `publishing.live_date = null`, `kdp_status = "not_started"`, `human_gates.published = false`. File last updated 2026-04-19 — two days BEFORE the claimed live date. **Files win.** The pipeline-state.json was never updated after the go-live action. This discrepancy must be resolved by the Architect before any milestone arithmetic on this book is reliable.

### Rule 1 — KDP Select term ends within 14 days
**STATUS: UNKNOWN — needs Architect input**
`publishing.kdp_select = null` and no term-end date field exists in the file. Cannot compute. If the book went live as the anchor states (2026-04-21), the standard 90-day KDP Select term would end **2026-07-19** (41 days from today) — within the 45-day re-enrollment decision window. **Resolve the live-date discrepancy immediately.**

### Rule 2 — Countdown Deal ends within 3 days
**STATUS: ok**
`post_launch.countdown_deal_run = false` — no deal currently active.

### Rule 3 — Countdown eligibility window opens within 7 days
**STATUS: UNKNOWN — needs Architect input**
`publishing.countdown_deal_eligible_from = null`. Cannot compute. If the anchor date (eligible from 2026-05-21) is correct, the window has been open for 18 days with no deal launched.

### Rule 4 — bookfunnel_link_live == false
**STATUS: FIRED — standing GAP**
Field `bookfunnel_link_live` is absent from pipeline-state.json. KNOWN ANCHOR states false. File does not contradict. BookFunnel lead magnet link is not live. Remains a standing gap until field is set to true.

### Rule 5 — category_mismatch_flagged == true
**STATUS: ok (not applicable)**
This rule applies to Cathedral Close. No category flag for this title.

### Rule 6 — Stage in_progress > 14 days ago
**STATUS: ok**
No stage has status `in_progress`. Stage 07-publishing is `not_started`.

### Rule 7 — Human gate still false on a live book
**STATUS: FIRED — publishing blocked**
`human_gates.final_approval_passed = true` (since 2026-04-19, 50 days ago). Stage 06-production is complete. Yet `human_gates.ai_questionnaire_confirmed = false` and Stage 07-publishing = `not_started`. The book has passed every quality gate but has not been published. If the anchor's live date (2026-04-21) is accurate, the file simply was not updated — but the pipeline record shows no publish action logged. **Either the book is live and pipeline-state.json must be corrected, or the book is not live and the KDP AI questionnaire + Stage 07 must be actioned immediately.**

---

## Book 2 — Death in the Cathedral Close
**Slug:** `untitled-cosy-mystery` | **Genre:** FICTION-MYSTERY | **Live date (file):** 2026-05-03 | **Days live:** 36

### Rule 1 — KDP Select term ends within 14 days
**STATUS: ok**
`publishing.kdp_select = true`. Live date = 2026-05-03. KDP Select standard term = 90 days → term end = **2026-08-01** (54 days from today). Not within 14-day alert window. _(Term-end date not present in file; computed from live_date + 90 days per standard KDP Select rules.)_ Set a calendar reminder for ~2026-07-18 (14 days before) to make the re-enrollment decision.

### Rule 2 — Countdown Deal ends within 3 days
**STATUS: ok**
`post_launch.countdown_deal_run = false` — no deal currently active per file. _(KNOWN ANCHOR stated a deal from 2026-06-02 to 2026-06-09; file contradicts with countdown_deal_run=false. Files win.)_

### Rule 3 — Countdown eligibility window opens within 7 days
**STATUS: FIRED — window open NOW, deal not launched**
`publishing.countdown_deal_eligible_from = 2026-06-02`. The eligibility window opened **6 days ago**. `post_launch.countdown_deal_run = false` — no deal has been scheduled or run. Days since window opened: **6**. If the anchor's deal window closes 2026-06-09, there is **1 day remaining** (unconfirmed from file — anchor only). Launch the Countdown Deal immediately via the KDP Promotions dashboard.

### Rule 4 — bookfunnel_link_live == false
**STATUS: FIRED — standing GAP**
Field `bookfunnel_link_live` is absent from pipeline-state.json. KNOWN ANCHOR states false. File does not contradict. BookFunnel lead magnet link is not live for this title. Remains a standing gap until field is set to true.

### Rule 5 — category_mismatch_flagged == true
**STATUS: UNKNOWN — cannot confirm from file**
Field `category_mismatch_flagged` is absent from pipeline-state.json. KNOWN ANCHOR notes "may be true (Cozy category — GAP)". Cannot confirm or clear from file data alone. KDP listing shows categories: `Cozy > General` + `British & Irish > Contemporary`. Verify whether these are the optimal categories and correct if needed. Add `category_mismatch_flagged` to pipeline-state.json with confirmed value.

### Rule 6 — Stage in_progress > 14 days ago
**STATUS: FIRED — stage stuck 36 days**
Stage `10-postlaunch` has status `in_progress`, started 2026-05-03. Days in progress: **36** (threshold: 14). Post-launch actions show zero progress: `ads_active = false`, `arc_emails_sent = 0`, `aplus_content_live = false`, `review_count = 0`. Invoke `post-launch-agent` and `ams-optimizer-agent` to action the 90-day plan. Stage has been stalled since launch day.

### Rule 7 — Human gate still false on a live book
**STATUS: ok**
All six human gates are `true` (`market_intelligence_approved`, `blueprint_approved`, `cover_approved`, `final_approval_passed`, `ai_questionnaire_confirmed`, `published`). No gate failures.

---

## Fired Rules — Summary Table

| # | Book | Rule | Severity | Days | Action |
|---|------|------|----------|------|--------|
| 1 | Cathedral Close | Rule 3 — Countdown window open, deal not launched | URGENT | 6 days since eligible; anchor suggests closes 2026-06-09 | Launch Countdown Deal on KDP Promotions NOW |
| 2 | Cathedral Close | Rule 6 — Stage 10 in_progress 36 days | HIGH | 36 days stalled | Invoke post-launch-agent + ams-optimizer-agent |
| 3 | Cathedral Close | Rule 4 — bookfunnel GAP | MEDIUM | Standing | Create BookFunnel link, update pipeline-state.json |
| 4 | Fix Your Gut | Rule 7 — Publishing blocked / file discrepancy | HIGH | 50 days since last update | Resolve live-date discrepancy; action Stage 07 or correct file |
| 5 | Fix Your Gut | Rule 4 — bookfunnel GAP | MEDIUM | Standing | Create BookFunnel link, update pipeline-state.json |

**Unknowns requiring Architect input:**
- Fix Your Gut — `kdp_select` and `countdown_deal_eligible_from` both null; file/anchor discrepancy on live_date unresolved
- Cathedral Close — `category_mismatch_flagged` field missing from pipeline-state.json

---

## Single Most Urgent Item

**Cathedral Close: Countdown Deal window open — launch immediately.**
`countdown_deal_eligible_from = 2026-06-02` (6 days ago). `countdown_deal_run = false`. The window is open now. KNOWN ANCHOR places the deal window closing **2026-06-09** (tomorrow). Log into KDP → Promotions → Countdown Deal and schedule or launch the deal today before the window closes.
