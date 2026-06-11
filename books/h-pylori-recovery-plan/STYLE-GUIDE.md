# Style Guide — The H. Pylori Recovery Plan

**SERIES-LOCKED GUIDE.** This book is Book 3 of *Fix Your Gut for Good*. Per
manuscript-style-designer Step 0, the interior design is **not generated from
scratch** — `pdf-style.css` and `.md-to-pdf.json` are verbatim copies of the
canonical locked design style (`BookFactory/pdf-style.css`,
`BookFactory/.md-to-pdf.json`, verified 2026-04-19). Any future change requires
updating the canonical file first, then re-copying to every series book.

---

## 1. Profile
**NONFICTION-HEALTH.** Genre detected from BLUEPRINT.md ("Health Nonfiction",
H. pylori / gut / medical) → NONFICTION-HEALTH profile. Matches Book 1 and Book 2.

## 2. Typeface decisions
- **Body:** EB Garamond — warm, Palatino-class serif, reads for hours without
  fatigue; signals authority and human warmth for health nonfiction.
- **Display (chapter titles, drop cap):** Playfair Display — high-contrast serif,
  instantly recognisable, communicates editorial precision.
- **Labels (chapter labels, callout titles, TOC, B-heads):** Lato — clean
  geometric sans, used for small-caps labels and structural wayfinding.

## 3. Page dimensions
6 × 9 inches — the US/UK health nonfiction trade paperback standard. Body text
block max-width 4.875in; page margins 0.75in top/bottom, 0.875in gutter (inside),
0.5in outside (PDF config uses 0.85in top/bottom for header/footer breathing room).

## 4. Colour palette
| Variable | Hex | Purpose |
|---|---|---|
| `--ink` | #000000 | Body text — true black for KDP print |
| `--accent` | #1b3a5c | Headings, chapter title, drop cap (navy — locked) |
| `--rule` | #1b3a5c | Accent bar on section heads |
| `--muted` | #5a6472 | Subtitles, captions |
| `--light` | #9aa3ad | Chapter label |
| `--divider` | #c8c0b4 | Ornamental dividers |
| `--sidebar-bg` | #f5f2ed | Callout box background |
| `--sidebar-border` | #c8b99a | Callout box border (warm tan — locked) |

## 5. Chapter heading structure
- `# Chapter 1` → H1: Lato 8pt uppercase, letter-spacing 0.28em, muted grey,
  centred, margin-top 2.5in, thin #c8c0b4 rule above (the chapter label).
- `## What H. Pylori Actually Is...` → h1 + h2: Playfair Display 26pt italic
  navy (#1b3a5c), centred (the chapter title).
- Standalone `## SECTION` → B-head: Lato 8.5pt uppercase, navy left bar.
- Standalone `### Section` → C-head: Lato 10pt italic muted.

## 6. Scene / section break
`---` renders as `──── ✦ ────` (rule + ornament + rule), Lato 8pt #c8c0b4. The
prestige-nonfiction divider used across the series. Never use `***` or `* * *`.

## 7. Blockquote
`>` renders as a **sidebar callout box** — #f5f2ed background, 3pt #c8b99a
left border, 0.5pt top border. Used for callouts / key-takeaway boxes, not
literary epigraphs.

## 8. Drop cap
Playfair Display 700, 3.2em, navy (#1b3a5c), float left — appears on the first
paragraph after each chapter title only.

## 9. Running headers / footers
- Header (centred): "The H. Pylori Recovery Plan", Georgia 7pt, #aaa, uppercase,
  letter-spacing 0.18em — suppressed on chapter opener pages.
- Footer (right-aligned): page number, Georgia 7pt, #aaa.

## 10. How to change it
Because this is a series-locked guide, **do not edit this book's `pdf-style.css`
in isolation** — that creates visual drift between siblings. To change a colour
or font: edit the canonical `BookFactory/pdf-style.css` first, then re-copy to
every book in the series. To change page size: edit both the canonical
`pdf-style.css` (@page) and `.md-to-pdf.json`. Never edit the factory defaults
only for one book.

---

**Build command:** `bash build-pdf.sh h-pylori-recovery-plan` (PDF) +
`bash build-manuscript.sh h-pylori-recovery-plan` (EPUB + DOCX).
