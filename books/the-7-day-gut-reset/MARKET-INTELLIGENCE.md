# MARKET INTELLIGENCE — The 7-Day Gut Reset: Find Your Trigger and Calm Your Gut in One Week

**Agent:** market-researcher
**Stage:** 01-research
**Date:** 2026-05-13
**Data sources:** intelligence/harvested.json (20 Amazon UK gut health products, scraped 2026-05-13) | intelligence/reports/gut_health_analysis.json (analyzer output, 2026-05-13) | intelligence/reports/PRODUCT-BLUEPRINT.md (Opus 4.7 blueprint, 2026-05-13) | KDP rate card

---

## 1. Market Signal

**SIGNAL: GREEN — Write it now**

Evidence from real data:

- 9 of 20 scanned products hold BSR below 100,000 (source: gut_health_analysis.json), confirming consistent daily unit movement in this niche.
- The overall BSR range is 403 to 390,963 with an average of 162,232 (source: gut_health_analysis.json). The median self-pub BSR is approximately 154,546 (source: PRODUCT-BLUEPRINT.md arithmetic on the 20-book sample).
- The top self-pub competitor — "Gut Fix" — holds BSR 37,505 with only 50 reviews (source: harvested.json). This is beatable.
- Three self-pub books sit below BSR 50,000 with under 15 reviews each (source: PRODUCT-BLUEPRINT.md analysis of the harvested dataset). The category does not require a review fortress to rank.
- The reported opportunity score of 40/100 (source: gut_health_analysis.json) applies to the whole field including trad-pub anchors. Stripped of those anchors, the effective self-pub opportunity score rises to approximately 65 (source: PRODUCT-BLUEPRINT.md — analyst adjustment).

The signal is GREEN. The self-pub field is shallow, review-thin, and structurally beatable by a focused short guide.

---

## 2. Self-Pub Competitive Field (Trad-Pub Stripped Out)

Trad-pub anchors removed for this analysis: Tim Spector ("Food for Life" BSR 403, "Gut" BSR 21,117), Michael Mosley ("Clever Guts Diet Recipe Book" BSR 93,113 / "Clever Guts Diet" BSR 147,807), William Davis ("Super Gut" BSR 44,113), the Monash team ("Complete Low-FODMAP Diet Cookbook" BSR 63,343), Emeran Mayer ("Mind-Gut Connection" BSR 294,452), and the 16,904-review anti-inflammatory diet title (source: PRODUCT-BLUEPRINT.md identification methodology).

**Remaining self-pub field — 11 books (source: PRODUCT-BLUEPRINT.md, cross-referenced harvested.json):**

| Title | BSR | Reviews | Price |
|-------|-----|---------|-------|
| Gut Fix | 37,505 | 50 | £0 (KU) |
| Gut Health and Mental Clarity | 43,682 | 12 | £0 (KU) |
| Gut Health for Beginners | 45,844 | 11 | £0 (KU) |
| The 4-Week Gut Health Protocol for Beginners | 161,285 | 181 | £13.99 |
| Gut Health Beyond Basics | 198,448 | 45 | £0 (KU) |
| A Powerful Guide to Gut Health | 257,948 | 11 | £0 (KU) |
| The Gut Stuff | 266,062 | 8 | £9.99 |
| What Every Woman Needs to Know About Her Gut | 298,784 | 29 | £2.99 |
| The 20-Minute Gut Health Fix | 324,756 | 227 | £12.99 |
| The Power of Gut Health | 361,282 | 12 | £4.99 |
| Self Health Gut Guide | 390,963 | 45 | £0 (KU) |

Source: all BSR, review, and price figures from harvested.json; self-pub classification per PRODUCT-BLUEPRINT.md.

**Key finding:** Median reviews across the self-pub field are approximately 29 — not the 1,171 average reported in gut_health_analysis.json, which is inflated by the 16,904-review trad-pub outlier and the 4,309-review Mosley title (source: PRODUCT-BLUEPRINT.md arithmetic). The true competitive bar is a sub-50-review field.

---

## 3. Content Gap Analysis

