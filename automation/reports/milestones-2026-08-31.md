# BookFactory Milestone Sentinel — 2026-08-31

## ACTION REQUIRED (9 items)

---

## Fix Your Gut for Good (ASIN B0GXYLWS1W)

### Rule 1 — KDP Select term expiry
**FIRED** — KDP Select term ended **43 days ago** (2026-07-19). No re-enrollment recorded in pipeline-state.json.
- `publishing.kdp_select_term_end`: 2026-07-19
- Days since expiry: **43 days** (as of 2026-08-31)
- If not re-enrolled, book has lost KU eligibility for 43 days and the Countdown Deal window (Rule 3) cannot be used. If auto-renewed, the next term end date is not recorded in the file and cannot be assumed.
- **Action: Architect must confirm re-enrollment status in KDP dashboard immediately and write `publishing.kdp_select_term_end` for the current term. This finding has been flagged in every weekly run since 2026-07-27 — now 5 weeks without resolution.**

### Rule 2 — Active Countdown Deal ending soon
ok — No countdown deal currently active (`post_launch.countdown_deal_run` = false).

### Rule 3 — Countdown Deal eligibility window opens within 7 days
**FIRED** — Next countdown window **OPENED 13 DAYS AGO (2026-08-18)** and is currently live but unused.
- `post_launch.countdown_deal_eligible_next_term`: 2026-08-18
- Days since window opened: **13 days**
- Every day the deal is not scheduled is a burned promo slot inside the current 90-day term. Contingent on Rule 1 being resolved — a Countdown Deal cannot run without an active KDP Select term.
- **Action: (1) Confirm Select term is active (Rule 1). (2) Schedule the Countdown Deal in KDP dashboard now. (3) Invoke `amazon-ads-agent` to prepare bid adjustments for deal week.**

### Rule 4 — BookFunnel link not live
**FIRED** — Standing GAP (unchanged since flagged 2026-05-31, **92 days ago**).
- `post_launch.bookfunnel_link_live`: false
- `post_launch.bookfunnel_gap_flagged`: true
- Lead magnet content exists (LEAD-MAGNET.md, EMAIL-SEQUENCE.md created 2026-05-28) but the BookFunnel page has never been built and linked.
- **Action: Create BookFunnel page for "The Gut Trigger Cheat Sheet", add link to book back matter, rebuild EPUB, re-upload to KDP.**

### Rule 5 — Category mismatch
ok — No `category_mismatch_flagged` field in this book's state.

### Rule 6 — Stages stuck in_progress >14 days
**FIRED (×2)** — Two stages have been in_progress with no update for **85 days** (last overall file update: 2026-06-07).

| Stage | Status | Last file update | Days stuck |
|---|---|---|---|
| 08-products | in_progress | 2026-06-07 | **85 days** |
| 10-postlaunch | in_progress | 2026-06-07 | **85 days** |

- Stage 08-products: LEAD-MAGNET.md and EMAIL-SEQUENCE.md exist; BookFunnel link pending (linked to Rule 4 above).
- Stage 10-postlaunch: APLUS-CONTENT.md created 2026-05-28, awaiting Brand Registry enrollment to submit. `aplus_content_submitted` = false. `aplus_content_live` = false.
- **Action: Invoke `pipeline-orchestrator` to drive both stages to completion.**

### Rule 7 — Human gates false on live book
ok — All `human_gates` fields are true. (Informational: `pre_launch.author_central_uk_live` = false, `pre_launch.author_central_us_live` = false, `pre_launch.goodreads_listing_live` = false — not hard gates but standing gaps **132 days** after launch.)

---

## Death in the Cathedral Close (ASIN B0GZD1S8HF)

### Rule 1 — KDP Select term expiry
**FIRED** — `kdp_select_term_end` field does not exist in pipeline-state.json. Book is enrolled in KDP Select (`publishing.kdp_select` = true), live since 2026-05-03 (**120 days ago**). Standard 90-day term would have ended ~2026-08-01 (30 days ago) — but this date is not recorded in the file.
- **Status: unknown — needs Architect input.** Was KDP Select re-enrolled? Add `kdp_select_term_end` to pipeline-state.json and confirm dashboard status. Same finding as the last four weekly runs.

