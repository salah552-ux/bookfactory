# BookFactory — State Integrity Audit
**Date:** 2026-06-29
**Total contradictions found:** 5 across 3 books

> This audit is read-only. No pipeline-state.json files were modified.
> Previous audit: integrity-2026-06-21.md (5 contradictions).
> All 5 contradictions from that report remain unresolved — no pipeline-state.json files were touched between 2026-06-21 and 2026-06-29.
> Additional disk evidence gathered this run deepens two existing findings (see untitled-cosy-mystery Check 5 and Check 6, and the-dust-between-seconds Check 2).

---

## fix-your-gut-for-good

**Pipeline version:** 2.0 | **Current stage:** 6 | **Last updated:** 2026-04-19

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published` is `false` and `publishing.kdp_status` is `"not_started"`. Consistent.

### Check 2 — current_stage consistency
PASS — `current_stage` is `6` (06-production, `"complete"`). All stages 01–06 are `"complete"`. Stages 07–10 are `"not_started"`. No earlier stage is pending or not_started while a later stage is complete. Consistent.

### Check 3 — Date chronology
PASS — Stage `completed_at` values are in ascending order: 01-research `2026-04-10`, 02-planning `2026-04-11`, 03-writing `2026-04-17`, 04-quality `2026-04-18`, 05-optimisation `2026-04-18`, 06-production `2026-04-19`. No `live_date`, no `created_at`, no `weekly_log`. No chronological violations.

### Check 4 — Gap flag vs resolved note
PASS — No gap flags present in this file. No contradictory resolution notes detected.

### Check 5 — production.*_built vs file paths
CONTRADICTION *(unresolved for 3 consecutive weeks)*: `human_gates.cover_approved` is `true` but `production.cover_file` is `null`. A human gate confirming cover approval has been recorded, yet no file path is written to `production.cover_file`. Additionally, `stages["06-production"].status` is `"complete"` while all three build flags (`epub_built`, `pdf_built`, `docx_built`) remain `false` and corresponding file fields are `null`. A completed production stage should have produced at minimum an EPUB. Disk inspection confirms no `.epub`, `.pdf`, or cover `.jpg` files exist anywhere under `books/fix-your-gut-for-good/`.
→ Fields involved: `human_gates.cover_approved = true` vs `production.cover_file = null`; `stages["06-production"].status = "complete"` vs `production.epub_built = false`, `production.pdf_built = false`, `production.docx_built = false`
→ Suggested fix: Run `bash build-manuscript.sh fix-your-gut-for-good` and `bash build-pdf.sh fix-your-gut-for-good` to produce the build artifacts. Once files exist, populate `production.epub_file`, `production.epub_built`, `production.pdf_built`, and `production.docx_built`. Separately, locate the approved cover asset and populate `production.cover_file`. The book cannot advance to Stage 07 (publishing) without these fields set.

### Check 6 — Numeric impossibilities
PASS — `post_launch.review_count` is `0` and `post_launch.avg_rating` is `null`. Zero reviews with null rating is consistent (book not yet published). `publishing.royalty_pct` is `null` — acceptable pre-publishing. No negative counts. No royalty percentage outside the 35/70 valid range.

### Check 7 — last_updated vs newest agent_log timestamp
PASS — `last_updated` is `2026-04-19T00:00:00Z`. The only `agent_log` entry timestamp is `2026-04-19T00:00:00Z`. Timestamps match. Consistent.

**Contradictions in this book: 1**

---

## the-dust-between-seconds

**Pipeline version:** 2.0 | **Current stage:** 3 | **Last updated:** 2026-05-01

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published` is `false` and `publishing.kdp_status` is `"not_started"`. Consistent.

### Check 2 — current_stage consistency
CONTRADICTION *(unresolved for 3 consecutive weeks)*: `writing.completed_chapters` is `1` and `writing.approved_chapters` is `1`, but `writing.current_chapter` is `"04-chapter-4"`. If the current working chapter is Chapter 4, then Chapters 1, 2, and 3 must all be complete. The counter is at minimum 2 chapters short. The `agent_log` entry (timestamp `2026-04-29`) explicitly states: "Chapter 3 complete and approved. Resuming from Chapter 4." — confirming at least 3 chapters are done, not 1.

Disk inspection this run confirms: `books/the-dust-between-seconds/manuscript/` contains **exactly one file — `03-chapter-3.md`**. Chapters 1 and 2 are absent from the manuscript directory entirely. This means either (a) chapters 1 and 2 were never written or never saved (a pipeline violation — Rule 6 requires all chapters to pass the 4-agent pipeline before being saved to manuscript), or (b) they were accidentally deleted. Either scenario is a data integrity risk: the novel cannot be built without all chapters present.
→ Fields involved: `writing.completed_chapters = 1`, `writing.approved_chapters = 1`, `writing.current_chapter = "04-chapter-4"`, `agent_log[0].notes` ("Chapter 3 complete and approved. Resuming from Chapter 4"), and disk file count (1 file found vs minimum 3 expected).
→ Suggested fix: Determine whether Chapters 1 and 2 were ever written. Search agent transcript or handoff logs. If they exist elsewhere, restore to `manuscript/`. If they were never written, they must be written now before Chapter 4 can proceed. Update `writing.completed_chapters` and `writing.approved_chapters` to reflect the true count once the manuscript state is clarified.

