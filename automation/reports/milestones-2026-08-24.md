# BookFactory Milestone Sentinel — 2026-08-24

## ACTION REQUIRED (9 items)

---

## Fix Your Gut for Good (ASIN B0GXYLWS1W)

### Rule 1 — KDP Select term expiry
**FIRED** — KDP Select term ended 36 days ago (2026-07-19). No re-enrollment recorded in pipeline-state.json.
- `publishing.kdp_select_term_end`: 2026-07-19
- Days since expiry: **36 days** (as of 2026-08-24)
- If not re-enrolled, book has lost KU eligibility for 36 days. If auto-renewed, next term ends ~2026-10-17 — but that fact is not recorded in the file and cannot be assumed.
- **Action: Architect must confirm re-enrollment status in KDP dashboard immediately and write `publishing.kdp_select_term_end` for the current term. Flagged unchanged in the last two weekly runs.**

### Rule 2 — Active Countdown Deal ending soon
ok — No countdown deal currently active (`post_launch.countdown_deal_run` = false).

### Rule 3 — Countdown Deal eligibility window opens within 7 days
**FIRED** — Next countdown window **OPENED 6 DAYS AGO (2026-08-18)** and is currently live but unused.
- `post_launch.countdown_deal_eligible_next_term`: 2026-08-18
- Days since window opened: **6 days**
- Every day the deal is not scheduled is a burned promo slot inside the current 90-day term. Contingent on Rule 1 being resolved — a Countdown Deal cannot run without an active KDP Select term.
- **Action: (1) Confirm Select term is active (Rule 1). (2) Schedule the Countdown Deal in KDP dashboard now. (3) Invoke `amazon-ads-agent` to prepare bid adjustments for deal week.**

### Rule 4 — BookFunnel link not live
**FIRED** — Standing GAP (unchanged since flagged 2026-05-31, 85 days ago).
- `post_launch.bookfunnel_link_live`: false
- `post_launch.bookfunnel_gap_flagged`: true
- Lead magnet content exists (LEAD-MAGNET.md, EMAIL-SEQUENCE.md created 2026-05-28) but the BookFunnel page has never been built and linked.
- **Action: Create BookFunnel page for "The Gut Trigger Cheat Sheet", add link to book back matter, rebuild EPUB, re-upload to KDP.**

### Rule 5 — Category mismatch
ok — No `category_mismatch_flagged` field in this book's state.

### Rule 6 — Stages stuck in_progress >14 days
**FIRED (×2)** — Two stages have been in_progress with no update for 78 days (last overall update: 2026-06-07).

| Stage | Status | Last update | Days stuck |
|---|---|---|---|
| 08-products | in_progress | 2026-06-07 | **78 days** |
| 10-postlaunch | in_progress | 2026-06-07 | **78 days** |

- Stage 08-products: LEAD-MAGNET.md and EMAIL-SEQUENCE.md exist; BookFunnel link pending (linked to Rule 4 above).
- Stage 10-postlaunch: APLUS-CONTENT.md created 2026-05-28, awaiting Brand Registry enrollment to submit. `aplus_content_submitted` = false. `aplus_content_live` = false.
- **Action: Invoke `pipeline-orchestrator` to drive both stages to completion.**

### Rule 7 — Human gates false on live book
ok — All `human_gates` fields are true. (Informational: `pre_launch.author_central_uk_live` = false, `pre_launch.author_central_us_live` = false, `pre_launch.goodreads_listing_live` = false — not hard gates but standing gaps 125 days after launch.)

---

## Death in the Cathedral Close (ASIN B0GZD1S8HF)

### Rule 1 — KDP Select term expiry
**FIRED** — `kdp_select_term_end` field does not exist in pipeline-state.json. Book is enrolled in KDP Select (`publishing.kdp_select` = true), live since 2026-05-03 (113 days ago). Standard 90-day term would have ended ~2026-08-01 (23 days ago) — but this date is not recorded in the file.
- **Status: unknown — needs Architect input.** Was KDP Select re-enrolled? Add `kdp_select_term_end` to pipeline-state.json and confirm dashboard status. Same finding as last three weekly runs.

