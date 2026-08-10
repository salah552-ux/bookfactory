# BookFactory Milestone Sentinel — 2026-08-10
# ACTION REQUIRED (8 items)

Run date: 2026-08-10 | Both books scanned | 8 rules fired across 2 books

---

## Fix Your Gut for Good (B0GXYLWS1W)

**Live:** 2026-04-21 | **KDP Select term:** 2026-04-21 → 2026-07-19 | **Stage:** 10 (post-launch in-progress)

| Rule | Status | Detail |
|------|--------|--------|
| Rule 1 — KDP Select term ending | **FIRED** | Term END was 2026-07-19 — **EXPIRED 22 days ago**. Re-enrollment decision is CRITICALLY OVERDUE. If auto-renew was off, the book has silently left KDP Select and KU page reads have stopped. Verify KDP dashboard immediately and confirm re-enrollment or exit strategy. |
| Rule 2 — Countdown Deal ending soon | ok | No countdown deal currently running. |
| Rule 3 — Countdown eligibility opens within 7 days | ok | Next window `post_launch.countdown_deal_eligible_next_term = 2026-08-18` — **8 days away**. Just outside the 7-day trigger today; WILL fire next run. Begin Countdown Deal planning now. |
| Rule 4 — BookFunnel link not live | **FIRED** | `bookfunnel_link_live = false`. Standing GAP — unchanged for 74+ days. No lead magnet funnel is live despite LEAD-MAGNET.md being written 2026-05-28. |
| Rule 5 — Category mismatch flagged | ok | No `category_mismatch_flagged` field in this book's state. |
| Rule 6 — Stage 08-products stuck | **FIRED** | `status: in_progress`. Top-level `last_updated = 2026-06-07` — **64 days ago**. BookFunnel link still pending. Stage has been stalled since May with no logged progress. |
| Rule 6 — Stage 10-postlaunch stuck | **FIRED** | `status: in_progress`. `last_updated = 2026-06-07` — **64 days ago**. A+ Content submitted still false; Brand Registry enrollment remains unresolved. |
| Rule 7 — Human gates on live book | ok | All `human_gates` entries are true. |

**Fired: 4 items**

### Notes
- KDP Select term end sourced from `publishing.kdp_select_term_end = "2026-07-19"`. Expiry confirmed by file.
- Countdown next window `post_launch.countdown_deal_eligible_next_term = "2026-08-18"` is 8 days away. Rule 3 will fire on the next scheduled run. Prepare Countdown Deal creative and pricing ladder in advance.
- Both free promo slots were used (Apr 25–27, May 2–3); countdown cannot run without KDP Select re-enrollment being confirmed.
- Review count remains 0 (arc_copies_sent = 0, arc_emails_sent = 0). ARC programme was never executed.

---

## Death in the Cathedral Close (B0GZD1S8HF)

**Live:** 2026-05-03 | **KDP Select term:** `kdp_select_term_end` not recorded in pipeline-state.json | **Stage:** 10 (post-launch in-progress)

| Rule | Status | Detail |
|------|--------|--------|
| Rule 1 — KDP Select term ending | **FIRED** | `kdp_select_term_end` is **not recorded** in pipeline-state.json. Computed from `live_date = 2026-05-03` + 90 days = **2026-08-01 — EXPIRED 9 days ago** (computed; field must be confirmed). Architect must log in to KDP dashboard, confirm actual term end, and record `publishing.kdp_select_term_end` in pipeline-state.json. |
| Rule 2 — Countdown Deal ending soon | ok | Countdown Deal ended 2026-06-09 (62 days ago). |
| Rule 3 — Countdown eligibility opens within 7 days | ok | If re-enrolled from ~2026-08-01, earliest eligible ~2026-08-31 (21 days away). |
| Rule 4 — BookFunnel link not live | **FIRED** | `bookfunnel_link_live = false`. Standing GAP — same standing issue as Fix Your Gut. |
| Rule 5 — Category mismatch flagged | **FIRED** | `category_mismatch_flagged = true`. Flagged 2026-06-07 — **64 days unresolved**. Local metadata corrected but KDP dashboard update blocked pending Architect login. Target categories: Amateur Sleuth + Cozy + British & Irish > Mystery & Thrillers. Book cannot rank in Cozy without this fix. |
| Rule 6 — Stage 10-postlaunch stuck | **FIRED** | `status: in_progress`, started 2026-05-03. `last_updated = 2026-05-28` — **74 days ago**. No BSR data logged since 2026-06-02 (69 days ago). No ads running, no ARC emails sent. |
| Rule 7 — Human gates on live book | ok | All listed `human_gates` entries are true. |

**Fired: 4 items**

### Notes
- `kdp_select_term_end` is absent from pipeline-state.json. Computed date (live_date + 90 days = 2026-08-01) is a best estimate only; **never invent dates — Architect must confirm the actual KDP dashboard value and record it**.
- Category mismatch is the longest-running open item across the portfolio (64 days). Wrong categories mean the book cannot surface in Cozy search or New Releases in Cozy.
- Review count remains 0 (arc_emails_sent = 0). ARC programme was never executed.
- Word count (58,030) is below series target (85,000). Not a milestone rule trigger — flagged for awareness only.

---

## Cross-Portfolio Summary

| Item | Book | Days Overdue / Until |
|------|------|---------------------|
| KDP Select expired (confirmed) | Fix Your Gut | **22 days past** (2026-07-19) |
| KDP Select expired (computed) | Cathedral Close | **9 days past** (computed 2026-08-01) |
| Stage 10 stuck | Cathedral Close | **74 days** since last update |
| Stage 08 + 10 stuck | Fix Your Gut | **64 days** since last update |
| Category mismatch unresolved | Cathedral Close | **64 days** (flagged 2026-06-07) |
| BookFunnel link | Both | Standing GAP — unchanged |
| Countdown next window | Fix Your Gut | 8 days (2026-08-18) — **fires next run** |

**Most urgent item:** Fix Your Gut KDP Select term expired **2026-07-19 (22 days ago)**. If not re-enrolled, KU page reads have stopped and Countdown Deal cannot run at all. The next Countdown Deal window opens 2026-08-18 — only 8 days away — and is worthless without confirmed re-enrollment. A single KDP dashboard login resolves both issues.

**Second most urgent:** Cathedral Close KDP Select term end not recorded — computed expiry 2026-08-01 (9 days ago). Same risk. Record the field and confirm re-enrollment status in the same session.

**Single KDP login addresses 5 of the 8 fired items (both KDP Select re-enrollments, Cathedral Close category fix, both Select confirmations needed for countdown planning).**

---

*Generated by BookFactory Milestone Sentinel (JOB 2) | Automated run 2026-08-10*
