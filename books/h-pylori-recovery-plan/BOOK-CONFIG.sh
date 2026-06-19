#!/usr/bin/env bash
# Book configuration for: The H. Pylori Recovery Plan
# Series: Fix Your Gut for Good — Book 3
# Genre: Health Nonfiction (NONFICTION-HEALTH profile)
# Sourced by build-pdf.sh when building this book

TARGET_WORDS=50000

# No publisher imprint on cover/spine (series rule — design-agent).
PUBLISHER_IMPRINT=""

# Phase separator configuration.
# This book is a linear 12-chapter condition guide, NOT a phased protocol like
# Book 1 (Fix Your Gut for Good). BLUEPRINT.md defines no phase structure, so no
# phase separators are injected. Arrays are declared but intentionally empty —
# do not invent phase breaks that are not in the blueprint.
declare -A PHASE_NUMBER
declare -A PHASE_NAME
declare -A PHASE_TAGLINE
