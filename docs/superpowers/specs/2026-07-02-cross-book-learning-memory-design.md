# Cross-Book Learning Memory — Design Spec

**Date:** 2026-07-02
**Slice:** 4 #2 (Agent brains, phased 1→2→3; #1 model audit done in 2555d73)
**Goal:** Books stop starting cold. Every completed book leaves lessons; every new book starts with them.

## Design
One portfolio-level living document, mirroring the proven ALGO-INTELLIGENCE.md pattern:

**File:** `intelligence/LESSONS.md`
- Sections: `## Market & Positioning`, `## Writing & Voice`, `## Covers & Design`, `## Publishing & KDP`, `## Launch & Marketing`, `## Mistakes — Never Repeat`.
- Every entry: dated, names the source book (slug), and cites its evidence (a real event, review quote, KDP outcome, or report). **No invented claims/numbers** — if there's no evidence, it's not a lesson.
- Append-only per entry; entries may be superseded (mark, don't delete) — same versioning ethos as ALGO-INTELLIGENCE.md.

**Readers (before work):** pipeline-orchestrator adds "read intelligence/LESSONS.md" to EVERY agent brief it sends (one edit in its briefing template — instantly covers all 55 agents).

**Writers (after work):** the orchestrator appends lessons at two moments: (a) when it closes any stage where something notable happened (a failure fixed, a gate rejection, a strong win), and (b) at Stage 10 post-launch reviews (real BSR/review evidence). book-reviewer may also flag "lesson candidates" in its reports for the orchestrator to record.

**Seed content:** mined from the 4 real books' history (AGENT-LOGs, pipeline states, KDP outcomes) — e.g., the KDP "Blank Journal" rejection of fill-in workbooks → prose conversion lesson; DRM-enabled series norm; KU enrollment norm; cover psychology pass criteria; the registry/YAML quoting bug class.

## Files touched
- NEW: `intelligence/LESSONS.md` (seeded from real history)
- EDIT: `.claude/agents/00-coordinator/pipeline-orchestrator.md` — add `## Lessons Memory Protocol` (read-inject + append rules)
- Then: re-run sync, parse check, smoke test.

## Success criteria
- LESSONS.md exists with the 6 sections and only evidence-backed, dated, book-attributed entries.
- Orchestrator prompt instructs: inject LESSONS.md into every brief; append lessons at stage-close/post-launch; never invent evidence.
- Sync clean, 0 unparseable, orchestrator still spawns.

## Out of scope
Per-agent bespoke memory files; automated metric ingestion; slices 2 and 4 #3.
