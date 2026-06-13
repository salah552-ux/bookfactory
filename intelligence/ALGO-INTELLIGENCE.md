# ALGO-INTELLIGENCE.md
## Amazon Algorithm Intelligence — BookFactory Pipeline

**CURRENT VERSION: v1.2 — 2026-06-12**

This document is the canonical algorithm knowledge source for all BookFactory discoverability agents.

**Reading order for dependent agents:**
1. Read the section marked CURRENT VERSION first (below)
2. Treat any claim marked UNVERIFIED as provisional — carry it but do not build hard strategy on it alone
3. When this document's understanding contradicts a hardcoded assumption in your own agent file, this document takes precedence
4. If you observe ranking behaviour that contradicts this document, flag it to the Architect and note "possible algo shift — algo-intelligence-agent should be re-run"

**Agents that must read this document before their own logic runs:**
- `kdp-seo-agent` — read before Phase 1 keyword harvest
- `marketing-agent` — read before Section 0
- `amazon-ads-agent` — read at pre-flight, before campaign setup or review
- Any future agent touching Amazon discoverability, ads, or category strategy

---

## v1.0 — 2026-06-03
**Updated by:** algo-intelligence-agent (seed — Opus knowledge base + pipeline research)
**Trigger:** Initial creation — BookFactory pipeline architecture build
**Sources consulted:** Kindlepreneur published research (as of training cutoff August 2025), ALLi practitioner reports, KDP policy documentation, BookFactory pipeline operational learning from launched books (Fix Your Gut for Good series)
**Changes from prior version:** N/A — seed document

---

### 1. Signal Weight Hierarchy
**CONFIDENCE: MEDIUM** — practitioner-verified model, no Amazon-published weight table. See §14 for per-claim breakdown.

Amazon's A10 algorithm (the current generation as of 2025–2026) indexes keyword signals from multiple locations in a book's metadata and content. The weight order below is a practitioner-verified model, not a published Amazon specification. Treat it as the best current approximation.

```
KEYWORD SIGNAL WEIGHTS (approximate — practitioner model)
─────────────────────────────────────────────────────────
Title                    → HIGHEST weight
                           Every word is individually indexed AND phrase-matched.
                           A keyword in the title is a permanent ranking advantage.
                           No metadata optimisation compensates for a title that
                           misses the key search phrase.

Subtitle                 → HIGH weight
                           Phrase-match territory. A subtitle containing "british
                           village cozy mystery" will match that exact search query.
                           Subtitles that read as taglines produce zero search signal.

Series name              → HIGH weight (and compounding)
                           Indexed separately from the book title. A keyword-bearing
                           series name extends the search footprint of every book
                           in the series simultaneously.

Backend keyword fields   → MEDIUM weight
                           7 fields × 50 characters = 350 characters of phrase-match
                           keyword space. The algorithm treats these as phrase signals,
                           not as individual keyword inputs. Single words waste these
                           fields. Phrases a buyer actually types are the correct unit.

Description (first 200 chars) → MEDIUM weight (and Google-indexed)
                           Amazon's crawler AND Google weight the first 200 characters
                           of the description body most heavily. This is the highest-
                           value text on the product page because it is indexed by
                           both Amazon and external search engines.

Look Inside (first 10%) → MEDIUM weight (STRONGER than backend fields for same keyword)
                           Keywords appearing naturally in the readable text carry more
                           weight than the same keyword in backend metadata alone.
                           A keyword present in both the metadata and the Look Inside
                           text is indexed twice with different signal strengths — the
                           content occurrence is the stronger signal of the two.

Category path            → LOW-MEDIUM weight
                           The category browse path is a relevance signal, not just
                           an audience routing mechanism. A book placed in the wrong
                           category sends a confused relevance signal to the algorithm.

A+ Content               → LOW weight (but currently underexploited)
                           Amazon indexes A+ Content text. Headers, bullet points, and
                           body text in A+ modules are searchable. Currently no pipeline
                           standard exists for keyword-bearing A+ Content — this is a
                           gap. [STATUS: UNVERIFIED — no published source confirms A+
                           indexing weight; community observation suggests it is indexed
                           but weight is lower than product description]
```

**Operational consequence:** keyword strategy must be decided before a single word of manuscript is written. The title and subtitle are the highest-weight fields and they are set before writing. Chapter headers appear in the Look Inside and are indexed. The keyword strategy that enters a book at Stage 01 shapes the permanent search identity of that book — it cannot be retroactively fixed.

---

### 2. Velocity and Recency Model
**CONFIDENCE: MEDIUM** — widely observed via BSR tracking tools; velocity window not Amazon-published. See §14.

The algorithm does not score total lifetime sales. It scores a composite signal weighted heavily toward the **last 24–48 hours**.

```
VELOCITY SIGNAL COMPONENTS
─────────────────────────────────────────────────────────
Sales velocity           → Units sold per day in a compressed window.
                           100 units in 3 days outranks 100 units across 30 days.
                           This is the foundational insight behind launch compression.

KU page-read velocity    → For KDP Select books, Kindle Unlimited borrows AND pages
(KENP)                     read count toward rank equivalently to purchases.
                           A KU borrow is rank fuel. A completed read is more rank
                           fuel than an incomplete one.

Conversion rate          → Page visitors who buy. A book converting at 30% outranks
                           a book converting at 5% even at equal sales velocity.
                           The algorithm uses CVR to decide how broadly to surface
                           the book in search results.

Click-through rate       → In search results and "also bought" carousels, books that
                           get clicked receive more impressions. Listings with stronger
                           cover thumbnails earn more impressions through this mechanic.

Review velocity          → Reviews posted in the last 30 days weigh more than older
                           reviews. A burst of 5 reviews in Week 1 has more algorithmic
                           impact than 5 reviews spread across a year.

Return rate              → A suppression signal, not a promotion signal. High return
                           rate tells the algorithm the book disappointed buyers.
                           Return rate damage is difficult to reverse.
```

