#!/usr/bin/env bash
# BookFactory — Smart PDF Builder v2
# Usage: bash build-pdf.sh [book-folder-name]
# Example: bash build-pdf.sh fix-your-gut-for-good

set -e

FACTORY="$(cd "$(dirname "$0")" && pwd)"
BOOKS_DIR="$FACTORY/books"
CSS="$FACTORY/pdf-style.css"
CONFIG="$FACTORY/.md-to-pdf.json"

# ── Phase separator config (fix-your-gut-for-good) ──
declare -A PHASE_STARTS
PHASE_STARTS["01-chapter-1.md"]="PHASE ONE\n\nASSESSMENT"
PHASE_STARTS["05-chapter-5.md"]="PHASE TWO\n\nERADICATION"
PHASE_STARTS["07-chapter-7.md"]="PHASE THREE\n\nREPAIR"
PHASE_STARTS["09-chapter-9.md"]="PHASE FOUR\n\nROOT CAUSE RESOLUTION"

# ── List books if no argument ──
if [ -z "$1" ]; then
  echo ""
  echo "  BookFactory — Available books:"
  echo ""
  for d in "$BOOKS_DIR"/*/; do
    name=$(basename "$d")
    total_words=0
    count=0
    for f in "$d/manuscript/"*.md; do
      [ -f "$f" ] || continue
      w=$(wc -w < "$f")
      total_words=$((total_words + w))
      count=$((count + 1))
    done
    echo "  • $name  ($count chapters, ~$total_words words)"
  done
  echo ""
  echo "  Usage: bash build-pdf.sh <book-folder-name>"
  echo ""
  exit 0
fi

BOOK="$1"
BOOK_DIR="$BOOKS_DIR/$BOOK"
MANUSCRIPT="$BOOK_DIR/manuscript"
EXPORTS="$BOOK_DIR/exports"

# ── Validate ──
if [ ! -d "$MANUSCRIPT" ]; then
  echo "Error: No manuscript folder at $MANUSCRIPT"
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

# ── Word count per chapter ──
echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║           BOOKFACTORY BUILD REPORT           ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""

TARGET_WORDS=50000
TOTAL_WORDS=0

for f in "${CHAPTERS[@]}"; do
  words=$(wc -w < "$f")
  TOTAL_WORDS=$((TOTAL_WORDS + words))
  printf "  %-35s %5d words\n" "$(basename "$f")" "$words"
done

# Progress bar
PERCENT=$((TOTAL_WORDS * 100 / TARGET_WORDS))
BARS=$((PERCENT / 5))
BAR=""
for ((i=0; i<20; i++)); do
  if [ $i -lt $BARS ]; then BAR="${BAR}█"; else BAR="${BAR}░"; fi
done

echo ""
echo "  ─────────────────────────────────────────────"
printf "  Total: %d / %d words (%d%%)\n" "$TOTAL_WORDS" "$TARGET_WORDS" "$PERCENT"
echo "  [$BAR]"
echo "  ─────────────────────────────────────────────"
echo ""

# ── Extract book metadata from blueprint ──
BLUEPRINT="$BOOK_DIR/BLUEPRINT.md"
BOOK_TITLE=$(grep -m1 "^\*\*Title:\*\*" "$BLUEPRINT" 2>/dev/null | sed 's/\*\*Title:\*\* *//' || echo "$BOOK")
BOOK_SUBTITLE=$(grep -m1 "^\*\*Subtitle:\*\*" "$BLUEPRINT" 2>/dev/null | sed 's/\*\*Subtitle:\*\* *//' || echo "")

TMPFILE=$(mktemp /tmp/bookfactory-XXXXXX.md)

# ── Title page ──
cat >> "$TMPFILE" << TITLEPAGE
<div style="page-break-after: always; text-align: center; padding-top: 2.2in; font-family: 'Lato', Helvetica, sans-serif;">

<p style="font-size: 9pt; letter-spacing: 0.2em; text-transform: uppercase; color: #aaa; margin-bottom: 0.5in;">BookFactory Draft Manuscript</p>

<h1 style="font-size: 34pt; font-weight: 900; color: #1a1a2e; text-transform: uppercase; letter-spacing: 0.05em; border: none; margin: 0 0 0.25in 0; page-break-before: avoid;">$BOOK_TITLE</h1>

<p style="font-size: 12pt; color: #666; font-style: italic; max-width: 4in; margin: 0 auto 3in auto; line-height: 1.5;">$BOOK_SUBTITLE</p>

