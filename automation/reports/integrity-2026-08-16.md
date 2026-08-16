# BookFactory State Integrity Audit — 2026-08-16

**19 contradictions found across 5 books.**

Audit scope: 6 books × 7 checks. Run date: 2026-08-16 (automated Job 5).
Read-only pass — no pipeline-state.json files modified.
Compared against prior audit: integrity-2026-08-09.md (14 contradictions).
**Net change: +5 new contradictions; 14 from last week all persist unresolved.**

---

## BOOK 1 — death-in-the-cathedral-close

### CHECK 7 — CONTRADICTION *(persists from 2026-08-09)*
**last_updated older than newest agent_log timestamp**

- `last_updated`: `"2026-05-28T00:00:00Z"`
- Newest `agent_log` entry timestamp: `"2026-06-02T00:00:00Z"` (Deal Day 1 BSR audit + category mismatch flagged)

The field was never refreshed after the June countdown deal session. Unresolved for the fourth consecutive weekly audit.

**Suggested fix:** Set `last_updated` to `"2026-06-02T00:00:00Z"` (date of the last confirmed agent run).

---

### CHECK 2 — CONTRADICTION *(persists from 2026-08-09)*
**current_stage=10 but stages 08 and 09 are not_started with no skip explanation**

- `current_stage`: `10`
- `stages["08-products"]`: `not_started`
- `stages["09-series"]`: `not_started`
- `stages["10-postlaunch"]`: `in_progress`

Post-launch is in_progress but the digital products stage (08) and series stage (09) have never been started and carry no "skipped" or "n/a" designation.

**Suggested fix:** Either set `stages["08-products"].status` and `stages["09-series"].status` to `"skipped"` with a `skip_reason` note (e.g. fiction standalone — no series stage required), or advance them if work is planned.

---

### CHECK 5 — CONTRADICTION *(persists from 2026-08-09)*
**production.pdf_built and production.docx_built are true but no path fields exist**

- `production.epub_built`: `true` — `epub_file`: `"exports/final/manuscript-kdp.epub"` ✓ present
- `production.pdf_built`: `true` — `pdf_file`: **field entirely absent**
- `production.docx_built`: `true` — `docx_file`: **field entirely absent**

**Suggested fix:** Add `"pdf_file": "exports/final/manuscript-kdp.pdf"` and `"docx_file": "exports/final/manuscript-kdp.docx"` to the `production` block, or set to `null` if unconfirmed.

---

## BOOK 2 — fix-your-gut-for-good

### CHECK 5 — CONTRADICTION *(persists from 2026-08-09)*
**production.pdf_built and production.docx_built are true but paths are null**

- `production.pdf_built`: `true` — `pdf_path`: `null`
- `production.docx_built`: `true` — `docx_path`: `null`
- `production.epub_built`: `true` — `epub_path`: `"books/fix-your-gut-for-good/exports/final/manuscript-kdp.epub"` ✓

The `build_note` itself acknowledges: *"Export files present in exports/final/ — exact paths not verified in this session."* For a live book (ASIN B0GXYLWS1W, kdp_status=live), unverified production paths are a recovery risk.

**Suggested fix:** Verify exports/final/ on disk, then populate `pdf_path` and `docx_path` with the confirmed file paths.

---

### CHECK 3 — CONTRADICTION *(persists from 2026-08-09)*
**stages["07-publishing"].status = "complete" but completed_at = null**

- `stages["07-publishing"].status`: `"complete"`
- `stages["07-publishing"].completed_at`: `null`

A stage marked complete with no completion timestamp breaks the audit trail.

**Suggested fix:** Set `completed_at` to `"2026-04-21T00:00:00Z"` (the live_date, which is the logical close of stage 07).

---

### CHECK 2 — CONTRADICTION *(NEW — not flagged in 2026-08-09 audit)*
**current_stage=10 but stages["09-series"].status = "pending"**

- `current_stage`: `10`
- `stages["09-series"].status`: `"pending"`
- `stages["10-postlaunch"].status`: `"in_progress"`

Stage 10 is in_progress while stage 09 has never advanced beyond "pending" with no completion timestamp. The pipeline is sequential; stage 10 should not be in_progress until stage 09 is complete (or explicitly skipped).

