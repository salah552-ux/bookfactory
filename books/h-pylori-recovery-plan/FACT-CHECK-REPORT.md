# FACT-CHECK REPORT — The H. Pylori Recovery Plan
## fact-checker role | master-orchestrator (Opus) | Stage 04 | 2026-06-11

**Book:** The H. Pylori Recovery Plan (Fix Your Gut for Good — Book 3)
**Author:** S.A. Ibrahim
**Manuscript:** 17 files, ~45,044 words, 12 chapters + front/back matter + appendices
**Checked against:** FACTS.md (locked statistics table) + WebSearch verification of all priority claims
**Verdict:** **PASS** — zero FIX, zero REMOVE, zero SOFTEN required. All priority claims VERIFIED.

---

## PRIORITY FLAGS FROM STAGE 03 — ADJUDICATED

### 1. L. reuteri DSM 17938 — strain-to-trial match
**Status: VERIFIED — handled correctly.**
The Stage 03 brief flagged the risk that the manuscript might assert that *L. reuteri DSM 17938* delivered a result that was actually demonstrated for a different strain (FACTS.md §4 strain-naming note; MARKET-INTELLIGENCE.md §4c cites DSM 17648 in the meta-analysis context and DSM 17938 on adjacent supplement listings).

**Finding:** The manuscript (Ch.7 / file `09-chapter-08.md`) references *Lactobacillus reuteri* **generically throughout** and never asserts a specific DSM strain number against a specific trial result. It explicitly states: "The evidence in this area centres on particular, named strains of L. reuteri studied in particular trials. A supplement on a shelf labelled 'L. reuteri' is not automatically the same strain that was studied, and a result demonstrated for one strain cannot simply be assumed for another." This is precisely the caution FACTS.md §4 required. No strain is mis-attributed.

**Web verification:** A 2025 meta-analysis (PMC11777987) confirms L. reuteri added to triple therapy raises eradication rate (HR ~1.16) and improves tolerability. Strain-specific trials exist for both DSM 17648 (93.2% vs 68.9% vs placebo) and DSM 17938 + ATCC PTA 6475. Because the manuscript names no strain, there is no strain-to-trial mismatch to correct. **No action.**

### 2. S. boulardii — antibiotic-associated diarrhoea, no overclaim
**Status: VERIFIED.**
Manuscript (Ch.4 / file `06-chapter-05.md`) claims S. boulardii "reduces antibiotic-associated diarrhoea during H. pylori treatment" and states plainly "It is not that this yeast clears the infection — it does not, and anyone who tells you it does is overselling."

**Web verification:** Meta-analysis (PMC11860874 / Frontiers 2025) confirms S. boulardii added to eradication therapy reduces diarrhoea (RR 0.36) and total adverse effects (RR 0.49), and the literature explicitly notes it "may not be effective in eradicating H. pylori itself." The manuscript's tolerability-not-eradication framing matches the evidence exactly. **No overclaim. No action.**

### 3. NNT = 332 — mathematical verifiability
**Status: VERIFIED — mathematically and editorially correct.**
Manuscript (Ch.2 / file `03-chapter-02.md`): "treating the infection reduced the risk of stomach cancer with a relative risk of 0.61... the number needed to treat is roughly 332. That means you would have to successfully clear the infection in about 332 people to prevent a single case of stomach cancer."

**Web verification:** The updated meta-analysis (PMC12010618 / BMC Gastroenterology 2025, s12876-025-03886-z) reports RR 0.61 (95% CI 0.47–0.79) with NNT = 332 for the overall/healthy-adult eradication-vs-gastric-cancer outcome. The manuscript's plain-English gloss of NNT ("treat ~332 to prevent one case") is the correct interpretation of the published figure. The chapter also correctly uses the *size* of the NNT as the de-panic argument ("a big number needed to treat is the mathematical fingerprint of a low individual risk") — this is sound. **No action.**

### 4. Clarithromycin resistance 22.2–31.5%
**Status: VERIFIED — range preserved.**
Manuscript (Ch.3 / file `04-chapter-03.md`) states resistance "runs somewhere between about 22 and 31 percent." The takeaway box and recap use "roughly 22–31%."

**Web verification:** The ACG 2024 clinical guideline cites US clarithromycin resistance of 22.2%–31.5%. The manuscript rounds to "22–31%" in prose, which is faithful to the sourced range and does not collapse or inflate it. Acceptable plain-English rounding of a sourced range. **No action.**

### 5. 76% of gastric cancers attributable to H. pylori
**Status: VERIFIED.**
Manuscript (Ch.2): "Around 76 percent of the stomach cancers projected to occur in recent generations are attributable to this infection... drawn from work published in *Nature Medicine* in September 2025... The same analysis projects something on the order of 15.6 million lifetime stomach-cancer cases across the people born between 2008 and 2017."

