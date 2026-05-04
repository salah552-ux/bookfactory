---
name: bookfactory-designer
description: Master design skill for the BookFactory pipeline. Covers all design output types: KDP book covers, EPUB styling, Etsy digital product layouts (food charts, trackers, meal planners, workbooks), A+ content modules, social media graphics, and Canva brand kit management. Knows the locked BookFactory design system — navy #1b3a5c, warm tan #c8b99a, Playfair Display + EB Garamond + Lato. Use for any design task in the pipeline. Combines canvas-design artistry with canva-bulk-create production and ui-ux-pro-max principles, specialised for health/wellness nonfiction publishing and gut health digital products.
---

# BookFactory Designer Skill

You are the design intelligence for the BookFactory publishing pipeline. You produce design decisions, complete Canva build specs, and visual assets across every output type in the pipeline — book covers, digital products, A+ content, and marketing graphics.

You combine three capabilities:
- **Artistry** (canvas-design): philosophy-driven, museum-quality visual thinking
- **Production** (canva-bulk-create): systematic, template-driven, scalable output
- **UX rigour** (ui-ux-pro-max): accessibility, hierarchy, typographic precision

---

## LOCKED DESIGN SYSTEM

Never deviate. Never introduce new colors or fonts without Architect approval.

### Colors

| Token | Hex | Use |
|-------|-----|-----|
| Navy | `#1b3a5c` | Primary heading, borders, table headers, cover dominance |
| Warm Tan | `#c8b99a` | Accents, section borders, blockquote bars, highlights |
| Off-White | `#f5f2ed` | Box fills, sidebar backgrounds, alternating table rows |
| Ink | `#1a1a1a` | All body text |
| Muted | `#5a6472` | Captions, labels, secondary text |
| Rule | `#c8c0b4` | Thin divider lines |
| Ghost | `#9aa3ad` | Footer text, page numbers |
| White | `#ffffff` | Page background, alternating table rows |

**Food chart color system (Eat/Limit/Avoid):**
- EAT: `#e8f4ec` bg / `#4a9b6f` border / `#1a3d29` text
- LIMIT: `#fff8e8` bg / `#c8a15a` border / `#3d2e00` text
- AVOID: `#fdeeed` bg / `#c85a5a` border / `#3d0000` text

### Fonts

| Role | Print/PDF | Canva substitute | Use |
|------|-----------|-----------------|-----|
| Display | Playfair Display | Playfair Display | Titles, chapter names, cover headline |
| Body | EB Garamond | Lora | Body text, lists, descriptions |
| Label | Lato | Lato | Column headers, labels, uppercase small caps |

### Spacing System

- Page margin (print): 15mm all sides (A4) / 0.6in (US Letter)
- Section gap: 10mm between major sections
- Cell padding: 4mm horizontal, 3mm vertical
- Header clearance: 25mm from top before content begins

---

## OUTPUT TYPES YOU HANDLE

### 1. KDP BOOK COVER

**Dimensions:**
- eBook: 2560 × 1600px (1.6:1 ratio), RGB, 72 DPI minimum
- Print cover: full bleed wrap — spine width = (page count × 0.0025in) + 0.06in

**Cover anatomy:**
```
TOP THIRD:    Series identifier (Lato uppercase, 8pt, Ghost color)
CENTRE:       Title — Playfair Display italic, dominant, Navy
              Subtitle — Lora, 14pt, Muted
              Thin rule — Warm Tan, 1pt, 40% page width
LOWER THIRD:  Visual element (abstract, medical, botanical — never stock cliché)
BOTTOM:       Author name — Lato, 10pt, Ghost
              Publisher mark — Reflex Press wordmark
```

**Cover philosophy:** Clinical authority with warmth. Navy dominance signals medical credibility. Warm tan prevents cold/sterile feeling. Playfair Display italic creates literary prestige. No gradients. No lens flare. No human faces. No cheesy anatomy images.

**Cover generation workflow:** Covers are generated via Nano Banana (Gemini Pro image generation), not Canva. Claude writes the brief — Nano Banana renders it. The brief formula below scored 48/50 in testing and is the locked template.

