# Marketing Plan — The 7-Day Gut Reset
## pipeline-orchestrator | 2026-05-24 | Algorithm-First Rebuild (5-Day Runway)

**Data sources:** MARKET-INTELLIGENCE.md (2026-05-13) | KDP-LISTING.md (2026-05-23) | pipeline-state.json (2026-05-23) | marketing-agent spec (2026-05-23) | KDP rate card | AGENT-RULES.md Rule 1 | ALGO-INTELLIGENCE.md v1.2 (2026-06-12, reconciled 2026-06-13)

---

## STAGE 07 — ALGO-INTELLIGENCE v1.2 RECONCILIATION (marketing-agent, 2026-06-13)

This plan was built on marketing-agent Section 0 (KDP Algorithm Mastery). Re-checked against **ALGO-INTELLIGENCE.md v1.2 (2026-06-12)**. No prior claim is contradicted; these v1.2 refinements are layered on:

1. **Semantic / intent layer (v1.2, LOW confidence — working hypothesis).** Discovery is reported to be shifting toward intent-matching (A10 + "Rufus"/GSO). Already satisfied: the placed blurb (CONVERSION-COPY.md Variant A) names the reader's real problem in their language, and the metadata intent (find-your-trigger, diagnostic-first) genuinely matches what the book delivers. Do NOT assert a GSO ranking advantage as fact — let calibration_engine.py confirm or refute on real data.
2. **Lean backend keywords (v1.2, UPDATED).** The 7 keywords (KDP-LISTING.md §3) already avoid repeating title/subtitle words — confirmed. All 7 are ASCII, so character count = byte count, all ≤50 bytes.
3. **3-category cap + auto-recategorization (v1.2, CONFIRMED).** Category 1 (Abdominal Disorders) is the specific, winnable sub-category; category/keyword/blurb intent agree, which is what prevents auto-recategorization. Optional 3rd slot (Stress Management) is earned by Day 5 vagal-tone content. Hold at the max of 3.
4. **Read-through / completion (v1.2, UPDATED, LOW-MED).** Front-loaded value + tight chapters + per-chapter hooks (hook-optimizer applied 5 rewrites) support completion. KENP per-page payout is monthly-variable — never quote a fixed rate; read the live KDP figure and log via calibration_engine.py.
5. **Data-driven launch posture (v1.2).** No guaranteed-BSR move exists. Stack the levers (velocity + external traffic, winnable sub-category, staggered honest reviews, read-through, intent-matched metadata) and measure. Unsourced numbers already read "We need real data for this before making a recommendation." No change required.

---

## SITUATION BRIEF

```
REAL CONSTRAINTS — stated once, then the plan moves on
────────────────────────────────────────────────────────
Today:               2026-05-24 (Saturday)
Free days:           May 27–28 (locked in pipeline-state.json — not negotiable)
Paid launch:         May 29 (5 days from today)
Current reviews:     0
ARC readers:         0 confirmed, 0 copies sent
Platform:            none (no email list, no social following)
Promo sites:         not booked (May 27–28 spots likely sold out for Tier 1)
T-14 milestones:     all missed (A+ Content, #1 NR BSR check)
T-42 milestones:     all missed (Goodreads warmup, ARC recruitment)
KDP upload:          not yet done — MUST happen today (24–72hr review time)

WHAT THIS MEANS: the ARC-first, review-stagger-5/5/5 strategy is dead.
0 ARC readers cannot produce 15 reviews across Days 1–3.
This plan does not mourn that. It builds from what IS available.

WHAT IS AVAILABLE:
  ✓ Perfect metadata already set (KDP-LISTING.md — categories, keywords)
  ✓ KDP Select + 2 free days (May 27–28) locked
  ✓ A strong cover and description already written
  ✓ In-book review triggers already live (Days 2, 5, 7 of the protocol)
  ✓ Back-matter review CTA already live
  ✓ Also-bought seeding via publisher account (10-minute action)
  ✓ Auto Sponsored Products at £1–2/day once gate opens — algorithm-teaching signal
  ✓ Countdown Deal at Day 30 — second engineered rank spike
  ✓ KU borrow pool — zero-friction audience that scales with rank

STRATEGY PIVOT:
  The algorithm does all the work. The user's job is to set the inputs
  correctly, then get out of the way and let it run.

AD GATE STATUS:      CLOSED (book not yet live)
PHASE:               Phase 0 — 5-day pre-launch sprint
SINGLE BIGGEST BLOCKER:
  KDP upload has not happened. Everything else is blocked until
  the EPUB is submitted and the 24–72hr review window clears.
```

---

## SECTION 0 — THE ALGORITHM-FIRST ENGINE

*Updated 2026-05-24 with full zero-spend algorithmic intelligence layer (marketing-agent 0.10–0.20).*

### Why this works without a platform

The Amazon algorithm does not care whether the author has an email list. It cares about signals: how many people bought in a compressed window, what their purchase histories look like, whether buyers convert into readers who come back, whether external sources send traffic to the product page, and whether KU readers complete the book. Free days + KU borrows + correct also-bought seeding + low-friction ad signal after the gate opens = the full engine. No platform required.

The sequence:

```
May 27–28:  Free days → three algorithmic events simultaneously:
            (1) Free-chart velocity spike → ranks on free chart →
                "Amazon #1 Bestseller" social proof in free subcategory
            (2) Also Viewed seeding → every page visit from a reader who
                has recently browsed competitor listings seeds the
                also-viewed connection between this book and those titles
                — a purchase is not required, a page visit is enough
            (3) KU borrow signal → readers who download via KU and open
                the book begin seeding the "Also Read" carousel under
                competitor listings they have previously borrowed

May 29:     Paid launch → exit velocity from free chart carries into
            paid BSR on launch day
            → #1 New Release window opens in Abdominal Disorders
            → CONCENTRATION ACTION: any owned-channel push must be
              directed into the 7am–10am GMT window on May 29 (the UK
              Kindle browsing peak, per community-observed patterns —
              not a cited data source). Three purchases in one hour
              in a small subcategory produce a Hot New Releases ranking
              event; the same three purchases spread across May 29
              produce no hourly event.

Days 1–14:  KU borrows accumulate → rank fuel AND completion-rate signal
            → KU readers who complete the book increase the completion-
              rate ratio → algorithm increases "Also Read" impressions
            → organic review triggers (Days 2, 5, 7 in-book)
            → back-matter CTA working for every reader
            → external traffic attribution: every REACH-PLAN.md post
              linking directly to amazon.co.uk/dp/[ASIN] generates an
              external-referral click registered by Amazon Attribution

Day 14–21:  BSR + review gate check
            → if Condition A met: Auto SP at £1–2/day — NOT a money play.
              This is the cheapest way to tell Amazon's algorithm what
              the book is about. £1–2/day costs £30–60/month and is
              essentially paying Amazon to categorise the book correctly.

Day 30:     Countdown Deal → second engineered rank spike
            → Countdown preserves 70% royalty at all price tiers
              (source: KDP rate card)
            → at 10+ reviews / 4.0+ avg: enters Kindle Daily Deal pool
              — Amazon may select the book for a KDD promotional email
              at any point from here forward (zero-spend, platform-driven)
```