### Rule 2 — Active Countdown Deal ending soon
ok — The Countdown Deal ran 2026-06-02 to 2026-06-09 (ended 76 days ago). No active deal.

### Rule 3 — Countdown Deal eligibility window opens within 7 days
**FIRED** — Next eligibility window date not recorded in file (`countdown_deal_eligible_next_term` field absent). Cannot compute without file data.
- **Status: unknown — needs Architect input.** The countdown deal for this book has already been used once (2026-06-02 to 2026-06-09) — the next window depends on the next Select term start, which is itself unknown (Rule 1). Add `countdown_deal_eligible_next_term` to pipeline-state.json once Rule 1 is resolved.

### Rule 4 — BookFunnel link not live
**FIRED** — Standing GAP (unchanged since flagged 2026-05-31, 85 days ago).
- `post_launch.bookfunnel_link_live`: false
- `post_launch.bookfunnel_gap_flagged`: true
- **Action: Create BookFunnel page for Cathedral Close, add link to back matter, rebuild EPUB, re-upload to KDP.**

### Rule 5 — Category mismatch
**FIRED** — `post_launch.category_mismatch_flagged`: true.
- Mismatch confirmed on Deal Day 1 (2026-06-02): book is in Traditional Detective Mysteries instead of planned Cozy + Amateur Sleuth + British & Irish.
- Local metadata was updated 2026-06-07 but KDP dashboard change still requires user login. **GAP has been open for 78 days with no resolution recorded.**
- `post_launch.category_mismatch_note`: "Correct end state: Amateur Sleuth + Cozy + British & Irish > Mystery & Thrillers."
- **Action: Log in to KDP dashboard, update category to Cozy Mystery + British & Irish > Mystery & Thrillers + Amateur Sleuths. Confirm live. Update `category_mismatch_flagged` to false in pipeline-state.json.**

### Rule 6 — Stage stuck in_progress >14 days
**FIRED** — Stage 10-postlaunch in_progress since 2026-05-03; pipeline-state.json last updated 2026-05-28 (88 days ago).

| Stage | Status | Last update | Days stuck |
|---|---|---|---|
| 10-postlaunch | in_progress | 2026-05-28 | **88 days** |

- No A+ Content, no AMS campaigns, no BookFunnel link, no review count update, no further BSR data logged after 2026-06-02.
- **Action: Invoke `pipeline-orchestrator` to resume post-launch work. Run `post-launch-tracker` with current KDP data.**

### Rule 7 — Human gates false on live book
ok — All `human_gates` fields present are true.

---

## Priority Order (most urgent first)

| # | Book | Rule | Deadline |
|---|---|---|---|
| 1 | Fix Your Gut | Rule 1 — KDP Select term ended | **2026-07-19 (36 days overdue)** |
| 2 | Fix Your Gut | Rule 3 — Countdown window OPEN NOW | opened 2026-08-18 (6 days unused, blocked by Rule 1) |
| 3 | Cathedral Close | Rule 1 — KDP Select term end unknown | ~2026-08-01 (23 days overdue if standard 90-day) |
| 4 | Cathedral Close | Rule 5 — Category mismatch | 78 days open — costing discoverability daily |
| 5 | Fix Your Gut | Rule 6 — Stage 08-products stuck | 78 days stuck |
| 6 | Fix Your Gut | Rule 6 — Stage 10-postlaunch stuck | 78 days stuck |
| 7 | Cathedral Close | Rule 6 — Stage 10-postlaunch stuck | 88 days stuck |
| 8 | Fix Your Gut | Rule 4 — BookFunnel GAP | Open since 2026-05-31 (85 days) |
| 9 | Cathedral Close | Rule 4 — BookFunnel GAP | Open since 2026-05-31 (85 days) |

**Week-over-week: identical fired count to 2026-08-17 (9 items). No listed GAP has closed in 7 days. The Countdown window that was "TOMORROW" last week is now OPEN and unused, still blocked by the unresolved Rule 1.**

---

*Generated by BookFactory Milestone Sentinel — 2026-08-24*
