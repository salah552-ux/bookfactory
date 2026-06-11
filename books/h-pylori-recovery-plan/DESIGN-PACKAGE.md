# Design Package — The H. Pylori Recovery Plan
**Series:** Fix Your Gut for Good — Book 3 | **Author:** S.A. Ibrahim
**Agent:** design-agent | **Stage:** 06 — Production | **Date:** 2026-06-11

---

## 1. Market Analysis

The H. pylori-specific shelf splits into two clusters, both leaving the
commercial lane open. The first cluster is **clinical/academic** (Springer,
IntechOpen, NCBI Bookshelf "Helicobacter pylori" texts) — plain medical covers
aimed at clinicians, not frightened patients. The second is the **"beat it
without antibiotics" diet cluster**, led by David Hompes' *The H Pylori Diet:
The Shocking Truth... Beat Its Symptoms in 60 Days or Less without Antibiotics* —
an anti-antibiotic, supplement-adjacent positioning. (Sources below.) The wider
gut-health field harvested for this series is dominated by clinical blue/teal,
sage green, food photography, and gut anatomy (COMPETITIVE-ANALYSIS / MARKET-
INTELLIGENCE.md §6, in-book).

**What is overused and therefore invisible:** clinical blue/teal, anatomy
diagrams, food photography, "without antibiotics" diet framing.

**The visual gap this cover owns:** deep navy investigative-authority with a warm
ochre accent, leading with the keyword **H. PYLORI** and the unoccupied lane
**"even when antibiotics have failed."** No incumbent owns the *failed-treatment*
position — it is the same lane the subtitle was locked on (KDP-LISTING.md §2,
Decision 3). The navy/cream/gold register signals "this is the serious, sourced
one," which is precisely what the reader who was let down by the diet books wants.

**Colour territory:** clinical blue/teal, sage, pastel = saturated. Deep navy +
warm accent = available and series-locked (COVER-PSYCHOLOGY §5).

## 2. Creative Direction Statement
See COVER-BRIEF.md §1–6. Concept: navy clinical authority + the antibiotics-
failed lane + locked series DNA. Mood: investigative hardback / clinician's case
file. Palette: #0E1B2C / #F3EEE3 / #C8A15A + ochre #C68A2E. Eye path: H. PYLORI →
RECOVERY PLAN → "even when antibiotics have failed" → author. NOT doing: any
COVER-PSYCHOLOGY §10 trap.

## 3. Cover Design System (HTML+Playwright spec — execution-only path)

```
DESIGN SYSTEM — The H. Pylori Recovery Plan

Canvas:             1600 × 2560px (KDP portrait, ratio 1.6)
Background:         #0E1B2C — deep navy; series spine, investigative authority, off the saturated wellness palette
Primary accent:     #C8A15A — gold (author, rules, hook underline)
Secondary accent:   #C68A2E — ochre (edge rules + "antibiotics failed" lane; Book-3 differentiation)
Title font:         Libre Baskerville Bold — fallback Georgia
Body font:          EB Garamond (interior) / Libre Baskerville (cover) — fallback Georgia

Layout grid (top to bottom):
  Series brand band:  top 150px region, 36px, 0.30em letter-spacing, #F3EEE3 @ 0.55
  Title block:        "THE" 64px → "H. PYLORI" 232px → gold underline → "RECOVERY PLAN" 168px, #F3EEE3
  Subtitle:           66px, 700, cream @ 0.92, 2 lines, anchored ~1180px
  Lane:               50px ochre #C68A2E, "EVEN WHEN ANTIBIOTICS / HAVE FAILED"
  Author:             52px, gold #C8A15A, flanked by 300px gold rules, bottom 100px

Text strings (verbatim from KDP-LISTING.md):
  Series brand:  "Fix Your Gut for Good"
  Title:         "The H. Pylori Recovery Plan"  (cover sets THE / H. PYLORI / RECOVERY PLAN)
  Subtitle:      cover distils to "Eradicate the Infection. Heal Your Stomach Lining." + lane "Even When Antibiotics Have Failed"
                 (full subtitle on KDP listing: "How to Eradicate the Infection, Heal Your Stomach Lining, and Understand Your Cancer Risk — Even When Antibiotics Have Failed")
  Author:        "S.A. Ibrahim"

Forbidden in HTML output:
  - <img> tags (no AI-generated imagery) — NONE present
  - background-image: url(...) AI asset — NONE present (grid texture is pure CSS gradient)
  - hand-drawn / AI-illustration effects — NONE
  - colour/composition copied from a top comp — navy+ochre differentiates from the field
```

> **Cover-text note (transparency):** the cover distils the long KDP subtitle into
> a 2-line promise + the differentiator lane, for thumbnail legibility (COVER-
> PSYCHOLOGY §6 Rule T3). The full, verbatim subtitle appears in the KDP listing
> field, on the copyright page, and on the title page. Cover wording is a faithful
> subset of the listing subtitle — no new claim is introduced.

## 4. Interior Formatting Spec
Locked to the series. See STYLE-GUIDE.md. Body EB Garamond 11.5pt; display
Playfair Display; labels Lato; navy #1b3a5c accent; #c8b99a callout border;
6×9in. Kindle/EPUB built via build-manuscript.sh (Pandoc); print interior via
build-print-pdf.sh. Front matter: Title → Copyright → Contents → How to Use →
chapters. Back matter: Conclusion → Review CTA → Also by → About the Author.

