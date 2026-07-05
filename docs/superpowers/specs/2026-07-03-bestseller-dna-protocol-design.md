# Bestseller DNA Protocol — Design Spec

**Date:** 2026-07-03
**Requested by:** Architect — "top 10 bestsellers (1,000+ reviews) → find the gap → extract author DNA → blend, never mimic → implant into agents → then craft the book."
**Goal:** Every new book is engineered from the proven winners' DNA plus a differentiating gap — permanently built into the pipeline, not a one-off.

## The method (6 steps, codified)
1. **Top-10 roster** — the niche's top 10 bestsellers by review count (prefer 1,000+ reviews; live Amazon.com data only).
2. **Gap map** — what ALL of them leave open (from review complaints + coverage analysis). The entry wedge.
3. **DNA extraction** per book — title/subtitle formula, opening-hook style, structure (TOC / Look Inside), voice register, blurb craft, and the exact language readers use in PRAISE.
4. **DNA forge** — blend the cross-book patterns into an ORIGINAL author DNA. Hard rules: pattern-level only, never text-level; never imitate any single author; never reproduce phrasing; the forged DNA must name its differentiators vs each of the 10.
5. **Implant** — writers + copywriter + architect consume the forged DNA (blended with the Voice Bible) as a per-book input.
6. **Craft** — the book is written on top of it.

## Components

### C1 — Protocol reference (new)
`.claude/agents/01-research/BESTSELLER-DNA-PROTOCOL.md` — the method above in full operational detail, including the anti-mimicry rules and the output contract.

### C2 — Per-book output contract (new artifact, produced at Stage 01)
`books/<slug>/AUTHOR-DNA.md` with exact H2 sections:
`## Top-10 Roster` (each: title, author, review count, price, BSR — live-sourced) ·
`## Shared DNA Patterns` · `## Individual Standouts` · `## Reader Praise Language` (real quoted snippets, cited) ·
`## Gap Map` · `## Our Forged DNA` (the blend + named differentiators) · `## Copy DNA` (blurb/hook/title formulas, adapted not copied).

### C3 — Agent wiring (additive edits)
- **deep-market-intelligence-agent** — OWNS producing AUTHOR-DNA.md per the protocol (top-10 study, style extraction).
- **competitive-positioning-agent** — its review-mining feeds `## Gap Map` and `## Reader Praise Language`.
- **health-writer** — before drafting: read `books/<slug>/AUTHOR-DNA.md` if present; write from OUR Forged DNA blended with HEALTH-VOICE-BIBLE; NEVER imitate a single author or reproduce competitor phrasing.
- **conversion-copywriter-agent** — consume `## Copy DNA` + `## Reader Praise Language` for blurbs/hooks (mirror reader language, never competitor text).
- **book-architect** — structure informed by `## Shared DNA Patterns` + `## Gap Map`.
- **pipeline-orchestrator** — Stage 01 dispatch: require AUTHOR-DNA.md as a Stage 01 output; inject it into Stage 02+ briefs.

## Success criteria
- Protocol file exists with the 6 steps + anti-mimicry rules + output contract.
- All 6 agents reference the protocol/artifact (grep-verifiable).
- Frontmatters stay quoted; sync clean; 0 unparseable; smoke spawn passes.
- Rufus/COSMO alignment: praise-language capture feeds the semantic layer per ALGO-INTELLIGENCE v1.3 §18-19.

## Out of scope
Running the protocol on a niche (that's the next pipeline run); fiction/business writers (clone later, health first per slice-1 precedent).
