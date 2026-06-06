# Style Guide — The 7-Day Gut Reset
## manuscript-style-designer | Stage 06-production | 2026-05-14

---

## 1. Profile Selected

**Profile: NONFICTION-HEALTH**

"The 7-Day Gut Reset" maps to the NONFICTION-HEALTH profile because its genre keywords — "gut," "health," "reset," "digestive" — match the profile's health/wellness/nutrition/gut trigger pattern directly (see manuscript-style-designer spec, Step 2 genre table).

---

## 2. Typeface Decisions

| Role | Font | Rationale |
|------|------|-----------|
| Body text | EB Garamond (400, 500; roman + italic) | Warm, authoritative serif. Signals trust and depth without clinical coldness. Reads comfortably at 11pt for extended passages. |
| Display (chapter titles) | Playfair Display (400, 700; roman + italic) | High-contrast, elegant serif. The italic weight at 26pt carries authority while avoiding the coldness of a medical textbook. Locked brand standard: Playfair Display for all Fix Your Gut headings. |
| Labels / UI elements | Lato (300, 400, 700) | Clean, neutral sans-serif for chapter labels, B-heads, callout box titles, and running headers. Creates hierarchy contrast against the serif body without breaking tonal warmth. |

**Google Fonts URL used:**
```
https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap
```

---

## 3. Page Dimensions

**Trim size: 6 × 9 inches**

The US/UK health and wellness nonfiction standard. At 6×9, the text block (4.625in wide after margins) supports comfortable reading of instructional content with room for sidebar callout boxes. KDP supports 6×9 for both print and EPUB conversion without reformatting.

**Margins:**
- Top: 0.75in
- Bottom: 0.75in
- Inner (gutter): 0.875in — accommodates binding without text crowding into the spine
- Outer: 0.5in

---

## 4. Colour Palette

| Variable | Hex | Purpose |
|----------|-----|---------|
| `--ink` | `#000000` | Body text — true black for KDP print fidelity |
| `--accent` | `#1b3a5c` | Navy — chapter titles (h2), B-head borders, drop cap, rule above chapter label. **Locked brand value — do not change.** |
| `--rule` | `#1b3a5c` | Rule line above chapter label — matches accent |
| `--muted` | `#5a6472` | Subtitles, C-heads, blockquote attribution |
| `--light` | `#9aa3ad` | Chapter number labels — recedes, doesn't compete |
| `--divider` | `#c8c0b4` | Scene break ornament — warm, organic |
| `--sidebar-bg` | `#f5f2ed` | Callout box background — cream, warm |
| `--sidebar-border` | `#c8b99a` | Callout box border — **locked brand value (design_style_locked.md)** |

---

## 5. Chapter Heading Structure

The chapter heading system uses a three-level cascade:

```
# DAY ONE                               ← h1: chapter label
## The 24-Hour Trigger Log              ← h2: chapter title (Playfair Display, navy, italic)
### Optional deck subtitle              ← h3: subtitle (EB Garamond italic, muted)
```

**What each renders as:**

- **h1** — Lato 300, 8pt, uppercase, letter-spacing 0.22em, `#9aa3ad`, 2.5in margin-top, 1.5pt navy rule above. Sits at the top of the chapter "air gap."
- **h1 + h2** — Playfair Display 700 italic, 26pt, navy `#1b3a5c`, letter-spacing -0.01em. This is the visual centrepiece of the chapter opener.
- **h1 + h2 + h3** — EB Garamond 400 italic, 11pt, muted `#5a6472`, 1.35in margin-bottom. Creates breathing room before body text begins.
- **Standalone h2** (B-head, within chapter) — Lato 700, 8.5pt, uppercase, letter-spacing 0.16em, navy, 2.5pt navy left border. Used for named sections within a day (e.g., "Column 1 — Time").
- **Standalone h3** (C-head) — Lato 400 italic, 10pt, muted. Sub-section label; does not need left border.

---

## 6. Scene Break

**Markdown:** `---`
**Renders as:** `──── ✦ ────` (em-rule + star ornament + em-rule)
**Colour:** `#c8c0b4` (warm tan, same family as sidebar border)
**Margin:** 0.45in above and below

Used between major sections within a chapter (e.g., after explaining the 5-column log, before the "things to keep in mind" block in Day 1). In health nonfiction the scene break divides instructional blocks without implying a narrative time-jump.

---

## 7. Blockquote

**Function in this genre:** Sidebar callout box — not an epigraph.

Health nonfiction readers scan before they read linearly. The blockquote/callout box signals: "stop here, this is a summary, a protocol step, or a key takeaway." Every blockquote in this manuscript should contain actionable content the reader will want to return to.

**Visual spec:** Cream background `#f5f2ed`, warm tan left border 3pt `#c8b99a` (locked brand value), warm tan top border 0.5pt. Padding 1.1em × 1.4em. The last paragraph inside a blockquote renders in Lato 700 small-caps for attribution or label.

---

## 8. Drop Cap

**Where it appears:** First letter of the very first paragraph in each chapter (after h1 + h2, or after h1 + h2 + h3 if a deck is present).

**Font:** Playfair Display 700 (matching the chapter title font — visual continuity)
**Size:** 3.2em
**Colour:** Navy `#1b3a5c` (the accent colour — signals "this is where the chapter starts")
**Float:** Left, with negative line-height adjustment to sit correctly on the first two lines

No drop cap appears on paragraphs mid-chapter or after scene breaks. One per chapter only.

---

## 9. Running Headers and Footers

**Header:** Book title ("The 7-Day Gut Reset"), centred, Lato 300, 6.5pt, uppercase, letter-spacing 0.22em, `#9aa3ad`. Defined in `.md-to-pdf.json` `headerTemplate`.

**Footer:** Page number, right-aligned, Lato, 7pt, `#9aa3ad`. Defined in `.md-to-pdf.json` `footerTemplate`.

**Chapter opener pages:** Headers are suppressed on chapter openers by `suppress-chapter-headers.js` (or equivalent build script). The chapter label (h1) itself provides visual orientation — a running header above it is redundant and clutters the opener page.

---

## 10. How to Change It

If you need to adjust a colour or font, edit `pdf-style.css` — change the relevant CSS custom property in the `:root` block at the top of the file. All downstream rules inherit from those variables; you do not need to hunt through the entire stylesheet.

If you need to change the page size, edit **both** `pdf-style.css` (the `@page` rule) **and** `.md-to-pdf.json` (`pdf_options.width` and `pdf_options.height`) — the two must stay in sync.

If you need to change the word count target, edit `BOOK-CONFIG.sh` — change `TARGET_WORDS`.

**Never edit the factory defaults** in `BookFactory/pdf-style.css` or `BookFactory/.md-to-pdf.json`. Those are the factory templates. This book's style files live in `books/the-7-day-gut-reset/` only.

---

*Sources: manuscript-style-designer spec (NONFICTION-HEALTH profile), design_style_locked.md (Playfair Display, #1b3a5c navy, #c8b99a blockquote border — all locked 2026-04-19), BLUEPRINT.md (5,500 word count target, genre: health nonfiction).*
