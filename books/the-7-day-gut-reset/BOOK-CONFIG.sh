#!/usr/bin/env bash
# Book configuration for: The 7-Day Gut Reset — Find Your Trigger and Calm Your Gut in One Week
# Genre:  NONFICTION-HEALTH
# Series: Fix Your Gut for Good (SKU #1)
# Sourced by build-pdf.sh
# Generated: 2026-05-14 | manuscript-style-designer | Stage 06-production

BOOK_TITLE="The 7-Day Gut Reset"
BOOK_SUBTITLE="Find Your Trigger and Calm Your Gut in One Week"
AUTHOR_NAME="S.A. Ibrahim"
BOOK_SLUG="the-7-day-gut-reset"
SERIES_NAME="Fix Your Gut for Good"
SERIES_POSITION=1
GENRE="NONFICTION-HEALTH"
PUBLISHER_IMPRINT=""   # No imprint on this book — leave blank

# Word count drawn from BLUEPRINT.md Section 7 word count summary (5,500 target)
TARGET_WORDS=5500

# Trim size (matches pdf-style.css @page)
TRIM_WIDTH="6in"
TRIM_HEIGHT="9in"

# Manuscript file order — must match chapter sequence exactly
CHAPTER_ORDER=(
  "manuscript/00-introduction.md"
  "manuscript/01-day-one.md"
  "manuscript/02-day-two.md"
  "manuscript/03-day-three.md"
  "manuscript/04-day-four.md"
  "manuscript/05-day-five.md"
  "manuscript/06-day-six.md"
  "manuscript/07-day-seven.md"
  "manuscript/08-conclusion.md"
)

# Phase separator pages — populate only if BLUEPRINT.md defines phases.
# This book uses a Day 1–7 day-by-day structure; days are NOT separated by
# full-page phase dividers — each day is a chapter heading, not a phase break.
# Phase arrays declared but empty per spec: nonfiction phases not defined in BLUEPRINT.md.

declare -A PHASE_NUMBER
declare -A PHASE_NAME
declare -A PHASE_TAGLINE

# No phase separators — this book uses day-by-day chapter structure only.
# Phase arrays declared above but intentionally empty.
# If a phase-separator edition is required, populate as:
#   PHASE_NUMBER[diagnosis]="Phase 1"
#   PHASE_NAME[diagnosis]="Find Your Trigger"
#   PHASE_TAGLINE[diagnosis]="Days 1–2: Observation before prescription."
