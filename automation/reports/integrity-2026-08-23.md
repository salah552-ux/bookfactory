# BookFactory State Integrity Audit — 2026-08-23

**19 contradictions found across 5 books.**

Audit scope: 6 books × 7 checks. Run date: 2026-08-23 (automated Job 5).
Read-only pass — no pipeline-state.json files modified.
Compared against prior audit: integrity-2026-08-16.md (19 contradictions).
**Net change: 0 new contradictions; 0 resolved. All 19 from last week persist.**

---

## BOOK 1 — death-in-the-cathedral-close

### CHECK 7 — CONTRADICTION *(persists; week 5)*
**last_updated older than newest agent_log timestamp**

- `last_updated`: `"2026-05-28T00:00:00Z"`
- Newest `agent_log` entry timestamp: `"2026-06-02T00:00:00Z"` (Deal Day 1 BSR audit + category mismatch flagged)

**Suggested fix:** Set `last_updated` to `"2026-06-02T00:00:00Z"`.

---

### CHECK 2 — CONTRADICTION *(persists; week 5)*
**current_stage=10 but stages 08 and 09 are not_started with no skip explanation**

- `current_stage`: `10`
- `stages["08-products"]`: `not_started`
- `stages["09-series"]`: `not_started`
- `stages["10-postlaunch"]`: `in_progress`

**Suggested fix:** Set stages 08 and 09 to `"skipped"` with a `skip_reason` (e.g. "fiction standalone; no digital products or series stage required"), or begin the work.

---

### CHECK 5 — CONTRADICTION *(persists; week 5)*
**production.pdf_built and production.docx_built are true but no path fields exist**

- `production.epub_built`: `true` — `epub_file`: `"exports/final/manuscript-kdp.epub"` ✓
- `production.pdf_built`: `true` — `pdf_file`: **field entirely absent**
- `production.docx_built`: `true` — `docx_file`: **field entirely absent**

**Suggested fix:** Add `"pdf_file": "exports/final/manuscript-kdp.pdf"` and `"docx_file": "exports/final/manuscript-kdp.docx"`, or set to `null` if unconfirmed.

---

## BOOK 2 — fix-your-gut-for-good

### CHECK 5 — CONTRADICTION *(persists; week 5)*
**production.pdf_built and production.docx_built are true but paths are null**

- `production.pdf_built`: `true` — `pdf_path`: `null`
- `production.docx_built`: `true` — `docx_path`: `null`
- `production.epub_built`: `true` — `epub_path`: `"books/fix-your-gut-for-good/exports/final/manuscript-kdp.epub"` ✓

The `build_note` acknowledges: *"Export files present in exports/final/ — exact paths not verified in this session."* For a live book, unverified production paths are a recovery risk.

**Suggested fix:** Verify exports/final/ on disk and populate `pdf_path` and `docx_path`.

---

### CHECK 3 — CONTRADICTION *(persists; week 5)*
**stages["07-publishing"].status = "complete" but completed_at = null**

- `stages["07-publishing"].status`: `"complete"`
- `stages["07-publishing"].completed_at`: `null`

**Suggested fix:** Set `completed_at` to `"2026-04-21T00:00:00Z"` (the live_date, logical close of stage 07).

---

### CHECK 2 — CONTRADICTION *(persists; week 2)*
**current_stage=10 but stages["09-series"].status = "pending"**

- `current_stage`: `10`
- `stages["09-series"].status`: `"pending"`
- `stages["10-postlaunch"].status`: `"in_progress"`

**Suggested fix:** Advance stage 09 to `"complete"` (with a note if work was informal), or mark `"skipped"` with a reason. If series work is genuinely outstanding, mark stage 10 as blocked until stage 09 resolves.

---

### CHECK 3 — CONTRADICTION *(persists; week 2)*
**stages["02-planning"].completed_at (2026-04-13) predates stages["01-research"].completed_at (2026-04-15)**

- `stages["01-research"].completed_at`: `"2026-04-15T00:00:00Z"`
- `stages["02-planning"].completed_at`: `"2026-04-13T00:00:00Z"`

Planning recorded as complete two days before research. Both carry "present on disk" retrospective notes — timestamps are likely back-filled estimates.

**Suggested fix:** Correct `stages["02-planning"].completed_at` to on or after `"2026-04-15"`, or add a retrospective note explaining the back-fill.

---

### CHECK 3 — CONTRADICTION *(persists; week 2)*
**stages["04-quality"].completed_at (2026-04-17) predates stages["03-writing"].completed_at (2026-04-18)**

- `stages["03-writing"].completed_at`: `"2026-04-18T00:00:00Z"`
- `stages["04-quality"].completed_at`: `"2026-04-17T00:00:00Z"`

