# BookFactory Daily Brief — 2026-08-03

---

## ACTION REQUIRED (8 items)

**1. KDP Select terms expired — both live books (URGENT)**
Fix Your Gut: term ended 2026-07-19 — **15 days ago**. Cathedral Close: computed end 2026-08-01 — **2 days ago**. If auto-renew was off, both books have silently left Kindle Unlimited and are losing KENP reads right now. Log into KDP dashboard, confirm enrollment status for both ASINs, and re-enrol if needed.
→ No approval word needed — this is an emergency login, not a pipeline action.

**2. h-pylori-recovery-plan has been live 47 days with NO post-launch monitoring (CRITICAL)**
Book live since 2026-06-17 (ASIN B0H5TZTPRT). Pipeline state still shows `current_stage=9`, `stages.10-postlaunch=not_started`. Zero BSR tracking, zero review monitoring, no countdown deal schedule. Integrity audit (Job 5) flags this as the single most dangerous gap in the system.
→ Reply **ADVANCE** to have the pipeline-orchestrator set stage 10 to in_progress and run post-launch-tracker.

**3. Cathedral Close category mismatch — 57 days unresolved**
Book is sitting in Traditional Detective Mysteries instead of Cozy / Amateur Sleuth / British & Irish. Correct categories were set in local metadata but KDP dashboard change was blocked pending an Architect login. Every day in the wrong category costs ranking potential.
→ Fix during the KDP login in item 1 above.

**4. Fix Your Gut US price discrepancy — 57 days unresolved**
US storefront showing $2.99 against a £9.99 list price. First flagged 2026-06-07. Likely a pricing territory variant that was never corrected in KDP. Check and fix during the KDP login in item 1.

**5. Countdown Deal decision needed this week (Fix Your Gut)**
Next eligible window opens ~2026-08-18 (15 days away). Rule 3 will fire next week's milestone report. Decide now whether to schedule a Countdown Deal in the new Select term.
→ Reply **COUNTDOWN** to have marketing-agent design the deal, or **SKIP** to defer.

**6. New ALGO-INTELLIGENCE-CANDIDATE.md ready for review**
Drafted 2026-08-01 (2 days ago, not yet promoted). Covers 7 weeks since v1.2 (2026-06-12). Found 1 HIGH-confidence and 1 MEDIUM-confidence signal. Current ALGO-INTELLIGENCE.md is v1.2.
→ Reply **PROMOTE** to have algo-intelligence-agent merge approved entries and bump the version.

**7. BookFunnel link not live — both books**
`bookfunnel_link_live = false` on both Fix Your Gut and Cathedral Close. Standing gap since launch. Email list building is blocked until this is live.
→ Set up BookFunnel, then run `track launch <slug>` to clear the flag.

**8. All 4 intelligence niches stale — new book research blocked**
gut-health (82 days), cozy-mystery (63 days), vagus-nerve (61 days), h-pylori-gut-health (57 days). Stage 01 is gated until re-harvest. Playwright harvester must run on your local machine.
→ Run `harvest <niche> ; analyse opportunities <niche>` locally, priority: gut-health first.

---

## Live Book Status

**Scrape status: FAILED today** — proxy 403 blocked all amazon.co.uk requests. Values below are last recorded.

| Book | ASIN | Reviews | Rating | BSR (last known) | Price | Data age |
|------|------|---------|--------|-------------------|-------|----------|
| Fix Your Gut for Good | B0GXYLWS1W | 0 | — | not recorded | £9.99 / $2.99 US ⚠️ | stale (2026-06-07) |
| Death in the Cathedral Close | B0GZD1S8HF | 0 | — | #1,370,902 overall | £6.99 | 62 days (2026-06-02) |
| H. Pylori Recovery Plan | B0H5TZTPRT | unknown | unknown | unknown | unknown | never tracked |

**Note:** Watchdog connectivity is broken — amazon.co.uk is blocked by proxy policy. Manual dashboard check is the only data source until this is resolved.

---

## Upcoming Deadlines (next 14 days)

| Date | Book | Item |
|------|------|------|
| NOW | Fix Your Gut | KDP Select term — expired 15 days ago |
| NOW | Cathedral Close | KDP Select term — computed expired 2 days ago |
| 2026-08-18 | Fix Your Gut | Countdown Deal window opens (15 days — decide this week) |

---

## Standing Gaps

| Gap | Book(s) | Open Since |
|-----|---------|------------|
| BookFunnel link not live | Fix Your Gut + Cathedral Close | Launch |
| Category mismatch (Trad Detective → Cozy) | Cathedral Close | 2026-06-02 (57 days) |
| US price $2.99 vs £9.99 | Fix Your Gut | 2026-06-07 (57 days) |
| Post-launch monitoring not started | H. Pylori Recovery Plan | 2026-06-17 (47 days live) |

---

## Intelligence

**All 4 niches stale** — no harvest in 14+ days. New book research is blocked by intelligence gate (Rule 0B).

| Niche | Last Harvested | Age |
|-------|---------------|-----|
| gut-health | 2026-05-13 | 82 days |
| cozy-mystery | 2026-06-01 | 63 days |
| vagus-nerve | 2026-06-03 | 61 days |
| h-pylori-gut-health | 2026-06-07 | 57 days |

**ALGO-INTELLIGENCE-CANDIDATE.md is new** — drafted 2026-08-01. 1 HIGH + 1 MEDIUM signal since v1.2 (2026-06-12). Needs Architect review before promotion. Reply **PROMOTE** to merge.

---

## Integrity Audit (Job 5 — run 2026-08-02)

11 contradictions across 5 of 6 books. Top items already captured in ACTION REQUIRED. Additional notable gaps:

- `the-dust-between-seconds`: `completed_chapters=1` but agent log says "Chapter 3 complete and approved" — field needs correcting to 3.
- Both live books: `pdf_path` and `docx_path` are null despite `pdf_built=true` — paths never confirmed.
- `vagus-nerve-gut-reset-workbook`: `last_updated` is 2 days behind last agent run (cosmetic).

---

## All Clear

Nothing green today. 8 items need you — KDP dashboard login resolves items 1, 3, and 4 in a single session.

---

*Generated by BookFactory morning briefing (JOB 6) — 2026-08-03. Sources: watchdog-2026-08-03.md, milestones-2026-08-03.md, intel-freshness-2026-08-03.md, integrity-2026-08-02.md, ALGO-INTELLIGENCE-CANDIDATE.md.*
