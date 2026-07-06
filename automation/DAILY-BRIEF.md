# BookFactory Daily Brief — 2026-07-06

---

## ACTION REQUIRED

Two hard deadlines hit the 14-day window **today**. Both need a decision now.

### 🔴 1 — Fix Your Gut for Good: KDP Select expires in 13 days (2026-07-19)
Auto-renewal fires unless you act. If you want wide distribution (Apple, Kobo, B&N), opt out **before 2026-07-19**. If you miss it, the title is locked in KDP Select until ~2026-10-17.
> Log into KDP → Bookshelf → "Manage KDP Select" → choose Renew or Don't Renew.
> Reply **RENEW** or **GO-WIDE** to confirm your decision.

### 🔴 2 — Cathedral Close: Countdown Deal window closes in 12 days (2026-07-18)
The eligible window (from 2026-06-02) closes 14 days before the KDP Select term ends (2026-08-01). A deal must **end** by 2026-07-18 — which means schedule it today or this term's window is gone. Next opportunity: ~2026-09-01.
> KDP → Bookshelf → Cathedral Close → Promote and Advertise → Countdown Deals.
> Reply **SCHEDULED** once done, or **SKIP** to pass this term.

### 🔴 3 — Cathedral Close: Post-deal price unverified (Day 27, critical)
Countdown Deal ended 2026-06-09. Whether the price reverted to £6.99 has never been confirmed. 5-minute browser check only.
> Open amazon.co.uk → search B0GZD1S8HF → confirm live price is £6.99.
> If wrong: KDP → Pricing → correct. Reply **VERIFIED** once confirmed.

### 🔴 4 — Both books: ASINs unresolved in state files (Day 29)
- *Fix Your Gut*: ASIN is null in pipeline-state.json (book may be live since 2026-04-21 — state is 78 days stale).
- *Cathedral Close*: ASIN `AT25QRT6FPTE6` is 13 characters — invalid (must be 10).
> KDP → Bookshelf → copy exact ASINs for both titles. Update both pipeline-state.json files.
> Reply **ASINS UPDATED** once done.

### 🔴 5 — Watchdog completely blind (Day 29, 41% run coverage)
Amazon 403s block every automated scrape. No BSR, rating, or price data for either book since monitoring began.
> Three options: **(A)** manual browser check + paste metrics into pipeline-state.json; **(B)** add `RAINFOREST_API_KEY` or `KEEPA_API_KEY` to environment; **(C)** Keepa Chrome extension one-time export.
> Reply **OPTION A**, **OPTION B**, or **OPTION C**.

### 🟡 6 — New ALGO-INTELLIGENCE-CANDIDATE.md awaiting review (drafted 2026-07-01)
9 findings (3 HIGH confidence): DRM-free EPUB/PDF downloads, KDP Select now permits library distribution, Sponsored Brands open to single-book authors. No `ALGO-INTELLIGENCE.md` exists yet — this is the inaugural sweep. Needs your sign-off to become the v1.0 baseline.
> Read `intelligence/ALGO-INTELLIGENCE-CANDIDATE.md` → reply **PROMOTE** to create ALGO-INTELLIGENCE.md.

---

## Live Book Status

Watchdog has been scrape-blocked for 29 consecutive days (403 bot-protection). All metrics below are UNVERIFIED.

| Book | Rating | Reviews | BSR | Price | Note |
|------|--------|---------|-----|-------|------|
| Fix Your Gut for Good (B0GXYLWS1W) | unknown | 0 (last recorded) | unknown | unknown | State shows unpublished but anchored live 2026-04-21 |
| Death in the Cathedral Close (B0GZD1S8HF) | unknown | 0 (last recorded) | unknown | £6.99 UNVERIFIED (deal ended Day 27) | Live since 2026-05-03; ads not started; 0 ARC emails sent |

---

## Upcoming Deadlines (next 14 days)

| Date | Book | Deadline | Risk if missed |
|------|------|----------|---------------|
| **2026-07-18** | Cathedral Close | Countdown Deal must END by this date | Window lost; next opportunity ~2026-09-01 |
| **2026-07-19** | Fix Your Gut | KDP Select term expires | Auto-renewed into KDP Select until ~2026-10-17 |

No other deadlines in the next 14 days.

---

## Standing Gaps

These have been open for multiple weeks and will keep firing until resolved.

| Gap | Books affected | Open since |
|-----|---------------|------------|
| BookFunnel capture link not live | Fix Your Gut + Cathedral Close | Unknown |
| Cathedral Close category mismatch (Cozy > General + British & Irish) | Cathedral Close | Unknown — treat as flagged until verified in KDP |
| State integrity contradictions (5 total, 0 resolved) | All 3 books | 2026-06-14 (4 weeks) |
| Cathedral Close: missing production files (`exports/final/` does not exist on disk) | Cathedral Close | 2026-06-21 (3 weeks) |
| Cathedral Close: `final_approval_score = null` on a live title | Cathedral Close | 2026-06-14 (4 weeks) |
| The Dust Between Seconds: writing stage stuck 67 days; chapters 1 & 2 missing from disk | Dust Between Seconds | 2026-04-30 |

---

## Intelligence

**All 3 niches are STALE** (must be run from local Playwright session — cloud agent cannot harvest):

| Niche | Last harvested | Age |
|-------|---------------|-----|
| gut-health | 2026-05-13 | 54 days |
| cozy-mystery | 2026-06-01 | 35 days |
| vagus-nerve | 2026-06-03 | 33 days |

Run in order: `harvest gut-health && analyse opportunities gut-health` → repeat for cozy-mystery → vagus-nerve.

**New algo candidate:** `intelligence/ALGO-INTELLIGENCE-CANDIDATE.md` (drafted 2026-07-01, 5 days old). 9 findings, inaugural sweep — no `ALGO-INTELLIGENCE.md` exists yet. Key items: DRM-free downloads now live, KDP Select permits library distribution, Sponsored Brands open to single-book authors, print royalty tiered at $9.99 threshold. Needs Architect review and promotion. See Action #6 above.

---

## All Clear

Nothing is all clear today. Two hard deadlines are inside the 14-day window and require decisions before tomorrow.

---

*Sources: watchdog-2026-07-06.md · milestones-2026-07-06.md · intel-freshness-2026-07-06.md · integrity-2026-07-05.md · ALGO-INTELLIGENCE-CANDIDATE.md (2026-07-01) | Brief generated 2026-07-06*
