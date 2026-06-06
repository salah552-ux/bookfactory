# BookFactory Pipeline Validation Plan
**Version:** 1.0
**Created:** 2026-06-05
**Author:** pipeline-orchestrator (Opus)

---

## What "Validated" Means Here

A validated pipeline is one where you can trust its outputs to commit real money.
Different outputs carry different risk. This plan separates them.

**Three validation modes:**
- **Run today** — tests that can be executed right now against existing code and data
- **Run at milestones** — tests that require real-world data from live books
- **Watch continuously** — ongoing signals that tell you whether pipeline assumptions hold

---

## Risk Tiers

### TIER 1 — Niche Entry Decisions (highest risk)

A bad niche entry costs 6–8 weeks of pipeline capacity plus launch costs.

| Output | How It Goes Wrong | Detectability |
|--------|------------------|---------------|
| Opportunity score | Fiction guard not applied → 10-point inflation | Automated test catches it |
| Opportunity score | Data lineage drift → same niche scores 40/100 one month, 98/100 next | Only detectable by comparing runs with known-identical data |
| BSR-to-sales estimate | Community table wrong for this niche → revenue model built on incorrect assumptions | Only correctable with real KDP weekly data |
| Vagus nerve score (87/100) | 6 synthetic ASINs in the DB → score computed partly from made-up BSR values | Data quality flag exists, but no DB-level enforcement |

**Threshold for trusting a niche entry decision:** Score computed from Playwright-harvested data only. No synthetic ASINs in the DB for that niche. Fiction guard applied correctly (verify via test_analyzer.py Section 1).

### TIER 2 — Category Selection and Upload (medium-high risk)

Wrong category at upload = wasted discoverability. Already happened once.

| Output | How It Goes Wrong | Detectability |
|--------|------------------|---------------|
| KDP categories | Correct category selected in CATEGORY-SELECTION.md but wrong one entered in KDP browser | Not detectable until first BSR data comes in (days 1-7 post-live) |
| Category correction | Correction recommended but not executed before the deal window | Human gate failure |

### TIER 3 — Content Compliance (lower risk, but non-recoverable)

A non-compliant book can be taken down by KDP without notice.

| Output | How It Goes Wrong | Detectability |
|--------|------------------|---------------|
| Health claims | Book makes FDA-prohibited health claims that compliance-officer missed | Human review of COMPLIANCE-REPORT.md before upload |
| AI disclosure | Book uploaded without checking the AI questionnaire accurately | Human gate at upload |

### TIER 4 — Production Quality (lowest risk)

Wrong font or missing TOC is annoying, not catastrophic.

---

## Section 1: Tests That Can Run Today

### 1.1 Analyzer Unit Tests

**File:** `intelligence/validation/test_analyzer.py`
**Run command:**
```
$env:PYTHONIOENCODING = "utf-8"
Set-Location "C:\Users\salah\BookFactory"
& "C:\Users\salah\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" intelligence/validation/test_analyzer.py
```

**What it validates:**
- Fiction guard is applied (gap_score capped at 15 for fiction niches, never inflated to 25)
- Non-fiction structural patterns fire correctly for health titles
- Saturation formula inputs (A, B, C) computed correctly for known data
- Price elasticity correctly handles zero-price books (the bug that was fixed for cozy mystery)
- BSR velocity lookup returns correct range at every boundary
- Trad-pub anchor detection correctly fires and does not false-positive
- Opportunity score never exceeds 100
- Score is reproducible (identical inputs → identical output on repeated calls)

**Pass criteria:** All 40 tests pass. Zero failures.
**Fail action:** Do not trust any opportunity score until failing tests are fixed and re-passed.
**How often:** Before every blueprint decision. Also run after any change to analyzer.py.

**Last run:** 2026-06-05 — 40 passed, 0 failed.

---

### 1.2 Data Quality Audit

Run this manually before any blueprint decision for a niche.

