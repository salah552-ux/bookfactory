# Review Velocity Report — 2026-07-24

**Total new reviews this week (both books combined): UNVERIFIABLE — Amazon fetch blocked (12th consecutive block). Prior values used. Both books remain at 0 verified reviews. Review-generation action required on both titles — both are stalled at Pre-Gate 1 (ads locked).**

> **Note:** No report filed on 2026-07-17 (missed scheduled run). Days-elapsed calculated from last successful run 2026-07-10 = 14 days.

---

## Data-Source Notes

| Source | Result |
|--------|--------|
| Amazon.co.uk direct fetch (primary) — dp/ URL | 403 Forbidden — blocked both retry attempts, both ASINs |
| Amazon.co.uk product-reviews URL | 403 Forbidden — blocked both ASINs |
| Amazon.co.uk gp/product URL | 403 Forbidden — blocked |
| WebSearch cached count fallback | No indexed pages found for either ASIN (B0GXYLWS1W, B0GZD1S8HF) |
| Goodreads / third-party search fallback | No indexed results found for either title |
| Gmail secondary check (from:amazon, subject:review, newer_than:8d) | Empty — no review notifications (expected; Amazon does not email authors on new reviews) |
| Gmail secondary check (from:amazon, "customer review" OR "review removed", newer_than:8d) | Empty |

Amazon's bot-protection layer continues to block all automated fetch attempts. This is the **12th consecutive blocked run** (first block observed 2026-06-07). **No review counts have been invented.** Per hard rules, prior values (0) are used and flagged as unverified.

---

## Review Velocity Table

| Book | ASIN | Prior Count (2026-07-10) | Current Count | New This Period | Days Elapsed | Reviews / Week | Current Gate | To Next Gate | ETA to Next Gate |
|------|------|--------------------------|---------------|----------------|-------------|---------------|-------------|-------------|-----------------|
| Fix Your Gut for Good | B0GXYLWS1W | 0 | **FETCH BLOCKED** (prior: 0) | 0 (unverified) | 14 days | 0 r/wk (unverified) | Pre-Gate 1 | 5 reviews (Gate 1 — ads unlock) | **STALLED** |
| Death in the Cathedral Close | B0GZD1S8HF | 0 | **FETCH BLOCKED** (prior: 0) | 0 (unverified) | 14 days | 0 r/wk (unverified) | Pre-Gate 1 | 5 reviews (Gate 1 — ads unlock) | **STALLED** |

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
- **Days since live date:** 94 days (live since 2026-04-21)
- **Velocity:** 0 reviews/week (unverified; fetch blocked since 2026-06-07)
- **ETA to Gate 1:** STALLED — review-generation action needed
- **KDP Select status:** Current term expired 2026-07-19 — re-enrolment decision needed. Next Countdown Deal window opens ~2026-08-18 if re-enrolled.

### Death in the Cathedral Close (B0GZD1S8HF)

- **Current gate:** Pre-Gate 1 (0 / 5 reviews — unverified; fetch blocked)
- **Reviews to Gate 1:** 5
- **Days since live date:** 82 days (live since 2026-05-03)
- **Velocity:** 0 reviews/week (unverified; fetch blocked; 82 days live, 0 verified reviews)
- **ETA to Gate 1:** STALLED — review-generation action needed
- **State hygiene resolved:** pipeline-state.json now exists at `books/death-in-the-cathedral-close/` (previously flagged as missing; confirmed present this run).

---

## ⚠️ Critical Alert: KDP Select Term Expired (Fix Your Gut for Good)

`publishing.kdp_select_term_end` was **2026-07-19 (5 days ago)**. If not re-enrolled, the book has left KDP Select, which means:
- KU (Kindle Unlimited) page read income has stopped
- Next Countdown Deal window (~2026-08-18) is not available unless re-enrolled
- Free promotion days in the new term become available only after re-enrolment

**Action required:** Log into KDP dashboard and confirm Select re-enrolment status.

---

## Review-Generation Actions Required (both books stalled at 0 for 82–94 days)

Both books have been live for 12+ weeks with zero verified reviews and zero velocity. **Gate 1 (5 reviews) is the ads-unlock gate — Amazon Ads cannot be activated until 5 reviews are reached. At 0 velocity, this gate has an infinite ETA.**

### Priority 1 — ARC Reader Outreach (highest conversion, currently dead)

- `post_launch.arc_emails_sent = 0` for **both** books — 82+ days post-launch with zero ARC contact
- ARC readers committed to reviewing — this is the fastest path to Gate 1
- Run `arc-manager-agent` or send ARC follow-up sequence to any list built during pre-launch
- 3–5 ARC reviews pushes both books past Gate 1 immediately and unlocks the full ads stack
- **This is the single highest-leverage action available. Every additional week of delay is a week of ad revenue permanently lost.**

### Priority 2 — Personal / Network Outreach

- Direct ask to 5–10 verified readers of either book
- Verified-purchase reviews only — no incentivised reviews (KDP Terms of Service)
- One honest email to a warm reader outperforms any automation

### Priority 3 — In-Book Review CTA Traffic

- Both EPUBs contain back-matter review CTAs (placed by review-bait-optimizer)
- CTA only converts if readers are finishing the book
- Check KDP dashboard: if KU page reads > 0, some readers are finishing — CTA should be converting
- If KU page reads = 0: the traffic problem precedes the review problem; ads must be unlocked first

### Priority 4 — Persistent Fetch Block (infrastructure note)

- Amazon.co.uk has blocked WebFetch and WebSearch for 12 consecutive runs (since 2026-06-07 / 7+ weeks)
- Review counts cannot be verified by this automation until the block resolves
- **Recommended action:** Check both product pages manually once per week and record counts directly into pipeline-state.json via the STATE DELTA process, until automated fetching is restored

---

## Gmail Secondary Check

Searches run:
- `from:amazon subject:(review) newer_than:8d`
- `from:amazon ("customer review" OR "your review" OR "review removed") newer_than:8d`

**Result: Both searches returned empty.** No Amazon review-related emails in the last 8 days. This is expected — Amazon does not notify authors/publishers when a customer posts a new review. Label_11 (BookFactory/KDP-Alerts) confirmed empty; no labelling action taken.

---

## STATE DELTA

> The Architect or a write-enabled agent applies these changes. This report does NOT edit pipeline-state.json directly.

**No count delta to apply** — live counts could not be verified (fetch blocked); prior values unchanged at 0 for both books.

**Recommended weekly_log entries to anchor today's run date:**

```
books/fix-your-gut-for-good/pipeline-state.json
  post_launch.weekly_log → append:
    { "date": "2026-07-24", "review_count": 0, "avg_rating": null, "source": "fetch-blocked-prior-value" }

books/death-in-the-cathedral-close/pipeline-state.json
  post_launch.weekly_log → append:
    { "date": "2026-07-24", "review_count": 0, "avg_rating": null, "source": "fetch-blocked-prior-value" }
```

**Additional state action required:**

```
books/fix-your-gut-for-good/pipeline-state.json
  publishing.kdp_select → verify re-enrolment; term expired 2026-07-19
  If re-enrolled: publishing.kdp_select_term_start = "2026-07-19", publishing.kdp_select_term_end = "2026-10-17"
```

---

*Review velocity run: 2026-07-24 | Fetch method: WebFetch (×3 URL variants per ASIN, all 403) → WebSearch fallback (no cached results) → Goodreads fallback (no results) → all blocked | Gmail: 0 review-related emails | No counts invented | No pipeline-state.json files modified.*
