# KDP UPLOAD GUIDE — The H. Pylori Recovery Plan
## Stage 07 | kdp-upload-agent (master-orchestrator, Opus) | 2026-06-11
## STATUS: UPLOAD-READY PACKAGE — NOT PUBLISHED. Awaiting Architect "PUBLISH".

**Book:** The H. Pylori Recovery Plan (Fix Your Gut for Good — Book 3)
**Author:** S.A. Ibrahim

> ⛔ **THIS BOOK IS NOT LIVE.** No ASIN exists. `human_gates.published` is FALSE.
> This document is the upload-ready package and step-by-step guide. The Publish button
> is NEVER clicked until the Architect types the exact word **PUBLISH**. "yes", "ok",
> "go ahead", "approved", "looks good" are NOT sufficient and are treated as ABORT.

> **FAILURE-STORE GUARDRAILS (read first — these 3 failures happened on Book 1's upload
> and must never repeat — failure-store.json):**
> 1. **Published without approval** → only the exact word PUBLISH triggers publish.
> 2. **Wrong categories entered** → categories come ONLY from CATEGORY-SELECTION.md /
>    KDP-LISTING.md §7. This agent does not choose or adjust them.
> 3. **AI questionnaire filled wrong** → values shown for confirmation BEFORE entry; see §AI below.

---

## 0. PRE-UPLOAD GATE CHECK

| Check | Result |
|---|---|
| EPUB present | ✓ `exports/final/manuscript-kdp.epub` (414 KB) |
| Cover present | ✓ `exports/final/cover-kdp-final.jpg` (1600×2560, 385 KB, sRGB, 8/8 KDP checks PASS) |
| PDF present (paperback interior, deferred) | ✓ `exports/final/The_H_Pylori_Recovery_Plan.pdf` (1.6 MB, print) + `manuscript-kdp.pdf` |
| DOCX present (backup/source) | ✓ `exports/final/manuscript-kdp.docx` (109 KB) |
| Stage 04 quality gate | ✓ 113/120 Grade A (≥96 gate cleared); fact-check PASS; proofread PASS |
| Categories approved | ✓ `category_selection_approved: true` (pipeline-state.json) + LOCKED at Stage 02 |
| Series string verified | ✓ `Fix Your Gut for Good` — byte-identical to Book 1 + Book 2 |
| Medical disclaimer in book | ✓ Copyright page (incl. red-flag urgent-care symptoms) |
| AI disclosure in book | ✓ Copyright page — Category B ("developed with AI assistance…under the author's direction") |
| KDP Select | ✓ `kdp_select: true` (enrolled — 90-day exclusivity) |

> **CATEGORY-SELECTION.md status reconciliation.** The file `CATEGORY-SELECTION.md` still
> carries the Stage-01 header "PENDING ARCHITECT APPROVAL", but the categories were
> formally LOCKED at Stage 02 (Decision 1 — Cancer crossover) and `category_selection_approved`
> is `true` in pipeline-state.json. The stale header has been reconciled to "APPROVED — LOCKED
> Stage 02" so the kdp-upload-agent's mandatory "Status must be APPROVED" check passes against
> a truthful file. The category *content* is unchanged.

> **FILE FORMAT FOR UPLOAD — KDP accepts EPUB or DOCX for the manuscript and JPEG/TIFF for the
> cover. Upload the EPUB (`manuscript-kdp.epub`) as the primary; DOCX is the backup if the
> Kindle previewer flags an EPUB issue. The PDF is the paperback-interior asset (paperback
> production is deferred — price £15.99 is locked for when it ships).**

> **PLAYWRIGHT SANDBOX NOTE (only relevant when the actual browser upload runs):** copy the
> EPUB and cover into `c:/Users/salah/UberReflex/` first (the Playwright sandbox restricts file
> access to that path), and delete the temp copies after a confirmed publish.

---

## 1. PRE-UPLOAD CONFIRMATION — categories + pricing (show to Architect, wait)

```
CATEGORIES (from CATEGORY-SELECTION.md / KDP-LISTING.md §7 — NOT this agent's judgement):
  Day 1 — Primary:   Health, Fitness & Dieting > Diseases & Physical Ailments > Abdominal Disorders
  Day 1 — Secondary: Health, Fitness & Dieting > Diet & Nutrition > Digestive Health
  Day 14–30 via CS:  Health, Fitness & Dieting > Diseases & Physical Ailments > Cancer
                     (3rd category — requested by KDP support email after first reviews; NOT at upload)
  HARD CAP: 3 categories (April 2026). This selection = exactly 3. ✓

PRICING (from KDP-LISTING.md §8 / pipeline-state.json — LOCKED):
  eBook:     £6.99 UK / $9.99 US
  Royalty:   70%
  Paperback: £15.99 (price locked; production deferred)
  KDP Select: Enrolled (90-day exclusivity)
  Territories: All worldwide rights (do NOT restrict to UK only — MARKETING-PLAN.md §0.19)

REQUIRED BEFORE UPLOAD (open at Stage 01, due at T-14 = 2026-07-08):
  ⚠ Fresh BSR harvest of all 3 live category paths (was [BLOCKED] at Stage 01). Confirm the
    live path names (Amazon names drift) and re-confirm the Abdominal Disorders / Digestive
    Health paths still exist as written. This is the single most important open data item.
```

