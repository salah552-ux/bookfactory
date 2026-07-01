# Health Book Quality Upgrade — Design Spec

**Date:** 2026-07-01
**Slice:** Book Quality (slice 1 of the system overhaul)
**Scope:** Health/gut genre first (`health-writer` + `book-reviewer`), then clone the pattern to other genres later.
**Goal:** Lift health-book quality across all 4 problem axes with NO new pipeline steps and NO extra per-book cost.

## The 4 quality axes this must fix
1. **AI-sound** — generic, hedged, "ChatGPT voice."
2. **Research** — claims too shallow / not credibly sourced.
3. **Voice & hooks** — flat openings/closings, boring stretches.
4. **Drift** — voice or facts change across chapters.

## Chosen approach
Combo of "sharpen the agents" + "shared reference asset." Three components:

### Component 1 — Health Voice Bible (new shared reference)
**File:** `.claude/agents/03-writing/HEALTH-VOICE-BIBLE.md`
Single source of truth that BOTH the writer and reviewer read. Contents:
- **Anti-AI ban list** — explicit banned phrases/patterns: "it's important to note", "in today's world",
  "delve", "navigate the complexities", "when it comes to", reflexive hedging, uniform paragraph shapes,
  em-dash overuse, tricolon spam, empty topic sentences.
- **Voice standards** — warm, plain, direct, second-person; deliberate sentence-length variety;
  concrete over abstract; no filler transitions.
- **Exemplar patterns** — how strong health authors open a chapter, explain a mechanism, and close on a
  hook. Patterns/descriptions only (no copyrighted text pasted).
- **Research rule** — every factual/physiological claim must map to a real, named source; early-evidence
  (animal/pilot) must be labeled as such.

### Component 2 — `health-writer` upgrade
**File:** `.claude/agents/03-writing/health-writer.md`
- MUST read `HEALTH-VOICE-BIBLE.md` + the book's `FACTS.md`/`BLUEPRINT.md` before drafting.
- Every chapter: a real hook on the **first** and **last** paragraph.
- Every claim: cite a real named source (pulled from RESEARCH.md/FACTS.md; no invented studies).
- Before returning: self-check the draft against the ban list; fix any hit.
- Preserve existing genre/format behavior; this is additive tightening, not a rewrite of its job.

### Component 3 — `book-reviewer` upgrade
**File:** `.claude/agents/04-quality/book-reviewer.md`
- Extend the scoring rubric with an explicit **4-axis quality gate**: AI-sound, research credibility,
  voice/hook strength, cross-chapter continuity/drift.
- Each axis has a floor. **Any axis below floor = BLOCK** → return to writer with exact, quoted fixes
  (not vague notes).
- Keep the existing minimum (96/120) AND require all 4 axis floors to pass.
- Reviewer reads `HEALTH-VOICE-BIBLE.md` so writer and reviewer judge against the same standard.

## Flow (unchanged pipeline)
`brief-validator → health-writer (reads Bible) → fact-checker + book-reviewer (4-axis gate) →
compliance-officer → save`. No new agents, no new stages, no extra cost per book. The only additions are
one reference file and tighter prompts in two existing agents.

## Files touched
- NEW: `.claude/agents/03-writing/HEALTH-VOICE-BIBLE.md`
- EDIT: `.claude/agents/03-writing/health-writer.md`
- EDIT: `.claude/agents/04-quality/book-reviewer.md`
- After edits: re-run `scripts/sync-agents-to-user.py` so the user-level copies update.

## Success criteria
- A fresh health chapter drafted under the new setup contains 0 ban-list hits and a hook on the
  first + last paragraph.
- `book-reviewer` output shows an explicit score for each of the 4 axes and blocks when any is below floor.
- Every factual claim in the chapter traces to a named source.
- Writer and reviewer both cite the Voice Bible as their standard.

## Out of scope (later slices)
- Non-health genres (fiction/business/mystery) — clone the pattern after health proves out.
- New "humanizer" pass agent (approach 2) — not needed if the combo hits the bar.
- Automation / digital-assets / agent-brains slices (separate specs).

## Open risks
- Ban lists can be gamed (writer avoids listed phrases but stays generic) → the Bible must define
  positive voice standards + exemplars, not only a blocklist.
- Over-blocking could stall the pipeline → axis floors set to "clearly failing," not "perfectionist."
