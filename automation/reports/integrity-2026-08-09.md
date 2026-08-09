# BookFactory State Integrity Audit — 2026-08-09

**14 contradictions found across 5 books.**

Audit scope: 6 books × 7 checks. Run date: 2026-08-09 (automated Job 5).
Read-only pass — no pipeline-state.json files modified.
Compared against prior audit: integrity-2026-08-02.md (11 contradictions).
**Net change: +3 new contradictions; 11 from last week all persist unresolved.**

---

## BOOK 1 — death-in-the-cathedral-close

### CHECK 7 — CONTRADICTION *(persists from 2026-08-02)*
**last_updated older than newest agent_log timestamp**

- `last_updated`: `"2026-05-28T00:00:00Z"`
- Newest `agent_log` entry timestamp: `"2026-06-02T00:00:00Z"` (Deal Day 1 BSR audit)

The field was never refreshed after the June countdown deal session. Unresolved for the third consecutive weekly audit.

**Suggested fix:** Set `last_updated` to `"2026-06-02T00:00:00Z"` (date of the last confirmed agent run).

---

### CHECK 2 — CONTRADICTION *(persists from 2026-08-02)*
**current_stage=10 but stages 08 and 09 are not_started with no skip explanation**

- `current_stage`: `10`
- `stages["08-products"]`: `not_started`
- `stages["09-series"]`: `not_started`
- `stages["10-postlaunch"]`: `in_progress`

Post-launch is in_progress but the digital products stage (08) and series stage (09) have never been started and carry no "skipped" or "n/a" designation.

**Suggested fix:** Either set `stages["08-products"].status` and `stages["09-series"].status` to `"skipped"` with a `skip_reason` note, or advance them if work is planned.

---

### CHECK 5 — CONTRADICTION *(persists from 2026-08-02)*
**production.pdf_built and production.docx_built are true but no path fields exist**

- `production.epub_built`: `true` — `epub_file`: `"exports/final/manuscript-kdp.epub"` ✓ present
- `production.pdf_built`: `true` — `pdf_file`: **field absent** (not null — entirely missing)
- `production.docx_built`: `true` — `docx_file`: **field absent** (not null — entirely missing)

**Suggested fix:** Add `"pdf_file": "exports/final/manuscript-kdp.pdf"` and `"docx_file": "exports/final/manuscript-kdp.docx"` to the `production` block, or set to `null` if unconfirmed.

---

## BOOK 2 — fix-your-gut-for-good

### CHECK 5 — CONTRADICTION *(persists from 2026-08-02)*
**production.pdf_built and production.docx_built are true but paths are null**

- `production.pdf_built`: `true` — `pdf_path`: `null`
- `production.docx_built`: `true` — `docx_path`: `null`
- `production.epub_built`: `true` — `epub_path`: `"books/fix-your-gut-for-good/exports/final/manuscript-kdp.epub"` ✓

The build_note itself acknowledges: *"Export files present in exports/final/ — exact paths not verified in this session."* For a live book (ASIN B0GXYLWS1W, kdp_status=live), unverified production paths are a recovery risk.

**Suggested fix:** Verify exports/final/ on disk, then populate `pdf_path` and `docx_path` with the confirmed file paths.

---

### CHECK 3 — CONTRADICTION *(persists from 2026-08-02)*
**stages["07-publishing"].status = "complete" but completed_at = null**

- `stages["07-publishing"].status`: `"complete"`
- `stages["07-publishing"].completed_at`: `null`

A stage marked complete with no completion timestamp breaks the audit trail.

**Suggested fix:** Set `completed_at` to `"2026-04-21T00:00:00Z"` (the live_date, which is the logical close of stage 07).

---

## BOOK 3 — h-pylori-recovery-plan

### CHECK 2 — CONTRADICTION *(MOST SERIOUS — persists from 2026-08-02; now 4 consecutive weekly audits)*
**Book is live (published=true, kdp_status=live) but current_stage=9 and stage 10 is not_started**

- `human_gates.published`: `true` (reconciled 2026-07-06)
- `publishing.kdp_status`: `"live"`
- `publishing.live_date`: `"2026-06-17"` — **53 days ago as of audit date**
- `current_stage`: `9`
- `stages["10-postlaunch"].status`: `"not_started"`

The book has been live on Amazon for 53 days (7.5 weeks). The 2026-07-06 state reconciliation set the live/published fields correctly but explicitly left `current_stage` and stage 10 unchanged. The book has no active post-launch monitoring: no BSR tracking, no review velocity, no countdown deal scheduling. This is the operationally most dangerous contradiction in the system — worsening each week as it goes unresolved.

**Suggested fix:** Set `current_stage` to `10`, set `stages["10-postlaunch"].status` to `"in_progress"` with `started_at: "2026-06-17T00:00:00Z"`, and run post-launch-tracker to begin metrics logging immediately.

---

### CHECK 1 (adjacent) — CONTRADICTION *(persists from 2026-08-02)*
**human_gates.published=true but pre_launch.launch_ready=false**

