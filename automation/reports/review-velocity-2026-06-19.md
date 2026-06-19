# Review Velocity Report — 2026-06-19

**Total new reviews this week (both books combined): UNVERIFIABLE — Amazon fetch blocked (7th+ consecutive block). Prior values used. Both books recorded at 0 reviews. Review-generation action required on both titles.**

---

## Data-Source Notes

| Source | Result |
|--------|--------|
| Amazon.co.uk direct fetch (primary) | 403 Forbidden — blocked on both retry attempts for both ASINs |
| WebSearch cached count fallback | No indexed pages found for either ASIN (B0GXYLWS1W, B0GZD1S8HF) |
| Gmail secondary check (from:amazon, review-related, newer_than:8d) | Empty — no review notifications (expected; Amazon does not email authors on new reviews) |

Amazon's bot-protection layer continues to block all automated fetch attempts. This is the 7th+ consecutive block (prior report 2026-06-12 recorded 5 consecutive; 2 more today). **No review counts have been invented.** Per hard rules, prior values are used and flagged as unverified.

---

## Review Velocity Table

| Book | ASIN | Prior Count (2026-06-12) | Current Count | New This Period | Days Elapsed | Reviews / Week | Current Gate | To Next Gate | ETA to Next Gate |
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

### Fix Your Gut for Good
- **Current gate:** Pre-Gate 1 (0 / 5 reviews — unverified; fetch blocked)
- **Reviews to Gate 1:** 5
- **Velocity:** 0 reviews/week (unverified — fetch blocked)
- **ETA to Gate 1:** STALLED — review-generation action needed
- **Note:** Pipeline-state.json still shows `kdp_status: "not_started"` and `asin: null` despite book being treated as live per manifest ASIN B0GXYLWS1W. State reconciliation remains an open action (open > 12 days).

### Death in the Cathedral Close
- **Current gate:** Pre-Gate 1 (0 / 5 reviews — unverified; fetch blocked)
- **Reviews to Gate 1:** 5
- **Days live:** ~47 (live since approx. 2026-05-03)
- **Velocity:** 0 reviews/week (unverified — fetch blocked)
- **ETA to Gate 1:** STALLED — review-generation action needed
- **Note:** No pipeline-state.json exists for slug `death-in-the-cathedral-close`. Prior report used slug `untitled-cosy-mystery`; neither file was found today. State file creation is outstanding.

---

## Review-Generation Actions Required (both books stalled at 0)

Gate 1 (5 reviews) is the ads-unlock gate. At 0 verified reviews and 0 velocity, Gate 1 has an infinite ETA. **These three channels must be activated immediately:**

### Priority 1 — ARC Reader Outreach (highest conversion, currently dead)
- `post_launch.arc_emails_sent = 0` for both books
- ARC readers committed to reviewing — this is the fastest path to Gate 1
- Run `arc-manager-agent` or send the ARC follow-up sequence to any pre-launch ARC list
- Even 3–5 ARC reviews pushes both books past Gate 1 immediately

### Priority 2 — Personal / Network Outreach
- Direct ask to 5–10 verified readers of either book
- One honest email to a warm reader outperforms any automation
- Verified-purchase reviews only — no incentivised reviews (KDP ToS violation)

### Priority 3 — In-Book Review CTA Traffic
- Both EPUBs contain back-matter review CTAs (placed by review-bait-optimizer)
- CTA only converts if readers are finishing the book
- Check KDP dashboard: if KU page reads > 0, readers are finishing — CTA should be converting
- If KU reads = 0: the traffic problem precedes the review problem

### Priority 4 — Persistent Fetch Block (infrastructure note)
- Amazon.co.uk has blocked WebFetch and WebSearch for 7+ consecutive runs (since 2026-06-07)
- Review counts cannot be verified by this automation until the block resolves
- Recommend: manually check both product pages weekly and enter counts directly into pipeline-state.json until automation is restored
- Alternative: investigate a residential-proxy or authenticated fetch solution

---

## Gmail Secondary Check

Searches run:
- `from:amazon (subject:review OR "customer review" OR "your review" OR "review removed") newer_than:8d`

**Result: Empty.** No Amazon review-related emails in the last 8 days. This is expected — Amazon does not notify authors/publishers when a customer posts a new review. Gmail is confirmed not a usable source for review counts.

---

## STATE DELTA

> The Architect or a write-enabled agent applies these changes. This report does NOT edit pipeline-state.json directly.

**No count delta to apply** — live counts could not be verified (fetch blocked); prior values unchanged at 0.

**Recommended weekly_log entries to anchor today's run date** (apply with fetch-blocked status for date tracking):

```
books/fix-your-gut-for-good/pipeline-state.json
  post_launch.weekly_log → append:
    { "date": "2026-06-19", "review_count": 0, "avg_rating": null, "source": "fetch-blocked-prior-value" }

books/death-in-the-cathedral-close/pipeline-state.json
  [FILE DOES NOT EXIST — must be created from pipeline-state.template.json first]
  post_launch.review_count = 0
  post_launch.avg_rating = null
  post_launch.weekly_log → [
    { "date": "2026-06-12", "review_count": 0, "avg_rating": null, "source": "fetch-blocked-prior-value" },
    { "date": "2026-06-19", "review_count": 0, "avg_rating": null, "source": "fetch-blocked-prior-value" }
  ]
```

**Outstanding state hygiene (unresolved > 12 days — not this agent's remit):**
- `fix-your-gut-for-good`: `publishing.asin` = B0GXYLWS1W, `kdp_status` = live, `published` = true
- `death-in-the-cathedral-close`: pipeline-state.json does not exist — must be created

---

*Review velocity run: 2026-06-19 | Fetch method: WebFetch (×2 per ASIN, 403) → WebSearch fallback (no cached results) → both blocked | Gmail: 0 review-related emails | No counts invented | No pipeline-state.json files modified.*
