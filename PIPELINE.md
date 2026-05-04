# THE PUBLISHING PIPELINE
## Reflex Press / BookFactory — Master Guide
## Last updated: 2026-04-17

---

## THE SYSTEM — 29 AGENTS, FULL AUTOMATION

```
YOUR IDEA (1 sentence)
        ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 0 — MARKET INTELLIGENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1] market-researcher
    → validates niche, finds gap, green/yellow/red signal
    → RED: stop. YELLOW: reconsider angle. GREEN: proceed.
        ↓ GREEN
[2] competitive-positioning-agent
    → mines Amazon 1–3 star reviews of top competitors
    → extracts verbatim reader language and unmet needs
    → produces: COMPETITIVE-ANALYSIS.md (Reader Gap Brief,
      keyword gaps, differentiation map, positioning statement)
        ↓ COMPETITIVE-ANALYSIS.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 1 — ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[3] book-architect
    → full blueprint, tone bible, chapter outline, pacing map
    → reads COMPETITIVE-ANALYSIS.md to anchor positioning
    → saves BLUEPRINT.md to book folder
        ↓ BLUEPRINT.md
[4] title-and-subtitle-lab
    → live Amazon market search for title patterns in niche
    → generates 25+ title/subtitle combinations
    → scores all on: searchability, clickability, clarity,
      emotional resonance, competitive differentiation
    → delivers ranked top 10 + top 3 recommendation
    → feeds top 3 to publisher-agent later
        ↓ title shortlist

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 2 — WRITING (chapter by chapter)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[5] WRITER — pick one per book genre:
    health-writer    → health, wellness, gut, hormones, mental health
    fiction-writer   → fantasy, thriller, romance, sci-fi, historical, YA
    business-writer  → business, self-help, productivity, finance
    novel-writer     → long-form fiction support
        ↓ raw chapter

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 3 — QUALITY ASSURANCE (every chapter)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[6] fact-checker        ←── runs in PARALLEL
[7] book-reviewer       ←── runs in PARALLEL
    → 12-metric scorecard, minimum 96/120 (grade B) to proceed
    → below 96: writer fixes, re-review before saving
        ↓ both pass
[8] compliance-officer
    → medical disclaimers, KDP policy, no prohibited claims
        ↓ PASS

 → Save chapter to manuscript/
 → Update FACTS.md (continuity bible)
 → Update APPROVALS.md
 → Run build-pdf.sh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 4 — POLISH (after all chapters approved)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[9]  hook-optimizer-agent    ←── runs in PARALLEL
[10] review-bait-optimizer   ←── runs in PARALLEL
    hook-optimizer  → audits first + last paragraph of every chapter
                    → scores on 5 criteria, rewrites anything below 35/50
                    → presents all rewrites for approval before editing
    review-bait     → searches current Amazon review guidelines (live)
                    → identifies 3 highest-leverage review trigger moments
                    → rewrites back matter CTA in book's voice
    (work on different parts of the book — no dependency between them)
        ↓ both complete + approved
[11] proofreader-agent
    → British English spelling enforcement throughout
    → punctuation: Oxford comma, em/en dash, apostrophes
    → number formatting, capitalisation consistency (MMC, SIBO, FODMAP, Phase names)
    → repeated words, hyphenation, double spaces
    → applies clear errors autonomously; flags ambiguous cases for author review
        ↓ manuscript clean

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 5 — CROSS-BOOK QA (after each new book)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[11] series-continuity-guardian
    → reads SERIES-FACTS.md + all individual FACTS.md files
    → detects conflicts: statistics, terminology, causal language,
      promises, voice — across the entire 10-book catalog
    → uses live web search to verify disputed statistics
    → produces conflict report with exact quotes + minimum-change fixes
    → updates SERIES-FACTS.md
        ↓ no critical conflicts outstanding

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 6 — PRODUCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[12] design-agent
    → reads manuscript + BLUEPRINT.md + SERIES-FACTS.md
    → live search: cover trends in niche, current KDP specs
    → Reflex Press series brand system (all 10 books consistent)
    → cover: Nano Banana Pro prompts (expert-level briefs)
    → interior: typography, special elements, phase separators,
      callout boxes, recipe sections, tables
    → all digital products: A+ Content, social graphics,
      BookTok thumbnails, Pinterest, AMS ad creatives, lead magnets
    → KDP technical specs: verified live, 2026-compliant

[13] product-extractor  ←── runs in PARALLEL with design-agent
    → runs on every approved chapter
    → extracts: printables, journals, workbooks, courses, bundles,
      audio scripts, high-ticket frameworks
    → produces: Etsy listings, Gumroad pages, course outlines,
      revenue estimates, cross-promotion strategy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 7 — LAUNCH PREP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[14] publisher-agent    ←── runs in PARALLEL
[15] marketing-agent    ←── runs in PARALLEL
    publisher → uses title-and-subtitle-lab top 3 shortlist
              → KDP listing: title, subtitle, HTML description,
                7 keywords, 2 categories, A+ content
              → keyword density check: 3-occurrence threshold
    marketing → launch plan, AMS ad copy, BookTok scripts
              → pre-launch strategy, launch week execution
              → email sequences, pricing strategy
              → 90-day post-launch plan, review velocity tactics
    (independent outputs — no dependency between them)
        ↓ both complete

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 8 — PACKAGING + FINAL GATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[16] book-wrapper-agent
    → assembles all approved components in KDP sequence
    → generates: title page, TOC, back matter templates
    → validates: APPROVALS.md ↔ manuscript/ ↔ cover file
    → produces: exports/final/ package
      - manuscript-kdp.html (primary KDP upload)
      - manuscript-kdp.docx (backup/print via Pandoc)
      - kdp-metadata.txt (paste-ready for KDP dashboard)
      - PACKAGE-MANIFEST.md (checklist + validation results)

[17] epub-builder-agent
    → converts manuscript-kdp.html → EPUB3
    → runs EPUBCheck validation, fixes errors autonomously
    → Kindle-specific quality checks (cover tag, no scripts,
      no position:fixed, alt text, NCX playOrder)
    → produces: exports/final/manuscript-kdp.epub

[18] final-approval-agent  ← HARD GATE — NOTHING SHIPS WITHOUT THIS
    → 300-point audit across 6 dimensions:
      - Manuscript Integrity (75 pts)
      - Cover (50 pts)
      - Metadata (60 pts)
      - Compliance & Legal (55 pts)
      - Commercial Readiness (35 pts)
      - Package Integrity (25 pts)
    → 270+ = APPROVED · 240–269 = CONDITIONAL · <240 = HOLD/REJECT
    → Compliance dimension must score 33+/55 regardless of total

        ↓ APPROVED (270+/300)
📦 UPLOAD TO KDP

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ONGOING — POST-LAUNCH + SERIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[19] post-launch-agent   ←── runs in PARALLEL (after upload)
[20] series-sync-agent   ←── runs in PARALLEL (after upload)
    post-launch → weeks 1–4: weekly BSR, review velocity, KU reads
               → intervention playbook: free promo, price pulse,
                 category switch, description A/B test
               → day-90 retrospective: renewal + go-wide decision
    series-sync → syncs shared medical facts across all books
               → validates cross-references (no premature mentions)
               → updates "Also By" sections in all books
               → enforces pen name (S.A. Ibrahim) everywhere
               → produces: Series Sync Report + Series Health Score
    (independent — post-launch monitors this book, series-sync spans all books)
        ↓ both running on their own cadence

[21] series-manager
    → full series dashboard: all books + status
    → recommends which book to write next
    → brand and voice consistency check across series
```

