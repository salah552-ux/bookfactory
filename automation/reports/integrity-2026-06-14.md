# BookFactory — State Integrity Audit
**Date:** 2026-06-14
**Total contradictions found:** 6

---

## fix-your-gut-for-good

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published` is `false` and `publishing.kdp_status` is `"not_started"`. Consistent.

### Check 2 — current_stage consistency
PASS — `current_stage` is `6` (06-production). All stages 01–06 are `"complete"`. Stages 07–10 are `"not_started"`. No earlier stage is pending or not_started while a later stage is complete.

### Check 3 — Date chronology
PASS — No `created_at` or `live_date` fields are populated (both null/absent). Stage `completed_at` values are in ascending order: research `2026-04-10`, planning `2026-04-11`, writing `2026-04-17`, quality `2026-04-18`, optimisation `2026-04-18`, production `2026-04-19`. No `weekly_log` present. No chronological violations.

### Check 4 — Gap flag vs resolved note
PASS — No gap flags present in this file. No contradictory resolution notes detected.

### Check 5 — production.*_built == true but path/file is null
CONTRADICTION: `human_gates.cover_approved` is `true` but `production.cover_file` is `null`. The cover has been marked as human-approved but no cover file path has been recorded in `production.cover_file`. Additionally, all three build flags (`epub_built`, `pdf_built`, `docx_built`) are `false` with corresponding file fields `null` — those are internally consistent (both false/null), but the approved cover has no file record.
→ Suggested fix: Populate `production.cover_file` with the actual cover file path, or if the cover file has not yet been exported, set `human_gates.cover_approved` back to `false` until the file is produced and path is recorded.

### Check 6 — Numeric impossibilities
PASS — `post_launch.review_count` is `0` and `post_launch.avg_rating` is `null`. Zero reviews with null rating is consistent. `publishing.royalty_pct` is `null` (book not yet published) — acceptable. No negative counts. No impossible royalty percentage.

### Check 7 — last_updated vs newest agent_log timestamp
PASS — `last_updated` is `2026-04-19T00:00:00Z`. The only `agent_log` entry timestamp is `2026-04-19T00:00:00Z`. `last_updated` matches the newest log entry. Consistent.

---

## the-dust-between-seconds

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published` is `false` and `publishing.kdp_status` is `"not_started"`. Consistent.

### Check 2 — current_stage consistency
CONTRADICTION: `current_stage` is `3` (03-writing), which is `"in_progress"`. This is consistent with the stages map in isolation. However, the `writing` block records `completed_chapters: 1` and `approved_chapters: 1`, while `current_chapter` is `"04-chapter-4"` and the `agent_log` note explicitly states "Chapter 3 complete and approved. Resuming from Chapter 4." If the book is currently working on Chapter 4, at minimum Chapters 1, 2, and 3 should all be complete, making `completed_chapters` at least 3, not 1. The `completed_chapters: 1` value is internally inconsistent with the stated progress of being about to start Chapter 4.
→ Suggested fix: Update `writing.completed_chapters` to `3` and `writing.approved_chapters` to `3` to reflect that Chapters 1, 2, and 3 are confirmed complete and approved per the agent_log note.

### Check 3 — Date chronology
PASS — Stage 01-research completed `2026-04-28`, stage 02-planning completed `2026-04-29`, stage 03-writing started `2026-04-30`. Dates are in ascending order. No `live_date`, no `created_at`, no `weekly_log`. No chronological violations.

### Check 4 — Gap flag vs resolved note
PASS — No gap flags present in this file. No contradictory resolution notes detected.

### Check 5 — production.*_built == true but path/file is null
PASS — All three build flags are `false` and corresponding file fields (`cover_file`, `epub_file`) are `null`. Internally consistent; book is in Stage 3 and production has not started.

### Check 6 — Numeric impossibilities
PASS — `post_launch.review_count` is `0` and `post_launch.avg_rating` is `null`. Zero reviews with null rating is consistent. `publishing.royalty_pct` is `null` (book not yet published). No negative counts. No impossible royalty percentage.