## 5. Chapter Header Recommendation
**Option 1 — Precision** (series-locked): chapter label (Lato 8pt uppercase) +
thin rule, chapter title (Playfair Display 26pt italic navy). Already implemented
in pdf-style.css. Consistent with Book 1 and Book 2.

## 6. Back Cover Layout
- Headline: "You tested positive. Then you Googled it." (from manuscript opener)
- Body: 150-word distillation of KDP-LISTING.md description
- Author bio: 50 words (from 99-back-matter.md About the Author)
- ISBN barcode: bottom right, 1.5"×1" reserved (KDP auto-applies)
- No publisher imprint (series rule). Navy/cream/gold grid matching Book 1/2.

## 7. KDP Technical Specs
eBook cover 1600×2560 JPG sRGB ratio 1.6 — VERIFIED 8/8. Print cover (front+
spine+back) is generated at the KDP-upload stage from page count; spine width =
page count × 0.0025" (cream). Cover text matches the Amazon detail page.

## 8. MANDATORY COVER COMPLIANCE VERIFICATION

8-point check on `exports/final/cover-kdp-final.jpg`:

| Check | Required | Result |
|-------|----------|--------|
| Format | jpeg | PASS — jpeg |
| Width | 1600px | PASS — 1600 |
| Height | 2560px | PASS — 2560 |
| Colour space | srgb | PASS — srgb |
| Channels | 3 (no alpha) | PASS — 3 |
| Has alpha | false | PASS — false |
| File size | < 50MB | PASS — 376 KB |
| Ratio | 1.6 | PASS — 1.6 |

**8/8 PASS.** Cover is KDP-upload-ready.

---

## SECTION 9 CHECKLIST — COVER-PSYCHOLOGY GO/NO-GO (all 7 must be YES)

- **Q1 — Thumbnail legibility (100px squint):** **YES.** `cover-thumb-100.png`
  rendered at 100×160 — "H. PYLORI / RECOVERY PLAN" reads as deliberate typography,
  navy/cream contrast holds. Title is readable as a shape and as words.
- **Q2 — Pattern interruption:** **YES.** Deep navy + ochre against a field of
  blue/teal, sage, food-photo white, and academic-medical covers — does not match
  the cluster (Market Analysis §1; COVER-PSYCHOLOGY §5).
- **Q3 — Competitor trap test:** **YES (zero traps).** No food photo, no anatomy,
  no bottles, no clinical blue/teal, no sage, no pastel, no "Complete Guide", no
  "Beginners", no "Heal/Cure" in title position, no stamps, no fake ratings, no
  script/thin fonts, no author photo, no imprint, no emoji icons (§10 — all absent).
- **Q4 — Reader-emotion (specificity/authority vs warmth/hope):** **YES.** Navy
  authority + the "antibiotics failed" lane signal precision to the experienced,
  already-disappointed reader (MARKET-INTELLIGENCE.md §6 purchase emotion).
- **Q5 — Price/length match:** **YES.** Typography-led, single strong idea, no
  reference-book density. This is an authority-priced (£6.99) clinical guide
  (KDP-LISTING.md §5 Decision 2); the navy authority register matches the price.
- **Q6 — Series DNA:** **YES.** Navy #0E1B2C / cream #F3EEE3 / gold #C8A15A spine
  present; series brand line tracked uppercase at top; author block in gold with
  rules at bottom; no imprint. Ochre is the permitted Book-3 differentiation accent
  (Rule S4).
- **Q7 — Title content match:** **YES.** Title "The H. Pylori Recovery Plan",
  author "S.A. Ibrahim", series "Fix Your Gut for Good" match KDP-LISTING.md
  verbatim. Subtitle on cover is a faithful distillation of the listing subtitle
  (note in §3); full subtitle appears verbatim on the listing, title page, and
  copyright page.

**All 7 = YES. Cover is commercially viable and approved for presentation.**

## 10. Series Consistency Checklist
- [x] Same spine typography + author position as Book 1/2
- [x] Cover colour (navy + ochre) does not clash with Book 1 (oxblood) / Book 2 (amber)
- [x] Same interior body font + heading hierarchy (series-locked CSS)
- [x] Same callout box styling
- [x] Same back cover layout grid
- [x] Author name treatment (gold, bottom, rules) matches across all covers

---

## Cover Ready — 46/50 (estimated against SCORING-RUBRIC.md)

Rendered 2 iterations (iteration 1 clipped the hook at 340px; fixed to 232px).
- Thumbnail Legibility:  14/15 (fully legible at 100px)
- Colour Contrast:       15/15 (cream on navy, maximum contrast)
- Typography Hierarchy:  10/10 (hook > title > subtitle > lane > author)
- Brand Compliance:       7/10 (series DNA exact; ochre differentiation; no imprint)

Cover saved: `exports/final/cover-kdp-final.jpg`

---

**Sources (market search, this session, 2026-06-11):**
- [The H Pylori Diet — David A. Hompes (Amazon)](https://www.amazon.com/Pylori-Diet-Shocking-Helicobacter-Antibiotics/dp/0956923003)
- [Helicobacter pylori — Springer Nature](https://link.springer.com/book/10.1007/978-981-97-0013-4)
- [Towards the Eradication of Helicobacter pylori Infection — IntechOpen](https://www.intechopen.com/books/1003597)
- [Helicobacter Pylori — StatPearls / NCBI Bookshelf](https://www.ncbi.nlm.nih.gov/books/NBK534233/)
