# BookFactory — State Integrity Audit
**Date:** 2026-06-21
**Total contradictions found:** 5 across 3 books

> This audit is read-only. No pipeline-state.json files were modified.
> Previous audit: integrity-2026-06-14.md (4 contradictions).
> All 3 contradiction findings from that report remain unresolved.
> 1 new contradiction identified this week (Check 5, untitled-cosy-mystery).

---

## fix-your-gut-for-good

**Pipeline version:** 2.0 | **Current stage:** 6 | **Last updated:** 2026-04-19

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published` is `false` and `publishing.kdp_status` is `"not_started"`. Consistent.

### Check 2 — current_stage consistency
PASS — `current_stage` is `6` (06-production, `"complete"`). All stages 01–06 are `"complete"`. Stages 07–10 are `"not_started"`. No earlier stage is pending or not_started while a later stage is complete.

### Check 3 — Date chronology
PASS — Stage `completed_at` values are in ascending order: 01-research `2026-04-10`, 02-planning `2026-04-11`, 03-writing `2026-04-17`, 04-quality `2026-04-18`, 05-optimisation `2026-04-18`, 06-production `2026-04-19`. No `live_date`, no `created_at`, no `weekly_log`. No chronological violations.

### Check 4 — Gap flag vs resolved note
PASS — No gap flags present in this file. No contradictory resolution notes detected.

### Check 5 — production.*_built vs file paths
CONTRADICTION: `human_gates.cover_approved` is `true` but `production.cover_file` is `null`. A human gate confirming cover approval has been recorded, yet no file path has been written to `production.cover_file`. This means the approved cover file cannot be located programmatically, and any downstream agent (final-approval-agent, kdp-upload-agent) that reads `production.cover_file` to locate the asset will find nothing.
→ Fields involved: `human_gates.cover_approved = true` vs `production.cover_file = null`
→ Suggested fix: Populate `production.cover_file` with the actual path to the approved cover export (e.g. `exports/final/cover-kdp.jpg`). If the cover file has not yet been exported to disk, set `human_gates.cover_approved` back to `false` until both the file exists and the path is recorded.
→ Note: All three build flags (`epub_built`, `pdf_built`, `docx_built`) are `false` with corresponding file fields `null` — those are internally consistent and do not constitute contradictions.

### Check 6 — Numeric impossibilities
PASS — `post_launch.review_count` is `0` and `post_launch.avg_rating` is `null`. Zero reviews with null rating is consistent. `publishing.royalty_pct` is `null` (book not yet published) — acceptable at this stage. No negative counts. No royalty percentage outside the 35/70 valid range.

### Check 7 — last_updated vs newest agent_log timestamp
PASS — `last_updated` is `2026-04-19T00:00:00Z`. The only `agent_log` entry timestamp is `2026-04-19T00:00:00Z`. Timestamps match. Consistent.

**Contradictions in this book: 1**

---

## the-dust-between-seconds

**Pipeline version:** 2.0 | **Current stage:** 3 | **Last updated:** 2026-05-01

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published` is `false` and `publishing.kdp_status` is `"not_started"`. Consistent.

### Check 2 — current_stage consistency
CONTRADICTION: `current_stage` is `3` (03-writing, `"in_progress"`). The `writing` block records `completed_chapters: 1` and `approved_chapters: 1`, while `current_chapter` is `"04-chapter-4"`. The `agent_log` entry (timestamped `2026-04-29`) explicitly states: "Chapter 3 complete and approved. Resuming from Chapter 4." If the book is resuming from Chapter 4, then at minimum Chapters 1, 2, and 3 are all complete — making `completed_chapters` at least 3, not 1. The counter is 2 chapters behind the documented progress.
→ Fields involved: `writing.completed_chapters = 1` and `writing.approved_chapters = 1` vs `writing.current_chapter = "04-chapter-4"` and `agent_log[0].notes` ("Chapter 3 complete and approved")
→ Suggested fix: Update `writing.completed_chapters` to `3` and `writing.approved_chapters` to `3`. If writing has since progressed further and the state has not been updated, the correct number may be higher. Run `agent-log MODE 1` to reconcile before the next writing session to avoid briefing the fiction-writer with a stale chapter count.

### Check 3 — Date chronology
PASS — Stage 01-research completed `2026-04-28`, 02-planning completed `2026-04-29`, 03-writing started `2026-04-30`. All dates in ascending order. No `live_date`, no `created_at`, no `weekly_log`. No chronological violations.

### Check 4 — Gap flag vs resolved note
PASS — No gap flags present in this file. No contradictory resolution notes detected.

### Check 5 — production.*_built vs file paths
PASS — All three build flags are `false` and corresponding file fields (`cover_file`, `epub_file`) are `null`. Consistent; the book is in Stage 3 and production has not started.

### Check 6 — Numeric impossibilities
PASS — `post_launch.review_count` is `0` and `post_launch.avg_rating` is `null`. Consistent. `publishing.royalty_pct` is `null` (not yet published). No negative counts. No impossible royalty percentage.

