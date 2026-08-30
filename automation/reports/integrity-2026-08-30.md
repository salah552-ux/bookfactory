# BookFactory — State Integrity Audit
**Date:** 2026-08-30
**Auditor:** Automated (Job 5 — State Integrity Audit)
**Books scanned:** 6
**Header: 10 CONTRADICTIONS FOUND across 5 books (1 book CLEAN)**

---

## Summary Table

| Book | Contradictions |
|------|---------------|
| death-in-the-cathedral-close | 3 |
| fix-your-gut-for-good | 2 |
| h-pylori-recovery-plan | 2 |
| the-7-day-gut-reset | 2 |
| the-dust-between-seconds | **CLEAN** |
| vagus-nerve-gut-reset-workbook | 1 |

---

## Book 1 — `death-in-the-cathedral-close`

**Current stage:** 10 | **KDP status:** live | **Published:** true

### Check 1 — human_gates.published vs publishing.kdp_status
**PASS** — published=true, kdp_status="live". Consistent.

### Check 2 — current_stage vs stages map
**CONTRADICTION**
- `current_stage: 10`
- `stages["08-products"]: { "status": "not_started" }` — no explanation for skip
- `stages["09-series"]: { "status": "not_started" }` — no explanation for skip

A book at current_stage=10 (post-launch active) has two intermediate stages (08-products, 09-series) in `not_started` with no skip-rationale field or note in those stage objects. The pipeline jumped from stage 07 complete → current_stage 10, bypassing 08 and 09 silently.

**Suggested fix:** Either (a) add `"status": "skipped", "skip_reason": "..."` to stages 08 and 09, or (b) advance current_stage only if the skips are formally acknowledged in the stage entries.

### Check 3 — Chronological date order
**PASS** — live_date="2026-05-03" is after stage 07 completion (2026-05-03). Single weekly_log entry; no ordering issue. stage 07 started_at < completed_at.

### Check 4 — Gap flag vs implied resolution
**PASS** — `category_mismatch_flagged: true` with note confirming it is still open (pending user KDP login). `bookfunnel_gap_flagged: true` with no contradictory resolution note. Both flags are consistent with their notes.

### Check 5 — production.*_built vs file path
**CONTRADICTION**
- `production.pdf_built: true` but no `pdf_file` field exists in the production object (field is absent/null).
- `production.docx_built: true` but no `docx_file` field exists in the production object (field is absent/null).
- Only `epub_file` is present: `"exports/final/manuscript-kdp.epub"`.

**Suggested fix:** Add `"pdf_file"` and `"docx_file"` fields with the actual paths (e.g. `"exports/final/manuscript-kdp.pdf"`, `"exports/final/manuscript-kdp.docx"`), or set `pdf_built`/`docx_built` to false if the files were never confirmed.

### Check 6 — Numeric impossibilities
**PASS** — review_count=0, avg_rating=null (consistent). royalty_pct=70 (within 35/70). No negative counts.

### Check 7 — last_updated vs newest agent_log timestamp
**CONTRADICTION**
- `last_updated: "2026-05-28T00:00:00Z"`
- Newest agent_log entry timestamp: `"2026-06-02T00:00:00Z"` (Deal Day 1 BSR + category audit)

last_updated is 5 days older than the most recent agent_log entry. Two subsequent entries (2026-06-01, 2026-06-02) were appended without updating last_updated.

**Suggested fix:** Set `last_updated` to `"2026-06-02T00:00:00Z"` (or later if further work was done).

---

## Book 2 — `fix-your-gut-for-good`

**Current stage:** 10 | **KDP status:** live | **Published:** true

### Check 1 — human_gates.published vs publishing.kdp_status
**PASS** — published=true, kdp_status="live". Consistent.

### Check 2 — current_stage vs stages map
**CONTRADICTION**
- `current_stage: 10`
- `stages["09-series"]: { "status": "pending" }` — stage 09 is not complete

current_stage=10 implies post-launch is active, but the preceding stage (09-series) is only "pending" with no completion timestamp. The book advanced to stage 10 while stage 09 was never finished.

