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
  echo "Example: bash build-manuscript.sh untitled-cosy-mystery"
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

# ── Extract metadata from BLUEPRINT.md ────────────────────────────────────────
BLUEPRINT="$BOOK_DIR/BLUEPRINT.md"
BOOK_TITLE=""
if [ -f "$BLUEPRINT" ]; then
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
# 00-00-copyright.md is SKIPPED — it contains raw HTML for PDF only.
# Front matter (title, copyright) is supplied via --metadata flags.
# Content order: ch-*.md (chapters) → 99-*.md (back matter)

FILES=()
while IFS= read -r -d '' f; do
  FILES+=("$f")
done < <(find "$MANUSCRIPT" -maxdepth 1 -name "ch-*.md" -print0 | sort -z)
while IFS= read -r -d '' f; do
  FILES+=("$f")
done < <(find "$MANUSCRIPT" -maxdepth 1 -name "99-*.md" -print0 | sort -z)

if [ ${#FILES[@]} -eq 0 ]; then
  echo "Error: No chapter files found in $MANUSCRIPT"
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
  echo "  Warning: cover-kdp.jpg not found at $COVER — EPUB will have no cover"
  COVER_FLAG=""
else
  COVER_FLAG="--epub-cover-image=$COVER"
fi

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

# ── Generate DOCX ─────────────────────────────────────────────────────────────
echo "  Generating DOCX..."
"$PANDOC" "${CLEAN_FILES[@]}" \
  --metadata title="$BOOK_TITLE" \
  --metadata author="$BOOK_AUTHOR" \
  --metadata lang="en-GB" \
  -o "$FINAL/manuscript-kdp.docx"

DOCX_SIZE=$(du -sh "$FINAL/manuscript-kdp.docx" | cut -f1)
echo "  ✓ DOCX: $DOCX_SIZE — $FINAL/manuscript-kdp.docx"

echo ""
echo "  ✓ Manuscript build complete."
echo "  These files are DERIVED OUTPUTS. Do not edit them manually."
echo "  To update: edit the source .md files, then re-run this script."
echo ""
