# BookFactory Daily Brief — 2026-07-20

---

## ACTION REQUIRED (6 items)

### 1 — Fix Your Gut for Good: KDP Select EXPIRED YESTERDAY — OVERDUE
`kdp_select_term_end = 2026-07-19`. Term ended yesterday. If not already re-enrolled, the book is now exiting KDP Select and losing KU, Countdown Deal, and Free Day eligibility. Log into KDP now and confirm status.
> Reply **REENROLL** or **GOWIDE** to close this item.

### 2 — Death in the Cathedral Close: KDP Select ends in 12 days (est. 2026-08-01)
Computed from `live_date 2026-05-03 + 90 days`. Re-enrollment or go-wide decision due by 2026-08-01.
> Reply **REENROLL** or **GOWIDE** to close this item.

### 3 — Both live books: Amazon scrape FAILED (2nd consecutive week)
HTTP 403 bot-block on amazon.co.uk for both titles (2026-07-13 and 2026-07-20). All alert rules (rating drop, BSR worsening, price change, new bad reviews) cannot fire. Manual check required — log BSR, rating, and review count into each book's `pipeline-state.json weekly_log`.
> Reply **LOGGED** once you've entered the numbers.

### 4 — Death in the Cathedral Close: Category mismatch still unresolved (43 days)
`category_mismatch_flagged = true` since 2026-06-07. Correct end-state: Amateur Sleuth + Cozy + British & Irish > Mystery & Thrillers. Cozy was never confirmed live in KDP.
> Reply **CATFIXED** once confirmed live in KDP.

### 5 — ALGO-INTELLIGENCE-CANDIDATE.md: awaiting review and promotion
Drafted 2026-07-01, last modified 2026-07-17. This is the inaugural sweep — no `ALGO-INTELLIGENCE.md` exists yet. All pipeline agents that read algorithm intelligence have no canonical source file.
> Reply **ALGOAPPROVED** to trigger merge into ALGO-INTELLIGENCE.md v1.0.

### 6 — H-Pylori Recovery Plan: post-launch stage never started (33 days live)
`kdp_status = "live"` since 2026-06-17, but `current_stage = 9` and `stages["10-postlaunch"].status = "not_started"`. Zero BSR baseline, zero review tracking, no ARC follow-up, no ads gate, no A+ trigger. Also: `pre_launch.launch_ready = false` (shipped without pre-launch sign-off) and `final_approval_score = 113` (book-reviewer /120 scale — 300-point audit never run). Most contradictions of any book in the portfolio (4).
> Reply **STARTPOSTLAUNCH** to unblock stage 10 for h-pylori-recovery-plan.

---

## Live Book Status

> **Watchdog SCRAPE FAILED (2nd consecutive week)** — Amazon UK returned HTTP 403 on both attempts for both titles today. Values below are last-known from pipeline-state.json. Absence of alert ≠ all clear.

| Book | ASIN | Reviews | BSR (last known) | Price | As of |
|------|------|---------|-----------------|-------|-------|
| Fix Your Gut for Good | B0GXYLWS1W | 0 | not recorded | £9.99 / $9.99 | 2026-06-07 |
| Death in the Cathedral Close | B0GZD1S8HF | 0 | 1,370,902 overall | £6.99 | 2026-06-02 (48 days stale) |

KDP Select status for Fix Your Gut is now unknown — term expired 2026-07-19; re-enrollment not confirmed in state.
Post-Countdown-Deal price for Cathedral Close not confirmed (deal ended 2026-06-09).

> Long-term fix: replace the HTTP-only watchdog with `review-miner` (Playwright-capable) to bypass Amazon's 403 bot-block.

---

## Upcoming Deadlines (next 14 days)

| Date | Book | Event |
|------|------|--------|
| **2026-07-19 (OVERDUE)** | Fix Your Gut for Good | KDP Select expired — re-enrollment decision overdue NOW |
| **~2026-08-01** | Death in the Cathedral Close | KDP Select term end — 12 days |

Next Countdown Deal window for Fix Your Gut opens ~2026-08-18 (29 days) — only relevant if already re-enrolled.

---

## Standing Gaps (unresolved week-over-week)

| Gap | Book(s) | Open since |
|-----|---------|-----------|
| BookFunnel link not live | Fix Your Gut + Cathedral Close | 90+ / 79+ days |
| Category mismatch | Cathedral Close | 2026-06-07 (43 days) |
| `final_approval_passed=true`, score=null, no FINAL-APPROVAL.md | Cathedral Close | 2026-06-14 (6 weeks) |
| Chapters 1–2 missing from disk | The Dust Between Seconds (parked) | 2026-06-14 (6 weeks) |
| No `pipeline-state.json` | cortisol-gut-health | unknown |

Both BookFunnel gaps mean every sale since launch has missed email capture. LEAD-MAGNET.md and EMAIL-SEQUENCE.md already exist — the BookFunnel page itself is the only remaining step for Fix Your Gut.

---

## Intelligence

**All 4 niches STALE** — must re-harvest from local Playwright session (cloud cannot run harvester):

| Niche | Last harvested | Age | Note |
|-------|---------------|-----|------|
| gut-health | 2026-05-13 | 68 days | Most overdue; 2 live books in this niche |
| cozy-mystery | 2026-06-01 | 49 days | Cathedral Close had no BSR at 30 days post-launch |
| vagus-nerve | 2026-06-03 | 47 days | Web-search only — full Playwright harvest never run |
| h-pylori-gut-health | 2026-06-07 | 43 days | Web-search only — full Playwright harvest never run |

**ALGO-INTELLIGENCE-CANDIDATE.md** — new/unreviewed (modified 2026-07-17). This is the inaugural sweep; `ALGO-INTELLIGENCE.md` does not yet exist. All agents relying on algorithm intelligence are running without a source document.

**Integrity (Job 5 — 2026-07-19):** 13 contradictions across 5 books (up from 12 last week; +1 new in h-pylori-recovery-plan). Two longest-running unresolved (6 weeks each): Cathedral Close final_approval gate set without a score; Dust Between Seconds missing manuscript chapters. Full detail: `automation/reports/integrity-2026-07-19.md`.

---

## All Clear

Nothing is all clear today. 8 milestone rules fired across 2 books; 13 state contradictions across 5 books; all niche intelligence stale; Amazon scrape blocked two consecutive weeks; KDP Select on Fix Your Gut expired yesterday without confirmed re-enrollment.

---

*Sources: watchdog-2026-07-20.md · milestones-2026-07-20.md · intel-freshness-2026-07-20.md · integrity-2026-07-19.md · ALGO-INTELLIGENCE-CANDIDATE.md (modified 2026-07-17)*
*Brief generated: 2026-07-20 | Automated Job 6*
