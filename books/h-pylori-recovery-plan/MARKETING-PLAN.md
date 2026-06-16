# MARKETING PLAN — The H. Pylori Recovery Plan
## Stage 07 | marketing-agent (master-orchestrator, Opus) | 2026-06-11

**Book:** The H. Pylori Recovery Plan (Fix Your Gut for Good — Book 3) · Author: S.A. Ibrahim
**Inputs read:** pipeline-state.json · MARKET-INTELLIGENCE.md · BLUEPRINT.md · KDP-LISTING.md · SEO-STRATEGY.md · PRE-LAUNCH-PLAN.md · failure-store.json

```
ALGO-INTELLIGENCE STATUS
═══════════════════════════════════════════════════════════════════════
Version read: v1.2 — 2026-06-12 (CURRENT VERSION as of reconciliation 2026-06-16)
Section 0 mechanics contradicted/updated by ALGO-INTELLIGENCE.md: none material to this plan
New mechanics in v1.2 — reconciliation check (category-decision-agent, 2026-06-16):

1. RUFUS/GSO SEMANTIC INTENT LAYER (LOW confidence — v1.2 NEW)
   Check: Does metadata express real reader intent? Title/subtitle/description in natural
   language with one strong key phrase per slot?
   VERDICT: ALREADY COMPLIANT. Title is human-readable ("The H. Pylori Recovery Plan" —
   single strong phrase, no stuffing). Subtitle names the reader's real problem in their
   language. Description opens with verbatim reader language ("You tested positive. Then you
   Googled it."). No keyword-stuffed title. No suppression risk identified.
   NEW ACTION: None required.

2. READ-THROUGH / COMPLETION AS RANKING SIGNAL (LOW-MED confidence — v1.2 UPDATED)
   Check: Does completion architecture already cover front-loaded value and chapter
   pull-through?
   VERDICT: ALREADY COVERED by §0.10 (KU Completion Architecture — hook-optimizer Stage 05).
   All 14 chapter openings + 14 closings scored; only Ch.1 opening fell below threshold and
   was rewritten to a reader-recognition drop. All 14 closings strong with no rhetorical-
   question closes (NEVER-rule #7). Completion architecture explicitly verified at Stage 05.
   NEW ACTION: None required.

3. LEAN NON-REPETITIVE BACKEND KEYWORDS (MEDIUM confidence — v1.2 UPDATED)
   Check: Do the 7 backend keyword fields repeat words already in title/subtitle?
   VERDICT: ALREADY COMPLIANT. SEO-STRATEGY.md §5b explicitly verified non-repetition per
   the ALGO §17 byte-count discipline. The SEO agent's annotation confirmed: all 7 rows avoid
   exact title/subtitle term duplication (the two partial overlaps — "stomach" in Row 6 and
   "plan" in Row 7 — occur within distinct long-tail buyer phrases and are documented as
   acceptable per the SEO agent's own rule). v1.2 non-repetition rule = already applied.
   NEW ACTION: None required.

SUMMARY: v1.2 adds three mechanics to the pipeline's knowledge base. All three are already
implemented in this book's pipeline. No strategy changes to this plan are required.
This plan now operates on ALGO-INTELLIGENCE.md v1.2 as confirmed current version.
═══════════════════════════════════════════════════════════════════════
```

**Rule 1 compliance.** This niche has BSR data [BLOCKED] (no Playwright harvest — MARKET-INTELLIGENCE.md, KDP-LISTING.md Decision 4). Therefore: **no BSR-to-sales conversion, no sales/day estimate, and no 90-day revenue figure is invented anywhere below.** Where a number would normally go, the plan states "We need real data for this before making a recommendation" and names the data gap. Every ad budget reads from pipeline-state.json; none are set, so each is flagged.

> **NICHE ADAPTATION.** The marketing-agent template references cozy-mystery categories/communities. Every category, keyword, competitor, and community below is re-derived for the H. pylori / gut-health niche and the Rachel avatar.

---

