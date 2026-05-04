#!/usr/bin/env bash
# BookFactory — Genre-Aware PDF Builder v3
# Usage: bash build-pdf.sh [book-folder-name]
# Example: bash build-pdf.sh fix-your-gut-for-good
#          bash build-pdf.sh untitled-cosy-mystery
#
# Per-book overrides: place BOOK-CONFIG.sh in the book folder.
# BOOK-CONFIG.sh sets: TARGET_WORDS, PHASE_NUMBER/NAME/TAGLINE arrays.
# Per-book CSS: place pdf-style.css in the book folder (overrides factory default).
# Per-book PDF config: place .md-to-pdf.json in the book folder (overrides factory default).

set -e

FACTORY="$(cd "$(dirname "$0")" && pwd)"
BOOKS_DIR="$FACTORY/books"
DEFAULT_CSS="$FACTORY/pdf-style.css"
DEFAULT_CONFIG="$FACTORY/.md-to-pdf.json"

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

# ── Per-book configuration ──
# Initialise defaults before sourcing book config
TARGET_WORDS=50000
declare -A PHASE_NUMBER
declare -A PHASE_NAME
declare -A PHASE_TAGLINE

# Source book-specific config if it exists (sets TARGET_WORDS + phase arrays)
if [ -f "$BOOK_DIR/BOOK-CONFIG.sh" ]; then
  source "$BOOK_DIR/BOOK-CONFIG.sh"
fi

# Per-book CSS: book folder wins over factory default
if [ -f "$BOOK_DIR/pdf-style.css" ]; then
  CSS="$BOOK_DIR/pdf-style.css"
  CSS_SOURCE="book"
else
  CSS="$DEFAULT_CSS"
  CSS_SOURCE="factory"
fi

# Per-book PDF config: book folder wins over factory default
if [ -f "$BOOK_DIR/.md-to-pdf.json" ]; then
  CONFIG="$BOOK_DIR/.md-to-pdf.json"
  CONFIG_SOURCE="book"
else
  CONFIG="$DEFAULT_CONFIG"
  CONFIG_SOURCE="factory"
fi

# ── Collect chapters in order: front matter (00-*), main (ch-*), back matter (99-*) ──
CHAPTERS=()
while IFS= read -r -d '' f; do
  CHAPTERS+=("$f")
done < <(find "$MANUSCRIPT" -maxdepth 1 -name "00-*.md" -print0 | sort -z)
while IFS= read -r -d '' f; do
  CHAPTERS+=("$f")
done < <(find "$MANUSCRIPT" -maxdepth 1 -name "ch-*.md" -print0 | sort -z)
while IFS= read -r -d '' f; do
  CHAPTERS+=("$f")
done < <(find "$MANUSCRIPT" -maxdepth 1 -name "99-*.md" -print0 | sort -z)

if [ ${#CHAPTERS[@]} -eq 0 ]; then
  echo "No .md files found in $MANUSCRIPT"
  exit 1
fi

# ── Pipeline approval gate ──
APPROVALS_FILE="$BOOK_DIR/APPROVALS.md"
UNAPPROVED=()
APPROVAL_WARN=0

for f in "${CHAPTERS[@]}"; do
  filename=$(basename "$f")
  [[ "$filename" == 00-00-* ]] && continue
  [[ "$filename" == 00-authors-note* ]] && continue
  [[ "$filename" == 00-introduction* ]] && continue
  if [ -f "$APPROVALS_FILE" ]; then
    if ! grep -q "^| $filename |" "$APPROVALS_FILE" 2>/dev/null; then
      UNAPPROVED+=("$filename")
      APPROVAL_WARN=1
    fi
  else
    UNAPPROVED+=("$filename")
    APPROVAL_WARN=1
  fi
done

# ── Word count per chapter ──
echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║           BOOKFACTORY BUILD REPORT           ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""
echo "  CSS:    $CSS ($CSS_SOURCE)"
echo "  Config: $CONFIG ($CONFIG_SOURCE)"
echo ""

TOTAL_WORDS=0

for f in "${CHAPTERS[@]}"; do
  words=$(wc -w < "$f")
  TOTAL_WORDS=$((TOTAL_WORDS + words))
  printf "  %-35s %5d words\n" "$(basename "$f")" "$words"
done

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

# ── Pipeline approval status ──
if [ $APPROVAL_WARN -eq 1 ]; then
  echo ""
  echo "  ⚠  PIPELINE WARNING: Unapproved chapters detected"
  echo "  ─────────────────────────────────────────────"
  for u in "${UNAPPROVED[@]}"; do
    echo "  ✗  $u — not in APPROVALS.md"
  done
  echo ""
  echo "  Run the pipeline agents, then add entries to APPROVALS.md"
  echo "  before this book goes to final export."
  echo "  ─────────────────────────────────────────────"
else
  echo ""
  echo "  ✓  All chapters approved through 4-agent pipeline"
  echo "  ─────────────────────────────────────────────"
fi
echo ""

# ── Extract book metadata from blueprint ──
BLUEPRINT="$BOOK_DIR/BLUEPRINT.md"

# Try "# BLUEPRINT — Title" format (standard BookFactory header)
# [^A-Za-z]* strips the em dash, en dash, hyphen and surrounding spaces
# regardless of multi-byte encoding — safer than a character class in Git Bash.
BOOK_TITLE=$(grep -m1 "^# BLUEPRINT" "$BLUEPRINT" 2>/dev/null \
  | sed 's/^#[[:space:]]*BLUEPRINT[^A-Za-z]*//' \
  | xargs)

# Fallback: **Title:** format
if [ -z "$BOOK_TITLE" ]; then
  BOOK_TITLE=$(grep -m1 "^\*\*Title:\*\*" "$BLUEPRINT" 2>/dev/null \
    | sed 's/\*\*Title:\*\*[[:space:]]*//' | xargs)
fi

# Final fallback: humanise folder name
if [ -z "$BOOK_TITLE" ]; then
  BOOK_TITLE=$(echo "$BOOK" | sed 's/-/ /g' \
    | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1))substr($i,2)}1')
