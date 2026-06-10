# Proofreader Agent — Session Feedback Log

## 2026-06-11 — The H. Pylori Recovery Plan (Book 3)

**Outcome:** PASS. Manuscript arrived production-clean (45,044 words, 16 files). Only 2 autonomous fixes needed (italicising *Helicobacter pylori* on first narrative use in Introduction and Ch.1). Zero flags for author review.

**Patterns worth carrying forward:**
- The health-writer for this series produces extremely clean copy. British spelling, Oxford commas, en-dash ranges, and em-dash parentheticals were already correct on arrival.
- **Watch item — scientific name italics:** the writer keeps the abbreviated "H. pylori" roman throughout (correct and readable for a consumer book) but did not italicise the full genus-species "Helicobacter pylori" on first use. Apply italics only to the spelled-out binomial at first narrative appearance; leave the abbreviated form and glossary/legal-disclaimer mentions roman.
- **False-positive to avoid:** the "color:"/"behavior" hits in front-matter come from CSS properties in the styled copyright block — never "correct" these to British spelling; CSS requires American spelling.
- **Hyphenation:** this writer correctly varies "test of cure" (noun) vs "test-of-cure" (modifier). Do NOT flag as inconsistent — it follows the before-noun/after-noun rule.
- **DOI false positive:** the source `s41591-025-03793-6` will trip number-range regexes; it is a Nature article DOI, not a hyphenated range error.
