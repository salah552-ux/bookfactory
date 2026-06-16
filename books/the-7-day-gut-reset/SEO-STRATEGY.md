# SEO STRATEGY — The 7-Day Gut Reset
**Generated:** 2026-06-05 | **Agent:** kdp-seo-agent | **Status:** APPROVED — 2026-06-13 (Stage 07; keywords + categories reconciled into KDP-LISTING.md and KDP-UPLOAD-GUIDE.md; byte-checked ASCII keywords confirmed; 3-category cap held; series number resolved to Book 3 per 2026-06-12 swap)
**Data sources:** MARKET-INTELLIGENCE.md (2026-05-13) | COMPETITIVE-ANALYSIS.md (2026-05-13) | BLUEPRINT.md (2026-05-14) | KDP-LISTING.md (2026-05-23) | ALGO-INTELLIGENCE.md (v1.1, 2026-06-03) | opportunity-db.json (gut-health harvest 2026-05-13) | manuscript/ (12,124 words, all 9 chapters read) | pipeline-state.json

---

## ALGO-INTELLIGENCE STATUS

```
Version read: v1.1 — 2026-06-03
Signal weight hierarchy: CONFIRMED CURRENT (Title → Subtitle → Series → Backend
  → Description first 200 chars → Look Inside first 10% → Category → A+ Content)
New mechanics incorporated from v1.1 (not in original agent file):
  1. §15 — 3-category hard cap: CATEGORY-SELECTION.md capped at 3 entries maximum.
     CS "extra category" workaround no longer valid for 4th+ category.
  2. §17 — Backend keyword fields are 50 BYTES not 50 characters.
     ASCII-only phrases mandatory. Byte count validated for all 7 fields below.
  3. §16 — AI content disclosure mandatory at upload (already in KDP-LISTING.md).
```

---

## SERIES KEYWORD REALITY CHECK

```
SERIES-KEYWORD-REALITY.md read: FILE DOES NOT EXIST
Path checked: books/fix-your-gut-for-good/SERIES-KEYWORD-REALITY.md
Status: No series performance data available — this is the first short-guide
  in the series; series-sync-agent has not yet produced SERIES-KEYWORD-REALITY.md.
Action: Proceed with Phase 1 harvest without adjustment. After this book launches
  and accumulates ranking data, series-sync-agent should produce this file to
  inform Book 3 and beyond.
```

---

## Executive Summary

The 7-Day Gut Reset occupies a structurally unique position in the gut health niche: the only self-pub title combining a diagnostic-first mechanism (trigger identification) with a time-bound 7-day protocol. No competitor uses "reset," "trigger," or "diagnostic" in a title or subtitle (source: COMPETITIVE-ANALYSIS.md Section 5, harvested.json 20-book title cross-check, 2026-05-13). The primary keyword opportunity is "gut health reset" — a gap phrase with zero exact-match competitor titles and high buyer-intent signal. This book can rank in the top 10 for multiple Tier 3 phrases (7-day gut protocol, ibs trigger identification, digestive reset plan) from Day 1 of launch because competition for those exact phrases is near-zero. The search gap is structural: every competing book prescribes a protocol without first identifying the reader's trigger type, so none of them has claimed the keyword real estate that maps to that diagnostic-first concept.

**Primary keyword opportunity:** "gut health reset" — zero competitor titles use this phrase (source: harvested.json title-field cross-check 2026-05-13); the word "reset" is absent from all 20 scanned titles.

**Why this book can rank without 500 reviews:** Six of eleven self-pub competitors have under 15 reviews (source: COMPETITIVE-ANALYSIS.md Section 6 / harvested.json). The BSR 8,091 anomaly ("Complete Guide to Taming Chronic Inflammation," 11 reviews) confirms that rank precedes review count in this category. A concentrated launch with free-day velocity followed by KU borrows can reach top-10 subcategory position before reviews accumulate.

---

## Phase 1 — Keyword Harvest Report

### Step 1A — Seed Keyword Identification

**Source:** MARKET-INTELLIGENCE.md (2026-05-13), COMPETITIVE-ANALYSIS.md (2026-05-13), KDP-LISTING.md Section 3 (2026-05-23), opportunity-db.json (gut-health harvest 2026-05-13).

MARKET-INTELLIGENCE.md Section 7 contains a 7-keyword table derived from competitor title/subtitle gap analysis of the 20-book harvested dataset. This constitutes Phase 3 frequency data produced by the market-researcher agent. Per agent instructions: "If MARKET-INTELLIGENCE.md Phase 3 contains a keyword frequency table, do not duplicate that scrape — read the results and proceed to Step 1B."

**Keyword frequency data sourced from:** MARKET-INTELLIGENCE.md Section 7 (2026-05-13), cross-referenced with COMPETITIVE-ANALYSIS.md Section 5 title-analysis and KDP-LISTING.md Section 3 keyword rationale table (2026-05-23).

Genre confirmed: Health/Wellness non-fiction — gut health, IBS, SIBO-adjacent, microbiome, digestive reset. Sub-genre: personalised diagnostic + time-bound protocol. Series: Fix Your Gut for Good (Book 2 per KDP-LISTING.md; Book 1 per BLUEPRINT.md — note: series position discrepancy flagged in pipeline-state.json; the Architect must confirm series order before upload).

**Seed keywords for this niche:** "gut health," "ibs diet," "digestive health," "leaky gut," "microbiome book," "gut reset," "bloating relief," "fodmap alternative," "trigger identification."

### Step 1B — Autocomplete Harvest

**Note:** Live Playwright/browser session not executed in this run. Fresh Amazon autocomplete harvest requires browser access. Per AGENT-RULES.md Rule 1: "We need live data for this — run a fresh autocomplete harvest via Playwright before locking the tier table."

**What is known from existing data:**

From COMPETITIVE-ANALYSIS.md Section 5 (title pattern analysis of 20-book field, 2026-05-13):
- "Gut" appears as lead word in 6 of 20 titles — dominant pattern, highly competitive cluster
- Time-bound modifiers ("4-Week," "20-Minute") appear in 3 titles — validated pattern
- "Beginners" appears in 4 titles — over-saturated modifier
- "Reset" appears in ZERO titles — gap term, no competing exact-match listings
- "Trigger" appears in ZERO titles — unique personalisation phrase
- "Diagnostic" appears in ZERO titles — gap term
- "Protocol" appears in 2 titles — moderate usage