### ZERO-SPEND ALGORITHMIC ACTIONS — Status for The 7-Day Gut Reset

```
□ KU COMPLETION ARCHITECTURE CHECK (0.10)
  ─────────────────────────────────────────
  Status: REQUIRED BEFORE LAUNCH

  Chapter ending audit — last paragraph of each chapter:

  Introduction: "Let's start with Day 1. Before anything else, here is
  what you're going to track tonight." → PASS — forward-pointing, pulls
  directly into Day 1 with a specific next action.

  Day 1: "Tonight, just collect the data. The most useful thing you'll
  do all week happens in the next 24 hours — and it doesn't require
  changing a single thing about your day." → PASS — satisfying close +
  implicit forward tension (data to be read tomorrow).

  Day 2 through Day 7: NOT YET AUDITED — agent must read the final
  paragraph of each remaining chapter before launch and apply the same
  pass/flag standard. If any chapter ends with a summary that does not
  either (a) close on a satisfying beat or (b) pull forward into the
  next chapter, flag to hook-optimizer-agent for a single-sentence fix.

  ACTION REQUIRED: pipeline-orchestrator to run chapter-ending audit
  on Days 2–7 before May 29 upload.

□ ALSO READ SEEDING — DISTINCT FROM ALSO BOUGHT (0.11)
  ─────────────────────────────────────────────
  Status: ACTION REQUIRED BEFORE LAUNCH

  The "Readers also enjoyed" carousel is built from co-READING patterns
  (KU borrows + completion overlap), not co-purchase patterns. These are
  separate algorithms. This book can appear in both simultaneously.

  Seeding action: from the publisher Amazon account, KU-borrow (or
  purchase) the 5 competitor titles listed in Section 4 before the book
  goes live. When this book goes live, borrow it from the same account.
  The account's co-reading history seeds the "Also Read" connection
  between this book and those titles.

  Target titles for Also Read seeding (same as also-bought seed list):
  - Gut Fix (B0C888GXWL)
  - Gut Health and Mental Clarity (B0FYJHG4MP)
  - Super Gut (B09FDDVJQD)
  - Gut Health for Beginners (B0DYJHFHQ1)
  - The 4-Week Gut Health Protocol for Beginners (B0C91NC6MS)

  KU readers who borrow this book AND have borrowing histories overlapping
  these titles will compound the signal automatically over time.

□ LAUNCH DAY CONCENTRATION WINDOW (0.12)
  ─────────────────────────────────────────
  Status: DEFINED

  Recommended 3-hour window: 7am–10am GMT on May 29, 2026.

  Rationale: UK Kindle browsing traffic peaks in the morning commute and
  breakfast window. This is based on observed patterns in the UK KDP author
  community, not a published data source — it is a judgment call and is
  labelled as such.

  Operational instruction: any owned-channel push on May 29 (social post,
  Reddit comment, community share) must go live between 7am and 10am GMT.
  Do not spread activity across the day. Three purchases in a 1-hour window
  in the Abdominal Disorders subcategory can trigger a Hot New Releases
  hourly ranking event. The same three purchases spread across 12 hours
  produce no such event.

  Since no email list or social following exists for this launch, the
  7am–10am window applies to: any personal contacts being asked to buy,
  any Reddit/community posts scheduled for May 29, any links shared in
  niche groups on launch day.

□ REACH-PLAN.md LINK AUDIT (0.13)
  ─────────────────────────────────────────
  Status: ACTION REQUIRED

  Every post in REACH-PLAN.md must link directly to:
  - UK: amazon.co.uk/dp/[ASIN] (substitute live ASIN post-upload)
  - US: amazon.com/dp/[ASIN]

  Not to: linktree, author website, a landing page, or any intermediate URL.
  The direct Amazon link is what Amazon Attribution registers as external
  traffic. An intermediate URL breaks the attribution chain.

  Each Reddit post, Pinterest pin, community comment, and email in the
  REACH-PLAN.md generates an external-referral click registered by Amazon
  even if no purchase follows. These clicks are algorithmic signals, not
  just sales opportunities.

  The REACH-PLAN.md must be audited post-ASIN generation to replace any
  placeholder URLs with the direct amazon.co.uk/dp/[ASIN] link before
  any posts go live.

□ FREE DAYS AS "ALSO VIEWED" SEEDING (0.14)
  ─────────────────────────────────────────
  Status: NOTED — no action required, automatic benefit

  The May 27–28 free days produce three simultaneous algorithmic events:
  (1) Free-chart velocity spike (standard free-days benefit)
  (2) Also Viewed graph seeding: every reader who visits the product page
      and has recently viewed competitor listings seeds the also-viewed
      connection between this book and those competitors. A download is not
      required — a page visit is enough.
  (3) KU borrow: readers who download via KU open the also-read seeding
      window described in 0.11.

  The also-viewed benefit is automatic. It requires no additional action —
  it is a built-in benefit of driving page traffic during free days.

□ SERIES TAG VERIFICATION (0.15)
  ─────────────────────────────────────────
  Status: MANDATORY PRE-PUBLISH ACTION

  Per KDP-LISTING.md Section 2: this book is "Fix Your Gut for Good —
  Book 2." The series name used in this book's KDP upload MUST match the
  exact series name used for Fix Your Gut for Good — character-for-character,
  including capitalisation and spacing.

  Action required at KDP upload (publisher-agent):
  1. Read the series name exactly as it appears in the Fix Your Gut for
     Good KDP metadata (Author Central → Your Books → Series).
  2. Enter the identical string in this book's Series Name field.
  3. Set Series Position to 2.

  A mismatched series name creates a separate series page rather than
  linking to the existing Fix Your Gut for Good series page. This breaks
  the "Also in this series" carousel on both books permanently and cannot
  be fixed without an unpublish/re-upload cycle.

  THIS IS A HARD GATE: do not submit the KDP upload until the series name
  is confirmed against the existing book's metadata.

□ LOOK INSIDE KEYWORD CHECK (0.16)
  ─────────────────────────────────────────
  Status: PARTIAL PASS / ONE FLAG

  Primary search terms checked against introduction + Day 1 opening
  (the first ~10% of the book's content):

  "gut reset" — FLAG: the phrase "gut reset" does not appear in the
  introduction or Day 1. The title is not restated in the body text.
  The algorithm reads the Look Inside for natural-language keyword
  occurrence. "Gut reset" as a keyword phrase is absent from the
  content Amazon will scan. This weakens the content-level indexing
  for the primary backend keyword "gut health reset" and for the title
  phrase itself.

  RECOMMENDED FIX: add one natural-language occurrence of "gut reset"
  in the introduction or the Day 1 chapter. Example placement: in the
  existing paragraph explaining the 7-day framework — "What you're
  starting today is a structured gut reset: not a permanent restriction,
  but a seven-day window designed to..." — a single natural sentence.
  Do not force it; find the sentence where it reads as a real word choice.

  "gut health" — FLAG: "gut health" as a phrase does not appear in the
  introduction. "Gut" appears frequently; "gut health book" appears once
  ("Every gut health book you've ever read"). The phrase "gut health" in
  its standalone form (as a search term) is present but not prominent.
  Not a critical flag — borderline. Monitor.

  "digestive health" — NOT PRESENT in introduction or Day 1. The word
  "digestive" appears ("digestive system"). The compound phrase
  "digestive health" does not. Lower priority than "gut reset" since
  "digestive health" is the secondary category keyword, not the primary.

  "7-day" / "seven-day" — PASS: "seven days," "seven-day framework,"
  "seven-day window" all appear naturally in the introduction.

  "gut" — PASS: appears throughout in natural prose.

  "digestive" — PASS: "digestive system" appears in introduction.

  "trigger" — STRONG PASS: "trigger profiles," "trigger log," "gut
  trigger" all appear naturally and prominently in introduction and Day 1.

  "diagnostic" / "diagnose" — PASS: "diagnostic" appears in Day 1.

  "bloating" / "bloated" — PASS: "bloated" in introduction; "bloating"
  in Day 1. Reader language present.

  "IBS" — PASS: appears in Day 1.

  SUMMARY: One critical gap ("gut reset" absent from Look Inside), one
  borderline gap ("gut health" present but not prominent). The critical
  gap should be fixed before upload — a single sentence. The borderline
  gap is acceptable given "gut" and reader-language terms are well-covered.

□ DESCRIPTION KEYWORD HIERARCHY (0.17)
  ─────────────────────────────────────────
  Status: FLAG — description opening does not lead with primary keyword

  The KDP-LISTING.md description opens:
  H2 headline: "You followed the protocol. It still didn't work. Here's why."
  First body sentence: "You cut out gluten. You took the probiotic..."

  The primary keyword phrase "7-Day Gut Reset" does not appear until the
  fourth paragraph: "<p><b>The 7-Day Gut Reset</b> is built the opposite
  way.</p>"

  Google and Amazon's search algorithm both weight the first 200 characters
  of the body description most heavily. The current description wastes those
  200 characters on atmospheric hook language with no keyword signal.

  RECOMMENDED FIX: restructure the description so the first sentence of the
  body (after the H2 headline) contains the primary keyword phrase. One approach:
  "The 7-Day Gut Reset is the first gut health guide built around your specific
  trigger — not a generic protocol that assumes every gut problem has the same cause."

  This preserves the hook intent (personalisation, anti-generic-advice) while
  placing the primary keyword phrase in the first sentence, within the first
  200 characters of the body text.

  Secondary keywords ("gut health," "trigger," "digestive") can be woven
  naturally into the next two sentences before the emotional hook begins.

  This is a pre-launch action. The description should be updated in KDP before
  or at the time of upload — it takes 24–48 hours for description changes to
  propagate, so it must be submitted at the same time as the manuscript.

□ KINDLE DAILY DEAL POOL STATUS (0.18)
  ─────────────────────────────────────────
  Status: NOT YET ELIGIBLE (book not yet live)

  This KDP Select book enters the Kindle Daily Deal candidate pool when
  it reaches 10+ reviews at 4.0+ average. Amazon may then select it for
  a Kindle Daily Deal promotional email at any point — an event the author
  cannot control or predict, but can position for by:
  (a) maintaining KDP Select enrolment
  (b) holding the review base at 4.0+ through quality and honest reviews
  (c) keeping the price at a level that allows meaningful discounting
      (£2.99 → £0.99 is a plausible KDD deal structure)

  The review gate at 10+ / 4.0+ opens two simultaneous opportunities:
  (1) The master ad gate (Rung 1 Auto SP at full data-gathering budget)
  (2) The Kindle Daily Deal candidate pool (platform-driven, zero-spend)

  Current status: 0 reviews. Gate expected to open ~Day 45 with zero-ARC
  organic accumulation (per Section 10 review velocity model).

□ UK + US SIMULTANEOUS PUBLISH CONFIRMED (0.19)
  ─────────────────────────────────────────
  Status: ACTION REQUIRED AT KDP UPLOAD

  KDP default is worldwide publication. Publisher-agent must:
  (1) Confirm "worldwide rights" is selected, NOT "UK only" or any
      single-territory restriction.
  (2) Set USD price explicitly: $3.99 (per KDP-LISTING.md pricing).
      Do not use KDP auto-conversion — it produces non-round pricing.
  (3) Confirm the ASIN is accessible at both amazon.co.uk and amazon.com.

  US purchases add to the global also-bought graph, which feeds UK
  recommendations. Any REACH-PLAN.md content targeting a US audience
  should link to amazon.com/dp/[ASIN].

□ ALSO-BOUGHT SEEDING DEADLINE (0.20)
  ─────────────────────────────────────────
  Status: TIME-LOCKED — must happen before or on May 29 Day 1

  The also-bought graph is most malleable in the first 30 days. Each
  purchase in the first 30 days carries outsized influence on the connections
  being formed. The window progressively closes.

  The 5 publisher-account seed title purchases (Section 4 ASINs) must be
  completed before the book goes live on May 29. Completing them on May 28
  (free day 2) is optimal — the account's co-purchase history is established
  before the paid launch begins.

  CONSEQUENCE STATEMENT: seeding after Day 7 is significantly less effective.
  Seeding after Day 30 may not meaningfully alter an established wrong cluster.
  This action cannot be deferred. It takes 10 minutes. It is the highest-
  leverage timing window in the entire 90-day launch plan.

  ALSO-BOUGHT SEEDING DEADLINE: May 28, 2026 (the day before paid launch).
```

