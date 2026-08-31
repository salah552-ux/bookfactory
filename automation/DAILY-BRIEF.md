# BookFactory Daily Brief — 2026-08-31

---

## ACTION REQUIRED (6 items — 1 time-critical TODAY)

### 🔴 1. Cathedral Close — Countdown Deal window opens TOMORROW (~2026-09-01)
KDP Select term end date was never recorded. If auto-renewed, the 90-day Countdown window opens ~2026-09-01. **You must log in to KDP today**, confirm Select is active, and schedule the deal before the window opens — every day it sits unused is a burned promo slot.  
Once confirmed + scheduled → reply **CATHEDRAL-DEAL** and invoke `amazon-ads-agent` for bid prep.

### 🔴 2. Fix Your Gut — KDP Select expired 43 days ago (2026-07-19)
KU eligibility and the Countdown Deal are both blocked. The Countdown window opened 13 days ago (2026-08-18) and is burning unused. **This has been flagged 5 consecutive weeks with no resolution.**  
Log in to KDP, confirm re-enrollment, update `publishing.kdp_select_term_end` in pipeline-state.json → reply **GUT-SELECT-CONFIRMED**.

### 🔴 3. h-pylori-recovery-plan — live 74 days, post-launch tracking NEVER opened
ASIN B0H5TZTPRT has been live since 2026-06-17. Stage 10-postlaunch was never started. BSR, reviews, KU pages, and ad performance have been uncollected for the entire post-launch window — which is nearly expired.  
Reply **START-HPYLORI** → invoke `pipeline-orchestrator` for `h-pylori-recovery-plan`.

### 🟠 4. Cathedral Close — Category mismatch, 85 days open
Book is in Traditional Detective Mysteries instead of Cozy + Amateur Sleuth + British & Irish. Costs discoverability every day.  
Log in to KDP and update categories. Reply **CATFIX-DONE** when live.

### 🟡 5. ALGO-INTELLIGENCE-CANDIDATE.md — unreviewed for 30 days
Filed 2026-08-01. HIGH-confidence finding: **KDP 70% royalty ceiling raised from $9.99 to $12.99** (effective July 7, 2026). Affects `publisher-agent`, `marketing-agent`, `kdp-upload-agent` pricing guidance. Any agent currently instructing "cap at $9.99 for 70%" is wrong.  
Review the file, then reply **PROMOTE-ALGO** to merge into ALGO-INTELLIGENCE.md.

### 🟡 6. Amazon scrape blocked — watchdog blind since 2026-08-24
Egress proxy blocks amazon.co.uk and amazon.com on every scheduled run. No live BSR or review data for either book.  
Fix: add `www.amazon.co.uk` and `www.amazon.com` to the scheduled environment's network allow-list (Claude Code on the Web → environment settings → Network access). Reply **EGRESS-FIXED** when done.

---

## Live Book Status

*Watchdog scrape failed (egress blocked). Figures below are from pipeline-state.json baselines — not live.*

| Book | ASIN | BSR (last recorded) | Reviews | Live since |
|------|------|---------------------|---------|-----------|
| Fix Your Gut for Good | B0GXYLWS1W | not recorded | 0 | 2026-04-21 |
| Death in the Cathedral Close | B0GZD1S8HF | 1,370,902 main (2026-06-02) | 0 | 2026-05-03 |
| h-pylori Recovery Plan ⚠️ | B0H5TZTPRT | not recorded | 0 | 2026-06-17 |

*h-pylori is live but outside watchdog scope. 74 days post-live with no pipeline tracking (see Action #3).*

---

## Upcoming Deadlines (next 14 days)

| Date | Item | Urgency |
|------|------|---------|
| **~2026-09-01 (tomorrow)** | Cathedral Close Countdown window opens (estimated) | Act today |
| Ongoing (burning) | Fix Your Gut Countdown window open since 2026-08-18 | Blocked by Select expiry |

---

## Standing Gaps (until resolved)

| Gap | Book(s) | Open since | Days |
|-----|---------|-----------|------|
| BookFunnel link not live | Both live books | 2026-05-31 | 92 |
| Cathedral Close category mismatch | Cathedral Close | 2026-06-02 | 85 |
| Author Central UK/US not live | Fix Your Gut | 2026-04-21 | 132 |
| Goodreads listing not live | Fix Your Gut | 2026-04-21 | 132 |
| Amazon egress blocked (watchdog blind) | Both | 2026-08-24 | 7 |

---

## Intelligence

**All 4 niches STALE** — must be re-harvested in your **local** session (cloud can't run Playwright):

| Niche | Last harvest | Age | Quality |
|-------|-------------|-----|---------|
| gut-health | 2026-05-13 | 110 days | Full |
| cozy-mystery | 2026-06-01 | 91 days | Full |
| vagus-nerve | 2026-06-03 | 89 days | ⚠️ PARTIAL (web-search only) |
| h-pylori-gut-health | 2026-06-07 | 85 days | ⚠️ PARTIAL (web-search only) |

**ALGO-INTELLIGENCE-CANDIDATE.md is new since last week's check** (filed 2026-08-01, not yet promoted).  
Key: KDP royalty ceiling raised to $12.99 (HIGH confidence) — see Action #5.

---

## All Clear

Nothing is all clear today. 6 actions pending, including one same-day deadline (Cathedral Close countdown), one 43-day stale KDP Select expiry, and one live book that has never had post-launch tracking opened.

---

*Sources: watchdog-2026-08-31.md · milestones-2026-08-31.md · intel-freshness-2026-08-31.md · integrity-2026-08-30.md · intelligence/ALGO-INTELLIGENCE-CANDIDATE.md*
