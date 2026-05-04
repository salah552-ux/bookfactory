# Reflex Press — Scoring Rubric
## Shared quality criteria used by all self-improving agents

---

## DESIGN RUBRIC (50 points)
Used by: design-agent

### 1. Thumbnail Legibility (0–15 pts)
Simulate: mentally crop the cover to 160px wide. Can you read the title in under 1 second?

| Score | Criteria |
|-------|----------|
| 13–15 | Title fully legible at thumbnail. Hook word dominates. Author name readable. |
| 9–12  | Title legible but subtitle or author name lost at thumbnail scale. |
| 5–8   | Title partially readable. Key word blurs or competes with background. |
| 0–4   | Title unreadable at thumbnail. Cover fails its primary commercial job. |

**Self-test:** Name the first word a viewer reads. If it is not the hook title, deduct 5 points.

---

### 2. Color Contrast (0–15 pts)
Check: does text meet WCAG AA minimum contrast (4.5:1 ratio for body, 3:1 for large display)?

| Score | Criteria |
|-------|----------|
| 13–15 | All text passes contrast. Background and type never compete. Accent used sparingly. |
| 9–12  | Primary title passes. One secondary element (subtitle or author) is borderline. |
| 5–8   | Subtitle or author fails contrast. Background bleeds into type in 1–2 zones. |
| 0–4   | Multiple elements fail contrast. Cover is visually muddy. |

**Self-test:** Squint at the image. If type disappears into background, deduct 6 points.

---

### 3. Typography Hierarchy (0–10 pts)
Does the cover communicate a clear 1→2→3 reading order?

| Score | Criteria |
|-------|----------|
| 9–10  | Immediate hierarchy: hook title → series brand → subtitle → author. Eye moves naturally. |
| 6–8   | Hierarchy present but one element is competing for attention at the wrong level. |
| 3–5   | Two elements at similar scale competing. Eye uncertain where to go. |
| 0–2   | No clear hierarchy. Everything same weight. Cover looks amateur. |

---

### 4. Brand Compliance (0–10 pts)
Does the cover follow the active book's brand rules?

**Before scoring:** Read the active book's `BOOK-CONFIG.sh`. Check `PUBLISHER_IMPRINT`.
- If `PUBLISHER_IMPRINT` is empty → imprint is N/A. Do not penalise for its absence.
- If `PUBLISHER_IMPRINT` is set → it must appear on the cover.

| Score | Criteria |
|-------|----------|
| 9–10  | Correct author name. Series brand name present. Palette genre-appropriate. Imprint present if required (else N/A). |
| 6–8   | Minor deviation — one color slightly off or element slightly mispositioned. |
| 3–5   | Missing one required element (author name, or series brand, or required imprint). |
| 0–2   | Multiple brand violations. Cover could not ship without corrections. |

---

### DESIGN SCORE THRESHOLDS

| Total | Decision |
|-------|----------|
| 43–50 | **APPROVE** — save to Canva, present to user |
| 35–42 | **REVISE** — rewrite prompt with targeted corrections, regenerate |
| 0–34  | **REJECT** — fundamental issue, rebuild creative direction and regenerate |

**Maximum iterations:** 3. If score < 35 after 3 rounds, present best result with scoring notes so user can decide.

---

## WRITING RUBRIC (50 points)
Used by: health-writer, hook-optimizer-agent, review-bait-optimizer

### 1. Hook Strength (0–15 pts)
Does the opening sentence create immediate forward momentum?

| Score | Criteria |
|-------|----------|
| 13–15 | Opens mid-action or with a counterintuitive claim. No preamble. Reader must continue. |
| 9–12  | Strong setup but 1–2 sentences of throat-clearing before the hook lands. |
| 5–8   | Hook is present but buried or diluted by a qualifier. |
| 0–4   | Chapter opens with background, context, or definition. No forward pull. |

---

### 2. Factual Accuracy (0–15 pts)
Are all statistics, study references, and clinical claims accurate per FACTS.md?

| Score | Criteria |
|-------|----------|
| 13–15 | Every claim traceable to FACTS.md or verified source. No invented specificity. |
| 9–12  | 1 minor imprecision (stat rounded, study year approximate). |
| 5–8   | 1–2 claims that cannot be verified or appear invented. |
| 0–4   | Multiple unverified claims. Compliance risk. |

---

### 3. Voice Consistency (0–10 pts)
Does the passage sound like the locked Reflex Press voice: clinical authority, human warmth, no fluff?

| Score | Criteria |
|-------|----------|
| 9–10  | Voice indistinguishable from approved chapters. |
| 6–8   | Slight drift — one wellness cliché or overly clinical sentence. |
| 3–5   | Noticeable drift in tone — too soft or too cold. |
| 0–2   | Wrong voice entirely — sounds like generic health content. |

---

### 4. Reader Payoff (0–10 pts)
Does the reader feel they gained something specific and actionable?

| Score | Criteria |
|-------|----------|
| 9–10  | Reader has a clear next action or a reframe that changes how they see their situation. |
| 6–8   | Payoff present but general — could apply to any health book. |
| 3–5   | Payoff vague. Reader informed but not moved. |
| 0–2   | No payoff. Chapter ends without delivering on its opening promise. |

---

### WRITING SCORE THRESHOLDS

| Total | Decision |
|-------|----------|
| 43–50 | **APPROVE** — pass to next stage |
| 35–42 | **REVISE** — targeted rewrite of weakest section, rescore |
| 0–34  | **REJECT** — full rewrite, do not advance |

**Maximum iterations:** 3.

---

## HOW AGENTS USE THIS FILE

1. Complete the work (generate design / write chapter / optimize hook)
2. Read the relevant rubric section above
3. Score each criterion honestly — be harsh, not generous
4. State: "Score: X/50. [Weakest criterion] scored lowest because [specific reason]."
5. If below threshold: write the specific correction and redo
6. If at or above threshold: advance and report score to user
