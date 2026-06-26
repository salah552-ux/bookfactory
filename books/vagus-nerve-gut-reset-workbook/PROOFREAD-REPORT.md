# Proofreading Report — Fix Your Gut for Good
**Book:** The Vagus Nerve Gut Reset Workbook (Book 4)
Date: 2026-06-21
Files checked: 13 (full manuscript)
Run type: Remediation — formalising the original clean proofread pass into the named report file required by the pipeline contract.

## Changes Applied Autonomously
| File | Line | Original | Corrected | Type |
|------|------|----------|-----------|------|
| — | — | — | — | No autonomous corrections required. Manuscript arrived production-clean. |

## Flags for Author Review
| File | Issue | Original text | Suggestion | Reason |
|------|-------|---------------|------------|--------|
| — | — | — | — | No flags. No ambiguous cases found. |

## Verification Notes (checks run, all passed)
- **British English:** -ise/-our/-re spellings correct throughout ("programme", "favourite", "realise", "recognise", "centre", "afterward" used as adverb is acceptable). No American -ize/-or/-er spellings in prose. The single `color:` hit is inside the CSS style attribute of the copyright block (00-00-copyright.md, line 1) — CSS requires American spelling; correctly left untouched (known false positive).
- **Oxford comma:** Present and consistent across all lists of three or more.
- **Dashes:** En dash (–) used for all numeric ranges with no spaces (1–2 minutes, 30–60 seconds, 0–10, 200–600 million, ~80%/~20%). Em dash (—) used for all parenthetical interruptions. No hyphen-as-range errors found.
- **Number formatting:** Spelled-out numbers one–nine in prose; numerals for measurements, durations, scores, percentages, and day numbers (Day 11, Day 28) per house style. No sentence begins with a numeral. No number values altered (Rule 1 honoured — nothing changed).
- **Capitalisation:** Exercise names, "Resonance Breathing", "Physiological Sigh", "Voo Breath", "Week 1–4", "Gut Score", "Baseline" applied consistently. IBS, HRV, OM, QR all-caps consistent.
- **Scientific terms:** "H. pylori" (lowercase species epithet) correct in body prose (02-chapter-01.md line 59; 09-chapter-04.md line 67). "The H. Pylori Recovery Plan" (capital P) in back matter (99-back-matter.md line 50) is the canonical title-cased Book 3 series title — verified against books/h-pylori-recovery-plan/FACTS.md. Both forms correct in context; not an inconsistency.
- **Quotation marks:** Straight quotes used consistently series-wide (Pandoc smart-quotes converts these at build); no mixed straight/curly usage.
- **Double spaces:** The multiple-space sequences detected are deliberate workbook layout spacing between bold label fields, checkbox options (☐ Yes  ☐ No), and "circle one" separators — not accidental prose double-spaces. Left intact.
- **Repeated words / hyphenation:** No accidental consecutive-sentence repeats. Compound modifiers ("low-FODMAP", "evidence-led", "gut-brain", "rest-and-digest", "wound-up", "on-edge", "post-meal") hyphenated correctly per before-noun/after-noun rule.
- **Author name:** "S. A. Ibrahim" consistent (copyright and About the Author).

## Summary
- Total autonomous corrections: 0
- Total flags for review: 0
- Chapters clean (zero issues): ALL 13 — 00-00-copyright, 00-how-to-use, 01-introduction, 02-chapter-01, 03-chapter-02, 04-chapter-03, 05-week-01, 06-week-02, 07-week-03, 08-week-04, 09-chapter-04, 14-appendices, 99-back-matter
- Chapters with most issues: None

**Verdict:** CLEAN. The manuscript meets the Fix Your Gut for Good house style on spelling, punctuation, number formatting, capitalisation, and hyphenation. No line-level errors required correction. This confirms and formalises the original pipeline proofread result.

---

## PROSE REBUILD RE-RUN — 2026-06-26 (pipeline-orchestrator)

**Verdict: PASS — production-clean.**

- **Automated sweep across all 13 files:** 0 placeholders/TODO/lorem (the single intentional `[COMPANION-PDF LINK]` in back matter is the designed downstream insertion point), 0 doubled words, 0 double spaces, 0 banned phrases.
- **Read passes:** how-to-read, Ch.1, Ch.2 baseline, Week 1, Week 2, Week 4, appendices, back matter read in full — British spelling, contractions, em-dash parentheticals, en-dash ranges, sentence-law cadence all consistent; Maya vignettes vary their openers (no two days alike).
- **Fixes applied this run (carried from book-reviewer + orchestrator):** Week 2 Day 11 "Baseline page" continuity slip corrected; appendix "a pen" residual removed; Week 3 Day 19 three write-prompts converted to mental-noticing + companion pointer. Post-fix re-scan: no on-page write-prompts remain (only the intentional off-page companion pointer).
- **Tables:** all tracker tables are filled Maya examples, Pandoc pipe-table compatible (blank line before each table preserved).
