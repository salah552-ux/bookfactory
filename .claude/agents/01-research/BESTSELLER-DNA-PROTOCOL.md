# Bestseller DNA Protocol

The operational method for studying a niche's proven winners, finding the gap they all leave open, and forging an original "author DNA" that the writing and copy agents build from. This is a reference document, not an agent — the agents named below execute it.

---

## Purpose & Trigger

This protocol turns a niche's top bestsellers into a usable authoring spec. It runs at **Stage 01 (research)** for every new book, before any architecture or writing begins. The **deep-market-intelligence-agent** owns execution and pulls the live Amazon data; **competitive-positioning-agent** feeds the review-mining half (praise + complaint language). The output is a single artifact — `books/<slug>/AUTHOR-DNA.md` — that feeds Stage 02+ : **book-architect** takes structure and gap positioning, the **health-writer** (or genre writer) writes from the forged DNA blended with the house voice, and **conversion-copywriter-agent** and **kdp-seo-agent** take the copy and praise-language layers. The method is simple to state: study the top 10 proven winners, extract their DNA at the pattern level, map the gap they all leave open, then BLEND (never mimic) into an original DNA the book is built from.

---

## Step 1 — Top-10 Roster

Build the roster from **live Amazon.com** pages in this session — zero estimates, zero memory, every value read off the page it came from.

- **Selection rule:** the niche's **top 10 bestsellers by review count**. Prefer titles with **1,000+ reviews** — review count is the proxy for "proven winner" (large numbers of real buyers who finished and rated). If the niche has fewer than 10 titles above 1,000 reviews, take the **10 highest by review count** and record the actual counts so the thinness is visible.
- **How to find them:** start from the niche's bestseller category page and the 2–3 highest-intent search queries a buyer actually types; cross-reference so the roster is the genuine top of the niche, not one category slice.
- **Record per book (all from the live page):**
  - Title + subtitle (exact)
  - Author
  - ASIN
  - Review count
  - Average star rating
  - Price (Kindle and/or paperback as shown)
  - BSR (overall + primary subcategory)
  - Publisher type — traditional (imprint name shown) vs self-published (independently published / KDP)

Any value not visible on the page is recorded as `not shown`, never guessed.

---

## Step 2 — DNA Extraction (per book)

For each of the 10 books, extract the following. Capture **patterns**, not the author's actual words (except reader-review quotes, which are the readers' words — see (f)).