**The launch consequence:** days 1–7 are disproportionately weighted. The entire launch plan exists to concentrate as many buyers as possible into the smallest possible time window. Within Day 1, concentration at the hourly level produces "Hot New Releases" ranking events (see section 10).

---

### 3. Carousel Mechanics — Three Separate Systems
**CONFIDENCE: HIGH (three systems are distinct — observable); MEDIUM (seeding windows and weights)**. See §14.

Amazon runs three recommendation carousels. Most agents and authors treat them as one system. They are not. Each has different data inputs and different seeding requirements.

#### 3a. "Customers who bought X also bought Y" (Also-Bought)
```
Data input:    Co-PURCHASE patterns. Requires transactions.
Seeding:       Drive purchases from readers who already own the target
               comparable titles. Their purchase history seeds the connection.
Malleability:  Maximum in the first 30 days after publication. Each early
               purchase has outsized influence because the book's also-bought
               history is thin. After 30 days, the accumulated pattern
               becomes resistant to new seeding — existing connections
               dominate. [STATUS: CONFIRMED — community consensus, directional
               multiplier figure not Amazon-published]
Importance:    The most powerful passive marketing channel on the platform.
               Right also-boughts = perpetual free placement next to the
               books your buyer is already buying.
Wrong cluster: A wrong also-bought cluster (e.g. thriller books when you're
               a cozy mystery) sends the book to the wrong readers
               permanently. Re-seeding after Day 30 requires substantially
               more volume.
```

#### 3b. "Readers also enjoyed" (Also-Read — KU only)
```
Data input:    Co-READING patterns. Requires KU borrows plus read-through
               overlap between titles. No purchase necessary.
Seeding:       When a KU reader borrows this book AND has borrowed competitor
               titles, Amazon registers the co-reading overlap. As that overlap
               accumulates across enough readers, the book appears in the
               "Readers also enjoyed" carousel beneath the competitor titles.
Distinction:   This is SEPARATE from Also-Bought. A book can appear in both
               carousels simultaneously — they are additive.
Importance:    Zero-cost placement under the highest-traffic listings in the
               niche, operating entirely through KU behaviour, not purchases.
```

#### 3c. "Customers also viewed" (Also-Viewed)
```
Data input:    Product page view co-occurrence. Requires only a product page
               visit — no purchase, no borrow.
Seeding:       A reader who views book A and then views book B (within a
               session window) seeds the also-viewed connection. Driving
               traffic to the product page — even traffic that does not
               convert — has positive algorithmic value through this mechanic.
Free-day use:  During free days, readers who visit the product page to
               download the free book (and who have recently viewed competitor
               pages) seed the also-viewed connections. Free days are a
               three-part algorithmic action: (1) free-chart velocity spike,
               (2) also-viewed graph seeding, (3) KU borrow signal.
```

---

### 4. Review Signal
**CONFIDENCE: HIGH (BookBub threshold); MEDIUM (recency weighting, stagger rule); LOW (KDD threshold)**. See §14.

```
REVIEW MECHANICS
─────────────────────────────────────────────────────────
Recency weighting:   Reviews posted in the last 30 days weigh more than
                     older reviews in the dynamic ranking signal. The first
                     30 days after publication is the most algorithmically
                     important review period in the book's life.

Rating effect:       Average rating affects conversion rate (lower rating →
                     lower conversion → lower rank). The algorithm uses
                     conversion rate as a proxy for quality.

Review velocity:     A burst of reviews in Week 1 (from ARC readers) produces
                     a stronger algorithmic signal than the same number of
                     reviews spread across months.

ARC stagger rule:    5 reviews on Day 1, 5 on Day 2, 5 on Day 3 is the
                     correct pattern. Identical-timestamp review dumps trigger
                     Amazon's editorial review system. Stagger timing, not dates.

Kindle Daily Deal:   10+ reviews at 4.0+ average is the observed community
                     threshold for entering the Kindle Daily Deal candidate pool.
                     [STATUS: UNVERIFIED — Amazon has not published the threshold.
                     Community consensus is consistent but not confirmed.]

BookBub Featured:    50+ reviews at 4.0+ average is BookBub's own editorial
                     threshold. Applying before 50 reviews = guaranteed rejection.
                     [STATUS: CONFIRMED — BookBub editorial policy, publicly stated]
```

---

### 5. External Traffic Attribution Signal
**CONFIDENCE: HIGH** — Amazon's own published Attribution program documentation. See §14.

```
AMAZON ATTRIBUTION PROGRAM (published Amazon feature — confirmed)
─────────────────────────────────────────────────────────────────
Mechanism:     Amazon tracks traffic arriving at product pages from external
               sources (social media, blogs, email, Reddit). Books driving
               external traffic are treated as having broader audience appeal
               and receive amplified organic placement.

Signal:        A click from outside Amazon is registered even without a
               purchase. Pattern of external referral clicks = "wanted beyond
               the Amazon ecosystem" signal.

URL requirement: Direct Amazon product page URL is required for the signal.
               amazon.co.uk/dp/[ASIN] or amazon.com/dp/[ASIN].
               Routing through a landing page, Linktree, or author website
               breaks the attribution chain — Amazon cannot register the
               external source.

Every organic content post that links directly to the Amazon product page
is an algorithmic action, not just a sales action.
```

---

### 6. A+ Content Indexing
**CONFIDENCE: HIGH (CVR benefit); LOW (keyword weight)**. See §14.

```
A+ CONTENT (Amazon — currently underexploited in the pipeline)
─────────────────────────────────────────────────────────────────
What it is:    A+ Content (formerly Enhanced Brand Content) is the rich-text
               section appearing on the book's product page below the description.
               KDP authors can apply for it free of charge once the book is live.

Indexing:      Amazon indexes A+ Content text — headers, bullet points, body
               text in modules are searchable. A+ Content with keyword-bearing
               headers and body text extends the book's search footprint beyond
               what the description and backend fields alone provide.

Current gap:   No BookFactory agent currently produces keyword guidance for
               A+ Content. The aplus-content-agent writes marketing modules
               without a keyword mandate — this is an untouched indexing layer.

Conversion:    A+ Content increases conversion rate by giving browsers richer
               visual context. More conversion = more rank per visitor.
               Conversion-rate lift from A+ Content is the primary documented
               benefit; the keyword indexing benefit is secondary but real.

[STATUS: A+ Content indexing — UNVERIFIED weight, CONFIRMED existence.
A+ Content conversion benefit — CONFIRMED via Amazon's own published data]
```