**Suggested fix:** Either (a) complete stage 09 (run series agents and mark complete) before advancing current_stage, or (b) explicitly document why stage 09 is being skipped or deferred, and update current_stage accordingly.

### Check 3 — Chronological date order
**PASS** — created_at="2026-04-13" < live_date="2026-04-21". No multi-entry weekly_log. No started_at/completed_at inversions.

### Check 4 — Gap flag vs implied resolution
**PASS** — bookfunnel_gap_flagged=true with no contradictory resolution note. Consistent.

### Check 5 — production.*_built vs file path
**CONTRADICTION**
- `production.pdf_built: true` but `production.pdf_path: null`
- `production.docx_built: true` but `production.docx_path: null`
- Note acknowledges: "Export files present in exports/final/ — exact paths not verified in this session."

The *_built flags assert existence but the path fields are null. This means no downstream agent can verify or reference those files by path.

**Suggested fix:** Populate `pdf_path` and `docx_path` with the verified file paths (e.g. `"books/fix-your-gut-for-good/exports/final/manuscript-kdp.pdf"`), or set the flags to false if paths were never confirmed.

### Check 6 — Numeric impossibilities
**PASS** — review_count=0, avg_rating=null (consistent). royalty_pct=70 (valid). Note: displayed US price $2.99 vs list_price_usd=9.99 — this discrepancy is flagged and explained in us_verification_evidence.notes (promotional/discount pricing); not a pipeline-state contradiction.

### Check 7 — last_updated vs newest agent_log timestamp
**PASS** — last_updated="2026-06-07T00:00:00Z", newest agent_log="2026-06-07T00:00:00Z". Same date; consistent.

---

## Book 3 — `h-pylori-recovery-plan`

**Current stage:** 9 | **KDP status:** live | **Published:** true (reconciled 2026-07-06)

### Check 1 — human_gates.published vs publishing.kdp_status
**PASS** — published=true, kdp_status="live". Consistent (reconciled from real-world observation).

### Check 2 — current_stage vs stages map
**CONTRADICTION**
- `current_stage: 9`
- `stages["09-series"]: { "status": "complete" }` — stage 09 is done
- `stages["10-postlaunch"]: { "status": "not_started" }` — stage 10 never opened
- `human_gates.published: true`, `publishing.kdp_status: "live"` — book is live on Amazon

The book is confirmed live on Amazon (ASIN B0H5TZTPRT, live_date 2026-06-17), but current_stage is still 9 and stage 10-postlaunch has never been opened. A live book should have current_stage=10 and stage 10-postlaunch in_progress.

**Suggested fix:** Set `current_stage: 10`, update `stages["10-postlaunch"]` to `{ "status": "in_progress", "started_at": "2026-06-17T00:00:00Z" }`, and invoke post-launch-tracker for this book.

### Check 3 — Chronological date order
**PASS** — created_at="2026-06-07" < live_date="2026-06-17". No weekly_log entries. stage 04 started_at="2026-06-11T00:00:00Z" < completed_at="2026-06-11T13:00:00Z". Consistent.

### Check 4 — Gap flag vs implied resolution
**CONTRADICTION**
- `human_gates.pre_launch_approved: false`
- `human_gates.published: true`, `publishing.kdp_status: "live"`

The book reached live status without pre_launch_approved ever being set to true. The pre-launch gate is a required human checkpoint before publishing, and it was never cleared. The lifecycle_note acknowledges the book was "published outside pipeline tracking," but the contradiction stands: the gate exists to prevent exactly this situation.

**Suggested fix:** Retrospectively set `pre_launch_approved: true` with a note recording the date and circumstance (book published without this gate — acknowledge as a known bypass), so the state accurately reflects reality for future audits.

### Check 5 — production.*_built vs file path
**PASS** — epub_built=true/epub_file set; pdf_built=true/pdf_file set; docx_built=true/docx_file set. All three file paths are populated.

### Check 6 — Numeric impossibilities
**PASS** — review_count=0, avg_rating=null (consistent). royalty_pct=70 (valid). Note: quality_scores.final_approval_score=113 — this records the book-reviewer (/120) score, not the final-approval-agent (/300) score. The INV-9 finding from the lifecycle_note (113<270) is a known acknowledged issue, not a new finding.