**Suggested fix:** Either advance `stages["09-series"]` to `"complete"` with a completion note if series work was done informally, or mark `"skipped"` with a reason. If series work genuinely remains to be done, mark stage 10 as blocked until stage 09 is resolved.

---

### CHECK 3 — CONTRADICTION *(NEW — not flagged in 2026-08-09 audit)*
**stages["02-planning"].completed_at (2026-04-13) predates stages["01-research"].completed_at (2026-04-15)**

- `stages["01-research"].completed_at`: `"2026-04-15T00:00:00Z"`
- `stages["02-planning"].completed_at`: `"2026-04-13T00:00:00Z"`

Stage 02 (planning) is recorded as completing two days before stage 01 (research). Planning cannot precede research in the pipeline. Both stages carry "present on disk" retrospective notes, suggesting the dates were back-filled and may not reflect actual sequencing. However as recorded, the chronological order is violated.

**Suggested fix:** Correct `stages["02-planning"].completed_at` to a date on or after `"2026-04-15T00:00:00Z"` (the research completion date), or add an explanatory note that these are retrospective timestamp estimates for a book created before the intelligence layer was formalised.

---

### CHECK 3 — CONTRADICTION *(NEW — not flagged in 2026-08-09 audit)*
**stages["04-quality"].completed_at (2026-04-17) predates stages["03-writing"].completed_at (2026-04-18)**

- `stages["03-writing"].completed_at`: `"2026-04-18T00:00:00Z"`
- `stages["04-quality"].completed_at`: `"2026-04-17T00:00:00Z"`

Stage 04 (quality) is recorded as completing one day before stage 03 (writing). Quality review cannot precede the completion of writing. Same retrospective back-fill context as above.

**Suggested fix:** Correct `stages["04-quality"].completed_at` to a date on or after `"2026-04-18T00:00:00Z"`, or add a retrospective note matching the one on stage 01.

---

## BOOK 3 — h-pylori-recovery-plan

### CHECK 2 — CONTRADICTION *(MOST SERIOUS — persists from 2026-08-09; now 5 consecutive weekly audits)*
**Book is live (published=true, kdp_status=live) but current_stage=9 and stage 10 is not_started**

- `human_gates.published`: `true` (reconciled 2026-07-06)
- `publishing.kdp_status`: `"live"`
- `publishing.live_date`: `"2026-06-17"` — **60 days ago as of audit date**
- `current_stage`: `9`
- `stages["10-postlaunch"].status`: `"not_started"`

The book has been live on Amazon for 60 days (8.6 weeks). The 2026-07-06 state reconciliation correctly set the live/published fields but explicitly left `current_stage` and stage 10 unchanged. The book has no active post-launch monitoring: no BSR tracking, no review velocity, no countdown deal scheduling. This is the operationally most dangerous contradiction in the system — one additional week of post-launch blindness for a revenue-generating asset.

**Suggested fix:** Set `current_stage` to `10`, set `stages["10-postlaunch"].status` to `"in_progress"` with `started_at: "2026-06-17T00:00:00Z"`, and run post-launch-tracker immediately to begin metrics logging.

---

### CHECK 1 (adjacent) — CONTRADICTION *(persists from 2026-08-09)*
**human_gates.published=true but pre_launch.launch_ready=false**

- `pre_launch.launch_ready`: `false`
- `human_gates.published`: `true`
- `pre_launch.open_items[0]`: ARC cohort recruitment still open
- `pre_launch.arc_readers_confirmed`: `0`
- `pre_launch.listing_audit_passed`: `false`

The book was published outside pipeline tracking without the `launch_ready` gate ever being cleared.

**Suggested fix:** Retroactively document why these gates were bypassed and set `launch_ready: true` with an explanation note, or flag as a known gap requiring remediation.

---

### CHECK 6 — CONTRADICTION *(persists from 2026-08-09)*
**quality_scores.final_approval_score = 113 (sub-threshold) while human_gates.final_approval_passed = true**