**Checklist:**
```
[ ] opportunity-db.json — check analysis_summary.opportunity_score for the niche
    Compare with: uv run --python 3.12 --no-project python intelligence/analyzer.py "[niche]"
    Pass: both values match (or differ by <= 2 due to rounding)
    Fail: values diverge by > 2 — data lineage drift. Investigate before proceeding.

[ ] harvest_status for the niche = "complete" (not "PARTIAL")
    If PARTIAL: do not run brain. Run "harvest [niche]" with Playwright first.

[ ] Count synthetic ASINs in bsr_snapshots: any record with asin_status = "SYNTHETIC"
    Pass: 0 synthetic ASINs
    Fail: any synthetic ASINs present — Playwright re-harvest required before blueprint

[ ] next_harvest_due date: is it in the past?
    Pass: harvest_overdue = false
    Fail: harvest_overdue = true — re-harvest before blueprint

[ ] Last harvested date is within 14 days
    Pass: (today - last_harvested) <= 14 days
    Fail: data is stale — re-harvest
```

**Current status of each niche (as of 2026-06-05):**

| Niche | Harvest Status | Synthetic ASINs | Overdue | Score in DB | Score on rerun | Match? |
|-------|----------------|-----------------|---------|-------------|----------------|--------|
| gut-health | complete | 0 | YES (23 days) | 40/100 | 98/100 | NO — data lineage drift |
| cozy-mystery | complete | 0 | No | 76/100 (was 66 before fix — check again) | 66/100 | MISMATCH |
| vagus-nerve | PARTIAL | 6 | No | 87/100 | 87/100 (from partial data) | CAUTION |

**Actions required before next blueprint:**
1. Re-harvest gut-health (overdue, score mismatch)
2. Re-harvest vagus-nerve with Playwright (to replace 6 synthetic ASINs)
3. Verify cozy-mystery score in DB is 66 (not 76) after the correction applied 2026-06-03

---

### 1.3 Pipeline Process Audit (run on any live book)

Check that the published books went through the right gates. This is a retrospective audit — you cannot undo a published book, but the findings calibrate your trust in the next one.

**For each live book, verify these fields in pipeline-state.json:**

```
human_gates.blueprint_approved = true
human_gates.final_approval_passed = true
human_gates.ai_questionnaire_confirmed = true
human_gates.published = true
quality_scores.final_approval_score >= 270   (or confirm it was reviewed)
```

**For Death in the Cathedral Close — known issue:**
- `category_mismatch_flagged = true` — categories in KDP do not match CATEGORY-SELECTION.md plan
- Action: Correct KDP categories to Cozy Mystery + British & Irish. Verify after making the change by checking the live Amazon page.

**Pass criteria:** All gate fields = true. Categories in KDP match CATEGORY-SELECTION.md.

---

### 1.4 BSR Table Boundary Verification

The BSR velocity table uses ceiling-inclusive comparison. The table as written:

```
BSR <= 100    → 300–500 sales/day
BSR <= 1,000  → 50–300 sales/day
BSR <= 10,000 → 5–50 sales/day
BSR <= 50,000 → 1–5 sales/day
BSR <= 100,000 → 0.5–1 sales/day
BSR > 100,000  → 0.0–0.5 sales/day
```

**Important:** This means BSR 360 (the cozy mystery "effective ceiling") falls in the 50–300/day band, not the 1–5/day band. A blueprint that cites "niche ceiling BSR ~360" is implying 50–300 sales/day. That is a significant claim built on community estimates with LOW/VERY LOW confidence.

**The test suite confirms the lookup logic is implemented correctly.** What cannot be confirmed today: whether the community estimates are accurate for these specific niches at these price points.

---

## Section 2: Tests That Require Time

### 2.1 BSR Calibration — First Real Numbers

**What it validates:** Whether the community-derived BSR→sales table is accurate for this pipeline's specific niches, price points, and KU enrollment.

**Threshold to trust:** 8+ entries per BSR range before updating the table. (Currently: 0 entries.)

