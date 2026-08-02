# BookFactory State Integrity Audit — 2026-08-02

**11 contradictions found across 5 books.**

Audit scope: 6 books × 7 checks. Run date: 2026-08-02 (automated Job 5).
Read-only pass — no pipeline-state.json files modified.

---

## BOOK 1 — death-in-the-cathedral-close

### CHECK 7 — CONTRADICTION
**last_updated older than newest agent_log timestamp**

- `last_updated`: `2026-05-28T00:00:00Z`
- Newest `agent_log` entry timestamp: `2026-06-02T00:00:00Z` (Deal Day 1 BSR audit)

The top two agent_log entries (2026-06-02 and 2026-06-01) both post-date last_updated by 4–5 days. The field was never refreshed after the June countdown deal session.

**Suggested fix:** Set `last_updated` to `2026-06-02T00:00:00Z` (date of the last confirmed agent run).

---

### CHECK 2 — CONTRADICTION
**current_stage=10 but stages 08 and 09 are not_started with no skip explanation**

- `current_stage`: `10`
- `stages["08-products"]`: `not_started`
- `stages["09-series"]`: `not_started`
- `stages["10-postlaunch"]`: `in_progress`

Post-launch (stage 10) is in_progress but the digital products stage (08) and series stage (09) have never been started and carry no "skipped" or "n/a" designation. The pipeline rules require earlier stages to complete before later ones open. If these stages are intentionally skipped for the Cathedral Close series (e.g., products deferred to after Book 2), that decision must be recorded.

**Suggested fix:** Either set `stages["08-products"].status` and `stages["09-series"].status` to `"skipped"` with a `skip_reason` note, or advance them to at least `in_progress` if work is planned.

---

### CHECK 5 — CONTRADICTION
**production.pdf_built and production.docx_built are true but no path fields exist**

- `production.epub_built`: `true` — `epub_file`: `"exports/final/manuscript-kdp.epub"` ✓ present
- `production.pdf_built`: `true` — `pdf_file`: **field absent** (not null — entirely missing)
- `production.docx_built`: `true` — `docx_file`: **field absent** (not null — entirely missing)

The EPUB path was recorded but PDF and DOCX paths were never added to the production block, making it impossible to verify those build outputs without manual inspection.

**Suggested fix:** Add `"pdf_file": "exports/final/manuscript-kdp.pdf"` and `"docx_file": "exports/final/manuscript-kdp.docx"` (or the actual filenames on disk) to the `production` block, or set to `null` if those builds cannot be confirmed.

---

## BOOK 2 — fix-your-gut-for-good

### CHECK 5 — CONTRADICTION
**production.pdf_built and production.docx_built are true but paths are null**

- `production.pdf_built`: `true` — `pdf_path`: `null`
- `production.docx_built`: `true` — `docx_path`: `null`
- `production.epub_built`: `true` — `epub_path`: `"books/fix-your-gut-for-good/exports/final/manuscript-kdp.epub"` ✓ present

The build note acknowledges: *"Export files present in exports/final/ — exact paths not verified in this session."* This confirms the paths were never confirmed. For a live book (ASIN B0GXYLWS1W, kdp_status=live), unverified production paths are a risk — if exports were accidentally deleted or not committed, there is no recorded canonical path to restore from.

**Suggested fix:** Verify exports/final/ on disk, then populate `pdf_path` and `docx_path` with the confirmed file paths.

---

### CHECK 3 (adjacent) — CONTRADICTION
**stages["07-publishing"].status = "complete" but completed_at = null**

- `stages["07-publishing"].status`: `"complete"`
- `stages["07-publishing"].completed_at`: `null`

A stage marked complete with no completion timestamp breaks the audit trail — quality-gate checks and date-ordering checks cannot operate on it.

**Suggested fix:** Set `completed_at` to the known live_date `"2026-04-21T00:00:00Z"` (the date the book went live, which is the logical close of stage 07).

---

## BOOK 3 — h-pylori-recovery-plan