- `quality_scores.final_approval_score`: `113`
- `human_gates.final_approval_passed`: `true`
- Pipeline minimum passing score for final-approval-agent: **270/300**
- `human_gates.final_approval_passed_note`: "Cover gate only (2026-06-17, Architect override). Manuscript was already approved 2026-06-11 (113/120, proofread PASS, hooks PASS) and not re-run."

The `final_approval_score` field records `113`, which is the book-reviewer score out of 120, not a valid final-approval-agent score (which is out of 300). A full final-approval-agent run producing a /300 score was never recorded for this book. The lifecycle_note acknowledges this as "INV-9 final_approval_score 113<270."

**Suggested fix:** Run final-approval-agent and record the real /300 score, or document the cover-only override explicitly in `final_approval_score` (e.g., `"cover-only-override-see-note"`) so the numeric field does not imply a passing run that never happened.

---

### CHECK 3 — CONTRADICTION *(NEW — not flagged in 2026-08-09 audit)*
**stages["05-optimisation"].completed_at (12:00) predates stages["04-quality"].completed_at (13:00) on the same day**

- `stages["04-quality"].completed_at`: `"2026-06-11T13:00:00Z"`
- `stages["05-optimisation"].completed_at`: `"2026-06-11T12:00:00Z"`

Stage 05 (optimisation) completed one hour before stage 04 (quality) on the same day. The pipeline requires stage 04 to complete before stage 05 begins. The stage 04 notes confirm a 13:00 verdict ("APPROVED TO PROCEED TO STAGE 05") and the stage 05 notes confirm it ran sequentially after stage 04. The stage 05 completion timestamp is set one hour too early.

**Suggested fix:** Correct `stages["05-optimisation"].completed_at` to `"2026-06-11T14:00:00Z"` or any value after `"2026-06-11T13:00:00Z"` to reflect the actual sequence. The stage 05 agent_log entry already records `"2026-06-11T12:00:00Z"` as the stated timestamp — both values should be corrected together.

---

## BOOK 4 — the-7-day-gut-reset

### CHECK 3 — CONTRADICTION *(persists from 2026-08-09)*
**agent_log entries are out of chronological order**

- Entry index 2: `"2026-05-24T09:00:00Z"` — marketing plan rebuild
- Entry index 3: `"2026-05-24T14:00:00Z"` — algorithm upgrade
- Entry index 4: `"2026-05-24T17:00:00Z"` — pre-upload keyword fixes
- Entry index 5: `"2026-05-23T12:00:00Z"` — Stage 06.5 pre-launch ← one full day earlier than preceding entries

**Suggested fix:** Reorder the `agent_log` array so entries are in ascending timestamp order, placing the `2026-05-23T12:00:00Z` entry before the three `2026-05-24` entries.

---

### CHECK 3 — CONTRADICTION *(persists from 2026-08-09)*
**stages["05-optimisation"].completed_at (2026-05-14) predates stages["04-quality"].completed_at (2026-05-21)**

- `stages["04-quality"].completed_at`: `"2026-05-21T09:15:00Z"`
- `stages["05-optimisation"].completed_at`: `"2026-05-14T16:01:00Z"`

Stage 05 (optimisation) shows completion seven days before stage 04 (quality). Stage 04 notes confirm it was "re-run after 2026-05-21 chapter expansion" — the stage 05 timestamp was never updated to reflect this re-run sequence.

**Suggested fix:** Update `stages["05-optimisation"].completed_at` to a date at or after `2026-05-21T09:15:00Z`, or add a note confirming stage 05 was re-verified against the expanded manuscript after 21 May.

---

### CHECK 5 — CONTRADICTION *(persists from 2026-08-09)*
**production.cover_built = true but build_note contains the text "cover_built=false"**

- `production.cover_built`: `true`
- `production.build_note`: *"...cover_built=false — blocked on human cover generation per COVER-BRIEF.md (sole remaining blocker)."*

The `cover_built` field was set to `true` after Stage 06 was re-approved with the cover in place (per `agent_log`: "Stage 06 final approval re-audit (cover in place)") and `human_gates.cover_approved` is `true`. However, the `build_note` still carries the stale pre-cover text.

**Suggested fix:** Update `build_note` to remove the stale "cover_built=false" clause, or append a dated note: "Cover completed 2026-05-22 per Stage 06 re-audit."

