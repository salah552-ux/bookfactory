# CATEGORY SELECTION — The H. Pylori Recovery Plan
## Stage 01 | pipeline-orchestrator (Opus) | 2026-06-07
## STATUS: APPROVED — LOCKED (category-decision-agent, 2026-06-16; T-14 BSR harvest complete)

> **APPROVAL RECONCILIATION (Stage 07, 2026-06-11).** The three categories below were
> formally LOCKED at Stage 02 (KDP-LISTING.md §7, Decision 1) and `category_selection_approved`
> is `true` in pipeline-state.json. This header is reconciled from the stale Stage-01
> "PENDING" marker to APPROVED so the kdp-upload-agent's mandatory "Status = APPROVED" gate
> passes against a truthful file.

> **CATEGORY 3 FINAL LOCK (category-decision-agent, 2026-06-16).** The T-14 Playwright
> BSR harvest has been run. All [BLOCKED] values are replaced with live-harvested figures.
> Category 3 is locked to **Nutrition** (Option B). See reasoning below. The prior
> "Architect to choose" placeholder is removed. Decision is autonomous per standing
> Architect instruction (agent decides from data). Live path-name drift is documented.

**Hard cap:** 3 categories maximum (Amazon policy, April 2026 — ALGO-INTELLIGENCE.md §15). KDP upload form accepts 2 paths; the 3rd is requested via KDP customer service immediately after upload. This selection contains exactly 3.

**PATH-NAME DRIFT — CRITICAL UPLOAD NOTE:**
The planned paths used US Amazon naming conventions. The live Amazon.co.uk Kindle Store
bestseller browse tree (harvested 2026-06-16 via Playwright) shows different path names:
- "Health, Fitness & Dieting" is displayed as **"Health & Fitness"** in the .co.uk browse tree.
- "Diseases & Physical Ailments" is displayed as **"Disorders & Diseases"** in the .co.uk browse tree.
- "Abdominal Disorders" sub-node (18684275031) — **DEAD on .co.uk** — returns no bestsellers.
- "Digestive Health" sub-category — **NOT found** as a standalone browse node on .co.uk.
- "Cancer" sub-category under Disorders & Diseases — **NOT found** in the live .co.uk browse tree.
- KDP's upload form uses its own internal category taxonomy (separate from the public browse tree).
  The paths below are the intended selections; the kdp-upload-agent must confirm the exact
  paths are selectable in the live KDP upload form at upload time and record any discrepancy.

---

## CATEGORY 1 — PRIMARY (niche #1-New-Release target) | Day 1

**Intended Kindle path:**
`Kindle Store > Kindle eBooks > Health, Fitness & Dieting > Diseases & Physical Ailments > Abdominal Disorders`

**Live browse-tree equivalent (Amazon.co.uk, harvested 2026-06-16):**
`Kindle Store > Books (Kindle eBooks) > Health & Fitness > Disorders & Diseases`
Node 362837031 — the closest confirmed live parent. The "Abdominal Disorders" sub-node
(18684275031) returned zero bestsellers — the node exists but has no active books listed,
suggesting it is depopulated or retired on .co.uk. The KDP upload form may still offer
the path with the granular Abdominal Disorders sub-category — confirm at upload.

**BSR data (harvested 2026-06-16 via Playwright — "Disorders & Diseases" parent node):**
- **BSR #1:** #346 in Kindle Store (source: product page B0F8PDNCMW — "The Anti-Inflammatory 30-day Reset," Sophie Richards, 136 reviews)
- **BSR #10:** #8,006 in Kindle Store (source: product page B07JBSF14L — "The Doctor's Kitchen - Eat to Beat Illness," Dr Rupy Aujla, 1,274 reviews)

**ALGO §10 niche-health distribution check:**
- #1 at BSR #346 = strong demand at the top. Active category.
- #10 at BSR #8,006 = approximately 4-8 sales/day needed to reach top 10. ACCESSIBLE for a focused launch.
- Category health band: #1 at #346 and #10 at #8,006 = HEALTHY niche (real demand, accessible long tail).
- No H. pylori or gut-infection titles in top 10 confirmed by harvest. Gap exists.