Three gaps identified by the analyzer (source: gut_health_analysis.json — content_gaps field):

1. **Missing angle: root cause** — No top-20 book opens with a personalised trigger-identification mechanic. Every competitor defaults to "eat this, avoid that" without first establishing which trigger applies to the individual reader. Zero focused entrants in this position (source: PRODUCT-BLUEPRINT.md gap scoring).

2. **Missing angle: quick fix / time-bound reset** — Demand is validated by three entrants: "4-Week Gut Health Protocol" (BSR 161,285 / 181 reviews), "20-Minute Gut Health Fix" (BSR 324,756 / 227 reviews), "Super Gut Four-Week Plan" (BSR 44,113 / 48 reviews) — all source: harvested.json. The demand exists; the optimal framing (7 days, not 4 weeks) is unfilled.

3. **Missing angle: women-specific** — One entrant only: "What Every Woman Needs to Know About Her Gut" (BSR 298,784 / 29 reviews — source: harvested.json). Underperforming — ambiguous whether due to low demand or poor execution. Flagged as a product-3 experiment, not a primary bet (source: PRODUCT-BLUEPRINT.md gap verdict).

**What this book does that no competitor does:** Fuses gaps 1 and 2 in a single SKU. Days 1–2 deliver a structured trigger-identification exercise (root cause gap, unfilled). Days 3–7 deliver a tailored 5-day protocol (quick-fix gap, validated). No existing book in the top 20 occupies this combined position (source: PRODUCT-BLUEPRINT.md positioning rationale).

---

## 4. KU Penetration Finding

The analyzer recorded 100% KU penetration across the 20-book sample (source: gut_health_analysis.json — ku_penetration_pct: 100).

**Interpretation caveat:** 100% penetration across 20 books is statistically improbable because trad-pub anchors (Spector, Mosley, Enders) are almost certainly not in KU Select. The scraper likely defaulted to `true` where KU status could not be confirmed (source: PRODUCT-BLUEPRINT.md — "likely partial detection artifact").

**Real signal:** The self-pub long tail is overwhelmingly KU-enrolled. KU pages-read revenue is the primary income mechanism at launch price for short guides in this niche.

**Strategy implication:** Enrol in KU Select for the first 90 days. A 5,500-word guide is approximately 22 KENPC pages (source: PRODUCT-BLUEPRINT.md word-to-KENPC estimate). At the current KU rate of approximately £0.004 per page (source: KDP rate card), a full borrow yields approximately £0.09–£0.13 per read. Borrow velocity, not sale price, drives rank at launch.

---

## 5. Price Sweet Spot

From the 20-book dataset (source: gut_health_analysis.json):

- **Minimum price:** £1.99
- **Maximum price:** £13.99
- **Mean price:** £8.10 (dragged upward by trad-pub paperback editions priced £10–£14)
- **Computed sweet spot:** £3.00

The £8.10 mean is not the relevant benchmark for self-pub short guides. The Kindle self-pub cluster runs £1.99–£3.99 (source: PRODUCT-BLUEPRINT.md pricing analysis). The £3.00 sweet spot is the self-pub Kindle peak conversion price and aligns with the KDP 70% royalty band ceiling (£2.99 = approximately £2.09 royalty after delivery costs on Amazon UK — source: KDP rate card).

**Recommended pricing ladder (source: PRODUCT-BLUEPRINT.md):**

| Stage | Price | Trigger |
|-------|-------|---------|
| Launch (Days 1–5) | FREE (KDP Free Promo) | Stack downloads, borrows, algorithm signal |
| Post-promo (Day 6–30) | £0.99 | Impulse band; reviews accumulate |
| Mid-build | £1.99 | 10+ reviews OR BSR below 150,000 |
| Stable ceiling | £2.99 | 30+ reviews AND average rating 4.3 or above |

Do not price above £2.99 for guides under 7,000 words — pricing/length mismatch is the documented primary review-bomb trigger in this category (source: PRODUCT-BLUEPRINT.md risk table).

---

## 6. Target Reader Profile

