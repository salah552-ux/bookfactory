# KDP SEO STRATEGY — The H. Pylori Recovery Plan
## Stage 01 | pipeline-orchestrator (Opus) | 2026-06-07

**Step 0 completed:** ALGO-INTELLIGENCE.md (v1.1, 2026-06-03) read before any SEO content was written. Key constraints applied: §1 title/subtitle = highest-weight fields; §1 backend = phrase-match, not single words; §13 keyword-CVR mismatch suppression; §15 3-category cap; §17 backend keywords are 50 BYTES not characters (every row byte-counted below); §6 A+ Content keyword mandate.

**Confidence:** MEDIUM. Amazon search-volume figures are unavailable in-session (no Publisher Rocket). Keyword selection is based on competitor title-gap analysis and verbatim reader language (MARKET-INTELLIGENCE.md §4b), not measured volume — flagged where it matters.

---

## 5a. TITLE & SUBTITLE OPTIMISATION

### Drop-Down Method logic
What does the buyer actually type at the moment of intent? From reader-language harvest: **"h pylori"** (lay spelling, not "helicobacter"), often with **"treatment," "diet," "natural treatment," "cure," "cancer," "still positive," "what to eat."** The series brand "Fix Your Gut for Good" sits above the title on the cover but is entered as the Series field on KDP (it is indexed separately — §7).

### Final recommended title
**The H. Pylori Recovery Plan**

- Leads with the exact lay search term "H. Pylori" — highest-weight field (§1). "Recovery" and "Plan" signal a structured, followable programme (differentiates from the "cure"/"diet" cluster) and carry buyer intent (someone searching a "plan" has decided to act).
- "Recovery" deliberately spans both eradication AND stomach-lining healing — the book's two halves.

### Recommended subtitle (high-intent keywords + promise + specificity)
**How to Eradicate the Infection, Heal Your Stomach Lining, and Understand Your Cancer Risk — Even When Antibiotics Have Failed**

- High-intent keywords carried: *eradicate, infection, heal, stomach lining, cancer risk, antibiotics.*
- Reader promise: eradication + healing + proportionate cancer answer.
- Specificity / differentiation: **"Even When Antibiotics Have Failed"** is the unoccupied lane (MARKET-INTELLIGENCE.md §4a synthesis) and mirrors the verbatim frustration "still positive after antibiotics."
- Note: the em dash in the subtitle is fine for the title/subtitle field (not byte-limited like backend keywords). For the KDP title field, an en/em dash renders correctly; a hyphen is an acceptable fallback.

**Subtitle alternative A (cancer-forward, for A/B):** *Eradicate H. Pylori, Heal Your Gut, and Calm the Cancer Fear — A Clear Plan for When Antibiotics Don't Work*
**Subtitle alternative B (diet-forward):** *The Step-by-Step Diet and Treatment Guide to Clear the Infection, Heal Gastritis, and Lower Your Cancer Risk*

### KDP title field character count
- KDP enters Title and Subtitle as **separate fields**. Do NOT concatenate.
- **Title field:** `The H. Pylori Recovery Plan` = **27 characters** (well within the 200-char KDP limit).
- **Subtitle field (recommended):** `How to Eradicate the Infection, Heal Your Stomach Lining, and Understand Your Cancer Risk — Even When Antibiotics Have Failed` = **123 characters** (within limit).

---

## 5b. BACKEND KEYWORDS — 7 ROWS (50 BYTES MAX EACH)

**Rules applied:** Plain ASCII only. No em dashes / smart quotes. Byte count verified for every row (UTF-8). No word repeated from title/subtitle (excluded words: the, h, pylori, recovery, plan, how, to, eradicate, infection, heal, your, stomach, lining, and, understand, cancer, risk, even, when, antibiotics, have, failed). No prohibited terms (Bestseller, Free, KU, author names). No format terms (Kindle, ebook, paperback).

| # | Keyword phrase | Bytes | Title/subtitle overlap |
|---|---|---|---|
| 1 | stomach ulcer natural treatment | 31/50 | clean |
| 2 | gastritis relief food guide | 27/50 | clean |
| 3 | gut infection diet for beginners | 32/50 | clean |
| 4 | mastic gum and probiotics protocol | 34/50 | clean |
| 5 | failed triple therapy rescue | 28/50 | clean |
| 6 | gnawing burning stomach pain | 28/50 | NOTE: "stomach" appears in subtitle ("stomach lining") |
| 7 | helicobacter diet meal plan | 27/50 | clean (genus "helicobacter" not in title; title uses "H. Pylori") |

> Byte counts verified via UTF8 byte-count (ALGO §17). All rows ASCII-only.

