# BookFactory Daily Brief — 2026-06-09

---

## ACTION REQUIRED

| # | Priority | Book | Action | Reply to approve |
|---|----------|------|--------|-----------------|
| 1 | **CRITICAL — TODAY** | Death in the Cathedral Close | Countdown Deal window opened 2026-06-02 and **expires today**. Log into KDP → Promotions → Countdown Deals. Confirm deal is active and post-deal price restores to GBP £6.99. Then update `books/untitled-cosy-mystery/pipeline-state.json` → `countdown_deal_run: true`. | reply **CONFIRM** |
| 2 | HIGH | Fix Your Gut for Good | Book has been in final approval (274/300) since 2026-04-19 — **51 days** — with Stage 07 (publishing) never started. Run `pre-launch-agent` then `kdp-upload-agent` to unblock. | reply **PUBLISH-GUT** |
| 3 | HIGH | Death in the Cathedral Close | Post-launch stage stuck for **37 days** with zero activity: 0 reviews, ads off, A+ off, 0 ARC emails. Run `post-launch-agent`. | reply **POSTLAUNCH** |
| 4 | HIGH | Both books | Amazon scrape has failed 3 consecutive days (bot-protection 403). No live metrics available. Either check ASINs manually in browser weekly, or configure a Keepa API key. | reply **KEEPA** to proceed with API option |
| 5 | HIGH | Both books | ASIN values in pipeline-state.json are wrong. Fix Your Gut: `asin = null` (correct ASIN: B0GXYLWS1W). Cathedral Close: `asin = AT25QRT6FPTE6` (13 chars — invalid; correct: B0GZD1S8HF). Update both state files from KDP dashboard. | reply **ASIN-FIX** |
| 6 | MEDIUM | The Dust Between Seconds | Writing stage stuck **39 days**, only 1 of 32 chapters done (3,200 / 95,000 words). Resume or defer. | reply **RESUME-DUST** |

---

## Live Book Status

*Amazon scrape failed for day 3 consecutive (HTTP 403 bot-protection). No live metrics available for any book.*

| Book | ASIN | Rating | Reviews | BSR | Price |
|------|------|--------|---------|-----|-------|
| Fix Your Gut for Good | B0GXYLWS1W | SCRAPE FAILED | SCRAPE FAILED | SCRAPE FAILED | SCRAPE FAILED |
| Death in the Cathedral Close | B0GZD1S8HF | SCRAPE FAILED | SCRAPE FAILED | SCRAPE FAILED | SUPPRESSED (Countdown Deal — final day) |

Last known values (from pipeline-state.json, both books): 0 reviews, no BSR baseline ever recorded.

---

## Upcoming Deadlines (next 14 days)

| Date | Book | Deadline |
|------|------|----------|
| **TODAY 2026-06-09** | Cathedral Close | Countdown Deal window closes — last chance to confirm |
| 2026-07-18 (est.) | Cathedral Close | KDP Select re-enrollment decision due (~14 days before 2026-08-01 term end) |
| Unknown | Fix Your Gut | KDP Select term end — `kdp_select = null` in state file; Architect input needed to determine date |

---

## Standing Gaps

| Gap | Books Affected | Status |
|-----|---------------|--------|
| No BookFunnel lead magnet link live | Fix Your Gut + Cathedral Close | Unresolved — open since at least 2026-05-03 |
| Category mismatch (cosy mystery Browse Nodes) | Cathedral Close | Unverified — `category_mismatch_flagged` absent from state file; needs manual KDP check |
| Pipeline state out of sync with reality | Fix Your Gut | `kdp_status = not_started`, `published = false` despite reportedly live since 2026-04-21 |
| Book slug/folder mismatch | Cathedral Close | Book lives at `books/untitled-cosy-mystery/` — should be `books/death-in-the-cathedral-close/` |

---

## Intelligence

- **intel-freshness report not found for today** (Job 3 — runs Mondays; last run not present in repo)
- **integrity report not found for today** (Job 5 — runs Sundays; last run not present in repo)
- `intelligence/ALGO-INTELLIGENCE-CANDIDATE.md` — **not found** (Job 4 — monthly; no candidate file in repo)

No new algo candidates to review.

---

## All Clear

Nothing is all clear today — 6 action items open, 1 with a hard deadline of today.

---

*Sources: watchdog-2026-06-09.md · milestones-2026-06-09.md · intel-freshness: not found · integrity: not found · ALGO-INTELLIGENCE-CANDIDATE: not found*