---

### CHECK 2 — CONTRADICTION *(NEW — not flagged in 2026-08-09 audit)*
**stages["07-publishing"] is complete but human_gates.pre_launch_approved = false**

- `stages["06.5-pre-launch"].status`: `"complete"`
- `stages["06.5-pre-launch"].notes`: *"Awaiting human gate pre_launch_approved before Stage 07."*
- `stages["07-publishing"].status`: `"complete"`, `completed_at`: `"2026-06-13T00:00:00Z"`
- `human_gates.pre_launch_approved`: `false`

Stage 06.5 explicitly states that `pre_launch_approved` is required before Stage 07 may begin. Yet Stage 07 is marked complete and `pre_launch_approved` remains false. This means either the gate was bypassed, or the gate field was never updated after approval occurred.

**Suggested fix:** If the Architect did approve the pre-launch package before Stage 07 proceeded, set `human_gates.pre_launch_approved: true` with a dated note. If the gate was genuinely bypassed, document this as a known pipeline gap alongside the `lifecycle_note`.

---

## BOOK 5 — the-dust-between-seconds

### CHECK 2 — CONTRADICTION *(persists from 2026-08-09)*
**writing.completed_chapters = 1 inconsistent with agent_log and current_chapter**

- `writing.completed_chapters`: `1`
- `writing.approved_chapters`: `1`
- `writing.current_chapter`: `"04-chapter-4"`
- `agent_log` note (2026-04-29): *"Chapter 3 complete and approved. Resuming from Chapter 4."*

If Chapter 3 is complete and approved (as stated in the log), and the current chapter is 4, then `completed_chapters` and `approved_chapters` should be at least 3.

**Suggested fix:** Set `writing.completed_chapters` and `writing.approved_chapters` to `3` (minimum, per the log note). Verify against actual manuscript/ files on disk before updating.

---

## BOOK 6 — vagus-nerve-gut-reset-workbook

### CHECK 7 — CONTRADICTION *(persists from 2026-08-09)*
**last_updated is older than the three most recent agent_log entries**

- `last_updated`: `"2026-06-26T21:30:00Z"`
- Newest `agent_log` entry: `"2026-06-28T18:05:00Z"` — packaging-hygiene sync

Four agent sessions ran on 2026-06-28, none of which updated `last_updated`. The field has been stale for 49 days.

**Suggested fix:** Set `last_updated` to `"2026-06-28T18:05:00Z"` (timestamp of the final confirmed agent action).

---

### CHECK 3 — CONTRADICTION *(persists from 2026-08-09)*
**agent_log entries for 2026-06-19 are out of chronological order within the array**

- Array index 4: `"2026-06-19T00:00:00Z"` — book scaffolded
- Array index 5: `"2026-06-19T23:50:00Z"` — Gate 5 PDF style test
- Array index 6: `"2026-06-19T01:00:00Z"` — Gate 3+4 cleared ← should precede 23:50, not follow it

**Suggested fix:** Reorder to ascending: 00:00 (scaffolded) → 01:00 (Gate 3+4) → 23:50 (Gate 5).

---

## SUMMARY TABLE

