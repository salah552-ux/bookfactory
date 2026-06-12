# Series Continuity Report — BookFactory
## 2026-06-12 | Series: Fix Your Gut for Good | Books checked: Book 1 (Fix Your Gut for Good), Book 2 (The H. Pylori Recovery Plan), Book 3 (The 7-Day Gut Reset)

Re-run of the series-continuity-guardian logic after the **series-number swap** of 2026-06-12: The H. Pylori Recovery Plan moved from Book 3 → **Book 2**; The 7-Day Gut Reset moved from Book 2 → **Book 3**. The series string `Fix Your Gut for Good` is unchanged. This report is **persisted to disk** — the 2026-06-11 Stage-09 run produced its verdict in the agent_log notes but never wrote a standalone file (the phantom `SERIES-CONTINUITY-2026-06-11.md` was removed by the pipeline validator). This file resolves that gap and is registered in `pipeline-state.json` `09-series.outputs[]` (satisfies INV-2).

No medical fact, statistic, definition, or causal-language level changed in the swap — only the position numbers and the sibling cross-sell ordering. Continuity was therefore re-checked on the dimensions a numbering change can disturb: PROMISES (cross-sell ordering / reading-order assumptions) and VOICE-AND-POSITION. The statistical/terminology/causal dimensions were re-confirmed unchanged from the 2026-06-11 clean result.

---

## CATALOG STATUS

| Book | Title (exact) | Slug | Stage | FACTS.md present | KDP status |
|------|---------------|------|-------|------------------|-----------|
| 1 | Fix Your Gut for Good: Stop Relapsing | fix-your-gut-for-good | 10-postlaunch | yes | **LIVE** (ASIN B0GXYLWS1W) |
| 2 | The H. Pylori Recovery Plan | h-pylori-recovery-plan | 09-series (held at publish gate) | yes | NOT live (published=false) |
| 3 | The 7-Day Gut Reset | the-7-day-gut-reset | 6.5 (07-publishing pending) | yes | NOT live (published=false) |

**Series string (byte-identical KDP field across all three):** `Fix Your Gut for Good`
**Reading order:** Book 1 = full anchor (SIBO) · Book 2 = condition-specific clinical guide (H. pylori) · Book 3 = diagnostic short guide (7-day).

---

## CRITICAL CONFLICTS — FIX BEFORE APPROVAL

**None.** Zero critical conflicts under the new ordering.

- **Statistical (3A):** No statistic moved. H. pylori prevalence "about half the world" (`books/h-pylori-recovery-plan` Ch.1) still reconciles with Book 1 Ch.4 "roughly half the global population." NNT ≈ 332 / RR 0.61, 76% attributable, 22.2–31.5% clarithromycin resistance, ~28.7% first-line failure, test-of-cure timing — all unchanged and still sourced in `books/h-pylori-recovery-plan/FACTS.md`. No numerical contradiction between any two books.
- **Terminology (3B):** No term redefined. SIBO/MMC/IMO/CdtB/vinculin etc. remain Book-1 canon; the H. pylori book references, does not redefine.
- **Causal language (3C):** No causal-level change. The dual cancer message ("real enough to treat … low enough not to panic") is intact and remains a forward series convention. No "causes" overclaim introduced by the renumber.
- **Promise (3D):** No broken promise created by the swap (see major flag M1 below for the pre-existing premature-reference, which the swap *reduces in severity*, not worsens).

---

## MAJOR CONFLICTS — FIX IN NEXT REVISION