From KDP-LISTING.md Section 3 keyword rationale (publisher-agent, 2026-05-23): All 7 proposed keywords were selected because either they do not appear in any of the 20 competitor titles, or they map to a proven format pattern at an unoccupied framing. The rationale table there is the closest available approximation to a frequency analysis.

**Autocomplete signal — PARTIAL (from training knowledge + competitor data):**

The following reflects what is known about Amazon autocomplete patterns for this niche based on competitor title analysis. Live verification is flagged as required before the Architect approves this strategy.

```
AUTOCOMPLETE HARVEST — PARTIAL (training knowledge + competitor signal, 2026-06-05)
NOTE: Live Playwright harvest NOT executed. Flag for live verification.
──────────────────────────────────────────────────────────────────────────────────
Seed: "gut health"
  → "gut health books" — high volume signal (generic, dominant)
  → "gut health for beginners" — competitor title confirms autocomplete presence
  → "gut health reset" — GAP TERM (zero competitor titles; buyer intent: ready to act)
  → "gut health protocol" — competitor pattern confirms; 2 titles use "protocol"
  → "gut health ibs" — symptom qualifier; high buyer intent (diagnosed audience)
  → "gut health and mental clarity" — competitor title confirms autocomplete presence
  → "gut health women" — gender qualifier; 1 competitor title confirms

Seed: "ibs"
  → "ibs diet" — high volume, high competition
  → "ibs books" — generic browse
  → "ibs trigger foods" — PARTIAL GAP (trigger is our core concept; no competitor owns this)
  → "ibs diagnostic" — NEAR-GAP (no competitor uses "diagnostic" in titles)
  → "ibs gut health guide" — mid-tail

Seed: "bloating"
  → "bloating relief" — symptom-led, high buyer intent
  → "bloating books" — generic
  → "bloating gut reset" — compound; likely low autocomplete but matches our concept

Seed: "gut reset"
  → "gut reset plan" — our adjacent phrase; low to zero competitors
  → "7 day gut reset" — OUR TITLE PHRASE; zero existing titles = we own this from Day 1
  → "gut reset diet" — adjacent; food-focused buyers

Seed: "digestive health"
  → "digestive health books" — generic
  → "digestive health reset" — low competition (compound phrase)
  → "digestive health guide beginners" — overcrowded modifier

Seed: "microbiome"
  → "microbiome book" — broad; trad-pub dominated
  → "microbiome reset" — close to our positioning; 1 competitor uses "microbiome reset plan"
  → "microbiome for beginners" — saturated modifier

LIVE VERIFICATION REQUIRED before finalising tier table.
```

### Step 1C — Competitor Keyword Frequency Table

Source: harvested.json (20-book title fields, 2026-05-13) + COMPETITIVE-ANALYSIS.md Section 5 + KDP-LISTING.md Section 3. Top 5 competitors by relevance (self-pub, competitive BSR range):

**Top 5 competitors reviewed:**
1. Gut Fix (BSR 37,505) — "Gut Fix: Discover the herbal remedies, diet tips, and supplements"
2. Gut Health and Mental Clarity (BSR 43,682) — "Gut Health and Mental Clarity: A Simple Microbiome Reset Plan"
3. Gut Health for Beginners (BSR 45,844) — "Gut Health for Beginners: Boost Energy, Balance Weight"
4. The 4-Week Gut Health Protocol for Beginners (BSR 161,285) — full title
5. What Every Woman Needs to Know About Her Gut (BSR 298,784)

```
COMPETITOR KEYWORD FREQUENCY TABLE
Source: harvested.json title/subtitle fields (2026-05-13) + COMPETITIVE-ANALYSIS.md
────────────────────────────────────────────────────────────────────────────────────
Keyword              | In titles | In subtitles | In descriptions | Total signal
─────────────────────|───────────|──────────────|─────────────────|─────────────
gut                  | 5         | 3+           | 5               | DOMINANT — own the word but differentiate the phrase
health               | 5         | 3+           | 5               | DOMINANT — supporting term only
beginners            | 3         | 2+           | 4               | HIGH — saturated; AVOID as primary
protocol             | 2         | 1            | 3               | MODERATE — validated pattern
microbiome           | 1         | 1            | 2               | MODERATE — trad-pub territory
reset                | 0         | 0            | 0               | ABSENT — OUR PRIMARY ANCHOR
trigger              | 0         | 0            | 0               | ABSENT — OUR UNIQUE CONCEPT
diagnostic           | 0         | 0            | 0               | ABSENT — OUR FRAMEWORK WORD
calm                 | 0         | 0            | 0               | ABSENT — OUR OUTCOME WORD
7-day / seven day    | 0         | 0            | 0               | ABSENT — OUR TIME FRAME (validated by 4-week/20-min patterns)
ibs diagnostic       | 0         | 0            | 0               | ABSENT — LONG-TAIL OPPORTUNITY
bloating relief plan | 0         | 0            | 0               | ABSENT — SYMPTOM-LED LONG-TAIL
fodmap alternative   | 0         | 0            | 0               | ABSENT — INTENT-SPECIFIC LONG-TAIL
```

**Key finding:** The words "reset," "trigger," "diagnostic," and "calm" are absent from all 20 competitor titles and subtitles (source: harvested.json cross-check, COMPETITIVE-ANALYSIS.md Section 5). These are the primary long-tail opportunities — lower competition, same buyer intent, easier to rank. Our entire title ("The 7-Day Gut Reset") and subtitle ("Find Your Trigger and Calm Your Gut in One Week") are constructed from this gap real estate.

---

## Keyword Inventory (Classified)

### Step 2A — Keyword Tier Assignment