## LAUNCH SITUATION — The H. Pylori Recovery Plan

```
Live date (list):    not yet live — planned KDP list date 2026-07-08 (T-14)
Paid-launch date:    2026-07-22 (Wednesday)
Days since launch:   pre-launch (T-41 today)
Current reviews:     0  (avg rating: n/a)
Current BSR (main):  n/a — not live
Current BSR (sub):   n/a — not live
KDP Select:          YES (kdp_select: true)
ASIN:                null — not assigned (book not published)

AD GATE STATUS:      CLOSED (book is not live; 0 reviews; no BSR)
  Condition A (BSR):     not met — no listing yet
  Condition B (reviews): not met — 0 reviews
  → ZERO ad spend permitted. The gate opens only post-launch when a stable BSR + 10
    reviews + 4.0 avg all hold. amazon-ads-agent must NOT be invoked until then.

PHASE:               Phase 0 — pre-launch
SINGLE BIGGEST BLOCKER: no ARC cohort yet — reviews are the gate to everything (ads,
  Kindle Daily Deal pool, BookBub). Recruitment starts today (PRE-LAUNCH-PLAN Output 2).
NEXT 7 DAYS:         Recruit ARC readers in r/HPylori, r/Gastritis, and the H. pylori
  Facebook support groups; begin also-bought/also-read seeding of the comp + series
  titles from the publishing account; build the 3 AMS campaigns PAUSED.
```

---

## ZERO-SPEND ALGORITHMIC ACTIONS — mandatory checklist

```
☑ KU Completion Architecture (§0.10) — Stage 05 hook-optimizer scored all 14 chapter
  openings + 14 closings; only Ch.1 opening fell below 35/50 and was rewritten to a
  reader-recognition drop; all 14 closings already ≥35/50 with NO rhetorical-question
  closes (NEVER-rule #7). Back matter sits AFTER a satisfying conclusion (locked last
  line). VERDICT: completion architecture PASS — no chapter ends weakly; no further
  hook-optimizer fix required.

☑ Also-Read seeding (§0.11 — DISTINCT from Also-Bought) — the publishing account should
  KU-BORROW (not just buy) the comp titles + series Books 1 & 2 before launch so the
  co-READING signal forms alongside the co-purchase one. Named titles: The H Pylori Diet
  (B00C7OS2D4), H-PYLORI TREATMENT (B0D5M7SPVZ), the series titles. KU readers in r/HPylori
  who borrow this book compound the signal automatically over time.

☑ Hourly concentration window (§0.12) — launch-day buy window = 07:00–10:00 BST,
  2026-07-22. Justification: UK Kindle browsing peaks in the morning commute/breakfast
  window — a JUDGMENT CALL based on observed UK publishing-community patterns, NOT a cited
  data source. All owned-channel CTAs say "today" and point into this window.

☑ REACH links direct to Amazon (§0.13) — every link in REACH-PACK.md and PRE-LAUNCH-PLAN
  is the clean direct URL amazon.co.uk/dp/[ASIN] / amazon.com/dp/[ASIN] — no Linktree, no
  landing page. The direct URL is the external-traffic attribution signal.

☑ Free days also seed Also-Viewed (§0.14) — the 2026-07-17/18 free days are a 3-part
  action: (1) free-chart velocity spike, (2) Also-Viewed seeding from product-page visits
  by readers who also viewed competitor pages, (3) KU borrow signal from free downloaders.

☑ Series tag verification (§0.15) — "Fix Your Gut for Good" must be entered byte-for-byte
  (verified vs Book 1 + Book 2 in KDP-LISTING.md §3). A mismatch creates a separate series
  page and permanently breaks the cross-book carousel. MANDATORY pre-publish check.

☑ Look Inside keyword check (§0.16) — the first 10% (Introduction + Ch.1) carries the
  reader's verbatim queries naturally: "tested positive", "H. pylori", "cancer", "still
  positive", "burning/gnawing stomach". The fear-hook open mirrors Google queries in prose.
  Formal-term "helicobacter" and "bismuth quadruple therapy" appear later (Ch.2/Ch.4), not
  in the first 10% — acceptable (they index via backend + body), noted for a future edition
  only if a Look Inside indexing gap is observed post-launch.

☑ Description keyword hierarchy (§0.17) — KDP-LISTING.md §5 description body opens "You
  tested positive. Then you Googled it." then within the first 200 characters carries
  "H. pylori", "cancer", "stomach" — the primary anxiety terms. The H2 headline ("Scared of
  H. Pylori? You Can Clear It.") carries the primary keyword. PASS — the first 200 chars
  carry real keyword signal, not atmosphere-only.

☑ Kindle Daily Deal pool (§0.18) — at 10+ reviews / 4.0+ avg this KDP Select book enters
  the Kindle Daily Deal candidate pool automatically. This is a SECOND reason the review
  gate matters (the first is profitable ad conversion). Platform-driven, zero-spend.

☑ US + UK simultaneous publish (§0.19) — confirm worldwide rights (NOT UK-only); set the
  US price explicitly at $9.99 (do not auto-convert); US social posts link to
  amazon.com/dp/[ASIN]. (See KDP-UPLOAD-GUIDE §5.)

☑ Also-bought seeding deadline (§0.20) — TIME-LOCKED to T-14 → paid-launch Day 1
  (2026-07-08 → 2026-07-22). Consequence: seeding after Day 7 is significantly less
  effective; after Day 30 may not alter an established wrong cluster.
```

