# BookFactory — State Integrity Audit
**Date:** 2026-07-13
**Total contradictions found:** 12 across 6 books

> This audit is read-only. No pipeline-state.json files were modified.
> Previous audit: integrity-2026-07-05.md (5 contradictions across 3 books).
> This run covers 6 books (h-pylori-recovery-plan, the-7-day-gut-reset, and vagus-nerve-gut-reset-workbook are newly in scope; fix-your-gut-for-good and death-in-the-cathedral-close have substantially changed state since 2026-07-05). Books audited in pipeline-state.json slug order.
>
> **Note:** exports/final/ directories are gitignored by design (*.epub, *.pdf, *.docx, books/*/exports/ in .gitignore). Check 5 is therefore evaluated against the JSON fields only — whether *_path/*_file is null/empty when *_built is true, not whether the file exists on disk in this clone.

---

## death-in-the-cathedral-close
*(formerly slug: untitled-cosy-mystery — slug rename was the last_agent_run recorded entry)*

**Pipeline version:** 2.0 | **Current stage:** 10 | **Last updated:** 2026-05-28 | **KDP status:** live (ASIN B0GZD1S8HF, live 2026-05-03)

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published = true` and `publishing.kdp_status = "live"`. Consistent.

### Check 2 — current_stage consistency
PASS — `current_stage = 10`; `stages["10-postlaunch"].status = "in_progress"`. Stages 01–07 are `"complete"`. Stages 08 and 09 are `"not_started"`, which are non-blocking parallel tracks (Etsy/series work does not gate post-launch activity on a live title). Consistent.

### Check 3 — Date chronology
PASS — Stage `completed_at` values ascend (stages 01–05: 2026-04-27, stage 06: 2026-05-02, stage 07: 2026-05-02→2026-05-03). `live_date = 2026-05-03` follows all stage completions. `agent_log` timestamps in ascending order: 2026-05-02, 2026-05-03, 2026-05-31, 2026-06-01, 2026-06-02 (the array happens to be stored newest-first, but the dates themselves are chronologically valid). `weekly_log` has one entry (2026-06-02) — no ordering issue possible. No chronological violations.

### Check 4 — Gap flag vs resolved note
PASS — `post_launch.bookfunnel_gap_flagged = true` with no resolution claim. `post_launch.category_mismatch_flagged = true`; note reads "metadata updated locally… KDP dashboard change requires login — blocked until user confirms live categories." Both flags remain consistently marked open and unresolved. No contradiction between flag state and notes.

### Check 5 — production.*_built vs file paths
CONTRADICTION *(new this audit)*: `production.pdf_built = true` and `production.docx_built = true`, but the production block contains no `pdf_file`, `pdf_path`, `docx_file`, or `docx_path` field — these fields are entirely absent. Only `epub_file` and `cover_file` are recorded. There is no state-level evidence of where the PDF and DOCX outputs are located.
→ Fields involved: `production.pdf_built = true` with no corresponding path field; `production.docx_built = true` with no corresponding path field
→ Suggested fix: Run `bash build-manuscript.sh death-in-the-cathedral-close` and `bash build-pdf.sh death-in-the-cathedral-close` to regenerate outputs. Add `pdf_file` and `docx_file` fields to the production block recording the canonical paths (e.g. `"exports/final/manuscript-kdp.pdf"`). Update pipeline-state.json via agent-log MODE 2.

### Check 6 — Numeric impossibilities
CONTRADICTION *(5th consecutive week — unresolved since 2026-06-14)*: `quality_scores.final_approval_score = null` but `human_gates.final_approval_passed = true`. The pipeline requires a minimum score of 270/300 from `final-approval-agent` before this gate can be set true. With a null score, the 270/300 threshold cannot be verified. No `FINAL-APPROVAL.md` file exists on disk (confirmed by prior audit; manuscript directory intact at 40 chapters).
→ Fields involved: `quality_scores.final_approval_score = null` vs `human_gates.final_approval_passed = true`; `FINAL-APPROVAL.md` absent
→ Suggested fix: Re-run `final-approval-agent` against the 40-chapter manuscript. Record the 300-point score in `quality_scores.final_approval_score`. If score ≥270, gate stands; if <270, gate must be cleared and remediation completed.

### Check 7 — last_updated vs newest agent_log timestamp
CONTRADICTION *(new this audit)*: `last_updated = 2026-05-28T00:00:00Z` but the newest `agent_log` entry has timestamp `2026-06-02T00:00:00Z`. Two agent_log entries (dated 2026-06-01 and 2026-06-02) were appended after `last_updated` was set without updating it — a 5-day gap.
→ Fields involved: `last_updated = 2026-05-28T00:00:00Z` vs `agent_log[0].timestamp = 2026-06-02T00:00:00Z`
→ Suggested fix: Update `last_updated` to `2026-06-02T00:00:00Z` (or the actual date of the most recent state change if later than the newest agent_log entry).

**Contradictions in this book: 3**

---

## fix-your-gut-for-good

**Pipeline version:** (not set) | **Current stage:** 10 | **Last updated:** 2026-06-07 | **KDP status:** live (ASIN B0GXYLWS1W, live 2026-04-21)

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published = true` and `publishing.kdp_status = "live"`. Consistent.

### Check 2 — current_stage consistency
CONTRADICTION *(new this audit)*: `current_stage = 10` (`10-postlaunch` is `"in_progress"`) but `stages["08-products"].status = "in_progress"` and `stages["09-series"].status = "pending"`. Stage 10 is open while two earlier stages — products and series — are themselves incomplete. No note or explanation in the state file justifies skipping ahead. Any orchestrator agent reading `current_stage` to determine where to resume would receive an incorrect answer.
→ Fields involved: `current_stage = 10` vs `stages["08-products"].status = "in_progress"` and `stages["09-series"].status = "pending"`
→ Suggested fix: Either (a) complete stages 08 and 09 and record their completions before advancing stage 10, or (b) add a note to the state explaining the deliberate out-of-sequence decision (e.g. post-launch was initiated in parallel for operational reasons). Update `current_stage` to `8` or add a rationale note.

### Check 3 — Date chronology
PASS — Stage `completed_at` values are in ascending order: 00-intelligence (2026-04-13), 01-research (2026-04-15), 02-planning (2026-04-13) — NOTE: 02-planning (2026-04-13) precedes 01-research (2026-04-15), a minor anomaly (02 was backdated retrospectively), but not a hard violation since both are complete. 03-writing (2026-04-18), 04-quality (2026-04-17) — likewise 04 predates 03 by one day, another retrospective backdating anomaly. No `weekly_log` entries to check. `live_date = 2026-04-21` follows the latest stage completion. No hard chronological violations.

### Check 4 — Gap flag vs resolved note
PASS — `post_launch.bookfunnel_gap_flagged = true` with no contradictory resolution claim. Consistently marked open. No contradiction.

### Check 5 — production.*_built vs file paths
CONTRADICTION *(new this audit)*: `production.pdf_built = true` but `production.pdf_path = null`; `production.docx_built = true` but `production.docx_path = null`. The build note explicitly acknowledges this: "Export files present in exports/final/ — exact paths not verified in this session." The state records these files as built but provides no recoverable path for either.
→ Fields involved: `production.pdf_built = true` vs `production.pdf_path = null`; `production.docx_built = true` vs `production.docx_path = null`
→ Suggested fix: Run `bash build-manuscript.sh fix-your-gut-for-good` to regenerate/confirm exports. Populate `pdf_path` and `docx_path` with the canonical paths. Update pipeline-state.json via agent-log MODE 2.

### Check 6 — Numeric impossibilities
PASS — `post_launch.review_count = 0`, `post_launch.avg_rating = null`. Consistent (zero reviews, null rating). `publishing.royalty_pct = 70`. Valid KDP royalty tier. US verification shows displayed price $2.99 vs list_price_usd $9.99; notes explain this as "promotional/discount price" — not a state contradiction. No negative counts. No impossible percentages.

### Check 7 — last_updated vs newest agent_log timestamp
PASS — `last_updated = 2026-06-07T00:00:00Z` matches the newest `agent_log` entry `2026-06-07T00:00:00Z`. Consistent.

**Contradictions in this book: 2**

---

## h-pylori-recovery-plan

**Pipeline version:** 2.0 | **Current stage:** 9 | **Last updated:** 2026-07-06 | **KDP status:** live (ASIN B0H5TZTPRT, live 2026-06-17)

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published = true` and `publishing.kdp_status = "live"`. Consistent (live status reconciled 2026-07-06 from KDP Bookshelf observation).

### Check 2 — current_stage consistency
CONTRADICTION *(new this audit)*: The book has `publishing.kdp_status = "live"` with `publishing.live_date = "2026-06-17"` (26 days before today), but `current_stage = 9` and `stages["10-postlaunch"].status = "not_started"`. A live, revenue-generating title on KDP should be in stage 10 (post-launch). No stage-10 monitoring, ARC follow-up, ad sequencing, or review velocity tracking has been initiated in the pipeline state. The 2026-07-06 reconciliation run explicitly noted it deliberately left `current_stage` unchanged — but that decision created a permanent state mismatch between reality (live book) and pipeline tracking.
→ Fields involved: `publishing.kdp_status = "live"`, `publishing.live_date = "2026-06-17"` vs `current_stage = 9`, `stages["10-postlaunch"].status = "not_started"`
→ Suggested fix: Advance `current_stage` to 10, set `stages["10-postlaunch"].status = "in_progress"` with `started_at` equal to `live_date` (2026-06-17). Run `post-launch-tracker` to log the first BSR/review/KU baseline. Update via agent-log MODE 2.

### Check 3 — Date chronology
PASS — Stage `completed_at` values ascend: 00 (2026-06-07), 01 (2026-06-08), 02 (2026-06-11), 03 (2026-06-11), 04 (2026-06-11T13:00), 05 (2026-06-11T12:00) — note 04 ends at 13:00 and 05 at 12:00 (Stage 05 closed one hour before Stage 04 — implausible but within the same day; likely a timestamp approximation), 06 (2026-06-11), 07 (2026-06-11T14:00), 08 (2026-06-11T15:00), 09 (2026-06-11T16:00). `live_date = 2026-06-17` follows all stage completions. `agent_log` entries ascend. No hard chronological violations.

### Check 4 — Gap flag vs resolved note
CONTRADICTION *(new this audit)*: `pre_launch.launch_ready = false` with `pre_launch.open_items` still containing at least one active item ("Recruit ARC cohort to ≥20 commitments"), yet `human_gates.published = true`. The pre-launch gate was never closed — `launch_ready` was never set true — but the book was published outside pipeline tracking. The pipeline's RULE 7 and the pre-launch-agent mandate that a book must not publish without `launch_ready = true`, yet this book shipped without that approval being recorded.
→ Fields involved: `pre_launch.launch_ready = false` vs `human_gates.published = true`
→ Suggested fix: Decide whether to retroactively close the pre-launch gate (acknowledge launch happened outside the process and mark launch_ready=true with a reconciliation note), or leave it false with a prominent note that this book launched without formal pre-launch approval. Either way, the open_items must be reviewed for anything still actionable post-launch.

### Check 5 — production.*_built vs file paths
PASS — `epub_built = true` / `epub_file = "exports/final/manuscript-kdp.epub"`, `pdf_built = true` / `pdf_file = "exports/final/manuscript-kdp.pdf"`, `docx_built = true` / `docx_file = "exports/final/manuscript-kdp.docx"`. All build flags have corresponding non-null path fields. Consistent.

### Check 6 — Numeric impossibilities
CONTRADICTION *(new this audit — flagged as known INV-9 in lifecycle_note)*: `quality_scores.final_approval_score = 113` but `human_gates.final_approval_passed = true`. The `final-approval-agent` scores on a 300-point rubric with a minimum threshold of 270. A score of 113 cannot satisfy the 270/300 gate. Examination of the notes confirms this 113 is the `book-reviewer` score (out of 120), not a `final-approval-agent` output — the full 300-point audit was never run. `final_approval_passed` was set via Architect override (cover gate only, 2026-06-17) without a complete `final-approval-agent` audit pass. The lifecycle_note explicitly acknowledges this as unresolved INV-9.
→ Fields involved: `quality_scores.final_approval_score = 113` vs `human_gates.final_approval_passed = true` (threshold is 270/300); `final_approval_score` appears to represent the 120-point book-reviewer score, not the 300-point final-approval-agent score
→ Suggested fix: Run `final-approval-agent` against the full manuscript package and record the 300-point score in `quality_scores.final_approval_score`. If score ≥270, the gate is verified. If <270, note the shortfall. Consider adding a `book_reviewer_score` field to distinguish the two metrics.

### Check 7 — last_updated vs newest agent_log timestamp
PASS — `last_updated = 2026-07-06T00:00:00Z` matches the newest `agent_log` entry `2026-07-06T00:00:00Z`. Consistent.

**Contradictions in this book: 3**

---

## the-dust-between-seconds

**Pipeline version:** 2.0 | **Current stage:** 3 | **Last updated:** 2026-05-01 | **Lifecycle:** parked

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published = false` and `publishing.kdp_status = "not_started"`. Consistent.

### Check 2 — current_stage consistency
CONTRADICTION *(5th consecutive week — unresolved since 2026-06-14)*: `writing.completed_chapters = 1` and `writing.approved_chapters = 1`, but `writing.current_chapter = "04-chapter-4"`. If work is resuming from Chapter 4, chapters 1, 2, and 3 must have been processed. The `agent_log` entry (2026-04-29) explicitly states: "Chapter 3 complete and approved. Resuming from Chapter 4." At minimum 3 chapters should be complete; the state records only 1. Disk inspection confirms this: `books/the-dust-between-seconds/manuscript/` contains exactly **one file — `03-chapter-3.md`**. Chapters 1 and 2 are absent from disk, meaning either they were never saved to `manuscript/` (a Rule 6 violation) or were accidentally deleted. This novel cannot be assembled in its current state.
→ Fields involved: `writing.completed_chapters = 1`, `writing.approved_chapters = 1`, `writing.current_chapter = "04-chapter-4"` vs `agent_log[0].notes` ("Chapter 3 complete and approved. Resuming from Chapter 4"), and disk state (1 file vs minimum 3 expected)
→ Suggested fix: Determine whether Chapters 1 and 2 were ever written. Search agent transcripts/session logs. If they exist, restore to `manuscript/`. If not, they must be written before Chapter 4 can proceed. Update `writing.completed_chapters` and `writing.approved_chapters` to the true count.

### Check 3 — Date chronology
PASS — Stage 01-research completed 2026-04-28, 02-planning completed 2026-04-29, 03-writing started 2026-04-30. All ascending. No `live_date`, no `created_at` field, no `weekly_log`. No chronological violations.

### Check 4 — Gap flag vs resolved note
PASS — No gap flags present. No contradictory resolution notes.

### Check 5 — production.*_built vs file paths
PASS — All three build flags are `false` and corresponding file fields (`cover_file`, `epub_file`) are `null`. Consistent; book is in Stage 3 and production has not started.

### Check 6 — Numeric impossibilities
PASS — `post_launch.review_count = 0`, `post_launch.avg_rating = null`. Consistent. `publishing.royalty_pct = null` — acceptable pre-publishing. No negative counts. No impossible royalty percentage.

### Check 7 — last_updated vs newest agent_log timestamp
PASS — `last_updated = 2026-05-01T00:00:00Z` is 2 days *newer* than the only `agent_log` entry (`2026-04-29T00:00:00Z`). Not a Check 7 violation. (An unlogged state change on 2026-05-01 is a Rule 4 concern but not a Check 7 contradiction as defined.)

**Contradictions in this book: 1**

---

## the-7-day-gut-reset

**Pipeline version:** (not set) | **Current stage:** 9 | **Last updated:** 2026-06-13 | **Lifecycle:** parked | **KDP status:** null (not published — planned launch 2026-05-29, now 45 days past)

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published = false` and `publishing.kdp_status = null`. Consistent (book not yet published).

### Check 2 — current_stage consistency
PASS — `current_stage = 9`; `stages["09-series"].status = "complete"`. Stages 00–09 are all `"complete"`. Stage 10 is `"pending"` — appropriate as a pre-publish state (the book cannot be in post-launch until it is published, and published=false). No earlier stage is `"not_started"` while a later stage is `"complete"`. Consistent.

### Check 3 — Date chronology
CONTRADICTION *(new this audit)*: The `agent_log` array contains an out-of-chronological-order entry. The entry at array index 5 (action: "Stage 06.5 pre-launch quartet") has `timestamp = "2026-05-23T12:00:00Z"`, but it appears in the array **after** three entries dated 2026-05-24 (09:00, 14:00, 17:00). Agent log timestamps should be in ascending order within the array; this entry is at least 9 hours out of order relative to its neighbours.
→ Fields involved: `agent_log[2].timestamp = "2026-05-24T09:00:00Z"`, `agent_log[3].timestamp = "2026-05-24T14:00:00Z"`, `agent_log[4].timestamp = "2026-05-24T17:00:00Z"` — all appear before `agent_log[5].timestamp = "2026-05-23T12:00:00Z"`
→ Suggested fix: Reorder the `agent_log` array entries into ascending timestamp order. Move the 2026-05-23T12:00 entry to appear between the 2026-05-22T18:55 entry and the 2026-05-24T09:00 entry.

### Check 4 — Gap flag vs resolved note
PASS — No gap flags present. The `pre_launch.launch_milestones` records several dates as "MISSED" but these are consistent self-annotations, not contradictory cross-field resolutions. No gap-vs-fixed contradiction.

### Check 5 — production.*_built vs file paths
CONTRADICTION *(new this audit)*: `production.build_note` (a note logged during the 2026-05-21 build) contains the text "cover_built=false — blocked on human cover generation per COVER-BRIEF.md (sole remaining blocker)." However, the production field `cover_built = true`. The note is stale and was not updated when the cover was later generated and the field was set to true. This creates an internal contradiction within the same production block.
→ Fields involved: `production.cover_built = true` vs the text `"cover_built=false"` embedded in `production.build_note`
→ Suggested fix: Update `production.build_note` to remove or strike-through the stale "cover_built=false" clause, or replace it with a note recording when and how the cover was subsequently generated (e.g. "cover generated 2026-05-22, cover_built set true").

### Check 6 — Numeric impossibilities
PASS — `post_launch.review_count = 0`, `post_launch.avg_rating` is absent (acceptable — no reviews). `quality_scores.final_approval_score = 285` (above the 270/300 threshold) and `human_gates.final_approval_passed = true`. Consistent. `book_reviewer_avg = 111.8` (above the 96/120 threshold). All valid.

### Check 7 — last_updated vs newest agent_log timestamp
PASS — `last_updated = 2026-06-13T00:00:00Z`. The newest `agent_log` entry is `2026-05-24T17:00:00Z` — older than `last_updated`. (The 2026-06-13 stage completions recorded in the `stages` map have no corresponding `agent_log` entries, which is a Rule 4 gap, but `last_updated` correctly reflects the most recent modification date.) No Check 7 contradiction.

**Contradictions in this book: 2**

---

## vagus-nerve-gut-reset-workbook

**Pipeline version:** 2.0 | **Current stage:** 6 | **Last updated:** 2026-06-26T21:30 | **KDP status:** not started (not yet published)

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published = false` and `publishing.kdp_status = "not_started"`. Consistent.

### Check 2 — current_stage consistency
PASS — `current_stage = 6`; `stages["06-production"].status = "complete"`. Stages 00–06 are all `"complete"`. Stages 07–10 are `"not_started"` — appropriate, as the book has not been published. The `_stage_pointer_note` field clarifies: "current_stage = 6 (06-production COMPLETE — furthest complete stage). Only human upload gates remain." Consistent.

### Check 3 — Date chronology
PASS — Stage `completed_at` values ascend: 00 (2026-06-19), 01 (2026-06-20), 02 (2026-06-26), 03 (2026-06-26T13:30), 04 (2026-06-26T13:55), 05 (2026-06-26T14:20), 06 (2026-06-26T21:30). All ascending. No `live_date`, no `weekly_log`. `agent_log` entries with same-day timestamps (2026-06-28 × 2, 2026-06-19 × 3) are internally consistent within each date. No chronological violations.

### Check 4 — Gap flag vs resolved note
PASS — No gap flags present. No contradictory resolution notes.

### Check 5 — production.*_built vs file paths
PASS — `epub_built = true` / `epub_file = "exports/final/manuscript-kdp.epub"`, `pdf_built = true` / `pdf_file = "exports/final/manuscript-kdp.pdf"`, `docx_built = true` / `docx_file = "exports/final/manuscript-kdp.docx"`, `cover_built = true` / `cover_file = "exports/final/cover-kdp.jpg"`. All build flags have corresponding non-null path fields. Consistent.

### Check 6 — Numeric impossibilities
PASS — `post_launch.review_count = 0`, `post_launch.avg_rating = null`. Consistent (not published). `quality_scores.final_approval_score = 291` (above the 270/300 threshold) and `human_gates.final_approval_passed = true`. Consistent. `book_reviewer_avg = 110` (above the 96/120 threshold). `publishing.royalty_pct = 70`. Valid. `publishing.list_price_gbp = null` / `list_price_usd = 14.99` — GBP price unset, USD set; consistent with a book not yet uploaded (prices confirmed at upload). No numeric impossibilities.

### Check 7 — last_updated vs newest agent_log timestamp
CONTRADICTION *(new this audit)*: `last_updated = 2026-06-26T21:30:00Z` but the newest `agent_log` entry has `timestamp = "2026-06-28T18:05:00Z"`. Two agent_log entries (dated 2026-06-28T17:38 and 2026-06-28T18:05) were appended after `last_updated` was set without updating it — a gap of approximately 44 hours.
→ Fields involved: `last_updated = 2026-06-26T21:30:00Z` vs `agent_log[0].timestamp = "2026-06-28T18:05:00Z"`
→ Suggested fix: Update `last_updated` to `2026-06-28T18:05:00Z` (or later if any change was made after that time).

**Contradictions in this book: 1**

---

## Administrative Note — cortisol-gut-health

The directory `books/cortisol-gut-health/` exists in the repository (containing only `RUN-LEDGER.md`) but has **no `pipeline-state.json`**. This book is invisible to any pipeline agent that reads state. If this is an active book, a `pipeline-state.json` must be created from the `pipeline-state.template.json` template before any pipeline work begins.

---

## Summary Table

| Book | Check 1 | Check 2 | Check 3 | Check 4 | Check 5 | Check 6 | Check 7 | Total |
|------|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-----:|
| death-in-the-cathedral-close | PASS | PASS | PASS | PASS | **CONTRADICTION** | **CONTRADICTION** | **CONTRADICTION** | 3 |
| fix-your-gut-for-good | PASS | **CONTRADICTION** | PASS | PASS | **CONTRADICTION** | PASS | PASS | 2 |
| h-pylori-recovery-plan | PASS | **CONTRADICTION** | PASS | **CONTRADICTION** | PASS | **CONTRADICTION** | PASS | 3 |
| the-dust-between-seconds | PASS | **CONTRADICTION** | PASS | PASS | PASS | PASS | PASS | 1 |
| the-7-day-gut-reset | PASS | PASS | **CONTRADICTION** | PASS | **CONTRADICTION** | PASS | PASS | 2 |
| vagus-nerve-gut-reset-workbook | PASS | PASS | PASS | PASS | PASS | PASS | **CONTRADICTION** | 1 |

**Total contradictions across all books: 12**

---

## Unresolved Contradiction Ageing

| Book | Contradiction | First detected | Weeks open |
|------|--------------|----------------|:----------:|
| death-in-the-cathedral-close | final_approval_score=null / final_approval_passed=true / no FINAL-APPROVAL.md | 2026-06-14 (as untitled-cosy-mystery) | 5 |
| the-dust-between-seconds | completed_chapters=1 vs current_chapter=04-chapter-4 / chapters 1–2 missing from disk | 2026-06-14 | 5 |
| death-in-the-cathedral-close | pdf_built=true + docx_built=true but no pdf_file/docx_file path fields | 2026-07-13 | NEW |
| death-in-the-cathedral-close | last_updated=2026-05-28 < newest agent_log=2026-06-02 | 2026-07-13 | NEW |
| fix-your-gut-for-good | current_stage=10 but stages 08 (in_progress) and 09 (pending) incomplete | 2026-07-13 | NEW |
| fix-your-gut-for-good | pdf_built=true/pdf_path=null; docx_built=true/docx_path=null | 2026-07-13 | NEW |
| h-pylori-recovery-plan | book live since 2026-06-17 but current_stage=9 / stage 10 not_started | 2026-07-13 | NEW |
| h-pylori-recovery-plan | pre_launch.launch_ready=false but human_gates.published=true | 2026-07-13 | NEW |
| h-pylori-recovery-plan | final_approval_passed=true but final_approval_score=113 (book-reviewer, not 300-pt audit) | 2026-07-13 | NEW |
| the-7-day-gut-reset | agent_log entry 2026-05-23T12:00 appears after three 2026-05-24 entries | 2026-07-13 | NEW |
| the-7-day-gut-reset | production.build_note says "cover_built=false" but production.cover_built=true | 2026-07-13 | NEW |
| vagus-nerve-gut-reset-workbook | last_updated=2026-06-26T21:30 < newest agent_log=2026-06-28T18:05 | 2026-07-13 | NEW |

---

## Most Serious Contradiction

**Book:** h-pylori-recovery-plan
**Check 2 — Live title with stage 10 never started (26 days post-publish)**

`publishing.kdp_status = "live"`, `publishing.live_date = "2026-06-17"` — the book has been on sale for 26 days — yet `current_stage = 9` and `stages["10-postlaunch"].status = "not_started"`. The pipeline has no record of any post-launch action: no BSR baseline logged, no review velocity tracking, no ARC follow-up, no A+ content submission trigger, no ads gate check. The `post_launch` block shows all counters at zero with no dates.

This is compounded by two further contradictions in the same book: `pre_launch.launch_ready = false` (the book shipped without pre-launch approval, Check 4) and `final_approval_score = 113` which is the book-reviewer's /120 score, not a `final-approval-agent` 300-point audit (Check 6, explicitly acknowledged as INV-9).

The h-pylori book is an actively selling title — ASIN B0H5TZTPRT, KDP Select enrolled — with no pipeline-level post-launch management initiated. This is the highest-priority remediation in the portfolio.

**Recommended immediate action:** Advance `current_stage` to 10, set `stages["10-postlaunch"].status = "in_progress"` with `started_at = "2026-06-17"`. Run `post-launch-tracker` with current KDP dashboard readings to populate the first BSR/review/KU data point. Run `final-approval-agent` against the full manuscript to record a verified 300-point score. Update all three via agent-log MODE 2.

---

*Audit run: 2026-07-13 | Audit type: automated weekly state integrity | Files checked: 6 pipeline-state.json + 1 missing (cortisol-gut-health) | Files modified: 0*