### M1 — Cross-sell to a not-yet-live sibling (premature reference) — SEVERITY REDUCED BY THE SWAP
**Type:** Promise / Voice-and-Position
**Books affected:** Book 2 (The H. Pylori Recovery Plan) back matter → names *The 7-Day Gut Reset* (Book 3), which is NOT live.
**Quote (`books/h-pylori-recovery-plan/manuscript/99-back-matter.md`):** "**The 7-Day Gut Reset** — the shorter, more diagnostic guide."
**What's wrong:** A live book should not cross-sell a sibling that has no buy link.
**Why the swap helps:** Before the swap, the production-complete H. pylori book was Book 3 and depended on the *less* complete book (then Book 2) reaching market first — a blocked funnel. After the swap, H. pylori is Book 2 and publishes **first**; the 7-Day reference simply waits behind it. The intended resolution is to publish Book 2 (H. pylori), then Book 3 (7-day), at which point the cross-sell resolves cleanly.
**Recommended fix:** At Book 2's KDP upload, if *The 7-Day Gut Reset* is not yet live, either (a) leave the title mention as forward-looking (acceptable — it is described, not linked), or (b) hold the `[REVIEW_URL_PLACEHOLDER]`/link insertion for that sibling until it has an ASIN. No manuscript change required now. Cross-sell ordering is now correct (Book 1 anchor first, Book 3 second), both by **exact title**.
**SERIES-FACTS.md update needed:** Done — STATUS CORRECTION FLAG updated to reflect both Book 2 and Book 3 as not-yet-live and to name H. pylori-first as the resolution.

---

## MINOR FLAGS — AWARENESS ONLY

- **Book 1 live back matter has no Also-by block and carries an orphaned forward-reference.** `books/fix-your-gut-for-good/manuscript/11-conclusion.md` line 64: "This is Book 1 of a planned series. The next book addresses the doctor relationship in full …" — this names a book that was never built and does not name Book 2 (H. pylori) or Book 3 (7-day) by title. **DOCUMENTED ONLY — Book 1's manuscript is LIVE and was NOT modified** (hard rule). Recommended back-matter change for a future Book 1 listing refresh (not executed here): add an Also-by block naming *The H. Pylori Recovery Plan* (Book 2) and *The 7-Day Gut Reset* (Book 3) by exact title once they are live, and retire the orphaned "doctor relationship" forward-reference. This requires a re-upload of Book 1 and is out of scope for this metadata swap.
- **Author-name form drift** in older templates (standard = `S.A. Ibrahim`, no internal space variants). Not introduced or worsened by the swap.
- **7-Day Gut Reset back matter** cross-sells only *Fix Your Gut for Good* (Book 1) by exact title. This is correct for its stage (Stage 6.5) and was NOT expanded — no invented cross-sell content added for a book that hasn't reached its series stage.

---

## CLEAN AREAS — NO CONFLICTS DETECTED

- Statistics across all three books (3A) — consistent, sourced.
- Terminology (3B) — consistent.
- Causal language discipline (3C), including the dual cancer message — consistent.
- Series voice anchors (3E) — second person, contractions, plainspoken/unflinching/warm-but-unsentimental, mechanism-before-instruction, no-supplement-sales moat, S.A. Ibrahim with no clinical credentials — all honoured in Book 2 (H. pylori) and Book 3 (7-day).
- Series string `Fix Your Gut for Good` — byte-identical across all three books' listings/blueprints.
- Cross-sell exact-title discipline — every sibling reference uses the exact book title, no paraphrase.

---

## SERIES-FACTS.md GAPS

None outstanding. The master record (`BookFactory/SERIES-FACTS.md`) now reflects: Book 1 = Fix Your Gut for Good, Book 2 = The H. Pylori Recovery Plan, Book 3 = The 7-Day Gut Reset; reading order updated; H. pylori KEY FACTS and RECURRING TROPES sections relabelled Book 2; CONDITIONS table H. pylori entry relabelled Book 2; the 2026-06-12 swap documented additively (prior Book-3 labels noted, not silently erased).

---

## OPEN THREADS TO CARRY FORWARD

- Publish Book 2 (The H. Pylori Recovery Plan) before Book 3 (The 7-Day Gut Reset) to resolve M1 and complete the funnel.
- At a future Book 1 listing refresh, add the Also-by block and retire the orphaned forward-reference (documented above; not executed — Book 1 is live and untouched).

---

## VERDICT

**APPROVED — series continuity clean under the new Book 2/3 ordering.** Zero critical conflicts. One pre-existing major flag (M1) whose severity is *reduced* by the swap and which resolves on publishing Book 2 first. Minor flags are documentation-only (Book 1 live manuscript not modified). No invented numbers anywhere in this report.