Quality recorded as complete one day before writing. Same retrospective context as above.

**Suggested fix:** Correct `stages["04-quality"].completed_at` to on or after `"2026-04-18"`.

---

## BOOK 3 — h-pylori-recovery-plan

### CHECK 2 — CONTRADICTION *(MOST SERIOUS — persists; week 6)*
**Book is live (published=true, kdp_status=live) but current_stage=9 and stage 10 is not_started**

- `human_gates.published`: `true` (reconciled 2026-07-06)
- `publishing.kdp_status`: `"live"`
- `publishing.live_date`: `"2026-06-17"` — **67 days ago as of audit date (2026-08-23)**
- `current_stage`: `9`
- `stages["10-postlaunch"].status`: `"not_started"`
- `post_launch.review_count`: `0`
- No BSR, review velocity, or countdown deal data logged

The book has been live on Amazon for 67 days (9.6 weeks) with zero post-launch monitoring active. The 2026-07-06 state reconciliation correctly set live/published fields but explicitly left `current_stage` and stage 10 unchanged. This is a revenue-generating asset with no tracking infrastructure.

**This contradiction has appeared in six consecutive weekly audit reports (first surfaced 2026-08-02) with zero remediation.**

**Suggested fix:** Set `current_stage` to `10`, set `stages["10-postlaunch"].status` to `"in_progress"` with `started_at: "2026-06-17T00:00:00Z"`, and run post-launch-tracker immediately to begin BSR and review logging.

---

### CHECK 1 (adjacent) — CONTRADICTION *(persists; week 5)*
**human_gates.published=true but pre_launch.launch_ready=false**

- `pre_launch.launch_ready`: `false`
- `human_gates.published`: `true`
- `pre_launch.open_items[0]`: ARC cohort recruitment (0 confirmed readers)
- `pre_launch.listing_audit_passed`: `false`

The book was published outside pipeline tracking without the `launch_ready` gate ever being cleared.

**Suggested fix:** Document why these gates were bypassed. Set `launch_ready: true` with an explanation note, or flag as a known gap requiring remediation (e.g. retroactive ARC/listing audit).

---

### CHECK 6 — CONTRADICTION *(persists; week 3)*
**quality_scores.final_approval_score = 113 (sub-threshold) while human_gates.final_approval_passed = true**

- `quality_scores.final_approval_score`: `113`
- `human_gates.final_approval_passed`: `true`
- Pipeline minimum: **270/300** from final-approval-agent
- `human_gates.final_approval_passed_note`: "Cover gate only (2026-06-17, Architect override). Manuscript approved 2026-06-11 (113/120) and not re-run."
- `lifecycle_note` explicitly labels this "INV-9 final_approval_score 113<270"

The `final_approval_score` field records `113`, which is the book-reviewer score (out of 120), not a valid final-approval-agent score (out of 300). A full /300 audit was never conducted.

**Suggested fix:** Run final-approval-agent and record the real /300 score, or replace `final_approval_score` with a string such as `"cover-only-override-see-note"` so the field does not imply a passing 300-point run that never happened.

---

### CHECK 3 — CONTRADICTION *(persists; week 2)*
**stages["05-optimisation"].completed_at (12:00) predates stages["04-quality"].completed_at (13:00) on the same day**

- `stages["04-quality"].completed_at`: `"2026-06-11T13:00:00Z"` — verdict "APPROVED TO PROCEED TO STAGE 05"
- `stages["05-optimisation"].completed_at`: `"2026-06-11T12:00:00Z"`

Stage 05 shows completion one hour before the stage 04 approval it depends on.

**Suggested fix:** Correct `stages["05-optimisation"].completed_at` to `"2026-06-11T14:00:00Z"` or any value after `13:00`.

---

## BOOK 4 — the-7-day-gut-reset

### CHECK 3 — CONTRADICTION *(persists; week 5)*
**agent_log entries are out of chronological order**

- Index 2: `"2026-05-24T09:00:00Z"` — marketing plan rebuild
- Index 3: `"2026-05-24T14:00:00Z"` — algorithm upgrade
- Index 4: `"2026-05-24T17:00:00Z"` — pre-upload keyword fixes
- Index 5: `"2026-05-23T12:00:00Z"` — Stage 06.5 pre-launch ← one full day earlier than the three preceding entries

**Suggested fix:** Reorder to ascending timestamp, placing the `2026-05-23T12:00:00Z` entry before the three `2026-05-24` entries.

---

### CHECK 3 — CONTRADICTION *(persists; week 3)*
**stages["05-optimisation"].completed_at (2026-05-14) predates stages["04-quality"].completed_at (2026-05-21)**