---

## SECTION 1 — KDP SELECT: ENROLLED (CONFIRMED)

Already in pipeline-state.json. No decision needed. The engine depends on it.

Trade-off acknowledged: no Kobo, Apple Books, Google Play, or any other ebook retailer for the 90-day term. Paperback exempt. Revisit at Day 90 on actual term performance.

---

## SECTION 2 — PRE-LAUNCH ARC PLAN: REVISED TO ZERO-ARC REALITY

The 5/5/5 review stagger is not possible. 0 ARC readers = 0 launch-day reviews from this source.

**What this means operationally:**
- The ad gate (10+ reviews, 4.0+ avg) will not open in Week 1.
- The ad gate will likely not open in Week 2.
- Reviews come from organic readers via in-book triggers and back-matter CTA.
- The launch plan does NOT depend on reviews being live at Day 1.

**Adjusted review-velocity model:**
- Day 7: 0–2 reviews (organic, if any reader finishes and responds to in-book trigger)
- Day 14: 1–5 reviews realistic
- Day 30: 5–10 reviews realistic (organic accumulation via KU readers + back-matter CTA)
- Day 45: 10–15 reviews — **this is when the ad gate is realistically likely to open**
- Day 90: 25–40 reviews

These are honest ranges, not invented numbers. No ARC cohort = slower review accumulation. The plan accounts for this by keeping the ad budget tiny until reviews arrive, and sequencing the Countdown Deal to land around the time the review base is forming.