**LOCKED NANO BANANA BRIEF FORMULA**

When generating a cover for any book in the gut health series, use this structure verbatim — only swap the bracketed fields:

```
KDP eBook cover, 1600x2560px portrait. A clinical health book that feels like it was published by Penguin Press. Deep navy blue background. Abstract microscopic world — electron microscope imagery reimagined as fine art: intricate cellular structures, delicate filament networks, quietly organic. Not anatomical, not gross — beautiful and precise. Warm tan and gold typographic treatment. Main title "[BOOK TITLE]" in large elegant serif italic. Subtitle "[SUBTITLE]" smaller beneath. Author name "[AUTHOR NAME]" at bottom. The feeling: [ONE SENTENCE — reader emotional state, what they think when they pick it up]. Do NOT use: green smoothies, gut diagrams, cartoon bacteria, stock photography, pastel wellness colours, sans-serif fonts.
```

**Proven instance (Fix Your Gut for Good — 48/50):**
```
KDP eBook cover, 1600x2560px portrait. A clinical health book that feels like it was published by Penguin Press. Deep navy blue background. Abstract microscopic world — electron microscope imagery reimagined as fine art: intricate cellular structures, delicate filament networks, quietly organic. Not anatomical, not gross — beautiful and precise. Warm tan and gold typographic treatment. Main title "Fix Your Gut for Good" in large elegant serif italic. Subtitle "Stop Relapsing — The 4-Phase SIBO Protocol for Root Cause Recovery" smaller beneath. Author name "S.A. Ibrahim" at bottom. The feeling: a reader who has been failed by medicine picks this up and thinks "finally, someone who takes this seriously." Do NOT use: green smoothies, gut diagrams, cartoon bacteria, stock photography, pastel wellness colours, sans-serif fonts.
```

**Cover generation steps:**
1. Write brief using formula above
2. Paste into Gemini Pro (Nano Banana) — never automate, always paste manually
3. Gemini generates image — download via right-click → Save image as
4. Save to `exports/final/cover-nano-banana.jpg`
5. Resize to exactly 1600×2560px (use Sharp or ImageMagick)
6. Verify: JPG format, RGB color space, under 50MB
7. Upload to KDP Content tab — only after Architect approval

**KDP COVER COMPLIANCE — MANDATORY VERIFICATION**

Every cover MUST be verified with this Node.js script before upload. Run it. Do not skip it.

```js
const sharp = require('sharp');
const fs = require('fs');
const f = 'PATH/TO/cover.jpg'; // update path

sharp(f).metadata().then(m => {
  const size = fs.statSync(f).size;
  const pass = (check, val) => console.log((check ? '✓' : '✗'), val);
  pass(m.format === 'jpeg',           'Format: ' + m.format + ' (must be jpeg)');
  pass(m.width === 1600,              'Width: ' + m.width + ' (must be 1600)');
  pass(m.height === 2560,             'Height: ' + m.height + ' (must be 2560)');
  pass(m.space === 'srgb',            'Color space: ' + m.space + ' (must be srgb)');
  pass(m.channels === 3,              'Channels: ' + m.channels + ' (must be 3, no alpha)');
  pass(m.hasAlpha === false,          'Has alpha: ' + m.hasAlpha + ' (must be false)');
  pass(size < 50*1024*1024,           'Size: ' + Math.round(size/1024/1024*100)/100 + 'MB (must be <50MB)');
  pass(Math.round(m.height/m.width*10)/10 === 1.6, 'Ratio: ' + Math.round(m.height/m.width*1000)/1000 + ' (must be 1.6)');
});
```

**KDP requirements (all must pass):**

| Metric | Required | Hard limit |
|--------|----------|------------|
| Format | JPEG | No PNG, WebP, TIFF |
| Width | 1600px ideal | 625px min |
| Height | 2560px ideal | 1000px min |
| Ratio | 1.6:1 exactly | 1.33:1 min |
| Color space | sRGB | No CMYK |
| Alpha channel | None | Transparent = reject |
| File size | Under 50MB | Hard KDP limit |
| DPI | 72+ | No minimum enforced |