- `stages["04-quality"].completed_at`: `"2026-05-21T09:15:00Z"` — "Re-run after 2026-05-21 chapter expansion"
- `stages["05-optimisation"].completed_at`: `"2026-05-14T16:01:00Z"`

Stage 05 timestamp was never updated to reflect the re-run of stage 04 in May 21.

**Suggested fix:** Update `stages["05-optimisation"].completed_at` to on or after `2026-05-21T09:15:00Z`.

---

### CHECK 5 — CONTRADICTION *(persists; week 3)*
**production.cover_built = true but build_note contains the stale text "cover_built=false"**

- `production.cover_built`: `true`
- `production.build_note`: *"...cover_built=false — blocked on human cover generation per COVER-BRIEF.md (sole remaining blocker)."*

The cover was added and `human_gates.cover_approved` set `true` at Stage 06 re-audit (2026-05-22), but the `build_note` was never updated.

**Suggested fix:** Update or append to `build_note`: "Cover completed and approved 2026-05-22 per Stage 06 re-audit."

---

### CHECK 2 — CONTRADICTION *(persists; week 2)*
**stages["07-publishing"] is complete but human_gates.pre_launch_approved = false**

- `stages["06.5-pre-launch"].notes`: *"Awaiting human gate pre_launch_approved before Stage 07."*
- `stages["07-publishing"].status`: `"complete"`, `completed_at`: `"2026-06-13T00:00:00Z"`
- `human_gates.pre_launch_approved`: `false`

Stage 06.5 explicitly requires `pre_launch_approved` before Stage 07 may begin. Stage 07 is marked complete but the gate was never set true.

**Note:** The planned launch dates (free days 2026-05-27/28, paid launch 2026-05-29) are now **87 days in the past** as of this audit. The book remains unpublished with `published=false`.

**Suggested fix:** If the Architect approved the pre-launch package before Stage 07 proceeded, set `human_gates.pre_launch_approved: true` with a dated note. If the gate was bypassed, document this alongside the `lifecycle_note`.

---

## BOOK 5 — the-dust-between-seconds

### CHECK 2 — CONTRADICTION *(persists; week 5)*
**writing.completed_chapters = 1 inconsistent with agent_log and current_chapter**

- `writing.completed_chapters`: `1`
- `writing.approved_chapters`: `1`
- `writing.current_chapter`: `"04-chapter-4"`
- `agent_log` (2026-04-29): *"Chapter 3 complete and approved. Resuming from Chapter 4."*

If Chapter 3 is the last approved chapter and the writer is resuming at Chapter 4, then `completed_chapters` and `approved_chapters` should be at least 3.

**Suggested fix:** Verify manuscript/ files on disk, then set `completed_chapters` and `approved_chapters` to the correct count (minimum 3).

---

## BOOK 6 — vagus-nerve-gut-reset-workbook

### CHECK 7 — CONTRADICTION *(persists; week 5)*
**last_updated is older than the three most recent agent_log entries**

- `last_updated`: `"2026-06-26T21:30:00Z"`
- Newest `agent_log` entry: `"2026-06-28T18:05:00Z"` — packaging-hygiene sync

Four agent sessions ran on 2026-06-28, none of which updated `last_updated`. The field has been stale for 56 days.

**Suggested fix:** Set `last_updated` to `"2026-06-28T18:05:00Z"`.

---

### CHECK 3 — CONTRADICTION *(persists; week 5)*
**agent_log entries for 2026-06-19 are out of chronological order within the array**

- Index 4: `"2026-06-19T00:00:00Z"` — book scaffolded
- Index 5: `"2026-06-19T23:50:00Z"` — Gate 5 PDF style test
- Index 6: `"2026-06-19T01:00:00Z"` — Gate 3+4 cleared ← should precede 23:50 in a descending list, but follows it

**Suggested fix:** Reorder to ascending: 00:00 (scaffolded) → 01:00 (Gate 3+4) → 23:50 (Gate 5).

---

## SUMMARY TABLE

