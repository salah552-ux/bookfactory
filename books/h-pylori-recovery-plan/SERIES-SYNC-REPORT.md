# Series Sync Report
Date: 2026-06-11
Series: Fix Your Gut for Good (non-fiction / health)
Agent: series-sync-agent (run by master-orchestrator, Stage 09)
Books in series: 3
Books published (live on Amazon): 1 — Fix Your Gut for Good: Stop Relapsing (ASIN B0GXYLWS1W)
Books in pipeline: 2 — The 7-Day Gut Reset (Stage 6.5, not live) · The H. Pylori Recovery Plan (held at publish gate)

> **MANDATORY SCOPE NOTE:** Books 1 and 2 are NOT to be edited in this run. Book 1 is a LIVE KDP Select title (a back-matter change requires an EPUB rebuild + re-upload). Book 2 is built but unpublished. This report DOCUMENTS the exact edits required and stages the paste-ready copy; it applies nothing to those two books. Only the series master record and Book-3 folder were touched.

---

## CONTRADICTIONS (must fix before publication)

**None.** No statistical, terminological, or causal-language contradiction between Book 3 and the canon. (Full detail in `SERIES-CONTINUITY-2026-06-11.md`.) Prevalence, mechanism, and causal-language framing all reconcile across Book 1 ↔ Book 3.

---

## PREMATURE REFERENCES (books referenced that are not live)

### PR1 — Book 3 cross-sells *The 7-Day Gut Reset*, which is not live
- **File:** `books/h-pylori-recovery-plan/manuscript/11-chapter-10.md:67` and `99-back-matter.md:53`
- **References:** "*The 7-Day Gut Reset* — the shorter, more diagnostic guide..."
- **Status:** *The 7-Day Gut Reset* is at Stage 6.5, `published: false`, no ASIN.
- **Action:** Do NOT edit Book 3 yet. Resolve by publication ordering — publish Book 2 before/with Book 3 (preferred; see continuity report M1). If Book 3 must ship first, downgrade the Book 2 mention to coming-soon language before Book 3's first upload (Book 3 is not yet live, so this edit is permitted then). Tracked, not applied.

No premature reference to Book 3 exists in any LIVE book (Book 1 does not mention H. pylori-the-book — correct, since Book 3 is not live). ✓

---

## "ALSO BY" UPDATES NEEDED (staged — DO NOT APPLY to live/unpublished books yet)

### Book 1 — *Fix Your Gut for Good: Stop Relapsing* (LIVE)
**Current state:** No "Also by" block exists. The conclusion (`11-conclusion.md:64`) ends with an orphaned forward-reference to a non-existent "doctor relationship" book.
**Required when siblings are live (requires EPUB rebuild + KDP re-upload — author-approval action):**

Paste-ready block, to be inserted in the back matter after the review CTA, before the author bio. **Only list titles that are actually live at the moment of the re-upload.** Versions:

**Version A — once The 7-Day Gut Reset is live (Book 3 not yet live):**
```
Also by S.A. Ibrahim

The Fix Your Gut for Good series:
• Fix Your Gut for Good: Stop Relapsing — the root-cause SIBO guide
• The 7-Day Gut Reset — the short, diagnostic reset to find your trigger

More titles coming in the Fix Your Gut for Good series.
```

**Version B — once both The 7-Day Gut Reset AND The H. Pylori Recovery Plan are live:**
```
Also by S.A. Ibrahim

The Fix Your Gut for Good series:
• Fix Your Gut for Good: Stop Relapsing — the root-cause SIBO guide
• The 7-Day Gut Reset — the short, diagnostic reset to find your trigger
• The H. Pylori Recovery Plan — clear the infection, heal the lining, understand the cancer risk

More titles coming in the Fix Your Gut for Good series.
```
Also retarget the orphaned conclusion line (`11-conclusion.md:64`, "The next book addresses the doctor relationship...") to point at the real next book, in the same re-upload.

### Book 2 — *The 7-Day Gut Reset* (built, not live)
**Current state:** Cross-sells *Fix Your Gut for Good* in the conclusion (`08-conclusion.md:32`) and About-the-Author (`09-about-author.md`). No "Also by" block, no mention of Book 3.
**Required before Book 2's first upload (permitted — Book 2 is not yet live):** add an "Also by" block. Only list Book 3 if Book 3 is live at Book 2's upload time.

```
Also by S.A. Ibrahim

The Fix Your Gut for Good series:
• Fix Your Gut for Good: Stop Relapsing — the root-cause SIBO guide
• The 7-Day Gut Reset — the short, diagnostic reset to find your trigger
• The H. Pylori Recovery Plan — clear the infection, heal the lining, understand the cancer risk   ← include ONLY if Book 3 is live

More titles coming in the Fix Your Gut for Good series.
```

