# Pending before publish — The H. Pylori Recovery Plan

Decided 2026-06-12. Item 1 (swap) is now DONE; item 2 (cover) is still pending. Item 2 must precede the publish gate.

## 1. Series-number swap → this book becomes Book 2 — ✅ DONE 2026-06-12

The H. Pylori Recovery Plan → **Book 2**; The 7-Day Gut Reset → **Book 3**.

Reason: H. pylori is production-complete (through Stage 09); 7-Day Gut Reset is at Stage 6.5. Publishing H. pylori first completes the funnel, and H. pylori's back matter already cross-sells 7-Day Gut Reset by exact title (premature until that book is live).

**Executed 2026-06-12 (master-orchestrator, Opus). Files changed:**
- ✅ `pipeline-state.json` → `series_number: 3 → 2`; `09-series.outputs[]` now lists the persisted `SERIES-CONTINUITY-2026-06-12.md`; `last_agent_run` records the swap.
- ✅ `KDP-LISTING.md` — series number → Book 2, series order line, description "third book" → "part of", DECISION-2 sibling note, footer.
- ✅ `BLUEPRINT.md` — series arc → Book 2, series-position paragraph.
- ✅ `manuscript/99-back-matter.md` — Also-by ordering fixed to series position (Book 1 *Fix Your Gut for Good* first, then Book 3 *The 7-Day Gut Reset*), exact titles preserved.
- ✅ `../../SERIES-FACTS.md` — master record table re-ordered (H. pylori = Book 2, 7-Day = Book 3), reading order, KEY FACTS / RECURRING TROPES / CONDITIONS labels relabelled Book 2, swap documented additively.
- ✅ The 7-Day Gut Reset (now Book 3): `pipeline-state.json` (`series` + `series_number: 3` added), `KDP-LISTING.md` (Book 2 → Book 3), `BLUEPRINT.md` (stale "Book 1" → Book 3).
- ✅ **Series-continuity re-run AND persisted** to `SERIES-CONTINUITY-2026-06-12.md` (the Stage-09 report was never written before — `../../PIPELINE-ENFORCEMENT.md` §5). Verdict: APPROVED, zero critical conflicts.
- Series string `Fix Your Gut for Good` byte-identical throughout; all cross-sells use exact titles; live Book 1 manuscript NOT modified (back-matter Also-by change documented only); zero invented numbers.

## 2. Cover replacement

The current cover (`exports/final/cover-kdp-final.jpg`, navy/ochre, 46/50) was judged too weak to convert. A new cover was made in ChatGPT and will be supplied by the Architect.

On arrival:
- Validate KDP spec: 1600×2560 px, sRGB, < 50 MB, ratio 1.6.
- Run COVER-PSYCHOLOGY 7-point go/no-go.
- Replace `exports/final/cover-kdp*.jpg` and rebuild.
- **AI-image disclosure:** a ChatGPT cover IS AI-generated — the KDP "Images" questionnaire field must declare it. Resolves the open disclosure conflict flagged at Stage 07.