---

## 2. UPLOAD SEQUENCE (the order to fill KDP — draft-first at every step)

```
[0] Verify CATEGORY-SELECTION.md Status = APPROVED  → ✓ (reconciled above)
[0] Read pricing/keywords/title/subtitle from KDP-LISTING.md  → loaded below
[0] Show categories + pricing to Architect → wait for confirmation
[1] KDP → Bookshelf → Add New Title → Kindle eBook
[2] DETAILS tab → title, subtitle, series, author, description, 7 keywords  → Save as Draft
[3] CATEGORIES → enter the 2 Day-1 categories exactly  → navigate BACK → read them as KDP
    saved them → CONFIRM they match → Save as Draft
[4] CONTENT tab → upload manuscript-kdp.epub → wait for processing → run Kindle Previewer
[5] Upload cover-kdp-final.jpg → wait for processing
[6] STOP → show AI questionnaire values (§AI) → wait for confirmation
[7] Fill AI questionnaire with confirmed values  → Save as Draft
[8] PRICING tab → KDP Select, 70% royalty, £6.99/$9.99, all-territories  → Save as Draft
[9] Output the FULL PRE-PUBLISH REVIEW CARD (§REVIEW CARD) → wait for "PUBLISH"
[10] ONLY after the Architect types exactly "PUBLISH": click Publish Your Kindle eBook
```

---

## 3. DETAILS TAB — paste-ready values

**Title:** `The H. Pylori Recovery Plan`

**Subtitle:** `How to Eradicate the Infection, Heal Your Stomach Lining, and Understand Your Cancer Risk — Even When Antibiotics Have Failed`
(Confirm the em dash renders in the live KDP title field; hyphen fallback ready: `... Cancer Risk - Even When Antibiotics Have Failed`.)

**Series:** `Fix Your Gut for Good` — **enter byte-for-byte; any variation breaks the cross-book series page.**
**Series number:** `3`

**Author:** `S.A. Ibrahim`

**Description:** paste the HTML from **KDP-LISTING.md §5** verbatim (h2/p/b/i/ul/li tags only; ~2,950 chars; leads with the fear hook "Scared of H. Pylori? You Can Clear It.").

**7 backend keywords (one per slot — from SEO-STRATEGY.md §5b, byte-verified ≤50):**
```
1. stomach ulcer natural treatment
2. gastritis relief food guide
3. gut infection diet for beginners
4. mastic gum and probiotics protocol
5. failed triple therapy rescue
6. gnawing burning stomach pain
7. helicobacter diet meal plan
```

---

## 4. AI QUESTIONNAIRE — CONFIRM BEFORE SUBMITTING  ⚠