---

### 7. Series Page Mechanics
**CONFIDENCE: HIGH (identical name requirement — observable); MEDIUM (indexing weight)**. See §14.

```
SERIES PAGE ALGORITHM
─────────────────────────────────────────────────────────────────
Creation:      When a book is tagged to a named series in KDP, Amazon creates
               a Series Page — a distinct URL with its own search indexing.

Indexing:      The series page is indexed separately from individual book pages.
               A search for the series name can surface the series page in results.

Cross-book:    A sale or borrow on any book in the series strengthens the series-
               page signal for all other books. The "Also in this series" carousel
               is permanent, free, and appears on every book's product page once
               set up correctly.

CRITICAL RULE: The series name string must be identical character-for-character
               across all books in the series. A single variation (capitalisation,
               spacing, punctuation) creates a separate series page rather than
               linking to the existing one. This permanently breaks the cross-book
               carousel. Once broken, it cannot be fixed without unpublishing.

Keyword value: A keyword-bearing series name (e.g. "The Wychford Close Mysteries"
               rather than "The Wychford Series") extends the search footprint of
               every book in the series.
```

---

### 8. KU-Specific Signals
**CONFIDENCE: MEDIUM (borrow = rank, completion rate effect); HIGH (Countdown Deal royalty, KENPC ~250 words)**. See §14.

```
KINDLE UNLIMITED MECHANICS
─────────────────────────────────────────────────────────────────
Borrow = rank: A KU borrow counts toward BSR equivalently to a purchase.
               KU subscribers can borrow at zero marginal cost — much lower
               decision friction than a paid purchase. For a debut book in a
               KU-heavy niche, the KU subscriber pool is the primary
               rank-velocity channel at launch.

Completion rate: Amazon tracks what percentage of KU borrows result in the
               book being read to completion (KENP read approaching total KENPC).
               High completion rate = algorithm increases "Also Read" carousel
               impressions. Low completion rate = suppression in KU discovery.
               No amount of launch velocity overrides persistent low completion.

Completion rate consequence for book design: every chapter ending must either
               (a) close on a satisfying, emotionally resolved beat, OR
               (b) open a forward-pointing question or promise that pulls the
               reader into the next chapter. Chapters that summarise and end
               flatly are the completion-rate killer.

Revenue:       KU revenue comes from KENP pages read (approximately £0.004–0.005
               per page at 2025 rates — cite the current KDP-published rate,
               not this figure). Revenue per borrow is substantially lower than
               a purchase royalty. Factor this into ACOS calculations when KU
               borrows are significant.

KENPC:         Amazon normalises KENP page count to approximately 250 words per
               page. A 12,000-word guide = approximately 48 KENPC.
               A 60,000-word novel = approximately 240 KENPC.
               Actual KENPC is set by Amazon at indexing — verify in KDP reporting.
```

---

### 9. Price as a Relevance Signal
**CONFIDENCE: HIGH (Countdown Deal 70% royalty); MEDIUM (price-keyword relevance interaction)**. See §14.

```
PRICE AND ALGORITHMIC RELEVANCE
─────────────────────────────────────────────────────────────────
How it works:  Amazon's conversion data for a given keyword is aggregated across
               price points. A keyword like "comprehensive guide" or "complete
               reference" historically converts from books priced £2.99–£9.99.
               A book priced at £0.99 targeting the same keyword faces a
               credibility signal problem — the algorithm observes lower conversion
               for that price-keyword combination and downweights the book.

Implication:   Price and keyword strategy must be consistent with each other.
               A premium-positioned keyword set (authoritative, comprehensive,
               professional) should be paired with a price that matches buyer
               expectations for that positioning.

Countdown Deal: During a Kindle Countdown Deal, KDP Select maintains the 70%
               royalty rate on the promotional price (not 35%). This is confirmed
               KDP policy. Verify the current rate against the KDP pricing page
               before any deal runs — policy can change.
               [STATUS: CONFIRMED as of 2025 KDP policy]

£0.99 price:   £0.99 × 70% = £0.693, minus delivery fee ≈ £0.57 royalty per sale.
               ACOS break-even at £0.99: £0.57 ÷ £0.99 = 57.6%.
               This is far lower margin than a full-price sale. Ads during a
               £0.99 deal require bid reductions proportional to the margin change.
```

---