### Check 7 — last_updated vs newest agent_log timestamp
CONTRADICTION: `last_updated` is `2026-05-01T00:00:00Z`. The only `agent_log` entry timestamp is `2026-04-29T00:00:00Z`. `last_updated` is two days newer than the newest (and only) log entry, which means the state file was updated without a corresponding `agent_log` entry being written. This violates the pipeline rule that every significant agent run must log an entry via `agent-log MODE 2`.
→ Suggested fix: Identify what changed on `2026-05-01` and add a retroactive `agent_log` entry documenting that action and its result, or correct `last_updated` to match the actual last logged action (`2026-04-29T00:00:00Z`).

---

## untitled-cosy-mystery

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published` is `true` and `publishing.kdp_status` is `"live"`. Consistent.

### Check 2 — current_stage consistency
PASS — `current_stage` is `10` (10-postlaunch, `"in_progress"`). All stages 01–07 are `"complete"`. Stages 08 and 09 are `"not_started"` — these are the Etsy products and series management stages, which can legitimately run in parallel with or after post-launch rather than being strict prerequisites. Stage 10 is `"in_progress"`. No earlier required stage is `"pending"` or `"not_started"` in a way that blocks the current stage.

### Check 3 — Date chronology
PASS — Stages 01–05 all completed `2026-04-27`, stage 06 completed `2026-05-02`, stage 07 started `2026-05-02` and completed `2026-05-03`, stage 10 started `2026-05-03`. Dates are in non-descending order. `live_date` is `2026-05-03`, which is after all production stages — consistent. No `created_at` field present. `agent_log` entries: `2026-05-02` then `2026-05-03` — ascending. No `weekly_log`. No chronological violations.

### Check 4 — Gap flag vs resolved note
PASS — No gap flags present in this file. No contradictory resolution notes detected.

### Check 5 — production.*_built == true but path/file is null
PASS — `epub_built: true` with `epub_file: "exports/final/manuscript-kdp.epub"` (non-null). `pdf_built: true` and `docx_built: true` — these do not have dedicated path fields in the production block (only `cover_file` and `epub_file` are tracked), so no null path contradiction applies. `cover_file: "exports/final/cover-kdp.jpg"` is non-null and `epub_built` is `true` with a valid path. Consistent.

### Check 6 — Numeric impossibilities
CONTRADICTION: `quality_scores.final_approval_score` is `null` but `human_gates.final_approval_passed` is `true`. If `final_approval_passed` is `true`, the final-approval-agent must have run and produced a score. The score should be recorded in `final_approval_score`. A null score with a passed gate is internally inconsistent — it is impossible to know the approval passed without a score, and the pipeline requires a minimum of 270/300 to pass. The actual score cannot be verified from this state.
→ Suggested fix: Retrieve the final-approval-agent report and populate `quality_scores.final_approval_score` with the actual score (must be ≥ 270 to be valid). If the report cannot be found, re-run `final-approval-agent` before the next stage to regenerate the score record.

### Check 7 — last_updated vs newest agent_log timestamp
PASS — `last_updated` is `2026-05-03T00:00:00Z`. The newest `agent_log` entry timestamp is `2026-05-03T00:00:00Z`. `last_updated` matches the newest log entry. Consistent.

---

## Summary

| Book | Contradictions |
|------|---------------|
| fix-your-gut-for-good | 1 |
| the-dust-between-seconds | 2 |
| untitled-cosy-mystery | 1 |

**Total: 4 books checked, 4 contradictions found across 3 books.**

**Most serious contradiction:** `untitled-cosy-mystery` — `human_gates.final_approval_passed: true` with `quality_scores.final_approval_score: null`. This book is already live on KDP (ASIN AT25QRT6FPTE6). The 300-point approval score that was the mandatory gate before publishing cannot be verified from the state file — the score record is missing. This is a pipeline integrity failure on an already-published title. The score must be reconstructed from agent output archives or the final-approval-agent must be re-run against the published manuscript to produce a verifiable score record.

**Second most serious:** `the-dust-between-seconds` — `completed_chapters: 1` contradicts the agent_log note stating Chapter 3 is complete, with Chapter 4 about to begin. If writing resumes from this stale state, the writer agent may be briefed with incorrect chapter continuity data.
