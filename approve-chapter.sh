#!/usr/bin/env bash
# BookFactory — Chapter Approval Workflow
# Run this AFTER book-reviewer gives grade B (96+) or A (108+)
#
# Usage: bash approve-chapter.sh <book-folder> <chapter-file> <score> <grade>
# Example: bash approve-chapter.sh fix-your-gut-for-good 02-chapter-2.md 104 B

set -e

FACTORY="$(cd "$(dirname "$0")" && pwd)"
BOOKS_DIR="$FACTORY/books"

BOOK="$1"
CHAPTER_FILE="$2"
SCORE="$3"
GRADE="$4"

if [ -z "$BOOK" ] || [ -z "$CHAPTER_FILE" ] || [ -z "$SCORE" ] || [ -z "$GRADE" ]; then
  echo ""
  echo "  Usage: bash approve-chapter.sh <book-folder> <chapter-file> <score> <grade>"
  echo "  Example: bash approve-chapter.sh fix-your-gut-for-good 02-chapter-2.md 104 B"
  echo ""
  exit 1
fi

BOOK_DIR="$BOOKS_DIR/$BOOK"
MANUSCRIPT="$BOOK_DIR/manuscript"
CHAPTER_PATH="$MANUSCRIPT/$CHAPTER_FILE"
HANDOFFS_DIR="$MANUSCRIPT/handoffs"

# ── Validate ──
if [ ! -f "$CHAPTER_PATH" ]; then
  echo "  Error: Chapter not found at $CHAPTER_PATH"
  exit 1
fi

if [ "$SCORE" -lt 96 ]; then
  echo ""
  echo "  ✗ Score $SCORE/120 (Grade $GRADE) is below threshold (96 = Grade B)."
  echo "  Apply the reviewer's fixes and resubmit."
  echo ""
  exit 1
fi

mkdir -p "$HANDOFFS_DIR"

# ── Extract metadata ──
CHAPTER_TITLE=$(grep -m1 "^# " "$CHAPTER_PATH" | sed 's/^# //')
CHAPTER_SUBTITLE=$(grep -m1 "^## " "$CHAPTER_PATH" | sed 's/^## //')
TODAY=$(date '+%Y-%m-%d')
HANDOFF_FILE="$HANDOFFS_DIR/${CHAPTER_FILE%.md}-handoff.md"

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║           CHAPTER APPROVAL                   ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""
echo "  Book:    $BOOK"
echo "  Chapter: $CHAPTER_FILE — $CHAPTER_TITLE"
echo "  Score:   $SCORE/120 (Grade $GRADE)"
echo "  Date:    $TODAY"
echo ""

# ── Extract HANDOFF BRIEF block from chapter file ──
# health-writer outputs a ## HANDOFF BRIEF section after the prose.
# We extract it, write it to the handoff file, then strip it from the manuscript.

HANDOFF_CONTENT=""
if grep -q "^## HANDOFF BRIEF" "$CHAPTER_PATH"; then
  # Extract everything from ## HANDOFF BRIEF to end of file (or next ## section)
  HANDOFF_CONTENT=$(awk '/^## HANDOFF BRIEF/{found=1} found{print}' "$CHAPTER_PATH")

  # Strip the HANDOFF BRIEF block (and everything after it) from the manuscript
  # Also strip RESEARCH NOTES, Word count line, and the review comment
  python3 - "$CHAPTER_PATH" << 'PYSTRIP'
import sys, re
path = sys.argv[1]
content = open(path, encoding='utf-8').read()

# Remove from ## HANDOFF BRIEF onwards
content = re.split(r'\n## HANDOFF BRIEF\b', content)[0]

# Remove RESEARCH NOTES section
content = re.split(r'\n## RESEARCH NOTES\b', content)[0]

# Remove trailing word count line and review comment
content = re.sub(r'\n+Word count:.*$', '', content, flags=re.MULTILINE)
content = re.sub(r'\n+<!--.*REVIEW REQUIRED.*-->', '', content)
content = content.rstrip() + '\n'

open(path, 'w', encoding='utf-8').write(content)
PYSTRIP

  echo "  ✓ HANDOFF BRIEF extracted from chapter"
  echo "  ✓ Research notes + metadata stripped from manuscript"
else
  echo "  ⚠ No ## HANDOFF BRIEF section found in chapter."
  echo "    Chapter was either written before this system was added,"
  echo "    or health-writer did not include the required block."
  HANDOFF_CONTENT="*(No handoff brief was generated — fill in manually)*"
fi

# ── Count words in clean manuscript ──
WORDS=$(wc -w < "$CHAPTER_PATH")

# ── Write handoff file ──
cat > "$HANDOFF_FILE" << HANDOFFHEADER
# Handoff Brief — $CHAPTER_TITLE
**File:** $CHAPTER_FILE
**Subtitle:** $CHAPTER_SUBTITLE
**Score:** $SCORE/120 (Grade $GRADE)
**Words:** $WORDS
**Approved:** $TODAY

---

HANDOFFHEADER

if [ -n "$HANDOFF_CONTENT" ]; then
  echo "$HANDOFF_CONTENT" >> "$HANDOFF_FILE"
else
  cat >> "$HANDOFF_FILE" << BLANKHANDOFF
## What was established
-
-
-

## Promises made to the reader
| Promise | Delivers in |
|---------|-------------|
| | |

## Sarah's state at end of chapter
-

## New stats for FACTS.md
-

## New terms for FACTS.md
-
BLANKHANDOFF
fi

echo "  ✓ Handoff brief saved: $HANDOFF_FILE"

# ── Git commit ──
cd "$FACTORY"

if git rev-parse --git-dir > /dev/null 2>&1; then
  git add "$CHAPTER_PATH" "$HANDOFF_FILE"

  git commit -m "$(cat <<COMMITMSG
approve: $CHAPTER_FILE — Grade $GRADE ($SCORE/120) — $WORDS words

Book: $BOOK
Chapter: $CHAPTER_TITLE
Reviewed and approved $TODAY
COMMITMSG
)"
  echo "  ✓ Git commit created (Grade $GRADE, $SCORE/120)"
else
  echo "  ⚠ Git not initialized — run: bash init-git.sh"
fi

# ── Rebuild PDF ──
echo ""
echo "  Rebuilding PDF..."
bash "$FACTORY/build-pdf.sh" "$BOOK"

echo ""
echo "  ✓ Chapter approved. Pipeline updated."
echo ""
