# BookFactory Daily Brief — 2026-07-27

---

## ACTION REQUIRED

**4 items need your decision today.**

### 1. 🔴 Fix Your Gut for Good — KDP Select EXPIRED 8 days ago
KDP Select term ended **2026-07-19**. Auto-renewal may or may not have fired. If it lapsed, the book is no longer KU-eligible and cannot run a Countdown Deal on 2026-08-18.
→ Check KDP dashboard now. If auto-renewed, note it in pipeline-state.json. If not, re-enroll immediately.
→ *Once confirmed: reply* **SELECT-CONFIRMED** *to mark resolved.*

### 2. 🟠 Death in the Cathedral Close — KDP Select term-end UNKNOWN, likely 5 days away
`kdp_select_term_end` is absent from pipeline-state.json. Standard 90-day term from live date (2026-05-03) would expire ~**2026-08-01** — 5 days from now. No re-enrollment decision recorded.
→ Check KDP dashboard for exact term-end date. Add it to pipeline-state.json.
→ *Once confirmed: reply* **SELECT-DITC-CONFIRMED**

### 3. 🟠 Vagus Nerve Gut Reset Workbook — cleared for upload 30 days ago, still unpublished
All Stage 06 gates passed on 2026-06-26. `final_approval_score = 291/300`. Cover, EPUB, PDF — all built. Zero action taken since.
→ Ready to go live. Invoke `kdp-upload-agent` when ready.
→ *Reply* **UPLOAD** *to trigger the agent.*

### 4. 🟡 h-pylori Recovery Plan — live 39 days, post-launch never started
Live since 2026-06-17 (ASIN B0H5TZTPRT). Stage 10 status: `not_started`. Zero BSR/KU/review data logged. Also: `final_approval_score = 113` (book-reviewer /120 scale — the 300-point final-approval-agent audit was never run).
→ Run `post-launch-tracker` with current KDP dashboard readings. Run `final-approval-agent`.
→ *Reply* **TRACK** *to start the post-launch sequence.*

---

## Live Book Status

> ⚠️ Watchdog has failed for **3 consecutive weeks** (HTTP 403 bot-block). All values below are stale. No alert rules could be evaluated. **Absence of alerts ≠ all clear.**

| Book | Rating | Reviews | BSR | Price | Last scraped |
|------|--------|---------|-----|-------|-------------|
| Fix Your Gut for Good (B0GXYLWS1W) | scrape failed | 0 (as of 2026-06-07) | not recorded | £9.99 / US ~$2.99 noted | 2026-07-27 (failed) |
| Death in the Cathedral Close (B0GZD1S8HF) | scrape failed | 0 (as of 2026-06-02) | 1,370,902 (as of 2026-06-02) | £6.99 | 2026-07-27 (failed) |

**Watchdog fix needed:** Switch from HTTP fetch to Playwright-based agent (`review-miner` or `harvester-agent`). Current watchdog cannot bypass Amazon's 403 block.

---

## Upcoming Deadlines (next 14 days)

| Date | Book | Item |
|------|------|------|
| **2026-08-01** (5 days) | Death in the Cathedral Close | Likely KDP Select term expiry — **unconfirmed, needs KDP login today** |
| **2026-08-18** (22 days) | Fix Your Gut for Good | Next Countdown Deal window — only opens if Select re-enrolled |

---

## Standing Gaps

These have been open since ~2026-05-31 across both live books:

| Gap | Books affected | Status |
|-----|---------------|--------|
| BookFunnel link not live | Fix Your Gut + Death in the Cathedral Close | Open since 2026-05-31. Lead magnet written; link only missing piece. |
| Category mismatch unconfirmed | Death in the Cathedral Close | Metadata corrected locally 2026-06-07; KDP live categories blocked on Architect KDP login. Target: Amateur Sleuth + Cozy + British & Irish > Mystery. |

---

## Intelligence

**All 4 niches stale** — any new book blueprint is blocked (Rule 0B) until re-harvest.

| Niche | Last harvested | Age |
|-------|---------------|-----|
| gut-health | 2026-05-13 | **75 days** |
| cozy-mystery | 2026-06-01 | 56 days |
| vagus-nerve | 2026-06-03 | 54 days |
| h-pylori-gut-health | 2026-06-07 | 50 days |

Re-harvest requires your local machine (Playwright). Commands: `harvest <niche> ; analyse opportunities <niche>` in priority order above.

**Algo candidate present:** `intelligence/ALGO-INTELLIGENCE-CANDIDATE.md` drafted 2026-07-01 — **26 days without review**. `ALGO-INTELLIGENCE.md` (v1.0) has never been created. All downstream discoverability agents are running without an algo baseline. Review the candidate and promote approved entries.
→ *Reply* **ALGO-PROMOTE** *to invoke algo-intelligence-agent for the merge.*

---

## Integrity (from 2026-07-26 audit)

13 contradictions across 5 books — **unchanged for the second week running.** None resolved.

Most serious: `h-pylori-recovery-plan` — 4 contradictions, live book, invalid quality gate (score 113 ≠ 300-point audit), 39 days without post-launch data. See Action #4 above.

Two 7-week-old contradictions still open:
- `death-in-the-cathedral-close`: `final_approval_score = null` but `final_approval_passed = true` (no FINAL-APPROVAL.md ever run)
- `the-dust-between-seconds`: `completed_chapters = 1` but `current_chapter = 04`; Chapters 1 and 2 missing from `manuscript/`

---

## All Clear

Nothing is fully green today. 4 decisions needed; 2 standing gaps unresolved; watchdog blind for 3 weeks.
