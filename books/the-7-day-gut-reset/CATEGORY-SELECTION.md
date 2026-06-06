# CATEGORY SELECTION — The 7-Day Gut Reset
**Produced by:** kdp-seo-agent
**Date:** 2026-06-05
**Status:** PENDING ARCHITECT APPROVAL
**Authority:** This file is the binding category instruction for kdp-upload-agent.
              kdp-upload-agent reads this file and enters these exact categories.
              kdp-upload-agent does NOT make independent category decisions.
              kdp-upload-agent MUST check this file before entering any categories in KDP.
              If Status is not APPROVED, kdp-upload-agent must stop and alert the Architect.

**Category cap compliance:** Amazon policy (April 2026, documented in ALGO-INTELLIGENCE.md v1.1 §15)
  caps all Kindle books at a maximum of 3 browse categories. This file specifies exactly 3.
  The CS "add extra category" workaround is no longer valid for a 4th or 5th category.
  KDP upload form accepts 2 categories at upload; the 3rd is requested via KDP support
  email immediately after upload (this remains valid for the 3rd slot only).

---

## Data Sources for Category Decisions

- MARKET-INTELLIGENCE.md Section 8 (category recommendations, 2026-05-13)
- KDP-LISTING.md Section 4 (publisher-agent category selection, 2026-05-23)
- COMPETITIVE-ANALYSIS.md Section 6 (category weakness / self-pub review floor, 2026-05-13)
- opportunity-db.json (gut-health harvest, 2026-05-13): BSR data for top-ranked books
- ALGO-INTELLIGENCE.md v1.1 §10 (BSR mechanics, #1 New Release badge, category arbitrage)
- SEO-STRATEGY.md (Phase 3 category strategy, 2026-06-05)

---

## Category Landscape Map

```
CATEGORY LANDSCAPE MAP — GUT HEALTH NICHE (UK Kindle Store)
Source: opportunity-db.json (2026-05-13) + MARKET-INTELLIGENCE.md Section 8 +
        COMPETITIVE-ANALYSIS.md Section 1 + ALGO-INTELLIGENCE.md v1.1 §10
Note: BSR figures are from the 2026-05-13 harvest. Live verification at T-14 required.
────────────────────────────────────────────────────────────────────────────────────────────
Category path                                                    | Best BSR in cat | Notes
─────────────────────────────────────────────────────────────────|─────────────────|────────
Kindle Store > Kindle eBooks > Health, Family & Lifestyle >      |                 |
  Diseases & Physical Ailments > Abdominal Disorders             | 8,091           | BSR 8,091 = "Complete Guide to Taming Chronic Inflammation"
                                                                 |                 | with only 11 reviews (source: harvested.json + MARKET-INTELLIGENCE.md
                                                                 |                 | Section 8). Anomaly = proof rank precedes reviews in this sub.
                                                                 |                 | Low-Medium competition confirmed.

Kindle Store > Kindle eBooks > Health, Family & Lifestyle >      |                 |
  Diet & Nutrition > Digestive Health                            | 37,505          | Top self-pub: "Gut Fix" BSR 37,505 / 50 reviews (harvested.json).
                                                                 |                 | Broader category; self-pub field occupies this space.
                                                                 |                 | Medium competition confirmed.

Kindle Store > Kindle eBooks > Health, Family & Lifestyle >      |                 |
  Self-Help > Stress Management                                  | Not scanned     | Day 5 (Stress Bridge / vagal tone) qualifies. No existing gut
                                                                 |                 | health title in top 20 occupies this crossover (MARKET-INTELLIGENCE
                                                                 |                 | Section 8). Crossover-category arbitrage opportunity.
                                                                 |                 | Live BSR check required at T-14 to confirm arbitrage value.

Live verification required:
  At T-14 (KDP go-live day), check the live #1 New Release BSR in Abdominal Disorders
  and Stress Management sub-categories. If Abdominal Disorders #1 New Release BSR
  is above 150,000, the badge is realistic with the launch velocity plan. If below
  50,000, escalate to a narrower category (per KDP-LISTING.md Section 4 note).
```

---

## Day 1 Categories (Enter on Upload — 2 slots via KDP form)

### Category 1 — Primary (Launch Target — Type A)

**Path:**
```
Kindle Store > Kindle eBooks > Health, Family & Lifestyle >
  Diseases & Physical Ailments > Abdominal Disorders
```

**Rationale:**
- The BSR 8,091 book in this sub-category holds only 11 reviews (source: harvested.json, MARKET-INTELLIGENCE.md Section 8 — "The Complete Guide to Taming Chronic Inflammation"). This is the most significant data point for category selection: it confirms that rank precedes review accumulation in this sub-category. A new book can reach top-10 position via KU borrow velocity before reviews accumulate.
- Competition level: Low-Medium (confirmed, MARKET-INTELLIGENCE.md Section 8).
- The book qualifies: Day 1-2 (trigger identification for abdominal symptoms), Day 3 (Calm Plate for digestive load reduction), Day 4 (Repair Kit), Day 6 (reintroduction mechanic) all map to abdominal disorder management content.
- #1 New Release badge window: 30 days from publication (confirmed, ALGO-INTELLIGENCE.md v1.1 §10).
- Launch mechanism: free days T-5/T-4 → paid launch T-3 (per KDP-LISTING.md Section 6.1 and pipeline-state.json pre_launch fields). Free-day download velocity produces paid-rank spike on launch day.
- This category was identified as the primary #1 New Release target in KDP-LISTING.md Section 4 (publisher-agent, 2026-05-23).

**Assessment: ACHIEVABLE for #1 New Release badge.**
  The BSR threshold to rank top 10 here is accessible with modest launch velocity (the BSR 8,091 anomaly with 11 reviews confirms low daily sales required). Within the 30-day New Release window, concentrated free-day velocity + KU borrows + first paid sales should be sufficient to win the badge.

**Action at T-14:** Check live #1 New Release BSR in Abdominal Disorders. If BSR of current #1 New Release exceeds 150,000, the badge is low-risk. If below 50,000, escalate to Architect — consider swapping to a narrower or less competitive sub-category and alert Architect before upload.

---

### Category 2 — Secondary (Growth Target — Type B)

**Path:**
```
Kindle Store > Kindle eBooks > Health, Family & Lifestyle >
  Diet & Nutrition > Digestive Health
```

**Rationale:**
- This is where the bulk of the self-pub competitive field sits. Best self-pub performer: "Gut Fix" BSR 37,505 / 50 reviews (source: harvested.json, MARKET-INTELLIGENCE.md Section 8).
- The book legitimately qualifies: Days 3 and 4 are dietary protocol (Calm Plate + Repair Kit); Day 6 is reintroduction — all core dietary/digestive health content.
- Competition level: Medium (confirmed, MARKET-INTELLIGENCE.md Section 8). A book with 50 reviews at BSR 37,505 is the ceiling — reachable as review base builds over weeks 2-8.
- Purpose: captures category browsers in the main self-pub discovery stream. Algorithmic discoverability grows as review base accumulates.
- Paired structure: narrow sub-category (Abdominal Disorders) wins the badge; broad category (Digestive Health) captures the browser traffic. Standard competitive structure per ALGO-INTELLIGENCE.md v1.1 §10.
- This category was identified as the secondary in KDP-LISTING.md Section 4 (publisher-agent, 2026-05-23). Confirmed.

**Timeline:** Enter on Day 1 of upload. Organic rank improvement expected by Day 14-30 as BSR drops from launch velocity. Growth category visibility compounds as review count climbs past 10, 20, 30 reviews.

---

## Day 30+ Category Addition (Request via Email to KDP Support — 3rd Slot)

### Category 3 — Crossover Arbitrage (Type A/B — Request After Launch)

**Path:**
```
Kindle Store > Kindle eBooks > Health, Family & Lifestyle >
  Self-Help > Stress Management
```

**Rationale:**
- Day 5 (The Stress Bridge — physiological sigh + low-frequency humming, 4-minute vagal tone practice, grounded in Balban et al., Cell Reports Medicine, 2023) is the only chapter of its type in the self-pub gut health niche. No existing gut health title in the top 20 occupies the gut-brain/stress crossover position (source: MARKET-INTELLIGENCE.md Section 8).
- This category provides access to a different browse audience — stress management readers — who may not find the book via gut health searches. The content qualifies: Day 5 is a standalone stress-reduction practice with direct gut application.
- This is the crossover arbitrage opportunity: reach audience overlap (stress-affected gut readers) via a different category path.
- Competition level in Stress Management: NOT CONFIRMED — live BSR check required at T-14.
- Why request at Day 30+ (not at upload): the 3rd category slot should be confirmed against real launch-week data. If Abdominal Disorders delivers the #1 New Release badge and review velocity is on track, adding Stress Management broadens reach. If Abdominal Disorders underperformed, consider replacing it with Stress Management for the 3rd slot instead. Architect decides after seeing Day 7 and Day 14 BSR data.

**When to request:** After Day 14 BSR check confirms launch velocity direction. Minimum: after 10 reviews are live (per ALGO-INTELLIGENCE.md v1.1 §10 — conversion rate requirement for new category).

**How to request:**
  Email: kdp-support@amazon.com (or use KDP Help → Contact Us)
  Subject: "Add browse category to [ASIN]"
  Body template:
  "Please add ASIN [X] to the following category:
  Kindle Store > Kindle eBooks > Health, Family & Lifestyle > Self-Help > Stress Management.
  Thank you."
  (Replace [X] with the live ASIN, available in KDP dashboard after publication.)

**Note on timing and the 3-category cap (ALGO-INTELLIGENCE.md v1.1 §15):**
  Amazon's 3-category cap (confirmed April 2026) means this is the final category slot.
  The book will be in: (1) Abdominal Disorders, (2) Digestive Health, (3) Stress Management.
  No further category requests should be made. The CS workaround for a 4th+ category is
  no longer honoured by Amazon.

---

## Category Summary Table

```
CATEGORY SUMMARY — THE 7-DAY GUT RESET
────────────────────────────────────────────────────────────────────────────────────────────
#  | Type | Category path (abbreviated)                     | Enter when      | Purpose
───|──────|─────────────────────────────────────────────────|─────────────────|──────────────
1  | A    | ... > Abdominal Disorders                       | Day 1 (upload)  | #1 New Release badge target
2  | B    | ... > Diet & Nutrition > Digestive Health       | Day 1 (upload)  | Growth + self-pub field discovery
3  | A/B  | ... > Self-Help > Stress Management             | Day 14-30       | Crossover arbitrage; add via CS email
────────────────────────────────────────────────────────────────────────────────────────────
3-category cap: CONFIRMED. All 3 slots specified. No additional categories.
Amazon policy source: ALGO-INTELLIGENCE.md v1.1 §15 (April 2026 policy change).
```

---

## Pre-Upload Category Verification Checklist

```
CATEGORY VERIFICATION — kdp-upload-agent must complete before entering categories
────────────────────────────────────────────────────────────────────────────────────────────
□ Status field above reads APPROVED (not PENDING ARCHITECT APPROVAL)
  → If not APPROVED: STOP. Alert the Architect. Do not upload.

□ Live #1 New Release BSR in Abdominal Disorders checked at T-14
  → If BSR of #1 NR > 150,000: proceed. Badge is achievable.
  → If BSR of #1 NR < 50,000: STOP. Escalate to Architect. May need different primary.

□ Category 1 path confirmed in KDP browse tree at upload time:
  Kindle Store > Kindle eBooks > Health, Family & Lifestyle >
    Diseases & Physical Ailments > Abdominal Disorders
  → Navigate to this exact path in the KDP category selector. Confirm it exists.
  → If path has changed since 2026-05-13: alert Architect with the new path before entering.

□ Category 2 path confirmed in KDP browse tree at upload time:
  Kindle Store > Kindle eBooks > Health, Family & Lifestyle >
    Diet & Nutrition > Digestive Health
  → Navigate to confirm path exists as specified.

□ Series position resolved: is this Book 1 or Book 2?
  → KDP-LISTING.md states Book 2. BLUEPRINT.md states Book 1.
  → Architect must confirm before upload. Enter the confirmed series number in KDP.
  → Series name must be entered as exactly: Fix Your Gut for Good
  → Do not enter: "The Fix Your Gut for Good Series" or "Fix Your Gut for Good Series"
  → Character-for-character exact: F-i-x-[sp]-Y-o-u-r-[sp]-G-u-t-[sp]-f-o-r-[sp]-G-o-o-d

□ AI content disclosure (ALGO-INTELLIGENCE.md v1.1 §16) completed at upload:
  → Question 1 (text): Yes — AI-generated text that I reviewed and edited
  → Question 2 (images): Yes — AI-generated images that I reviewed and edited
  → Question 3 (translation): No
  → (per KDP-LISTING.md Section 7 — confirmed answers from pipeline)

□ KDP Select enrolled: YES (required for free-day promotions and KU borrow velocity)
  → If KDP Select is not available at upload for any reason: STOP. Alert Architect.
  → The launch plan depends on KU borrow signal. Non-Select launch requires full plan revision.
```

---

## HUMAN APPROVAL REQUIRED

The Architect must confirm these categories before kdp-upload-agent can proceed.

**Confirmation instruction:** After reviewing, update this file's Status field to APPROVED
and add your confirmation note below.

```
Architect approval: [name] — [date]
Notes: [any changes, confirmations, or the series position decision]
Series position confirmed as: Book [1/2]
Category 1 live BSR at T-14: [fill in]
Category 3 timing decision: [request at Day 14 / Day 30 / defer]
```

**kdp-upload-agent MUST check this file before entering any categories in KDP.
If Status is not APPROVED, kdp-upload-agent must stop and alert the Architect.**