### Check 7 — last_updated vs newest agent_log timestamp
**PASS** — last_updated="2026-07-06T00:00:00Z", newest agent_log="2026-07-06T00:00:00Z". Same date; consistent.

---

## Book 4 — `the-7-day-gut-reset`

**Current stage:** 9 | **KDP status:** null | **Published:** false | **Lifecycle:** parked

### Check 1 — human_gates.published vs publishing.kdp_status
**PASS** — published=false, kdp_status=null. Consistent (not yet published).

### Check 2 — current_stage vs stages map
**PASS** — current_stage=9, stage 09-series is complete, stage 10 is "pending". Consistent with parked state. No unexplained stage skips — all earlier stages are complete.

### Check 3 — Chronological date order
**PASS** — created_at="2026-05-13" with no live_date. Single weekly_log entry in agent_log (not applicable). Agent_log entries are all before last_updated="2026-06-13". No inversions.

### Check 4 — Gap flag vs implied resolution
**CONTRADICTION**
- `stages["06.5-pre-launch"]: { "status": "complete", "completed_at": "2026-05-23T12:00:00Z" }` — stage notes: "Awaiting human gate pre_launch_approved before Stage 07"
- `stages["07-publishing"]: { "status": "complete", "completed_at": "2026-06-13T00:00:00Z" }`
- `stages["08-products"]: { "status": "complete" }`
- `stages["09-series"]: { "status": "complete" }`
- `human_gates.pre_launch_approved: false`

Stage 06.5 explicitly records that stage 07 was gated behind pre_launch_approved. Yet stages 07, 08, and 09 are all marked complete while pre_launch_approved remains false. The pipeline bypassed its own declared human gate. Three downstream stages claiming completion while their enabling gate is false is a direct contradiction of the pipeline contract.

**Suggested fix:** (a) Determine whether the Architect actually approved the pre-launch plan verbally/out-of-band. If yes, set pre_launch_approved=true with a backdated note. (b) If the gate was never met, stages 07-09 statuses must be revisited: they completed publishing prep work but not the full gate-qualified stage, and stage notes should clarify the partial nature of completion.

### Check 5 — production.*_built vs file path
**PASS** — epub_built=true/epub_path populated; pdf_built=true/pdf_path populated; docx_built=true/docx_path populated. All file paths are present.

### Check 6 — Numeric impossibilities
**PASS** — review_count=0 (no avg_rating field, implicitly null). final_approval_score=285 (valid /300). book_reviewer_avg=111.8 (valid /120). No negatives.

### Check 7 — last_updated vs newest agent_log timestamp
**PASS** — last_updated="2026-06-13T00:00:00Z". Newest agent_log: "2026-05-24T17:00:00Z". last_updated is later. Consistent.

---

## Book 5 — `the-dust-between-seconds`

**Current stage:** 3 | **KDP status:** not_started | **Published:** false | **Lifecycle:** parked

### Check 1 — human_gates.published vs publishing.kdp_status
**PASS** — published=false, kdp_status="not_started". Consistent.

### Check 2 — current_stage vs stages map
**PASS** — current_stage=3, stage 03-writing is "in_progress", stages 04-10 are "not_started". Fully consistent.

### Check 3 — Chronological date order
**PASS** — No live_date. stage 03 started_at="2026-04-30". No multi-entry weekly_log. No inversions.

### Check 4 — Gap flag vs implied resolution
**PASS** — No gap flags present.

### Check 5 — production.*_built vs file path
**PASS** — epub_built=false/epub_file=null; pdf_built=false/pdf_file=null; docx_built=false/docx_file=null. All consistent (nothing built yet).

### Check 6 — Numeric impossibilities
**PASS** — review_count=0, avg_rating=null (consistent). royalty_pct=null (not configured yet, book in early writing). No negatives.

### Check 7 — last_updated vs newest agent_log timestamp
**PASS** — last_updated="2026-05-01T00:00:00Z", newest agent_log="2026-04-29T00:00:00Z". last_updated is later. Consistent.

**CLEAN — No contradictions found.**

---