---

## SECTION 1 — KDP SELECT RECOMMENDATION

**YES — enrol in KDP Select (already set: `kdp_select: true`).**

Reasoning: this is a debut series-position-3 title with no existing wide readership, in a KU-heavy niche (MARKET-INTELLIGENCE.md confirms the gut-health audience is supplement-and-search driven; the series precedent is KU-enrolled). KDP Select unlocks the three launch levers this plan depends on: (1) **KU page reads (KENP)** count toward BSR — a zero-friction borrow pool that replaces the platform a debut author lacks; (2) **free days** drive the launch velocity spike; (3) the **Countdown Deal** gives a planned Day-30 second push.

**The explicit cost:** for the 90-day term the book cannot be sold on Kobo, Apple Books, Google Play, or any other ebook retailer. That trade-off is small here because there is no wide audience yet to lose. Re-evaluate at the end of the first 90-day term.

---

## SECTION 2 — PRE-LAUNCH ARC PLAN

Cross-reference PRE-LAUNCH-PLAN.md Output 2 (do not duplicate). Confirmed and consistent:
- Recruit via r/HPylori, r/Gastritis, r/SIBO/r/ibs, and H. pylori / gut-health Facebook groups (KDP Select compliant: Kindle gift or direct file only — no BookSirens/StoryOrigin/NetGalley).
- **Target review count live in the launch window: minimum 3 verified in the first 48 hours; 5–15 from the ARC cohort.** Cold-start floor (debut): 3–8 posted reviews in 60 days.
- Mandatory gate: `arc_readers_confirmed >= 20` recruited commitments before the paid push.
- **GAP FLAG:** `pre_launch.arc_readers_confirmed = 0` today. The plan is built; the cohort is not recruited. This is the single largest pre-launch blocker and the work starts today. If the cohort cannot reach the floor, the algorithm-first fallback (Section 5, Rung 0) governs.

---

## SECTION 3 — FREE DAYS SCHEDULE

```
T-5  2026-07-17  FREE — free-chart velocity event (2 of 5 KDP Select days used)
T-4  2026-07-18  FREE — free-chart velocity event
T-3..T-1         book returns to PAID £6.99 — exit velocity builds
Day 0 2026-07-22 PAID LAUNCH — free→paid exit velocity lands here; ARC reviews drop;
                 owned-channel push concentrates 07:00–10:00 BST
Reserve: 3 free days held for a Day-60–75 re-spike if BSR stalls.
Expected impact: a free-chart rank spike with paid-rank carry-over on launch day. No
  download number is quoted — MARKET-INTELLIGENCE.md has no comparable free-run data
  for this niche (we need real data before estimating downloads).
```

