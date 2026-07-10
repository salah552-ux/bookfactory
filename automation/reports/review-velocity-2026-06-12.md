# Review Velocity Report — 2026-06-12

**Total new reviews this week (both books combined): UNVERIFIABLE — Amazon fetch blocked (403, run 5 of 5 consecutive). Prior values used. Both books recorded at 0 reviews. Review-generation action required on both titles.**

---

## Data-Source Notes

| Source | Result |
|--------|--------|
| Amazon.co.uk direct fetch (primary) | 403 Forbidden — blocked across all attempts (consistent with watchdog runs 06-07 through 06-12, 5 consecutive days) |
| WebSearch cached count fallback | No indexed pages found for either ASIN |
| Gmail secondary check (from:amazon, review-related, newer_than:8d) | Empty — no review notifications (expected; Amazon does not email authors on new reviews) |

Amazon's bot-protection layer is consistently blocking all automated WebFetch attempts. **No review counts have been invented.** Per hard rules, prior values are used and flagged as unverified.

---

## Review Velocity Table

| Book | ASIN | Slug | Prior Count | Current Count | New This Period | Days Elapsed | Reviews / Week | Current Gate | To Next Gate | ETA to Next Gate |
|------|------|------|------------|--------------|----------------|-------------|---------------|-------------|-------------|-----------------|
| Fix Your Gut for Good | B0GXYLWS1W | fix-your-gut-for-good | 0 | **FETCH BLOCKED** (prior: 0) | 0 (unverified) | N/A — first velocity run | 0 | Pre-Gate 1 | 5 (Gate 1 — ads unlock) | **STALLED** |
| Death in the Cathedral Close | B0GZD1S8HF | untitled-cosy-mystery | 0 | **FETCH BLOCKED** (prior: 0) | 0 (unverified) | 40 days since live (2026-05-03) | 0.00 r/wk (40 days, 0 reviews) | Pre-Gate 1 | 5 (Gate 1 — ads unlock) | **STALLED** |

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
- **Current gate:** Pre-Gate 1 (0 / 5 reviews)
- **Reviews to Gate 1:** 5
- **Velocity:** 0 reviews/week (unverified — fetch blocked; also pipeline-state shows book as unpublished — ASIN discrepancy unresolved for 6 days)
- **ETA to Gate 1:** STALLED — review-generation action needed
- **Note:** Pipeline-state.json shows `kdp_status: "not_started"` and `asin: null` — book treated as live per watchdog manifest (ASIN B0GXYLWS1W). State file reconciliation is an open action from watchdog alerts.

### Death in the Cathedral Close
- **Current gate:** Pre-Gate 1 (0 / 5 reviews)
- **Reviews to Gate 1:** 5
- **Days live:** 40 (live since 2026-05-03)
- **Velocity:** 0.00 reviews/week (0 reviews in 40 days — confirmed zero in pipeline-state; live count unverifiable)
- **ETA to Gate 1:** STALLED — review-generation action needed
- **Note:** Countdown Deal window 2026-06-02 → 2026-06-09 has ended; price restoration unverified (ongoing watchdog alert). ASIN in state file (AT25QRT6FPTE6) is a 13-character string — invalid Amazon ASIN format; watchdog ASIN B0GZD1S8HF is used as authoritative.

---

## Review-Generation Actions Required (both books stalled at 0)

All three channels must be activated immediately. **Gate 1 (5 reviews) is the ads-unlock gate — no ads can run until it is reached. At 0 reviews/week, Gate 1 has an infinite ETA.**

### Priority 1 — In-Book Review CTA Traffic
Both books contain a back-matter review CTA (placed by review-bait-optimizer). This CTA only converts if readers are finishing the book:
- Confirm both EPUBs contain the CTA on the final pages (check `manuscript/` back matter)
- If KU page reads > 0 (check KDP dashboard), some readers are finishing — the CTA should be converting
- If no KU reads: the books are not being discovered → the traffic problem precedes the review problem

### Priority 2 — ARC Reader Outreach (dead channel — activate now)
- `post_launch.arc_emails_sent = 0` for **both** books
- ARC readers are the highest-conversion review source (they agreed in advance to leave a review)
- Run `arc-manager-agent` or send the ARC follow-up sequence manually to any ARC list built during pre-launch
- Even 3–5 ARC reviews would push both books past Gate 1 immediately

### Priority 3 — Personal / Network Outreach
- Direct ask to 5–10 people who have read (or will read) either book
- Verified-purchase reviews only — never incentivised or fake reviews
- One honest email to a warm reader is worth more than any automation

### Priority 4 — Email List / Reader Magnet
- Reader magnet / email list is currently noted as dead (no list activity)
- Even a small list (50–100 subscribers) with a personal "would you leave a review?" message can deliver Gate 1
- If the list does not exist: building it is the highest-leverage long-term action in the pipeline

---

## Gmail Secondary Check

Search: `from:amazon ("customer review" OR "your review" OR "review removed") newer_than:8d`
Search: `from:amazon subject:review newer_than:8d`

**Result: Both searches returned empty.** No Amazon review-related emails in the last 8 days. This is expected — Amazon does not notify authors/publishers when a customer posts a new review. Gmail is not a usable primary source for review counts; the public product page is the only reliable source.

---

## Velocity Baseline — First Run

This is the first review velocity run. No prior `weekly_log` exists in either pipeline-state.json. The observation date is **2026-06-12** with a recorded count of **0** for both books (prior value; live count unverifiable due to fetch block).

Future velocity runs will calculate `days_elapsed` from the most recent `weekly_log` date once a verified count can be obtained.

---

## STATE DELTA

> The Architect or a write-enabled agent applies these changes. This report does NOT edit pipeline-state.json directly.

**No count delta to apply** — live counts could not be verified (fetch blocked); prior values unchanged at 0 for both books.

**Recommended first-time weekly_log entries to establish the velocity baseline** (apply once a verified live count is obtained, or apply now with fetch-blocked status for date anchoring):

```
books/fix-your-gut-for-good/pipeline-state.json
  post_launch.weekly_log → append:
    { "date": "2026-06-12", "review_count": 0, "avg_rating": null, "source": "fetch-blocked-prior-value" }

books/untitled-cosy-mystery/pipeline-state.json
  post_launch.weekly_log → append:
    { "date": "2026-06-12", "review_count": 0, "avg_rating": null, "source": "fetch-blocked-prior-value" }
```

**Outstanding state hygiene (from watchdog — unresolved day 6, not this agent's remit):**
- `fix-your-gut-for-good`: `publishing.asin` = B0GXYLWS1W, `kdp_status` = live, `published` = true
- `untitled-cosy-mystery`: `publishing.asin` = correct 10-char ASIN (verify via KDP), `countdown_deal_run` = true

---

*Review velocity run: 2026-06-12 | Fetch method: WebFetch (×2 per ASIN) → WebSearch fallback → both blocked | Gmail: 0 review-related emails | No counts invented | No pipeline-state.json files modified.*