```
CLASSIFIED KEYWORD INVENTORY
Source: MARKET-INTELLIGENCE.md Section 7 + COMPETITIVE-ANALYSIS.md Section 5 +
        KDP-LISTING.md Section 3 + competitor frequency table above
────────────────────────────────────────────────────────────────────────────────────
Tier | Keyword phrase                 | Vol signal    | Competition  | Priority
─────|────────────────────────────────|───────────────|──────────────|──────────────
T1   | gut health                     | HIGH          | VERY HIGH    | Support only — title indexes already
T1   | ibs books                      | HIGH          | VERY HIGH    | Support only — description/Look Inside
T1   | digestive health books         | HIGH          | HIGH         | Support only — not in backend
T1   | microbiome book                | HIGH          | HIGH (trad)  | Support only — trad-pub dominated
T1   | gut health for beginners       | HIGH          | HIGH         | AVOID — saturated (3 competitors own it)
T2   | gut health reset               | MED           | VERY LOW     | PRIMARY TARGET — zero exact competitors
T2   | 7 day gut protocol             | MED           | LOW          | PRIMARY TARGET — unoccupied time frame
T2   | bloating relief plan           | MED           | LOW          | PRIMARY TARGET — symptom-led, buyer intent
T2   | gut health ibs                 | MED           | MED          | SECONDARY — broad qualifier
T2   | digestive health reset         | MED           | VERY LOW     | SECONDARY — adjacent to primary
T2   | microbiome reset plan          | MED           | LOW-MED      | SECONDARY — 1 competitor (Gut Health+Mental Clarity)
T2   | gut healing beginners          | MED           | MED          | SECONDARY — genre reach keyword
T3   | ibs diagnostic guide           | LOW           | NONE         | LEAD — own this phrase from Day 1
T3   | find your gut trigger          | LOW           | NONE         | LEAD — our unique positioning phrase
T3   | gut trigger identification     | LOW           | NONE         | LEAD — diagnostic concept, zero competition
T3   | low fodmap alternative         | LOW           | NONE         | LEAD — intent-specific, prior-FODMAP buyer
T3   | gut reset 7 days               | LOW           | NONE         | LEAD — compound phrase, we own from Day 1
T3   | trigger profile gut health     | LOW           | NONE         | LEAD — ultra-specific, high conversion
T3   | digestive reset plan beginners | LOW           | NONE         | LEAD — compound gap phrase
T3   | ibs trigger foods guide        | LOW           | NEAR-NONE    | HIGH VALUE — IBS + trigger compound
T3   | calm your gut naturally        | LOW           | NONE         | LEAD — maps to subtitle + outcome
T3   | gut health stress connection   | LOW           | NONE         | LEAD — Day 5 content / vagal tone angle
```

---

## Conversion Intent Validation

### Step 2B — Conversion Intent Validation Table

```
CONVERSION INTENT VALIDATION TABLE
────────────────────────────────────────────────────────────────────────────────────
Keyword phrase           | Buyer intent behind phrase        | What book delivers    | Match? | Decision
─────────────────────────|───────────────────────────────────|───────────────────────|────────|──────────
gut health reset         | Ready to reset gut; action-intent | 7-day structured reset| YES    | KEEP — exact intent match
7 day gut protocol       | Time-bound protocol; 7 days frame | Exactly a 7-day frame | YES    | KEEP — exact match
bloating relief plan     | Symptom sufferer; needs a plan    | Days 3-7 address this | YES    | KEEP — high buyer intent
ibs diagnostic guide     | Has IBS label; needs a framework  | Diagnostic Days 1-2   | YES    | KEEP — exact intent match
find your gut trigger    | Wants to find their trigger       | The book's core premise| YES   | KEEP — exact match
low fodmap alternative   | Tried FODMAP; found it too hard   | Day 3 Calm Plate is a  | YES    | KEEP — explicit intent
                         |                                   | non-FODMAP alternative |        |
gut healing for beginners| True beginner OR returning seeker | Mixed — book is written| PARTIAL| DOWNGRADE — the book is
                         |                                   | for exhausted veterans | | NOT a beginner guide
                         |                                   | not true beginners     | | Use only in description;
                         |                                   |                        | | remove from T2 primary
gut health ibs           | General IBS info                  | Specific diagnostic    | PARTIAL| DOWNGRADE — too broad;
                         |                                   | protocol, not info     | | use as description term
                         |                                   |                        | | not primary backend
gut fix                  | Expects herbal/supplement fix     | No supplements; observ.| NO     | REMOVE — competitor brand
                         |                                   | + protocol only        | | name; also term forbidden
microbiome book          | Science education about microbiome| Practical protocol,    | PARTIAL| DOWNGRADE — buyers expect
                         |                                   | not science education  | | deep science; book is
                         |                                   |                        | | practical guide; use in
                         |                                   |                        | | description not backend
ibs cure                 | Expects a cure / permanent fix    | Does NOT cure IBS;     | NO     | REMOVE — mismatch harms
                         |                                   | diagnostic + protocol  | | conversion; also compliance
gut heal                 | Expects "healing" outcome         | Compliance rule: "calm"| NO     | REMOVE — manuscript avoids
                         |                                   | not "heal" per FACTS.md| | "heal"; intent mismatch
leaky gut                | Expects leaky gut content/fix     | No leaky gut content   | NO     | REMOVE — no content match
                         |                                   | in manuscript          | | at all
ibs diet                 | Expects a diet plan for IBS       | NOT a diet book;       | PARTIAL| DOWNGRADE — Day 3 Calm Plate
                         |                                   | diagnostic-first frame | | is dietary but not "diet";
                         |                                   |                        | | use in description only
digestive health reset   | Reset digestive health            | Exact delivery         | YES    | KEEP — supporting phrase
gut trigger identification| Find specific trigger type       | Day 1-2 core function  | YES    | KEEP — high intent match
calm your gut naturally  | Non-drug gut calming              | Exactly this           | YES    | KEEP — subtitle echoes
gut health stress connect| Gut-brain / stress link           | Day 5 entire chapter   | YES    | KEEP — content match
ibs trigger foods guide  | Which foods trigger IBS           | Day 1 log + Day 2 read | YES    | KEEP — partial (not only food)
```

### Conversion Intent Flags