- **(a) Title/subtitle formula** — the *pattern*, not the words. e.g. "[Outcome] in [Timeframe]: The [Authority] Guide to [Mechanism]". Note the promise structure, not the phrasing.
- **(b) Opening-hook style** — from the free **Look Inside** sample. Does it open on a reader symptom, a myth-buster, a story, a stat, a promise? Note the *move*, not the sentences.
- **(c) Structure** — TOC pattern (how many chapters, how they're grouped/phased), chapter-length rhythm, and the mix of story vs protocol vs science. Note whether it front-loads a "why," runs a numbered program, ends with tools/appendices.
- **(d) Voice register** — clinical / warm / coach / evangelist / academic. One label plus a one-line justification of what on the page signals it.
- **(e) Blurb craft** — how the product **description** works as a machine: what it opens with (hook), how it structures the middle (problem → promise → proof → what's inside), how it closes (CTA / stakes). Pattern only.
- **(f) Reader PRAISE language** — the exact phrases from top positive reviews describing what they loved and the win they got. **Quote verbatim and cite** (book title + that it is a review). These are the readers' own words for their pain and wins — fair game for our copy (see Step 4).
- **(g) Reader COMPLAINTS** — the exact recurring gripes from critical reviews (too basic, too dense, no meal plans, US-centric, padding, no science, etc.). Quote + cite. This is the raw fuel for the Gap Map.

---

## Step 3 — Gap Map

Synthesize across **all ten** books: what does every top-10 title leave open? The gap map is the book's **entry wedge** — its positioning must claim at least one gap that no top-10 book covers. Look for:

- **Unanswered complaints** — the same gripe appearing across multiple books' reviews (a need the whole niche fails to meet).
- **Missing angles** — a mechanism, sub-topic, or approach none of the ten centre on.
- **Underserved sub-audiences** — a reader segment the top 10 ignore or address only in passing (e.g. a specific age group, condition, region, skill level, dietary constraint).
- **Format gaps** — missing tools: no protocols, no tracker, no meal plans, no quick-start, no troubleshooting, too US-centric for a UK reader, etc.

Output is a ranked shortlist of gaps, each tagged with the evidence (which reviews / which absence across the roster) that proves it is real and unmet.

---

## Step 4 — DNA Forge (blend, never mimic)

Forge OUR original author DNA from the extracted patterns. Rules:

- **Pattern-level only, never text-level.** Formulas, structures, and register may *inspire* our choices. Sentences, metaphors, chapter titles, subtitles, and phrasings may **NOT** be reused, paraphrased, or "spun" from any competitor. If a line could be traced back to a specific book, it is out.
- **Never imitate any single author.** The forge must draw from **at least 3 of the 10** and, for each of those 3+, name explicitly what our DNA does **DIFFERENTLY** from it. A DNA that mirrors one standout book is a failure of the method.
- **Blend with the house voice, and the house voice wins.** For health books, the forged DNA must sit inside `.claude/agents/03-writing/HEALTH-VOICE-BIBLE.md` — its Ban List, Voice Standards, Exemplar Patterns, and Research Rule. Where a competitor pattern conflicts with the Voice Bible (e.g. hype verbs, tricolon spam, unsourced "studies show"), **the Bible wins, every time.**
- **Reader praise language IS fair game.** The readers' own words for their pain and their wins (Step 2f) may be used in blurbs, hooks, and descriptions — that is the *readers'* language, not the authors' prose. Per **ALGO-INTELLIGENCE v1.3 §18–19**, blurb and review language are discovery surfaces: mirroring how the avatar already talks feeds Rufus / COSMO semantic-intent matching. Route this language into Copy DNA.
- **Anti-plagiarism hard line.** Any output — a title, subtitle, chapter name, blurb line, hook — that could be traced to one specific competitor book is a **defect**, not a style choice. Blend from many, copy from none.

---

## Step 5 — Output Contract: `AUTHOR-DNA.md`

Written to `books/<slug>/AUTHOR-DNA.md` with these H2 sections, in this order and with these exact headings:

- **`## Top-10 Roster`** — the Step 1 table: title/subtitle, author, ASIN, review count, rating, price, BSR, publisher type. If fewer than 10 qualifying titles, state that here with counts.
- **`## Shared DNA Patterns`** — what recurs across the roster: common title formulas, opening moves, structural patterns, dominant voice register, blurb architecture. This is the "what winners in this niche do" summary the architect reads.
- **`## Individual Standouts`** — per-book notes where a title does something distinctive worth learning from (and, later, deviating from). One tight block per notable book.
- **`## Reader Praise Language`** — the verbatim, cited praise-phrase bank from Step 2f. Grouped by theme (the pain they had, the win they got, the feature they loved). This is the copywriter's raw material.
- **`## Gap Map`** — the Step 3 ranked gaps, each with its evidence. The positioning wedge is flagged here.
- **`## Our Forged DNA`** — the Step 4 output: our title/subtitle formula, opening-hook approach, structure, voice register — plus the explicit "different from Book X / Y / Z because…" statements, and a one-line note confirming it blends with (and defers to) the Voice Bible.
- **`## Copy DNA`** — blurb, hook, and title formulas *adapted for OUR book* (pattern-level, original), together with the praise-language bank organised for the copywriter to pull from. This is what conversion-copywriter-agent and kdp-seo-agent consume directly.

---

## Step 6 — Implant & Consumption

Who reads `AUTHOR-DNA.md`, and which sections they use:

- **book-architect** — builds structure from `## Shared DNA Patterns` and positions the book against `## Gap Map`. The wedge gap must appear in the blueprint's positioning.
- **health-writer** (or the genre writer) — writes from `## Our Forged DNA`, blended with the Voice Bible. On any conflict, the Voice Bible governs.
- **conversion-copywriter-agent** — writes the blurb, hook, and ad copy from `## Copy DNA` and `## Reader Praise Language`, mirroring the avatar's own words (never inventing claims — every factual statement still comes from FACTS.md).
- **kdp-seo-agent** — feeds `## Reader Praise Language` into keyword and description strategy per the ALGO-INTELLIGENCE semantic layer (§18–19), so the listing matches how buyers actually search and how Rufus/COSMO surface it.
- **Orchestrator** — injects the relevant `AUTHOR-DNA.md` sections into **every Stage 02+ agent brief**, so no downstream agent works without it.

---

## Hard Rules

- **Live data only.** Every number and every quote cites the page it came from. No invented reviews, ratings, stats, prices, or quotes — ever. If a value is not visible, mark it `not shown`.
- **Blend, never mimic.** Pattern-level, never text-level. No sentence, metaphor, title, or blurb line may be traceable to one specific competitor book. That traceability is a defect.
- **If fewer than 10 qualifying bestsellers exist,** proceed with the titles that exist, record their real review counts, and say so plainly in `## Top-10 Roster`. Do not pad the roster to reach ten.
