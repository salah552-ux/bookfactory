# BookFactory Daily Brief — 2026-06-15

---

## ACTION REQUIRED (6 items — lead with the price check)

### 1. 🔴 Verify £6.99 price on Cathedral Close — OVERDUE DAY 6
Countdown Deal ended 2026-06-09. KDP auto-restores list price but it has **not been manually confirmed for 6 days**. 6 days of potential revenue at wrong price.
- Open amazon.co.uk → search ASIN `B0GZD1S8HF` → confirm price shows **£6.99**
- If wrong: KDP → Pricing → correct immediately
- Then update `books/untitled-cosy-mystery/pipeline-state.json` → `post_launch.countdown_deal_run: true`
- **Reply PRICE-CONFIRMED when done**

### 2. 🔴 Fix ASIN records — OVERDUE DAY 9
| Book | Problem |
|------|---------|
| Fix Your Gut for Good | `publishing.asin = null` in state file (book appears unpublished) |
| Death in the Cathedral Close | `publishing.asin = AT25QRT6FPTE6` — 13 chars, **not a valid ASIN** (must be 10) |
Log into KDP Bookshelf, copy correct 10-char ASINs for both titles, update both `pipeline-state.json` files.
- **Reply ASINS-FIXED when done**

### 3. 🔴 Choose a scrape fix — OVERDUE DAY 9 (run 8 of 8 blocked)
All automated monitoring has failed every single run. Amazon returns 403 on every attempt. The watchdog is blind — it cannot check rating, reviews, BSR, or price for either book.
Pick one and reply:
- **MANUAL** — You open both ASINs in browser today and paste BSR/rating/reviews into each `pipeline-state.json` (immediate, no cost)
- **KEEPA** — Use Keepa Chrome extension to export BSR history as one-off baseline (free)
- **API** — Subscribe to Keepa API or RainforestAPI for automated pulls (paid, long-term fix)

### 4. 🟠 Run ARC programme for Cathedral Close — 43 days post-launch, 0 reviews
`arc_emails_sent = 0`, `review_count = 0`. ARC was never activated. Run `arc-manager-agent` to start outreach.
- **Reply RUN-ARC to approve**

### 5. 🟠 Start Amazon Ads for Cathedral Close — 43 days post-launch, ads not active
`ads_active = false`. No ads have run. Run `amazon-ads-agent`.
- **Reply RUN-ADS to approve**

### 6. 🟡 Update Fix Your Gut pipeline-state.json — 57 days stale
File says `kdp_status = not_started`, `published = false` — but book went live 2026-04-21. Every downstream report for this book is unreliable until this is corrected. Run `agent-log MODE 2` after fixing ASINs (item 2 above).
- **Reply UPDATE-STATE to approve agent-log run**

---

## Live Book Status

*All scrapes failed — Amazon returned 403 (bot-block) on every attempt. Run 8 of 8 blocked. No metric values available. Last known values from pipeline-state.json:*

| Book | ASIN | Reviews | Rating | BSR | Price |
|------|------|---------|--------|-----|-------|
| Fix Your Gut for Good | B0GXYLWS1W (unverified) | 0 | — | no baseline | SCRAPE FAILED |
| Death in the Cathedral Close | B0GZD1S8HF (state ASIN invalid) | 0 | — | no baseline | 🔴 UNVERIFIED — £6.99 unconfirmed since 2026-06-09 |

---

## Upcoming Deadlines (next 14 days: 2026-06-15 → 2026-06-29)

**No calendar-triggered deadlines fire in this window.**

| Date | Event |
|------|-------|
| — | No countdown deals active |
| 2026-07-19 | Fix Your Gut KDP Select term ends (34 days — renew or opt out) |
| 2026-08-01 | Cathedral Close KDP Select term ends (47 days) |

*Note: post-launch-agent for Cathedral Close is **43 days overdue** — no hard date but treat as urgent (see items 4 & 5 above).*

---

## Standing Gaps (open until explicitly resolved)

| Gap | Affects | Status |
|-----|---------|--------|
| No BookFunnel capture link live | Both books | Unresolved — no reader emails being collected |
| Category mismatch (Cozy > General?) | Cathedral Close | Unconfirmed — treat as flagged until KDP categories verified |
| Missing watchdog run | Monitoring | 2026-06-11 report not filed — check scheduling config |

---

## Intelligence

- **Job 3 (intel-freshness) report not found for today** — runs Mondays only; next due 2026-06-16 (tomorrow).
- **Job 4 (ALGO candidate):** `intelligence/ALGO-INTELLIGENCE-CANDIDATE.md` not present — no new candidate this month.

---

## All Clear

Nothing is green today. Six action items open, three escalated to Day 6–9. Start with the price check (item 1) — takes 2 minutes and protects revenue.

---

*Sources: watchdog-2026-06-15.md · milestones-2026-06-15.md · integrity-2026-06-14.md | intel-freshness: not found | ALGO candidate: not found*
