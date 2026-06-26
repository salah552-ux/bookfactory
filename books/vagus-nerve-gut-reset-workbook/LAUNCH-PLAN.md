# LAUNCH PLAN — The Vagus Nerve Gut Reset
**Series:** Fix Your Gut for Good — Book 4 | **Author:** S. A. Ibrahim
**Stage:** 06→07 commercial-readiness package | Compiled 2026-06-21
**Rule 1 note:** No projected sales figures, BSR estimates, or revenue claims appear here. All pricing/format decisions trace to BLUEPRINT §5 and the locked KDP-LISTING.md. Where live data is needed before action, it is flagged "needs live data" rather than invented.

---

## 1. KDP Select / Kindle Unlimited decision (documented)
**ENROL in KDP Select.** Rationale (data-validated, COMPETITIVE-INTELLIGENCE.md gate 4): KU penetration is near-total in this Kindle tier — both indie leaders (Payne B0F8P8M3HC, Bennett B0FXSTDD42) are in KU. Primary Kindle revenue in this niche is KU page-read read-through, not unit sales. 90-day exclusivity accepted; revisit at first renewal.

## 2. Launch pricing strategy (documented)
| Format | Launch price | Notes |
|--------|-------------|-------|
| Paperback | $14.99 | Matches both indie leaders at $14.99 (Payne, Bennett). 60% PB royalty tier. |
| Kindle list | $6.99 | 70% royalty tier ($2.99–$9.99). Below PB to drive Kindle + KU pickup. |
| Kindle launch promo | see §3 | Free-day run, then steady at $6.99. |

Steady-state: hold Kindle at $6.99 after the launch promo window. No permanent discount — the book's value sits in the daily structure, not in being cheap.

## 3. Free promotion / Countdown days (planned)
KDP Select gives 5 free-promo days OR Kindle Countdown per 90-day term. Plan:
- **Launch window:** run a **2-day Free Book Promotion** on days 3–4 after the title goes live (allow indexing to settle first), to seed early KU borrows and reviews.
- **Reserve** the remaining 3 free days for a single later 3-day run timed to a series cross-promo (e.g. alongside a Book 1–3 push).
- **Countdown Deal:** eligible from 30 days after enrolment (KDP rule) — flag a $0.99→$6.99 Countdown for a later promo cycle. *Exact dates: needs live launch date.*
- Execution is a manual KDP-dashboard step (per PIPELINE-MANIFEST automation.kdp_manual_steps).

## 4. ARC reader plan (documented)
- **Target:** 10–15 advance readers drawn from the series' existing reader base + the reader-magnet list (Wychford/series companion funnel) and relevant gut-health / vagus-nerve reader communities.
- **Asset:** distribute the final EPUB (`exports/final/manuscript-kdp.epub`) or a watermarked PDF 7–10 days pre-launch.
- **Ask:** an honest, TOS-compliant review on launch day. No incentive offered, no positive-review request — exactly mirrors the in-book CTA ("say exactly what you found; an honest account helps far more than a glowing one"), which is already TOS-compliant (REVIEW-BAIT-REPORT.md PASS).
- **Cross-sell:** ARC email points existing series readers to this as Book 4.

## 5. A+ Content brief (exists — for later submission)
A+ Content to be built from the locked HTML description and cover system (not yet submitted; Stage 10 aplus-content-agent owns final build):
- **Module 1 (header + image):** the gut-brain "same wire" hook + cover. Headline: *Your gut and your brain run on the same wire.*
- **Module 2 (3-up comparison):** what's inside — 4-week daily program / 12 named exercises / gut-specific Week 3. Reuse the description bullets.
- **Module 3 (standard text + image):** "Why this one is different" — no theory wall, no upsells, real citations.
- **Module 4 (series strip):** the *Fix Your Gut for Good* series (Books 1–4) for cross-sell.
- Design DNA: locked navy / cream / gold series palette (COVER-BRIEF.md). Clinical-calm, not spa.

## 6. Author Central bio (long version)
> S. A. Ibrahim writes practical, evidence-led health guides for people who are tired of being handed vague advice and expensive supplements. The *Fix Your Gut for Good* series grew out of a simple conviction: that ordinary people deserve to understand the mechanisms behind their symptoms, in plain English, with every claim traceable to a real source — and without anything being sold to them along the way. The books are educational companions, written to be read alongside (never instead of) professional medical care; the author holds no clinical credentials and offers no medical advice. *The Vagus Nerve Gut Reset* is Book 4 in the series — a four-week, five-minutes-a-day program for calming the gut-brain axis.

## 7. Series consistency (documented)
- This title is **Book 4** of *Fix Your Gut for Good* (SERIES-FACTS.md, byte-identical series field "Fix Your Gut for Good").
- Cross-references in back matter point only to titles that exist: *Fix Your Gut for Good: Stop Relapsing* (Book 1), *The H. Pylori Recovery Plan*, *The 7-Day Gut Reset*. No unwritten titles promised.

## 8. Launch sequence (operator checklist)
1. Human gates: set `cover_approved` and `final_approval_passed` true once FINAL-APPROVAL-REPORT.md is APPROVED.
2. Upload EPUB + cover-kdp.jpg to KDP draft; paste metadata from KDP-LISTING.md.
3. Complete the KDP AI questionnaire (values in KDP-LISTING.md §AI questionnaire note); set `ai_questionnaire_confirmed` true.
4. Enrol KDP Select; set prices ($14.99 PB / $6.99 Kindle).
5. Schedule the day 3–4 Free Promotion (§3).
6. Send ARC copies 7–10 days before go-live (§4).
7. Submit; allow 24–72h KDP review.