This is the free-BEFORE-paid model (§0.6), deliberately chosen over "free on launch day," which would zero out the paid-BSR signal during the most important 72-hour window.

---

## SECTION 4 — CATEGORY / KEYWORD VALIDATION

```
CATEGORY VALIDATION — can this launch win #1 New Release within 30 days?
─────────────────────────────────────────────
Cat 1 — Abdominal Disorders (PRIMARY):
  #1 / #10 New-Release BSR: [BLOCKED — required at T-14 harvest]
  Series precedent (CATEGORY-SELECTION.md): The 7-Day Gut Reset's harvest found a
  BSR-8,091 title with only 11 reviews in THIS exact category — evidence a debut can
  reach the category top-10 on launch velocity. VERDICT: realistic #1-New-Release target
  PENDING the T-14 live BSR confirmation. This is the badge category.

Cat 2 — Digestive Health (SECONDARY):
  #1 / #10 BSR: [BLOCKED — required at T-14 harvest]
  Larger, broader pool — reach, not the badge shot. VERDICT: reach category. Confirm path
  name at upload (Amazon names drift; fallback path ... > Gastrointestinal).

Cat 3 — Cancer crossover (Day 14–30 via KDP CS):
  The legitimate, sourced gastric-cancer-prevention position (IARC/Nature Medicine 2025,
  RR 0.61). No incumbent H. pylori title occupies it. Frame = "defused with data," never
  fear-bait — the A+ content and listing copy carry that tone (§0.17 description passes).

REQUIRED BEFORE CATEGORY LOCK: the T-14 fresh BSR harvest of all 3 live paths (the single
most important open data item — KDP-LISTING.md Decision 4). Until then, category strategy
runs at MEDIUM confidence.
```

**Keyword validation (SEO-STRATEGY.md §5c):** all 7 backend keywords carry HIGH or BROWSE-to-HIGH intent; none flagged for suppression risk. Row 7 ("helicobacter diet meal plan") is the only post-launch swap-watch candidate (§13 keyword-CVR mismatch) — monitor; swap for "h pylori reinfection prevention" at first refresh if it draws non-converting clicks.

---

## SECTION 5 — WEEK-BY-WEEK LAUNCH CALENDAR (12 weeks, anchored to paid launch 2026-07-22)

```
WEEK 1 (Days 1–7, 2026-07-22 → 07-28)
  DO:    Owned-channel + community traffic into the 07:00–10:00 BST window on Day 0.
         ARC reviews posted (target 3+ verified in 48h). Daily BSR logging. Watch the
         Also-Bought carousel populate (right = gut-health/series; wrong = generic wellness).
  DO NOT: Run ANY paid ad. £0 ad spend. (Free days already ran T-5/T-4.)

WEEK 2 (Days 8–14)
  DO:    Chase un-posted ARC reviews individually. Daily BSR log. Diagnose review velocity.
  DO NOT: Run ads — the BSR + review gate is almost certainly still closed.

WEEK 3 (Days 15–21)
  DO:    Check the BSR + Review gate. IF OPEN → Sponsored Products AUTO, data-gathering
         only (budget from pipeline-state.json — currently unset, see Section 7).
         IF the ARC cohort failed (0 confirmed) AND only Condition A is met → Rung 0
         applies (Auto £1–2/day teaching signal; see fallback below).
         IF CLOSED → continue organic; no ad at all.
  DO NOT: Run manual keyword or ASIN campaigns. Do not optimise the Auto campaign.

WEEK 4 (Days 22–30)
  DO:    Collect Auto ACOS + search-term data. Push toward 10+ reviews. Daily BSR log.
         Prepare Countdown Deal (eligible Day 30, 2026-08-07).
  DO NOT: Scale Auto. Add manual campaigns yet.

WEEK 5 (Days 31–37)
  DO:    Countdown Deal window opens. IF Auto has 7+ days of converting data → build
         Manual exact/phrase from PROVEN terms only (budget from pipeline-state.json).
  DO NOT: Build ASIN targeting yet. Scale beyond the data.

WEEK 6 (Days 38–44)
  DO:    Optimise Manual on real ACOS. Run / finish the Countdown Deal; stack promo sites
         on Day 1 of it.
  DO NOT: Apply to BookBub Featured Deal unless already 50+ reviews.

WEEK 7 (Days 45–51)
  DO:    IF the book appears in its own Also-Bought carousel → start ASIN targeting (~£5/day,
         confirm against pipeline-state.json). Bid on a competitor ASIN ONLY where this book
         has MORE reviews than that competitor.
  DO NOT: Bid on competitors where your review count is lower than theirs.

WEEKS 8–12 (Days 52–90)
  DO:    Scale ONLY campaigns proven below target ACOS. Continue review velocity. Apply to
         BookBub Featured Deal when 50+ reviews reached. Consider the reserved 3 free days
         for a Day-60–75 re-spike if BSR has stalled.
  DO NOT: Increase budget on any campaign above target ACOS. Open BookBub self-serve Ads
         while Amazon ads are unprofitable.
```