### Book 3 — *The H. Pylori Recovery Plan* (held at publish gate)
**Current state:** Back matter (`99-back-matter.md:47–57`) already has a full "Also by" section naming *The 7-Day Gut Reset* and *Fix Your Gut for Good* by exact title. ✓
**Required:** No change needed for exact-title or voice. Only the PR1 timing caveat applies (gate the *7-Day Gut Reset* mention on Book 2 being live, via publication ordering). No edit applied this run.

---

## DESIGN DRIFT

No design comparison performed against live files this run (out of Stage-09 scope; Book 3 design was locked and PASSED at Stage 06 against the series spec — Playfair Display / #1b3a5c navy / #c8b99a blockquote border). No drift flagged. ✓

---

## CONSISTENCY ERRORS (author name, formatting)

### CE1 — Author-name form drift in sync templates
- The 2026-05-31 SERIES-SYNC-REPORT and SERIES-FACTS "Also by" template use **"S. A. Ibrahim"** (with spaces).
- Book 3 and the live Book 1 copyright page use **"S.A. Ibrahim"** (no space) — the proofreader-locked series standard.
- **Action (autonomy: name-format normalisation permitted):** all "Also by" copy in THIS report uses the correct **S.A. Ibrahim** (no space). Any older template must be normalised before paste. No live file edited.

---

## SYNC ACTIONS TAKEN (this session)

- Updated `BookFactory/SERIES-FACTS.md`: added the SERIES MASTER RECORD (authoritative publication status), Book 3 H. pylori series-level statistics, the RECURRING TROPES / series-conventions section, and annotated the stale "H. pylori = Book 5 planned" conditions-table entry.
- Created `books/h-pylori-recovery-plan/SERIES-KEYWORD-REALITY.md` in its no-data placeholder form (see Keyword Performance Handoff below).
- Created `.claude/agent-memory/series-sync-agent/SYNC-FEEDBACK.md` and appended this run's findings.
- Staged (did not apply) all "Also by" blocks for Books 1 and 2.

## CHANGES REQUIRING AUTHOR APPROVAL (not applied)

- Adding the "Also by" block + retargeting the orphaned forward-reference in **Book 1** → requires EPUB rebuild + KDP re-upload of the live title. Batch with the next Book 1 listing refresh.
- Adding the "Also by" block to **Book 2** → apply at Book 2's own publishing stage (it is not live yet).
- Gating Book 3's *7-Day Gut Reset* cross-sell on publication order → orchestrator/Architect decision (publish Book 2 first, preferred).

---

## KEYWORD PERFORMANCE HANDOFF

Status: **SERIES-KEYWORD-REALITY.md created in no-data placeholder form — NOT populated with inferences.**
File location: `books/h-pylori-recovery-plan/SERIES-KEYWORD-REALITY.md` (series-slug folder; placed in the active Book-3 folder for this series run).
Reason not populated: the only live book (Book 1) has `post_launch.weekly_log: []`, `review_count: 0`, and LAUNCH-TRACKER baseline only — **no real BSR / subcategory / review data has been logged.** Per the agent's own rule and the No-Assumptions lock, keyword-performance inferences must trace to observable data; none exists. Inventing any would violate Rule 1. The file will be populated when Book 1 (or any live book) accumulates 4+ weeks of real dashboard data.
Live books with data included: none (no data available).
New keyword candidates surfaced: none (no review corpus yet).
Keywords disqualified: none (no data).

---

## SERIES HEALTH SCORE

- Facts consistency: 3/3 books clean (no contradictions)
- Cross-references: 1 premature (Book 3 → not-yet-live Book 2) — ordering-dependent, content correct
- Design consistency: Book 3 locked to series spec (PASS at Stage 06); no live-file drift check this run
- Author name: standard is S.A. Ibrahim (no space); template drift flagged, no live-file error
- Disclaimers: Book 3 compliant; series medical-disclaimer standard met
- SERIES-KEYWORD-REALITY.md: created (no-data placeholder — awaiting real launch data)

**Overall: YELLOW** — canon is clean and Book 3 is continuity-approved, but the series cannot present a complete live cross-sell funnel until Book 2 publishes, and Book 1's live back matter still lacks an "Also by" block. Both are known, staged, and ordering-dependent — not defects in Book 3.

---

*Run by master-orchestrator (Opus) acting as series-sync-agent, Stage 09. Nothing applied to live or unpublished sibling books. All cross-sell copy uses exact titles. Zero invented numbers. — 2026-06-11*
