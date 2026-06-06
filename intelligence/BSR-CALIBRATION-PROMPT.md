# BSR Calibration — Data Collection Template
## BookFactory Intelligence Layer
### Fill this from your KDP dashboard. Submit after every post-launch-tracker run.

---

## WHY THIS MATTERS

The intelligence layer converts BSR → daily sales using community-derived tables. These
are estimates, not actuals. Your real KDP numbers will calibrate the conversion rate for
your specific niches (SIBO health, British cozy mystery) and price points over time.

Eight data points (8 weeks of entries) creates a meaningful baseline. Twelve data points
gives you a calibrated conversion table you can trust for all future blueprint scoring.

Without calibration: the analyzer scores niches based on estimated sales velocity.
With calibration: it scores based on your actual verified conversion rate.

---

## WHERE TO FIND EACH NUMBER IN KDP

### Step 1 — Open KDP Reports

Go to: https://kdp.amazon.com → Reports → Sales Dashboard

You will see:
- Date range selector (set to "last 7 days" or "this month")
- Units Ordered (paid) column
- KENP Read column (Kindle Unlimited pages)
- Royalties column

### Step 2 — Find BSR

BSR is NOT in the KDP Sales Dashboard. It is on your book's Amazon product page.

Go to: amazon.co.uk → search your book title → click your book → scroll to "Product details"
Look for: "Amazon Best Sellers Rank" — you will see the overall Kindle Store rank + subcategory ranks.

Or: KDP Bookshelf → click the three dots next to your book → "View on Amazon" → Product details.

**Record the overall Kindle Store BSR** (the main number, not a subcategory rank).
The subcategory ranks are useful but secondary — record them in the `bsr_sub` fields.

### Step 3 — Find Units Sold This Week

Go to: KDP Reports → Sales Dashboard → set date range to last 7 days.

"Units Ordered" = paid sales for the period.
"KENP Read" = Kindle Unlimited pages read for the period.

If the reporting period is not exactly 7 days, note the actual date range.

### Step 4 — Note Any Promotions

If a free day, Countdown Deal, or price change ran during this period, mark it.
Promotion weeks are flagged as PROMO in calibration and excluded from the baseline
conversion table (promo BSR does not reflect organic performance).

---

## DATA SUBMISSION TEMPLATE

Copy this block, fill it in, and run: `calibrate bsr [book-slug] [week-number]`
Then paste it when prompted. Or paste it directly to the post-launch-tracker agent.

```
CALIBRATION ENTRY
─────────────────────────────────────────────────────────
Book slug:       [fix-your-gut-for-good / death-in-the-cathedral-close]
Week number:     [1, 2, 3... count from live date]
Date:            [YYYY-MM-DD — date you are reading these numbers]
BSR overall:     [Kindle Store BSR — e.g. 87,432]
BSR sub 1:       [e.g. "Irritable Bowel Syndrome #234"]
BSR sub 2:       [e.g. "Abdominal Disorders #567" — or leave blank]
Units this week: [paid units from KDP Sales Dashboard, last 7 days]
KENP this week:  [KU pages read from KDP, last 7 days]
Price (£):       [current Kindle price in GBP]
Promotions:      [none / free days / countdown deal / price change]
Notes:           [anything unusual this week — new review, ad campaign started, etc.]
─────────────────────────────────────────────────────────
```

---

## THE CALIBRATION FILE

Submitted data is appended to:
`C:\Users\salah\BookFactory\intelligence\BSR-CALIBRATION.md`

Format of each entry in that file:

```
| Date | Book | Week | BSR | Units | KENP | Price | Promo | Notes |
```

After 8 entries per book, the analyzer-agent will use the actual units/BSR correlation
to replace the community-derived conversion table for that book's niche.

---

## CURRENT CALIBRATION STATUS

| Book | Live Date | Entries Logged | Status |
|------|-----------|----------------|--------|
| fix-your-gut-for-good | 2026-04-21 | 0 | NOT STARTED — submit Week 1 now |
| death-in-the-cathedral-close | 2026-05-03 | 0 | NOT STARTED — submit Week 1 now |

**Action required today:** Submit at least one entry per book. You can submit retrospective
data (approximate) for weeks you did not record at the time — label these as RETROSPECTIVE.
Retrospective entries are lower quality but still useful for trend analysis.

---

## RETROSPECTIVE DATA NOTE

If you are submitting data for a week that has already passed and you did not record the BSR
at the time, use the current BSR as a reference point only. Mark the entry:

```
Notes: RETROSPECTIVE — BSR approximated from [source]. Units from KDP CSV export.
```

To export historical unit data from KDP: Reports → Prior Months' Royalties → download CSV.
This gives you exact unit counts per day going back to launch. BSR is not recorded by KDP
and must be approximated retrospectively (check any screenshots, emails, or notes you may
have from that period).