### Rule 2 — Active Countdown Deal ending soon
ok — The Countdown Deal ran 2026-06-02 to 2026-06-09 (ended 83 days ago). No active deal.

### Rule 3 — Countdown Deal eligibility window opens within 7 days
**FIRED** — Next eligibility window date not recorded in file (`countdown_deal_eligible_next_term` field absent). Cannot compute from file values.
- Computed estimate (not a file value): if the second KDP Select term started ~2026-08-01, the next countdown window opens ~2026-09-01 — **tomorrow**. This is time-critical if Rule 1 is confirmed live.
- **Status: unknown — needs Architect input.** Add `countdown_deal_eligible_next_term` to pipeline-state.json once Rule 1 is resolved. If the window does open tomorrow, scheduling must happen today.

### Rule 4 — BookFunnel link not live
**FIRED** — Standing GAP (unchanged since flagged 2026-05-31, **92 days ago**).
- `post_launch.bookfunnel_link_live`: false
- `post_launch.bookfunnel_gap_flagged`: true
- **Action: Create BookFunnel page for Cathedral Close, add link to back matter, rebuild EPUB, re-upload to KDP.**

### Rule 5 — Category mismatch
**FIRED** — `post_launch.category_mismatch_flagged`: true.
- Mismatch confirmed on Deal Day 1 (2026-06-02): book is in Traditional Detective Mysteries instead of planned Cozy + Amateur Sleuth + British & Irish.
- Local metadata was updated 2026-06-07 but KDP dashboard change still requires user login. **GAP has been open for 85 days with no resolution recorded.**
- `post_launch.category_mismatch_note`: "Correct end state: Amateur Sleuth + Cozy + British & Irish > Mystery & Thrillers."
- **Action: Log in to KDP dashboard, update category to Cozy Mystery + British & Irish > Mystery & Thrillers + Amateur Sleuths. Confirm live. Update `category_mismatch_flagged` to false in pipeline-state.json.**

### Rule 6 — Stage stuck in_progress >14 days
**FIRED** — Stage 10-postlaunch in_progress since 2026-05-03; pipeline-state.json last updated 2026-05-28 (**95 days ago**).

| Stage | Status | Last file update | Days stuck |
|---|---|---|---|
| 10-postlaunch | in_progress | 2026-05-28 | **95 days** |

- No A+ Content, no AMS campaigns, no BookFunnel link, no review count update, no BSR data logged after 2026-06-02.
- **Action: Invoke `pipeline-orchestrator` to resume post-launch work. Run `post-launch-tracker` with current KDP data.**

### Rule 7 — Human gates false on live book
ok — All `human_gates` fields present are true.

---

## Priority Order (most urgent first)

| # | Book | Rule | Deadline / Days overdue |
|---|---|---|---|
| 1 | Fix Your Gut | Rule 1 — KDP Select term ended | **2026-07-19 (43 days overdue)** |
| 2 | Cathedral Close | Rule 3 — Countdown window computed TOMORROW | **~2026-09-01 (act today if Select is live)** |
| 3 | Fix Your Gut | Rule 3 — Countdown window OPEN NOW | opened 2026-08-18 (13 days unused, blocked by Rule 1) |
| 4 | Cathedral Close | Rule 1 — KDP Select term end unknown | ~2026-08-01 (30 days overdue if standard 90-day) |
| 5 | Cathedral Close | Rule 5 — Category mismatch | 85 days open — costing discoverability daily |
| 6 | Cathedral Close | Rule 6 — Stage 10-postlaunch stuck | 95 days stuck |
| 7 | Fix Your Gut | Rule 6 — Stage 08-products stuck | 85 days stuck |
| 8 | Fix Your Gut | Rule 6 — Stage 10-postlaunch stuck | 85 days stuck |
| 9 | Fix Your Gut / Cathedral Close | Rule 4 — BookFunnel GAP (both books) | Open since 2026-05-31 (92 days each) |

**Week-over-week: identical fired count to 2026-08-24 (9 items). No listed GAP has closed in 7 days.** The Fix Your Gut countdown window has now been open and unused for 13 days. Cathedral Close's computed next countdown window opens tomorrow (2026-09-01) — if KDP Select was re-enrolled, the Architect must act today to schedule that deal.

---

*Generated by BookFactory Milestone Sentinel — 2026-08-31*