**How to collect:**
1. Each week you log KDP data, run: `calibrate bsr [book-slug] [week-number]`
2. This calls `python intelligence/analyzer.py calibrate <BSR> <units> "<title>"` and writes to BSR-CALIBRATION.md
3. After 8 entries in a BSR range, compare the real ratio to the estimated range

**Specific milestones to collect data at:**

| Milestone | Book | What to log |
|-----------|------|-------------|
| Week 1 post-launch | Every new book | BSR on Day 7 + units from KDP |
| Week 2 post-launch | Every new book | BSR on Day 14 + units from KDP |
| Week 4 post-launch | Every new book | BSR on Day 30 + units from KDP |
| Week 8 post-launch | Every new book | BSR on Day 60 + units from KDP |
| Day 90 post-launch | Every new book | Final BSR + cumulative units |

**Threshold to update BSR_VELOCITY_UK in analyzer.py:**
- Minimum 5 real data points in the same BSR range
- At least 2 of them from non-promo weeks (promo periods distort BSR)
- If real ratio is outside 2x of the estimated range: update the table
- Example: if table says BSR 1,000 = 50–300/day and real data shows 8–15/day consistently: the table is a 6–37x overestimate

**Why this matters for niche decisions:** If the table is a 6x overestimate, a book you think is generating £300/day at BSR 1,000 is actually generating £50/day. That changes the series revenue model entirely.

**Timeframe:** Minimum 12 weeks after first KDP data entry to have enough points for the first BSR range calibration. With two live books and weekly logging, you could have 16+ entries by September 2026.

---

### 2.2 Opportunity Score vs Actual Performance

**What it validates:** Whether the 0–100 opportunity score actually predicts which niches perform better.

**The test:** At 90 days post-launch for each book, run `record blueprint performance [book-slug]` and fill in the actuals in BLUEPRINT-PERFORMANCE.md.

**Specific metrics to compare:**

| Prediction | Metric | Source | Pass threshold |
|------------|--------|--------|----------------|
| gut-health score 98/100 (self-pub adjusted) | BSR average weeks 4–12 | KDP dashboard | BSR < 50,000 average |
| cozy-mystery score 66/100 | BSR average weeks 4–12 | KDP dashboard | BSR < 100,000 average |
| Higher score should produce better BSR | Rank correlation between score and BSR | Both books | gut-health BSR < cozy-mystery BSR |
| Cathedral setting gap (0/16 competitors) | Cozy category rank after correction | KDP dashboard | Sub-category rank < 5,000 |

**Timeline:**
- Fix Your Gut for Good — Day 90: 2026-07-20
- Death in the Cathedral Close — Day 90: 2026-08-01

**At Day 90:** Fill in the 90-Day Assessment table in BLUEPRINT-PERFORMANCE.md. Compare blueprint predictions to actuals. If gut-health scores 98/100 but BSR averages > 100,000, the score is an overestimate. Adjust the scoring formula.

---

### 2.3 Category Correction Validation

**What it validates:** Whether the category correction for Death in the Cathedral Close (from Traditional Detective to Cozy Mystery) actually improves BSR.

**Test design:**
- Baseline: BSR on Deal Day 1 (2026-06-02) = 1,370,902 overall, #7,668 in Traditional Detective
- Intervention: Change to Cozy Mystery + British & Irish (pending Architect action)
- Expected outcome: Within 14 days of correction, BSR sub-category rank in Cozy should be measurably better than #7,668 in Trad Detective
- Measurement date: 14 days after category correction is applied

**Pass criteria:** Cozy Mystery sub-category rank < 7,668 within 14 days of the correction.
**Fail criteria:** Rank stays above 7,668 — suggests BSR 1.37M is too low for any category positioning, independent of which category it's in.

**Timeline:** Depends on when the Architect applies the correction. Apply it this week. Measure at Day 7 and Day 14 after.

---