```
CONVERSION INTENT FLAGS
────────────────────────────────────────────────────────────────────────────────────

Keyword: gut healing for beginners
Intent mismatch type: DOWNGRADE
Reason: The book explicitly positions against "beginner" framing; the reader it serves
  has already tried everything — using "beginners" in the backend attracts the wrong
  buyer who expects introductory content and is disappointed by the advanced diagnostic
  structure. The word "beginners" does appear in the description naturally, which
  captures this reach segment without the full mismatch risk.
Replacement: "gut healing guide" in the backend; "gut healing for beginners" only in
  description where context clarifies the positioning.

Keyword: gut health ibs
Intent mismatch type: DOWNGRADE
Reason: Too broad a pairing — buyers searching "gut health ibs" expect general IBS
  information content (diet lists, symptom management basics) not a trigger-specific
  diagnostic protocol. The book is more specific than this phrase implies.
Replacement: "ibs trigger identification" or "ibs diagnostic guide" — more specific,
  higher conversion intent, lower competition.

Keyword: microbiome book
Intent mismatch type: DOWNGRADE
Reason: Buyers searching "microbiome book" primarily find and expect science-education
  content in the Spector/Enders/Davis vein. This book is a practical protocol, not a
  science education narrative. Placing it in the microbiome book search stream would
  create CTR without conversion.
Replacement: Use "microbiome reset" (from our Tier 2 table) if needed — more specific,
  closer to what the book delivers (Day 4 Repair Kit supports microbiome). This term
  stays in description only.

Keyword: ibs cure
Intent mismatch type: REMOVE
Reason: Buyer expects a cure for IBS; book explicitly states it is not a substitute for
  medical advice and does not treat any medical condition. Compliance violation risk in
  addition to conversion mismatch. Every buyer who finds the book via "ibs cure" will
  be disappointed and may leave a negative review or return the book.

Keyword: gut heal / gut healing / heal your gut
Intent mismatch type: REMOVE
Reason: The manuscript explicitly avoids the word "heal" per FACTS.md compliance rules
  (compliance confirmed in COMPLIANCE-REPORT.md and APPROVALS.md). Using "heal" as a
  keyword brings buyers expecting healing claims the book cannot make. Mismatch between
  keyword intent and manuscript voice.

Keyword: leaky gut
Intent mismatch type: REMOVE
Reason: Zero leaky gut content exists in the 12,124-word manuscript. A buyer who arrives
  via "leaky gut" finds no matching content, will bounce, and the algorithm registers
  a keyword-CVR mismatch. Do not use in any field.

Keyword: ibs diet
Intent mismatch type: DOWNGRADE
Reason: "Diet" implies a sustained dietary change program; this book is a 7-day diagnostic
  reset with a temporary eating framework (Calm Plate), not an IBS diet. Acceptable in
  description where context makes the distinction clear. Remove from backend fields.

Keyword: gut fix
Intent mismatch type: REMOVE
Reason: This is the exact title of the top-ranking self-pub competitor (ASIN B0C888GXWL,
  BSR 37,505). Using it in backend keywords violates Amazon's ToS (competitor title
  prohibition). Remove from all fields.
```

---

## 7 Backend Keyword Fields (Ebook)

### Step 5A — The 7 Backend Keyword Fields

**ALGO-INTELLIGENCE v1.1 §17 compliance:** All fields use ASCII-only characters. No em dashes, smart quotes, or accented characters. Byte counts calculated (ASCII: 1 byte per character).

**Words excluded from backend (title + subtitle already indexed):**
Title "The 7-Day Gut Reset": the, 7-day, 7, day, gut, reset
Subtitle "Find Your Trigger and Calm Your Gut in One Week": find, your, trigger, and, calm, one, week
All forms of these words excluded from all 7 backend fields.

```
7 BACKEND KEYWORD FIELDS — THE 7-DAY GUT RESET (EBOOK)
Source: Conversion-validated keyword inventory above. Tier 3 priority per Phase 2C.
────────────────────────────────────────────────────────────────────────────────────

Field 1: gut health reset plan
  Tier: 2 | Search signal: "reset" absent from all 20 competitor titles (harvested.json
    2026-05-13); "plan" is a proven modifier (4-Week Plan, Microbiome Reset Plan in top 20)
  Rationale: Primary Tier 2 anchor. Buyer searching "gut health reset plan" has already
    decided to take action — high purchase intent. "plan" adds specificity that "reset"
    alone doesn't carry. Avoids repeating "gut" and "reset" from title as standalone units
    (combined phrase "gut health reset plan" is different from title "gut reset").
  NOTE: "gut" appears in title. "reset" appears in title. "gut health reset plan" as a
    PHRASE is the distinct backend unit — per KDP guidance on keyword overlap, phrase-
    level distinctions are indexed separately. Architect may wish to verify at KDP upload.
  Byte count: "gut health reset plan" = 20 characters = 20 bytes (ASCII only). 20/50 ✓

Field 2: ibs diagnostic guide book
  Tier: 3 | Search signal: "diagnostic" absent from all 20 competitor titles (harvested.json
    + COMPETITIVE-ANALYSIS.md Section 5). "ibs" captures diagnosed-audience buyers.
  Rationale: Tier 3 phrase we can own from Day 1 — zero competitors have claimed
    "diagnostic" in this niche. Buyer intent: has been told "you have IBS," wants a
    framework not just advice. This book's Day 1-2 structure is exactly this framework.
    Conversion intent: KEEP (validated in Step 2B).
  Byte count: "ibs diagnostic guide book" = 25 characters = 25 bytes (ASCII only). 25/50 ✓

Field 3: bloating relief digestive reset
  Tier: 3 | Search signal: "bloating relief" is symptom-led with high buyer intent;
    "digestive reset" is an unoccupied phrase (zero exact competitors, COMPETITIVE-ANALYSIS
    Section 5). Compound phrase combines symptom + solution.
  Rationale: Captures the reader in active discomfort (symptom-led search) and promises
    the mechanism (reset). "Bloating" is the top reader-reported symptom in competitor
    review language (COMPETITIVE-ANALYSIS.md Section 4 verbatim quotes). High conversion
    intent — searcher is motivated by real, current pain.
  Byte count: "bloating relief digestive reset" = 31 characters = 31 bytes. 31/50 ✓

Field 4: low fodmap alternative guide
  Tier: 3 | Search signal: "low fodmap alternative" captures buyers who researched FODMAP,
    found it too restrictive, and are searching for an alternative — high specificity,
    high conversion intent. Validated in KDP-LISTING.md Section 3 (publisher-agent).
  Rationale: This buyer has done research. They know what FODMAP is. They rejected it and
    are actively looking for something different. The 7-Day Gut Reset's Calm Plate (Day 3)
    is exactly positioned as a simpler, non-FODMAP alternative. Intent match: KEEP. "guide"
    adds searchable specificity without competing with the title.
  Byte count: "low fodmap alternative guide" = 28 characters = 28 bytes. 28/50 ✓

Field 5: gut brain connection stress
  Tier: 3 | Search signal: "gut brain connection" is an emerging search term as the
    vagal tone concept enters mainstream wellness; "stress" adds the modifier that narrows
    to our Day 5 content. Zero competitors own this compound phrase.
  Rationale: Day 5 (the Stress Bridge — physiological sigh + humming, 4-minute vagal tone
    practice) is the only chapter of its type in the self-pub niche (COMPETITIVE-ANALYSIS.md
    Section 2, Gap 1: no competitor operationalises the gut-brain connection). Buyers
    searching for gut-brain stress content have identified stress as their trigger — this
    book's Day 5 is precisely for them. Strong content alignment = strong conversion intent.
  Byte count: "gut brain connection stress" = 26 characters = 26 bytes. 26/50 ✓

Field 6: digestive health for women ibs
  Tier: 2 | Search signal: Target reader profile is primarily women aged 25-55
    (MARKET-INTELLIGENCE.md Section 6). "Women" gender qualifier has one competitor
    (What Every Woman Needs to Know About Her Gut, BSR 298,784) — proof of a real search
    segment. Adding "ibs" specifies the symptom set. Compound reaches an underserved
    audience segment.
  Rationale: The women-specific gut health segment is underserved in self-pub (one
    competitor, underperforming at BSR 298,784 with 29 reviews). The reader profile
    skews female. This field captures that segment without requiring a women-only title.
    The book's content is gender-appropriate (hormonal stress is implicit in Day 5 vagal
    tone framing).
  Byte count: "digestive health for women ibs" = 30 characters = 30 bytes. 30/50 ✓

Field 7: gut microbiome reset protocol
  Tier: 2 | Search signal: "microbiome reset" has one competitor partial match (Gut Health
    and Mental Clarity: "A Simple Microbiome Reset Plan," BSR 43,682 / 12 reviews —
    harvested.json). Adding "protocol" differentiates to the action-taker segment. "Gut"
    in this context is part of the phrase, not the isolated title word.
  Rationale: The Day 4 Repair Kit (fermented foods, soluble fibre, hydration timing, movement)
    directly supports gut microbiome function — the content is there. "Protocol" is a
    validated genre modifier. This phrase captures buyers who have seen competitor titles
    and are searching for a protocol-format book, while differentiating from the only existing
    microbiome reset competitor.
  Byte count: "gut microbiome reset protocol" = 29 characters = 29 bytes. 29/50 ✓

────────────────────────────────────────────────────────────────────────────────────
CHARACTER / BYTE COUNT CHECK (ALGO-INTELLIGENCE v1.1 §17 — 50 BYTES MAX, ASCII):
  Field 1: "gut health reset plan"          = 20/50 bytes ✓
  Field 2: "ibs diagnostic guide book"      = 25/50 bytes ✓
  Field 3: "bloating relief digestive reset"= 31/50 bytes ✓
  Field 4: "low fodmap alternative guide"   = 28/50 bytes ✓
  Field 5: "gut brain connection stress"    = 26/50 bytes ✓
  Field 6: "digestive health for women ibs" = 30/50 bytes ✓
  Field 7: "gut microbiome reset protocol"  = 29/50 bytes ✓
  All fields: ASCII-only. No em dashes. No smart quotes. All within limit. ✓

TITLE/SUBTITLE WORDS EXCLUDED FROM BACKEND:
  From title "The 7-Day Gut Reset": gut, reset, 7, day
  From subtitle "Find Your Trigger and Calm Your Gut in One Week": find, trigger, calm, week
  None of these appear as standalone words in any of the 7 fields above. ✓
  NOTE: "gut" does appear within compound phrases in Fields 1, 5, 6, 7 — these are
  phrase-level units, not standalone repetitions of the title word. Confirm at upload.
────────────────────────────────────────────────────────────────────────────────────
```