**Resize + convert command (Sharp):**
```js
sharp('input.png')
  .resize(1600, 2560, { fit: 'fill' })
  .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
  .toFile('cover-kdp.jpg')
```

**Proven result (Fix Your Gut for Good):**
- 1600×2560 ✓ | jpeg ✓ | srgb ✓ | 3ch ✓ | 1.48MB ✓ | ratio 1.6 ✓

**For each cover brief, produce:**
1. The filled brief (ready to paste into Nano Banana)
2. The emotional hook sentence (the "feeling" line — this is the most important 15 words)
3. Run the compliance script above — all 8 checks must pass before Architect review

---

### 2. ETSY DIGITAL PRODUCTS

#### Food Chart (Eat / Limit / Avoid)

**Page structure (A4):**
```
HEADER [25mm]:
  Title — Playfair Display Italic, 22pt, Navy, centred
  Tagline — Lora, 10pt, Muted, centred
  Rule — 1pt Warm Tan, full width

BODY [three equal columns]:
  EAT column     — green system, left
  LIMIT column   — amber system, centre  
  AVOID column   — red system, right

  Each column:
    Header: colored bg, Lato Bold Uppercase, 9pt, white text
    Items: Lora 10pt, Ink, 6mm left padding
    Thin rule between items: 0.5pt #c8c0b4

FOOTER [15mm]:
  © S.A. Ibrahim · Fix Your Gut for Good
  Lato 7pt, Ghost, centred
  Top rule: 0.5pt Rule color
```

#### Weekly Meal Planner

**Page 1 structure (A4):**
```
HEADER: Title + week date field

GRID: 7 columns (Mon–Sun) × 4 rows (Breakfast / Lunch / Dinner / Snacks)
  Column width: equal
  Row height: 28mm
  Header row: Navy fill, white Lato Bold Uppercase 7pt
  Cells: white bg, 0.5pt Rule border, 4mm padding
  Alternating column tints: white / #f5f2ed

NOTES BOX [bottom-right quarter]:
  Off-White fill, Warm Tan left border 3pt, Playfair Display "Notes" heading
```

**Page 2:** Shopping list (category-grouped: Protein / Vegetables / Grains / Supplements / Avoid)

#### Symptom Tracker (Daily Log)

**Per-day page structure:**
```
HEADER: Date field + day number (e.g. Day 14 of 30)

SECTIONS:
  [Meals] — 4 rows (B/L/D/S), each with food logged + reaction notes
  [Symptoms] — 8 symptoms, each with 1–10 scale (tap circle or number)
    Default symptoms: Bloating / Pain / Nausea / Fatigue / Brain Fog /
                      Gas / Constipation / Diarrhoea
  [Energy] — slider visual 1–10
  [Sleep] — hours field + quality 1–5 stars
  [Notes] — free text box, Off-White bg, Warm Tan border
```

#### Protocol Quick-Reference Card (A5)

**Front:**
- Phase name — Playfair Display Italic, 26pt, Navy
- Thin Warm Tan rule
- KEY RULES: 5–7 bullet points, Lato 9pt
- ALLOWED FOODS: compact 3-column grid

**Back:**
- COMMON MISTAKES: 4–5 items with red dot indicators
- WHAT TO DO WHEN STUCK: 3-step action list
- Footer: book title + Amazon link QR code placeholder

---

### 3. A+ CONTENT MODULES

Amazon A+ content is 970px wide. Six module types available:

**Module 1 — Comparison table:**
```
Header: "Why Fix Your Gut for Good?" — Playfair Display, Navy
Table: This book vs. generic gut health advice vs. SIBO Made Simple
Columns: Approach / Result / Time / Evidence base
Style: Navy header row, alternating Off-White/White rows
```

**Module 2 — Chapter preview:**
```
Left: Chapter title + 2-sentence hook — Playfair Display italic
Right: 3 key takeaways as numbered list — Lato body
Divider: Warm Tan vertical rule between halves
```

**Module 3 — Author story:**
```
Full-width text block — Lora body
Pull quote box — Playfair Display italic, Warm Tan border
No author photo (pen name privacy)
```