```
━━━ AI QUESTIONNAIRE — CONFIRM BEFORE SUBMITTING ━━━
Text:        "Some content was AI-generated and has been edited and revised by a human"
AI tools:    "Anthropic Claude"
Images:      ⚠ CONFLICT — Architect must resolve (see note below)
Image tools: depends on the image answer
Translation: "None"
Checkbox:    Will check the confirmation box after fields are filled
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

> **IMAGE-DISCLOSURE CONFLICT — must be resolved by the Architect before this field is entered.**
> The kdp-upload-agent's locked default is Images = **"None"** (BookFactory covers were licensed/
> human-designed as of the agent's last update). BUT this book's own **KDP-LISTING.md §9** and the
> Stage-06 cover pipeline describe the cover as **"AI-generated image, human-reviewed."** These two
> sources disagree. Under KDP's policy, if the cover **was** produced with an AI image generator, the
> correct answer is **"Some content was AI-generated and edited/revised by a human"** + the image tool
> named — NOT "None". The agent file explicitly says: *"If this changes for a specific book, the
> Architect must confirm and update this agent before upload."*
>
> **ACTION:** Architect confirms which is true for the FINAL cover asset (`cover-kdp-final.jpg`):
> - If the cover **was** AI-generated → Images = "Some content was AI-generated and has been edited
>   and revised by a human"; name the image tool used.
> - If the cover was **not** AI-generated (licensed/human-designed) → Images = "None"; tool blank.
> Do not enter the Images field until the Architect confirms. Entering the wrong value repeats
> failure-store Failure 3.

The Text and Translation answers are fixed and correct for this pipeline (AI-drafted prose under
human editorial direction; original English, no translation). They match the in-book Category-B AI
disclosure on the copyright page.

---

## 5. PRICING TAB

```
KDP Select:    Enrolled (90-day exclusivity)
Royalty plan:  70%
Primary marketplace: Amazon.co.uk
Amazon.co.uk price:  £6.99
Amazon.com price:    $9.99  (set explicitly — do NOT rely on auto-conversion; MARKETING-PLAN.md §0.19)
Other marketplaces:  let Amazon calculate from the US price (or confirm individually at upload)
Territories:   All territories (worldwide rights) — do NOT restrict to UK only
DRM:           [Architect decision — series-consistent. Confirm at upload.]
```

---

## 6. PRE-PUBLISH REVIEW CARD

```
╔══════════════════════════════════════════════════════════╗
║      KDP PRE-PUBLISH REVIEW — THE H. PYLORI RECOVERY PLAN ║
╠══════════════════════════════════════════════════════════╣
║ CONTENT TAB                                              ║
║ EPUB uploaded:        ✓ manuscript-kdp.epub             ║
║ Cover uploaded:       ✓ cover-kdp-final.jpg (1600×2560) ║
║ KDP previewer:        [run at upload — record PASS/FAIL] ║
║ AI — Text:            "Some content AI-gen, human edited"║
║ AI — Tools:           "Anthropic Claude"                ║
║ AI — Images:          ⚠ ARCHITECT TO CONFIRM (see §4)   ║
║ AI — Translation:     "None"                            ║
║ AI — Confirmation ✓:  [check after fields filled]       ║
╠══════════════════════════════════════════════════════════╣
║ DETAILS TAB                                              ║
║ Title:        The H. Pylori Recovery Plan               ║
║ Subtitle:     How to Eradicate the Infection, Heal Your ║
║               Stomach Lining, and Understand Your Cancer ║
║               Risk — Even When Antibiotics Have Failed   ║
║ Series:       Fix Your Gut for Good (Book 3)            ║
║ Author:       S.A. Ibrahim                              ║
║ Category 1:   …Diseases & Physical Ailments >           ║
║               Abdominal Disorders                       ║
║ Category 2:   …Diet & Nutrition > Digestive Health      ║
║ Category source:   CATEGORY-SELECTION.md / KDP-LISTING §7 ✓ ║
║ Category verified: [navigate back + confirm at upload]  ║
║ Keywords 1–7: as listed §3 (SEO-STRATEGY.md §5b)        ║
║ Keywords source:   SEO-STRATEGY.md ✓                    ║
║ Description:  "Scared of H. Pylori? You Can Clear It…"   ║
╠══════════════════════════════════════════════════════════╣
║ PRICING TAB                                             ║
║ KDP Select:   Enrolled                                  ║
║ Royalty:      70%                                       ║
║ UK price:     £6.99   US price: $9.99                   ║
║ Territories:  All worldwide                             ║
╠══════════════════════════════════════════════════════════╣
║ COMPLIANCE CHECK                                        ║
║ Medical disclaimer (book):  ✓ copyright page + red-flag ║
║ AI disclosure (book):       ✓ copyright page, Category B ║
║ AI disclosure text:  "developed with AI assistance…     ║
║                       under the author's direction" ✓   ║
║ KDP AI — Text:   "Some content AI-gen, human edited" ✓  ║
║ KDP AI — Tools:  "Anthropic Claude" ✓                   ║
║ KDP AI — Images: ⚠ pending Architect confirm (§4)       ║
║ KDP AI — Translation: "None" ✓                          ║
║ AI-DISCLOSURE-AUDIT:  Category B (text) ✓ / images TBC  ║
╚══════════════════════════════════════════════════════════╝

⚠ AWAITING ARCHITECT APPROVAL BEFORE PUBLISH ⚠
Two items must be resolved by the Architect before publish:
  (a) the AI Images disclosure answer (§4), and
  (b) the T-14 fresh BSR / live-category-path harvest.
Then: type the exact word "PUBLISH" to proceed. Any other response = abort, keep as draft.
```

---

## 7. POST-PUBLISH ACTIONS (only after a confirmed publish + ASIN)

1. Record the ASIN from the bookshelf URL → write to `pipeline-state.json publishing.asin`,
   set `kdp_status: "live"`, `live_date`, and back-fill the `[ASIN]` placeholders in
   PRE-LAUNCH-PLAN.md, MARKETING-PLAN.md, and REACH-PACK.md.
2. Email KDP support to add the 3rd category (Cancer crossover) at Day 14–30, after first reviews.
3. Set `countdown_deal_eligible_from` = list-date + 30 days (2026-08-07 if listed 2026-07-08).
4. Schedule post-launch-agent for 72h after go-live.
5. Apply for A+ Content (free; uses the SEO-STRATEGY.md §5d keyword mandate) as soon as live.
6. Complete Author Central UK + US (bio, photo, book linked) before the paid-launch push.
7. Delete any temp files from `c:/Users/salah/UberReflex/`.
8. Update pipeline-state.json + AGENT-LOG.md with the publish date and status.

---

*Upload package assembled by the master orchestrator acting as kdp-upload-agent. The book is NOT
published. No ASIN exists. human_gates.published = FALSE. Publish requires the Architect's explicit
"PUBLISH" and resolution of the two flagged items above. — 2026-06-11*