- `pre_launch.launch_ready`: `false`
- `human_gates.published`: `true`
- `pre_launch.open_items`: ARC cohort recruitment still listed as open
- `pre_launch.arc_readers_confirmed`: `0`
- `pre_launch.listing_audit_passed`: `false`

The book was published (outside pipeline tracking) without the `launch_ready` gate ever being cleared.

**Suggested fix:** Retroactively document why these gates were bypassed and set `launch_ready: true` with an explanation note, or flag as a known gap requiring remediation.

---

### CHECK 6 — CONTRADICTION *(NEW — not flagged in 2026-08-02 audit)*
**quality_scores.final_approval_score = 113 (sub-threshold) while human_gates.final_approval_passed = true**

- `quality_scores.final_approval_score`: `113`
- `human_gates.final_approval_passed`: `true`
- Pipeline minimum passing score for final-approval-agent: **270/300**
- `human_gates.final_approval_passed_note`: "Cover gate only (2026-06-17, Architect override). Manuscript was already approved 2026-06-11 (113/120, proofread PASS, hooks PASS) and not re-run."

The `final_approval_score` field records `113`, which is the book-reviewer score out of 120, not a valid final-approval-agent score (which is out of 300). A full final-approval-agent run producing a /300 score was never recorded for this book. The lifecycle_note acknowledges this as "INV-9 final_approval_score 113<270" — a pre-existing validator critical — but it was not surfaced in prior integrity audits.

**Suggested fix:** Either run final-approval-agent and record the real /300 score, or document the override explicitly in `final_approval_score` (e.g., set to a sentinel like `"cover-only-override-see-note"`) so the numeric field does not imply a passing run that never happened.

---

## BOOK 4 — the-7-day-gut-reset

### CHECK 3 — CONTRADICTION *(persists from 2026-08-02)*
**agent_log entries are out of chronological order**

- Entry index 2: `"2026-05-24T09:00:00Z"` — marketing plan rebuild
- Entry index 3: `"2026-05-24T14:00:00Z"` — algorithm upgrade
- Entry index 4: `"2026-05-24T17:00:00Z"` — pre-upload keyword fixes
- Entry index 5: `"2026-05-23T12:00:00Z"` — Stage 06.5 pre-launch ← one full day earlier than preceding entries

**Suggested fix:** Reorder the `agent_log` array so entries are in ascending timestamp order, placing the `2026-05-23T12:00:00Z` entry before the three `2026-05-24` entries.

---

### CHECK 3 — CONTRADICTION *(NEW — not flagged in 2026-08-02 audit)*
**stages["05-optimisation"].completed_at predates stages["04-quality"].completed_at**

- `stages["04-quality"].completed_at`: `"2026-05-21T09:15:00Z"`
- `stages["05-optimisation"].completed_at`: `"2026-05-14T16:01:00Z"`

Stage 05 (optimisation) shows a completion date of 14 May — seven days before stage 04 (quality) completed on 21 May. The pipeline requires stage 04 to complete before stage 05 begins. The note on stage 04 clarifies it was "Re-run after 2026-05-21 chapter expansion," but the stage 05 completion timestamp was never updated to reflect the re-run sequence.

**Suggested fix:** Either update `stages["05-optimisation"].completed_at` to a date at or after `2026-05-21T09:15:00Z` (reflecting the re-run sequence), or add an explanatory note confirming that stage 05 was re-verified against the expanded manuscript on or after 21 May.

---

### CHECK 5 — CONTRADICTION *(NEW — not flagged in 2026-08-02 audit)*
**production.cover_built = true but build_note states "cover_built=false"**

- `production.cover_built`: `true`
- `production.build_note`: *"...cover_built=false — blocked on human cover generation per COVER-BRIEF.md (sole remaining blocker)."*

The `cover_built` field was updated to `true` after Stage 06 was approved with the cover in place (per the agent_log entry: "Stage 06 final approval re-audit (cover in place, AI disclosure removed)") and `human_gates.cover_approved` is `true`. However, the `build_note` still contains the old status text ("cover_built=false") from before the cover was generated, creating a direct contradiction within the `production` block.

**Suggested fix:** Update `build_note` to remove the stale "cover_built=false" clause, or add a dated addendum noting when the cover was resolved (e.g., "Cover completed 2026-05-22 per Stage 06 re-audit.").

---

## BOOK 5 — the-dust-between-seconds

### CHECK 2 — CONTRADICTION *(persists from 2026-08-02)*
**writing.completed_chapters=1 inconsistent with agent_log and current_chapter**

- `writing.completed_chapters`: `1`
- `writing.approved_chapters`: `1`
- `writing.current_chapter`: `"04-chapter-4"`
- `agent_log` note (2026-04-29): *"Chapter 3 complete and approved. Resuming from Chapter 4."*

If Chapter 3 is complete and approved (as stated in the log), and the writer is on Chapter 4, then `completed_chapters` and `approved_chapters` should be at least 3.

**Suggested fix:** Set `writing.completed_chapters` and `writing.approved_chapters` to `3` to match the agent_log note. Verify against actual manuscript/ files on disk before updating.

---

