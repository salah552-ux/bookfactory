#!/usr/bin/env bash
# BookFactory — Print PDF Builder v1
# Generates a 6"×9" print-ready PDF for KDP and IngramSpark.
# Usage: bash build-print-pdf.sh <book-slug>
# Example: bash build-print-pdf.sh fix-your-gut-for-good

set -e

FACTORY="$(cd "$(dirname "$0")" && pwd)"
BOOKS_DIR="$FACTORY/books"
CSS="$FACTORY/pdf-style.css"

# ── Argument check ──
if [ -z "$1" ]; then
  echo ""
  echo "  BookFactory — Print PDF Builder"
  echo ""
  echo "  Usage: bash build-print-pdf.sh <book-slug>"
  echo "  Example: bash build-print-pdf.sh fix-your-gut-for-good"
  echo ""
  echo "  Available books:"
  for d in "$BOOKS_DIR"/*/; do
    echo "    • $(basename "$d")"
  done
  echo ""
  exit 0
fi

BOOK="$1"
BOOK_DIR="$BOOKS_DIR/$BOOK"
MANUSCRIPT="$BOOK_DIR/manuscript"
EXPORTS="$BOOK_DIR/exports/print"

# ── Validate ──
if [ ! -d "$MANUSCRIPT" ]; then
  echo "Error: No manuscript folder at $MANUSCRIPT"
  exit 1
fi

if [ ! -f "$CSS" ]; then
  echo "Error: Print stylesheet not found at $CSS"
  exit 1
fi

# ── Check md-to-pdf ──
if ! command -v md-to-pdf &>/dev/null; then
  echo ""
  echo "  ERROR: md-to-pdf is not installed or not in PATH."
  echo ""
  echo "  To install globally:"
  echo "    npm install -g md-to-pdf"
  echo ""
  echo "  Then re-run:"
  echo "    bash build-print-pdf.sh $BOOK"
  echo ""
  exit 1
fi

mkdir -p "$EXPORTS"

# ── Collect chapters in order ──
CHAPTERS=()
while IFS= read -r -d '' f; do
  CHAPTERS+=("$f")
done < <(find "$MANUSCRIPT" -maxdepth 1 -name "*.md" -print0 | sort -z)

if [ ${#CHAPTERS[@]} -eq 0 ]; then
  echo "No .md files found in $MANUSCRIPT"
  exit 1
fi

# ── Extract metadata from blueprint ──
BLUEPRINT="$BOOK_DIR/BLUEPRINT.md"
BOOK_TITLE=$(grep -m1 "^\*\*Title:\*\*" "$BLUEPRINT" 2>/dev/null \
  | sed 's/\*\*Title:\*\* *//' || echo "$BOOK")

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║        BOOKFACTORY — PRINT PDF BUILD         ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""
echo "  Book:   $BOOK_TITLE"
echo "  Trim:   6\" × 9\""
echo "  CSS:    $CSS"
echo "  Output: $EXPORTS"
echo ""

# ── Assemble manuscript into one temp file ──
TMPFILE=$(mktemp /tmp/bookfactory-print-XXXXXX.md)

# Title page
cat >> "$TMPFILE" << TITLEPAGE
<div style="page-break-after: always; text-align: center; padding-top: 2in; font-family: Georgia, serif;">

<p style="font-size: 28pt; font-weight: bold; color: #000; line-height: 1.15; margin: 0 0 0.4in 0;">$BOOK_TITLE</p>

<hr style="width: 1.5in; border: none; border-top: 0.5pt solid #aaa; margin: 0 auto 0.4in auto;">

<p style="font-size: 11pt; color: #444; font-style: italic; margin: 0;">S.A. Ibrahim</p>

</div>

TITLEPAGE

# Copyright page (if it exists)
COPYRIGHT_FILE="$MANUSCRIPT/00-00-copyright.md"
if [ -f "$COPYRIGHT_FILE" ]; then
  cat "$COPYRIGHT_FILE" >> "$TMPFILE"
  printf "\n\n" >> "$TMPFILE"
fi

# Chapters (skip copyright — already injected above)
for f in "${CHAPTERS[@]}"; do
  filename=$(basename "$f")
  [ "$filename" = "00-00-copyright.md" ] && continue
  cat "$f" >> "$TMPFILE"
  printf "\n\n" >> "$TMPFILE"
done

# ── Build output filename ──
OUTNAME=$(echo "$BOOK" | sed 's/-/ /g' \
  | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1))substr($i,2)}1' \
  | tr ' ' '_')
TIMESTAMP=$(date +%H%M%S)
OUTFILE="$EXPORTS/${OUTNAME}_print.pdf"
STAMPED="$EXPORTS/${OUTNAME}_print_${TIMESTAMP}.pdf"

# ── Generate PDF ──
echo "  Generating print PDF via md-to-pdf..."
md-to-pdf "$TMPFILE" --stylesheet "$CSS" 2>&1

GENERATED="${TMPFILE%.md}.pdf"

if [ -f "$GENERATED" ]; then
  if mv "$GENERATED" "$OUTFILE" 2>/dev/null; then
    echo ""
    echo "  ✓ Print PDF saved to: $OUTFILE"
  else
    mv "$GENERATED" "$STAMPED"
    echo ""
    echo "  ⚠ Main file locked. Saved as: $STAMPED"
  fi
else
  echo "  Error: PDF was not generated. Check md-to-pdf output above."
  rm -f "$TMPFILE"
  exit 1
fi

rm -f "$TMPFILE"

echo ""
echo "  ─────────────────────────────────────────────"
echo "  KDP UPLOAD NOTES:"
echo "    • Upload $OUTFILE directly to KDP."
echo "    • KDP accepts standard PDF (Puppeteer output is fine)."
echo ""
echo "  INGRAMSPARK NOTES:"
echo "    • IngramSpark requires PDF/X-1a."
echo "    • Open in Adobe Acrobat → File → Save As Other → PDF/X → PDF/X-1a:2001"
echo "    • Or use Ghostscript:"
echo "      gs -dPDFX=1a -dBATCH -dNOPAUSE -sDEVICE=pdfwrite \\"
echo "         -sOutputFile=output_PDFX1a.pdf $OUTFILE"
echo "  ─────────────────────────────────────────────"
echo ""
