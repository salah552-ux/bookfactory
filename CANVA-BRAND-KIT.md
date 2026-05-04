# BookFactory — Canva Brand Kit
## Gut Health Series · S.A. Ibrahim · Reflex Press

This is the master reference for building all digital products in Canva.
Locked 2026-04-19. Do not deviate without Architect approval.

---

## CANVA SETUP

### Brand Kit Name
`BookFactory — Gut Health Series`

### Brand Colors (add all to Canva Brand Kit)

| Name | Hex | Use |
|------|-----|-----|
| Navy | `#1b3a5c` | Headings, borders, table headers, accents |
| Warm Tan | `#c8b99a` | Section borders, highlights, dividers |
| Off-White | `#f5f2ed` | Box fills, sidebar backgrounds, alternating rows |
| Body Text | `#1a1a1a` | All body copy |
| Muted | `#5a6472` | Labels, captions, secondary text |
| Light Rule | `#c8c0b4` | Thin divider lines |
| Light Label | `#9aa3ad` | Footer text, page numbers |
| White | `#ffffff` | Page background, table row alternating |

### Brand Fonts (add to Canva Brand Kit)

| Role | Font | Style | Use |
|------|------|-------|-----|
| Display | Playfair Display | Italic where headings | Product title, chapter names, h1 |
| Body | Lora | Regular | Body text, lists (EB Garamond Canva alternative) |
| Label | Lato | Regular + Bold | Column headers, labels, uppercase small caps feel |

> Note: EB Garamond is not available in Canva. Use **Lora** as the body substitute — same old-style serif warmth.

---

## PAGE SIZES

Always create two versions of every product:

| Format | Dimensions | Use |
|--------|-----------|-----|
| A4 | 210 × 297 mm | UK / EU buyers (primary for Etsy UK) |
| US Letter | 8.5 × 11 in | US buyers |
| A5 | 148 × 210 mm | Protocol cards, quick-reference |

Standard margins: **15mm all sides** (or 0.6in for US Letter).

---

## STANDARD ELEMENTS

### Page Header
```
[Product Title] — Playfair Display Italic, 22pt, #1b3a5c, centred
Thin rule below: 1pt line, color #c8b99a, full page width, 4mm below title
```

### Page Footer
```
© S.A. Ibrahim · Fix Your Gut for Good · [website if applicable]
Font: Lato, 7pt, #9aa3ad, centred
Thin rule above: 0.5pt, #c8c0b4, 4mm above text
```

### Section Box (sidebar / callout)
```
Background: #f5f2ed
Border-left: 3pt solid #c8b99a
Border-top: 0.5pt solid #c8b99a
Border-radius: 0 4px 4px 0
Padding: 12mm left/right, 10mm top/bottom
```

### Table Style
```
Header row: fill #1b3a5c, text white, Lato Bold Uppercase, 8pt, centred
Body rows: alternating #ffffff / #f5f2ed
Cell borders: 0.5pt solid #c8c0b4
Cell padding: 4mm horizontal, 3mm vertical
Body text: Lora Regular, 9pt, #1a1a1a
```

### Eat / Limit / Avoid Color System (food charts)
```
EAT:    background #e8f4ec, border #4a9b6f (soft green) — text: #1a3d29
LIMIT:  background #fff8e8, border #c8a15a (amber)      — text: #3d2e00
AVOID:  background #fdeeed, border #c85a5a (soft red)   — text: #3d0000
```

### Checkboxes / Tracker Cells
```
Size: 6×6mm squares
Border: 1pt solid #1b3a5c
Fill: white
Corner radius: 1px
```

---

## TEMPLATE LIBRARY (build in this order)

### Template 1 — Food Chart (Eat / Limit / Avoid)
- Single page, A4 + US Letter
- Three-column layout with color-coded sections
- Used for: SIBO food list, Low-FODMAP chart, Phase-specific foods
- Build time: ~2 hours first time, ~20 min per new version

### Template 2 — Weekly Meal Planner
- 1–2 pages, A4 + US Letter
- 7-day grid, breakfast / lunch / dinner / snacks rows
- Notes section bottom-right
- Shopping list column on page 2
- Build time: ~3 hours first time, ~30 min per new version

### Template 3 — Symptom + Food Tracker (Daily Log)
- 1 page per day, A4
- Sections: Meals eaten / Symptoms (1–10 scale) / Energy / Sleep / Notes
- Designed to print 30 pages = 30-day tracker
- Build time: ~2 hours

### Template 4 — Protocol Quick-Reference Card
- A5, single page (front + back)
- Front: Phase name + key rules + allowed foods summary
- Back: Common mistakes + what to do when stuck
- Build time: ~2 hours

### Template 5 — Workbook Page (multi-use)
- A4, repeatable interior page
- Heading + intro text block + journaling lines + sidebar box
- Used to build full workbooks by duplicating and varying content
- Build time: ~2 hours, then 10 min per new page

---

## ETSY SHOP STANDARDS

### Shop Name
To be confirmed — should connect to series brand and be searchable.

### Listing Image Specs
- Primary image: 2000 × 2000px square (Etsy requirement)
- Secondary images: same size
- Always show the product in use (flat lay or desk mockup)
- Overlay text: product name + "Instant Download · Printable PDF"
- Mockup background: light wood, marble, or clean white desk

### Pricing Strategy
- Lead products (food chart, tracker): £3–£5 — high volume, low friction
- Core products (meal planner, workbook): £7–£12 — mid-tier
- Bundle: £15–£22 — highest margin
- First product launched at introductory price (25% off) for first 30 days

### Tags — Evergreen for SIBO/Gut Health
Always include a mix of these across listings:
`sibo printable` · `gut health planner` · `low fodmap printable` · `ibs tracker`
`sibo diet chart` · `digestive health journal` · `meal planner printable`
`gut healing protocol` · `sibo food list` · `symptom tracker printable`
`health printable pdf` · `gut health journal` · `fodmap food chart`

---

## EXPORT SETTINGS

For every finished product:
1. File → Download → **PDF Print** (not PDF Standard)
2. Enable "Crop marks and bleed" if Canva Pro
3. Flatten PDF: YES
4. Compress: NO (keep quality for print)
5. Name files: `[product-slug]-A4.pdf` and `[product-slug]-letter.pdf`
6. Zip both sizes together for Etsy upload: `[product-slug]-printable.zip`

---

## PIPELINE TRIGGER

When `digital-product-designer` outputs a complete product spec:
1. Open Canva → New Design → Custom size (set to A4 first)
2. Load brand kit: BookFactory — Gut Health Series
3. Follow the page-by-page layout brief exactly
4. Complete A4 version
5. Duplicate all pages → resize to US Letter → adjust spacing
6. Export both → zip → upload to Etsy
