# Series Continuity Report — BookFactory
## 2026-06-11 | Series: Fix Your Gut for Good | Books checked: Book 1 (live), Book 2 (in pipeline), Book 3 (held at publish gate)
## Agent: series-continuity-guardian (run by master-orchestrator, Stage 09) | Trigger: Book 3 completed pipeline, pre-approval check

---

## CATALOG STATUS

| Book | Title | Slug | Chapters | FACTS.md | KDP status | Last checked |
|------|-------|------|----------|----------|-----------|--------------|
| 1 | Fix Your Gut for Good: Stop Relapsing | fix-your-gut-for-good | 10 + intro/conclusion | ✓ present | **LIVE** (ASIN B0GXYLWS1W, 2026-04-21) | 2026-06-11 |
| 2 | The 7-Day Gut Reset | the-7-day-gut-reset | 7 days + intro/conclusion | ✓ present | NOT live (Stage 6.5, published=false) | 2026-06-11 |
| 3 | The H. Pylori Recovery Plan | h-pylori-recovery-plan | 12 + intro/appendices | ✓ present | NOT live (held at publish gate) | 2026-06-11 |

Master canon read: `BookFactory/SERIES-FACTS.md` (gut-health section). Note: the gut master lives in this root file, not the spec's `SERIES-FACTS-GUT.md` path; both series share the root file (documented in the file's location note).

---

## CRITICAL CONFLICTS — FIX BEFORE APPROVAL

**None.** No critical statistical, terminological, causal-language, or broken-promise conflict was found between Book 3 and the live/canon books.

---

## MAJOR CONFLICTS — FIX IN NEXT REVISION

### Conflict M1: Book 3 cross-sells *The 7-Day Gut Reset* as an available companion, but Book 2 is not live
**Type:** Promise / Premature cross-reference
**Books affected:** Book 3 (Ch.10 / `11-chapter-10.md`, and back matter / `99-back-matter.md`) vs the actual publication state of Book 2.
**Book 3 states (Ch.10, line 67):** "The first is *The 7-Day Gut Reset*. It is the shorter, more diagnostic guide — the one to reach for if you want to triage your symptoms..."
**Book 3 states (back matter, line 53):** "**The 7-Day Gut Reset** — the shorter, more diagnostic guide. ... this is the one to reach for."
**Canon / reality:** `the-7-day-gut-reset/pipeline-state.json` → `current_stage: 6.5`, `07-publishing: pending`, `published: false`, `asin: null`. Book 2 is built but NOT on Amazon.
**What's wrong:** If Book 3 goes live before Book 2, a reader who follows the cross-sell to *The 7-Day Gut Reset* finds nothing to buy — a dead reference that erodes trust and wastes the highest-intent funnel click.
**Severity rationale:** MAJOR not CRITICAL because the content is factually correct (the book exists and the description is accurate) and the resolution is a publication-ordering decision, not a content error. It becomes a non-issue the moment Book 2 publishes.
**Recommended fix (ordering-dependent — orchestrator/Architect decision, do NOT silently edit Book 3 manuscript):**
- **Preferred:** publish Book 2 (*The 7-Day Gut Reset*) before or at the same time as Book 3. Book 2 is already at Stage 6.5 (production complete, 285/300) and only needs the publishing stages. This makes both cross-sells in Book 3 live and correct, and is the higher-revenue path (completes the funnel).
- **Alternative (if Book 3 must ship first):** soften the *7-Day Gut Reset* mention in Book 3 to series-coming-soon language, OR remove the specific Book 2 line and keep only the live *Fix Your Gut for Good* cross-sell, then restore the Book 2 line at a listing refresh once Book 2 is live. This is a Book 3 (not-yet-live) manuscript edit, so it is permitted before Book 3's first upload — but it is a downgrade and should only be taken if the ordering can't be fixed.
**SERIES-FACTS.md update needed:** Already added — the SERIES MASTER RECORD now carries the explicit premature-reference flag.

### Conflict M2: *Fix Your Gut for Good* (Book 1, LIVE) has no "Also by" cross-sell at all
**Type:** Cross-promotion gap (not a contradiction)
**Books affected:** Book 1 live manuscript (`fix-your-gut-for-good/manuscript/11-conclusion.md`).
**Canon / reality:** Book 1's conclusion ends with a generic "This is Book 1 of a planned series. The next book addresses the doctor relationship..." (line 64) — which describes a book that does NOT match either Book 2 (7-Day Gut Reset) or Book 3 (H. pylori). There is no "Also by S.A. Ibrahim" block naming the actual sibling titles.
**What's wrong:** The live anchor of the series sells none of its real siblings by name, and its one forward-reference points at a "doctor relationship" book that was never built. Every reader who finishes the series anchor is a lost cross-sell.
**Recommended fix:** Handled by series-sync-agent (see `series-sync-report` section below) — it produces the exact "Also by" block to add to Book 1 once the sibling books are live. **Do NOT apply to Book 1 yet:** it is a live KDP Select title; a back-matter change requires an EPUB rebuild + re-upload, and the block can only name books that are actually live (currently only Book 1 itself). Flagged for the post-launch / next-upload window.

---

## MINOR FLAGS — AWARENESS ONLY