### 2.4 ARC Programme Validation

**What it validates:** Whether an ARC programme actually produces reviews within 30 days, and whether those reviews affect BSR.

**Current state:** Both live books have 0 ARC copies sent and 0 reviews at day 30+. No data exists.

**Test design for Book 3:**
- Send 10–20 ARC copies via BookFunnel 3 weeks before launch
- Measure review count at Day 7, Day 14, Day 30 post-launch
- Compare BSR trajectory (weeks 1–4) with Book 1 and Book 2 (no ARC baseline)

**Pass criteria:** At least 3 verified reviews at Day 7. BSR trajectory shows improvement vs Book 1/2 baseline in weeks 1–4.

**Timeline:** This cannot be validated until Book 3 launch. The ARC programme for Book 3 should start 3 weeks before its live date.

---

### 2.5 Also-Bought Cluster Validation

**What it validates:** Whether the book ends up in the correct also-bought cluster (same genre readers).

**Check at Day 14 post-launch:** Run the also-bought audit (built into post-launch-tracker). Navigate to the book's Amazon page, check the "customers also bought" carousel.

**Pass criteria:** At least 40% of also-bought titles are in the same genre (Cozy Mystery, or Gut Health non-fiction).
**Fail criteria:** Also-bought carousel shows unrelated titles — indicates Amazon has not correctly clustered the book, reducing organic discovery.

**If it fails:** See the intervention plan in COUNTDOWN-DEAL-PLAYBOOK.md (use a countdown deal or price change to generate new purchases from target-genre readers).

---

## Section 3: Failure Modes to Stress-Test

These are scenarios that could cause serious, non-recoverable harm if they happen in production.

### FAILURE MODE 1: Wrong book published (wrong file uploaded)

**Risk:** kdp-upload-agent uploads the wrong EPUB. This would mean a different book is live under the correct title.

**Detection mechanism:** The upload agent saves to draft and human gate fires before publishing. The Architect reviews the draft on Amazon before typing "PUBLISH".

**Stress test:** Before any new book upload, manually verify:
1. The EPUB file path in pipeline-state.json matches the actual file in exports/final/
2. Open the EPUB in a reader and verify the first chapter heading matches the book title
3. Check the file size is in the expected range (typically 100KB–2MB for a text Kindle book)

**This is currently not tested automatically.** Add to the pre-upload checklist in the KDP upload gate.

### FAILURE MODE 2: Non-compliant health claims published

**Risk:** A health chapter makes an FTC/FDA-prohibited claim (e.g., "this protocol cures IBS") that the compliance-officer agent missed.

**Detection:** COMPLIANCE-REPORT.md for each chapter should show no prohibited claims. The book-reviewer scores metric 11 "KDP Readiness" — if this score is low, investigate before publishing.

**Current state:** Both live books have COMPLIANCE-REPORT.md files. These should be reviewed before any AMS ads are started (ads draw more scrutiny).

**Stress test:** Read COMPLIANCE-REPORT.md for Fix Your Gut for Good. Verify no "Level 5 — Not Acceptable" claims were present. If the report shows any such claims, check whether they were corrected in the final manuscript.

### FAILURE MODE 3: Opportunity score based on bad data used for entry decision

**Risk:** A new book is commissioned based on an opportunity score computed from a harvest with synthetic ASINs or stale data.

**Detection:** The data quality audit checklist (Section 1.2 above) catches this before the brain agent runs. The intelligence gate check in the dispatcher guide requires harvest_status = "complete" and data within 14 days.

**Stress test:** Right now, run the data quality audit for vagus-nerve:
1. Count synthetic ASINs in opportunity-db.json bsr_snapshots for vagus-nerve
2. Check harvest_status = "PARTIAL"
3. Confirm: no blueprint can be commissioned for vagus-nerve until Playwright harvest replaces the 6 synthetic ASINs