**Future books:** ARC recruitment is mandatory 42+ days pre-launch. This launch is the proof-of-case that the algorithm-first engine works without it. If it does, good. If it doesn't, the lesson is: build the ARC cohort for Book 3 starting the day Book 2 uploads.

---

## SECTION 3 — FREE DAYS SCHEDULE (LOCKED)

```
KDP SELECT FREE DAYS — TERM ALLOCATION
────────────────────────────────────────────────────────
May 25–26 (TODAY / TOMORROW):   KDP upload + review period
May 27 (FREE DAY 1):            FREE — free-chart velocity event
May 28 (FREE DAY 2):            FREE — free-chart velocity event
May 29 (PAID LAUNCH — T+0):     £2.99 — exit velocity from free → paid
                                 This is Day 1 of the paid term.
Days 30–90:                     £2.99 stable until Countdown

Free days used in launch window: 2 of 5
Free days reserved:              3 — hold for Day 60–75 re-spike if BSR stalls
```

**Why this sequencing matters:** free days on paid-launch day zero out the paid BSR signal during the algorithmically most important 72-hour window. Free days running May 27–28 with paid launch May 29 convert the free-chart velocity spike into a paid-rank spike that lands on Day 1 of the paid term (per marketing-agent Section 0.6).

**Promo sites:** Tier 1 sites (Freebooksy, EReader News Today) are likely sold out for May 27–28. Do not chase them. The free-chart algorithm signal works without promo sites — it's slower, but the free list in gut health / abdominal disorders is not deep. A book with a good cover and description will surface organically in the free new-releases list. Spending time chasing sold-out promo sites is a worse use of the next 3 days than completing the upload and seeding tasks below.

---

## SECTION 4 — ALSO-BOUGHT SEEDING (SIMPLIFIED — ONE ACTION)

The three-source seeding plan (publisher account + ARC readers + community traffic) is simplified to one action since 0 ARC readers are confirmed and no community platform exists.

**THE ONE ACTION (do this before May 27):**

From the Amazon account linked to the KDP publishing account, purchase or KU-borrow these 5 titles:

| # | Title | ASIN | Cost |
|---|---|---|---|
| 1 | Gut Fix | B0C888GXWL | KU borrow if enrolled, else ~£0 |
| 2 | Gut Health and Mental Clarity | B0FYJHG4MP | KU borrow if enrolled |
| 3 | Super Gut (William Davis) | B09FDDVJQD | ~£9.99 if not KU |
| 4 | Gut Health for Beginners | B0DYJHFHQ1 | KU borrow if enrolled |
| 5 | The 4-Week Gut Health Protocol for Beginners | B0C91NC6MS | ~£13.99 if not KU |

Source: MARKET-INTELLIGENCE.md Section 10 + harvested.json.

Open each one after downloading. The publisher account's co-purchase activity pre-seeds Amazon's also-bought graph before the book goes live.

**Why this works without ARC readers:** the publisher account pre-seeding is Source 1 in the original three-source plan. It is the only source the user controls directly. It takes 10 minutes. The ARC-reader source (Source 2) is gone; the community-traffic source (Source 3) is zero since there is no platform. Source 1 alone is better than nothing, and it is available.

**Verification action (Day 3 of paid term, evening):** check the live "Also Bought" carousel on the product page. Right cluster (gut health, IBS, digestion books appearing) = seeding worked. Wrong cluster (cookbooks, general wellness) = push additional traffic from Reddit gut health communities with targeted posts in the first 72 hours to overwrite the wrong-cluster signal.

---

## SECTION 5 — CATEGORY AND KEYWORD VALIDATION

### Primary — Abdominal Disorders