fi

# Series line (e.g. "The Cathedral Close Mysteries, Book 1")
BOOK_SERIES=$(grep -m1 "^## Series:" "$BLUEPRINT" 2>/dev/null \
  | sed 's/^##[[:space:]]*Series:[[:space:]]*//' | xargs)

# Optional subtitle
BOOK_SUBTITLE=$(grep -m1 "^\*\*Subtitle:\*\*" "$BLUEPRINT" 2>/dev/null \
  | sed 's/\*\*Subtitle:\*\*[[:space:]]*//' | xargs)

# Pre-build optional HTML blocks (empty string = renders nothing)
if [ -n "$BOOK_SERIES" ]; then
  SERIES_BLOCK="<p style=\"font-family: 'EB Garamond', Georgia, serif; font-size: 7.5pt; letter-spacing: 0.22em; text-transform: uppercase; color: #9aa3ad; margin: 0 0 0.45in 0;\">$BOOK_SERIES</p>"
else
  SERIES_BLOCK=""
fi

if [ -n "$BOOK_SUBTITLE" ]; then
  SUBTITLE_BLOCK="<p style=\"font-family: 'EB Garamond', Georgia, serif; font-size: 11pt; font-style: italic; color: #5a6472; line-height: 1.55; margin: 0.35in auto 0 auto; max-width: 3.2in;\">$BOOK_SUBTITLE</p>"
else
  SUBTITLE_BLOCK=""
fi

TMPFILE=$(mktemp /tmp/bookfactory-XXXXXX.md)

# ── Title page ──
# Layout: series line → rule → title (→ optional subtitle) → spacer → author
# Flexbox pushes the author to the lower third of the page.
cat >> "$TMPFILE" << TITLEPAGE
<div style="page-break-after: always; font-family: 'EB Garamond', Georgia, serif; text-align: center; min-height: 6.7in; display: flex; flex-direction: column; align-items: center; padding: 1.3in 0.3in 0.7in 0.3in; box-sizing: border-box;">

<div style="flex: 0 0 auto; width: 100%;">

$SERIES_BLOCK

<div style="width: 1.5in; height: 0.5pt; background: #c8c0b4; margin: 0 auto 0.4in auto;"></div>

<p style="font-family: 'Cormorant Garamond', 'EB Garamond', Georgia, serif; font-size: 34pt; font-weight: 400; font-style: italic; color: #111111; line-height: 1.12; margin: 0 auto; letter-spacing: -0.01em; max-width: 3.8in;">$BOOK_TITLE</p>

$SUBTITLE_BLOCK

<div style="width: 1in; height: 0.5pt; background: #c8c0b4; margin: 0.4in auto 0 auto;"></div>

</div>

<div style="flex: 1 1 auto;"></div>

<div style="flex: 0 0 auto;">
<p style="font-family: 'EB Garamond', Georgia, serif; font-size: 9pt; letter-spacing: 0.2em; text-transform: uppercase; color: #9aa3ad; margin: 0;">S. A. Ibrahim</p>
</div>