| # | Book | Check | Severity | Status | Fields Involved |
|---|------|-------|----------|--------|-----------------|
| C1 | death-in-the-cathedral-close | CHECK 7 | Medium | Persists (wk 5) | `last_updated` vs `agent_log[0].timestamp` |
| C2 | death-in-the-cathedral-close | CHECK 2 | Medium | Persists (wk 5) | `current_stage=10`, `stages.08.not_started`, `stages.09.not_started` |
| C3 | death-in-the-cathedral-close | CHECK 5 | Low | Persists (wk 5) | `pdf_built=true` / `pdf_file` absent; `docx_built=true` / `docx_file` absent |
| C4 | fix-your-gut-for-good | CHECK 5 | Medium | Persists (wk 5) | `pdf_built=true` / `pdf_path=null`; `docx_built=true` / `docx_path=null` |
| C5 | fix-your-gut-for-good | CHECK 3 | Low | Persists (wk 5) | `stages.07-publishing.status=complete` / `completed_at=null` |
| C6 | h-pylori-recovery-plan | CHECK 2 | **CRITICAL** | Persists (wk 6) | `published=true`, `kdp_status=live` (67 days), `current_stage=9`, `stages.10.not_started` |
| C7 | h-pylori-recovery-plan | CHECK 1 adj. | High | Persists (wk 5) | `published=true` / `launch_ready=false` |
| C8 | h-pylori-recovery-plan | CHECK 6 | Medium | Persists (wk 3) | `final_approval_score=113` (<270) while `final_approval_passed=true` |
| C9 | the-7-day-gut-reset | CHECK 3 | Low | Persists (wk 5) | `agent_log[5].timestamp=2026-05-23` after `agent_log[2-4].timestamp=2026-05-24` |
| C10 | the-7-day-gut-reset | CHECK 3 | Low | Persists (wk 3) | `stages.05-optimisation.completed_at=2026-05-14` before `stages.04-quality.completed_at=2026-05-21` |
| C11 | the-7-day-gut-reset | CHECK 5 | Low | Persists (wk 3) | `production.cover_built=true` / `build_note` contains `"cover_built=false"` |
| C12 | the-dust-between-seconds | CHECK 2 | Medium | Persists (wk 5) | `completed_chapters=1` vs agent_log "Chapter 3 complete and approved" |
| C13 | vagus-nerve-gut-reset-workbook | CHECK 7 | Medium | Persists (wk 5) | `last_updated=2026-06-26` vs `agent_log[0].timestamp=2026-06-28` |
| C14 | vagus-nerve-gut-reset-workbook | CHECK 3 | Low | Persists (wk 5) | `agent_log[5].timestamp=23:50` precedes `agent_log[6].timestamp=01:00` same day |
| C15 | fix-your-gut-for-good | CHECK 2 | Medium | Persists (wk 2) | `current_stage=10` / `stages.09-series.status="pending"` |
| C16 | fix-your-gut-for-good | CHECK 3 | Low | Persists (wk 2) | `stages.02-planning.completed_at=2026-04-13` before `stages.01-research.completed_at=2026-04-15` |
| C17 | fix-your-gut-for-good | CHECK 3 | Low | Persists (wk 2) | `stages.04-quality.completed_at=2026-04-17` before `stages.03-writing.completed_at=2026-04-18` |
| C18 | h-pylori-recovery-plan | CHECK 3 | Low | Persists (wk 2) | `stages.05-optimisation.completed_at=T12:00` before `stages.04-quality.completed_at=T13:00` |
| C19 | the-7-day-gut-reset | CHECK 2 | Medium | Persists (wk 2) | `stages.07-publishing.status=complete` / `human_gates.pre_launch_approved=false` |

**Total: 19 contradictions across 5 of 6 books.**
**Clean books: none.** All 6 books carry at least one contradiction.

---

## WEEK-ON-WEEK DELTA

| Metric | 2026-08-16 | 2026-08-23 | Change |
|--------|------------|------------|--------|
| Total contradictions | 19 | 19 | ±0 |
| New contradictions | 5 | **0** | — |
| Resolved contradictions | 0 | **0** | — |
| Books with contradictions | 5 | 5 | ±0 |
| Weeks C6 unresolved | 5 | **6** | +1 |

**No changes detected.** All 19 contradictions from the 2026-08-16 report are present and unresolved. No new state entries or field changes were found in any pipeline-state.json file this week.

---

## MOST SERIOUS CONTRADICTION

**C6 — h-pylori-recovery-plan (ASIN B0H5TZTPRT)**

The book has been live on Amazon for **67 days** (since 2026-06-17). `current_stage=9`, `stages["10-postlaunch"]="not_started"`. No BSR data, no review velocity data, no countdown deal has been tracked or scheduled. This is the sixth consecutive weekly audit flagging this contradiction with zero remediation. The Architect should treat this as the immediate priority — the post-launch window where actions most affect long-term ranking is already past its most critical phase.

**Immediate actions required:**
1. Set `current_stage: 10`, `stages["10-postlaunch"].status: "in_progress"`, `started_at: "2026-06-17T00:00:00Z"`
2. Run `post-launch-tracker` to log current BSR, review count, and KU pages from the KDP dashboard
3. Evaluate countdown deal eligibility (KDP Select term start 2026-06-17; eligible after 30 days = from 2026-07-17; likely available now)

---

*Audit generated by automated Job 5. Read-only pass — no state files modified. Architect decides all fixes.*