- **F1 — Series-FACTS conditions table was stale.** The CONDITIONS table listed "H. pylori | Book 5 (planned)"; the real slot is Book 3. Annotated in this run (not silently overwritten) — see SERIES-FACTS.md.
- **F2 — Book 1 conclusion forward-reference is orphaned.** "The next book addresses the doctor relationship in full" (Book 1, conclusion line 64) describes a title that does not exist in the series as built. Not a Book-3 conflict; flag for Book 1's next revision to retarget at the real Book 2/3.
- **F3 — Author-name form.** Book 3 uses "S.A. Ibrahim" (no space) throughout. SERIES-FACTS voice anchors and the 2026-05-31 SERIES-SYNC-REPORT use "S. A. Ibrahim" (with space) in the "Also by" template. Series standard per most live assets and the proofreader lock is **S.A. Ibrahim** (no space). Use S.A. Ibrahim everywhere; correct the spaced form in any sync template before it is pasted into a live book. (series-sync-agent autonomy: name-format normalisation permitted.)

---

## CLEAN AREAS — NO CONFLICTS DETECTED

- **Statistical consistency (Book 1 ↔ Book 3):** H. pylori prevalence is consistent. Book 1 Ch.4: "estimated in roughly half the global population." Book 3 Intro: "About half the world's population carries H. pylori." Same claim, same framing, no numeric drift. ✓
- **H. pylori mechanism (Book 1 ↔ Book 3):** Book 1 Ch.4 describes H. pylori disrupting acid production via direct cell damage + inflammation; Book 3 Ch.2 describes mucosal colonisation and inflammation. Consistent, non-contradictory, Book 3 simply goes deeper. ✓
- **Causal language:** Book 3 holds association-vs-causation discipline throughout (cancer framed as attributable/Group 1 carcinogen with the de-panic RR/NNT pairing; diet framed as "may reduce symptom load," never "heals"). No causal overreach that conflicts with the series' locked causal-language exclusions. ✓
- **Terminology:** "H. pylori" / "Helicobacter pylori" form consistent (italic full name on first use, roman abbreviation after — 123 occurrences identical per proofreader). No term redefined in a way that conflicts with Book 1's H. pylori references. ✓
- **Voice / target reader:** Book 3's Rachel (41, post-diagnosis, cancer-anxious, distrusts sellers) is a faithful condition-specific instance of the series Sarah persona (30s–40s woman, failed treatment cycles, done being dismissed). Second person, contractions, mechanism-before-instruction, no forbidden phrases — series voice held. ✓
- **No-supplement-sales moat:** zero brand/supplement/vendor names in Book 3 (no Matula, no Manuka, no probiotic brands) — consistent with the series brand promise. ✓
- **Disclaimer:** full medical disclaimer present (copyright page + back matter), chapter-head disclaimers on cancer/treatment/rescue chapters, red-flag urgent-care line present — meets the series disclaimer standard (tightened appropriately for a prescription-treatment topic). ✓
- **Cross-sell exact-title discipline:** Book 3 names both sibling titles by exact title — *The 7-Day Gut Reset* and *Fix Your Gut for Good* — with no paraphrase and no pricing in the manuscript. ✓ (subject to the M1 premature-reference timing flag for Book 2.)

---

## SERIES-FACTS.md GAPS

1. **No formal RECURRING TROPES / series-conventions section existed for the gut series** (the spec's dimension 3F reads it). Populated this run as "Book 3 — RECURRING TROPES / SERIES CONVENTIONS HONOURED" in SERIES-FACTS.md (non-fiction analogue: voice, mechanism-before-instruction, DCT, no-sales moat, credentials rule, 4-phase spirit-not-letter).
2. **No authoritative publication-status table existed** — the only status signals were scattered planned-roadmap mentions ("Book 5 planned" etc.). Populated this run as the SERIES MASTER RECORD.
3. **H. pylori series-level statistics were not yet in the master** — Book 3's H. pylori stats (76% attributable, RR 0.61 / NNT 332, BQT first-line, 22.2–31.5% clarithromycin resistance, test-of-cure timing) added this run so future books referencing H. pylori draw from a locked series source.

## RECOMMENDED SERIES-FACTS.md ADDITIONS

All three gaps above were filled in this run (additive, no silent overwrite of prior planned-roadmap entries — the stale "Book 5" mapping was annotated, not deleted, with the correction pointing to the master record).

---

## OPEN THREADS TO CARRY FORWARD (non-fiction)

- **Cross-sell completeness depends on publication order.** The series cannot present a fully live cross-sell carousel until Book 2 publishes. Resolve the Book 2 → live transition (it is the single blocker to a clean three-book funnel).
- **Book 1 back-matter retrofit.** When the next book is live, Book 1 needs (a) an "Also by" block naming the real siblings and (b) a corrected forward-reference (the "doctor relationship" line). Both require a Book 1 re-upload — batch them.
- **Dual cancer message is now a series convention.** Any future cancer-adjacent gut title must carry "real enough to treat, low enough not to panic" pairing — locked in SERIES-FACTS.md.

---

## VERDICT

**Book 3 (The H. Pylori Recovery Plan) is APPROVED for series continuity — no critical conflicts.** The one MAJOR item (M1) is a publication-ordering decision, not a content defect: Book 3's cross-sell of *The 7-Day Gut Reset* is accurate but premature until Book 2 is live. Recommended resolution is to publish Book 2 before/with Book 3. Book 3's manuscript needs no continuity edit if that ordering holds.

*Run by master-orchestrator (Opus) acting as series-continuity-guardian, Stage 09. Exact quotes with file locations. No invented numbers. — 2026-06-11*