```
Path: Kindle Store > Kindle eBooks > Health, Family & Lifestyle >
      Diseases & Physical Ailments > Abdominal Disorders
```

Verdict: HOLD. Evidence (source: harvested.json + MARKET-INTELLIGENCE.md Section 8):
- BSR 8,091 anomaly ("Complete Guide to Taming Chronic Inflammation") with 11 reviews confirms sub-category rank does not require a review fortress.
- Competition level: Low-Medium.
- Free-to-paid exit velocity should produce top-10 subcategory rank within 72 hours even without ARC reviews.

**#1 New Release target:** realistic. The book competes only against other new releases in the first 30 days — not against established titles with review histories.

### Secondary — Digestive Health

```
Path: Kindle Store > Kindle eBooks > Health, Family & Lifestyle >
      Diet & Nutrition > Digestive Health
```

Verdict: HOLD as reach category. Top self-pub performer: BSR 37,505 / 50 reviews ("Gut Fix" — source: harvested.json). Larger category — #1 New Release here is a stretch. Useful for category-browser reach.

### Keywords

All 7 keywords per KDP-LISTING.md Section 3 remain valid. "Reset," "trigger," "diagnostic," "calm" all absent from competitor titles (source: COMPETITIVE-ANALYSIS.md Section 5). No changes recommended. First post-launch refinement at Day 45 when Auto SP Search Term Report produces data.

---

## SECTION 6 — 5-DAY PRE-LAUNCH CHECKLIST (TODAY TO MAY 28)

These are the only actions that matter before May 29.

```
TODAY — MAY 24 (SATURDAY) — PRIORITY ORDER
────────────────────────────────────────────────────────
□ 1. UPLOAD TO KDP (blocker for everything else)
      Submit manuscript-kdp.epub + cover-kdp-final.jpg to KDP.
      KDP review takes 24–72 hours. If not uploaded today, free days
      cannot be scheduled in time. This is the single hardest deadline.

□ 2. SCHEDULE FREE DAYS (immediately after upload is live)
      In KDP Select dashboard: schedule May 27 + May 28 as free days.
      These require the book to be live in KDP first.
      Do not wait — schedule the moment the upload clears review.

□ 3. ALSO-BOUGHT SEEDING (10 minutes — do it now, before upload)
      Purchase or KU-borrow the 5 seed titles from the publisher
      Amazon account. See Section 4 for ASINs.

□ 4. AUTHOR CENTRAL UK + US
      Create/complete profiles at authorcentral.amazon.co.uk and
      authorcentral.amazon.com. Bio, photo, series linked.
      This lifts conversion before a single ad runs.

□ 5. REPLACE [AMAZON_REVIEW_LINK] IN BACK MATTER
      Once ASIN is generated post-upload: substitute the live Amazon
      review URL into the manuscript and rebuild/re-upload if possible,
      OR make a note to update at the next production cycle.

MAY 25 (SUNDAY)
────────────────────────────────────────────────────────
□ 6. GOODREADS — claim author profile + add the book
      No warmup time, but the profile should be live before May 29
      so paid-launch visitors can find it. Link the ASIN once it exists.

□ 7. A+ CONTENT — submit today
      Will not approve before May 29 (7–14 day turnaround), but submit
      now. Every day of delay is a day of missed conversion lift.
      KDP > Marketing > A+ Content Manager.

□ 8. VERIFY KDP UPLOAD STATUS
      Confirm the upload has cleared review. If it has not, contact
      KDP support — the free days cannot be scheduled until it clears.

MAY 26 (MONDAY)
────────────────────────────────────────────────────────
□ 9. SCHEDULE AMS AUTO CAMPAIGN — BUILT PAUSED
      In Amazon Ads: create a Sponsored Products Auto campaign at
      £1–2/day budget. Leave it PAUSED. Do not activate until the
      gate check on Day 14.
      This takes 15 minutes and means it's ready to flip live the
      moment the gate check runs.

□ 10. CONFIRM FREE DAYS ARE SCHEDULED
       Check KDP Select dashboard: May 27 and May 28 should show as
       free promotion days. If not: fix immediately.

MAY 27–28 (FREE DAYS)
────────────────────────────────────────────────────────
□ 11. MONITOR FREE CHART RANK
       Check the book's rank on the free chart every few hours.
       Note the peak rank in a log. This is the demand signal —
       a higher free-chart rank = more exit velocity into paid.
       No action required. Just watch.

□ 12. DO NOT START ADS DURING FREE DAYS
       Paying for traffic to a £0 book is irrational. £0 ad spend
       on May 27–28.
```

---

## SECTION 7 — WEEK-BY-WEEK LAUNCH CALENDAR (PAID TERM)

Day 1 = May 29, 2026.

