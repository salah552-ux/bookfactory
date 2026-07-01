# Health Book Quality Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lift health-book quality across 4 axes (AI-sound, research, voice/hook, drift) by adding a shared Health Voice Bible and tightening the `health-writer` and `book-reviewer` agents — no new pipeline steps.

**Architecture:** One new reference file that both agents read, plus additive prompt directives in the two existing agent definitions. Verification is done with grep-based checks on the agent files, the existing frontmatter parse check, and a live smoke spawn of each agent — this is prompt engineering, so "tests" are concrete file/behaviour assertions rather than unit tests.

**Tech Stack:** Markdown agent definitions in `.claude/agents/`, `scripts/sync-agents-to-user.py` (flatten to user level), `python`/`grep` for verification.

## Global Constraints
- No new agents, no new pipeline stages, no extra per-book cost (verbatim from spec).
- Health genre only this pass; other genres are out of scope.
- Agent `description:` frontmatter must stay QUOTED (avoids the colon-space silent-drop bug).
- After any agent edit, re-run `scripts/sync-agents-to-user.py`.
- Commit only when the user asks (project rule) — commit steps below are gated on that.
- No invented facts/numbers anywhere in the Bible or prompts; sources must be real.

---

### Task 1: Create the Health Voice Bible

**Files:**
- Create: `.claude/agents/03-writing/HEALTH-VOICE-BIBLE.md`

**Interfaces:**
- Produces: a reference file read by `health-writer` (Task 2) and `book-reviewer` (Task 3). Must contain four H2 sections with these exact headings: `## Anti-AI Ban List`, `## Voice Standards`, `## Exemplar Patterns`, `## Research Rule`.

- [ ] **Step 1: Write the verification check first**

Run (expected FAIL — file absent):
`test -f .claude/agents/03-writing/HEALTH-VOICE-BIBLE.md && echo EXISTS || echo MISSING`
Expected: `MISSING`

- [ ] **Step 2: Create the file with all four sections**

Content requirements (write real, complete content — no placeholders):
- `## Anti-AI Ban List` — enumerate banned phrases/patterns, at minimum: "it's important to note",
  "in today's world", "in conclusion", "delve", "navigate the complexities", "when it comes to",
  "plays a (vital/crucial) role", reflexive hedging ("may", "might", "could" stacked), uniform
  paragraph length, tricolon spam, em-dash overuse, empty topic sentences.
- `## Voice Standards` — warm, plain, direct, second-person; deliberate sentence-length variation;
  concrete over abstract; no filler transitions; one idea per paragraph but varied paragraph shapes.
- `## Exemplar Patterns` — describe (in your own words, no pasted copyrighted text) how a strong health
  author opens a chapter with a reader-symptom hook, explains a mechanism with a concrete analogy, and
  closes on a forward hook.
- `## Research Rule` — every physiological/factual claim maps to a real named source; label
  animal/pilot/early evidence as such; never invent a study.

- [ ] **Step 3: Verify structure**

Run: `grep -c '^## \(Anti-AI Ban List\|Voice Standards\|Exemplar Patterns\|Research Rule\)' .claude/agents/03-writing/HEALTH-VOICE-BIBLE.md`
Expected: `4`

- [ ] **Step 4: Commit (only if user has approved committing)**

`git add .claude/agents/03-writing/HEALTH-VOICE-BIBLE.md && git commit -m "feat(quality): add Health Voice Bible reference"`

---

### Task 2: Upgrade health-writer to use the Bible

**Files:**
- Modify: `.claude/agents/03-writing/health-writer.md`

**Interfaces:**
- Consumes: `HEALTH-VOICE-BIBLE.md` (Task 1).
- Produces: a writer that references the Bible; relied on by the pipeline flow unchanged.

- [ ] **Step 1: Write the verification check first**

Run (expected FAIL — directive absent):
`grep -c 'HEALTH-VOICE-BIBLE' .claude/agents/03-writing/health-writer.md`
Expected: `0`

- [ ] **Step 2: Add the directives to the agent body (not frontmatter)**

Insert a new section that instructs the writer to, before drafting: read
`.claude/agents/03-writing/HEALTH-VOICE-BIBLE.md` and the book's `FACTS.md`/`BLUEPRINT.md`; and for every
chapter: (a) open AND close on a real hook, (b) cite a real named source for every claim (from
RESEARCH.md/FACTS.md — never invent), (c) before returning, self-check the draft against the Bible's
Anti-AI Ban List and remove every hit. Keep all existing health-writer behavior intact (additive only).
Do NOT touch the quoted `description:` frontmatter.