</div>

TITLEPAGE

# ── Copyright page ──
COPYRIGHT_FILE="$MANUSCRIPT/00-00-copyright.md"
if [ -f "$COPYRIGHT_FILE" ]; then
  cat "$COPYRIGHT_FILE" >> "$TMPFILE"
  printf "\n\n" >> "$TMPFILE"
fi

# ── Table of contents ──
if [ "${FICTION_GENRE:-false}" = "true" ]; then
  # Fiction: single-column TOC with "CHAPTER N" label + title
  cat >> "$TMPFILE" << TOCHEADER_F
<div style="page-break-after: always; font-family: 'EB Garamond', Georgia, serif; padding-top: 0.55in;">

<p style="font-size: 8pt; letter-spacing: 0.26em; text-transform: uppercase; color: #9aa3ad; margin-bottom: 1.8em; text-align: center;">Contents</p>

TOCHEADER_F

  chap_num=0
  for f in "${CHAPTERS[@]}"; do
    [ "$(basename "$f")" = "00-00-copyright.md" ] && continue
    [ "$(basename "$f")" = "99-back-matter.md" ] && continue
    h2=$(grep -m1 "^## " "$f" 2>/dev/null | sed 's/^## //' || echo "")
    [ -z "$h2" ] && continue
    chap_num=$((chap_num + 1))
    echo "<div style='display: flex; align-items: baseline; margin: 0.2em 0; font-size: 9pt; color: #111;'><span style='flex: 0 0 1.1in; font-size: 7.5pt; color: #9aa3ad; letter-spacing: 0.16em; text-transform: uppercase;'>Chapter $chap_num</span><span style='flex: 1 1 auto;'>$h2</span></div>" >> "$TMPFILE"
  done

  echo "</div>" >> "$TMPFILE"
else
  # Nonfiction: two-line TOC (chapter label + chapter title)
  cat >> "$TMPFILE" << TOCHEADER
<div style="page-break-after: always; font-family: 'EB Garamond', Georgia, serif; padding-top: 0.5in;">

<p style="font-size: 8pt; letter-spacing: 0.22em; text-transform: uppercase; color: #9aa3ad; margin-bottom: 1.5em;">Contents</p>

TOCHEADER

  for f in "${CHAPTERS[@]}"; do
    [ "$(basename "$f")" = "00-00-copyright.md" ] && continue
    h1=$(grep -m1 "^# " "$f" 2>/dev/null | sed 's/^# //' || echo "")
    h2=$(grep -m1 "^## " "$f" 2>/dev/null | sed 's/^## //' || echo "")
    if [ -n "$h1" ] && [ -n "$h2" ]; then
      echo "<p style='margin: 0.4em 0 0.05em 0; font-size: 9.5pt; font-weight: 400; color: #555; text-transform: uppercase; letter-spacing: 0.14em;'>$h1</p>" >> "$TMPFILE"
      echo "<p style='margin: 0 0 0.7em 0; font-size: 10.5pt; font-style: italic; color: #111;'>$h2</p>" >> "$TMPFILE"
    elif [ -n "$h1" ]; then
      echo "<p style='margin: 0.4em 0 0.7em 0; font-size: 10.5pt; color: #111;'>$h1</p>" >> "$TMPFILE"
    fi
  done

  echo "</div>" >> "$TMPFILE"
fi
echo "" >> "$TMPFILE"

# ── Assemble chapters with optional phase separators ──
for f in "${CHAPTERS[@]}"; do
  filename=$(basename "$f")
  [ "$filename" = "00-00-copyright.md" ] && continue

  # Inject phase separator page if this chapter opens a phase
  if [[ -v "PHASE_NUMBER[$filename]" ]]; then
    p_num="${PHASE_NUMBER[$filename]}"
    p_name="${PHASE_NAME[$filename]}"
    p_tag="${PHASE_TAGLINE[$filename]}"
    cat >> "$TMPFILE" << PHASEBREAK

<div style="page-break-before: always; page-break-after: always; text-align: center; padding-top: 2.8in;">

<div style="width: 1.5in; height: 0.5pt; background: #c8c0b4; margin: 0 auto 1em auto;"></div>

<p style="font-family: 'Lato', Helvetica, sans-serif; font-size: 8pt; font-weight: 400; letter-spacing: 0.28em; text-transform: uppercase; color: #9aa3ad; margin: 0 0 0.45em 0;">$p_num</p>

