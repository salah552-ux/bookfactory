#!/usr/bin/env bash
# BookFactory — Series Template Generator
# Creates a new book project with full pipeline structure in seconds.
#
# Usage: bash new-book.sh "Book Title Here" fiction|health|business
# Example: bash new-book.sh "Fix Your Hormones for Good" health

set -e

FACTORY="$(cd "$(dirname "$0")" && pwd)"
BOOKS_DIR="$FACTORY/books"

TITLE="$1"
GENRE="$2"

if [ -z "$TITLE" ] || [ -z "$GENRE" ]; then
  echo ""
  echo "Usage: bash new-book.sh \"Book Title Here\" <genre>"
  echo "Genres: health | fiction | business"
  echo ""
  echo "Example: bash new-book.sh \"Fix Your Hormones for Good\" health"
  echo ""
  exit 1
fi

# Slugify title
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g')
BOOK_DIR="$BOOKS_DIR/$SLUG"

if [ -d "$BOOK_DIR" ]; then
  echo "Error: Book folder already exists at $BOOK_DIR"
  exit 1
fi

echo ""
echo "  Creating new book: $TITLE"
echo "  Folder: $SLUG"
echo "  Genre: $GENRE"
echo ""

# ── Create folder structure ──
mkdir -p "$BOOK_DIR/manuscript/handoffs"
mkdir -p "$BOOK_DIR/exports"

# ── Seed canonical style files (locked design — Playfair Display + #1b3a5c) ──
# Copying the canonical pdf-style.css and .md-to-pdf.json at creation time means
# every new book starts with Book 1's locked style. Stage 06's manuscript-style-designer
# can later overwrite these IF the book is a non-health genre — but for series books
# in Fix Your Gut for Good, this is the source of truth and must not diverge.
# This is the permanent fix for the Book 2 CSS drift incident (2026-05-19).
if [ -f "$FACTORY/pdf-style.css" ]; then
  cp "$FACTORY/pdf-style.css" "$BOOK_DIR/pdf-style.css"
  # Stamp a book-identifier comment in the header so series provenance is visible
  # Insert at line 6 (just after the opening comment block's closing line)
  python3 -c "
import sys
path = '$BOOK_DIR/pdf-style.css'
content = open(path, encoding='utf-8').read()
stamp = '''
   BOOK: $TITLE
   SEEDED FROM CANONICAL on $(date '+%Y-%m-%d') by new-book.sh
   To diverge from canonical, edit this file — but verify the locked design style
   in user memory (design_style_locked) before changing fonts/colours/margins.
'''
# Insert before the closing */ of the first comment block
content = content.replace('*/', stamp + '*/', 1)
open(path, 'w', encoding='utf-8').write(content)
" 2>/dev/null || true
  echo "  ✓ Seeded pdf-style.css from canonical (locked design style)"
fi

if [ -f "$FACTORY/.md-to-pdf.json" ]; then
  # Copy canonical and rewrite stylesheet path + header title for this book
  python3 -c "
import json, sys
src = '$FACTORY/.md-to-pdf.json'
dst = '$BOOK_DIR/.md-to-pdf.json'
title = '$TITLE'
cfg = json.load(open(src, encoding='utf-8'))
cfg['stylesheet'] = 'c:/Users/salah/BookFactory/books/$SLUG/pdf-style.css'
# Rewrite the header template span content to this book's title
import re
cfg['pdf_options']['headerTemplate'] = re.sub(
    r'(<span>)[^<]+(</span>)',
    r'\\g<1>' + title + r'\\g<2>',
    cfg['pdf_options']['headerTemplate']
)
json.dump(cfg, open(dst, 'w', encoding='utf-8'), indent=2)
" 2>/dev/null && echo "  ✓ Seeded .md-to-pdf.json from canonical (header retitled for this book)"
fi

# ── Create STYLE-GUIDE.md stub that names the locked build tool ──
cat > "$BOOK_DIR/STYLE-GUIDE.md" << STYLEGUIDESTUB
# $TITLE — Style Guide