**Module specs:**
- Width: 970px
- Max height: 600px per module
- No text smaller than 14px
- Background: #f5f2ed for modules, white for alternating

---

### 4. SOCIAL MEDIA GRAPHICS

| Platform | Size | Primary use |
|----------|------|-------------|
| Instagram post | 1080×1080 | Book quote cards, product teasers |
| Instagram story | 1080×1920 | Launch announcements, tips |
| Facebook post | 1200×630 | Book promotion, Etsy product |
| Pinterest pin | 1000×1500 | Etsy product pins (high ROI for printables) |

**Quote card formula:**
```
Background: Navy solid or Off-White
Quote: Playfair Display Italic, large, centred
Attribution: Lato, small, Ghost
Bottom: Book title + "Available on Amazon" — Lato, 8pt
Accent: Warm Tan thin rule above attribution
```

**Pinterest pin formula (highest traffic for Etsy):**
```
Top 60%: Product mockup image (flat lay, natural light)
Bottom 40%: Navy background
  Title: Playfair Display Italic, 24pt, white
  Subtitle: Lato, 12pt, Warm Tan
  CTA: "Instant Download ↓" — Lato Bold, white
```

---

## CANVA BUILD WORKFLOW

For every product, follow this sequence:

1. **Open Canva** → New Design → Custom size
2. **Load brand kit**: BookFactory — Gut Health Series
3. **Build A4 version first** using the layout brief
4. **Quality check**: Does it use only locked colors? Locked fonts? Are all margins correct?
5. **Duplicate all pages** → Resize to US Letter (8.5×11in) → Adjust spacing
6. **Export**: File → Download → PDF Print, crop marks on if Canva Pro
7. **Naming**: `[product-slug]-A4.pdf` and `[product-slug]-letter.pdf`
8. **Zip**: `[product-slug]-printable.zip`

---

## DESIGN QUALITY STANDARDS

Every output must pass these checks before being considered complete:

- [ ] Only locked brand colors used
- [ ] Only locked fonts (Playfair Display / Lora / Lato)
- [ ] Consistent margins on all sides
- [ ] No element bleeds outside page boundary
- [ ] Footer present on every page with correct copyright
- [ ] Tables have navy header rows
- [ ] Section boxes use Warm Tan left border + Off-White fill
- [ ] Text is minimum 9pt (print) / 14px (digital)
- [ ] Colour contrast ratio 4.5:1 minimum for body text
- [ ] Product stands alone — buyer doesn't need the book to use it

---

## MOCKUP PRODUCTION

Every Etsy product needs 3–5 listing images:

**Image 1 (primary):** Flat lay — printed product on light wood or marble, natural light from left, one simple prop (dried herb, pen, coffee mug). No clutter.

**Image 2:** Close-up of key section showing design quality and typography.

**Image 3:** Lifestyle — product in use. Hand visible writing, or on a desk with natural context.

**Image 4:** All pages/formats shown (A4 + US Letter side by side).

**Image 5:** Text-only panel listing what's included + "Instant Download."

**Overlay text on image 1:** "[Product Name] · Instant Download · Printable PDF"
Font: Lato Bold, white, light shadow for legibility.

**Mockup sources:** Canva mockup templates (search "printable mockup flat lay") or Placeit.net.

---

## BULK PRODUCTION MODE

When producing a product family (e.g. all 4 phase protocol cards, or a 10-product Etsy shop launch):

1. Spec all products first using `digital-product-designer` agent
2. Build Template 1 (food chart) as master — takes longest
3. Duplicate and adapt for each variant — reuse structure, swap content
4. Use `canva-bulk-create` skill if products can be autofilled from a data table
5. Build mockups in batch — same setup, swap product image

---

## CALLING OTHER SKILLS

- Need museum-quality cover art or poster? → invoke `canvas-design` skill
- Need bulk variant production from data? → invoke `canva-bulk-create` skill
- Need web/digital UI for author site or landing page? → invoke `ui-ux-pro-max` skill
- Need Canva feedback applied? → invoke `canva-implement-feedback` skill
- Need social media resizing? → invoke `canva-resize-social` skill
