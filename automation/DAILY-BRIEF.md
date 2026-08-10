# BookFactory Daily Brief — 2026-08-10

---

## ACTION REQUIRED (8 items)

**1. KDP login needed TODAY — fixes items 1–4 in a single session**
Fix Your Gut KDP Select expired **22 days ago** (2026-07-19). Cathedral Close computed-expired **9 days ago** (2026-08-01). If auto-renew was off, both books have left Kindle Unlimited silently. The Fix Your Gut Countdown Deal window opens in **8 days (2026-08-18)** — worthless without confirmed re-enrollment. A single KDP dashboard visit resolves items 1, 2, 3, and 4.
→ No reply word needed — this is an emergency login.

**2. Countdown Deal decision — 8 days (Fix Your Gut)**
Window opens 2026-08-18. Must decide NOW so marketing-agent can prep the deal. Cannot run without confirmed KDP Select re-enrollment (see item 1).
→ Reply **COUNTDOWN** to schedule the deal, or **SKIP** to defer.

**3. Cathedral Close category fix — 69 days unresolved**
Book is in Traditional Detective Mysteries, not Cozy / Amateur Sleuth / British & Irish. Local metadata corrected; KDP dashboard not updated. Fix during the item 1 login.
→ No separate reply needed — fix during KDP login.

**4. Fix Your Gut US price — 64 days unresolved**
US storefront showing $2.99 against £9.99 list. Fix during the item 1 login.
→ No separate reply needed — fix during KDP login.

**5. h-pylori Recovery Plan — live 53 days, NO post-launch monitoring (CRITICAL)**
ASIN B0H5TZTPRT. Live since 2026-06-17. Pipeline state still shows `current_stage=9`, `stages.10-postlaunch=not_started`. Zero BSR tracking, zero review monitoring, no countdown scheduling. **4th consecutive week flagged as CRITICAL** by integrity audit.
→ Reply **ADVANCE** to have pipeline-orchestrator start stage 10 and run post-launch-tracker.

**6. BookFunnel link — both live books**
`bookfunnel_link_live = false` on both Fix Your Gut (74+ days) and Cathedral Close. Email list is not growing.
→ Set up BookFunnel, then run `track launch <slug>` to clear the flag.

**7. All 4 intelligence niches stale — new book research blocked**
gut-health (89 days), cozy-mystery (70 days), vagus-nerve (68 days), h-pylori-gut-health (64 days). Intelligence gate (Rule 0B) blocks Stage 01 until re-harvest. Must run on your **local machine** (cloud Playwright cannot reach Amazon).
→ Run `harvest <niche> ; analyse opportunities <niche>` locally. Priority: gut-health first.

**8. ALGO-INTELLIGENCE-CANDIDATE.md — 9 days since draft, not yet promoted**
Drafted 2026-08-01. 1 HIGH + 1 MEDIUM signal found since v1.2 (2026-06-12). Needs Architect review.
→ Reply **PROMOTE** to have algo-intelligence-agent merge and bump version.

---

## Live Book Status

*Scrape FAILED today (second consecutive week) — proxy blocks amazon.co.uk and amazon.com. All values below are last recorded. No live data available.*

| Book | ASIN | Reviews | Rating | BSR (last known) | Price | Data age |
|------|------|---------|--------|-----------------|-------|----------|
| Fix Your Gut for Good | B0GXYLWS1W | 0 | — | not recorded | £9.99 / $2.99 US ⚠️ | stale (2026-06-07) |
| Death in the Cathedral Close | B0GZD1S8HF | 0 | — | #1,370,902 overall | £6.99 | 69 days (2026-06-02) |
| H. Pylori Recovery Plan | B0H5TZTPRT | unknown | unknown | never tracked | unknown | never tracked |

**Watchdog blocker (week 2):** Proxy policy blocks all Amazon egress. Automated monitoring is dark until the proxy allows amazon.co.uk / amazon.com, or a third-party API (Keepa, Rainforest) is configured.

---

## Upcoming Deadlines (next 14 days)

| Date | Book | Item |
|------|------|------|
| **NOW** | Fix Your Gut | KDP Select expired 22 days ago — re-enrollment unconfirmed |
| **NOW** | Cathedral Close | KDP Select computed-expired 9 days ago — unconfirmed |
| **2026-08-18** | Fix Your Gut | Countdown Deal window opens — 8 days; must decide this week |

---

## Standing Gaps

| Gap | Book(s) | Open Since |
|-----|---------|------------|
| BookFunnel link not live | Fix Your Gut + Cathedral Close | Launch |
| Category mismatch (Trad Detective → Cozy) | Cathedral Close | 2026-06-02 (69 days) |
| US price $2.99 vs £9.99 | Fix Your Gut | 2026-06-07 (64 days) |
| Post-launch monitoring not started | H. Pylori Recovery Plan | 2026-06-17 (53 days live) |
| Watchdog connectivity — Amazon egress blocked | All | 2026-08-03 (7 days) |

---

## Intelligence

**All 4 niches STALE.** No niche has been harvested within the 14-day threshold. New book research is blocked.

| Niche | Last Harvested | Age |
|-------|---------------|-----|
| gut-health | 2026-05-13 | 89 days |
| cozy-mystery | 2026-06-01 | 70 days |
| vagus-nerve | 2026-06-03 | 68 days |
| h-pylori-gut-health | 2026-06-07 | 64 days |

**ALGO-INTELLIGENCE-CANDIDATE.md present** — drafted 2026-08-01 (9 days ago), not yet promoted. 1 HIGH + 1 MEDIUM signal since v1.2. Reply **PROMOTE** to advance it.

**Integrity audit (run 2026-08-09):** 14 contradictions across 5 of 6 books (up from 11 last week; 3 new this week). All 11 from 2026-08-02 persist unresolved. Most serious: h-pylori stage 10 gap (C6 — 4th consecutive week, CRITICAL). New this week: h-pylori final_approval_score field records 113 instead of a valid /300 score (C8); the-7-day stage ordering issue (C10); the-7-day cover_built field vs build_note contradiction (C11). Secondary: the-dust-between-seconds completed_chapters=1 but log says Chapter 3 done (should be 3).

---

## All Clear

Nothing green today. 8 items need you. A single KDP dashboard login resolves items 1, 3, and 4 and unblocks item 2.

---

*Generated by BookFactory morning briefing (JOB 6) — 2026-08-10. Sources: watchdog-2026-08-10.md, milestones-2026-08-10.md, intel-freshness-2026-08-10.md, integrity-2026-08-09.md, ALGO-INTELLIGENCE-CANDIDATE.md (drafted 2026-08-01).*