### 10. Category and BSR Mechanics
**CONFIDENCE: HIGH (#1 New Release badge 30-day window); MEDIUM (hourly BSR updates); LOW (category drift frequency)**. See §14.

```
BESTSELLER RANK (BSR) MECHANICS
─────────────────────────────────────────────────────────────────
Update frequency: BSR updates approximately every hour for active books.
                  For low-velocity books, updates are less frequent.

Scope:            BSR is calculated separately for: (1) the overall Kindle Store,
                  (2) each category the book is placed in. A book can have
                  a high overall BSR and a low (good) subcategory BSR simultaneously.

The subcategory is the correct target for a debut author. Overall Kindle Store
BSR under 1,000 requires the sales density of a six-figure email list or a
BookBub Featured Deal. Subcategory BSR under 100 is achievable with a
concentrated launch into the right small subcategory.

Category arbitrage: A category where the #10 book has a BSR above 50,000 means
                  fewer than ~2–5 daily sales are needed to rank in the top 10.
                  This is the low-competition entry point that provides algorithmic
                  visibility with a minimal launch.

#1 New Release badge: Amazon's "#1 New Release" flag lasts 30 days from publication.
                  Inside that window, the book competes only against other new
                  releases in the same subcategory — not against established titles.
                  Badge → impressions → clicks → conversions → rank reinforcement.

BSR DISTRIBUTION — NICHE-HEALTH VALIDATION (additive heuristic)
                  Beyond the #10-book arbitrage check above, the SHAPE of a
                  subcategory's BSR distribution is a niche-health signal. Read
                  the rank of the #1 book AND the #100 book together:

                    #1 ≈ 500 and #100 ≈ 10,000   → HEALTHY niche.
                      Real top-end demand (#1 selling well) with an accessible
                      long tail (#100 still moving units). A new entrant can rank
                      meaningfully without competing with the very top.

                    #100 > 50,000                → DEAD / THIN niche.
                      The 100th book barely sells. Demand does not extend past a
                      handful of titles. Ranking is easy but there is little
                      traffic to capture. Avoid unless a specific gap justifies it.

                    #100 < 1,000                 → HYPER-COMPETITIVE niche.
                      Even the 100th book is selling hard. Every position is
                      contested by an established, high-velocity title. A cold
                      launch will not break in without exceptional differentiation
                      and a large concentrated push.

                  These bands are directional thresholds, not Amazon-published
                  figures — treat them as a MEDIUM-confidence screening heuristic.
                  Use them alongside the #10-book arbitrage check, not instead of
                  it: arbitrage finds the easy badge; distribution health tells you
                  whether the niche is worth entering at all.

Category post-publish drift: Amazon's algorithm can re-categorise books
                  automatically based on sales data and also-bought patterns.
                  A book can end up in a category it did not choose. The post-launch
                  agent should monitor category placement and flag unexpected changes.
                  [STATUS: UNVERIFIED weight of this behaviour — community observation
                  of it occurring is consistent but frequency is unclear]
```

---

### 11. Hot New Releases Hourly Mechanic
**CONFIDENCE: MEDIUM (hourly update mechanism); LOW (UK 7am–10am peak claim)**. See §14.

```
HOT NEW RELEASES (separate from #1 New Release badge)
─────────────────────────────────────────────────────────────────
What it is:    Amazon scores recent purchases (within a rolling short window)
               against other new releases in the same subcategory. This ranking
               updates approximately hourly based on recent sales velocity.
               Unlike BSR (which can lag 24+ hours), Hot New Releases is
               near-real-time.

Effect:        A burst of 3–5 purchases in a single hour can briefly rank a book
               as a Hot New Release in a small niche subcategory. That ranking
               generates a temporary impression burst → more clicks → more sales.

Concentration: Most launch strategies think about concentration at the daily
               level. Within Day 1, concentration at the hourly level produces
               Hot New Releases ranking events. Three purchases from the same
               3-hour window outrank three purchases spread across Day 1.

UK Kindle peak: UK Kindle browsing traffic peaks in approximately 7am–10am GMT
               based on commuting and breakfast reading patterns. The optimal
               concentration window for a UK-targeted launch is within this morning
               peak. [STATUS: UNVERIFIED — community judgment call, not a published
               data source. Label as such in every MARKETING-PLAN.md.]
```

---

### 12. Free-to-Paid Transition Mechanics
**CONFIDENCE: MEDIUM** — community practitioner model; exit velocity is observable but optimal timing (T-5/T-4) is not Amazon-published. See §14.

```
FREE DAY STRATEGY (KDP Select only)
─────────────────────────────────────────────────────────────────
Amazon operates two separate BSR charts: Free and Paid.

Optimal timing: Run free days BEFORE paid launch, not on launch day.
               Free days on the paid-launch day zero out the paid BSR signal
               during the algorithmically most important 72-hour window.

Recommended pattern:
               T-5 and T-4: FREE days
               T-3: PAID LAUNCH — exit velocity from free chart carries into
                    paid BSR on launch day

Mechanism:     The download velocity during free days creates a paid-rank spike
               on Day 1 of the paid term — exactly when all promotion concentrates.
               The free-chart spike followed by the paid-launch push creates the
               maximum velocity contrast the algorithm rewards.

Three-part benefit of free days:
               (1) Free-chart velocity spike → social proof ("Amazon #1 Bestseller"
                   label applies to free chart top-rankers)
               (2) Also-Viewed graph seeding via product page visits
               (3) KU borrow signal from readers who download for free via KU
```

---

### 13. Suppression Signals (what damages rank)
**CONFIDENCE: MEDIUM (return rate, KU completion suppression); MEDIUM (keyword-CVR mismatch)**. See §14.

```
SUPPRESSION SIGNALS — things that reduce algorithmic trust
─────────────────────────────────────────────────────────────────
High return rate:      Amazon tracks how often buyers return purchased books.
                       High return rate suppresses rank because it signals the
                       book does not deliver on its listing's promise.
                       Quality is an algorithmic input, not just an ethical one.

Low KU completion:     Persistent low completion rate in the first 30 days damages
                       long-term KU visibility. The algorithm interprets it as the
                       book disappointing borrowers.

Spam keywords:         Forced keyword repetition triggers Amazon's spam detection
                       and damages ranking. Keywords must appear naturally in prose.

Wrong category:        A book placed in a misaligned category sends a confused
                       relevance signal. The algorithm's conversion data for that
                       keyword in that category will show poor performance.
                       The algorithm responds by downweighting the book for those
                       terms over time.

Keyword-CVR mismatch:  If a keyword attracts clicks that don't convert, Amazon
                       interprets it as a bad keyword match and progressively
                       depresses the book's ranking for that term — even if the
                       keyword was technically correct.
                       This is the conversion signal check gap: SEO strategy
                       must choose keywords that accurately describe what the
                       book delivers to a buyer searching that term.
                       [NEW — not previously documented in this pipeline]

Low CTR on search:     If a book appears in search results but gets a low click-
                       through rate (buyers see it and don't click), the algorithm
                       eventually stops showing it for that search term.
                       Cover quality and title strength are CTR inputs.
```

---

### 14. Confidence Classification — Full Section Map

This section provides a confidence rating for every major claim in this document. Ratings are:
- **HIGH** — backed by Amazon's own published policy or rigorous independent research (Kindlepreneur testing methodology). These claims are safe to build strategy on.
- **MEDIUM** — consistent community practitioner observation from multiple independent authors. Directionally reliable but mechanisms are inferred. Build strategy on these with awareness they could shift.
- **LOW** — limited community observation, single sources, or theoretical inference. Treat as provisional. Do not build hard strategy on these alone.

| Section | Claim | Confidence | Reasoning |
|---------|-------|-----------|-----------|
| §1 Signal Weights | Title = highest weight field | MEDIUM | No Amazon-published weight table; consistent practitioner observation across thousands of A/B tests. Kindlepreneur testing supports this ranking. |
| §1 Signal Weights | Subtitle = phrase-match territory | MEDIUM | Consistent community observation; no Amazon-published source. |
| §1 Signal Weights | Series name = HIGH weight, compounds | MEDIUM | Observable via search results — series name queries surface series pages. Weight vs. subtitle not quantified. |
| §1 Signal Weights | Backend keywords = MEDIUM weight, phrases only | HIGH | KDP policy page confirms 7 × 50 char fields. Phrase vs. single-word performance: community-derived, not Amazon-published. |
| §1 Signal Weights | Description first 200 chars = MEDIUM + Google-indexed | MEDIUM | Google indexing confirmed by SEO community observation. Amazon-side weight: practitioner model. |
| §1 Signal Weights | Look Inside = stronger than backend for same keyword | MEDIUM | Kindlepreneur research supports this directionally. No published Amazon confirmation. |
| §1 Signal Weights | A+ Content = LOW weight, currently underexploited | LOW | No Amazon-published confirmation. Community observation of indexing is present but weight is theoretical. |
| §2 Velocity | Last 24–48 hours weighted most heavily | MEDIUM | Widely observed via BSR tracking tools. Amazon has not published velocity window specifics. |
| §2 Velocity | KU borrow = rank equivalently to purchase | MEDIUM | Community consensus from KU author data analysis. Amazon has not explicitly confirmed the equivalence ratio. |
| §2 Velocity | CVR affects how broadly Amazon surfaces the book | MEDIUM | Inferred from BSR patterns at equal sales velocity. Not Amazon-published. |
| §3 Carousels | Also-Bought, Also-Read, Also-Viewed are separate systems | HIGH | Observable via Amazon product pages — three distinct sections with distinct data behaviour. |
| §3 Carousels | Also-Bought 30-day malleability window | MEDIUM | Community observation is consistent but no multiplier figure has been published. |
| §3 Carousels | Free days seed Also-Viewed graph | MEDIUM | Theoretical mechanism consistent with observable co-view behaviour. Amazon has not confirmed this specific mechanic. |
| §4 Reviews | Review recency weighting (last 30 days higher weight) | MEDIUM | Widely observed from BSR changes correlated with review timestamps. Not Amazon-published. |
| §4 Reviews | ARC stagger rule (not same-day dump) | MEDIUM | Community consensus from authors who triggered editorial review. Amazon has not published the detection threshold. |
| §4 Reviews | BookBub 50+ reviews threshold | HIGH | BookBub's own published editorial policy. |
| §4 Reviews | Kindle Daily Deal 10+ review threshold | LOW | Community consensus only. Amazon has not published the eligibility criteria. Multiple exceptions reported. |
| §5 External Traffic | Amazon Attribution tracks external clicks | HIGH | Amazon's own published feature documentation. |
| §5 External Traffic | Direct dp/[ASIN] URL required for signal | HIGH | Amazon Attribution documentation specifies URL requirements. |
| §6 A+ Content | Amazon indexes A+ Content text | MEDIUM | Community SEO observation confirms indexing. Weight compared to description: LOW confidence, no published source. |
| §6 A+ Content | A+ Content increases CVR | HIGH | Amazon's own published data on A+ Content adoption. |
| §7 Series Page | Series page indexed separately | MEDIUM | Observable via Amazon search — series page URLs appear in results. Weight vs. book page: not quantified. |
| §7 Series Page | Series name must be character-for-character identical | HIGH | Observable consequence confirmed by authors — mismatched series names create separate pages. |
| §8 KU | KU borrow counts toward BSR | MEDIUM | Widely observed from BSR tracking alongside borrow data. Amazon has not published the precise weighting. |
| §8 KU | Completion rate affects Also-Read carousel impressions | MEDIUM | Inferred from KU author KENP read patterns. Amazon has not confirmed this mechanism. |
| §8 KU | KENP rate ~£0.004–0.005/page | MEDIUM | Published by KDP annually; rate changes — verify in KDP reporting. Rate cited here is approximate 2025 figure. |
| §9 Price | Price-keyword relevance interaction (conversion data per keyword) | MEDIUM | Theoretical mechanism consistent with observed CVR patterns at different price points for same keywords. Not Amazon-published. |
| §9 Price | Countdown Deal maintains 70% royalty | HIGH | KDP Select policy, confirmed. Verify current rate on KDP pricing page before each deal. |
| §10 BSR | BSR updates approximately every hour for active books | MEDIUM | Community observation from BSR tracking tools. Amazon has not published the exact update schedule. |
| §10 BSR | #1 New Release badge lasts 30 days | HIGH | KDP documentation confirms the 30-day window. |
| §10 BSR | Category post-publish drift (Amazon re-categorises) | LOW | Community observation is present but frequency is unclear. Amazon has not documented this as a deliberate feature. |
| §11 Hot New Releases | Hourly update frequency | MEDIUM | Community observation from rank tracking. Not Amazon-published. |
| §11 Hot New Releases | UK Kindle traffic peak 7am–10am GMT | LOW | Community judgment call only. No data source has been published confirming this timing. |
| §12 Free Days | Free days BEFORE paid launch — optimal timing | MEDIUM | Community practitioner model based on exit-velocity observation. No controlled study exists. |
| §13 Suppression | High return rate suppresses rank | MEDIUM | Inferred from BSR patterns correlated with return rate data. Amazon has not confirmed the mechanism. |
| §13 Suppression | Keyword-CVR mismatch as progressive suppression | MEDIUM | Theoretical mechanism consistent with observed long-term ranking decay on mismatched keywords. Not Amazon-published. |

---

*This document was seeded with knowledge from Kindlepreneur published research, ALLi practitioner reports, KDP official policy pages, and BookFactory operational learning from launched books. Every future version is appended below. Run `update algo intelligence` to generate a new version.*

*Next scheduled update: 2026-07-03 (monthly)*

---

## v1.1 — 2026-06-03
**Updated by:** pipeline-orchestrator (Opus) — smoke test confirmed 3 real Amazon changes
**Trigger:** Smoke test 2026-06-03 — 3 confirmed policy/algorithm changes documented
**Sources consulted:** Amazon KDP policy pages (April 2026 updates), KDP Help Centre category management documentation, KDP AI content disclosure requirement, community practitioner verification of byte-limit behaviour on backend keyword fields
**Changes from v1.0:** Three additions — §15 (3-category limit official), §16 (AI content disclosure), §17 (backend keyword byte counting). CURRENT VERSION pointer updated from v1.0 to v1.1.

---

### 15. Category Limit — Official 3-Category Cap
**CONFIDENCE: HIGH** — documented Amazon KDP policy change, April 2026. Widely confirmed across KDP author community simultaneously with the policy announcement.

```
3-CATEGORY LIMIT (official Amazon policy — April 2026)
─────────────────────────────────────────────────────────────────
What changed:  Amazon officially capped all Kindle books at a maximum of 3
               browse categories. Previously, authors could request additional
               categories via KDP customer service and some books appeared in
               5–7 categories as a result of this workaround.

Current rule:  A Kindle book may appear in a maximum of 3 Amazon browse
               categories. This applies regardless of whether categories are
               set at upload or added post-publication.

The workaround: The customer service "add extra categories" workaround is
               no longer honoured. Requests for a 4th or 5th category are
               now rejected by default. This workaround was widely used in
               2022–2024 KDP strategy guides — any guide recommending it
               is now out of date.

KDP upload:    The KDP upload form presents a maximum of 2 category paths.
               The third category can be requested via KDP customer service
               immediately after upload. This remains viable (for the 3rd
               only — not a 4th or 5th).

Strategy       Category arbitrage (targeting a low-competition sub-category
implication:   for an early #1 New Release badge) remains valid — but the
               author must now choose the 3 categories with more precision.
               There is no "extra slot" buffer. Choose: (1) primary niche
               category, (2) broader reach category, (3) arbitrage pick.
               All three must be deliberate.
```

**Agent files that must incorporate this change:**
- `kdp-upload-agent.md` — enforce 3-category maximum at upload. The category selection block must never specify more than 3 categories. If a prior category list has 4+, the agent must flag and reduce to 3 before proceeding.
- `kdp-seo-agent.md` — CATEGORY-SELECTION.md output must cap at 3 entries. Add a validation check: if more than 3 categories are listed, stop and alert the Architect.
- `opus-brain-agent.md` — blueprint's TARGET CATEGORIES section already uses a 3-slot structure (Primary, Secondary, Arbitrage pick). This is now confirmed policy-correct. No change needed to the structure, but add a note in the blueprint template: "3 categories is the confirmed maximum per Amazon policy (April 2026)."

---

### 16. AI Content Disclosure — Mandatory at Upload
**CONFIDENCE: HIGH** — KDP policy change, April 2026. Amazon's own KDP Help Centre and upload interface now require this field to be completed before a book can be submitted.

```
AI CONTENT DISCLOSURE (mandatory KDP upload field — April 2026)
─────────────────────────────────────────────────────────────────
What changed:  KDP now presents a mandatory AI content disclosure questionnaire
               at the point of book upload. The author must declare whether the
               book's content — cover image, interior text, or translation —
               was AI-generated (in whole or in part).

Three fields   Amazon asks separately about:
to complete:   (1) Cover image — AI-generated? Yes / No
               (2) Interior text (manuscript) — AI-generated? Yes / No
               (3) Translation — AI-generated or AI-assisted? Yes / No

               Each field must be answered. Leaving any field blank blocks
               the upload from completing.

Definition:    Amazon defines "AI-generated" as content produced by a generative
               AI tool (image generators, text generators, translation tools).
               "AI-assisted" means a human used AI as a tool but made substantive
               creative decisions. Authors are asked to self-declare — Amazon
               does not currently verify declarations automatically.

BookFactory    All BookFactory books use AI-assisted writing (Claude drafts,
context:       human editorial decisions, research-based content). The correct
               declaration for BookFactory interior text is "AI-generated" per
               Amazon's definition (content produced by a generative AI tool).
               The Architect should confirm this interpretation before first use.

               Cover images generated by Midjourney, Firefly, or similar =
               "AI-generated cover" = Yes.

               Covers designed by a human using stock photography = No.

Retroactive    Books uploaded BEFORE April 2026 did not complete this field.
flag:          Amazon has not yet mandated retroactive disclosure for existing
               books, but this situation may change. All pre-April 2026
               BookFactory titles should be reviewed for retroactive compliance
               when the policy evolves.
               [STATUS: Retroactive enforcement — UNVERIFIED. Monitor KDP
               announcements quarterly.]

Suppression    No confirmed suppression of books based on AI disclosure status.
risk:          Amazon has stated the disclosure is for transparency, not for
               ranking or discoverability filtering. However, this may change.
               [STATUS: Ranking/suppression consequence — UNVERIFIED.
               Monitor community reports.]
```

**Agent files that must incorporate this change:**
- `kdp-upload-agent.md` — the upload checklist must include the AI content disclosure field as a mandatory step. The agent must NEVER complete a KDP upload without explicitly completing this field. Add as a hard gate: "Step X — AI Content Disclosure: answer all three sub-fields (cover, interior, translation) before clicking Submit."
- The prior confirmed failure mode (kdp-upload-agent published without approval, wrong categories) is documented in `KDP-UPLOAD-FAILURES.md`. The AI disclosure field is a new mandatory gate in the same category — failure to complete it blocks the upload entirely.

---

### 17. Backend Keyword Fields — Byte Count, Not Character Count
**CONFIDENCE: HIGH** — confirmed from practitioner testing of the KDP backend interface and from community-wide reports of keyword strings being rejected or truncated. The 50-byte limit (not 50-character) is the actual constraint enforced by Amazon's upload system.

```
BACKEND KEYWORD BYTE LIMIT (confirmed — replaces prior character-count assumption)
─────────────────────────────────────────────────────────────────────────────────
What changed:  v1.0 (§1) described the 7 backend keyword fields as "7 fields ×
               50 characters = 350 characters." This was the community's working
               model. The confirmed reality is: each field is 50 BYTES, not 50
               characters.

Why it        ASCII characters (a–z, 0–9, space, hyphen) = 1 byte each.
matters:       Non-ASCII characters = 2+ bytes each:
                 Em dash (—)     = 3 bytes (UTF-8)
                 Smart quotes (" ") = 3 bytes each (UTF-8)
                 Accented characters (é, ö, ñ) = 2 bytes each (UTF-8)

               A 50-character keyword string containing one em dash is already
               52 bytes — it will be truncated by Amazon's system. The truncation
               happens silently: the keyword appears to save but is cut at the
               byte boundary, potentially mid-phrase.

Practical      For BookFactory books targeting UK readers, the most common
impact:        non-ASCII risk characters are:
                 - Em dash in keyword phrases (e.g. "gut health—microbiome reset")
                 - Smart quotes if a phrase is copy-pasted from a Word document
                 - Apostrophes in the "smart" form (') vs ASCII (')

Correct        1. Build keyword phrases using only ASCII characters.
approach:      2. Replace em dashes with hyphens: "gut health-microbiome reset"
               3. Replace smart quotes with straight quotes if quotes are needed
               4. Before finalising each keyword field, count bytes:
                  In Python: len("your phrase".encode('utf-8'))
                  Target: ≤ 50 bytes per field.
               5. Never count by character — always count by byte.

The 7-field    7 fields × 50 bytes = 350 bytes maximum total.
total:         If all 7 fields use ASCII only, 350 bytes = 350 characters.
               But any non-ASCII character reduces the usable character count
               in that field below 50.

Calibration    Run this check on every keyword set before upload:
command:       python -c "phrases=['phrase1','phrase2','phrase3','phrase4',
               'phrase5','phrase6','phrase7']; [print(f'{len(p.encode())}/50 bytes: {p}')
               for p in phrases]"
               (Replace with uv run --python 3.12 --no-project -c "..." on this machine)
```

**Agent files that must incorporate this change:**
- `kdp-seo-agent.md` — the keyword output section must include a byte-count validation step. Before delivering the 7 keyword fields, count bytes for each. If any field exceeds 50 bytes, flag it and propose a trimmed alternative.
- `kdp-upload-agent.md` — at the point of entering backend keywords, the agent must note: "Backend keyword fields are byte-limited to 50 bytes per field. ASCII-only phrases are safest. Em dashes and smart quotes reduce available space."
- `CATEGORY-SELECTION.md` template — add a note wherever keyword fields are specified: "Byte count: [N]/50 bytes" for each field.

---

### v1.1 Confidence Classification Additions

| Section | Claim | Confidence | Reasoning |
|---------|-------|-----------|-----------|
| §15 Category limit | 3-category cap is now official Amazon policy | HIGH | Amazon KDP policy page updated April 2026. Community-wide simultaneous confirmation. The customer service workaround is confirmed rejected. |
| §15 Category limit | 3rd category still requestable via customer service | HIGH | Widely confirmed by authors post-April 2026 — the form allows 2 at upload; CS adds the 3rd. Stable pattern. |
| §16 AI disclosure | Mandatory field at KDP upload | HIGH | KDP upload interface enforces this field — upload cannot complete without it. Amazon's own Help Centre documents it. |
| §16 AI disclosure | AI disclosure affects discoverability/ranking | UNVERIFIED | Amazon states it does not. No community evidence of suppression yet. Monitor. |
| §16 AI disclosure | Retroactive disclosure will be enforced | UNVERIFIED | No Amazon announcement as of June 2026. Treat as a risk to monitor quarterly. |
| §17 Byte limit | Backend keyword fields are 50 bytes, not 50 characters | HIGH | Reproducible: practitioner testing confirms truncation at byte boundaries. Widely reported across KDP community simultaneously. |
| §17 Byte limit | Em dash = 3 bytes in UTF-8 | HIGH | Unicode standard. Verified in Python: `len('—'.encode('utf-8'))` = 3. |
| §10 BSR distribution | Niche-health bands (#1≈500/#100≈10k healthy; #100>50k dead; #100<1k hyper-competitive) | MEDIUM | Directional screening heuristic from practitioner observation of subcategory BSR shape. Not Amazon-published. Use as a screen, not a hard rule. |

---

## v1.2 — 2026-06-12
**Updated by:** algo-intelligence-agent (run by master orchestrator, Fable 5)
**Trigger:** Architect directive — "expert understanding of the Amazon algorithm; every book data-driven from launch."
**Sources consulted this session (WebSearch, 2026-06-12):** Kindlepreneur (keyword rules, 7-keyword tactic, category selection), manuscriptreport.com (KDP category selection 2026), and 2026 practitioner write-ups (Medium/Neil Caley A10 survival guide, sfshaw.com A10 2026 series, vappingo A10 listing standards, Hidden Gems A10 optimization) on the A10/semantic shift; KU/KENP read-through guides (hmdpublishing, scribecount).
**Changes from prior version:** Adds the 2026 semantic/intent + AI-assistant (Rufus / GSO) layer as a NEW mechanic; CONFIRMS and refines the lean-keyword and 3-category rules; promotes read-through to a first-class ranking signal. No prior claim CONTRADICTED.

### SIGNAL VERIFICATION TABLE — 2026-06-12
```
Claim                                              | Status     | Confidence | Source
---------------------------------------------------|------------|------------|---------------------------
Title = highest-weight keyword field               | CONFIRMED  | MEDIUM     | Kindlepreneur (carried v1.0)
Keyword-stuffed titles now risk SUPPRESSION        | NEW        | LOW-MED    | vappingo/sfshaw 2026 (blog)
Backend keywords: do NOT repeat title words         | UPDATED    | MEDIUM     | Kindlepreneur keyword rules
3-category cap + auto-recategorization on mismatch  | CONFIRMED  | MEDIUM     | manuscriptreport/Kindlepreneur
Semantic/intent ranking via "Rufus" AI (GSO)        | NEW        | LOW        | 2026 practitioner blogs only
Read-through / completion rate is a ranking signal  | UPDATED    | LOW-MED    | KU/KENP guides 2026
Organic sales velocity + external traffic dominate  | CONFIRMED  | MEDIUM     | carried v1.0, re-affirmed 2026
```
Legend: CONFIRMED = a source this session supports it · UPDATED = refined · NEW = not in prior version · CONTRADICTED = none this session.

### NEW — Semantic / Intent Layer (the 2026 A10 + Rufus shift)
**CONFIDENCE: LOW** (community/blog-reported 2026; NOT an Amazon-published specification — treat as a working hypothesis, not a hard rule).

Multiple 2026 practitioner sources report that discovery is moving from literal keyword-matching toward **semantic relevance** — does the book genuinely match the *intent* behind a search — and that Amazon's "Rufus" AI assistant increasingly surfaces titles by interpreting reader intent ("Generative Search Optimization" / GSO). If accurate, the strategic consequences are:

- **Metadata must express real reader intent, and the book must actually deliver it.** Mismatched metadata (keywords the content does not earn) is reported to be penalised, and Amazon may auto-move a book out of a category whose intent its metadata/keywords do not match.
- **Clean, human-readable titles beat keyword lists.** A title that reads like a search-term dump is reported to lose visibility. One strong key phrase in a natural title > five stuffed ones.
- **The blurb/description carries semantic weight,** not just the first 200 indexed characters — copy that names the reader's real problem in their language helps an intent engine match it. (This is exactly what `conversion-copywriter-agent` is built to produce.)

**How to use this without over-trusting it:** because confidence is LOW, do not abandon the verified phrase-match fundamentals (§1, § title/subtitle/series). Layer intent on top: pick ONE genuine key phrase per slot, write naturally, and let `calibration_engine.py` measure whether intent-led listings actually out-rank keyword-led ones once real launch data exists. Do not assert a GSO advantage as fact until our own data shows it.

### UPDATED — Lean Backend Keywords
Refines v1.0/v1.1: the 7 backend fields (≤50 chars each) remain phrase-match space, but **do not repeat words already in the title/subtitle** — those are already indexed, so repeating them wastes the slot. Fill slots with *additional* long-tail intent phrases a buyer actually types. (Source: Kindlepreneur keyword rules, 2026.) This reinforces the existing 50-BYTE discipline in the SEO agent — byte-count still governs; non-repetition is the new refinement.

### CONFIRMED — 3-Category Cap + Auto-Recategorization
The 3-category limit (already locked in this pipeline since April 2026) is re-confirmed for 2026, with an added mechanic: **if a book's metadata/keywords do not match the category, Amazon's system can move it to a different category automatically.** Strategic implication: category choice and keyword/blurb intent must agree. Slot 1 should be the best-fit, most-winnable specific sub-category (e.g. a specific condition, not "Health" broadly). (Source: manuscriptreport / Kindlepreneur 2026.)

### UPDATED — Read-Through / Completion as a Ranking Signal
KU/KENP guides report that **completion and read-through influence both earnings and momentum**, and that completion rates vary by genre (fiction generally completes higher than non-fiction). KENP per-page payout is monthly-variable — never quote a fixed rate; read the live figure from the KDP dashboard and log it via `calibration_engine.py`. Strategic implication for this pipeline's non-fiction: front-load value, keep chapters tight, and sustain read-through — which the existing `hook-optimizer-agent` and `review-bait-optimizer` already target. Page-one retention is a momentum lever, not just an earnings one.

### DATA-DRIVEN LAUNCH POSTURE (how "good BSR from launch" is actually pursued — honestly)
There is **no guaranteed-BSR move**; any agent claiming one violates the No-Assumptions lock. What the evidence supports is stacking the known momentum levers and then *measuring*:
1. **Sales/borrow velocity in the launch window** (organic + external traffic) — the most-cited ranking driver.
2. **Category fit** — win a specific, winnable sub-category for the badge, not a broad one.
3. **Review velocity** — staggered, honest, ARC-seeded (compliant), never bought.
4. **Read-through** — front-loaded value sustains rank after the launch spike.
5. **Intent-matched metadata + blurb** — so the semantic layer (if real) works *for* the book.

Every launch logs its prediction (`calibration_engine.py add-prediction`) and its real outcome (`add-observation`); the `accuracy` command then grades how well these levers predicted reality, and the model improves. We pursue good BSR by stacking levers and learning from data — not by guessing a number.

### Verified vs. Unverified (this version)
- **MEDIUM confidence (practitioner-verified, carried + re-affirmed):** title/subtitle/series weighting, phrase-match backend keywords, 3-category cap, velocity + external traffic dominance, no-keyword-repeat.
- **LOW confidence (2026 blog/community, not Amazon-published — working hypotheses):** Rufus/GSO semantic ranking, title-stuffing suppression, completion-rate weighting. Carry as provisional; let pipeline data confirm or refute before any agent builds hard strategy on them alone.