---

## TRIGGER COMMANDS

| Say this... | Runs this... | When |
|-------------|-------------|------|
| `research [idea]` | market-researcher | Before starting any book |
| `position [book title]` | competitive-positioning-agent | After market-researcher green |
| `architect [book title]` | book-architect | After competitive positioning |
| `titles [book title]` | title-and-subtitle-lab | After blueprint exists |
| `write chapter [X] health` | health-writer | Per chapter, health books |
| `write chapter [X] fiction` | fiction-writer | Per chapter, fiction books |
| `write chapter [X] business` | business-writer | Per chapter, business books |
| `review chapter [X]` | fact-checker + book-reviewer (parallel) | After every chapter |
| `comply chapter [X]` | compliance-officer | After fact-check + review pass |
| `optimize hooks` | hook-optimizer-agent | After all chapters approved |
| `optimize reviews` | review-bait-optimizer | After hook optimizer |
| `proofread [book title]` | proofreader-agent | After hook + review-bait optimizers |
| `series audit` | series-continuity-guardian | After each new book completes |
| `series status` | series-manager | Anytime |
| `series next` | series-manager | When choosing next book |
| `design [book title]` | design-agent | After polish phase |
| `extract products [chapter X]` | product-extractor | After any chapter approval |
| `extract products full` | product-extractor | After full manuscript |
| `publish [book title]` | publisher-agent | After design |
| `market [book title]` | marketing-agent | After publisher listing |
| `wrap [book title]` | book-wrapper-agent | After publisher + marketing |
| `build epub [book title]` | epub-builder-agent | After book-wrapper |
| `final approval [book title]` | final-approval-agent | After epub-builder |
| `launch report [book title]` | post-launch-agent | Weekly (first 30 days) then monthly |
| `sync series` | series-sync-agent | After new book published or SERIES-FACTS.md updated |