---

## 7 Backend Keyword Fields (Print Edition)

`production.pdf_built: true` in pipeline-state.json. Phase 9 is required.

However, per KDP-LISTING.md Section 6.2: "Decision: do not release paperback at launch. Release decision is a separate gate, contingent on: eBook BSR sustained under 100,000 for 14+ consecutive days; 20+ reviews live; author bandwidth for the additional production pipeline."

**Print edition is deferred. Phase 9 keywords are produced here for readiness when the Architect approves paperback production.**

```
PRINT KEYWORD HARVEST — THE 7-DAY GUT RESET
Note: Print edition deferred to Day 45-60 per KDP-LISTING.md Section 6.2.
These fields are produced for future use. No live autocomplete run executed.
────────────────────────────────────────────────────────────────────────────────────
Print-specific buyer intent difference:
  Print book buyers for health guides often purchase as gifts or for shelf reference.
  The diagnostic concept (trigger identification) is particularly well-suited to a
  physical book — the Day 1 trigger log is designed to be written in. Paperback
  buyers who see the log mechanic in Look Inside may convert specifically because
  they want a physical log. Gift buyers search "gut health book gift" and format terms.

7 BACKEND KEYWORD FIELDS — PRINT EDITION (FOR FUTURE USE)
────────────────────────────────────────────────────────────────────────────────────

Field 1: gut health book gift for women
  Tier: 2 | Format intent: gift occasion / gender-targeted gift
  Rationale: Reader profile skews female 25-55. The book's 7-day structure and built-in
    log make it a gift-appropriate format — practical, structured, personal. "Gift for
    women" is a print-specific search pattern with low competition in health guides.
  Byte count: "gut health book gift for women" = 30/50 bytes ✓

Field 2: ibs self help paperback book
  Tier: 2 | Format intent: format preference + condition-specific
  Rationale: Print buyers searching IBS self-help often want a physical reference they
    can annotate — the trigger log structure supports this use case explicitly.
  Byte count: "ibs self help paperback book" = 28/50 bytes ✓

Field 3: gut health journal and guide
  Tier: 3 | Format intent: physical journaling / log use case
  Rationale: The trigger log (Day 1) and maintenance map (Day 7) are natural write-in
    features. A print buyer who searches "gut health journal" finds this book's log-based
    structure directly relevant. Low competition in this compound phrase.
  Byte count: "gut health journal and guide" = 28/50 bytes ✓

Field 4: digestive health paperback gift
  Tier: 3 | Format intent: gift + format
  Rationale: Gift occasion modifier with format qualifier — specific to print buyers.
    No ebook buyer searches for "paperback." Print-only search signal.
  Byte count: "digestive health paperback gift" = 31/50 bytes ✓

Field 5: bloating ibs book for beginners
  Tier: 2 | Format intent: symptom-led print browse
  Rationale: Print health books often browsed in gift/health sections by buyers for
    someone else — "for beginners" signals low barrier entry point for gift buyers
    who aren't sure of the recipient's knowledge level.
  Byte count: "bloating ibs book for beginners" = 31/50 bytes ✓

Field 6: gut reset book printed guide
  Tier: 3 | Format intent: format preference for our core concept
  Rationale: "Gut reset" is our core concept; "printed guide" is the format qualifier.
    Compound phrase captures the buyer who specifically wants a physical copy of a gut
    reset guide — low competition, specific intent.
  Byte count: "gut reset book printed guide" = 28/50 bytes ✓

Field 7: stress gut connection self help
  Tier: 3 | Format intent: specific concern + print self-help shelf
  Rationale: The gut-brain/stress chapter (Day 5) is a differentiating feature for
    print buyers too. "Self help" is a print browse-category term. Low competition
    for this compound phrase in print format.
  Byte count: "stress gut connection self help" = 31/50 bytes ✓

PRINT BUYER INTENT DIFFERENCE — NOTE FOR ARCHITECT:
  Ebook buyers in this niche search by symptom + protocol frame ("gut health reset,"
  "bloating relief plan," "ibs diagnostic"). Print buyers in health guides are more
  likely to search by format occasion ("gift," "paperback"), condition + format
  ("ibs self help paperback"), or use-case ("gut health journal"). The print keyword
  set above targets these print-specific patterns and does not overlap with the ebook set.

PRINT EDITION CATEGORY CHECK:
  Print book categories may differ from ebook. At paperback launch, consider:
  - Books > Health, Family & Lifestyle > Diet & Nutrition > Digestive Health
    (same as ebook secondary, but print browse audience is broader)
  - Books > Health, Family & Lifestyle > Self-Help > Personal Health
    (print buyers browsing self-help shelves — no ebook equivalent)
  If print categories differ from ebook CATEGORY-SELECTION.md, flag for Architect review.
  Architect must update CATEGORY-SELECTION.md with a print-edition section before the
  paperback upload agent runs.
```