- **Who:** Adults aged 25–55, primarily women, who have experienced unexplained bloating, IBS-type symptoms, or persistent digestive discomfort for months or years. They have already tried generic advice — removing gluten, reducing dairy, taking probiotics — without consistent relief. They are self-directed health researchers, not passive patients.
- **Pain:** They do not know which of multiple possible triggers (food intolerances, stress response, motility patterns) is causing their specific symptoms. Generic protocols keep failing them because no book has helped them identify which trigger is theirs.
- **Purchase emotion:** Desperation tempered by cautious hope. They have been disappointed by previous gut health books but will try one more if the promise is specific enough — "find YOUR trigger" rather than "eat better."
- **Evidence basis:** Self-pub entrant pattern (predominantly general / beginner framing) and the single women-specific entrant at BSR 298,784 / 29 reviews (source: harvested.json) both point to a reader who has not yet found a personalised solution. Content gap 1 (root cause) and review language mining across competitor titles confirm the reader's frustration with generic protocols (source: PRODUCT-BLUEPRINT.md positioning rationale and COMPETITIVE-ANALYSIS.md reader complaint data).

---

## 7. Seven KDP Keywords

Source for all seven keywords: PRODUCT-BLUEPRINT.md (derived from competitor title and subtitle analysis of the 20-book harvested dataset, 2026-05-13).

Monthly search volume for these specific terms: We need real data for this before making a recommendation. Amazon search volume data requires Publisher Rocket or similar tool not available in this session.

1. **gut health reset** — primary keyword; "reset" appears in zero of 20 competitor titles, making it a gap term with no competing exact-match listings.
2. **find your gut trigger** — unique positioning phrase; no competitor uses "trigger" in a title or subtitle.
3. **7 day gut protocol** — time-bound frame; mirrors the proven pattern of "4-Week Protocol" and "20-Minute Fix" entrants but at a shorter, more impulse-friendly commitment length.
4. **bloating relief plan** — symptom-led; maps to the self-described pain language readers use in review text and forum posts.
5. **ibs diagnostic guide** — clinical-adjacent but accessible; no current top-20 title uses the word "diagnostic."
6. **low fodmap alternative** — captures readers who have researched or attempted FODMAP elimination but want a simpler diagnostic-first entry point.
7. **gut healing for beginners** — broad volume term; positions the book as an accessible entry point for new searchers in the niche.

---

## 8. Three Recommended KDP Categories

Source: PRODUCT-BLUEPRINT.md (Section 7 — KDP categories, publisher-agent input).

1. **Books > Health, Family & Lifestyle > Diet & Nutrition > Digestive Health**
   Competition level: Medium. Best self-pub performer visible in this niche: BSR 37,505 / 50 reviews ("Gut Fix" — source: harvested.json). Achievable with a focused launch to 30+ reviews.

2. **Books > Health, Family & Lifestyle > Self-Help > Stress Management**
   Competition level: Medium. The gut-brain / vagal tone content on Day 5 of the book legitimately qualifies for this category. No existing gut health title occupies this crossover position in the scanned top 20.

3. **Kindle Store > Kindle eBooks > Health, Family & Lifestyle > Diseases & Physical Ailments > Abdominal Disorders**
   Competition level: Low-Medium. The BSR 8,091 anomaly in this adjacency (11 reviews — source: harvested.json, "Complete Guide to Taming Chronic Inflammation") confirms that ranking is achievable before a large review base accumulates. KU borrow velocity alone can drive rank in this sub-category.

---

## 9. Community Seeding Targets

**Subreddits:**

1. **r/ibs** — 146,000 members (source: GummySearch subreddit stats, accessed 2026-05-13). Approach: share the Day 1 trigger log framework as a standalone value post with no direct book promotion. Introduce the root-cause diagnostic concept as a discussion prompt. Link to the book only in replies if asked.
2. **r/guthealth** — member count: We need real data for this before making a recommendation. Community exists and is active; verify current member count at reddit.com/r/guthealth before posting. Approach: post a "How I identified my personal gut trigger" educational thread using the book's Day 2 trigger profile methodology.
3. **r/SIBO** — member count: We need real data for this before making a recommendation. Relevant because the "Fix Your Gut for Good" anchor title (existing series book) targets SIBO specifically; cross-promotional opportunity. Approach: lead with SIBO-adjacent content from the series anchor, mention the 7-day reset as a diagnostic entry point.