---

## AGENT ROSTER (29 agents — all in BookFactory/.claude/agents/)

| # | Agent | Stage | Web Search | Model | Reason |
|---|-------|-------|-----------|-------|--------|
| 1 | market-researcher | Pre-writing | ✅ | sonnet | Research + formatting — no creative judgment |
| 2 | competitive-positioning-agent | Pre-writing | ✅ | opus | Deep strategic analysis |
| 3 | book-architect | Architecture | ✅ | opus | Tone bible + full book blueprint |
| 4 | title-and-subtitle-lab | Architecture | ✅ | opus | Creative title generation |
| 5 | health-writer | Writing | — | **opus** | Writes the actual book |
| 6 | fiction-writer | Writing | — | **opus** | Prose quality is everything in fiction |
| 7 | business-writer | Writing | — | **opus** | Writes the actual book |
| 8 | novel-writer | Writing | — | **opus** | Long-form fiction |
| 9 | fact-checker | QA | ✅ | sonnet | Verification against FACTS.md — mechanical |
| 10 | book-reviewer | QA | — | sonnet | Follows fixed 12-metric rubric — structured, not creative |
| 11 | compliance-officer | QA | ✅ | sonnet | Rule-checking against fixed policy list — not creative judgment |
| 12 | hook-optimizer-agent | Polish | — | opus | Creative rewriting |
| 13 | review-bait-optimizer | Polish | ✅ | opus | Persuasive CTA writing |
| 14 | proofreader-agent | Polish | — | sonnet | Mechanical error detection |
| 15 | series-continuity-guardian | Cross-book QA | ✅ | opus | Canon judgment across books |
| 16 | series-manager | Management | — | sonnet | Dashboard + status reporting |
| 17 | design-agent | Production | ✅ | opus | Creative direction |
| 18 | product-extractor | Monetization | — | sonnet | Extraction + formatting |
| 19 | aplus-content-agent | Launch Prep | — | opus | Persuasive marketing copy |
| 20 | arc-manager-agent | Launch Prep | ✅ | opus | Outreach copy writing |
| 21 | paperback-interior-agent | Packaging | — | sonnet | CSS + print specs |
| 22 | publisher-agent | Launch | — | **opus** | Writes the KDP sales description |
| 23 | marketing-agent | Launch | ✅ | opus | Ad copy + email sequences |
| 24 | book-wrapper-agent | Packaging | — | sonnet | File assembly — no creative output |
| 25 | epub-builder-agent | Packaging | — | sonnet | Technical format conversion |
| 26 | final-approval-agent | Final Gate | ✅ | opus | 300-point quality audit |
| 27 | post-launch-agent | Post-Launch | ✅ | sonnet | Analytics + reporting |
| 28 | series-sync-agent | Series QA | — | sonnet | Consistency checking |
| 29 | pipeline-guide | Reference | — | — | Static reference |