### Algorithm-first fallback — if `arc_readers_confirmed = 0` at launch
If the ARC cohort cannot be recruited, the ARC-first strategy is unavailable but the launch is NOT blocked. Switch to the algorithm-first engine: free-before-paid remains the velocity source; the KU borrow pool replaces the ARC cohort; in-book review CTAs replace the ARC stagger; and **Rung 0 (Auto SP at £1–2/day — HARD CEILING, never optimised, never scaled)** may activate at the Day-14 gate check IF Condition A (stable BSR under 100k main OR under 5k sub) is met, even without 10 reviews. All other ads stay forbidden until the full master gate opens.

---

## SECTION 6 — BSR + REVIEW GATE / AD TRIGGER TABLE

```
╔═══════════════════════════════════════════════════════════════╗
║  MASTER GATE — ADS FORBIDDEN UNTIL ALL CONDITIONS MET         ║
║  A (BSR): A1 stable under 100,000 main (ideally <50k)         ║
║           OR A2 under 5,000 in the primary sub-category        ║
║  B (reviews): B1 ≥10 reviews AND B2 ≥4.0 average               ║
║  GATE OPENS only when A (A1 or A2) AND B (B1 and B2).          ║
║  Before it opens: ad spend = £0. No campaign created.          ║
╚═══════════════════════════════════════════════════════════════╝
"Stable" = holding/improving across ≥3 consecutive daily readings, not a single free-flip spike.

AD TRIGGER TABLE — nothing launches until its row's conditions are ALL true
─────────────────────────────────────────────────────────────────────────
Ad type                    | Required conditions
ANY paid ad                | Master gate open (A AND B)
Rung 0 Auto £1–2/day        | FALLBACK only (0 ARC): Condition A alone, earliest Day 14
Sponsored Products AUTO     | Master gate open. Earliest Week 3. Data-gathering budget.
Manual exact/phrase         | Auto has 7+ days of converting search-term data. Earliest Wk 5.
ASIN targeting              | Manual running AND book in its own Also-Bought carousel. Wk 7.
Bid on a competitor ASIN    | This book has MORE reviews than that competitor in the sub.
Countdown Deal re-spike     | KDP Select AND 30 days at full price AND eligible window open. Day 30.
BookBub Featured Deal       | 50+ reviews AND 4.0+ average.
BookBub self-serve Ads      | Amazon ad ACOS under control (Rung 2 proven profitable).
```

---

## SECTION 7 — AD LADDER

