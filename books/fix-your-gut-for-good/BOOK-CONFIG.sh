#!/usr/bin/env bash
# Book configuration for: Fix Your Gut for Good
# Genre: Health Nonfiction
# Sourced by build-pdf.sh when building this book

TARGET_WORDS=50000

# Phase separator configuration
# Each entry maps a chapter filename to its phase label.
# build-pdf.sh injects a full-page phase break before
# chapters listed here.
declare -A PHASE_NUMBER
declare -A PHASE_NAME
declare -A PHASE_TAGLINE

PHASE_NUMBER["01-chapter-1.md"]="Phase One"
PHASE_NAME["01-chapter-1.md"]="Assessment"
PHASE_TAGLINE["01-chapter-1.md"]="Understanding what you have<br>before you treat anything."

PHASE_NUMBER["05-chapter-5.md"]="Phase Two"
PHASE_NAME["05-chapter-5.md"]="Eradication"
PHASE_TAGLINE["05-chapter-5.md"]="Clearing the overgrowth<br>with the right protocol for your type."

PHASE_NUMBER["07-chapter-7.md"]="Phase Three"
PHASE_NAME["07-chapter-7.md"]="Repair"
PHASE_TAGLINE["07-chapter-7.md"]="Rebuilding what the bacteria damaged."

PHASE_NUMBER["09-chapter-9.md"]="Phase Four"
PHASE_NAME["09-chapter-9.md"]="Root Cause Resolution"
PHASE_TAGLINE["09-chapter-9.md"]="Closing the door<br>so it doesn't happen again."