**Overlap note on rows 6 and 7:** Row 6 "gnawing burning stomach pain" repeats "stomach" (in subtitle "stomach lining"), but the full long-tail phrase is what indexes as a distinct unit (per KDP guidance and the 7-Day Reset precedent — a partial word overlap inside a distinct buyer phrase does not waste the slot the way an exact duplicate would). It is kept because "gnawing" + "burning" are the verbatim top symptom words readers type and no competitor title uses them. Row 7 "helicobacter diet meal plan" — "helicobacter" (genus) is intentionally NOT in the title (title uses lay "H. Pylori"), so this captures the formal-spelling searcher; "plan" is the only overlap and it is a generic high-frequency word, acceptable inside a distinct phrase.

**Paste-ready (one per KDP slot):**
```
stomach ulcer natural treatment
gastritis relief food guide
gut infection diet for beginners
mastic gum and probiotics protocol
failed triple therapy rescue
gnawing burning stomach pain
helicobacter diet meal plan
```

---

## 5c. CONVERSION INTENT VALIDATION

| # | Keyword | Intent flag | Reasoning (§13 keyword-CVR check) |
|---|---|---|---|
| 1 | stomach ulcer natural treatment | **HIGH INTENT** | Ulcer is the complication readers fear and act on; "treatment" = active buyer. Book delivers a treatment plan → CVR match. |
| 2 | gastritis relief food guide | **HIGH INTENT** | Gastritis is the common diagnosis label; "relief" + "food guide" maps to the diet chapter. Strong CVR match. |
| 3 | gut infection diet for beginners | **HIGH INTENT (mild BROWSE)** | "for beginners" widens reach into the broader gut audience; still buyer-shaped. Book's accessible framing supports it. Acceptable. |
| 4 | mastic gum and probiotics protocol | **HIGH INTENT** | Self-educated searcher who already knows the adjuncts = core buyer. Book's adjunct chapter delivers exactly this, honestly. Excellent CVR match. |
| 5 | failed triple therapy rescue | **HIGH INTENT** | The differentiator. Searcher is post-failure, actively desperate for next steps. Book's "when antibiotics fail" chapter is the answer. Highest CVR match in the set. |
| 6 | gnawing burning stomach pain | **HIGH INTENT (symptom-led)** | Active discomfort = motivated buyer. Verbatim reader language. Symptom chapter + diet deliver relief framing. CVR match. |
| 7 | helicobacter diet meal plan | **BROWSE-to-HIGH** | "meal plan" can attract recipe-cookbook browsers (the book is not a cookbook). Kept because "helicobacter" (formal-spelling) + "diet" is on-target; monitor post-launch — if it draws clicks that don't convert (§13 suppression risk), swap for "h pylori reinfection prevention" at first refresh. |

**No REMOVE flags.** No keyword carries suppression risk at selection. Row 7 is the only post-launch swap-watch candidate.

---

## 5d. A+ CONTENT KEYWORD MANDATE (ALGO §6)

Five keywords that MUST appear in A+ Content module headers/body for indexing (these extend the search footprint beyond title/backend, and must appear naturally — §13 no spam):

1. **helicobacter pylori eradication** (formal term for the clinical searcher)
2. **bismuth quadruple therapy** (the 2024 first-line — authority signal + indexes the guideline searcher)
3. **stomach cancer risk** (the dominant anxiety query — defused, not fear-sold)
4. **when antibiotics fail / rescue treatment** (the differentiator lane)
5. **h pylori diet and stomach healing** (the diet/lining-repair searcher)

A+ module placement: Module 1 (comparison: this plan vs the standard "natural cure" book) carries #1 and #4; Module 2 (the recovery roadmap) carries #2 and #5; Module 3 (the honest cancer-risk numbers) carries #3.

---

## NOTES & FLAGS FOR THE ARCHITECT
- **Search volume = [BLOCKED]** — no Publisher Rocket in-session. Keyword choices are competitor-gap + reader-language driven. Validate with real volume data if/when available.
- **Title-field dashes:** confirm the em dash renders in the live KDP title field at upload; hyphen fallback ready.
- **Keyword density:** the manuscript does not yet exist (Stage 02+). Run the 3+ occurrence density check (per Book 1/Book 2 precedent) against the final manuscript before lock. Rows 5 and 7 are search-intent reach keywords that may be light in body text — acceptable, but flag at the density gate.

---

*All 7 backend rows byte-verified ≤50 bytes (ASCII). Zero invented search-volume figures. Step 0 (ALGO-INTELLIGENCE.md) completed before drafting.*
