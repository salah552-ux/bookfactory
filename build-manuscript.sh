#!/usr/bin/env bash
# build-manuscript.sh — builds EPUB and DOCX directly from markdown source
# Usage: bash build-manuscript.sh <book-slug>
#
# Source of truth is always manuscript/*.md files.
# EPUB and DOCX are derived outputs — never edit them manually.
# Always re-run this script after any markdown file changes.

set -e

FACTORY="$(cd "$(dirname "$0")" && pwd)"
BOOK="${1:-}"

if [ -z "$BOOK" ]; then
  echo "Usage: bash build-manuscript.sh <book-slug>"
  echo "Example: bash build-manuscript.sh death-in-the-cathedral-close"
  exit 1
fi

BOOK_DIR="$FACTORY/books/$BOOK"
MANUSCRIPT="$BOOK_DIR/manuscript"
FINAL="$BOOK_DIR/exports/final"

if [ ! -d "$BOOK_DIR" ]; then
  echo "Error: Book not found at $BOOK_DIR"
  exit 1
fi

mkdir -p "$FINAL"

# ── Check Pandoc (Windows PATH workaround) ────────────────────────────────────
PANDOC=""
if command -v pandoc &>/dev/null; then
  PANDOC="pandoc"
elif [ -f "/c/Users/salah/AppData/Local/Pandoc/pandoc.exe" ]; then
  PANDOC="/c/Users/salah/AppData/Local/Pandoc/pandoc.exe"
elif [ -f "/c/Program Files/Pandoc/pandoc.exe" ]; then
  PANDOC="/c/Program Files/Pandoc/pandoc.exe"
else
  echo "Error: Pandoc not found. Run: winget install JohnMacFarlane.Pandoc"
  exit 1
fi

# ── Extract metadata ──────────────────────────────────────────────────────────
# Title source priority (canonical → fallback):
#   1. pipeline-state.json "book_title"  — the canonical, gated value
#   2. BLUEPRINT.md H1 "# BLUEPRINT — <title>"
#   3. slug, title-cased
# Preferring pipeline-state.json prevents a doc-header working label (e.g. a
# "(PROSE REBUILD)" suffix on the BLUEPRINT H1) from leaking into the built
# EPUB/DOCX title metadata. Fix: 2026-06-28.
BLUEPRINT="$BOOK_DIR/BLUEPRINT.md"
STATE="$BOOK_DIR/pipeline-state.json"
BOOK_TITLE=""
if [ -f "$STATE" ]; then
  # Extract the value of the first top-level "book_title" key (not book_subtitle).
  BOOK_TITLE=$(grep -m1 '"book_title"[[:space:]]*:' "$STATE" \
    | sed 's/.*"book_title"[[:space:]]*:[[:space:]]*"//' \
    | sed 's/".*//' || echo "")
fi
if [ -z "$BOOK_TITLE" ] && [ -f "$BLUEPRINT" ]; then
  BOOK_TITLE=$(grep -m1 "^# BLUEPRINT" "$BLUEPRINT" | sed 's/^# BLUEPRINT — //' | sed 's/^# BLUEPRINT: //' || echo "")
fi
if [ -z "$BOOK_TITLE" ]; then
  BOOK_TITLE=$(echo "$BOOK" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1))substr($i,2)}1')
fi

# Source book config for any overrides
[ -f "$BOOK_DIR/BOOK-CONFIG.sh" ] && source "$BOOK_DIR/BOOK-CONFIG.sh" 2>/dev/null || true

BOOK_AUTHOR="S. A. Ibrahim"

echo ""
echo "  Building manuscript outputs for: $BOOK_TITLE"
echo "  Author: $BOOK_AUTHOR"
echo "  Source: $MANUSCRIPT"
echo "  Output: $FINAL"
echo ""

# ── Collect files in canonical order ─────────────────────────────────────────
# Supports two naming conventions:
#   ch-*.md + 99-*.md   (cosy mystery / fiction convention)
#   [0-9][0-9]-*.md     (numeric prefix convention — health guides: 00-..99-)
# Detects fiction (ch-*) first. If no ch-*.md exist, the book uses the numeric
# convention, in which case a SINGLE [0-9][0-9]-*.md glob captures front matter
# (00-), all main chapters (01-..NN-, incl. 10+), and back matter (99-) in
# sorted order. The 99-*.md line must only run for the fiction convention —
# otherwise it pre-populates FILES and suppresses the numeric branch, dropping
# every 00-..NN- chapter from the EPUB/DOCX (bug fixed 2026-06-11).

FILES=()
while IFS= read -r -d '' f; do
  FILES+=("$f")
done < <(find "$MANUSCRIPT" -maxdepth 1 -name "ch-*.md" -print0 | sort -z)