<p style="font-family: 'Playfair Display', Georgia, serif; font-size: 32pt; font-weight: 400; font-style: italic; color: #1b3a5c; line-height: 1.1; margin: 0 0 0.55em 0; letter-spacing: -0.01em;">$p_name</p>

<div style="width: 1in; height: 0.5pt; background: #c8c0b4; margin: 0 auto 0.75em auto;"></div>

<p style="font-family: 'EB Garamond', Georgia, serif; font-size: 10.5pt; font-style: italic; color: #5a6472; line-height: 1.6; margin: 0 auto; max-width: 3.2in;">$p_tag</p>

</div>

PHASEBREAK
  fi

  sed '/^\*Word count:.*Status:.*APPROVED\*/d' "$f" >> "$TMPFILE"
  printf "\n\n" >> "$TMPFILE"
done

# ── Inject small caps opener on chapter opening paragraphs ──
node - "$TMPFILE" << 'NODEOPENER'
const fs = require('fs');
const path = process.argv[2];
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /^(# .+\n## .+\n(?:### .+\n)?)\n+([A-Z*][^\n]{10,})/gm,
  (match, headings, para) => {
    if (para.includes('<span class="opener">')) return match;
    const clean = para.replace(/^\*+/, '').replace(/\*+$/, '');
    const words = clean.split(/\s+/);
    if (words.length <= 5) return match;
    const opener = words.slice(0, 5).join(' ');
    const rest = words.slice(5).join(' ');
    return `${headings}\n<span class="opener">${opener}</span> ${rest}`;
  }
);

fs.writeFileSync(path, content, 'utf8');
NODEOPENER

# ── Pre-render QA: catch pipeline metadata leaking into assembled document ──
QA_ISSUES=0

# Pipeline footer lines
FOOTER_HITS=$(grep -c '^\*Word count:.*Status:' "$TMPFILE" 2>/dev/null || echo 0)
if [ "$FOOTER_HITS" -gt 0 ]; then
  echo "  ⚠ QA: $FOOTER_HITS pipeline footer line(s) still present in assembled document"
  QA_ISSUES=$((QA_ISSUES + FOOTER_HITS))
fi

# Auto-grade markers
GRADE_HITS=$(grep -c 'Auto-grade:' "$TMPFILE" 2>/dev/null || echo 0)
if [ "$GRADE_HITS" -gt 0 ]; then
  echo "  ⚠ QA: $GRADE_HITS Auto-grade marker(s) present in assembled document"
  QA_ISSUES=$((QA_ISSUES + GRADE_HITS))
fi

# Status markers
STATUS_HITS=$(grep -c 'Status: APPROVED\|Status: DRAFT\|Status: REJECTED' "$TMPFILE" 2>/dev/null || echo 0)
if [ "$STATUS_HITS" -gt 0 ]; then
  echo "  ⚠ QA: $STATUS_HITS Status marker(s) present in assembled document"
  QA_ISSUES=$((QA_ISSUES + STATUS_HITS))
fi

if [ "$QA_ISSUES" -eq 0 ]; then
  echo "  ✓ Pre-render QA: assembled document is clean"
else
  echo "  ✗ Pre-render QA: $QA_ISSUES issue(s) found — check build-pdf.sh sed filters"
fi

# ── Build PDF ──
OUTNAME=$(echo "$BOOK" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1))substr($i,2)}1' | tr ' ' '_')
OUTFILE="$EXPORTS/${OUTNAME}.pdf"

echo "  Generating PDF..."
md-to-pdf "$TMPFILE" --stylesheet "$CSS" --config-file "$CONFIG" 2>&1

GENERATED="${TMPFILE%.md}.pdf"
if [ -f "$GENERATED" ]; then
  if mv "$GENERATED" "$OUTFILE" 2>/dev/null; then
    echo ""
    echo "  ✓ PDF saved to: $OUTFILE"
    FINAL_PDF="$OUTFILE"
  else
    STAMPED="$EXPORTS/${OUTNAME}_$(date +%H%M%S).pdf"
    mv "$GENERATED" "$STAMPED"
    echo ""
    echo "  ⚠ Main PDF locked (open in viewer). Saved as: $STAMPED"
    FINAL_PDF="$STAMPED"
  fi
else
  echo "  Error: PDF was not generated."
  rm -f "$TMPFILE"
  exit 1
fi

# ── Suppress headers/footers on chapter opener pages ──
echo "  Suppressing headers on chapter opener pages..."
node "$FACTORY/scripts/suppress-chapter-headers.js" "$FINAL_PDF" 2>&1 || true

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
