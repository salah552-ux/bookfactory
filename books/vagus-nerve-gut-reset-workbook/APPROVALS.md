# APPROVALS — The Vagus Nerve Gut Reset

**Reviewer:** book-reviewer (Stage 04 quality gate)
**Date:** 2026-06-26
**Edition reviewed:** Full prose rebuild — all 13 manuscript files (slug: vagus-nerve-gut-reset-workbook)
**Total prose word count reviewed:** 23,340 words
**Pass threshold:** ≥ 96/120

> Supersedes the prior workbook-edition APPROVALS (108/120, 2026-06-20). That edition was rejected by KDP as a fill-in/journal format; this is the prose conversion per BLUEPRINT.md §8A.

---

## VERDICT: PASS — 110/120 — GRADE A (PUBLISH, with 1 required micro-fix)

The fill-in workbook has been genuinely re-authored as a prose guide, not crudely de-blanked. The Maya worked-example engine reads as a deliberate teaching device (the book itself frames it as "a worked example in a maths book"), the day-vignettes are varied, and the science/voice survived intact. **ZERO blank apparatus remains** (verified by scan). One continuity slip in Week 2 (Day 11) must be corrected before final lock — a 2-line edit, not a re-spawn.

---

## SCORECARD (12 metrics, whole-book aggregate)

| Metric | Score | Verdict |
|--------|-------|---------|
| 1. Human Voice | 9/10 | Distinctive, warm, idiosyncratic ("the food never had a fair chance"); no AI tells |
| 2. AI-Risk (inverse) | 9/10 | Strong sentence-length variation, concrete specifics, natural imprecision |
| 3. Hook Strength | 9/10 | "There is a nerve in your body... running the show"; "This is the week you came for" |
| 4. Pacing | 9/10 | Day cadence breathes; no info-dump >3 paras; theory genuinely ≤20% |
| 5. Emotional Impact | 10/10 | "the afternoons stopped being something to survive" lands; reader feels understood |
| 6. Readability | 9/10 | Grade ~8–9; jargon ("vagal tone," "down-regulation") defined on first use |
| 7. Structure & Flow | 9/10 | Clear week arcs; each day → exercise → why → Maya → reader prompt |
| 8. Genre Convention | 10/10 | Prose health-program conventions honoured; format now Kindle-legal (see M11) |
| 9. Continuity | 8/10 | Maya's numbers cohere week-to-week; −2 for Week 2 Day 11 "Baseline page" slip |
| 10. Market Fit | 9/10 | Hits the prose-program lane (Payne comp); all 5 review gaps answered |
| 11. KDP Readiness | 10/10 | ZERO blanks confirmed by scan → Kindle eligible; trade-quality prose |
| 12. Actionability | 9/10 | Reader knows exactly what to do daily; maintenance + flare + when-to-see-doctor |

**OVERALL: 110/120 — GRADE A (PUBLISH)**

Grade bands: 108–120 PUBLISH (A) · 96–107 MINOR FIXES (B) · 84–95 REVISE (C) · <84 REWRITE (F)

---

## COMPETITIVE-GAP CHECK (all 5 must be addressed)

| Gap (COMPETITIVE-INTELLIGENCE.md) | Addressed? | Where |
|---|---|---|
| 1. No gut/IBS depth | YES — strongest area | Week 3 is the deepest week (3,275 wds, top of pack): Rome IV "disorder of gut-brain interaction," before/after-meal mechanics, cleaning wave, panic-pain loop, flare button, symptom mapping. No non-gut week out-depths it (FACTS rule 5 held). |
| 2. Vague exercises | YES | Ch.3 Library: every exercise named, numbered steps, exact duration, accessibility mod, plain "why it works" |
| 3. Too theoretical | YES | Ch.1 is the "90-second" explainer; theory ≤20%; rest is do-this-now |
| 4. No tracking tools | YES (prose-native) | Tracking SHOWN via Maya's filled baseline/weekly/recap tables (real numbers, never blank) + free companion-PDF pointer for self-recording |
| 5. No citations | YES | Inline source-type cites in text; full bibliography in 99-back-matter (Berthoud, Balban 2023, Tracey 2002, Drossman 2016, etc.); early-evidence claims flagged honestly |

**All 5 gaps addressed.** Differentiator (Week 3 deepest/most gut-specific) confirmed.

---

## ZERO-BLANKS VERIFICATION (the whole point of the rebuild)