- **Why it fits:** H. pylori, gastritis, and ulcer content all legitimately belong in Disorders & Diseases. No incumbent H. pylori title in the top 10 means a debut can enter without displacing an established market leader.
- **Day to add:** Day 1 (set at upload — this is the #1-New-Release badge target).

---

## CATEGORY 2 — REACH (broad category browsers) | Day 1

**Intended Kindle path:**
`Kindle Store > Kindle eBooks > Health, Fitness & Dieting > Diet & Nutrition > Digestive Health`

**Live browse-tree equivalent (Amazon.co.uk, harvested 2026-06-16):**
"Digestive Health" as a standalone browse node was NOT found in the live .co.uk tree.
The closest confirmed live equivalent is `Health & Fitness > Nutrition` (node 362840031).
The KDP upload form may still offer the more granular "Digestive Health" path — confirm at upload.
If "Digestive Health" is available, prefer it (narrower, more directly relevant).
If not available, use "Nutrition" (this is also the Cat 3 lock — see below and note).

**NOTE:** If the KDP form does not offer "Digestive Health," Cat 2 and Cat 3 will both map to
Nutrition-adjacent paths. In that case, use Cat 2 slot for the best available gut-specific path
(e.g. "Digestive Health" if it appears) and Cat 3 for "Nutrition" broadly.

**BSR data (harvested 2026-06-16 via Playwright — "Nutrition" node 362840031):**
- **BSR #1:** #58 in Kindle Store (source: product page B0FQFHZXNG — "The Age Code," David Cox, 45 reviews)
- **BSR #10:** #9,878 in Kindle Store (source: product page B0FBKX4QG8 — "High Protein Cookbook for Weight Loss," Sarah Collins, 328 reviews)

**ALGO §10 niche-health distribution check:**
- #1 at BSR #58 = extremely high velocity at the top (likely a major Sunday Times / ITV-featured launch).
  This is a hot-category signal — real buyer demand, not a dead niche.
- #10 at BSR #9,878 = slightly more accessible than Disorders & Diseases. ACCESSIBLE.
- No H. pylori or gut-infection titles in top 10 confirmed by harvest.

- **Why it fits:** The diet and stomach-lining-healing chapters legitimately qualify the book here. Broader traffic pool.
- **Day to add:** Day 1 (second upload slot).

---

## CATEGORY 3 — LOCKED: NUTRITION | Day 14–30 via KDP CS email

**DECISION LOCKED: Option B — Nutrition**
**Locked by:** category-decision-agent (master-orchestrator, Opus)
**Locked on:** 2026-06-16
**BSR basis:** live harvest 2026-06-16 (see data above)

**Full Kindle path (locked):**
`Kindle Store > Kindle eBooks > Health, Fitness & Dieting > Diet & Nutrition > Nutrition`

**Live browse-tree equivalent (Amazon.co.uk):**
`Kindle Store > Books (Kindle eBooks) > Health & Fitness > Nutrition` (node 362840031 confirmed live)

**BSR data (same harvest as Cat 2 — same node):**
- **BSR #1:** #58 in Kindle Store (source: product page B0FQFHZXNG)
- **BSR #10:** #9,878 in Kindle Store (source: product page B0FBKX4QG8)

**Why Nutrition was chosen over Cancer (Option A):**

1. **Cancer sub-category HARVEST-FAILED on .co.uk.** The planned path
   `...Diseases & Physical Ailments > Cancer` (or `...Disorders & Diseases > Cancer`) does not
   exist as a browsable sub-node in the live Amazon.co.uk Health & Fitness category tree as of
   2026-06-16. Requesting it via KDP CS email carries a high risk of rejection or misplacement
   if the node does not exist in KDP's backend for .co.uk.

2. **BSR accessibility.** Nutrition #10 = BSR #9,878 vs Disorders & Diseases #10 = BSR #8,006.
   Nutrition is marginally more accessible (higher BSR #10 = lower daily sales threshold).
   Neither is dramatically different; both are achievable at launch.

3. **Brand alignment.** The book's core tone is "calm, data-defused, no fear-sell." Nutrition
   is the brand-consistent slot. A Cancer-category placement would work only if the listing copy
   frames cancer risk as defused with data — the book does this correctly — but with the Cancer
   node itself unverifiable on .co.uk, the compliance risk outweighs the reach benefit.

4. **Content legitimacy.** The diet/stomach-lining chapters (Ch.6 food-as-medicine framework,
   test-of-cure integration, bismuth quadruple + dietary support throughout) give the book
   genuine, first-principles content fit for Nutrition. No gaming — this is earned placement.

5. **Buyer intent.** Nutrition browsers have acquisition intent (seeking solutions, not diagnoses).
   This matches the book's "recovery plan" positioning better than the Cancer searcher's
   crisis-mode intent.

**If KDP CS or the upload form offers the "Cancer" path after verification:** The book has
legitimate sourced content for it (IARC/Nature Medicine 2025, RR 0.61, FACTS.md §6). But
the primary lock is Nutrition. Do not switch without re-running the harvest to confirm the
Cancer node's BSR #10 and verifying the path is live on the .co.uk KDP form.

- **Day to add:** Day 14–30 via KDP customer service email (the 3rd category is not available
  in the upload form; request after first reviews land).

---

## VALIDATION
- Category count: **3** (compliant with the April 2026 hard cap). ✓
- No 4th/5th category requested (CS workaround no longer honoured — §15). ✓
- BSR arbitrage + niche-health distribution check (§10): **COMPLETE** (harvested 2026-06-16). ✓
- Zero invented BSR figures. Every figure sourced from product page harvest. ✓
- Path-name drift documented and kdp-upload-agent alerted for upload-time verification. ✓
- Category 3 decision: LOCKED — Nutrition. Prior "Architect to choose" gate cleared. ✓

---

*BSR figures harvested 2026-06-16 via Playwright (category-decision-agent, master-orchestrator Opus). All figures are live Amazon.co.uk readings, not estimates. Status: FULLY LOCKED.*