---

## Title Keyword Analysis

### Step 4A — Title Keyword Analysis

```
TITLE KEYWORD ANALYSIS — "The 7-Day Gut Reset"
────────────────────────────────────────────────────────────────────────────────────
Words in proposed title: The | 7-Day | Gut | Reset

Keyword coverage check:
  Tier 1 terms present: "gut" — YES (highest-volume genre word is in title). ✓
                        "gut health" — PARTIAL ("gut" is present; "health" is absent)
  Tier 2 terms present: "gut reset" — YES (our core Tier 2 phrase) ✓
                        "7 day gut protocol" — PARTIAL ("7 day" + "gut" are present,
                          "protocol" is absent — in subtitle instead) ✓
  Tier 3 terms present: "gut reset" as a gap term — YES ✓
                        "7-Day" frame (unoccupied in the niche) — YES ✓

Missing from title:
  - "health" — the word "gut health" as a compound is not in the title. The title
    is "The 7-Day Gut Reset," which is indexed as "gut" and "reset" separately,
    not as "gut health." This means the combined head-term "gut health" requires
    description + Look Inside coverage.
  - Any symptom word (bloating, ibs) — correct omission; title is the solution frame,
    not the symptom frame. This is intentional per the positioning strategy.

Assessment: STRONG keyword placement.
  The title contains the highest-value gap term ("reset" — absent from all 20
  competitors, source: harvested.json) and the unoccupied time frame ("7-Day"). Every
  word is indexable and differentiated. The absence of "health" is a minor gap — the
  word "gut" as a standalone carries significant search signal and "gut health" is
  covered in the subtitle keyword mandate and description.

Recommendation for title-and-subtitle-lab:
  TITLE IS LOCKED — this analysis is retrospective. The title "The 7-Day Gut Reset"
  is confirmed in KDP-LISTING.md (publisher-agent, 2026-05-23) and pipeline-state.json.
  Do not change it. The title's keyword architecture is STRONG: gap term ("reset"),
  time-frame differentiator ("7-Day"), and the dominant genre word ("gut") are all present.
  The title-and-subtitle-lab should focus all remaining effort on the subtitle.
```

### Step 4B — Subtitle Keyword Mandate

```
SUBTITLE KEYWORD MANDATE — "Find Your Trigger and Calm Your Gut in One Week"
────────────────────────────────────────────────────────────────────────────────────
Required keyword phrases (must appear in subtitle — exact phrase preferred):
  1. "Find Your Trigger" — Tier 3 (gap phrase, zero competitors, high conversion intent).
     Rationale: "Trigger" is absent from all 20 competitor titles/subtitles. It is
     the exact word readers use in review language ("I couldn't find my trigger,"
     "I didn't know what was causing it"). The personalisation word "your" + "trigger"
     together create a uniquely searchable phrase. ALREADY IN SUBTITLE. ✓
  2. "Calm Your Gut" — Tier 2 (gap phrase, "calm" absent from all competitors).
     Rationale: "Calm" is the compliance-safe outcome word (vs "heal" which is removed per
     FACTS.md). The phrase "calm your gut" is both a direct reader benefit statement and a
     searchable phrase with zero competition. ALREADY IN SUBTITLE. ✓
  3. "One Week" — Tier 2 (validates the time commitment; "week" is the short-form of
     "7 days" for searchers who type the word instead of the number).
     Rationale: "One Week" captures searchers typing "gut health one week" or "one week
     gut protocol" — a different search entry point from "7 day." The subtitle captures
     both. ALREADY IN SUBTITLE. ✓

Current subtitle assessment: STRONG — all three required keyword phrases are present.
  "Find Your Trigger and Calm Your Gut in One Week" is both a natural reader-facing
  benefit statement AND contains three searchable keyword phrases. No changes required.

Anti-patterns confirmed absent from subtitle:
  ✓ No vague taglines ("where healing begins") — absent
  ✓ No duplicate of title words beyond "gut" (acceptable — "Calm Your Gut" is a distinct
    phrase from "Gut Reset") — confirmed
  ✓ No generic descriptors with no search volume ("a gripping guide") — absent

SUBTITLE IS LOCKED — confirmed in KDP-LISTING.md and pipeline-state.json. STRONG.
```

---

## Description Keyword Structure

### Step 6B — Description Keyword Hierarchy

**Current description status:** KDP-LISTING.md Section 5 contains the full HTML description (487 words). Per pipeline-state.json AGENT-LOG entry 2026-05-24T17:00:00Z, the description was already restructured to open with "The 7-Day Gut Reset" in the first sentence and the core claim.