---

## QUALITY GATES

| Gate | Requirement | Blocks |
|------|------------|--------|
| market-researcher | Green signal | Everything |
| book-reviewer | 96/120 minimum (grade B) | Chapter save |
| compliance-officer | PASS | Chapter save |
| series-continuity-guardian | No critical conflicts | New book approval |
| hook-optimizer-agent | All hooks 35/50+ | Final build |
| final-approval-agent | 270+/300 overall · 33+/55 compliance (hard gate) | KDP upload |

---

## ACTIVE BOOKS

| Book | Genre | Status | Next Step |
|------|-------|--------|-----------|
| Fix Your Gut for Good | Health/SIBO | ✅ All 12 chapters approved (46,935 words) | publisher-agent → design-agent → marketing-agent |
| The Dust Between Seconds | Fantasy | In progress — Ch.3 written | Write Ch.1 + Ch.2 |

---

## FOLDER STRUCTURE

```
BookFactory/
├── PIPELINE.md                          ← you are here
├── SERIES-FACTS.md                      ← cross-book canon (locked stats, definitions, voice)
├── SERIES-ROADMAP.md                    ← publication status, Also By, cross-promotion map
├── CLAUDE.md                            ← session rules + pipeline gate
├── build-pdf.sh                         ← assembles + generates PDF
├── approve-chapter.sh                   ← approval gate + git commit
├── new-book.sh                          ← new book structure in 30s
├── phase-config.sh                      ← phase separator titles
├── pdf-style.css                        ← KDP interior stylesheet
│
├── .claude/agents/                      ← all 20 agents (authoritative)
│
└── books/
    ├── fix-your-gut-for-good/
    │   ├── BLUEPRINT.md
    │   ├── FACTS.md                     ← continuity bible
    │   ├── APPROVALS.md                 ← chapter approval log
    │   ├── STATUS.md                    ← build state
    │   ├── COMPETITIVE-ANALYSIS.md      ← positioning research
    │   ├── manuscript/
    │   │   ├── 00-introduction.md       ✅
    │   │   ├── 01-chapter-1.md          ✅
    │   │   └── ... (12 files total)     ✅
    │   └── exports/
    │       └── Fix_Your_Gut_For_Good.pdf
    │
    └── the-dust-between-seconds/
        ├── BLUEPRINT.md
        ├── manuscript/
        │   ├── 01-chapter-1.md          ⬜
        │   ├── 02-chapter-2.md          ⬜
        │   └── 03-chapter-3.md          ✅
        └── exports/
```

---

## IMAGE GENERATION — NANO BANANA PRO

All cover art and digital product images are generated via **Nano Banana Pro** (Google DeepMind — built into Gemini).

- design-agent writes expert-level Nano Banana Pro prompts (natural language briefs, not keyword spam)
- Prompts include: subject + composition, lighting, color, style, text-in-quotes, negative constraints
- Iteration: use conversational edits on 80%-correct images rather than regenerating from scratch
- Text rendering: Nano Banana Pro handles legible title/subtitle text baked into covers

Planned: Gemini API integration via Bash tool for direct generation without manual steps.

---

## DISTRIBUTION STACK

| Format | Platform | Notes |
|--------|---------|-------|
| eBook | KDP Select (90 days) → Draft2Digital wide | Health: KDP first; Fantasy: wide from day 1 |
| Print | KDP paperback + IngramSpark | IngramSpark for bookstores + libraries |
| Audio | ACX → Audible / Findaway Voices wide | Royalty share or flat fee |
| Direct | Payhip / Gumroad | 95% margin, PDF + epub |
| Products | Etsy + Gumroad + Teachable | product-extractor output |