**Facebook Groups:**

4. **UK gut health and IBS support groups** — specific group names and member counts: We need real data for this before making a recommendation. Web search (2026-05-13) confirmed active UK gut health Facebook communities exist but no verified group names or member counts retrieved this session. Recommended action: search Facebook for "IBS UK support", "gut health UK", and "bloating help" to identify the 2–3 largest active groups before launch week.

5. **General UK women's health Facebook groups** — relevant because the reader profile skews female. Specific group names and member counts: We need real data for this before making a recommendation.

---

## 10. Comparable Authors for Also-Bought Seeding

Buy these titles on Kindle before and during launch week to signal co-purchase behaviour to the Amazon algorithm. Purchase from the same account the book will be associated with.

Source for ASINs: harvested.json (where listed); PRODUCT-BLUEPRINT.md (also-bought seeding rationale).

1. **Gut Fix** — ASIN: B0C888GXWL (source: harvested.json) — Top self-pub performer in the niche; BSR 37,505 / 50 reviews. Highest-priority seed.
2. **Gut Health and Mental Clarity: A Simple Microbiome Reset Plan** — ASIN: B0FYJHG4MP (source: harvested.json) — BSR 43,682 / 12 reviews. Closest structural match: short, KU-enrolled, self-pub, gut reset framing.
3. **Super Gut: A Four-Week Plan to Reprogram Your Microbiome** — ASIN: B09FDDVJQD (source: harvested.json) — BSR 44,113 / 48 reviews. William Davis author brand; establishes "also-bought" trail with a credible trad-pub adjacent title.
4. **Gut Health for Beginners: Boost Energy, Balance Weight** — ASIN: B0DYJHFHQ1 (source: harvested.json) — BSR 45,844 / 11 reviews. Targets the same beginner-entry audience.
5. **The 4-Week Gut Health Protocol for Beginners** — ASIN: B0C91NC6MS (source: harvested.json) — BSR 161,285 / 181 reviews. "Protocol for Beginners" framing directly adjacent to this book's positioning; highest review count in the self-pub field makes it a strong algorithm signal.

**Bonus anchor seed:** Giulia Enders — *Gut* — ASIN: B0GFX8K9GQ (source: harvested.json, UK Kindle edition — BSR 21,117). The Spector/Enders/Mosley halo brings category traffic; being in their "also-bought" trail captures passive browsers already warm to the niche.

---

## Summary

| Dimension | Finding | Source |
|-----------|---------|--------|
| Signal | GREEN | gut_health_analysis.json + PRODUCT-BLUEPRINT.md |
| Top self-pub BSR | 37,505 (50 reviews) | harvested.json |
| Self-pub median reviews | ~29 | PRODUCT-BLUEPRINT.md |
| KU penetration | 100% reported (likely partial artifact) | gut_health_analysis.json |
| Price sweet spot | £3.00 (self-pub Kindle cluster £1.99–£3.99) | gut_health_analysis.json + PRODUCT-BLUEPRINT.md |
| Launch price | FREE → £0.99 → £1.99 → £2.99 | PRODUCT-BLUEPRINT.md |
| Primary gap | Root cause + quick fix fused (no entrant) | PRODUCT-BLUEPRINT.md + gut_health_analysis.json |
| Target word count | 5,500 words | PRODUCT-BLUEPRINT.md |
| Opportunity score (raw) | 40/100 | gut_health_analysis.json |
| Opportunity score (self-pub adjusted) | ~65 | PRODUCT-BLUEPRINT.md |

---

*All figures in this report trace to: harvested.json (20-book UK scan, 2026-05-13), gut_health_analysis.json (2026-05-13), PRODUCT-BLUEPRINT.md (2026-05-13), or KDP rate card. Zero invented numbers. Where data does not exist, the report states: "We need real data for this before making a recommendation."*