**Current status:** CONFIRMED BLOCKED — vagus-nerve harvest is PARTIAL. The 87/100 score in opportunity-db.json is based on mixed real/synthetic data.

### FAILURE MODE 4: The fiction guard is reverted in a future analyzer.py change

**Risk:** Someone edits analyzer.py and removes or breaks the fiction guard (lines 507–523). The next fiction niche scores 25/25 on content gap, inflating the score by 10 points. This is the exact bug that already happened once.

**Prevention:** The test suite (test_analyzer.py Section 1) catches this. Run the tests after every change to analyzer.py.

**This is why the tests must be run before every blueprint.** Not just when there's a reason to suspect a problem.

### FAILURE MODE 5: Category selection approved but wrong categories entered at upload

**Risk:** The Architect approves CATEGORY-SELECTION.md with the correct categories, but when kdp-upload-agent fills in the KDP upload form, it enters the wrong categories (either by mistake or by the system defaulting to a prior state).

**This already happened.** Death in the Cathedral Close was uploaded to Trad Detective instead of Cozy Mystery.

**Detection:** The kdp-upload-agent logs the categories it entered in the agent log. Check this log after every upload.

**Permanent fix:** Add a post-upload verification step: after publishing, navigate to the live book's Amazon page, scrape the category breadcrumbs, and compare against CATEGORY-SELECTION.md. Flag any mismatch immediately.

**This step does not currently exist as an automated agent.** Add it to the publisher-agent or kdp-upload-agent as a mandatory post-publish check.

---

## Section 4: The Validation Test Plan — Specific Tests, Thresholds, Timeframes

### Tier 1 — Run Before Every Blueprint Decision

| Test | How to run | Pass threshold | Fail action |
|------|-----------|----------------|-------------|
| Analyzer unit tests | `python intelligence/validation/test_analyzer.py` | 40/40 pass | Block blueprint until all tests pass |
| Data quality audit | Manual check per Section 1.2 | harvest_status=complete, 0 synthetic ASINs, data < 14 days old, DB score matches rerun score | Run Playwright re-harvest first |
| Fiction guard check | Covered by unit tests Section 1 | gap_score <= 15 for fiction niches | Investigate analyzer.py change history |

### Tier 2 — Run After Every New Book Goes Live

| Test | When | How | Pass threshold | Fail action |
|------|------|-----|----------------|-------------|
| Category verification | Day 1–3 post-live | Check Amazon listing sub-categories | Categories match CATEGORY-SELECTION.md exactly | Correct in KDP immediately |
| BSR calibration entry | Week 1 | `calibrate bsr [slug] 1` with KDP data | Entry written to BSR-CALIBRATION.md | Log manually if command fails |
| BSR calibration entry | Week 2 | `calibrate bsr [slug] 2` | Entry written to BSR-CALIBRATION.md | Same |
| BSR calibration entry | Week 4 | `calibrate bsr [slug] 4` | Entry written to BSR-CALIBRATION.md | Same |
| Also-bought audit | Day 14 | Manual Amazon page check | >= 40% correct genre in carousel | Run intervention (price change + category fix) |

### Tier 3 — Run at 30-Day Milestone

| Test | Metric | Pass threshold | Fail trigger |
|------|--------|----------------|--------------|
| Review count | Reviews via KDP dashboard | >= 3 reviews if ARC programme was run | If 0: investigate why ARC readers did not review |
| BSR trajectory | Average BSR weeks 2–4 | Below niche ceiling BSR | If BSR > 500,000: investigate category, pricing, also-bought cluster |
| KU pages | Total KENP from KDP | > 0 (any KU reads) | If 0: check KDP Select enrollment is active |

### Tier 4 — Run at 90-Day Milestone