### Check 3 — Date chronology
PASS — Stage 01-research completed `2026-04-28`, 02-planning completed `2026-04-29`, 03-writing started `2026-04-30`. All dates in ascending order. No `live_date`, no `created_at`, no `weekly_log`. No chronological violations.

### Check 4 — Gap flag vs resolved note
PASS — No gap flags present in this file. No contradictory resolution notes detected.

### Check 5 — production.*_built vs file paths
PASS — All three build flags are `false` and corresponding file fields (`cover_file`, `epub_file`) are `null`. Consistent; book is in Stage 3 and production has not started.

### Check 6 — Numeric impossibilities
PASS — `post_launch.review_count` is `0` and `post_launch.avg_rating` is `null`. Consistent. `publishing.royalty_pct` is `null` (not yet published). No negative counts. No impossible royalty percentage.

### Check 7 — last_updated vs newest agent_log timestamp
CONTRADICTION *(unresolved for 2 consecutive weeks)*: `last_updated` is `2026-05-01T00:00:00Z`. The only `agent_log` entry timestamp is `2026-04-29T00:00:00Z`. The state file was modified 2 days after the last logged agent run with no corresponding `agent_log` entry to document what changed. This violates Rule 4 (every significant agent run must update pipeline-state.json via agent-log MODE 2).
→ Fields involved: `last_updated = 2026-05-01T00:00:00Z` vs `agent_log[0].timestamp = 2026-04-29T00:00:00Z`
→ Suggested fix: Identify what action was taken on `2026-05-01` and add a retroactive `agent_log` entry documenting it, or correct `last_updated` to `2026-04-29T00:00:00Z` if no actual agent action occurred on that date.

**Contradictions in this book: 2**

---

## untitled-cosy-mystery

