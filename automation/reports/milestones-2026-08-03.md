# BookFactory Milestone Sentinel — 2026-08-03
# ACTION REQUIRED (8 items)

Run date: 2026-08-03 | Both books scanned | 8 rules fired across 2 books

---

## Fix Your Gut for Good (B0GXYLWS1W)

**Live:** 2026-04-21 | **KDP Select term:** 2026-04-21 → 2026-07-19 | **Stage:** 10 (post-launch in-progress)

| Rule | Status | Detail |
|------|--------|--------|
| Rule 1 — KDP Select term ending | **FIRED** | Term END was 2026-07-19 — **EXPIRED 15 days ago**. Re-enrollment decision is OVERDUE. If auto-renew was off, the book has left KDP Select silently. Verify KDP dashboard immediately. |
| Rule 2 — Countdown Deal ending soon | ok | No countdown deal running this term. |
| Rule 3 — Countdown eligibility opens within 7 days | ok | Next window ~2026-08-18 (15 days away; not yet within 7-day flag zone). |
| Rule 4 — BookFunnel link not live | **FIRED** | `bookfunnel_link_live = false`. Standing GAP — persists until Architect sets up BookFunnel link and sets field to true. |
| Rule 5 — Category mismatch flagged | ok | No `category_mismatch_flagged` field in this book's state. |
| Rule 6 — Stage 08-products stuck | **FIRED** | `status: in_progress`. File last updated 2026-06-07 — **57 days ago**. BookFunnel link still pending. Stage has been stalled since May. |
| Rule 6 — Stage 10-postlaunch stuck | **FIRED** | `status: in_progress`. File last updated 2026-06-07 — **57 days ago**. A+ Content submitted flag still false; Brand Registry enrollment blocking submission. |
| Rule 7 — Human gates on live book | ok | All `human_gates` entries are true. |

**Fired: 4 items**

### Notes
- KDP Select term end confirmed from field `publishing.kdp_select_term_end = "2026-07-19"`.
- Countdown next window `post_launch.countdown_deal_eligible_next_term = "2026-08-18"` (15 days away) — this WILL fire Rule 3 next week if not actioned.
- Both free promo slots used (Apr 25–27, May 2–3); countdown deal cannot run in the expired term in any case.
- Review count remains 0 — ARC programme was never run (arc_copies_sent = 0).

---

## Death in the Cathedral Close (B0GZD1S8HF)

**Live:** 2026-05-03 | **KDP Select term:** 2026-05-03 → computed 2026-08-01 (no explicit field) | **Stage:** 10 (post-launch in-progress)

| Rule | Status | Detail |
|------|--------|--------|
| Rule 1 — KDP Select term ending | **FIRED** | `kdp_select_term_end` is **not recorded** in pipeline-state.json. Computed from `live_date = 2026-05-03` + 90 days = **2026-08-01 — EXPIRED 2 days ago**. Needs Architect to confirm KDP dashboard status and record the field. |
| Rule 2 — Countdown Deal ending soon | ok | Countdown Deal ended 2026-06-09 (55 days ago). |
| Rule 3 — Countdown eligibility opens within 7 days | ok | Next window only opens if re-enrolled; computed earliest eligible ~2026-08-31 (28 days away). |
| Rule 4 — BookFunnel link not live | **FIRED** | `bookfunnel_link_live = false`. Standing GAP — same issue as Fix Your Gut. |
| Rule 5 — Category mismatch flagged | **FIRED** | `category_mismatch_flagged = true`. Flagged 2026-06-07 (**57 days unresolved**). Correct categories (Amateur Sleuth + Cozy + British & Irish > Mystery & Thrillers) are set in local metadata but KDP dashboard change blocked pending Architect login. |
| Rule 6 — Stage 10-postlaunch stuck | **FIRED** | `status: in_progress`, started 2026-05-03. File last updated 2026-05-28 — **67 days ago**. No BSR data logged since 2026-06-02 (62 days ago). |
| Rule 7 — Human gates on live book | ok | All listed `human_gates` entries are true. |

**Fired: 4 items**

### Notes
- `kdp_select_term_end` is absent from pipeline-state.json. Computed date (live_date + 90 days = 2026-08-01) is best estimate; Architect must confirm KDP dashboard and record the field.
- Category mismatch is the longest-running open item (57 days). Wrong categories mean the book cannot rank in Cozy.
- Review count remains 0 — ARC programme was never run (arc_emails_sent = 0).
- Word count (58,030) is below target (85,000). Not a milestone rule trigger, flagged for awareness.

---

## Cross-Portfolio Summary

| Item | Book | Days Overdue / Until |
|------|------|---------------------|
| KDP Select expired | Fix Your Gut | 15 days past (2026-07-19) |
| KDP Select expired (computed) | Cathedral Close | 2 days past (computed 2026-08-01) |
| Stage 10 stuck | Cathedral Close | 67 days |
| Stage 08 + 10 stuck | Fix Your Gut | 57 days |
| Category mismatch unresolved | Cathedral Close | 57 days |
| BookFunnel link | Both | Standing GAP |
| Countdown next window | Fix Your Gut | 15 days (flag next week) |

**Most urgent item:** Fix Your Gut KDP Select term confirmed expired 2026-07-19 (15 days ago). If auto-renew was disabled, the book has already left KU and lost all KENP page reads. Check KDP dashboard immediately and confirm re-enrollment or exit decision.

**Second most urgent:** Cathedral Close KDP Select also likely expired 2026-08-01 (2 days ago, computed). Same risk.

**Actioning both on the same KDP login session is recommended.**

---

*Generated by BookFactory Milestone Sentinel (JOB 2) | Automated run 2026-08-03*
