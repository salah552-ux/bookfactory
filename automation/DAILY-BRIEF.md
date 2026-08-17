# BookFactory Daily Brief — 2026-08-17

---

## ACTION REQUIRED

> **4 items need a decision today. Start here.**

### 1. CRITICAL — Schedule Fix Your Gut Countdown Deal TODAY
Eligibility window opens **tomorrow, 2026-08-18**. Deals must be scheduled before the window; you cannot do this after it opens. Miss it and the window doesn't return for ~90 days.
→ Log into KDP → Promotions → Countdown Deals → Schedule now.
→ Then reply **COUNTDOWN** once scheduled so the pipeline records it.

### 2. HIGH — KDP Select re-enrollment: both books unconfirmed
- **Fix Your Gut:** Select term ended **29 days ago (2026-07-19)**. No re-enrollment in pipeline-state. Book may have lost KU eligibility 29 days ago.
- **Cathedral Close:** Select term end date never recorded. Standard 90-day term from 2026-05-03 would have expired ~2026-08-01 (**16 days ago**). Unknown if auto-renewed.
→ Check both books in KDP dashboard. Confirm enrollment or re-enrol now.
→ Reply **SELECT-FYG** and/or **SELECT-CC** once confirmed.

### 3. HIGH — H-Pylori Recovery Plan: live 60 days with zero post-launch monitoring
Book has been live since **2026-06-17** (ASIN B0H5TZTPRT). `current_stage=9`, `stages["10-postlaunch"]="not_started"`. No BSR tracking, no review monitoring, no countdown deal scheduled. This has appeared in **five consecutive weekly integrity audits** with zero remediation.
→ Reply **HPYLORI** to trigger `pipeline-orchestrator` to start Stage 10.

### 4. MEDIUM — New algo candidate ready for review
`intelligence/ALGO-INTELLIGENCE-CANDIDATE.md` (drafted 2026-08-01) contains 1 high-confidence finding: **KDP 70% royalty ceiling raised from $9.99 to $12.99**, effective July 7, 2026. This affects pricing guidance in `publisher-agent`, `marketing-agent`, and `kdp-upload-agent`. The file cannot be promoted automatically — it needs your sign-off.
→ Reply **PROMOTE** to merge it into ALGO-INTELLIGENCE.md (pipeline-orchestrator will handle).

---

## Live Book Status

> Scrape failed for the **third consecutive week** — Amazon.co.uk egress blocked by proxy. All values below are from pipeline-state.json (stale).

| Book | ASIN | Reviews | Rating | BSR | Price | Last Live Data |
|------|------|---------|--------|-----|-------|----------------|
| Fix Your Gut for Good | B0GXYLWS1W | 0 | — | not recorded | £9.99 UK / $2.99 US ⚠️ | 2026-06-07 (71d ago) |
| Death in Cathedral Close | B0GZD1S8HF | 0 | — | #1,370,902 UK | £6.99 | 2026-06-02 (76d ago) |
| H-Pylori Recovery Plan | B0H5TZTPRT | unknown | unknown | unknown | unknown | Never logged |

⚠️ **Fix Your Gut US price:** $2.99 showing vs. $9.99 list — flagged 71 days ago, still unresolved.

---

## Upcoming Deadlines (next 14 days)

| Date | Book | Item |
|------|------|------|
| **2026-08-18 (TOMORROW)** | Fix Your Gut | Countdown Deal eligibility window opens — schedule TODAY |
| 2026-07-19 (29d overdue) | Fix Your Gut | KDP Select re-enrollment (term ended — see ACTION REQUIRED #2) |
| ~2026-08-01 (16d overdue) | Cathedral Close | KDP Select re-enrollment (estimated expiry — see ACTION REQUIRED #2) |

No other date-bound deadlines in the next 14 days recorded in pipeline-state.

---

## Standing Gaps

| Gap | Open Since | Days | Status |
|-----|-----------|------|--------|
| BookFunnel link — Fix Your Gut | 2026-05-31 | 78d | Lead magnet content exists; page not built |
| BookFunnel link — Cathedral Close | 2026-05-31 | 78d | No lead magnet yet |
| Cathedral Close category mismatch (Trad Detective vs Cozy + British & Irish) | 2026-06-02 | 76d | Local fix done; KDP dashboard not updated |
| Fix Your Gut US price ($2.99 vs $9.99 list) | 2026-06-07 | 71d | KDP dashboard check needed |
| Amazon.co.uk watchdog scrape blocked (proxy egress) | 2026-08-03 | 14d | No fix recorded; all alert rules unevaluable |
| Fix Your Gut Author Central (UK + US) not live | 2026-04-21 | — | Low priority but open |
| Fix Your Gut Goodreads listing not live | 2026-04-21 | — | Low priority but open |

---

## Intelligence

**All 4 niches STALE** — harvests must be run in a **local Playwright-enabled session** (cloud agent cannot run harvester).

| Niche | Last Harvested | Age |
|-------|---------------|-----|
| gut-health | 2026-05-13 | 96d 🔴 |
| cozy-mystery | 2026-06-01 | 77d 🔴 |
| vagus-nerve | 2026-06-03 | 75d 🔴 (partial harvest only) |
| h-pylori-gut-health | 2026-06-07 | 71d 🔴 (no BSR snapshots) |

Any new book blueprint or category decision for these niches is **blocked** until re-harvested locally.

**New algo candidate:** `intelligence/ALGO-INTELLIGENCE-CANDIDATE.md` drafted 2026-08-01 — not yet promoted. Key finding: KDP 70% royalty ceiling is now $12.99 (up from $9.99, effective July 7, 2026). See ACTION REQUIRED #4.

---

## Integrity (Job 5 — 2026-08-16)

19 contradictions across 5 of 6 books. Up from 14 last week (+5 new, 0 resolved).

Most serious (5 consecutive weeks unfixed): **H-Pylori Recovery Plan — live 60 days, post-launch stage not started.** See ACTION REQUIRED #3.

Next most serious: Fix Your Gut now carries 5 contradictions (stage 09 pending while current_stage=10; two out-of-order stage timestamps). Low operational risk but audit trail is broken.

Full contradiction list in `automation/reports/integrity-2026-08-16.md`.

---

## All Clear

Nothing is fully green today. The Countdown Deal deadline (tomorrow) is the single most time-sensitive item.

---

*Sources: watchdog-2026-08-17.md, milestones-2026-08-17.md, intel-freshness-2026-08-17.md, integrity-2026-08-16.md, ALGO-INTELLIGENCE-CANDIDATE.md (2026-08-01). No metrics invented — all values restated from source reports.*