**Pipeline version:** 2.0 | **Current stage:** 10 | **Last updated:** 2026-05-03

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published` is `true` and `publishing.kdp_status` is `"live"`. Consistent.

### Check 2 — current_stage consistency
PASS — `current_stage` is `10` (10-postlaunch, `"in_progress"`). Stages 01–07 are all `"complete"`. Stages 08 and 09 (`"not_started"`) cover Etsy products and series management — neither is a prerequisite for post-launch activity. Consistent.

### Check 3 — Date chronology
PASS — Stages 01–05 all completed `2026-04-27`; stage 06 completed `2026-05-02`; stage 07 started `2026-05-02`, completed `2026-05-03`; stage 10 started `2026-05-03`. `live_date` is `2026-05-03`, following all production stages. `agent_log` entries at `2026-05-02` then `2026-05-03` — ascending. No chronological violations.

Note: All five stages 01–05 (research, planning, 40-chapter writing, quality, optimisation) share an identical `completed_at` of `2026-04-27`, which is implausible for a 40-chapter mystery novel. This is a chronological plausibility concern — not a formal date-order contradiction — but warrants investigation. It may indicate the dates were set in bulk rather than incrementally.

### Check 4 — Gap flag vs resolved note
PASS — No gap flags present in this file. No contradictory resolution notes detected.

### Check 5 — production.*_built vs file paths
CONTRADICTION *(unresolved for 2 consecutive weeks)*: `production.epub_built` is `true` and `production.epub_file` is `"exports/final/manuscript-kdp.epub"`. `production.cover_file` is `"exports/final/cover-kdp.jpg"`. Both point to `books/untitled-cosy-mystery/exports/final/` — a directory that does not exist on disk (confirmed again this run). The referenced EPUB and cover files cannot be located. This book is live on KDP (ASIN `AT25QRT6FPTE6`, live since `2026-05-03`). If KDP requires a re-upload for any reason (revised edition, corrected metadata, takedown and re-publish), the source files are unlocatable.

Disk inspection found no `.epub` or `.jpg` files anywhere under `books/untitled-cosy-mystery/`. The 43-file `manuscript/` directory is intact (ch-001.md through ch-040.md plus front/back matter), so the source markdown exists and could be rebuilt via `bash build-manuscript.sh untitled-cosy-mystery` if needed.
→ Fields involved: `production.epub_built = true`, `production.epub_file = "exports/final/manuscript-kdp.epub"`, `production.cover_file = "exports/final/cover-kdp.jpg"` — all referencing a path that does not exist at `books/untitled-cosy-mystery/exports/final/`
→ Suggested fix: Run `bash build-manuscript.sh untitled-cosy-mystery` to regenerate the EPUB. Locate the original cover (check `design-agent` outputs, Google Drive, or Canva exports) and restore it to `exports/final/cover-kdp.jpg`. Update `production.epub_file` and `production.cover_file` once files are confirmed on disk. This is an operational risk on an actively earning title.

### Check 6 — Numeric impossibilities
CONTRADICTION *(unresolved for 3 consecutive weeks)*: `quality_scores.final_approval_score` is `null` but `human_gates.final_approval_passed` is `true`. The pipeline requires a minimum score of 270/300 from final-approval-agent before `final_approval_passed` can be set `true`. With a null score, the 270/300 threshold cannot be verified — the gate may have been manually set without the agent completing.

Disk inspection this run confirms: `FINAL-APPROVAL.md` does not exist under `books/untitled-cosy-mystery/`. `APPROVALS.md` records per-chapter grades (all Grade A, all `2026-04-27`) but contains no 300-point score. No final approval report file exists on disk. The score record is permanently missing from both state and filesystem.
→ Fields involved: `quality_scores.final_approval_score = null` vs `human_gates.final_approval_passed = true`; `FINAL-APPROVAL.md` absent from disk
→ Suggested fix: Re-run `final-approval-agent` against the manuscript to generate a score. The 40-chapter manuscript is intact in `manuscript/`. Record the resulting score in `quality_scores.final_approval_score`. If the score is ≥270/300, the gate stands. If it is <270, the gate must be cleared and remediation completed before the book's status is considered fully validated.

### Check 7 — last_updated vs newest agent_log timestamp
PASS — `last_updated` is `2026-05-03T00:00:00Z`. The newest `agent_log` entry timestamp is `2026-05-03T00:00:00Z`. Timestamps match. Consistent.

**Contradictions in this book: 2**

---

## Summary Table

| Book | Check 1 | Check 2 | Check 3 | Check 4 | Check 5 | Check 6 | Check 7 | Total |
|------|---------|---------|---------|---------|---------|---------|---------|-------|
| fix-your-gut-for-good | PASS | PASS | PASS | PASS | CONTRADICTION | PASS | PASS | 1 |
| the-dust-between-seconds | PASS | CONTRADICTION | PASS | PASS | PASS | PASS | CONTRADICTION | 2 |
| untitled-cosy-mystery | PASS | PASS | PASS | PASS | CONTRADICTION | CONTRADICTION | PASS | 2 |

**Total contradictions across all books: 5**

---

## Unresolved Contradiction Ageing

| Book | Contradiction | First detected | Weeks open |
|------|--------------|----------------|------------|
| fix-your-gut-for-good | cover_approved=true / cover_file=null / production stage complete but no builds | 2026-06-14 | 3 |
| the-dust-between-seconds | completed_chapters=1 vs current_chapter=04-chapter-4 / chapters 1&2 missing from disk | 2026-06-14 | 3 |
| the-dust-between-seconds | last_updated 2 days newer than newest agent_log entry | 2026-06-21 | 2 |
| untitled-cosy-mystery | epub_built=true / cover_file set / but exports/final/ does not exist on disk | 2026-06-21 | 2 |
| untitled-cosy-mystery | final_approval_score=null / final_approval_passed=true / FINAL-APPROVAL.md absent | 2026-06-14 | 3 |

---

## Most Serious Contradiction

**Book:** untitled-cosy-mystery (Death in the Cathedral Close)
**Check 5 — Missing production files on disk (active, earning title)**

`production.epub_built = true`, `production.epub_file = "exports/final/manuscript-kdp.epub"`, and `production.cover_file = "exports/final/cover-kdp.jpg"` — but the directory `books/untitled-cosy-mystery/exports/final/` does not exist. This book is live on KDP (ASIN `AT25QRT6FPTE6`, live since 2026-05-03, 57 days ago). Any KDP-side action requiring re-upload (cover refresh, edition update, metadata correction leading to re-submission) would fail: source files are gone. The source markdown is intact and can be rebuilt, but the original cover file is not recoverable via build scripts alone — it must be located from a design export or external backup.

This finding is now in its second consecutive week unresolved. Combined with the missing `final_approval_score` (also 3 weeks unresolved), this book has two open integrity failures on a live, revenue-generating title.

**Recommended immediate action:** Run `bash build-manuscript.sh untitled-cosy-mystery` to restore the EPUB. Locate the cover file (Canva, Google Drive, or design-agent output). Re-run `final-approval-agent` to regenerate the 300-point score and populate `quality_scores.final_approval_score`. Then update pipeline-state.json via `agent-log MODE 2`.

---

*Audit run: 2026-06-29 | Audit type: automated weekly state integrity | Files checked: 3 | Files modified: 0*
