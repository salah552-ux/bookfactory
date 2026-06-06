# Blueprint Performance Tracker
## BookFactory Intelligence Layer
## Purpose: Validate blueprint predictions against actual outcomes for future accuracy

**Rule:** All inferred or estimated values are labelled [INFERRED]. Architect-confirmed actuals are labelled [ACTUAL]. Data from KDP dashboard is labelled [KDP]. No unlabelled claims.

---

## HOW TO UPDATE THIS FILE

When the Architect runs `track launch [book-slug]` and provides KDP dashboard data, the post-launch-tracker agent appends a weekly row to the book's LAUNCH-TRACKER.md. At 30-day and 90-day marks, paste key milestones here so the intelligence layer can compare predictions to outcomes.

Update trigger: `update blueprint performance [book-slug] [milestone]`
Where milestone is: week-4 / week-8 / day-90

---

## BOOK 1 — FIX YOUR GUT FOR GOOD

**ASIN:** B0GXYLWS1W
**Live date:** 2026-04-21 [ACTUAL — from pipeline-state.json]
**Age as of 2026-06-04:** 44 days
**Price at launch:** $9.99 / ~£5.41 [ACTUAL — from KDP-LISTING.md]
**KDP Select:** Enrolled [ACTUAL]
**Free days used:** 2 promo periods — Apr 25–27 and May 2–3 [ACTUAL — from pipeline-state.json]
**Countdown deal this term:** Cannot run — both promo slots used. Next window: ~Aug 18, 2026 [ACTUAL]

---

### WHAT THE BLUEPRINT PREDICTED

**Niche intelligence:** gut-health (Stage 00, May 2026)
**Opportunity score at time of commissioning:** Retrospective — book was created before intelligence layer formalised. No formal score exists for this book's commissioning decision.
**Self-pub effective score (rerun 2026-06-03):** 98/100 [INFERRED — from INTELLIGENCE-LOG.md smoke test rerun]
**Niche saturation score:** Not formally calculated at commissioning. Rerun score unavailable in current logs.

**Blueprint prediction (from BLUEPRINT.md):**
- Target category: IBS/Gut Health (Kindle Store)
- Positioning: Relapse-prevention angle — differentiated from standard SIBO/diet books
- Reader: "Sarah" — 30s–40s woman, multiple failed SIBO treatments, medically informed
- Revenue model: KDP Select + KU for 90 days, then evaluate going wide
- Review trajectory assumed: ARC readers → 5+ reviews at 30 days [NOT ACHIEVED — arc_readers_confirmed: 0]

**Marketing plan predictions (from MARKETING-PLAN.md):**
- AMS profitable threshold: 5 reviews minimum, 10 recommended
- Organic-only for weeks 1–6
- ARC pipeline was planned but never executed (0 ARC copies sent)
- No BookFunnel link live as of 2026-06-04

---

### ACTUAL PERFORMANCE (as of 2026-06-04, day 44)

| Metric | Blueprint target | Actual | Status |
|--------|-----------------|--------|--------|
| Reviews at day 30 | 5+ (via ARC pipeline) | 0 [ACTUAL — pipeline-state.json] | MISS |
| Reviews at day 44 | Est. 8–12 | 0 [ACTUAL] | MISS |
| ARC copies sent | 25 (planned) | 0 [ACTUAL] | MISS |
| Email subscribers | Growing via lead magnet | 0 (BookFunnel not live) [ACTUAL] | MISS |
| BSR (current estimate) | Not formally projected | Unknown — no weekly data logged yet [NO DATA] | PENDING |
| KU pages | Growing | Unknown — no weekly data logged yet [NO DATA] | PENDING |
| Countdown deal | Day 30 window | Cannot run this term [ACTUAL] | BLOCKED |
| AMS campaigns | Live at 5 reviews | Not started (0 reviews) [ACTUAL] | BLOCKED |

**Root cause of misses:**
- Zero ARC programme executed before launch → zero reviews at launch
- No pre-launch audience building → no organic discovery
- Free days used early (Apr 25–27, May 2–3) without review base → BSR spike without review conversion
- No email capture active → no asset being built from buyer traffic

**Gap diagnosis:** The pipeline produced a complete book but no launch infrastructure. All three gaps (audience, ARC, email) were unexecuted at time of launch.

---

### PERFORMANCE TRACKER TABLE (update weekly from LAUNCH-TRACKER.md)

| Date | Day # | BSR Overall | BSR Sub | Reviews | KU Pages | Units | Notes |
|------|-------|-------------|---------|---------|----------|-------|-------|
| 2026-06-04 | Day 44 | [PENDING — run track launch to log] | — | 0 [ACTUAL] | — | — | No weekly data logged. Architect must run 'track launch fix-your-gut-for-good'. |

---

### 90-DAY ASSESSMENT (due: 2026-07-20)

Complete this section when the Architect runs `track launch fix-your-gut-for-good` at Day 90 (July 19–21, 2026).

| Metric | Blueprint target | 90-day actual | Delta |
|--------|-----------------|---------------|-------|
| Reviews | 15+ | TBD | TBD |
| BSR average (weeks 4–12) | < 50,000 | TBD | TBD |
| KU pages (total) | TBD | TBD | TBD |
| Email subscribers | 50+ | TBD | TBD |
| AMS ROAS | Profitable | TBD | TBD |

