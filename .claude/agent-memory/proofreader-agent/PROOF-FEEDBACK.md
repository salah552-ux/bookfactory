# Proofreader Agent — Session Feedback Log

## 2026-06-11 — The H. Pylori Recovery Plan (Book 3)

**Outcome:** PASS. Manuscript arrived production-clean (45,044 words, 16 files). Only 2 autonomous fixes needed (italicising *Helicobacter pylori* on first narrative use in Introduction and Ch.1). Zero flags for author review.

**Patterns worth carrying forward:**
- The health-writer for this series produces extremely clean copy. British spelling, Oxford commas, en-dash ranges, and em-dash parentheticals were already correct on arrival.
- **Watch item — scientific name italics:** the writer keeps the abbreviated "H. pylori" roman throughout (correct and readable for a consumer book) but did not italicise the full genus-species "Helicobacter pylori" on first use. Apply italics only to the spelled-out binomial at first narrative appearance; leave the abbreviated form and glossary/legal-disclaimer mentions roman.
- **False-positive to avoid:** the "color:"/"behavior" hits in front-matter come from CSS properties in the styled copyright block — never "correct" these to British spelling; CSS requires American spelling.
- **Hyphenation:** this writer correctly varies "test of cure" (noun) vs "test-of-cure" (modifier). Do NOT flag as inconsistent — it follows the before-noun/after-noun rule.
- **DOI false positive:** the source `s41591-025-03793-6` will trip number-range regexes; it is a Nature article DOI, not a hyphenated range error.

## 2026-06-21 — The Vagus Nerve Gut Reset Workbook (Book 4)

**Outcome:** PASS (remediation run). Manuscript arrived production-clean (13 files, ~19.4k words, workbook format). 0 autonomous fixes, 0 flags. This was a remediation pass to produce the named PROOFREAD-REPORT.md that the original pipeline run never wrote despite reporting clean.

**Patterns worth carrying forward:**
- This series' writer continues to produce exceptionally clean copy. British spelling, Oxford commas, en-dash ranges, em-dash parentheticals all correct on arrival.
- **Workbook layout false positive:** daily-page templates use deliberate multi-space sequences to separate bold label fields (`**Time:** ... **Do it:**`), checkbox options (`☐ Yes  ☐ No`), and "circle one" separators (`worse  ·  the same`). These are intentional layout spacing in a fill-in workbook — NOT accidental prose double-spaces. Do not collapse them.
- **CSS color: false positive confirmed again** — the copyright block style attribute (`color: #444`) is CSS, leave it American-spelled.
- **Cross-book title capitalisation:** "H. pylori" is lowercase-p in body prose (correct scientific epithet) but the Book 3 series title is title-cased "The H. Pylori Recovery Plan" (verified in books/h-pylori-recovery-plan/FACTS.md line 178). Both are correct in their own context — do NOT "fix" the title to lowercase. Always verify a series cross-sell title against that book's FACTS.md before flagging.
- **Straight quotes are the series standard** — manuscripts use straight `"` consistently; Pandoc smart-quotes converts at build. Consistent straight quotes are not an error; only a mix of straight and curly would be.