## BOOK 6 — vagus-nerve-gut-reset-workbook

### CHECK 7 — CONTRADICTION *(persists from 2026-08-02)*
**last_updated is older than the three most recent agent_log entries**

- `last_updated`: `"2026-06-26T21:30:00Z"`
- Newest `agent_log` entry: `"2026-06-28T18:05:00Z"` — packaging-hygiene sync

Three agent sessions ran on 2026-06-28, none of which updated `last_updated`. The field has been stale for 43 days.

**Suggested fix:** Set `last_updated` to `"2026-06-28T18:05:00Z"` (timestamp of the final confirmed agent action).

---

### CHECK 3 — CONTRADICTION *(persists from 2026-08-02)*
**agent_log entries for 2026-06-19 are out of chronological order**

- Array index 4: `"2026-06-19T00:00:00Z"` — book scaffolded
- Array index 5: `"2026-06-19T23:50:00Z"` — Gate 5 PDF style test
- Array index 6: `"2026-06-19T01:00:00Z"` — Gate 3+4 ← should precede 23:50, not follow it

**Suggested fix:** Reorder to ascending: 00:00 (scaffolded) → 01:00 (Gate 3+4) → 23:50 (Gate 5).

---

## SUMMARY TABLE

| # | Book | Check | Severity | Status | Fields Involved |
|---|------|-------|----------|--------|-----------------|
| C1 | death-in-the-cathedral-close | CHECK 7 | Medium | Persists | `last_updated` vs `agent_log[0].timestamp` |
| C2 | death-in-the-cathedral-close | CHECK 2 | Medium | Persists | `current_stage=10`, `stages.08.not_started`, `stages.09.not_started` |
| C3 | death-in-the-cathedral-close | CHECK 5 | Low | Persists | `pdf_built=true` / `pdf_file` absent; `docx_built=true` / `docx_file` absent |
| C4 | fix-your-gut-for-good | CHECK 5 | Medium | Persists | `pdf_built=true` / `pdf_path=null`; `docx_built=true` / `docx_path=null` |
| C5 | fix-your-gut-for-good | CHECK 3 | Low | Persists | `stages.07-publishing.status=complete` / `completed_at=null` |
| C6 | h-pylori-recovery-plan | CHECK 2 | **CRITICAL** | Persists (week 4) | `published=true`, `kdp_status=live` (53 days), `current_stage=9`, `stages.10.not_started` |
| C7 | h-pylori-recovery-plan | CHECK 1 adj. | High | Persists | `published=true` / `launch_ready=false` |
| C8 | h-pylori-recovery-plan | CHECK 6 | Medium | **NEW** | `final_approval_score=113` (<270) while `final_approval_passed=true` |
| C9 | the-7-day-gut-reset | CHECK 3 | Low | Persists | `agent_log[5].timestamp=2026-05-23` after `agent_log[2-4].timestamp=2026-05-24` |
| C10 | the-7-day-gut-reset | CHECK 3 | Low | **NEW** | `stages.05-optimisation.completed_at=2026-05-14` before `stages.04-quality.completed_at=2026-05-21` |
| C11 | the-7-day-gut-reset | CHECK 5 | Low | **NEW** | `production.cover_built=true` / `build_note` says `"cover_built=false"` |
| C12 | the-dust-between-seconds | CHECK 2 | Medium | Persists | `completed_chapters=1` vs agent_log "Chapter 3 complete and approved" |
| C13 | vagus-nerve-gut-reset-workbook | CHECK 7 | Medium | Persists | `last_updated=2026-06-26` vs `agent_log[0].timestamp=2026-06-28` |
| C14 | vagus-nerve-gut-reset-workbook | CHECK 3 | Low | Persists | `agent_log[5].timestamp=23:50` before `agent_log[6].timestamp=01:00` same day |

**Total: 14 contradictions across 5 of 6 books.**

**Clean books: none.** cortisol-gut-health has no pipeline-state.json (book is pre-pipeline; excluded from audit scope).

**New this week (3):** C8 (h-pylori final_approval_score numeric mismatch), C10 (the-7-day stage ordering), C11 (the-7-day cover_built field vs build_note). All three are in books already carrying prior contradictions — no new books entered the dirty set.

**Most serious contradiction: C6** — h-pylori-recovery-plan (ASIN B0H5TZTPRT) has been live on Amazon since 2026-06-17 (53 days as of audit date) with `current_stage=9` and `stages["10-postlaunch"]="not_started"`. No post-launch BSR tracking, no review velocity monitoring, and no countdown deal scheduling is active for this actively selling title. This contradiction has now appeared in four consecutive weekly audit reports (first surfaced 2026-08-02) with no remediation. The Architect should treat this as the immediate priority.

**Trend note:** All 11 contradictions from the 2026-08-02 audit persist unresolved. This is the fourth consecutive week in which C6 appears. Escalation of C6 from "over 6 weeks live" (2026-08-02) to "53 days live" (2026-08-09) represents one additional week of post-launch blindness for a revenue-generating asset.

---

*Audit generated by automated Job 5. Read-only pass — no state files modified. Architect decides all fixes.*
