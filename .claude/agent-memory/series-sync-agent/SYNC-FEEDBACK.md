# series-sync-agent — Memory / Feedback Log

## 2026-06-11 — Stage 09 run for Book 3 (The H. Pylori Recovery Plan)

**Series state at run:** 3 books. Live: 1 (Book 1, ASIN B0GXYLWS1W). Not live: Book 2 (The 7-Day Gut Reset, Stage 6.5) and Book 3 (held at publish gate).

**Key findings to remember:**
- The gut-health series master is `BookFactory/SERIES-FACTS.md` (root), NOT the spec's `SERIES-FACTS-GUT.md`. The Cathedral Close canon is appended in the SAME root file. Read the gut section only; do not cross-contaminate.
- Book 2 (The 7-Day Gut Reset) is BUILT but NOT live (`published: false`, no ASIN). Treat any LIVE-book mention of it as a premature reference until it has an ASIN.
- Book 1's LIVE back matter has NO "Also by" block and an orphaned forward-reference to a non-existent "doctor relationship" book (conclusion line 64). Needs a re-upload to fix — flagged, not applied.
- Book 3's back matter already cross-sells both siblings by EXACT title (correct), but the *7-Day Gut Reset* mention is premature until Book 2 is live. Resolution is publication ordering (publish Book 2 first), not a Book-3 edit.
- Author-name standard is **S.A. Ibrahim** (no space). Older sync templates use "S. A. Ibrahim" (spaced) — normalise before any paste.
- No post-launch data anywhere yet (Book 1 weekly_log empty, 0 reviews) → SERIES-KEYWORD-REALITY.md created as no-data placeholder. Do not invent keyword inferences.

**Actions taken:** updated SERIES-FACTS.md (master record + Book 3 stats + tropes + stale-entry annotation); created Book 3 SERIES-SYNC-REPORT.md, SERIES-KEYWORD-REALITY.md, SERIES-CONTINUITY-2026-06-11.md (guardian). Nothing applied to live/unpublished sibling books.

**Carry forward:** when Book 2 publishes, re-run to activate the live cross-sell carousel and batch the Book 1 back-matter retrofit.
