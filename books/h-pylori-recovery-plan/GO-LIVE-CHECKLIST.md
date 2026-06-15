# GO-LIVE CHECKLIST — The H. Pylori Recovery Plan (Book 2)
**Purpose:** collapse "publish Book 2" into the minimal, ordered set of actions and surface exactly which are the Architect's. Built 2026-06-15. Full field-by-field detail lives in `KDP-UPLOAD-GUIDE.md`; this is the decision layer on top.

Book 2 is **built through Stage 09** and **valid** (enforcement: 0 critical). It is held only by the human publish gate. Nothing below publishes anything until the Architect runs the KDP upload and types PUBLISH.

---

## A. Resolved on the pipeline side (no action needed)
- ✅ Manuscript, all 3 formats (EPUB/PDF/DOCX), interior, blurb (CONVERSION-COPY → KDP listing), keywords, series string `Fix Your Gut for Good` (Book 2), back-matter cross-sell — done and validated.
- ✅ **AI-image disclosure DECIDED:** the replacement cover is being made in ChatGPT = **AI-generated imagery**. The KDP "Content" / AI questionnaire **must declare AI-generated images** (text is human-authored). This closes the prior open disclosure conflict. (Do not answer "None" for images.)
- ✅ Categories 1 & 2 locked: `… Diseases & Physical Ailments > Abdominal Disorders` (primary, badge target) and `… Diet & Nutrition > Digestive Health` (reach).

## B. Decisions only the Architect can make (these gate publish)
1. **Cover.** Drop the ChatGPT cover image → I validate to KDP spec (1600×2560, sRGB, <50 MB, ratio 1.6) + COVER-PSYCHOLOGY 7-point check, then slot it in. *(Or set `OPENAI_API_KEY` and I auto-generate via `generate-cover.mjs`.)*
2. **Category slot 3** (added post-upload via KDP CS email). CATEGORY-SELECTION flags the tension:
   - **Cancer crossover** — reaches the dominant "am I going to get cancer" fear-searcher; *brand-tension risk* against the "no-panic" promise. Only safe if the listing/A+ frame cancer risk as **defused with data** (the conversion copy already does this).
   - **Nutrition** — neutral, on-brand, safe, broad reach.
   - *My lean: **Nutrition** for the cleanest brand fit — but this is your call; Cancer is defensible given the copy defuses it.*
3. **PUBLISH** — the explicit word, after the KDP draft is reviewed. Required by the upload guard.

## C. One open DATA item (nice-to-have, not a hard blocker)
- ⏳ **T-14 live BSR / category-path harvest** — the real #1/#10 BSR for the 3 category paths + live path-name confirmation. Amazon harvesting is working again (proven 2026-06-13), but the Playwright browser backend was down at this write; **retry the harvest when the browser is back.** This confirms the categories are winnable and sets launch targets; it does not block the upload itself.

## D. The minimal publish motion (Architect, ~one sitting)
1. Provide/approve the cover (B-1).
2. Decide slot 3 (B-2).
3. KDP → create Kindle eBook → paste title/subtitle/description/keywords from `KDP-UPLOAD-GUIDE.md`; set Categories 1 & 2; set series `Fix Your Gut for Good`.
4. Complete the AI questionnaire — **declare AI-generated cover image** (A).
5. Set price/KDP Select per `KDP-UPLOAD-GUIDE.md`.
6. Save draft → review → **PUBLISH**.
7. After live: email KDP CS for category slot 3; record the ASIN in `pipeline-state.json`; then the post-launch loop + `calibration_engine.py add-observation` can start logging real data.

---
*Book NOT published; `published=false`; no ASIN. This checklist changes nothing live — it only sequences the human gate.*