```
PAID WEEK 1 (Days 1–7, May 29 – June 4) — LAUNCH WEEK
────────────────────────────────────────────────────────
DO:    Watch the exit velocity from free chart landing in paid BSR.
       Log BSR every day into pipeline-state.json post_launch fields.
       Log both main BSR and subcategory BSR — subcategory is the target.
       Check "Also Bought" carousel on Day 3 evening (Section 4 verify).
         Right cluster = hold course.
         Wrong cluster = post to r/ibs / r/guthealth immediately with
         value-first content (see also-bought correction note, Section 4).
       Let KU borrows accumulate. Every full borrow is rank fuel.
       Replace [AMAZON_REVIEW_LINK] if not done pre-launch.
DO NOT: Run ANY paid ad. £0. The Auto campaign is built but PAUSED.
        Adjust keywords or categories — let the algorithm process the
        launch signal without interference.
        Chase promo sites — the moment has passed, the cost of attention
        is higher than the benefit.

PAID WEEK 2 (Days 8–14, June 5–11)
────────────────────────────────────────────────────────
DO:    Continue daily BSR logging (subcategory + main).
       Monitor KU page-read velocity in KDP dashboard.
       Check for any organic reviews arriving — log and celebrate.
       Continue watching "Also Bought" evolution.
       If BSR is above 200,000 and flat: do not panic yet. KU borrow
       velocity takes 7–14 days to fully register in BSR. Hold.
DO NOT: Run the paused Auto campaign. Gate is almost certainly closed.
        Drop the price. The 30-day Countdown clock requires 30 days
        at full price — breaking this now voids the Countdown Deal.

END OF WEEK 2 — GATE CHECK #1
────────────────────────────────────────────────────────
CONDITION A: Is BSR stable under 100,000 main (ideally under 50,000)
             OR under 5,000 in Abdominal Disorders subcategory
             for 3+ consecutive daily readings?
CONDITION B: Are there 10+ reviews live with 4.0+ average?

If BOTH met → activate the paused Auto SP campaign at £1–2/day.
If NOT met → campaign stays PAUSED. Continue organic Phase 2.

Reality check: with 0 ARC readers, Condition B (10+ reviews) is unlikely
by Day 14. The gate check is still worth running for Condition A.
If BSR qualifies but reviews don't, partial progress noted —
the book is ranking, the reviews will come.

PAID WEEK 3 (Days 15–21, June 12–18) — FIRST AD WINDOW (if gate open)
────────────────────────────────────────────────────────
DO:    If gate OPEN (both conditions): flip the paused Auto SP to LIVE.
         Budget: £1–2/day (algorithm-teaching signal, not performance cap).
         Run 7 days. Observation only. Do not optimise.
       If gate CLOSED: continue organic work.
         Schedule a free day (Day 21) if BSR is stalled and 3 reserve
         days remain — a second velocity spike can restart rank movement.
       Push any organic review opportunities. The in-book triggers
       (Days 2, 5, 7 of the protocol) have now activated for all
       readers who started in Week 1. Some will post.
DO NOT: Run Manual or ASIN campaigns. Not yet.
        Add keywords or pause existing keywords in the Auto campaign
        if it goes live — Week 3 is observation only.

PAID WEEK 4 (Days 22–30, June 19–28)
────────────────────────────────────────────────────────
DO:    If Auto running: download Search Term Report at Day 28.
       Note which search terms produced clicks and which produced sales.
       Continue daily BSR log.
       If 10+ reviews have arrived: confirm gate is open and Auto is live.
       Prepare Countdown Deal scheduling — eligible from Day 30.
         Book it for Days 30–34 (June 28 – July 2).
DO NOT: Scale the Auto campaign or raise bids.
        Add Manual or ASIN campaigns yet.

END OF WEEK 4 — GATE CHECK #2 + COUNTDOWN DECISION
────────────────────────────────────────────────────────
Countdown Deal eligibility: 30 days at £2.99 from KDP go-live date.
If eligible AND 5+ reviews live (not the 10-review gate — Countdown
does not require the full ad gate): schedule the deal.
If Auto is running with data: begin building Manual campaign from
proven converting search terms (Week 5 activation).

PAID WEEK 5 (Days 31–37, June 29 – July 5) — COUNTDOWN + FIRST MANUAL
────────────────────────────────────────────────────────
DO:    Run Countdown Deal (Days 30–34): £0.99 (Days 30–31) →
         £1.99 (Days 32–33) → £2.99 (Day 34) → £2.99 stable.
       Royalties during Countdown: 70% preserved at all tiers
         (source: KDP rate card).
         At £0.99: ~£0.69/sale. At £1.99: ~£1.39/sale.
       If Auto has 7+ days of Search Term data → build Manual
         exact/phrase from terms that produced sales.
         Budget: £3–5/day (confirm against pipeline-state.json
         marketing fields; if not set, start at £3/day).
       Adjust Auto bids down during Countdown to match lower royalty.
         Max CPC at £0.99 (40% target ACOS): £0.69 × 0.40 = £0.28.
DO NOT: Build ASIN targeting yet.
        Apply to BookBub Featured Deal (need 50+ reviews — not there yet).

PAID WEEK 6 (Days 38–44, July 6–12)
────────────────────────────────────────────────────────
DO:    Post-Countdown: price returns to £2.99.
       Optimise Manual campaign on real ACOS data.
         Max CPC at £2.99 (40% ACOS): £2.09 × 0.40 ≈ £0.84.
         Source: KDP rate card royalty calculation.
       Continue review velocity monitoring. Target: 15+ reviews by Day 45.
       Watch "Also Bought" carousel — by Day 44, if launch velocity held,
         the book should appear in its own carousel.
DO NOT: Open ASIN-targeting campaign unless "Also Bought" carousel test
        passes (book appearing in its own carousel).

PAID WEEK 7 (Days 45–51, July 13–19)
────────────────────────────────────────────────────────
DO:    Gate check for ASIN targeting:
         Manual running profitably AND book in its own "Also Bought" carousel?
         If yes: activate ASIN targeting at ~£3/day (start low; no data yet).
         Target the 5 also-bought seed ASINs from Section 4.
       Bidding rule for ASIN targeting: only bid on competitor ASIN where
         this book's review count exceeds the target's review count.
DO NOT: Bid on competitor ASINs where this book has fewer reviews.
        Apply to BookBub if under 50 reviews.

PAID WEEKS 8–10 (Days 52–72, July 20 – Aug 9)
────────────────────────────────────────────────────────
DO:    Scale only campaigns proven below target ACOS.
       Target 25+ reviews by Day 60.
       At Day 60: consider using 1 of the 3 reserved free days to
         re-spike if BSR has stalled. This resets rank momentum.
       At Day 65: if 50+ reviews reached, apply to BookBub Featured Deal.
DO NOT: Increase any campaign budget above target ACOS.
        Open BookBub self-serve Ads while Amazon ads are unprofitable.

PAID WEEKS 11–12 (Days 73–90, Aug 10–27)
────────────────────────────────────────────────────────
DO:    Re-apply to BookBub if rejected (30-day reapply window).
       Scale proven campaigns.
       Final review push — target 40+ reviews by Day 90.
       Audit all active campaigns. Pause underperformers.
       Prepare Day 91 decision: renew KDP Select for second term, or
         go wide (Kobo, Apple Books, Google Play). Decision is data-driven
         — real BSR, real KU revenue, real ad ACOS on the table.
DO NOT: Spend new money in Days 88–90.
        Renew Select automatically without reviewing the term data.
```

---

## SECTION 8 — BSR THRESHOLD TRIGGER TABLE

