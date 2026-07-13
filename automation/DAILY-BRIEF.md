# BookFactory Daily Brief — 2026-07-13

---

## ACTION REQUIRED (4 items)

### 🔴 1 — Fix Your Gut for Good: KDP Select expires in 6 days (2026-07-19) — DECIDE TODAY
`kdp_select_term_end = 2026-07-19`. You must act before midnight 2026-07-18 or the book auto-renews into another 90-day KDP Select term (locking out wide distribution until ~2026-10-17). If re-enrolling, next Countdown window = 2026-08-18.
> KDP → Bookshelf → Manage KDP Select → Renew or Don't Renew.
> Reply **REENROLL** or **GOWIDE** to confirm.

### 🔴 2 — Cathedral Close: Fix Cozy category in KDP dashboard — 41 DAYS OPEN
`category_mismatch_flagged = true` since 2026-06-02. Cozy is the highest-value discoverability lever for this book and it has been wrong for 41 days. Required categories: (1) Cozy > General, (2) British & Irish > Mystery & Thrillers.
> KDP → Bookshelf → Cathedral Close → Edit eBook details → Categories.
> Reply **CATFIXED** once live in KDP.

### 🔴 3 — H-Pylori Recovery Plan: post-launch never initiated (live 26 days, stage 10 = not_started)
ASIN B0H5TZTPRT live since 2026-06-17. Pipeline has zero post-launch tracking: no BSR baseline, no review velocity, no ARC follow-up, no ads gate, no A+ trigger. Also flagged: `pre_launch.launch_ready = false` (book shipped without pre-launch sign-off) and `final_approval_score = 113` (this is the book-reviewer /120 score — the 300-point final-approval-agent audit has never been run).
> Reply **POSTLAUNCH** to queue post-launch-tracker + final-approval-agent for h-pylori-recovery-plan.

### 🟡 4 — Both live books: BookFunnel links still not live — ongoing email subscriber gap
Fix Your Gut: lead magnet (Gut Trigger Cheat Sheet) exists on disk since 2026-05-28 but no BookFunnel page created. Cathedral Close: no lead magnet built at all. Every week without this loses subscribers.
> Reply **BOOKFUNNEL** to queue email-list-builder for Cathedral Close and BookFunnel setup for both.

---

## Live Book Status

> **Watchdog SCRAPE FAILED today** — Amazon UK returned HTTP 403 on both attempts for both titles. Values below are last-known from pipeline-state.json. Absence of an alert ≠ all clear.

| Book | ASIN | Reviews | Rating | BSR (last known) | Price | As of |
|------|------|---------|--------|-----------------|-------|-------|
| Fix Your Gut for Good | B0GXYLWS1W | 0 | — | not recorded | £9.99 / $9.99 | 2026-06-07 |
| Death in the Cathedral Close | B0GZD1S8HF | 0 | — | 1,370,902 overall | £6.99 | 2026-06-02 |
| H-Pylori Recovery Plan | B0H5TZTPRT | unknown | unknown | unknown | unknown | never scraped |

Persistent 403 issue: consider scheduling review-miner (Playwright-capable) for weekly live-book checks instead of the HTTP-only watchdog.

---

## Upcoming Deadlines (next 14 days)

| Date | Book | Action |
|------|------|--------|
| **2026-07-19** | Fix Your Gut for Good | KDP Select term expires — renew or go wide (6 days — ACTION 1) |
| ~2026-08-01 | Cathedral Close | KDP Select term likely expires (estimated from 2026-05-03 live date; exact date not in pipeline-state.json — confirm in KDP now and add `kdp_select_term_end` to state) |

---

## Standing Gaps (unresolved week-over-week)

| Gap | Book(s) | Open since |
|-----|---------|-----------|
| BookFunnel link not live | Fix Your Gut + Cathedral Close | 2026-05-28 / never |
| Cozy category mismatch | Cathedral Close | 2026-06-02 (41 days) |
| `final_approval_passed=true` but `score=null`, no FINAL-APPROVAL.md | Cathedral Close | 2026-06-14 (5 weeks) |
| Chapters 1–2 missing from disk | The Dust Between Seconds (parked) | 2026-06-14 (5 weeks) |
| `kdp_select_term_end` missing from state | Cathedral Close | ongoing |
| `cortisol-gut-health` has no pipeline-state.json | cortisol-gut-health | unknown |

---

## Intelligence

**All 4 niches STALE** — must be run from your local Playwright session (cloud agent cannot harvest):

| Niche | Last harvested | Age |
|-------|---------------|-----|
| gut-health | 2026-05-13 | 61 days |
| cozy-mystery | 2026-06-01 | 42 days |
| vagus-nerve | 2026-06-03 | 40 days — NOTE: only partial web-search harvest; no Playwright BSR scrape ever run |
| h-pylori-gut-health | 2026-06-07 | 36 days — NOTE: same, web-search only |

Commands: `harvest <niche>` then `analyse opportunities <niche>` for each, in sequence.

**ALGO-INTELLIGENCE-CANDIDATE.md** exists (last git-touched 2026-07-04). No new candidate this week. Prior brief noted 9 findings pending Architect review — if not yet promoted, reply **PROMOTE** to create ALGO-INTELLIGENCE.md v1.0.

---

## Integrity Snapshot (Job 5 — 12 contradictions across 6 books, up from 5 last week)

10 new this audit, 2 are 5-week recurrences. Most serious: h-pylori-recovery-plan (3 contradictions — live title with no post-launch pipeline, wrong final_approval metric, pre-launch gate never closed). Full detail in `automation/reports/integrity-2026-07-13.md`.

---

## All Clear

Nothing is all clear today. Resolve the KDP Select renewal (ACTION 1) before 2026-07-18.

---

*Sources: watchdog-2026-07-13.md · milestones-2026-07-13.md · intel-freshness-2026-07-13.md · integrity-2026-07-13.md · ALGO-INTELLIGENCE-CANDIDATE.md (git: 2026-07-04) | Brief generated 2026-07-13*