### CHECK 2 — CONTRADICTION (MOST SERIOUS)
**Book is live (published=true, kdp_status=live) but current_stage=9 and stage 10 is not_started**

- `human_gates.published`: `true` (reconciled 2026-07-06)
- `publishing.kdp_status`: `"live"`
- `publishing.live_date`: `"2026-06-17"`
- `current_stage`: `9`
- `stages["10-postlaunch"].status`: `"not_started"`

The book has been live on Amazon since 17 June 2026 — over 6 weeks as of audit date. The state reconciliation on 2026-07-06 set the live/published fields correctly but explicitly left `current_stage` and stage 10 unchanged. As a result, the pipeline believes this book is pre-launch (stage 09) when it is actively selling. No post-launch metrics (BSR, reviews, KU pages, ads) are being tracked for this book.

This is the single most operationally dangerous contradiction in the system: a live book with no active post-launch monitoring.

**Suggested fix:** Set `current_stage` to `10`, set `stages["10-postlaunch"].status` to `"in_progress"` with `started_at: "2026-06-17T00:00:00Z"`, and run post-launch-tracker to begin metrics logging.

---

### CHECK 1 (adjacent) — CONTRADICTION
**human_gates.published=true but pre_launch.launch_ready=false**

- `pre_launch.launch_ready`: `false`
- `human_gates.published`: `true`
- `pre_launch.open_items`: `["Recruit ARC cohort to >=20 commitments ..."]` (still open)

The book was published (outside pipeline tracking, per the reconciliation note) without the `launch_ready` gate ever being cleared. The gate exists precisely to prevent cold launches. ARC cohort was never recruited (arc_readers_confirmed=0), and the listing audit has not passed (`listing_audit_passed: false`).

**Suggested fix:** Either retroactively document why these gates were bypassed and set `launch_ready: true` with an explanation note, or flag as a known gap requiring remediation (e.g., belated ARC outreach, listing audit).

---

## BOOK 4 — the-7-day-gut-reset

### CHECK 3 — CONTRADICTION
**agent_log entries are out of chronological order**

The `agent_log` array contains an entry whose timestamp is earlier than the entries immediately preceding it in the array:

- Entry index 2 (array position): `"2026-05-24T09:00:00Z"` — marketing plan rebuild
- Entry index 3: `"2026-05-24T14:00:00Z"` — algorithm upgrade
- Entry index 4: `"2026-05-24T17:00:00Z"` — pre-upload keyword fixes
- Entry index 5: `"2026-05-23T12:00:00Z"` — Stage 06.5 pre-launch quartet ← **one full day earlier than the three preceding entries**

The Stage 06.5 entry (2026-05-23) was appended after three 2026-05-24 entries, breaking ascending date order. This means the log cannot be read chronologically as-is.

**Suggested fix:** Reorder the `agent_log` array so entries are in ascending timestamp order, placing the `2026-05-23T12:00:00Z` entry before the three `2026-05-24` entries.

---

## BOOK 5 — the-dust-between-seconds

### CHECK 2 — CONTRADICTION
**writing.completed_chapters=1 inconsistent with agent_log and current_chapter**

- `writing.completed_chapters`: `1`
- `writing.approved_chapters`: `1`
- `writing.current_chapter`: `"04-chapter-4"`
- `agent_log` note (2026-04-29): *"Chapter 3 complete and approved. Resuming from Chapter 4."*

If Chapter 3 is complete and approved (as stated in the log), and the writer is now on Chapter 4, then `completed_chapters` and `approved_chapters` should be at least 3. A value of 1 for both contradicts the logged narrative and the `current_chapter` pointer.

**Suggested fix:** Set `writing.completed_chapters` and `writing.approved_chapters` to `3` to match the agent_log note ("Chapter 3 complete and approved"). Verify against actual manuscript/ files on disk before updating.

---

## BOOK 6 — vagus-nerve-gut-reset-workbook

### CHECK 7 — CONTRADICTION
**last_updated is older than the three most recent agent_log entries**