```
AD TRIGGER TABLE — nothing activates until its row's conditions are ALL true
────────────────────────────────────────────────────────────────────────
Ad type                       │ Required conditions
──────────────────────────────│─────────────────────────────────────────
ANY paid ad (conventional)     │ MASTER GATE:
                               │   Condition A (BSR — A1 OR A2):
                               │     A1: stable BSR under 100,000 main
                               │         (ideally under 50,000)
                               │     A2: BSR under 5,000 in Abdominal
                               │         Disorders sub-category
                               │   AND
                               │   Condition B (Reviews — BOTH):
                               │     B1: 10+ reviews live
                               │     B2: 4.0+ average rating
                               │ "Stable" = 3+ consecutive daily readings
                               │
Auto SP £1–2/day               │ REDUCED GATE (algorithm teaching):
  (algorithm-teaching only)    │   Condition A only (BSR) satisfied.
                               │   Can activate before 10 reviews exist.
                               │   Budget hard ceiling: £2/day.
                               │   Purpose: teach algorithm, not earn ROI.
                               │   Earliest: Day 14 gate check.
                               │
Sponsored Products AUTO        │ Full master gate open. Earliest: Day 21.
  (data-gathering budget)      │ £3–5/day. 7 days, no optimisation.
                               │
Sponsored Products MANUAL      │ Auto has 7+ days of converting Search
  (exact / phrase)             │ Term data. Earliest: Day 35 (Week 5).
                               │ £3–5/day (confirm pipeline-state.json).
                               │
Sponsored Products ASIN        │ Manual running profitably AND book
                               │ appears in its own "Also Bought"
                               │ carousel. Earliest: Day 45 (Week 7).
                               │ ~£3/day (start low, no prior ASIN data).
                               │
Bid on competitor ASIN          │ This book's review count exceeds the
                               │ target's review count.
                               │
Countdown Deal                  │ KDP Select AND 30 days at full price
                               │ AND eligible window open. Day 30.
                               │
BookBub Featured Deal           │ 50+ reviews AND 4.0+ average.
                               │ Earliest realistic: Day 65–75.
                               │
BookBub self-serve Ads          │ Amazon ad ACOS under control
                               │ (Manual Rung 2 proven profitable).
```

---

## SECTION 9 — AD LADDER

Four rungs. Each waits for the rung below it. `amazon-ads-agent` executes; this plan is the gate it waits behind.

```
RUNG 0 — Auto SP £1–2/day (algorithm teaching)
────────────────────────────────────────────────────────
Earliest:        Day 14 gate check
Gate required:   Condition A (BSR only) satisfied
Daily budget:    £1–2 hard ceiling
Purpose:         Algorithm education. Amazon's own ad system teaching
                 Amazon what this book is. Not a revenue play.
Duration:        Run continuously once activated (no minimum — this
                 is the standing low-burn signal, not a campaign sprint)
Optimisation:    NONE. This rung is never optimised. It runs at £1–2/day
                 indefinitely as background signal.

RUNG 1 — Sponsored Products AUTO (data gathering)
────────────────────────────────────────────────────────
Earliest:        Day 21 (earliest); when master gate opens
Gate required:   Full master gate (Condition A + Condition B)
Daily budget:    £3–5 (data-gathering cap)
Duration:        7 days minimum
Optimisation:    NONE. Observation only.
Purpose:         Let Amazon find converting ASINs and search terms.
                 Hand output to Manual campaign build.

RUNG 2 — Sponsored Products MANUAL (exact/phrase)
────────────────────────────────────────────────────────
Earliest:        Day 35 (Week 5)
Gate required:   Rung 1 has 7+ days of converting Search Term data
Daily budget:    £3–5/day (confirm pipeline-state.json marketing fields)
Build from:      Search Term Report only — proven converting terms.
                 Negative-target converted terms in Auto.
Bids:            Max CPC = royalty × target ACOS
                 At £2.99: ~£2.09 × 40% = £0.84 max CPC
                 At Countdown £0.99: ~£0.69 × 40% = £0.28 max CPC
                 Source: KDP rate card

RUNG 3 — Sponsored Products ASIN TARGETING
────────────────────────────────────────────────────────
Earliest:        Day 45 (Week 7)
Gate required:   Manual running profitably AND book in own "Also Bought"
Daily budget:    ~£3/day (no prior ASIN data — start low)
Target ASINs:    5 seed titles from Section 4 + any Search-Term-Report-
                 proven competitor ASINs where this book has more reviews
Bidding rule:    Never bid on competitor ASIN where this book has fewer
                 reviews than the target.

RUNG 4 — COUNTDOWN DEAL RE-SPIKE
────────────────────────────────────────────────────────
Timing:          Day 30 of paid term (June 28)
Recommended:     Days 30–34 (5-day deal)
Pricing:         £0.99 (Days 30–31) → £1.99 (Days 32–33) → £2.99 (Day 34)
Royalty:         70% preserved at all Countdown tiers (KDP rate card)
Ads during deal: Rung 0 continues at £1–2/day.
                 Rung 1/2/3 bids drop to match lower royalty per above.

ORCHESTRATOR INSTRUCTION:
amazon-ads-agent MUST NOT be invoked for Rung 1, 2, or 3 before the
full master gate opens. Rung 0 (£1–2/day Auto) can activate when
Condition A alone is satisfied. Pre-build all campaigns PAUSED at May 26.
```

---

## SECTION 10 — REVIEW VELOCITY TARGETS (ZERO-ARC ADJUSTED)

```
Day 1:       0 reviews (no ARC cohort — this is the honest baseline)
Day 7:       0–2 reviews (organic — if any reader finishes and posts)
Day 14:      1–5 reviews realistic
Day 30:      5–10 reviews realistic (organic via KU borrows + back-matter CTA)
Day 45:      10–15 reviews → WHEN AD GATE IS REALISTICALLY LIKELY TO OPEN
Day 60:      15–25 reviews
Day 90:      25–40 reviews

Gate thresholds (unchanged — reality just shifts when they're hit):
  Ad gate opens:      10+ reviews + 4.0+ avg (→ Rung 1 auto, full budget)
  BookBub eligibility: 50+ reviews + 4.0+ avg (→ realistically Day 90+)
```