Programmatic scan across all 13 files for `_{3,}`, checkbox glyphs, "fill in", "circle one", "jot/write down":
- **0 blank fill-in lines, 0 checkboxes, 0 "____" cells, 0 blank tracker rows.**
- Only matches were 3 intentional companion-PDF pointers ("...not one you write in") — correct meta-prose, not apparatus.
- All tracker tables (W1–W4, baseline, 30-day recap) are **filled-in Maya examples** with real numbers — a KDP reviewer sees content, not a template.
- The word "workbook" appears **0 times** anywhere (copyright, back matter, all clean).
- KINDLE FORMAT ELIGIBILITY: PASS. Manuscript is blank-free → kdp_editions kindle:true is valid. (Recommend confirming with `node scripts/format-eligibility.cjs vagus-nerve-gut-reset-workbook` at the build gate.)

---

## REQUIRED FIX (before final lock — 1)

1. **[Metric 9 — Continuity]** `06-week-02.md`, Day 11, lines 79 & 82. Text says *"read the one sentence you **wrote** on your **Baseline page**"* and step 1 *"Re-read your 'why' from the **Baseline page**."* This breaks the prose rebuild: Chapter 2 tells the reader to *hold the "why" in mind* (writing is pushed to the companion PDF), and there is no "Baseline page" in a read-only book. It is the only second-person instruction that tells the reader they wrote something on a page — a §8A / FACTS "never tell the reader to write on the page" violation.
   - **Fix (line 79):** "So bring back the one sentence you named as your *why* in Chapter 2 — the thing you most want different in 28 days. Say it to yourself slowly."
   - **Fix (step, line 82):** "1. Bring your 'why' from Chapter 2 back to mind."
   - Maya's own vignette (line 85) already does this correctly ("re-read the one sentence about why she'd started") — only the second-person instruction needs aligning.

## MINOR (optional, non-blocking)

2. **[Metric 9]** `14-appendices.md` FAQ, line 71: "The whole program works with **a pen** and five minutes." Residual write-it-down framing — no pen is needed. Suggest "works with nothing but five minutes a day." (Trivial.)

---

## WHAT'S WORKING (do not change)

- **Day-vignette variety:** no two Maya days open the same way (queue, car park, sofa, edge of bed, desk, kettle) — FACTS rule 4 honoured.
- **Week 3 depth & specificity** — the differentiator is unmistakably the strongest, most gut-mechanistic week.
- **Maya's non-linear trend:** Gut Score 21→13, RHR 74→68, daily gut ~7.5→4.3 with honest bumps on Days 2/6/11/18 — believable, never presented as study data.
- **Voice discipline:** second person for instruction, third person only for Maya, throughout; sentence law and contractions held.
- **Companion-PDF pointer** consistently frames self-tracking as off-page on purpose — turns the rejection cause into a brand feature.

---

## PER-FILE NOTES (chapters needing attention flagged)

| File | Words | Note |
|------|-------|------|
| 00-00-copyright.md | 168 | Clean; title correct; no "workbook" |
| 00-how-to-use.md | 604 | Retitled "How to Read This Book"; companion-PDF reframed; clean |
| 01-introduction.md | 1,106 | Hook intact; no "you'll fill in" promises |
| 02-chapter-01.md | 1,606 | 90-sec explainer; clean prose |
| 03-chapter-02.md | 1,334 | Baseline → prose walk-through + filled Maya example; excellent |
| 04-chapter-03.md | 2,388 | Exercise Library; all 12 exercises full-spec; clean |
| 05-week-01.md | 3,176 | 7 worked-example days + filled tracker; varied openers |
| 06-week-02.md | 3,018 | Strong — **but FIX Day 11 "Baseline page" (lines 79/82)** |
| 07-week-03.md | 3,275 | Differentiator; deepest & most gut-specific — keep as is |
| 08-week-04.md | 2,883 | Incl. 30-day recap vignette (21→13); consistent |
| 09-chapter-04.md | 1,738 | Make-It-Stick; maintenance/plateau/flare/when-to-see-doctor |
| 14-appendices.md | 1,019 | Recap grid (filled), exercise index, FAQ; minor "pen" tweak |
| 99-back-matter.md | 1,025 | Sources, author, series, review CTA, companion pointer; locked final line intact |

---

## VERDICT
**PUBLISH** — apply the 1-line Week 2 Day 11 "Baseline page" continuity fix (and optionally the FAQ "pen" tweak), then this is ready for the build / format-eligibility gate. No writer re-spawn required.
