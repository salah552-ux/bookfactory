# BookFactory Milestone Sentinel — 2026-07-20

## ACTION REQUIRED (8 items)

_Today: 2026-07-20_

---

## Fix Your Gut for Good (ASIN: B0GXYLWS1W)

Live: 2026-04-21 | Stage: 10-postlaunch | KDP Select: enrolled

| Rule | Status | Detail |
|------|--------|--------|
| 1 — KDP Select term ends within 14 days | 🔴 **FIRED — OVERDUE** | Term ended **2026-07-19** (1 day ago). Re-enrollment decision is **overdue**. If not re-enrolled, book exits KDP Select and becomes ineligible for KU, Countdown Deals, and Free Days. Architect must decide: re-enroll now or go wide. |
| 2 — Countdown Deal ends within 3 days | ✅ ok | No active Countdown Deal. |
| 3 — Countdown eligibility window opens within 7 days | ✅ ok | Next window ~2026-08-18 (29 days). Not yet urgent. |
| 4 — bookfunnel_link_live == false | 🔴 **FIRED — standing GAP** | `bookfunnel_link_live = false`. LEAD-MAGNET.md and EMAIL-SEQUENCE.md created 2026-05-28 but BookFunnel link never went live. Every sale since launch has missed the email capture. Architect must create the BookFunnel page and drop the link into back matter, then rebuild EPUB. |
| 5 — category_mismatch_flagged | ✅ ok | No category mismatch flagged for this book. |
| 6 — Stage in_progress > 14 days stale | 🔴 **FIRED** | **Stage 08-products** in_progress, file last updated 2026-06-07 (43 days ago). LEAD-MAGNET.md created but BookFunnel page missing. Stage has not progressed in 43 days. |
| 6 — Stage in_progress > 14 days stale | 🔴 **FIRED** | **Stage 10-postlaunch** in_progress, file last updated 2026-06-07 (43 days ago). APLUS-CONTENT.md exists but A+ not submitted (pending Brand Registry). LAUNCH-TRACKER.md baseline created but no live KDP data ever logged. No AMS campaigns built. 43-day stall. |
| 7 — Human gate false on live book | ✅ ok | All human_gates fields in the file are true. |

**Additional observations (outside the 7 rules):**
- **0 reviews after 90 days live.** No ARC programme ran, no review-drop emails sent, arc_emails_sent = 0. Review velocity is zero. This directly suppresses Amazon ranking.
- **AMS campaigns not built.** `ams_campaigns_built = false`. Book has no paid visibility mechanism.
- **A+ Content not submitted.** APLUS-CONTENT.md exists. Blocked on Brand Registry — Architect must action enrollment.

---

## Death in the Cathedral Close (ASIN: B0GZD1S8HF)

Live: 2026-05-03 | Stage: 10-postlaunch | KDP Select: enrolled

| Rule | Status | Detail |
|------|--------|--------|
| 1 — KDP Select term ends within 14 days | 🔴 **FIRED** | live_date = 2026-05-03; KDP Select standard term = 90 days → computed term_end = **2026-08-01** (12 days from today). Re-enrollment or go-wide decision required within the next 12 days. Note: term_end not explicitly stored in pipeline-state.json — computed from live_date + 90 days using standard KDP Select term length. |
| 2 — Countdown Deal ends within 3 days | ✅ ok | Countdown Deal ended 2026-06-09 (41 days ago). No active deal. |
| 3 — Countdown eligibility window opens within 7 days | ✅ ok | Next eligibility after re-enrollment would be ~2026-08-31. Not within 7 days. |
| 4 — bookfunnel_link_live == false | 🔴 **FIRED — standing GAP** | `bookfunnel_link_live = false`. No email capture mechanism live for this book. Architect must create BookFunnel page and embed link in back matter, then rebuild EPUB. |
| 5 — category_mismatch_flagged == true | 🔴 **FIRED — standing GAP** | `category_mismatch_flagged = true`. Note from 2026-06-07: metadata updated locally but KDP dashboard change blocked until user logs in. Correct end state: Amateur Sleuth + Cozy + British & Irish > Mystery & Thrillers. Cozy category was never confirmed live. Architect must log into KDP and confirm/fix categories. |
| 6 — Stage in_progress > 14 days stale | 🔴 **FIRED** | **Stage 10-postlaunch** in_progress since 2026-05-03, file last updated 2026-05-28 (53 days ago). No BSR data logged since 2026-06-02 deal day 1. No AMS campaigns. No A+ Content. No reviews. 53-day stall. |
| 7 — Human gate false on live book | ✅ ok | All human_gates fields in the file are true. |

**Additional observations (outside the 7 rules):**
- **0 reviews after 79 days live.** arc_emails_sent = 0. No review infrastructure has fired.
- **BSR not tracked since 2026-06-02 (48 days ago).** Only one weekly_log entry exists. Current rank unknown.
- **Stage 08-products not started.** No digital product extraction has run for this book.

---

## Summary

| Book | Rules fired | Most urgent |
|------|-------------|-------------|
| Fix Your Gut for Good | 4 | KDP Select term **EXPIRED 2026-07-19** (1 day overdue) |
| Death in the Cathedral Close | 4 | KDP Select term ends **2026-08-01** (12 days) |
| **Total** | **8** | **Fix Your Gut KDP Select re-enrollment is overdue NOW** |

**Single most urgent action:** Fix Your Gut for Good KDP Select term expired yesterday (2026-07-19). Re-enrollment was due by today. If the Architect does not act immediately, the book will exit KDP Select and lose KU, Countdown Deal, and Free Day eligibility.