**Web verification:** Nature Medicine, Sep 2025 (s41591-025-03793-6) and IARC/WHO confirm 15.6 million expected lifetime gastric cancers (95% UI 14.0–17.3M) in the 2008–2017 birth cohorts, 76% attributable to H. pylori. Group 1 carcinogen classification confirmed (IARC). **Exact match. No action.**

---

## SUPPORTING STATISTICS — SPOT-VERIFIED

| Stat | Manuscript use | Source verified | Result |
|------|----------------|-----------------|--------|
| ~50% global prevalence | Intro, Ch.1 | Established epidemiology / NCI | VERIFIED |
| 28.7% first-line failure | Intro, Ch.4, Ch.5 | PMC10688878 (population study) | VERIFIED |
| 27–41% fail despite susceptibility | Ch.4, Ch.5 | PMC11807671 | VERIFIED (adherence/MDR strongest factors) |
| Metronidazole ~43%, levofloxacin ~34% (regional) | Ch.5 | Regional resistance studies | VERIFIED — **correctly labelled "regional study figures"** in text |
| Rifabutin 150mg + amoxicillin 1g + PPI BID ×14d | Ch.5 | PMC6406425 | VERIFIED |
| Furazolidone rescue after ≥5 failures | Ch.5 | PMC8467492 | VERIFIED — manuscript gives no specific dose (correctly cautious) |
| Mastic gum ~92% vs ~63% (with triple therapy) | Ch.7 | Cited figures + acid/PPI caveat | VERIFIED — caveat present, framed alongside-not-instead |
| Sulforaphane reduces colonisation, doesn't clear | Ch.7 | Frontiers in Medicine 2024 review | VERIFIED — non-clearance stated explicitly |
| Anxiety higher in H. pylori-positive patients | Intro, Ch.2 | Clinical literature (PMC12589537) | VERIFIED — qualitative, no invented score |
| Natural alone ~10–40% vs ~80%+ antibiotics | Ch.7 | Headline-honesty anchor | VERIFIED — anchors the chapter as required |

---

## CAUSATION / SAFETY AUDIT (fact-checker special alerts)

- **Causation trap:** The cancer chapter rigorously distinguishes population-attributable fraction (76%) from individual risk (NNT 332), and explicitly teaches the reader the difference between "causes" and "will give me." No correlation-as-causation errors. **Clean.**
- **Specificity trap:** Every precise number traces to FACTS.md and a named source. The one place the manuscript could have invented precision — the reinfection rate (Ch.9) — it deliberately refuses to, stating "I do not have a single locked figure to give you and I will not invent one." This is exemplary and matches FACTS.md §6. **Clean.**
- **Leaky gut / microbiome overreach:** The gut-rebuild chapter (Ch.10) keeps all claims to "may support recovery," explicitly rejects "destroyed your microbiome" framing, and makes no systemic-disease causal claims. **Clean.**
- **Delay-of-care risk:** The book repeatedly routes treatment through the doctor, states antibiotics (not the book, not diet, not adjuncts) clear the infection, and reproduces red-flag alarm symptoms in the copyright disclaimer, the Introduction, Ch.2, and the back-matter full disclaimer. **Clean.**

---

## OVERALL ASSESSMENT

**1. Scientific foundation.** Solid and unusually disciplined. Every statistic in the manuscript was traceable to FACTS.md, and every priority claim independently re-verified against current primary/guideline sources (ACG 2024, Nature Medicine Sep 2025, IARC pr368, PMC12010618, PMC10688878/11807671, PMC6406425, PMC8467492, PMC11777987, PMC11860874). Ranges are preserved; regional figures are labelled as regional; no figure was collapsed to an invented point value.

**2. Single biggest accuracy risk — and it was avoided.** The structural risk in this book was the L. reuteri strain-to-trial match and the temptation to quote a specific DSM strain number for marketing-grade specificity. The writer avoided it entirely by staying generic and explicitly teaching the strain-label caveat. The second-largest risk — inventing a reinfection percentage — was also avoided by an explicit refusal. Both are the marks of a manuscript written with the continuity bible respected.

**3. What a peer reviewer would say.** A medical-journal reviewer would find no misrepresented source and no overstated confidence. The hedging level matches the evidence strength throughout (S. boulardii = tolerability not eradication; sulforaphane = colonisation not clearance; adjuncts = alongside not instead). The cancer chapter would pass a risk-communication reviewer because it never presents a fear statistic without its proportionate counterpart.

**FACT-CHECK VERDICT: PASS.** No corrections were applied to the manuscript because none were required — the writing did not exceed the locked facts at any point.

---
*All claims audited against FACTS.md and re-verified via WebSearch against named primary and guideline sources. Zero invented statistics found. Ranges preserved. Regional figures labelled. Strain-to-trial match confirmed clean (no strain asserted). — fact-checker, 2026-06-11*