| # | Book | Check | Severity | Status | Fields Involved |
|---|------|-------|----------|--------|-----------------|
| C1 | death-in-the-cathedral-close | CHECK 7 | Medium | Persists (wk 4) | `last_updated` vs `agent_log[0].timestamp` |
| C2 | death-in-the-cathedral-close | CHECK 2 | Medium | Persists (wk 4) | `current_stage=10`, `stages.08.not_started`, `stages.09.not_started` |
| C3 | death-in-the-cathedral-close | CHECK 5 | Low | Persists (wk 4) | `pdf_built=true` / `pdf_file` absent; `docx_built=true` / `docx_file` absent |
| C4 | fix-your-gut-for-good | CHECK 5 | Medium | Persists (wk 4) | `pdf_built=true` / `pdf_path=null`; `docx_built=true` / `docx_path=null` |
| C5 | fix-your-gut-for-good | CHECK 3 | Low | Persists (wk 4) | `stages.07-publishing.status=complete` / `completed_at=null` |
| C6 | h-pylori-recovery-plan | CHECK 2 | **CRITICAL** | Persists (wk 5) | `published=true`, `kdp_status=live` (60 days), `current_stage=9`, `stages.10.not_started` |
| C7 | h-pylori-recovery-plan | CHECK 1 adj. | High | Persists (wk 4) | `published=true` / `launch_ready=false` |
| C8 | h-pylori-recovery-plan | CHECK 6 | Medium | Persists (wk 2) | `final_approval_score=113` (<270) while `final_approval_passed=true` |
| C9 | the-7-day-gut-reset | CHECK 3 | Low | Persists (wk 4) | `agent_log[5].timestamp=2026-05-23` after `agent_log[2-4].timestamp=2026-05-24` |
| C10 | the-7-day-gut-reset | CHECK 3 | Low | Persists (wk 2) | `stages.05-optimisation.completed_at=2026-05-14` before `stages.04-quality.completed_at=2026-05-21` |
| C11 | the-7-day-gut-reset | CHECK 5 | Low | Persists (wk 2) | `production.cover_built=true` / `build_note` says `"cover_built=false"` |
| C12 | the-dust-between-seconds | CHECK 2 | Medium | Persists (wk 4) | `completed_chapters=1` vs agent_log "Chapter 3 complete and approved" |
| C13 | vagus-nerve-gut-reset-workbook | CHECK 7 | Medium | Persists (wk 4) | `last_updated=2026-06-26` vs `agent_log[0].timestamp=2026-06-28` |
| C14 | vagus-nerve-gut-reset-workbook | CHECK 3 | Low | Persists (wk 4) | `agent_log[5].timestamp=23:50` before `agent_log[6].timestamp=01:00` same day |
| C15 | fix-your-gut-for-good | CHECK 2 | Medium | **NEW** | `current_stage=10` / `stages.09-series.status="pending"` |
| C16 | fix-your-gut-for-good | CHECK 3 | Low | **NEW** | `stages.02-planning.completed_at=2026-04-13` before `stages.01-research.completed_at=2026-04-15` |
| C17 | fix-your-gut-for-good | CHECK 3 | Low | **NEW** | `stages.04-quality.completed_at=2026-04-17` before `stages.03-writing.completed_at=2026-04-18` |
| C18 | h-pylori-recovery-plan | CHECK 3 | Low | **NEW** | `stages.05-optimisation.completed_at=T12:00` before `stages.04-quality.completed_at=T13:00` |
| C19 | the-7-day-gut-reset | CHECK 2 | Medium | **NEW** | `stages.07-publishing.status=complete` / `human_gates.pre_launch_approved=false` |

**Total: 19 contradictions across 5 of 6 books.**

**Clean books this week: the-dust-between-seconds** has 1 persisting contradiction (C12) — no clean books.

**New this week (5):** C15 (fix-your-gut stage 09 pending vs current_stage=10), C16 (fix-your-gut planning before research), C17 (fix-your-gut quality before writing), C18 (h-pylori optimisation before quality — same day, 1 hour off), C19 (the-7-day publishing complete without pre_launch gate). All five are in books already carrying prior contradictions. All five are timestamp/sequencing issues likely introduced by retrospective or inaccurate date recording. No new books entered the dirty set.

**Most serious contradiction: C6** — h-pylori-recovery-plan (ASIN B0H5TZTPRT) has been live on Amazon since 2026-06-17 — **60 days as of this audit**. `current_stage=9`, `stages["10-postlaunch"]="not_started"`. No BSR tracking, no review velocity monitoring, no countdown deal scheduling for an actively selling title. This contradiction has now appeared in **five consecutive weekly audit reports** (first surfaced 2026-08-02) with zero remediation. The Architect should treat this as the immediate priority.

**Trend note:** All 14 contradictions from 2026-08-09 persist unresolved. This is the fifth consecutive week C6 appears. fix-your-gut-for-good now carries 5 contradictions (up from 2 in prior audit) due to newly discovered stage date ordering issues from its retrospective pipeline-state initialisation in May 2026.

---

*Audit generated by automated Job 5. Read-only pass — no state files modified. Architect decides all fixes.*
