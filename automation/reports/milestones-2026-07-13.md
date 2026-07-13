# Milestone Sentinel — 2026-07-13
## ACTION REQUIRED (7 items)

Generated: 2026-07-13 | Sentinel: date-math only — no invented dates.

---

## Fix Your Gut for Good (ASIN B0GXYLWS1W)

### Rule 1 — KDP Select term ending within 14 days
**FIRED — 6 days remaining**
- `kdp_select_term_end`: 2026-07-19
- Today: 2026-07-13 → **6 days until expiry**
- **ACTION:** Decide now — re-enroll in KDP Select for another 90-day term, or exit KDP Select and go wide (Draft2Digital, Kobo, Apple Books). Re-enrollment must be set in KDP before 2026-07-19 or the book auto-exits. If re-enrolling, confirm in KDP dashboard and update `kdp_select_term_end` to 2026-10-17.

### Rule 2 — Countdown Deal ending within 3 days
ok — no active Countdown Deal this term. Next window: 2026-08-18 (36 days away, after re-enrollment + 30-day wait).

### Rule 3 — Countdown eligibility opening within 7 days
ok — next window `countdown_deal_eligible_next_term`: 2026-08-18 (36 days away).

### Rule 4 — BookFunnel link not live
**FIRED — standing GAP**
- `bookfunnel_link_live`: false
- `bookfunnel_gap_flagged`: true
- Lead magnet (The Gut Trigger Cheat Sheet) and email sequence exist on disk (created 2026-05-28) but BookFunnel link has never gone live. Every week without this is lost email subscribers.
- **ACTION:** Create BookFunnel page for the lead magnet, update back matter CTA with live URL, rebuild EPUB, re-upload to KDP. Update `bookfunnel_link_live` to true in pipeline-state.json.

### Rule 5 — Category mismatch flagged
ok — `category_mismatch_flagged` not set for this book.

### Rule 6 — Stage stuck (in_progress >14 days without update)
**FIRED — Stage 08-products: 36 days since last file update (2026-06-07)**
- Stage status: `in_progress` | Notes: "BookFunnel link pending"
- **ACTION:** BookFunnel gap is the blocker. Once resolved, complete stage and close it.

**FIRED — Stage 10-postlaunch: 36 days since last file update (2026-06-07)**
- Stage status: `in_progress` | Notes: "Awaiting Brand Registry enrollment to submit A+ Content"
- `aplus_content_submitted`: false | `aplus_content_live`: false
- **ACTION:** Either enroll in Brand Registry and submit APLUS-CONTENT.md, or document that Brand Registry is not pursued and close this stage with a note.

### Rule 7 — Human gates false on live book
ok — all human gates are true.

---

## Death in the Cathedral Close (ASIN B0GZD1S8HF)

### Rule 1 — KDP Select term ending within 14 days
ok (data gap) — `kdp_select_term_end` field is absent from pipeline-state.json. If the 90-day term started on live date 2026-05-03, expiry would be approximately 2026-08-01 (19 days away — outside the 14-day flag window today but approaching fast). **Architect must confirm the exact term end date in KDP dashboard and add `kdp_select_term_end` to pipeline-state.json before next milestone run.**

### Rule 2 — Countdown Deal ending within 3 days
ok — Countdown Deal already ran and ended 2026-06-09 (34 days ago). No active deal.

### Rule 3 — Countdown eligibility opening within 7 days
ok (data gap) — next Countdown eligibility is after KDP Select re-enrollment + 30 days, which requires knowing the current term end (unknown — see Rule 1 note above).

### Rule 4 — BookFunnel link not live
**FIRED — standing GAP**
- `bookfunnel_link_live`: false
- `bookfunnel_gap_flagged`: true
- No lead magnet infrastructure has been created for this title. This is an ongoing revenue and list-building gap.
- **ACTION:** Run `email-list-builder` agent for `death-in-the-cathedral-close`. Create BookFunnel page. Add back matter CTA. Rebuild EPUB. Re-upload to KDP.

### Rule 5 — Category mismatch flagged
**FIRED — standing GAP**
- `category_mismatch_flagged`: true
- Note (from 2026-06-07): "Metadata updated locally to Cantina-safe canonical values. KDP dashboard change requires login — blocked until user confirms live categories. Correct end state: Amateur Sleuth + Cozy + British & Irish > Mystery & Thrillers."
- This has been open since 2026-06-02 (41 days). The Cozy category is the highest-value discoverability lever for this book and it is not live.
- **ACTION:** Log into KDP dashboard. Change categories to: (1) Cozy > General, (2) British & Irish > Mystery & Thrillers. Confirm live. Set `category_mismatch_flagged` to false in pipeline-state.json.

### Rule 6 — Stage stuck (in_progress >14 days without update)
**FIRED — Stage 10-postlaunch: 46 days since last file update (2026-05-28)**
- Stage status: `in_progress` | `started_at`: 2026-05-03
- 0 reviews, no ads active, no A+ content, BookFunnel gap, category mismatch unresolved.
- **ACTION:** Run post-launch-agent. Log current BSR, review count, KU pages from KDP dashboard. Resolve category mismatch and BookFunnel gaps. Begin ARC outreach.

### Rule 7 — Human gates false on live book
ok — all present human gates are true.

---

## Priority Order

| # | Book | Rule | Item | Deadline |
|---|------|------|------|----------|
| 1 | Fix Your Gut | Rule 1 | KDP Select re-enrollment decision | **2026-07-19 (6 days)** |
| 2 | Cathedral Close | Rule 5 | Fix Cozy category in KDP dashboard | Immediate (41 days open) |
| 3 | Cathedral Close | Rule 1 | Confirm KDP Select term end date | Before next milestone run |
| 4 | Both books | Rule 4 | BookFunnel link live | Ongoing revenue gap |
| 5 | Fix Your Gut | Rule 6 | Close stage 08-products (BookFunnel blocker) | After item 4 |
| 6 | Fix Your Gut | Rule 6 | Close/update stage 10-postlaunch (A+ / Brand Registry) | This week |
| 7 | Cathedral Close | Rule 6 | Post-launch data logging and review velocity start | This week |