if [ ${#FILES[@]} -gt 0 ]; then
  # Fiction convention: ch-*.md main chapters + 99-*.md back matter
  while IFS= read -r -d '' f; do
    FILES+=("$f")
  done < <(find "$MANUSCRIPT" -maxdepth 1 -name "99-*.md" -print0 | sort -z)
else
  # Numeric convention: one glob captures 00-..99- in sorted order
  while IFS= read -r -d '' f; do
    FILES+=("$f")
  done < <(find "$MANUSCRIPT" -maxdepth 1 -name "[0-9][0-9]-*.md" -print0 | sort -z)
fi

if [ ${#FILES[@]} -eq 0 ]; then
  echo "Error: No chapter files found in $MANUSCRIPT"
  echo "Expected: ch-*.md / 99-*.md (fiction) or 00-*.md..09-*.md (numeric)"
  exit 1
fi

echo "  Files: ${#FILES[@]} content files collected"

# ── Strip agent metadata footers into temp files ──────────────────────────────
# Chapter files end with: --- \n *Word count: X | Auto-grade: X | Status: ...*
# Pandoc treats the --- as YAML when concatenating files — strip it before build.
TMPDIR_CLEAN=$(mktemp -d)
CLEAN_FILES=()
for f in "${FILES[@]}"; do
  base=$(basename "$f")
  tmpf="$TMPDIR_CLEAN/$base"
  # Remove trailing metadata block: the last --- separator and the Word count line
  sed '/^---$/,/^\*Word count:/{ /^---$/d; /^\*Word count:/d }' "$f" > "$tmpf"
  CLEAN_FILES+=("$tmpf")
done
trap "rm -rf '$TMPDIR_CLEAN'" EXIT

# ── Cover image ───────────────────────────────────────────────────────────────
COVER="$FINAL/cover-kdp.jpg"
if [ ! -f "$COVER" ]; then
  echo "  ERROR: cover-kdp.jpg not found at $COVER — refusing to build a coverless EPUB."
  echo "  Place the approved cover at $COVER and re-run."
  exit 1
fi
COVER_FLAG="--epub-cover-image=$COVER"

# ── Generate EPUB ─────────────────────────────────────────────────────────────
echo "  Generating EPUB..."
"$PANDOC" "${CLEAN_FILES[@]}" \
  ${COVER_FLAG:+"$COVER_FLAG"} \
  --split-level=1 \
  --toc \
  --toc-depth=1 \
  --metadata title="$BOOK_TITLE" \
  --metadata author="$BOOK_AUTHOR" \
  --metadata lang="en-GB" \
  -o "$FINAL/manuscript-kdp.epub"

EPUB_SIZE=$(du -sh "$FINAL/manuscript-kdp.epub" | cut -f1)
echo "  ✓ EPUB: $EPUB_SIZE — $FINAL/manuscript-kdp.epub"

# ── Post-build assertion: EPUB must be >= 500KB ───────────────────────────────
# A correctly built EPUB with embedded cover is comfortably over 500KB. An
# undersized EPUB means the cover failed to embed or the build is incomplete.
EPUB_BYTES=$(wc -c < "$FINAL/manuscript-kdp.epub")
if [ "$EPUB_BYTES" -lt 512000 ]; then
  echo "  ERROR: EPUB undersized — cover missing or build incomplete. ($EPUB_BYTES bytes, need >= 512000)"
  exit 1
fi

# ── Generate DOCX ─────────────────────────────────────────────────────────────
echo "  Generating DOCX..."
"$PANDOC" "${CLEAN_FILES[@]}" \
  --metadata title="$BOOK_TITLE" \
  --metadata author="$BOOK_AUTHOR" \
  --metadata lang="en-GB" \
  -o "$FINAL/manuscript-kdp.docx"

DOCX_SIZE=$(du -sh "$FINAL/manuscript-kdp.docx" | cut -f1)
echo "  ✓ DOCX: $DOCX_SIZE — $FINAL/manuscript-kdp.docx"

# ── Generate PDF via Chrome headless ─────────────────────────────────────────
echo "  Generating PDF..."
CHROME=""
for candidate in \
  "/c/Program Files/Google/Chrome/Application/chrome.exe" \
  "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
  "$LOCALAPPDATA/Google/Chrome/Application/chrome.exe"; do
  if [ -f "$candidate" ]; then
    CHROME="$candidate"
    break
  fi
done

if [ -z "$CHROME" ]; then
  echo "  Warning: Chrome not found — PDF skipped. Install Chrome to enable PDF builds."
else
  HTML_FILE="$FINAL/manuscript-kdp.html"
  PDF_FILE="$FINAL/manuscript-kdp.pdf"

  # Generate HTML first if it doesn't exist yet
  if [ ! -f "$HTML_FILE" ]; then
    "$PANDOC" "${CLEAN_FILES[@]}" \
      --metadata title="$BOOK_TITLE" \
      --metadata author="$BOOK_AUTHOR" \
      --metadata lang="en-GB" \
      --standalone \
      -o "$HTML_FILE"
  fi

  # PDF is intentionally NOT generated here.
  # The locked print design lives in the per-book pdf-style.css / .md-to-pdf.json
  # and is applied ONLY by build-pdf.sh. This script owns EPUB + DOCX (+ reference
  # HTML) only. A bare Chrome --print-to-pdf here produced an UNSTYLED PDF that
  # overwrote the locked design (incident 2026-06-28). Do NOT re-add it.
  : "${PDF_FILE:?}"  # var kept for reference; not written here
  echo "  • PDF: skipped by design — run 'bash build-pdf.sh <slug>' for the styled PDF."
fi

echo ""
echo "  ✓ Manuscript build complete."
echo "  These files are DERIVED OUTPUTS. Do not edit them manually."
echo "  To update: edit the source .md files, then re-run this script."
echo ""
