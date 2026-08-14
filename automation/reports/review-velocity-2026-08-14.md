# Review Velocity Report — 2026-08-14

**Total new reviews this week (both books combined): UNVERIFIABLE — Amazon fetch blocked (15th consecutive block). Prior values used (0/0). Both books remain at 0 verified reviews and are stalled at Pre-Gate 1. ⚠️ CRITICAL: KDP Select Countdown Deal window for Fix Your Gut opens in 4 days (2026-08-18) — action required today.**

---

## Data-Source Notes

| Source | Result |
|--------|--------|
| Amazon.co.uk direct fetch (primary) — dp/ URL | EGRESS_BLOCKED — proxy blocks both ASINs |
| Amazon.com fallback fetch | EGRESS_BLOCKED — proxy blocks both ASINs |
| WebSearch cached count fallback | No indexed pages found for either ASIN (B0GXYLWS1W, B0GZD1S8HF) |
| Gmail secondary check (from:amazon, subject:review, newer_than:8d) | Empty — no review notifications (expected; Amazon does not email authors on new reviews) |

Amazon's bot-protection/proxy layer continues to block all automated fetch attempts. This is the **15th consecutive blocked run** (first block observed 2026-06-07 — 10 weeks ago). **No review counts have been invented.** Per hard rules, prior values (0) are used and flagged as unverified.

---

## Review Velocity Table

| Book | ASIN | Prior Count (2026-08-07) | Current Count | New This Period | Days Elapsed | Reviews / Week | Current Gate | To Next Gate | ETA to Next Gate |
|------|------|--------------------------|---------------|----------------|-------------|---------------|-------------|-------------|-----------------|
| Fix Your Gut for Good | B0GXYLWS1W | 0 | **FETCH BLOCKED** (prior: 0) | 0 (unverified) | 7 days | 0 r/wk (unverified) | Pre-Gate 1 | 5 reviews (Gate 1 — ads unlock) | **STALLED** |
| Death in the Cathedral Close | B0GZD1S8HF | 0 | **FETCH BLOCKED** (prior: 0) | 0 (unverified) | 7 days | 0 r/wk (unverified) | Pre-Gate 1 | 5 reviews (Gate 1 — ads unlock) | **STALLED** |

---

## Gate Status Detail

### Gate Reference

| Gate | Reviews Required | Unlocks |
|------|-----------------|---------|
| Gate 1 | 5 | Amazon Ads activation |
| Gate 2 | 10 | Bid scaling / campaign expansion |
| Gate 3 | 15 | ASIN-targeting campaign |
| Gate 4 | 25 | Full ad stack / placement multipliers |
| Gate 5 | 50 | BookBub eligibility |

### Fix Your Gut for Good (B0GXYLWS1W)

- **Current gate:** Pre-Gate 1 (0 / 5 reviews — unverified; fetch blocked)
- **Reviews to Gate 1:** 5
- **Days since live date:** 115 days (live since 2026-04-21)
- **Velocity:** 0 reviews/week (unverified; fetch blocked since 2026-06-07)
- **ETA to Gate 1:** STALLED — review-generation action needed
- **KDP Select status:** Term expired 2026-07-19 (26 days ago). ⚠️ Countdown Deal window opens **2026-08-18 — 4 DAYS AWAY**. If not re-enrolled now, this window is lost and the next defers 90+ days.

### Death in the Cathedral Close (B0GZD1S8HF)

- **Current gate:** Pre-Gate 1 (0 / 5 reviews — unverified; fetch blocked)
- **Reviews to Gate 1:** 5
- **Days since live date:** 103 days (live since 2026-05-03)
- **Velocity:** 0 reviews/week (unverified; fetch blocked; 103 days live, 0 verified reviews)
- **ETA to Gate 1:** STALLED — review-generation action needed

---

## 🚨 CRITICAL ALERT: Countdown Deal Window Opens in 4 Days

`publishing.kdp_select_term_end` for **Fix Your Gut for Good** was **2026-07-19** (26 days ago). The Countdown Deal window opens **2026-08-18** — 4 days from today.

