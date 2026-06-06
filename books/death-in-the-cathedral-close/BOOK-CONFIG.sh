#!/usr/bin/env bash
# Book configuration for: Death in the Cathedral Close
# The Cathedral Close Mysteries, Book 1
# Genre: Cosy Mystery / British Crime Fiction
# Sourced by build-pdf.sh when building this book

TARGET_WORDS=85000

# Publisher imprint — leave empty for no imprint on cover/spine
# If set, design-agent will include this on the cover and Brand Compliance check applies
PUBLISHER_IMPRINT=""

# Fiction mode — enables compact single-line TOC in build-pdf.sh
FICTION_GENRE=true

# No phase separators — fiction uses scene breaks (hr) only
# These arrays remain empty; the phase injection loop in
# build-pdf.sh will find no matches and skip cleanly.
declare -A PHASE_NUMBER
declare -A PHASE_NAME
declare -A PHASE_TAGLINE