</div>

TITLEPAGE

# ── Table of contents ──
cat >> "$TMPFILE" << TOCHEADER
<div style="page-break-after: always; font-family: 'Lato', Helvetica, sans-serif; padding-top: 0.5in;">

<h2 style="font-size: 10pt; letter-spacing: 0.2em; text-transform: uppercase; color: #aaa; border: none; margin-bottom: 1.5em;">Contents</h2>

TOCHEADER

for f in "${CHAPTERS[@]}"; do
  h1=$(grep -m1 "^# " "$f" 2>/dev/null | sed 's/^# //' || echo "")
  h2=$(grep -m1 "^## " "$f" 2>/dev/null | sed 's/^## //' || echo "")
  if [ -n "$h1" ] && [ -n "$h2" ]; then
    echo "<p style='margin: 0.5em 0 0.1em 0; font-size: 10pt; font-weight: 700; color: #1a1a2e;'>$h1</p>" >> "$TMPFILE"
    echo "<p style='margin: 0 0 0.8em 1em; font-size: 9pt; color: #666; font-style: italic;'>$h2</p>" >> "$TMPFILE"
  elif [ -n "$h1" ]; then
    echo "<p style='margin: 0.5em 0 0.8em 0; font-size: 10pt; font-weight: 700; color: #1a1a2e;'>$h1</p>" >> "$TMPFILE"
  fi
done

echo "</div>" >> "$TMPFILE"
echo "" >> "$TMPFILE"

# ── Assemble chapters with phase separators ──
for f in "${CHAPTERS[@]}"; do
  filename=$(basename "$f")

  # Check if this chapter starts a new phase
  if [[ -v "PHASE_STARTS[$filename]" ]]; then
    phase_title="${PHASE_STARTS[$filename]}"
    cat >> "$TMPFILE" << PHASEBREAK

<div style="page-break-before: always; page-break-after: always; text-align: center; padding-top: 3.5in; font-family: 'Lato', Helvetica, sans-serif;">
<p style="font-size: 32pt; font-weight: 900; letter-spacing: 0.1em; color: #1a1a2e; line-height: 1.1; text-transform: uppercase;">${phase_title/\\n/<br>}</p>
</div>

PHASEBREAK
  fi

  cat "$f" >> "$TMPFILE"
  printf "\n\n" >> "$TMPFILE"
done

# ── Build PDF ──
OUTNAME=$(echo "$BOOK" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1))substr($i,2)}1' | tr ' ' '_')
OUTFILE="$EXPORTS/${OUTNAME}.pdf"

echo "  Generating PDF..."
md-to-pdf "$TMPFILE" --stylesheet "$CSS" --config-file "$CONFIG" 2>&1

GENERATED="${TMPFILE%.md}.pdf"
if [ -f "$GENERATED" ]; then
  # Handle locked file — use timestamp suffix if needed
  if mv "$GENERATED" "$OUTFILE" 2>/dev/null; then
    echo ""
    echo "  ✓ PDF saved to: $OUTFILE"
  else
    STAMPED="$EXPORTS/${OUTNAME}_$(date +%H%M%S).pdf"
    mv "$GENERATED" "$STAMPED"
    echo ""
    echo "  ⚠ Main PDF locked (open in viewer). Saved as: $STAMPED"
    echo "  Close the PDF viewer and rename if needed."
  fi
else
  echo "  Error: PDF was not generated."
  rm -f "$TMPFILE"
  exit 1
fi

# ── Update STATUS.md ──
STATUS_FILE="$BOOK_DIR/STATUS.md"
cat > "$STATUS_FILE" << STATUSEOF
# $(echo "$BOOK_TITLE") — Build Status
*Last built: $(date '+%Y-%m-%d %H:%M')*

## Word Count Progress

| Chapter | Words |
|---------|-------|
STATUSEOF

for f in "${CHAPTERS[@]}"; do
  words=$(wc -w < "$f")
  echo "| $(basename "$f" .md) | $words |" >> "$STATUS_FILE"
done

cat >> "$STATUS_FILE" << STATUSEOF2

| **TOTAL** | **$TOTAL_WORDS / $TARGET_WORDS** |

Progress: [$BAR] $PERCENT%
STATUSEOF2

rm -f "$TMPFILE"
echo ""
echo "  ✓ Status updated: $STATUS_FILE"
echo ""