---

## BOOK 2 — DEATH IN THE CATHEDRAL CLOSE

**ASIN:** B0GZD1S8HF
**Live date:** 2026-05-03 [ACTUAL — from pipeline-state.json]
**Age as of 2026-06-04:** 32 days
**Price at launch:** £6.99 / $6.99 [ACTUAL]
**KDP Select:** Enrolled [ACTUAL]
**Countdown deal:** Running 2026-06-02 to 2026-06-09 [ACTUAL]

---

### WHAT THE BLUEPRINT PREDICTED

**Niche intelligence:** cozy-mystery (Stage 00, June 2026 — retrospective)
**Opportunity score:** 66/100 (corrected from initial 76 — fiction guard applied) [ACTUAL — from INTELLIGENCE-LOG.md]
**Blueprint verdict:** BUILD WITH CONDITIONS — series confidence HIGH, standalone MEDIUM pending Book 1 stabilisation
**Content gap confirmed:** Cathedral/ecclesiastical setting — 0/16 competitors in harvest [ACTUAL — from OPPORTUNITY-REPORT-2026-06-01]

**Blueprint predictions (BLUEPRINT-2026-06-01-cozy-mystery.md):**
- Niche ceiling: BSR ~360 (self-pub effective, stripping paranormal anchor) [INFERRED from opportunity report]
- Category target: Cozy Mystery + British & Irish Contemporary [PLANNED — but never applied]
- Review trajectory: 0 reviews at Day 30 — critical alert flagged in INTELLIGENCE-LOG.md [ACTUAL]

---

### ACTUAL PERFORMANCE (as of 2026-06-04, day 32)

| Metric | Blueprint target | Actual | Status |
|--------|-----------------|--------|--------|
| Reviews at day 30 | 5+ | 0 [ACTUAL — pipeline-state.json] | MISS |
| ARC copies sent | 25 (planned) | 0 [ACTUAL] | MISS |
| Category (live) | Cozy + British & Irish | Traditional Detective + Amateur Sleuth [ACTUAL] | WRONG CATEGORY |
| BSR at Day 30 (Deal Day 1) | < 50,000 | 1,370,902 [ACTUAL — from pipeline-state.json] | MISS |
| BSR sub (Deal Day 1) | Cozy category top 500 | Traditional Detective #7,668 [ACTUAL] | WRONG CATEGORY |
| Email subscribers | Growing | 0 (BookFunnel not live) [ACTUAL] | MISS |

**Root cause of misses:**
- Category mismatch: book uploaded to Trad Detective instead of Cozy. Cozy never added at Day 30. Directly reduces discoverability by removing book from the identified opportunity category.
- Zero ARC programme: same as Book 1.
- BSR at 1.37M on Deal Day 1 indicates near-zero organic discovery before the deal.

**Active intervention:** Countdown Deal (2026-06-02 to 2026-06-09) is live. Category correction to Cozy was recommended 2026-06-02 and is pending Architect action.

---

### PERFORMANCE TRACKER TABLE (update weekly)

| Date | Day # | BSR Overall | BSR Sub | Reviews | KU Pages | Units | Notes |
|------|-------|-------------|---------|---------|----------|-------|-------|
| 2026-06-02 | Day 30 | 1,370,902 [KDP] | Trad Detective #7,668 [KDP] | 0 [KDP] | — | — | Deal Day 1. Category mismatch confirmed. |

---

### 90-DAY ASSESSMENT (due: 2026-08-01)

| Metric | Blueprint target | 90-day actual | Delta |
|--------|-----------------|---------------|-------|
| Reviews | 10+ | TBD | TBD |
| BSR average (weeks 4–12) | < 100,000 | TBD | TBD |
| KU pages (total) | TBD | TBD | TBD |
| Email subscribers | 25+ | TBD | TBD |

---

## INTELLIGENCE LAYER CALIBRATION NOTES

### What the blueprint predictions will be tested against:

1. **Opportunity score validity:** Does a higher opportunity score (98/100 for gut-health vs. 66/100 for cozy-mystery) correlate with better actual BSR performance? We will know by Day 90 for both books.

2. **Content gap validation:** The cathedral setting gap (0/16 competitors) was predicted to be an advantage. If the book achieves Cozy category ranking after correction, the content gap prediction validates. If BSR remains poor despite category correction, the gap signal was weaker than scored.

3. **Niche saturation signal:** Cozy mystery scored moderate saturation (5.79/10) with 8 new entrants in the sample. If those new entrants (Anthea Fraser, Jenny Kane) outperform our book despite our setting gap, the saturation model is underweighting recency/author brand as a factor.

4. **BSR calibration:** All future blueprint scores will be adjusted once BSR-CALIBRATION.md has 8+ entries per book. Current estimates are community-derived — the actual conversion rate for these niches at these price points is unknown until logged.

---

## FUTURE BOOKS

When a new book reaches 30 days post-launch, create a new section in this file following the template above. The post-launch-tracker agent will prompt for this at the Day 30 milestone.