- `last_updated`: `"2026-06-26T21:30:00Z"`
- agent_log entry 1 (newest): `"2026-06-28T18:05:00Z"` — packaging-hygiene sync
- agent_log entry 2: `"2026-06-28T17:38:00Z"` — cover-warning resolution
- agent_log entry 3: `"2026-06-28T00:00:00Z"` — build-metadata fix

Three agent sessions ran on 2026-06-28, all of which should have updated `last_updated`. The field was last set on 2026-06-26 and was never refreshed during the 2026-06-28 runs despite those runs writing to `agent_log` and modifying files.

**Suggested fix:** Set `last_updated` to `"2026-06-28T18:05:00Z"` (timestamp of the final confirmed agent action).

---

### CHECK 3 — CONTRADICTION
**agent_log entries for 2026-06-19 are out of chronological order**

Within the `agent_log` array entries for 2026-06-19:

- Array index 4: `"2026-06-19T00:00:00Z"` — book scaffolded
- Array index 5: `"2026-06-19T23:50:00Z"` — Gate 5 PDF style test
- Array index 6: `"2026-06-19T01:00:00Z"` — Gate 3 + Gate 4 ← **01:00 should precede 23:50, not follow it**

Gate 3+4 (01:00) was appended after Gate 5 (23:50) even though it occurred 22 hours earlier the same day. Not a critical integrity issue, but breaks the audit trail for Stage 00 gate sequence.

**Suggested fix:** Reorder these three entries to ascending order: 00:00 (scaffolded) → 01:00 (Gate 3+4) → 23:50 (Gate 5).

---

## SUMMARY TABLE

| # | Book | Check | Severity | Fields Involved |
|---|------|-------|----------|-----------------|
| C1 | death-in-the-cathedral-close | CHECK 7 | Medium | `last_updated` vs `agent_log[0].timestamp` |
| C2 | death-in-the-cathedral-close | CHECK 2 | Medium | `current_stage=10`, `stages.08.not_started`, `stages.09.not_started` |
| C3 | death-in-the-cathedral-close | CHECK 5 | Low | `pdf_built=true` / `pdf_file` absent; `docx_built=true` / `docx_file` absent |
| C4 | fix-your-gut-for-good | CHECK 5 | Medium | `pdf_built=true` / `pdf_path=null`; `docx_built=true` / `docx_path=null` |
| C5 | fix-your-gut-for-good | CHECK 3 | Low | `stages.07-publishing.status=complete` / `completed_at=null` |
| C6 | h-pylori-recovery-plan | CHECK 2 | **CRITICAL** | `published=true`, `kdp_status=live`, `current_stage=9`, `stages.10.not_started` |
| C7 | h-pylori-recovery-plan | CHECK 1 adj. | High | `published=true` / `launch_ready=false` |
| C8 | the-7-day-gut-reset | CHECK 3 | Low | `agent_log[5].timestamp=2026-05-23` after `agent_log[2-4].timestamp=2026-05-24` |
| C9 | the-dust-between-seconds | CHECK 2 | Medium | `completed_chapters=1` vs agent_log "Chapter 3 complete and approved" |
| C10 | vagus-nerve-gut-reset-workbook | CHECK 7 | Medium | `last_updated=2026-06-26` vs `agent_log[0-2].timestamp=2026-06-28` |
| C11 | vagus-nerve-gut-reset-workbook | CHECK 3 | Low | `agent_log[5].timestamp=23:50` before `agent_log[6].timestamp=01:00` same day |

**Total: 11 contradictions across 5 of 6 books.**

**Clean books: none** (all 6 books have at least one flag; the-dust-between-seconds has the fewest with 1).

**Most serious contradiction: C6** — h-pylori-recovery-plan is live on Amazon (ASIN B0H5TZTPRT, since 2026-06-17, 46 days ago as of audit date) but its pipeline state shows `current_stage=9` with `stages["10-postlaunch"]="not_started"`. This means no post-launch BSR tracking, no review velocity monitoring, and no countdown deal scheduling is active for an actively selling title. The Architect should treat this as the immediate remediation priority.

---

*Audit generated by automated Job 5. Read-only pass — no state files modified. Architect decides all fixes.*