| Test | Metric | Pass threshold | Fail trigger |
|------|--------|----------------|--------------|
| Blueprint performance | Actual BSR vs predicted | Within 2x of blueprint BSR target | Update blueprint calibration notes; adjust opportunity score interpretation |
| BSR calibration | 8+ entries across weeks 1–12 | Calibrated rate for this niche's BSR range | Run additional weeks before trusting the community table |
| Opportunity score validity | Did higher score produce better BSR? | gut-health BSR < cozy-mystery BSR (gut health scored 98 vs cozy 66) | If correlation is inverted: the scoring formula needs review |
| Series viability | Decision: commission Book 2 / Book 3 in series? | BSR stable under 100,000 OR strong KU read-through signal | If BSR > 500,000 at Day 90: evaluate whether to continue the series |

### Tier 5 — Run Monthly (Ongoing)

| Test | Metric | Pass threshold | Fail action |
|------|--------|----------------|-------------|
| Algo intelligence update | Run `update algo intelligence` | No confirmed contradictions with current live strategy | Update ALGO-INTELLIGENCE.md; propagate to dependent agents |
| Harvest freshness check | Check opportunity-db.json for all active niches | No niche with harvest_overdue = true | Re-harvest before any new book decision |
| BSR table accuracy | After 5+ calibration entries per BSR range | Real sales within 2x of estimated range | Update BSR_VELOCITY_UK in analyzer.py |

---

## Section 5: What Cannot Be Validated Until More Data Exists

These are things the system assumes but cannot currently verify:

1. **The community BSR table.** The table labels itself VERY LOW confidence. No real data. Every sales projection, revenue model, and series ROI calculation is built on this. Start logging weekly KDP data immediately. This is the highest-priority data collection gap in the entire pipeline.

2. **Whether opportunity scores predict performance.** Both books are under 90 days post-launch. The score-to-outcome correlation test requires Day 90 data (July/August 2026). Until then, the scoring formula is untested against real outcomes.

3. **Whether ARC readers review.** Both books launched without an ARC programme. There is no baseline for how many of N ARC copies sent convert to reviews. Book 3 will establish this.

4. **Whether the also-bought correction for Death in the Cathedral Close works.** Category correction has not yet been applied. The outcome of the correction (if applied) will be the first real test of whether category matters more than BSR for discovery.

5. **Whether the vagus nerve niche is actually viable at BSR 3,200.** The top product's BSR of 3,200 puts it in the 50–300 sales/day band on the community table. But the community table has LOW confidence above BSR 100. Until a book in this niche is live and weekly data is logged, the 87/100 score is a model output, not a validated signal.

---

## Summary: What to Do This Week

| Priority | Action | Time needed |
|----------|--------|-------------|
| 1 | Run `python intelligence/validation/test_analyzer.py` — confirm 40/40 pass | 2 minutes |
| 2 | Apply category correction for Death in the Cathedral Close in KDP | 15 minutes |
| 3 | Check live Amazon page and confirm categories after correction | 5 minutes — do 24 hours after KDP update |
| 4 | Log Week 5 BSR data: `calibrate bsr death-in-the-cathedral-close 5` | 10 minutes — need KDP dashboard |
| 5 | Log Week 6 BSR data for Fix Your Gut for Good: `calibrate bsr fix-your-gut-for-good 6` | 10 minutes |
| 6 | Re-harvest gut-health (data 23 days old, over 14-day threshold) | 30 minutes — requires Playwright |
| 7 | Schedule Playwright re-harvest for vagus-nerve before any blueprint decision | 30 minutes — requires Playwright |

---

*This plan was produced after reading:*
- `.claude/agents/00-coordinator/sonnet-dispatcher-guide.md` — full pipeline spec
- `intelligence/BLUEPRINT-PERFORMANCE.md` — live book performance data
- `intelligence/reports/SMOKE-TEST-REPORT-2026-06-03.md` — June 3 layer test findings
- `intelligence/opportunity-db.json` — current niche data and quality flags
- `intelligence/analyzer.py` — full algorithm implementation
- `intelligence/BSR-CALIBRATION.md` — calibration status (0 entries)
- `books/death-in-the-cathedral-close/pipeline-state.json` — live book state
