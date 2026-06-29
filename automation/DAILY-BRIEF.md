# BookFactory Daily Brief — 2026-06-29

---

## ACTION REQUIRED

| # | Priority | Item | Reply to approve |
|---|----------|------|-----------------|
| 1 | 🔴 CRITICAL — Day 20 unactioned | **Cathedral Close price unverified post-Countdown Deal.** Deal ended 2026-06-09. Open amazon.co.uk → search `B0GZD1S8HF` → confirm price shows £6.99. If wrong, fix in KDP Pricing immediately. 5-minute browser check. | Reply **PRICE-OK** |
| 2 | 🔴 HIGH — 6 days to deadline | **Fix Your Gut — KDP Select re-enrollment decision due 2026-07-05.** Term ends 2026-07-19 (20 days). Auto-renews unless you opt out. Decide: stay in KU, or go wide? | Reply **RENEW** or **OPT-OUT** |
| 3 | 🔴 HIGH — 19 days to hard deadline | **Cathedral Close — Countdown Deal window closes 2026-07-18.** Must end ≥14 days before KDP Select term end (2026-08-01). Miss this = next chance earliest 2026-09-01. Schedule via KDP dashboard now. | Reply **SCHEDULE-DEAL** |
| 4 | 🔴 HIGH — Day 22 | **Monitoring completely blind.** Amazon 403 on every scrape for 22 days (11/11 runs). Pick a fix: (A) paste BSR/rating/reviews manually into both pipeline-state.json files, (B) add `RAINFOREST_API_KEY` or `KEEPA_API_KEY` to env, (C) Keepa Chrome extension one-off export. | Reply **MANUAL**, **API-KEY**, or **KEEPA** |
| 5 | 🔴 HIGH — Day 22 | **ASIN discrepancies unresolved.** Fix Your Gut: state shows `null` (treated as unpublished). Cathedral Close: `AT25QRT6FPTE6` is 13 chars — invalid. Log into KDP Bookshelf → copy exact 10-char ASINs for both → update both pipeline-state.json files. | Reply **ASINS-FIXED** |

---

## Live Book Status

All scrapes failed — Amazon returned HTTP 403 on every attempt (11 consecutive runs, 22 calendar days). No live metrics. Previous known values: 0 reviews, no BSR baseline for either book.

| Book | Rating | Reviews | BSR | Price |
|------|--------|---------|-----|-------|
| Fix Your Gut for Good (B0GXYLWS1W) | — | — | — | — |
| Death in the Cathedral Close (B0GZD1S8HF) | — | — | — | 🔴 £6.99 UNVERIFIED (day 20) |

*Two multi-day reporting gaps in 12 days (06-17→06-21 and 06-23→06-28) — automated scheduler needs investigation.*

---

## Upcoming Deadlines (next 14 days)

| Date | Days | Item |
|------|------|------|
| **2026-07-05** | **6 days** | KDP Select re-enrollment decision — Fix Your Gut for Good (term ends 2026-07-19) |

**Beyond 14 days but time-sensitive:**
- **2026-07-18** (19 days) — Cathedral Close Countdown Deal last eligible end date this KDP Select term.

---

## Standing Gaps

| Gap | Book(s) | Age |
|-----|---------|-----|
| No BookFunnel capture link live | Both books | Ongoing |
| Category mismatch (Cozy > General) unverified | Cathedral Close | Ongoing — verify KDP dashboard |
| Zero reviews, 0 ARC emails, ads never started | Cathedral Close | 57 days live — run `arc-manager-agent` + `amazon-ads-agent` |
| Stage 10-postlaunch stuck, `post-launch-agent` never run | Cathedral Close | 57 days |
| Writing stage stuck, Chapters 1–2 missing from disk | The Dust Between Seconds | 60 days (only 1/32 chapters on disk) |
| Production files missing on disk (EPUB + cover) | Cathedral Close | `exports/final/` does not exist — run `bash build-manuscript.sh untitled-cosy-mystery` |
| Stage 06 complete but no builds exist on disk | Fix Your Gut for Good | `epub_built=false`, `pdf_built=false`, no files found |

---

## Intelligence

**Niche freshness — all 3 stale (run in your LOCAL terminal, not cloud):**

| Niche | Last harvested | Age |
|-------|---------------|-----|
| gut-health | 2026-05-13 | 47 days |
| cozy-mystery | 2026-06-01 | 28 days |
| vagus-nerve | 2026-06-03 | 26 days |

**Algo candidate (Job 4 — monthly):** `intelligence/ALGO-INTELLIGENCE-CANDIDATE.md` not found — no new candidate this cycle.

---

## All Clear

Nothing is all clear today. 5 ACTION REQUIRED items; monitoring blind 22 days; 5 state integrity contradictions open 2–3 weeks.

---

*Sources: watchdog-2026-06-29.md · milestones-2026-06-29.md · intel-freshness-2026-06-29.md · integrity-2026-06-29.md · ALGO-INTELLIGENCE-CANDIDATE.md (not found)*
*Generated: 2026-06-29*