## Book 6 — `vagus-nerve-gut-reset-workbook`

**Current stage:** 6 | **KDP status:** not_started | **Published:** false

### Check 1 — human_gates.published vs publishing.kdp_status
**PASS** — published=false, kdp_status="not_started". Consistent.

### Check 2 — current_stage vs stages map
**PASS** — current_stage=6, stage 06-production is complete, stages 07-10 are not_started. Consistent — book is production-complete, awaiting upload gates.

### Check 3 — Chronological date order
**PASS** — created_at="2026-06-19", no live_date. No multi-entry weekly_log. Stage completed_at dates are consistent with their ordering.

### Check 4 — Gap flag vs implied resolution
**PASS** — No unresolved gap-flag contradictions. final_approval_passed_note references 289/300 while quality_scores.final_approval_score=291; this discrepancy is explicitly explained in quality_scores._rebuild_note as a superseded audit — acknowledged and documented.

### Check 5 — production.*_built vs file path
**PASS** — epub_built=true/epub_file set; pdf_built=true/pdf_file set; docx_built=true/docx_file set; cover_built=true/cover_file set. All paths populated.

### Check 6 — Numeric impossibilities
**PASS** — review_count=0, avg_rating=null (consistent). royalty_pct=70 (valid). list_price_gbp=null (book not yet published; acceptable at this stage).

### Check 7 — last_updated vs newest agent_log timestamp
**CONTRADICTION**
- `last_updated: "2026-06-26T21:30:00Z"`
- Newest agent_log entry timestamp: `"2026-06-28T18:05:00Z"` (PACKAGING-HYGIENE SYNC run)

last_updated is approximately 45 hours older than the most recent agent_log entry. Three agent_log entries from 2026-06-28 were appended without updating last_updated.

**Suggested fix:** Set `last_updated` to `"2026-06-28T18:05:00Z"` (timestamp of the most recent agent_log entry).

---

## Cross-Book Notes

- **The most serious contradiction** is in `h-pylori-recovery-plan`: the book is LIVE on Amazon (ASIN B0H5TZTPRT, live since 2026-06-17 — now 74 days post-live as of today) with no post-launch stage active (`stage 10-postlaunch: not_started`, `current_stage: 9`). This means BSR, review velocity, KU pages, and ad performance have not been tracked by the pipeline for the entire post-launch window. The 90-day post-launch monitoring period is nearly expired with zero data collected.

- **The pre_launch_approved gate bypass** in `the-7-day-gut-reset` (stages 07-09 complete while gate is false) is the second most serious, as it means the quality chain for publishing prep cannot be audited cleanly — the gate that certifies pre-launch readiness was never set.

---

## Action Required (for Architect — do not auto-fix)

| Priority | Book | Fields | Action |
|----------|------|--------|--------|
| CRITICAL | h-pylori-recovery-plan | current_stage, stages["10-postlaunch"], post_launch | Advance to stage 10, open post-launch tracking immediately — 74 days live with no pipeline tracking |
| HIGH | the-7-day-gut-reset | human_gates.pre_launch_approved, stages 07-09 | Resolve gate bypass: confirm or deny pre_launch approval and reconcile stage statuses |
| HIGH | h-pylori-recovery-plan | human_gates.pre_launch_approved | Retrospectively acknowledge gate bypass with note |
| MEDIUM | death-in-the-cathedral-close | last_updated | Update to 2026-06-02T00:00:00Z (newest agent_log) |
| MEDIUM | vagus-nerve-gut-reset-workbook | last_updated | Update to 2026-06-28T18:05:00Z (newest agent_log) |
| MEDIUM | death-in-the-cathedral-close | production.pdf_file, production.docx_file | Add missing path fields for pdf_built and docx_built |
| MEDIUM | fix-your-gut-for-good | production.pdf_path, production.docx_path | Populate null paths for pdf_built and docx_built |
| LOW | death-in-the-cathedral-close | stages["08-products"], stages["09-series"] | Add skip reason or set status to "skipped" with rationale |
| LOW | fix-your-gut-for-good | stages["09-series"], current_stage | Complete stage 09 or document deferral; reconcile current_stage |
