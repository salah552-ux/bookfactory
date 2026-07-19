# BookFactory — State Integrity Audit
**Date:** 2026-07-19
**Total contradictions found:** 13 across 5 books

> This audit is read-only. No pipeline-state.json files were modified.
> Previous audit: integrity-2026-07-13.md (12 contradictions across 5 books).
> **Net change this week: +1 contradiction** (new Check 3 finding in h-pylori-recovery-plan; all prior contradictions remain unresolved).
>
> **Note:** exports/final/ directories are gitignored by design (*.epub, *.pdf, *.docx, books/*/exports/ in .gitignore). Check 5 is therefore evaluated against JSON fields only — whether *_path/*_file is null/empty when *_built is true, not whether the file exists on disk in this clone.
>
> **Time-sensitive flag:** `fix-your-gut-for-good` KDP Select term expires today — `publishing.kdp_select_term_end = "2026-07-19"`. The pipeline state does not reflect re-enrolment. Next Countdown Deal window opens approximately 2026-08-18 (per `post_launch.countdown_deal_eligible_next_term`).

---

## death-in-the-cathedral-close
*(formerly slug: untitled-cosy-mystery)*

**Pipeline version:** 2.0 | **Current stage:** 10 | **Last updated:** 2026-05-28 | **KDP status:** live (ASIN B0GZD1S8HF, live 2026-05-03)

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published = true` and `publishing.kdp_status = "live"`. Consistent.

### Check 2 — current_stage consistency
PASS — `current_stage = 10`; `stages["10-postlaunch"].status = "in_progress"`. Stages 01–07 are `"complete"`. Stages 08 and 09 are `"not_started"` — consistent with the prior audit's assessment that digital products and series work are non-blocking parallel tracks for a live title.

### Check 3 — Date chronology
PASS — Stage `completed_at` values ascend (stages 01–05: 2026-04-27, stage 06: 2026-05-02, stage 07: 2026-05-03). `live_date = 2026-05-03` follows all stage completions. `agent_log` is stored newest-first (2026-06-02, 2026-06-01, 2026-05-31, 2026-05-02, 2026-05-03); individual timestamps are chronologically valid. `weekly_log` has a single entry (2026-06-02) — no ordering issue possible. No violations.

### Check 4 — Gap flag vs resolved note
PASS — `post_launch.bookfunnel_gap_flagged = true` with no resolution claim. `post_launch.category_mismatch_flagged = true`; note reads "metadata updated locally… KDP dashboard change requires login — blocked until user confirms live categories." Both consistently marked open. No contradiction.

### Check 5 — production.*_built vs file paths
CONTRADICTION *(unresolved — 2nd consecutive week)*: `production.pdf_built = true` and `production.docx_built = true`, but the production block contains no `pdf_file`, `pdf_path`, `docx_file`, or `docx_path` field — these fields are entirely absent. Only `epub_file` and `cover_file` are recorded.
→ Fields involved: `production.pdf_built = true` with no corresponding path field; `production.docx_built = true` with no corresponding path field
→ Suggested fix: Run `bash build-manuscript.sh death-in-the-cathedral-close` and `bash build-pdf.sh death-in-the-cathedral-close` to regenerate outputs. Add `pdf_file` and `docx_file` fields to the production block. Update via agent-log MODE 2.

### Check 6 — Numeric impossibilities
CONTRADICTION *(unresolved — 6th consecutive week, first detected 2026-06-14)*: `quality_scores.final_approval_score = null` but `human_gates.final_approval_passed = true`. The pipeline requires a minimum 270/300 from `final-approval-agent` before this gate can be set true. With a null score the 270/300 threshold cannot be verified. No `FINAL-APPROVAL.md` exists on disk (confirmed by prior audits).
→ Fields involved: `quality_scores.final_approval_score = null` vs `human_gates.final_approval_passed = true`
→ Suggested fix: Run `final-approval-agent` against the 40-chapter manuscript. Record the 300-point score. If ≥270, gate stands; if <270, gate must be cleared and remediation completed.

### Check 7 — last_updated vs newest agent_log timestamp
CONTRADICTION *(unresolved — 2nd consecutive week)*: `last_updated = 2026-05-28T00:00:00Z` but the newest `agent_log` entry has timestamp `2026-06-02T00:00:00Z`. Two agent_log entries (2026-06-01 and 2026-06-02) were appended without updating `last_updated` — a 5-day gap.
→ Fields involved: `last_updated = 2026-05-28T00:00:00Z` vs `agent_log[0].timestamp = 2026-06-02T00:00:00Z`
→ Suggested fix: Update `last_updated` to `2026-06-02T00:00:00Z`. Update via agent-log MODE 2.

**Contradictions in this book: 3** (unchanged from prior audit)

---

## fix-your-gut-for-good

**Pipeline version:** (not set) | **Current stage:** 10 | **Last updated:** 2026-06-07 | **KDP status:** live (ASIN B0GXYLWS1W, live 2026-04-21)

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published = true` and `publishing.kdp_status = "live"`. Consistent.

### Check 2 — current_stage consistency
CONTRADICTION *(unresolved — 2nd consecutive week)*: `current_stage = 10` (`10-postlaunch` is `"in_progress"`) but `stages["08-products"].status = "in_progress"` and `stages["09-series"].status = "pending"`. Stage 10 is open while stages 08 and 09 are themselves incomplete, with no explanation for the skip.
→ Fields involved: `current_stage = 10` vs `stages["08-products"].status = "in_progress"` and `stages["09-series"].status = "pending"`
→ Suggested fix: Either complete stages 08 and 09, or add a documented rationale for advancing stage 10 in parallel. Update `current_stage` accordingly via agent-log MODE 2.

### Check 3 — Date chronology
PASS — Stage `completed_at` values largely ascend. The prior audit noted 02-planning (2026-04-13) technically precedes 01-research (2026-04-15) and 04-quality (2026-04-17) precedes 03-writing (2026-04-18) — both retrospective backdating artefacts from the book pre-dating the pipeline. `07-publishing.completed_at = null` with `status = "complete"` is a data gap but does not constitute a "completed_at before started_at" violation. `live_date = 2026-04-21` follows all other stage completions. No `weekly_log` entries. No hard violations.

### Check 4 — Gap flag vs resolved note
PASS — `post_launch.bookfunnel_gap_flagged = true` with no contradictory resolution claim. Consistently marked open. No contradiction.

### Check 5 — production.*_built vs file paths
CONTRADICTION *(unresolved — 2nd consecutive week)*: `production.pdf_built = true` but `production.pdf_path = null`; `production.docx_built = true` but `production.docx_path = null`. The build note explicitly acknowledges: "Export files present in exports/final/ — exact paths not verified in this session."
→ Fields involved: `production.pdf_built = true` vs `production.pdf_path = null`; `production.docx_built = true` vs `production.docx_path = null`
→ Suggested fix: Run `bash build-manuscript.sh fix-your-gut-for-good` to confirm/regenerate exports. Populate `pdf_path` and `docx_path`. Update via agent-log MODE 2.

### Check 6 — Numeric impossibilities
PASS — `post_launch.review_count = 0`, `post_launch.avg_rating = null`. Consistent. `publishing.royalty_pct = 70`. Valid KDP tier. US price $2.99 vs `list_price_usd = 9.99` is explained as a promotional/discount price — not a state contradiction. No negative counts.

### Check 7 — last_updated vs newest agent_log timestamp
PASS — `last_updated = 2026-06-07T00:00:00Z` matches the newest `agent_log` entry `2026-06-07T00:00:00Z`. Consistent.

**Contradictions in this book: 2** (unchanged from prior audit)

---

## h-pylori-recovery-plan

**Pipeline version:** 2.0 | **Current stage:** 9 | **Last updated:** 2026-07-06 | **KDP status:** live (ASIN B0H5TZTPRT, live 2026-06-17 — **32 days ago as of today**)

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published = true` and `publishing.kdp_status = "live"`. Consistent.

### Check 2 — current_stage consistency
CONTRADICTION *(unresolved — 2nd consecutive week)*: The book has been live on Amazon for 32 days (`live_date = "2026-06-17"`) yet `current_stage = 9` and `stages["10-postlaunch"].status = "not_started"`. All stages 00–09 are `"complete"`. No post-launch monitoring, BSR tracking, ARC follow-up, or ad-gate check has been initiated. Every `post_launch` counter sits at zero with no logged dates.
→ Fields involved: `publishing.kdp_status = "live"`, `publishing.live_date = "2026-06-17"` vs `current_stage = 9`, `stages["10-postlaunch"].status = "not_started"`
→ Suggested fix: Advance `current_stage` to 10. Set `stages["10-postlaunch"].status = "in_progress"` with `started_at = "2026-06-17"`. Run `post-launch-tracker` with current KDP dashboard readings to log the first BSR/review/KU baseline. Update via agent-log MODE 2.

### Check 3 — Date chronology
CONTRADICTION *(new this audit)*: `stages["05-optimisation"].started_at = "2026-06-11T11:00:00Z"` but `stages["04-quality"].completed_at = "2026-06-11T13:00:00Z"`. Stage 05 (optimisation) was initiated 2 hours before Stage 04 (quality) closed. Stage 05 also completed (`2026-06-11T12:00:00Z`) a full hour before Stage 04 finished. The prior audit (2026-07-13) noted Stage 05's completion preceding Stage 04's as "implausible but likely a timestamp approximation" and classified it PASS. On re-examination, the issue is more severe: Stage 05's *started_at* predates Stage 04's *completed_at*, meaning optimisation was initiated (and finished) while quality checks were still running — the pipeline's sequential gate rule was violated in the recorded state.
→ Fields involved: `stages["05-optimisation"].started_at = "2026-06-11T11:00:00Z"` and `stages["05-optimisation"].completed_at = "2026-06-11T12:00:00Z"` vs `stages["04-quality"].completed_at = "2026-06-11T13:00:00Z"`
→ Suggested fix: Verify with session transcripts whether Stage 04 genuinely completed before Stage 05 began. If the quality agents actually ran before optimisation, correct the Stage 04 `completed_at` to reflect the true chronology. If Stage 05 was genuinely initiated before Stage 04 closed, add a reconciliation note acknowledging the sequence deviation.

### Check 4 — Gap flag vs resolved note
CONTRADICTION *(unresolved — 2nd consecutive week)*: `pre_launch.launch_ready = false` and `pre_launch.open_items` still contains the active item "Recruit ARC cohort to ≥20 commitments", yet `human_gates.published = true`. The pre-launch gate was never formally closed before publication.
→ Fields involved: `pre_launch.launch_ready = false` vs `human_gates.published = true`
→ Suggested fix: Decide whether to retroactively close the pre-launch gate with a reconciliation note, or leave it false with documentation that the book launched outside the formal process. Review open_items for anything still actionable post-launch (ARC recruitment is still relevant for review velocity).

### Check 5 — production.*_built vs file paths
PASS — `epub_built = true` / `epub_file` set; `pdf_built = true` / `pdf_file` set; `docx_built = true` / `docx_file` set. All build flags have corresponding non-null paths. Consistent.

### Check 6 — Numeric impossibilities
CONTRADICTION *(unresolved — 2nd consecutive week — explicitly acknowledged as INV-9 in lifecycle_note)*: `quality_scores.final_approval_score = 113` but `human_gates.final_approval_passed = true`. The minimum threshold for `final-approval-agent` is 270/300. A score of 113 cannot satisfy this gate. The value 113 is the `book-reviewer` score (out of 120), not a 300-point `final-approval-agent` output. `final_approval_passed` was set via Architect override (cover gate only, 2026-06-17) without a complete 300-point audit.
→ Fields involved: `quality_scores.final_approval_score = 113` (book-reviewer /120 scale) vs `human_gates.final_approval_passed = true` (threshold 270/300)
→ Suggested fix: Run `final-approval-agent` against the full manuscript package. Record the 300-point score in a separate field (consider adding `book_reviewer_score` to disambiguate). If score ≥270, final_approval_passed is verified; if <270, remediation required.

### Check 7 — last_updated vs newest agent_log timestamp
PASS — `last_updated = 2026-07-06T00:00:00Z` matches the newest `agent_log` entry `2026-07-06T00:00:00Z`. Consistent.

**Contradictions in this book: 4** (up from 3 — new Check 3 finding)

---

## the-dust-between-seconds

**Pipeline version:** 2.0 | **Current stage:** 3 | **Last updated:** 2026-05-01 | **Lifecycle:** parked

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published = false` and `publishing.kdp_status = "not_started"`. Consistent.

### Check 2 — current_stage consistency
CONTRADICTION *(unresolved — 6th consecutive week, first detected 2026-06-14)*: `writing.completed_chapters = 1` and `writing.approved_chapters = 1`, but `writing.current_chapter = "04-chapter-4"`. The `agent_log` (2026-04-29) explicitly states: "Chapter 3 complete and approved. Resuming from Chapter 4." At minimum 3 chapters should be recorded as complete. The state records only 1. Chapters 1 and 2 are absent from `manuscript/` on disk; only `03-chapter-3.md` exists. This novel cannot be assembled without them.
→ Fields involved: `writing.completed_chapters = 1`, `writing.approved_chapters = 1`, `writing.current_chapter = "04-chapter-4"` vs agent_log evidence of Chapter 3 completion; `manuscript/` missing Chapter 1 and Chapter 2
→ Suggested fix: Search session transcripts for Chapters 1 and 2. If they exist elsewhere, restore to `manuscript/`. If not, they must be re-written. Update `writing.completed_chapters` and `writing.approved_chapters` to the true count.

### Check 3 — Date chronology
PASS — Stage 01 completed 2026-04-28, stage 02 completed 2026-04-29, stage 03 started 2026-04-30. Ascending. No `live_date`, no `created_at`, no `weekly_log`. No violations.

### Check 4 — Gap flag vs resolved note
PASS — No gap flags present.

### Check 5 — production.*_built vs file paths
PASS — All build flags are `false` and `cover_file` / `epub_file` are `null`. Consistent.

### Check 6 — Numeric impossibilities
PASS — `post_launch.review_count = 0`, `post_launch.avg_rating = null`. Consistent. `publishing.royalty_pct = null` — acceptable pre-publishing. No negative counts.

### Check 7 — last_updated vs newest agent_log timestamp
PASS — `last_updated = 2026-05-01T00:00:00Z` is 2 days newer than the only agent_log entry (`2026-04-29T00:00:00Z`). No violation.

**Contradictions in this book: 1** (unchanged from prior audit)

---

## the-7-day-gut-reset

**Pipeline version:** (not set) | **Current stage:** 9 | **Last updated:** 2026-06-13 | **Lifecycle:** parked | **KDP status:** null — not published (planned launch 2026-05-29, now 51 days past without publication)

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published = false` and `publishing.kdp_status = null`. Consistent.

### Check 2 — current_stage consistency
PASS — `current_stage = 9`; `stages["09-series"].status = "complete"`. Stages 00–09 are all `"complete"`. Stage 10 is `"pending"` — appropriate since `published = false`. No sequence violation.

### Check 3 — Date chronology
CONTRADICTION *(unresolved — 2nd consecutive week)*: `agent_log` entry at array index 5 has `timestamp = "2026-05-23T12:00:00Z"` but appears in the array after three entries timestamped 2026-05-24 (09:00, 14:00, 17:00). The 2026-05-23 entry is at least 9 hours out of sequence relative to its neighbours.
→ Fields involved: `agent_log[2].timestamp = "2026-05-24T09:00:00Z"`, `agent_log[3] = "2026-05-24T14:00:00Z"`, `agent_log[4] = "2026-05-24T17:00:00Z"` — all precede `agent_log[5].timestamp = "2026-05-23T12:00:00Z"` in the array
→ Suggested fix: Reorder the `agent_log` array to ascending timestamp order. The 2026-05-23T12:00 entry should appear between the 2026-05-22T18:55 entry and the 2026-05-24T09:00 entry.

### Check 4 — Gap flag vs resolved note
PASS — No gap flags present. The `pre_launch.launch_milestones` "MISSED" annotations are consistent self-notes, not contradictory cross-field resolutions.

### Check 5 — production.*_built vs file paths
CONTRADICTION *(unresolved — 2nd consecutive week)*: `production.cover_built = true` but `production.build_note` contains the text "cover_built=false — blocked on human cover generation per COVER-BRIEF.md (sole remaining blocker)." This note is stale — written during the 2026-05-21 build before the cover was generated — and was not updated when the cover was later built and `cover_built` set to `true`.
→ Fields involved: `production.cover_built = true` vs the string `"cover_built=false"` in `production.build_note`
→ Suggested fix: Update `production.build_note` to remove or annotate the stale "cover_built=false" clause, noting when the cover was subsequently generated.

### Check 6 — Numeric impossibilities
PASS — `post_launch.review_count = 0`. `quality_scores.final_approval_score = 285` (above 270/300 threshold) and `human_gates.final_approval_passed = true`. `book_reviewer_avg = 111.8` (above 96/120 threshold). All consistent.

### Check 7 — last_updated vs newest agent_log timestamp
PASS — `last_updated = 2026-06-13T00:00:00Z`. Newest `agent_log` entry is `2026-05-24T17:00:00Z` (older than `last_updated`). No violation. (The absence of agent_log entries for the 2026-06-13 stage completions is a Rule 4 gap — not a Check 7 contradiction.)

**Contradictions in this book: 2** (unchanged from prior audit)

---

## vagus-nerve-gut-reset-workbook

**Pipeline version:** 2.0 | **Current stage:** 6 | **Last updated:** 2026-06-26T21:30 | **KDP status:** not started (cleared for upload — all Stage 06 gates passed)

### Check 1 — human_gates.published vs kdp_status
PASS — `human_gates.published = false` and `publishing.kdp_status = "not_started"`. Consistent.

### Check 2 — current_stage consistency
PASS — `current_stage = 6`; `stages["06-production"].status = "complete"`. Stages 00–06 complete; stages 07–10 not_started. The `_stage_pointer_note` documents: "current_stage = 6 (06-production COMPLETE — furthest complete stage). Only human upload gates remain." Consistent.

### Check 3 — Date chronology
PASS — Stage `completed_at` values ascend: 00 (2026-06-19), 01 (2026-06-20), 02 (2026-06-26), 03 (2026-06-26T13:30), 04 (2026-06-26T13:55), 05 (2026-06-26T14:20), 06 (2026-06-26T21:30). All ascending. No `live_date`, no `weekly_log`. No violations.

### Check 4 — Gap flag vs resolved note
PASS — No gap flags present.

### Check 5 — production.*_built vs file paths
PASS — `epub_built = true` / `epub_file` set; `pdf_built = true` / `pdf_file` set; `docx_built = true` / `docx_file` set; `cover_built = true` / `cover_file` set. All build flags have corresponding non-null path fields. Consistent.

### Check 6 — Numeric impossibilities
PASS — `post_launch.review_count = 0`, `post_launch.avg_rating = null`. Consistent (not published). `quality_scores.final_approval_score = 291` (above 270/300 threshold) and `human_gates.final_approval_passed = true`. `book_reviewer_avg = 110` (above 96/120 threshold). `publishing.royalty_pct = 70`. `publishing.list_price_gbp = null` / `list_price_usd = 14.99` — GBP price unset is acceptable pre-upload. All consistent.

### Check 7 — last_updated vs newest agent_log timestamp
CONTRADICTION *(unresolved — 2nd consecutive week)*: `last_updated = 2026-06-26T21:30:00Z` but the newest `agent_log` entry has `timestamp = "2026-06-28T18:05:00Z"`. Two build/hygiene entries from 2026-06-28 (17:38 and 18:05) were appended without refreshing `last_updated` — a gap of approximately 44 hours.
→ Fields involved: `last_updated = 2026-06-26T21:30:00Z` vs `agent_log[0].timestamp = "2026-06-28T18:05:00Z"`
→ Suggested fix: Update `last_updated` to `2026-06-28T18:05:00Z`. Update via agent-log MODE 2.

**Contradictions in this book: 1** (unchanged from prior audit)

---

## Administrative Note — cortisol-gut-health

The directory `books/cortisol-gut-health/` continues to exist with only `RUN-LEDGER.md` and **no `pipeline-state.json`** — same as reported in the 2026-07-13 audit. This book remains invisible to any pipeline agent that reads state. If active, a `pipeline-state.json` must be created from `pipeline-state.template.json` before any pipeline work begins.

---

## Summary Table

| Book | Check 1 | Check 2 | Check 3 | Check 4 | Check 5 | Check 6 | Check 7 | Total |
|------|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-----:|
| death-in-the-cathedral-close | PASS | PASS | PASS | PASS | **CONTRADICTION** | **CONTRADICTION** | **CONTRADICTION** | 3 |
| fix-your-gut-for-good | PASS | **CONTRADICTION** | PASS | PASS | **CONTRADICTION** | PASS | PASS | 2 |
| h-pylori-recovery-plan | PASS | **CONTRADICTION** | **CONTRADICTION** | **CONTRADICTION** | PASS | **CONTRADICTION** | PASS | 4 |
| the-dust-between-seconds | PASS | **CONTRADICTION** | PASS | PASS | PASS | PASS | PASS | 1 |
| the-7-day-gut-reset | PASS | PASS | **CONTRADICTION** | PASS | **CONTRADICTION** | PASS | PASS | 2 |
| vagus-nerve-gut-reset-workbook | PASS | PASS | PASS | PASS | PASS | PASS | **CONTRADICTION** | 1 |

**Total contradictions across all books: 13**

---

## Unresolved Contradiction Ageing

| Book | Contradiction | First detected | Weeks open |
|------|--------------|----------------|:----------:|
| death-in-the-cathedral-close | final_approval_score=null / final_approval_passed=true / no FINAL-APPROVAL.md | 2026-06-14 | 6 |
| the-dust-between-seconds | completed_chapters=1 vs current_chapter=04-chapter-4 / chapters 1–2 missing from disk | 2026-06-14 | 6 |
| death-in-the-cathedral-close | pdf_built=true + docx_built=true but no pdf_file/docx_file path fields | 2026-07-13 | 1 |
| death-in-the-cathedral-close | last_updated=2026-05-28 < newest agent_log=2026-06-02 | 2026-07-13 | 1 |
| fix-your-gut-for-good | current_stage=10 but stages 08 (in_progress) and 09 (pending) incomplete | 2026-07-13 | 1 |
| fix-your-gut-for-good | pdf_built=true/pdf_path=null; docx_built=true/docx_path=null | 2026-07-13 | 1 |
| h-pylori-recovery-plan | book live since 2026-06-17 but current_stage=9 / stage 10 not_started | 2026-07-13 | 1 |
| h-pylori-recovery-plan | pre_launch.launch_ready=false but human_gates.published=true | 2026-07-13 | 1 |
| h-pylori-recovery-plan | final_approval_passed=true but final_approval_score=113 (book-reviewer /120, not 300-pt audit) | 2026-07-13 | 1 |
| h-pylori-recovery-plan | stage 05 started_at (11:00) and completed_at (12:00) both predate stage 04 completed_at (13:00) | 2026-07-19 | **NEW** |
| the-7-day-gut-reset | agent_log entry 2026-05-23T12:00 appears after three 2026-05-24 entries | 2026-07-13 | 1 |
| the-7-day-gut-reset | production.build_note says "cover_built=false" but production.cover_built=true | 2026-07-13 | 1 |
| vagus-nerve-gut-reset-workbook | last_updated=2026-06-26T21:30 < newest agent_log=2026-06-28T18:05 | 2026-07-13 | 1 |

---

## Most Serious Contradiction

**Book:** h-pylori-recovery-plan
**Check 2 — Live title with stage 10 never started (32 days post-publish, compounded by 4 total contradictions)**

`publishing.kdp_status = "live"`, `publishing.live_date = "2026-06-17"` — the book has been on sale for 32 days — yet `current_stage = 9`, `stages["10-postlaunch"].status = "not_started"`, and every `post_launch` counter sits at zero with no logged dates. No BSR baseline, no review velocity tracking, no ARC follow-up, no A+ content trigger, no ads-gate check has been recorded in the pipeline state. This is the highest-severity operational gap in the portfolio.

This week a **new Check 3 contradiction** was found in the same book: Stage 05 (optimisation) `started_at = 2026-06-11T11:00:00Z` and `completed_at = 2026-06-11T12:00:00Z`, but Stage 04 (quality) `completed_at = 2026-06-11T13:00:00Z`. The optimisation stage started and completed while the quality stage was still running — the sequential gate rule was violated in the recorded state. Combined with the prior week's INV-9 (final_approval_score=113, not a 300-point audit) and the unresolved launch_ready=false, h-pylori carries 4 contradictions — more than any other book in the portfolio.

**Recommended immediate actions:**
1. Advance `current_stage` to 10; set `stages["10-postlaunch"].status = "in_progress"` with `started_at = "2026-06-17"`.
2. Run `post-launch-tracker` with current KDP dashboard readings (BSR, review count, KU pages) to populate the first data point.
3. Investigate the stage 04/05 timestamp overlap — verify from session transcripts whether quality genuinely cleared before optimisation ran; correct `stages["04-quality"].completed_at` if the recorded 13:00 is wrong.
4. Run `final-approval-agent` against the full manuscript to produce a verified 300-point score and record it in `quality_scores.final_approval_score`.
5. All updates via agent-log MODE 2.

---

*Audit run: 2026-07-19 | Audit type: automated weekly state integrity | Files checked: 6 pipeline-state.json + 1 missing (cortisol-gut-health) | Files modified: 0*
