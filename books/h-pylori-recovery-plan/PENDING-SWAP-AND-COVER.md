# Pending before publish — The H. Pylori Recovery Plan

Decided 2026-06-12, NOT yet executed. Both items must precede the publish gate.

## 1. Series-number swap → this book becomes Book 2

The H. Pylori Recovery Plan → **Book 2**; The 7-Day Gut Reset → **Book 3**.

Reason: H. pylori is production-complete (through Stage 09); 7-Day Gut Reset is at Stage 6.5. Publishing H. pylori first completes the funnel, and H. pylori's back matter already cross-sells 7-Day Gut Reset by exact title (premature until that book is live).

When executed, touch:
- `pipeline-state.json` → `series_number: 3 → 2`
- `KDP-LISTING.md` (series position)
- `BLUEPRINT.md` (series arc)
- `manuscript/99-back-matter.md` (cross-sell ordering / "Book N" references)
- `../../SERIES-FACTS.md` (series master record)
- **Re-run series-continuity** — its Stage-09 report was never persisted (see `../../PIPELINE-ENFORCEMENT.md` §5).

## 2. Cover replacement

The current cover (`exports/final/cover-kdp-final.jpg`, navy/ochre, 46/50) was judged too weak to convert. A new cover was made in ChatGPT and will be supplied by the Architect.

On arrival:
- Validate KDP spec: 1600×2560 px, sRGB, < 50 MB, ratio 1.6.
- Run COVER-PSYCHOLOGY 7-point go/no-go.
- Replace `exports/final/cover-kdp*.jpg` and rebuild.
- **AI-image disclosure:** a ChatGPT cover IS AI-generated — the KDP "Images" questionnaire field must declare it. Resolves the open disclosure conflict flagged at Stage 07.
