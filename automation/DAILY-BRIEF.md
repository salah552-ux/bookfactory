# BookFactory Daily Brief — 2026-06-14

---

## ACTION REQUIRED — 5 items

**1. 🔴 CRITICAL (Day 5) — Cathedral Close price NOT confirmed post-deal**
Countdown Deal ended 2026-06-09. £6.99 restoration unconfirmed for 5 consecutive days. Open amazon.co.uk → search ASIN B0GZD1S8HF → confirm live price is £6.99. If wrong, fix in KDP → Pricing immediately.
→ Reply **PRICE-OK** once confirmed, or **PRICE-WRONG** if manual correction needed.

**2. 🔴 HIGH (Day 8) — Fix ASIN discrepancies in both pipeline-state.json files**
| Book | State file currently | Must become |
|---|---|---|
| Fix Your Gut for Good | `asin: null`, `published: false`, `kdp_status: not_started` | ASIN B0GXYLWS1W; mark live (since 2026-04-21) |
| Death in the Cathedral Close | `asin: AT25QRT6FPTE6` (invalid — 13 chars) | Correct 10-char ASIN — pull from KDP Bookshelf |
→ Reply **ASINS-FIXED** to trigger agent-log MODE 2 corrections.

**3. 🔴 HIGH (Day 8) — Amazon monitoring blind: 7 consecutive scrape failures (403)**
All watchdog metrics (BSR, reviews, rating, price) unverifiable since 2026-06-07. Pick a resolution:
- (A) Manual browser check today + paste metrics into pipeline-state.json
- (B) Keepa API key for automated pulls
- (C) Keepa Chrome extension one-off BSR export
→ Reply **MANUAL**, **KEEPA-API**, or **KEEPA-EXT** to confirm resolution path.

**4. 🔴 HIGH — 0 reviews on both books; Amazon Ads permanently locked (Gate 1 = 5 reviews)**
Both books at 0 reviews. ARC emails sent: 0 on both titles. Cathedral Close is 42 days post-launch with zero review-generation activity. Gate 1 ETA: infinite at current velocity — ads cannot start.
→ Reply **RUN-ARC** to fire arc-manager-agent for both books immediately.

**5. 🟡 MEDIUM — Pipeline hygiene: two stale state files + Stage 10 stuck 42 days**
- Fix Your Gut: pipeline-state.json is 56 days stale; all post-launch tracking blind
- Cathedral Close: Stage 10-postlaunch `in_progress` since 2026-05-03 with zero logged agent runs
→ Reply **UPDATE-STATE** to run agent-log MODE 2 (both books) + post-launch-agent (Cathedral Close).

---

## Live Book Status

*All scraped metrics SCRAPE FAILED — Amazon 403 Forbidden on every watchdog run since 2026-06-07 (7/7). Prior pipeline-state values shown.*

| Book | ASIN | Reviews | Rating | BSR | Price |
|---|---|---|---|---|---|
| Fix Your Gut for Good | B0GXYLWS1W | 0 (unverified) | null | no baseline | UNVERIFIABLE |
| Death in the Cathedral Close | B0GZD1S8HF | 0 (unverified) | null | no baseline | 🔴 £6.99 UNVERIFIED (deal ended 2026-06-09) |

*Monitoring gap: no watchdog report filed for 2026-06-11 — check scheduler config.*

---

## Upcoming Deadlines — next 14 days

*No hard deadlines in the literal next 14 days.*

| Date | Book | Event | Days out |
|---|---|---|---|
| 2026-07-05 | Fix Your Gut for Good | KDP Select 14-day renewal alert fires | 21 days |
| 2026-07-18 | Cathedral Close | KDP Select 14-day renewal alert fires | 34 days |
| 2026-07-19 | Fix Your Gut for Good | KDP Select term ends — renewal or exit decision | 35 days |
| 2026-08-01 | Death in the Cathedral Close | KDP Select term ends | 47 days |

---

## Standing Gaps

| Gap | Book(s) | Status |
|---|---|---|
| BookFunnel capture link not live | Both | No email capture active — blocks all list-building |
| Category mismatch (unconfirmed) | Cathedral Close | Unresolved — verify KDP shows Cozy > General + British & Irish > Contemporary |
| ARC programme never activated | Both | `arc_emails_sent = 0` on both; root cause of 0-review stall |
| `the-dust-between-seconds` | Third book | Not in sentinel scope; Stage 03-writing `in_progress` 45 days — consider adding to watchdog |

---

## Intelligence

- **Job 3 (intel-freshness):** No reports found at all. Runs Mondays — first expected 2026-06-15.
- **Job 5 (integrity):** No report found for today (Sunday — scheduled run day). No prior Sunday reports exist either. Likely a scheduling issue — check automation config.
- **Job 4 (ALGO-INTELLIGENCE-CANDIDATE.md):** File not found. Monthly cadence — not yet due.

---

## All Clear

Nothing confirmed green today. Monitoring has been blind for 8 days. The only items not in alert state: both KDP Select terms are >30 days from expiry; all Cathedral Close human publishing gates are true.

---

*Sources: watchdog-2026-06-14.md · milestones-2026-06-14.md · review-velocity-2026-06-12.md · intel-freshness: not found · integrity: not found · ALGO-INTELLIGENCE-CANDIDATE.md: not found*