**Style profile:** Inherited from canonical \`BookFactory/pdf-style.css\` (locked design style — Playfair Display + EB Garamond + Lato, navy #1b3a5c accent, blockquote border #c8b99a).

**CSS file:** \`pdf-style.css\` in this folder. Seeded from canonical on $(date '+%Y-%m-%d'). For series books in Fix Your Gut for Good, this MUST remain byte-identical to canonical except for the header identifier comment.

**PDF config:** \`.md-to-pdf.json\` in this folder. Seeded from canonical with book title injected into headerTemplate.

**Build command:** \`bash build-pdf.sh $SLUG\` (NOT Chrome headless, NOT wkhtmltopdf, NOT build-manuscript.sh for PDF output).

**Chapter heading rule:** Every chapter file must have the H1 + H2 split — \`# Chapter Title\` on line 1, \`## Chapter Subtitle\` on line 2. This is what triggers the drop-cap selector \`h1 + h2 + p::first-letter\` in the canonical CSS. A single H1 without a following H2 will produce a broken chapter opener.

**To change the style:** Edit \`pdf-style.css\` directly only if this book intentionally diverges from the series style. Otherwise, update \`BookFactory/pdf-style.css\` first and re-seed.
STYLEGUIDESTUB
echo "  ✓ Created STYLE-GUIDE.md with locked build tool documented"

# ── Create BLUEPRINT.md stub ──
cat > "$BOOK_DIR/BLUEPRINT.md" << BLUEPRINTSTUB
# $TITLE — Blueprint

---

## BOOK IDENTITY

**Title:** $TITLE
**Subtitle:** *(run book-architect to generate)*
**Genre:** $(echo "$GENRE" | awk '{print toupper(substr($0,1,1))substr($0,2)}')
**Voice:** *(define after architect runs)*
**Comparables:** *(3 comps)*
**Tone:** *(define)*

**Target word count:** *(set after architect runs)*

---

## THE PREMISE

*(Run: architect "$TITLE" to generate full blueprint)*

---

## CHAPTER OUTLINE

| File | Chapter | Status |
|------|---------|--------|
| 00-introduction.md | Introduction | ⬜ Not started |

*Full outline to be generated by book-architect agent.*

---

## CHAPTER STATUS

*(Updated by build-pdf.sh on each build)*
BLUEPRINTSTUB

# ── Create FACTS.md ──
cat > "$BOOK_DIR/FACTS.md" << FACTSSTUB
# $TITLE — Continuity Bible
## FACTS.md

---

## STATISTICS LOCKED IN

| Stat | Value | Source | Chapter |
|------|-------|---------|---------|

---

## MEDICAL/TECHNICAL TERMS DEFINED

| Term | Definition | First used in |
|------|-----------|---------------|

---

## PROMISES MADE TO THE READER

| Promise | Made in | Delivers in |
|---------|---------|-------------|

---

## VOICE ANCHORS

- Target reader: *(define)*
- Tone anchor: *(define)*
- Mirror sentence: *(first one added here after Ch. 1)*

---

## CHAPTER HANDOFF BRIEFS

*(Added after each approved chapter)*

---

## SERIES FACTS (from SERIES-FACTS.md)

Read C:/Users/salah/BookFactory/SERIES-FACTS.md before writing any chapter. Never redefine terms defined there.
Shared medical facts, recurring characters, series voice anchors, and cross-book continuity notes are in that file.
This section is a pointer — do not copy content here. The canonical source is SERIES-FACTS.md.
FACTSSTUB

# ── Placeholder introduction ──
cat > "$BOOK_DIR/manuscript/00-introduction.md" << INTROSTUB
# Introduction
## *(Subtitle — generated by health-writer/fiction-writer/business-writer)*

*(Write: write chapter intro $GENRE)*
INTROSTUB

# ── Create 00-00-copyright.md (styled HTML front matter) ──
# HTML with inline styles ensures the front matter page renders with the locked design
# regardless of any CSS loading order. Playfair Display italic title, EB Garamond body,
# warm rule dividers — matches books/the-7-day-gut-reset/manuscript/00-00-copyright.md exactly.
YEAR=$(date '+%Y')

if [ "$GENRE" = "fiction" ]; then
  DISCLAIMER_HEADER="Fiction Disclaimer"
  DISCLAIMER_BODY='<p style="margin: 0 0 0.5em 0;">This is a work of fiction. Names, characters, places, and incidents are either the product of the author'\''s imagination or are used fictitiously. Any resemblance to actual persons, living or dead, businesses, events, or locales is entirely coincidental.</p>

<p style="margin: 0 0 0.5em 0;">The author and publisher accept no liability for any adverse outcomes arising from the use or misuse of any information contained in this book.</p>'
else
  DISCLAIMER_HEADER="Medical Disclaimer"
  DISCLAIMER_BODY='<p style="margin: 0 0 0.5em 0;">This book is intended for general informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.</p>

<p style="margin: 0 0 0.5em 0;">If you have a diagnosed medical condition, or are pregnant, breastfeeding, or taking prescription medication, consult a qualified healthcare professional before acting on any information in this book.</p>

<p style="margin: 0 0 0.5em 0;">Symptoms that are severe, persistent, or accompanied by blood, unexplained weight loss, or fever require medical evaluation before any self-directed programme.</p>

<p style="margin: 0 0 0.5em 0;">The author and publisher accept no liability for any adverse outcomes arising from the use or misuse of the information contained in this book.</p>'
fi

cat > "$BOOK_DIR/manuscript/00-00-copyright.md" << COPYRIGHTSTUB
<div style="page-break-after: always; font-family: 'EB Garamond', Georgia, serif; font-size: 9pt; line-height: 1.7; color: #444; padding-top: 0.35in; max-width: 4.875in; margin: 0 auto;">

<p style="font-family: 'Playfair Display', Georgia, serif; font-size: 13pt; font-weight: 400; font-style: italic; color: #1b3a5c; margin: 0 0 0.15em 0;">$TITLE</p>

<div style="width: 1.2in; height: 0.5pt; background: #c8c0b4; margin: 0 0 1.1em 0;"></div>

<p style="margin: 0 0 0.2em 0;">Copyright © $YEAR S.A. Ibrahim</p>
<p style="margin: 0 0 1.1em 0;">First published $YEAR</p>

<p style="margin: 0 0 0.6em 0;">All rights reserved. No part of this publication may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the publisher, except in the case of brief quotations embodied in critical reviews and certain other non-commercial uses permitted by copyright law.</p>

<div style="width: 1.2in; height: 0.5pt; background: #c8c0b4; margin: 1em 0;"></div>

<p style="font-family: 'Lato', Helvetica, sans-serif; font-size: 7pt; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #9aa3ad; margin: 0 0 0.5em 0;">$DISCLAIMER_HEADER</p>

$DISCLAIMER_BODY

</div>
COPYRIGHTSTUB
echo "  ✓ Created manuscript/00-00-copyright.md (styled HTML front matter, $GENRE variant)"

# ── EMAIL-SEQUENCE.md template (email-list-builder will fill this at Stage 08) ──
cat > "$BOOK_DIR/EMAIL-SEQUENCE.md" << EMAILSEQSTUB
# Email Welcome Sequence — $TITLE
## MailerLite Sequence | 3 emails
## Status: PENDING — run email-list-builder at Stage 08 to generate

---

## EMAIL 1 — DELIVERY
**Subject:** [generated by email-list-builder]
**Preview text:** [generated by email-list-builder]
**Send:** Immediately on sign-up

[Run: build email list $SLUG]

---

## EMAIL 2 — VALUE
**Subject:** [generated by email-list-builder]
**Preview text:** [generated by email-list-builder]
**Send:** 48 hours after sign-up

[Run: build email list $SLUG]

---

## EMAIL 3 — NEXT-BOOK PREVIEW
**Subject:** [generated by email-list-builder]
**Preview text:** [generated by email-list-builder]
**Send:** 7 days after sign-up

[Run: build email list $SLUG]
EMAILSEQSTUB
echo "  ✓ Created EMAIL-SEQUENCE.md template (email-list-builder fills at Stage 08)"

# ── Full-schema pipeline-state.json ──
# All fields pre-populated with null/false/0 so no downstream agent hits a missing key.
# Schema derived from the-7-day-gut-reset pipeline-state.json (the most complete instance).
TODAY=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
cat > "$BOOK_DIR/pipeline-state.json" << PIPELINESTUB
{
  "book_slug": "$SLUG",
  "book_title": "$TITLE",
  "genre": "$GENRE",
  "current_stage": 0,
  "created_at": "$TODAY",
  "last_updated": "$TODAY",
  "last_agent_run": "Book initialised by new-book.sh",
  "word_count": 0,
  "writing": {
    "writer_agent": null,
    "target_chapters": null,
    "completed_chapters": 0
  },
  "intelligence_gate": {
    "niche": null,
    "harvested_at": null,
    "harvest_products_count": null,
    "opportunity_score": null,
    "saturation_score": null,
    "blueprint_path": null,
    "blueprint_approved": false,
    "blueprint_approved_at": null,
    "gate_cleared": false,
    "note": "Must be gate_cleared: true before Stage 01 research begins. Set by opus-brain-agent after Architect types approved."
  },
  "stages": {
    "00-intelligence": { "status": "pending", "completed_at": null, "notes": null },
    "01-research": { "status": "pending", "agents_completed": null, "outputs": [], "quality_gate": null },
    "02-planning": { "status": "pending", "completed_at": null, "notes": null },
    "03-writing": { "status": "pending", "completed_at": null, "notes": null },
    "04-quality": { "status": "pending", "completed_at": null, "notes": null },
    "05-optimisation": { "status": "pending", "completed_at": null, "notes": null },
    "06-production": { "status": "pending", "completed_at": null, "notes": null },
    "06.5-pre-launch": { "status": "pending", "completed_at": null, "notes": null },
    "07-publishing": { "status": "pending", "completed_at": null, "notes": null },
    "08-products": { "status": "pending", "completed_at": null, "notes": null },
    "09-series": { "status": "pending", "completed_at": null, "notes": null },
    "10-post-launch": { "status": "pending", "completed_at": null, "notes": null }
  },
  "human_gates": {
    "market_intelligence_approved": false,
    "blueprint_approved": false,
    "final_approval_passed": false,
    "cover_approved": false,
    "pre_launch_approved": false,
    "ai_questionnaire_confirmed": false,
    "kdp_listing_confirmed": false,
    "published": false
  },
  "publishing": {
    "asin": null,
    "kdp_status": null,
    "live_date": null,
    "list_price_gbp": null,
    "list_price_usd": null,
    "royalty_pct": null,
    "kdp_select": null,
    "countdown_deal_eligible_from": null
  },
  "pre_launch": {
    "launch_ready": false,
    "arc_readers_confirmed": 0,
    "arc_copies_sent": 0,
    "review_drop_date": null,
    "free_days_scheduled": false,
    "free_days_pattern": null,
    "free_day_1": null,
    "free_day_2": null,
    "paid_launch_date_locked": null,
    "ams_campaigns_built": false,
    "listing_audit_passed": false,
    "categories_confirmed": false,
    "promo_sites_booked": [],
    "also_bought_seeding_done": false,
    "author_central_uk_live": false,
    "author_central_us_live": false,
    "aplus_content_submitted": false,
    "goodreads_listing_live": false,
    "editorial_reviews_loaded": 0,
    "newsletter_swaps_confirmed": 0
  },
  "quality_scores": {
    "book_reviewer_avg": null,
    "final_approval_score": null,
    "final_approval_score_expected": null
  },
  "marketing": {
    "ads_starting_bid_gbp": null,
    "ads_daily_budget_gbp": null,
    "bookbub_ads_daily_gbp": null
  },
  "production": {
    "epub_built": false,
    "pdf_built": false,
    "docx_built": false,
    "html_built": false,
    "epub_path": null,
    "pdf_path": null,
    "docx_path": null,
    "cover_built": false,
    "front_matter_built": false,
    "about_author_built": false,
    "pdf_canonical_locked": false,
    "build_note": null
  },
  "post_launch": {
    "review_count": 0,
    "avg_rating": null,
    "ads_active": false,
    "ads_start_date": null,
    "countdown_deal_run": false,
    "aplus_content_live": false,
    "aplus_content_submitted": false,
    "arc_emails_sent": 0,
    "countdown_deal_eligible_from": null,
    "weekly_log": []
  },
  "agent_log": [
    {
      "timestamp": "$TODAY",
      "agent": "new-book.sh",
      "action": "Book initialised",
      "result": "success",
      "notes": "Full-schema pipeline-state.json created. Canonical style files seeded. SERIES-FACTS cross-reference added to FACTS.md. EMAIL-SEQUENCE.md template created."
    }
  ]
}
PIPELINESTUB
echo "  ✓ Created pipeline-state.json with full schema (all fields present)"

# ── Create AGENT-LOG.md ──
# Every book gets a log file from birth. Agents read this at session start, write to it at session end.
# Format: | Timestamp | Agent | Stage | Task Summary | Output Summary | Errors / Deviations | Status |
# See: .claude/agents/00-coordinator/agent-log-guide.md for full spec.
TODAY_LOG=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
cat > "$BOOK_DIR/AGENT-LOG.md" << AGENTLOGSTUB
# AGENT LOG — $TITLE

| Timestamp | Agent | Stage | Task Summary | Output Summary | Errors / Deviations | Status |
|-----------|-------|-------|--------------|----------------|---------------------|--------|
| $TODAY_LOG | new-book.sh | 00-scaffold | Scaffold new book directory | BLUEPRINT.md stub, FACTS.md, pipeline-state.json, EMAIL-SEQUENCE.md, canonical style files (pdf-style.css, .md-to-pdf.json), manuscript/00-00-copyright.md created. | — | complete |
AGENTLOGSTUB
echo "  ✓ Created AGENT-LOG.md (pipeline trace log — agents read and write this file)"

# ── Update PIPELINE.md ──
PIPELINE="$FACTORY/PIPELINE.md"

# Add to ACTIVE BOOKS table
if grep -q "| $TITLE |" "$PIPELINE" 2>/dev/null; then
  echo "  ℹ Book already listed in PIPELINE.md"
else
  # Insert before the closing --- of the ACTIVE BOOKS table
  # Use Python for reliable multiline sed on Windows bash
  python3 -c "
import re, sys
content = open('$PIPELINE').read()
new_row = '| $TITLE | $(echo "$GENRE" | awk \"{print toupper(substr(\$0,1,1))substr(\$0,2)}\") | ⬜ Pending | 0 | Run architect |'
# Find the active books table and append before the last ---
content = content.replace(
  '---\n\n## FOLDER STRUCTURE',
  new_row + '\n---\n\n## FOLDER STRUCTURE'
)
open('$PIPELINE', 'w').write(content)
" 2>/dev/null || echo "  ⚠ Could not auto-update PIPELINE.md — add manually."
fi

echo "  ✓ Folder structure created at: $BOOK_DIR"
echo ""
echo "  ────────────────────────────────────────────"
echo "  SETUP CHECKLIST"
echo "  ────────────────────────────────────────────"
echo "  ✓ Book directory created: books/$SLUG"
echo "  ✓ Canonical style files seeded (pdf-style.css + .md-to-pdf.json)"
echo "  ✓ Pipeline state initialised (all fields — full schema)"
echo "  ✓ Front matter created: manuscript/00-00-copyright.md (styled HTML, $GENRE variant)"
echo "  ✓ FACTS.md SERIES-FACTS cross-reference added"
echo "  ✓ EMAIL-SEQUENCE.md template created (fill at Stage 08)"
echo ""
echo "  NEXT STEPS:"
echo "  1. Run: bash build-pdf.sh $SLUG"
echo "     → Verify canonical style renders correctly before writing starts"
echo "  2. Run: pipeline state $SLUG"
echo "     → Confirm all fields present in pipeline-state.json"
echo "  3. Run: architect \"$TITLE\""
echo "     → Generates full blueprint, chapter outline, tone bible (Stage 02)"
echo "  ────────────────────────────────────────────"
echo ""