**Review acquisition mechanisms (no ARC):**
- In-book Day 2 trigger: reader completes trigger-profile exercise, hits emotional resonance → review prompt is natural at that moment
- In-book Day 5 trigger: stress bridge practice — highest reader engagement point → review prompt
- In-book Day 7 trigger: Personal Maintenance Map built → reader has completed the system → highest conversion moment for review
- Back-matter CTA with [AMAZON_REVIEW_LINK] (substitute live URL post-upload)
- KU readers have zero purchase friction → they borrow and read → review triggers operate normally

**Missed target response:**
- Under 10 reviews at Day 30 → ad gate stays closed. Do not run Rung 1. Continue organic.
- Under 10 reviews at Day 45 → consider a free re-spike day (Day 45 or 60) to bring fresh readers through the review triggers.
- Under 50 reviews at Day 90 → no BookBub Featured Deal. Continue accumulating. Apply when crossed.

---

## SECTION 11 — AUTHOR CENTRAL + A+ CONTENT + GOODREADS

```
LEVER                │ STATUS         │ ACTION REQUIRED
─────────────────────│────────────────│──────────────────────────────
Author Central UK     │ NOT LIVE       │ TODAY — before upload
Author Central US     │ NOT LIVE       │ TODAY — before upload
A+ Content           │ NOT SUBMITTED  │ MAY 25 — won't approve pre-launch,
                     │                │ but submit immediately. Approval in
                     │                │ 7–14 days = will lift conversion
                     │                │ from Week 2 onward.
Goodreads listing    │ NOT LIVE       │ MAY 25 — no warmup, but claim the
                     │                │ profile so paid-launch visitors find it
Editorial Reviews    │ 0 loaded       │ If any genuine beta reader quotes
                     │                │ exist, load them before May 29.
                     │                │ Empty is fine. Fabricated is KDP
                     │                │ policy violation.
```

**Algorithmic effect:** every conversion-lift lever increases rank-per-visitor. The algorithm uses conversion rate to decide who else sees the book. These are free levers. Not using them before launch forfeits conversion lift at the most algorithmically important moment.

---

## SECTION 12 — 90-DAY REVENUE (REAL DATA ONLY)

MARKET-INTELLIGENCE.md does not contain BSR-to-sales conversion data for this niche. A precise revenue forecast cannot be produced without inventing that conversion ratio.

**What we know (cited):**

| Figure | Value | Source |
|---|---|---|
| Net royalty per UK paid sale (£2.99) | ~£2.09 | KDP rate card (70% band, £2.99 × 0.70) |
| Net royalty per Countdown sale (£0.99) | ~£0.69 | KDP rate card (70% preserved at Countdown) |
| KU revenue per full read | ~£0.19 | KDP rate card × ~48 KENPC pages |
| Competitor BSR ceiling (self-pub) | BSR 37,505 (50 reviews) | harvested.json — "Gut Fix" |
| Ad gate break-even CPC (£2.99) | £0.84 max at 40% ACOS | KDP rate card calculation |
| Ad gate break-even CPC (£0.99 Countdown) | £0.28 max at 40% ACOS | KDP rate card calculation |

**What we do not know and cannot estimate:** BSR-to-sales conversion for Abdominal Disorders or Digestive Health. Free-download volume from a 2-day KDP free promotion in this niche. Paid sale conversion rate from free chart spillover.

**What this means:** the forecast will be built from real Day 7 and Day 14 KDP reports once the book is live. Until then: "We need real BSR-to-sales data before making a revenue forecast."

---

## SECTION 13 — NON-NEGOTIABLE RULES

1. **Subcategory BSR is the target, not overall BSR.** Top 5–10 in Abdominal Disorders is the primary objective. Overall BSR under 1,000 requires assets this launch does not have (source: marketing-agent Section 0.8).

2. **No ads in paid Week 1.** £0. Hard rule regardless of launch performance.

3. **Rung 0 (£1–2/day Auto) requires Condition A only.** This is the algorithm-teaching signal, not a revenue campaign. Budget ceiling is £2/day — never exceeded.

4. **No Rung 1/2/3 before master gate opens.** Both conditions must be met. "Almost open" is not open.

5. **Free days BEFORE paid launch.** May 27–28, paid launch May 29. Non-negotiable.

6. **Also-bought seeding is mandatory — one action.** Publisher account purchases the 5 seed titles before May 27. 10 minutes. Cannot be skipped.

7. **Author Central UK + US live before May 29.** Not after. Conversion lift forfeited at launch if not done.

8. **A+ Content submitted by May 25.** Approval lands when it lands — the submission date is what matters.

9. **No price drop before Day 30.** Breaking the 30-day full-price requirement voids the Countdown Deal window. The Countdown is the second engineered rank spike. Protecting it is worth more than a short-term £0.99 impulse promotion.

10. **No BookBub Featured Deal before 50 reviews.** Rejection wastes the cycle.

11. **No revenue forecast from invented numbers.** All estimates in this plan trace to cited sources. Where data does not exist, the plan states the gap.

12. **KDP Select is non-negotiable for the 90-day term.** Wide-distribution decision is data-driven at Day 90 on real term performance.

13. **No Rung 3 ASIN bids where this book has fewer reviews than the target.**

14. **No second ad front (BookBub self-serve) while Amazon ads are unprofitable.**

---

## SECTION 14 — ORCHESTRATION HANDOFF

**Stage 07 (KDP upload) begins immediately.** This plan is the post-upload governing document.

**amazon-ads-agent** is held until Day 14 gate check (Condition A) for Rung 0, or master gate opening for Rung 1+. It must not be invoked before the gate check runs.

**post-launch-agent** invoked at Day 90 to consolidate term performance and prepare the renew-Select-or-go-wide decision.

**ams-optimizer-agent** invoked from Week 5 onward (Day 35) on real ACOS data from Rung 1.

**Pipeline-state.json updates required daily:** post_launch.bsr_main and post_launch.bsr_subcategory — both fields, every day, from Day 1 of paid term. The ad gate logic depends on these readings.

---

*All figures trace to: MARKET-INTELLIGENCE.md (2026-05-13), KDP-LISTING.md (2026-05-23), pipeline-state.json (2026-05-23), KDP rate card, marketing-agent spec (2026-05-23). Zero invented numbers. Where data does not exist, this plan states the gap explicitly.*