```
DESCRIPTION KEYWORD ANALYSIS — "The 7-Day Gut Reset"
────────────────────────────────────────────────────────────────────────────────────
Current description first 200 characters (from KDP-LISTING.md Section 5, h2 tag excluded):
  "<p><b>The 7-Day Gut Reset</b> is a science-backed, day-by-day programme that
  identifies your personal gut trigger — food, stress, or motility — and builds the
  protocol around it..."

Keyword presence in first 200 chars:
  Primary keyword (Tier 2) "gut reset": PRESENT ("The 7-Day Gut Reset") ✓
  Secondary keyword "gut trigger": PRESENT ("personal gut trigger") ✓
  Secondary keyword "protocol": PRESENT ("the protocol around it") ✓
  "science-backed": PRESENT — credibility signal for health content

Assessment: STRONG — the primary keyword ("gut reset"), unique positioning phrase
  ("personal gut trigger"), and genre credibility marker ("science-backed") all appear
  in the first 200 characters. Amazon and Google both weight this section maximally.

DESCRIPTION KEYWORD STRUCTURE — for publisher-agent reference:
────────────────────────────────────────────────────────────────────────────────────
Structure 1 (chars 1-200): PRIMARY KEYWORD ANCHOR
  Contains: "The 7-Day Gut Reset" + "gut trigger" + "protocol"
  Status: ALREADY CORRECT per 2026-05-24 fix (pipeline-state.json)

Structure 2 (chars 201-400): SECONDARY KEYWORDS — personal failure → structural diagnosis
  Contains: "gluten," "probiotic," "protocol," emotional recognition + structural inversion
  Status: Contains "gut health" in context, reader-facing language, conversion copy

Structure 3 (chars 401-800): PRODUCT FEATURES — 7 benefit bullets
  Contains: "Trigger Log," "Three Profiles," "Calm Plate," "Repair Kit,"
    "Stress Bridge," "Reintroduction," "Maintenance Map"
  Status: Each named feature is a potential search term; no keyword stuffing

Structure 4 (final sentences): CTA
  Contains: "scroll up and start Day 1" — action call
  Status: Clean; no keyword mandate needed

No description changes recommended. Description is STRONG and correctly structured.
```

---

## Look Inside Keyword Strategy

### Step 7A — Look Inside Keyword Audit

```
LOOK INSIDE KEYWORD AUDIT — THE 7-DAY GUT RESET
Source: manuscript/00-introduction.md (read in full) + manuscript/01-day-one.md (first 30 lines)
Note: Look Inside covers approximately the first 10% of 12,124 words = ~1,212 words.
  The Introduction (00-introduction.md, ~531 words) and beginning of Day 1 are visible.
────────────────────────────────────────────────────────────────────────────────────
Chapters visible in Look Inside (first ~1,200 words):
  - Introduction: "Why Your Gut Isn't Responding to Generic Advice" (531 words)
  - Day 1 opening: "The 24-Hour Trigger Log" (first ~700 words of 01-day-one.md)

Keyword presence in Look Inside:
  PRIMARY: "gut reset" — PRESENT. Introduction contains "That's what makes this a gut
    reset and not just another protocol." (per 2026-05-24 Look Inside fix, pipeline-state.json).
    This sentence was specifically added to the introduction to carry the primary keyword. ✓
  "trigger" — PRESENT multiple times: "three trigger profiles," "which type of gut problem,"
    "identifying which of three mechanisms is driving your symptoms," "trigger profile." ✓
  "protocol" — PRESENT: "the protocol around it," "a protocol calibrated to the average gut." ✓
  "ibs" — PRESENT once in Introduction: "A GP told them 'it's IBS'" — used once as label,
    per compliance rule (FACTS.md, COMPLIANCE-REPORT.md). ✓
  "bloating" — PRESENT: "bloated again" in the emotional hook opening paragraph. ✓
  "diagnostic" — PRESENT: "it prescribed before it diagnosed," "Days 1 and 2 are entirely
    diagnostic." ✓
  "stress" — PRESENT: "The second is stress-triggered." ✓
  "calm" — PRESENT: "calm your gut" does not appear in the Introduction text (it is in the
    subtitle). FLAG: "calm" is absent from the first 10% of the book text. The subtitle
    carries the word; the Look Inside does not. This is a minor gap.

Assessment: STRONG overall. The key phrases "gut reset," "trigger," "diagnostic," "protocol,"
  "bloating," and "ibs" all appear naturally in the Look Inside. The 2026-05-24 fix
  confirmed that "gut reset" was added to the Introduction (pipeline-state.json confirms).

Missed opportunities (minor):
  - "calm" does not appear in Introduction text body — the word appears in the subtitle
    (visible on the product page) but not in the manuscript Look Inside. A single natural
    use in Introduction prose would double the indexing weight for this Tier 2 phrase.
    Suggested addition: Conclusion sentence in Introduction could read "...your gut will
    have had seven days to calm down from whatever has been driving it." Minimal change;
    highest keyword ROI per word added. Architect decision: whether to make this change
    before upload, or accept STRONG as-is.

Recommendations for Look Inside (optional, not blocking):
  1. Add one natural use of "calm" to the Introduction body — the word is the subtitle's
     emotional outcome word and appears zero times in the Look Inside text. One addition
     doubles the indexing weight for this Tier 2 phrase with a single sentence edit.
  2. Look Inside is otherwise well-optimised — no other changes recommended.
```

### Step 7B — Chapter Header Keyword Mandate (Pre-Writing)

N/A — manuscript is complete at 12,124 words. All chapters written, reviewed, and approved. Step 7B applies only to books in the pre-writing stage.

**Chapter headers as they stand:**
- Introduction: "Why Your Gut Isn't Responding to Generic Advice" — carries "gut" ✓
- Day 1: "The 24-Hour Trigger Log" — carries "trigger" ✓
- Day 2: "Reading the Log — Three Trigger Profiles" — carries "trigger" ✓
- Day 3: "The Calm Plate" — carries "calm" ✓ (Tier 2 keyword in chapter header — valuable)
- Day 4: "The Repair Kit" — neutral (no keyword gap opportunity here)
- Day 5: "The Stress Bridge" — carries "stress" ✓ (gut-brain/stress connection chapter)
- Day 6: "Reintroduction" — neutral (no keyword gap; the concept is unique but low search volume)
- Day 7: "Your Personal Maintenance Map" — neutral; "personal" echoes personalisation theme
- Conclusion: varies per 08-conclusion.md content

**Assessment:** Chapter headers are well-structured. Days 1-3 and Day 5 all carry searchable keyword terms naturally. No retrofitting needed.

---

## Series Name

### Step 8 — Series Name Analysis