### Check 7 — last_updated vs newest agent_log timestamp
CONTRADICTION: `last_updated` is `2026-05-01T00:00:00Z`. The only `agent_log` entry timestamp is `2026-04-29T00:00:00Z`. `last_updated` is 2 days newer than the newest (and only) log entry. The state file was modified after the last logged agent run, with no corresponding `agent_log` entry to document what changed. This violates Rule 4 of the pipeline (every significant agent run must update pipeline-state.json via `agent-log MODE 2`).
→ Fields involved: `last_updated = 2026-05-01T00:00:00Z` vs `agent_log[0].timestamp = 2026-04-29T00:00:00Z`
→ Suggested fix: Identify what action was taken on `2026-05-01` and add a retroactive `agent_log` entry documenting it, or correct `last_updated` to `2026-04-29T00:00:00Z` if no actual agent action occurred on that date.

**Contradictions in this book: 2**

---

## untitled-cosy-mystery

**Pipeline version:** 2.0 | **Current stage:** 10 | **Last updated:** 2026-05-03

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published` is `true` and `publishing.kdp_status` is `"live"`. Consistent.

### Check 2 — current_stage consistency
PASS — `current_stage` is `10` (10-postlaunch, `"in_progress"`). Stages 01–07 are all `"complete"`. Stages 08 and 09 (`"not_started"`) are the Etsy products and series management stages, which are not strict prerequisites for post-launch activity. No earlier required stage is blocking the current stage. Consistent.

### Check 3 — Date chronology
PASS — Stages 01–05 all completed `2026-04-27`, stage 06 completed `2026-05-02`, stage 07 started `2026-05-02` and completed `2026-05-03`, stage 10 started `2026-05-03`. `live_date` is `2026-05-03`, which follows all production stages. `agent_log` entries: `2026-05-02` then `2026-05-03` — ascending. No chronological violations.

### Check 4 — Gap flag vs resolved note
PASS — No gap flags present in this file. No contradictory resolution notes detected.

### Check 5 — production.*_built vs file paths
CONTRADICTION (x2 — same root cause):
(a) `production.epub_built` is `true` and `production.epub_file` is `"exports/final/manuscript-kdp.epub"` (non-null). However, the file does not exist on disk — the directory `books/untitled-cosy-mystery/exports/final/` does not exist. The EPUB cannot be verified or re-uploaded.
(b) `production.cover_file` is `"exports/final/cover-kdp.jpg"` (non-null) with `epub_built: true`, but the same directory does not exist on disk, making the cover file equally unlocatable.
→ Fields involved: `production.epub_built = true`, `production.epub_file = "exports/final/manuscript-kdp.epub"`, `production.cover_file = "exports/final/cover-kdp.jpg"` — all referencing a directory that does not exist at `books/untitled-cosy-mystery/exports/final/`
→ Suggested fix: Locate the actual EPUB and cover files (they may have been moved or deleted — check `exports/`, `build/`, or similar directories). Restore the files to their expected paths, or update `production.epub_file` and `production.cover_file` to reflect where the files actually reside. This is critical: if KDP ever requires a re-upload, these files cannot be found.
→ Note: This is a NEW finding not present in the 2026-06-14 audit, which checked path nullity only. This audit verified actual file existence on disk.

### Check 6 — Numeric impossibilities
CONTRADICTION: `quality_scores.final_approval_score` is `null` but `human_gates.final_approval_passed` is `true`. The pipeline requires a minimum score of 270/300 from final-approval-agent before `final_approval_passed` can be set to `true`. A null score with a passed gate makes it impossible to confirm the 270/300 threshold was met. This book is already live on KDP (ASIN AT25QRT6FPTE6) — the approval score record is permanently missing from the state file.
→ Fields involved: `quality_scores.final_approval_score = null` vs `human_gates.final_approval_passed = true`
→ Suggested fix: Retrieve the final-approval-agent output file (likely in `books/untitled-cosy-mystery/` — look for `FINAL-APPROVAL.md` or similar). Read the score from that file and populate `quality_scores.final_approval_score`. If the report file cannot be found, re-run `final-approval-agent` against the manuscript to regenerate the score record.

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

## Most Serious Contradiction

**Book:** untitled-cosy-mystery (Death in the Cathedral Close)
**Check 5 — Missing production files on disk**

`production.epub_built` is `true`, `production.epub_file` points to `exports/final/manuscript-kdp.epub`, and `production.cover_file` points to `exports/final/cover-kdp.jpg` — but the directory `books/untitled-cosy-mystery/exports/final/` does not exist on disk. This book is already live on KDP (ASIN `AT25QRT6FPTE6`). If KDP requires a re-upload, a revised edition, or a cover replacement for any reason, the source files cannot be found. This is an operational risk to an actively earning title. The missing `final_approval_score` (Check 6, same book) compounds this: the mandatory 300-point approval score record is also gone, making it impossible to verify the pipeline gate was legitimately passed.

**Immediate action required:** Locate the EPUB and cover files and restore them to `books/untitled-cosy-mystery/exports/final/`, or update the state file paths to wherever the files actually reside. Do not modify pipeline-state.json without first finding the files.

---

*Audit run: 2026-06-21 | Audit type: automated weekly state integrity | Files checked: 3 | Files modified: 0*