```
RUNG 1 (Week 3+, master gate open): Sponsored Products AUTO, data-gathering, 7 days min.
RUNG 2 (Week 5+, after 7+ days Rung 1 data): Manual exact/phrase from proven terms only.
RUNG 3 (Week 7+, Manual running + book in own Also-Bought): ASIN targeting vs comps where
        this book out-reviews the competitor.
RUNG 4 (Month 3): Countdown Deal re-spike (already scheduled Day 30) + reserved free days.

BUDGETS: every rung's £/day must be read from pipeline-state.json (marketing.ads_daily_budget_gbp,
marketing.ads_starting_bid_gbp). These are NOT set today → "We need real data for this before
making a recommendation." Set them at the ads gate. The amazon-ads-agent EXECUTES the rungs;
it must NOT be invoked before the master gate opens.

BID CEILING formula (amazon-ads-agent recalculates on live price + real CVR):
  Break-even ACOS = (royalty per sale ÷ list price). At £6.99 / 70%: royalty ≈ £6.99×0.70 − £0.12
  delivery = £4.77 (source: KDP 70% royalty rate + KDP-LISTING.md price). Break-even ≈ 68%;
  target ACOS = break-even × 0.75 ≈ 51%. Max CPC derived from the REAL CVR in the Search Term
  Report — not a guessed CVR.
```

---

## SECTION 8 — REVIEW VELOCITY TARGETS

```
First 48 hours:  3+ verified reviews (ARC cohort)        → minimum viable launch
Day 30:          10+ reviews, 4.0+ average               → OPENS the ad gate + KDD pool
Day 60:          25+ reviews
Day 90:          50+ reviews                             → OPENS BookBub Featured Deal eligibility
```
These are *targets*, not forecasts. The Stage-05 review-bait architecture (back-matter CTA 37/40, three in-text trigger moments ≥25/30, premature intro ask removed) supports them; whether they're hit depends on the ARC cohort and organic velocity, which are not yet measured.

---

## SECTION 9 — 90-DAY REVENUE FORECAST

**We need real BSR-to-sales data for this before making a revenue forecast.**

MARKET-INTELLIGENCE.md contains NO BSR-to-sales conversion for the H. pylori / gut-health niche — every competitor BSR is flagged [BLOCKED] and the Stage-01 Playwright harvest returned a stale-node fallback (KDP-LISTING.md Decision 4). The forecast can be produced once the T-14 harvester captures live #1/#10 BSR for the three category paths and a niche BSR-to-sales table.

What the data IN the file DOES support (each individually sourced):
- The field is thin and quality-stratified, with three open content gaps this book uniquely fills (MARKET-INTELLIGENCE.md §4a synthesis: the "when antibiotics fail" pathway; proportionate sourced cancer framing; trust-through-restraint). That is a *positioning* advantage, not a sales number.
- Demand signal: a probiotic supplement listing in this niche carries "its own large review base" (MARKET-INTELLIGENCE.md §4a #7) — confirming strong commercial attention around "natural treatment" and "L. reuteri." This indicates demand exists; it does NOT quantify this book's sales.

No sales/day, download, or revenue figure is stated. A forecast with no source would be a Rule 1 violation.

---

## RULES HELD
- No invented numbers; the 90-day forecast is explicitly deferred to real data.
- No ads before the master gate; no ads in Week 1 ever; no BookBub Featured Deal before 50 reviews.
- KDP Select trade-off (no Kobo/Apple/Google for 90 days) stated.
- This plan DECIDES when ads run; amazon-ads-agent EXECUTES, held behind the gate.
- Builds on PRE-LAUNCH-PLAN.md (free dates, ARC, AMS pre-build) — no contradiction.

*Marketing plan built by the master orchestrator acting as marketing-agent, operating on ALGO-INTELLIGENCE.md v1.1. — 2026-06-11*
*ALGO v1.2 reconciliation applied by category-decision-agent, 2026-06-16: all three v1.2 mechanics (Rufus/GSO semantic intent, read-through signal, lean keywords) verified already compliant. No strategy changes required. Category 3 BSR harvest data now available (Nutrition #10 = BSR #9,878; Disorders & Diseases #10 = BSR #8,006). Category 3 locked to Nutrition. 90-day revenue forecast remains deferred pending BSR-to-sales conversion data from actual launch.*