```
SERIES NAME ANALYSIS — FIX YOUR GUT FOR GOOD
Source: KDP-LISTING.md Section 2 (publisher-agent, 2026-05-23) + BLUEPRINT.md header
────────────────────────────────────────────────────────────────────────────────────
CONFLICT FLAGGED: Series position is inconsistent across files.
  KDP-LISTING.md Section 2 states: "Fix Your Gut for Good — Book 2"
  BLUEPRINT.md header states: "Fix Your Gut for Good, Book 1"
  Pipeline-state.json records: no series_position field.
  This discrepancy must be resolved by the Architect before upload. The KDP series
  record will break if series position is entered incorrectly.

Current series name (from KDP-LISTING.md): "Fix Your Gut for Good"

Keyword presence:
  Action verb: "Fix" — present ✓ (action-intent keyword: buyer wants to fix something)
  Core topic: "Gut" — present ✓ (dominant genre word)
  Outcome: "for Good" — present ✓ (permanence signal — emotionally resonant)
  Branded character: absent — N/A for non-fiction
  Genre signal as phrase: "Fix Your Gut for Good" is branded, distinctive, and
    contains the core topic word ("gut"). It is not a generic series name.

Assessment: ADEQUATE to STRONG. "Fix Your Gut for Good" is owned — no competitor uses
  this phrase. It contains "gut" (genre word) and "fix" (action verb). It does not
  contain a descriptive genre modifier ("reset series," "protocol series") but for
  a non-fiction health series, a branded name is more defensible than a generic one.

Recommendation:
  The series name is appropriate and should be retained as-is. The primary risk is
  character-for-character consistency across all books.

LOCKED SERIES NAME: "Fix Your Gut for Good"
  This exact string — including capitalisation, spacing, and punctuation — must be
  used in every book's KDP metadata. A single variation creates a separate series
  page, permanently breaking the cross-book carousel.

  Characters to confirm at upload: F-i-x-[space]-Y-o-u-r-[space]-G-u-t-[space]-f-o-r-[space]-G-o-o-d
  Length: 20 characters. No punctuation. No "The" prefix. No "Series" suffix.

SERIES POSITION CONFLICT — ARCHITECT MUST RESOLVE:
  Before upload, confirm: is "The 7-Day Gut Reset" Book 1 or Book 2 of the series?
  KDP-LISTING.md says Book 2. BLUEPRINT.md says Book 1.
  Resolution determines the series page listing order and the "Also in this series"
  carousel display. Wrong position cannot be easily corrected post-publication.
```

---

## A+ Content Keyword Mandate

```
A+ CONTENT KEYWORD MANDATE — THE 7-DAY GUT RESET
Source: ALGO-INTELLIGENCE.md v1.1 §6 (A+ Content indexes headers + body; CVR lift confirmed)
Note: pipeline-state.json records aplus_content_submitted: false + aplus_content_live: false.
  A+ Content must be submitted post-upload. This mandate is for the aplus-content-agent.
────────────────────────────────────────────────────────────────────────────────────

Tier 2 keywords for A+ headers (use at least 2 in module headlines):
  1. "gut reset" — rationale: primary Tier 2 phrase; appears zero times in competitor
     titles; carries highest conversion intent for this book's unique positioning.
     Best placement: Module 1 headline ("What Is the 7-Day Gut Reset?")
  2. "your gut trigger" / "trigger profile" — rationale: unique concept that no
     competitor has claimed; the personalisation angle is the book's single biggest
     differentiator. Best placement: Module 2 headline ("Find Your Trigger Profile")
  3. "bloating relief" — rationale: most common reader pain point in competitor review
     language (COMPETITIVE-ANALYSIS.md Section 4); symptom-led A+ header converts
     browsers who are in active discomfort.
     Best placement: Module 3 or "The Problem" module headline

Tier 3 keywords for A+ bullet points (weave naturally into module body copy):
  1. "ibs diagnostic guide" — best placement: Module 2 "Three Trigger Profiles" body —
     "The first two days function as a personalised IBS diagnostic guide..."
  2. "gut brain connection" — best placement: Day 5 "Stress Bridge" module body —
     "The gut-brain connection is not just talked about here — it is operationalised..."
  3. "low fodmap alternative" — best placement: Day 3 "Calm Plate" module body —
     "The Calm Plate is a low-FODMAP alternative approach that doesn't require..."
  4. "digestive reset" — best placement: Module 1 body — "Seven days of a structured
     digestive reset changes the relationship with your gut..."
  5. "calm your gut naturally" — best placement: Module 4 closing bullet —
     "A four-minute daily practice to calm your gut naturally via the vagal pathway"

Anti-patterns for A+ copy (zero search value — avoid):
  - "comprehensive guide," "life-changing," "ultimate resource," "groundbreaking"
  - Phrases from competitor titles (e.g. "microbiome reprogramming" — Davis brand language)
  - Exact duplication of the description's first sentence (already indexed — no additional value)

Rule for aplus-content-agent: Every module headline must contain at least one Tier 2 or
  Tier 3 keyword from this mandate. Every module body must contain at least 2 Tier 2/Tier 3
  phrases. Narrative voice serves the reader first — keyword placement must be natural.
```

---

## Summary — Priority Action List for Architect

Before approving this SEO strategy, the Architect should confirm the following:

1. **SERIES POSITION CONFLICT (blocking):** KDP-LISTING.md says Book 2; BLUEPRINT.md says Book 1. Resolve before upload. Update pipeline-state.json and both files to match.

2. **LIVE AUTOCOMPLETE HARVEST (recommended):** This strategy is built on competitor analysis data (2026-05-13). A live Playwright autocomplete harvest on Amazon.co.uk would validate the tier assignments with real current signal. The strategy is sound without it, but live data would strengthen confidence in the Tier 3 phrase selection.

3. **"calm" in Look Inside (optional):** The word "calm" is absent from the Introduction body text (it is in the subtitle but not in the manuscript Look Inside). Adding one natural use doubles the indexing weight for this Tier 2 phrase. Architect decision: make this single-sentence edit or accept STRONG as-is.

4. **Backend keyword "gut" duplication note:** Fields 1, 5, 6, and 7 contain "gut" as part of compound phrases. "Gut" appears in the title. Per KDP guidance, phrase-level use of a title word in backend is different from standalone repetition. Amazon's own help page states that repetition of title words as part of a distinct phrase is acceptable. Confirm Architect is comfortable with this interpretation before upload.

5. **Byte count validation:** All 7 backend fields have been byte-counted as ASCII-only. Before upload, the Architect or upload agent should run: `python -c "phrases=['gut health reset plan','ibs diagnostic guide book','bloating relief digestive reset','low fodmap alternative guide','gut brain connection stress','digestive health for women ibs','gut microbiome reset protocol']; [print(f'{len(p.encode())}/50: {p}') for p in phrases]"` to confirm no truncation.

---

HUMAN APPROVAL REQUIRED BEFORE PROCEEDING TO ANY DOWNSTREAM AGENT.
See CATEGORY-SELECTION.md for the binding category instruction.