**To use this window:**
1. Log into KDP dashboard and confirm KDP Select re-enrolment is active for B0GXYLWS1W
2. If not enrolled: re-enrol immediately (enrolment takes ~24h to confirm)
3. Schedule Countdown Deal in KDP for the 2026-08-18 window
4. If the book has 0 reviews, a Countdown Deal still helps BSR and organic discovery — it is not gated on review count

Missing this window means no Countdown Deal until ~2026-11-17 (next 90-day term).

---

## ⚠️ Escalation: 15-Week Stall on Reviews — Both Books

Both books have been live for 103–115 days with zero verified reviews and zero velocity. Gate 1 (5 reviews) is the ads-unlock gate — Amazon Ads cannot be activated until 5 reviews are reached. Both books are earning zero ad-driven income.

### Priority 1 — ARC Reader Outreach (highest conversion, currently dead)

- `post_launch.arc_emails_sent = 0` for **both** books — 103–115 days post-launch with zero ARC contact
- Run `arc-manager-agent` or send manual ARC follow-up emails
- 3–5 ARC reviews pushes both books past Gate 1 immediately
- Every additional week of delay is a week of ad revenue permanently lost

### Priority 2 — Personal / Network Outreach

- Direct ask to 5–10 verified readers of either book
- Verified-purchase reviews only — no incentivised reviews (KDP ToS)

### Priority 3 — In-Book Review CTA Traffic

- Both EPUBs contain back-matter review CTAs (placed by review-bait-optimizer)
- Check KDP dashboard: if KU page reads > 0, some readers are finishing — CTA should be converting
- If KU page reads = 0: traffic problem precedes review problem; the ARC path above is the only viable route

### Priority 4 — Manual Review Count Check (persistent fetch block)

- Amazon.co.uk and Amazon.com have both been blocked by the network egress proxy for **15 consecutive weekly runs** (10 weeks)
- **Recommended action:** Check both product pages manually in a browser once per week and report the count — the Architect can paste current values and the STATE DELTA block below can be applied

---

## Gmail Secondary Check

Searches run:
- `from:amazon subject:(review) newer_than:8d`

**Result: Search returned empty.** No Amazon review-related emails in the last 8 days. Expected — Amazon does not notify authors/publishers when a customer posts a new review. No labelling action taken.

---

## STATE DELTA

> The Architect or a write-enabled agent applies these changes. This report does NOT edit pipeline-state.json directly.

**No count delta to apply** — live counts could not be verified (fetch blocked); prior values unchanged at 0 for both books.

**Recommended weekly_log entries to anchor today's run date:**

```
books/fix-your-gut-for-good/pipeline-state.json
  post_launch.weekly_log → append:
    { "date": "2026-08-14", "review_count": 0, "avg_rating": null, "source": "fetch-blocked-prior-value" }

books/death-in-the-cathedral-close/pipeline-state.json
  post_launch.weekly_log → append:
    { "date": "2026-08-14", "review_count": 0, "avg_rating": null, "source": "fetch-blocked-prior-value" }
```

**CRITICAL additional state action:**

```
books/fix-your-gut-for-good/pipeline-state.json
  publishing.kdp_select → verify re-enrolment; term expired 2026-07-19 (now 26 days overdue)
  URGENT: Countdown Deal window 2026-08-18 is 4 days away — re-enrolment must be confirmed NOW.
  If re-enrolled: publishing.kdp_select_term_start = "2026-07-19", publishing.kdp_select_term_end = "2026-10-17"
  post_launch.countdown_deal_eligible_next_term = "2026-08-18"
```

---

*Review velocity run: 2026-08-14 | Prior report: 2026-08-07 (7 days) | Fetch method: WebFetch (EGRESS_BLOCKED both Amazon.co.uk and Amazon.com) → WebSearch (no cached results) → all blocked | Gmail: 0 review-related emails | No counts invented | No pipeline-state.json files modified.*
