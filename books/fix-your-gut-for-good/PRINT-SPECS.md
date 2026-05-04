# Fix Your Gut for Good — Print Specifications
*Generated: 2026-04-18*

---

## Trim & Page Count

| Item | Value |
|---|---|
| Trim size | 6" × 9" (KDP standard trade nonfiction) |
| Word count | 48,285 words |
| Estimated pages (conservative @ 265 wpp) | ~182 pages |
| Estimated pages (standard @ 230 wpp) | ~210 pages |
| Recommended KDP page count entry | 182–210 pages |

---

## Spine Width Formula

> **Formula:** page_count × 0.002252" (KDP 60lb white paper)

| Page Count | Spine Width |
|---|---|
| 182 pages (conservative) | 182 × 0.002252 = **0.41"** |
| 210 pages (standard) | 210 × 0.002252 = **0.47"** |

Use the actual page count from your generated PDF for the final spine calculation.
KDP's cover calculator will compute this automatically when you enter the page count.

---

## Interior Margins

| Margin | Value | Notes |
|---|---|---|
| Gutter (binding side) | 0.75" | Supports up to 500 pages — IngramSpark conservative standard |
| Outside (facing edge) | 0.5" | |
| Top | 0.75" | |
| Bottom | 0.75" | |
| Bleed | None | Text-only interior — no bleed required |

---

## Typography

| Element | Spec |
|---|---|
| Body font | Georgia 11pt |
| Line height | 1.4 (14pt leading) |
| Paragraph indent | 1.5em |
| Text alignment | Justified with hyphens |
| Chapter number (h1) | 18pt bold, centered, page-break-before: always |
| Chapter title (h2) | 14pt bold, centered |
| Section heading (h3) | 12pt bold |
| Drop caps | First letter of each chapter opener — 3.5em float:left |
| Orphans/widows | 2 lines minimum |

---

## Running Headers

| Page side | Header content |
|---|---|
| Left pages (verso) | Chapter title |
| Right pages (recto) | Book title: *Fix Your Gut for Good* |
| Chapter opener pages | No running header |

---

## Files

| File | Path |
|---|---|
| Print stylesheet | `c:/Users/salah/BookFactory/pdf-style-print.css` |
| Print build script | `c:/Users/salah/BookFactory/build-print-pdf.sh` |
| Print PDF output (target) | `c:/Users/salah/BookFactory/books/fix-your-gut-for-good/exports/print/Fix_Your_Gut_For_Good_print.pdf` |
| Ebook stylesheet (separate) | `c:/Users/salah/BookFactory/pdf-style.css` |
| Ebook build script (separate) | `c:/Users/salah/BookFactory/build-pdf.sh` |

---

## Build Command

```bash
bash c:/Users/salah/BookFactory/build-print-pdf.sh fix-your-gut-for-good
```

### If md-to-pdf is not yet installed:

```bash
npm install -g md-to-pdf
bash c:/Users/salah/BookFactory/build-print-pdf.sh fix-your-gut-for-good
```

---

## KDP Compatibility

| Platform | Status | Notes |
|---|---|---|
| KDP Paperback | **Pending md-to-pdf** | KDP accepts standard PDF — Puppeteer output is compatible |
| IngramSpark | **PDF/X-1a conversion required** | Puppeteer output is not PDF/X compliant |

### IngramSpark PDF/X-1a Conversion

**Option A — Adobe Acrobat (recommended):**
1. Open the generated print PDF in Adobe Acrobat Pro
2. File → Save As Other → More Options → PDF/X
3. Select **PDF/X-1a:2001**
4. Save as a new file

**Option B — Ghostscript (free):**
```bash
gs -dPDFX=1a -dBATCH -dNOPAUSE -sDEVICE=pdfwrite \
   -sOutputFile=Fix_Your_Gut_For_Good_print_PDFX1a.pdf \
   Fix_Your_Gut_For_Good_print.pdf
```

---

## IngramSpark Cover Notes

When ordering the IngramSpark cover template, enter:
- **Trim:** 6" × 9"
- **Page count:** [use actual PDF page count]
- **Paper:** 60lb white (standard)
- **Spine width:** calculated above (0.41"–0.47" estimated)

IngramSpark's online cover template generator will recalculate the exact spine once you input the final page count.

---

## Checklist Before Upload

- [ ] Run `bash build-print-pdf.sh fix-your-gut-for-good` and confirm PDF generates
- [ ] Open PDF and verify: 6×9 trim, correct margins, running headers, drop caps
- [ ] Confirm actual page count from PDF
- [ ] Recalculate spine: page_count × 0.002252"
- [ ] For KDP: upload PDF directly (no conversion needed)
- [ ] For IngramSpark: convert to PDF/X-1a before upload