- [ ] **Step 3: Verify the directive landed and frontmatter is still parse-safe**

Run: `grep -c 'HEALTH-VOICE-BIBLE' .claude/agents/03-writing/health-writer.md` → Expected: `>=1`
Run: `sed -n '3p' .claude/agents/03-writing/health-writer.md | grep -q '^description: "' && echo QUOTED-OK`
Expected: `QUOTED-OK`

- [ ] **Step 4: Commit (only if user has approved committing)**

`git add .claude/agents/03-writing/health-writer.md && git commit -m "feat(quality): health-writer reads Voice Bible + hook/source/self-check rules"`

---

### Task 3: Upgrade book-reviewer with the 4-axis quality gate

**Files:**
- Modify: `.claude/agents/04-quality/book-reviewer.md`

**Interfaces:**
- Consumes: `HEALTH-VOICE-BIBLE.md` (Task 1).
- Produces: a reviewer that scores + blocks on 4 axes; used by the existing fact-checker+book-reviewer step.

- [ ] **Step 1: Write the verification check first**

Run (expected FAIL — axes absent):
`grep -ci 'AI-sound\|4-axis\|voice/hook\|drift' .claude/agents/04-quality/book-reviewer.md`
Expected: `0`

- [ ] **Step 2: Add the 4-axis quality gate to the reviewer body**

Insert a rubric section: the reviewer reads `HEALTH-VOICE-BIBLE.md`, then scores four named axes —
**AI-sound**, **Research credibility**, **Voice/hook strength**, **Cross-chapter continuity (drift)**.
Each axis has a floor; ANY axis below floor = **BLOCK** and return to the writer with exact quoted
fixes (not vague notes). Keep the existing 96/120 minimum AND require all four floors to pass. Set floors
at "clearly failing," not perfectionist, to avoid stalls. Do NOT touch the quoted `description:` frontmatter.

- [ ] **Step 3: Verify**

Run: `grep -ci 'AI-sound' .claude/agents/04-quality/book-reviewer.md` → Expected: `>=1`
Run: `grep -ci 'block' .claude/agents/04-quality/book-reviewer.md` → Expected: `>=1`
Run: `sed -n '3p' .claude/agents/04-quality/book-reviewer.md | grep -q '^description: "' && echo QUOTED-OK` → Expected: `QUOTED-OK`

- [ ] **Step 4: Commit (only if user has approved committing)**

`git add .claude/agents/04-quality/book-reviewer.md && git commit -m "feat(quality): book-reviewer 4-axis quality gate + block"`

---

### Task 4: Sync, parse-check, and live smoke test

**Files:**
- Run: `scripts/sync-agents-to-user.py`

**Interfaces:**
- Consumes: the edited agents from Tasks 2-3 and the Bible from Task 1.
- Produces: updated user-level copies + proof the agents still register and run.

- [ ] **Step 1: Re-sync user-level copies**

Run: `python scripts/sync-agents-to-user.py`
Expected: `mirrored 55 agents` (or current count), no errors.

- [ ] **Step 2: Parse-safety check (no silent-drop regressions)**

Run the frontmatter parse check over `~/.claude/agents/bf-*.md` (same script used in the registry fix).
Expected: `unparseable agent files: 0`.

- [ ] **Step 3: Live smoke test both agents**

Spawn `health-writer` and `book-reviewer` with a SMOKE-TEST-ONLY prompt: "Reply with one line: READY: <name>, and confirm in a second line that you can see HEALTH-VOICE-BIBLE.md sections." Confirm both reply READY and reference the Bible.

- [ ] **Step 4: Verification-before-completion**

Confirm against the spec's success criteria: Bible exists with 4 sections; writer references Bible + hooks + sources + self-check; reviewer scores 4 axes and blocks; parse check clean. If all pass, the slice is done.

---

## Self-Review
- **Spec coverage:** Component 1 → Task 1; Component 2 → Task 2; Component 3 → Task 3; flow/sync/success-criteria → Task 4. All spec sections covered.
- **Placeholder scan:** No TBD/TODO; ban-list items and directive contents are enumerated concretely.
- **Consistency:** File paths and the section headings (`Anti-AI Ban List`, `Voice Standards`, `Exemplar Patterns`, `Research Rule`) are used identically across Tasks 1-4; frontmatter-quote check identical in Tasks 2-3.
