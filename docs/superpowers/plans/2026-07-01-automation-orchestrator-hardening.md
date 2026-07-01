# Automation — Orchestrator Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Close 3 gaps in `pipeline-orchestrator` — retry/loop-guard, run ledger, codified 3 human gates — so it drives books hands-free and self-heals without spinning, keeping every safety gate.

**Architecture:** Additive prompt sections in one agent file, plus a documented per-book ledger format. Verification is grep-based file assertions + frontmatter parse safety + a live smoke spawn. Prompt engineering, so "tests" are concrete file/behaviour assertions.

**Tech Stack:** Markdown agent definition `.claude/agents/00-coordinator/pipeline-orchestrator.md`, `scripts/sync-agents-to-user.py`, `python`/`grep`.

## Global Constraints
- Additive only — remove NO existing orchestrator behavior (self-heal, pre-stage-gate, escalation, stage map, startup sequence).
- `pre-stage-gate.cjs` stays the hard wall; orchestrator may never bypass it.
- The ONLY 3 human gates: (1) Blueprint+Title approval, (2) KDP AI questionnaire, (3) PUBLISH.
- Retry cap = max 2 auto-fix attempts per (agent, stage), then escalate; identical-failure-twice = escalate.
- Ledger file per book: `books/<slug>/RUN-LEDGER.md`, append-only.
- `description:` frontmatter must stay double-quoted.
- Commit only when the user asks.

---

### Task 1: Add the three orchestrator sections

**Files:**
- Modify: `.claude/agents/00-coordinator/pipeline-orchestrator.md`

**Interfaces:**
- Produces: an orchestrator prompt with three new BODY sections. No other task depends on internal names.

- [ ] **Step 1: Write the verification checks first (expect current absence)**

Run: `grep -c 'Retry Budget & Loop-Guard\|Run Ledger Protocol\|Human Gates (ONLY THESE THREE)' .claude/agents/00-coordinator/pipeline-orchestrator.md`
Expected: `0`

- [ ] **Step 2: Add section `## Retry Budget & Loop-Guard`**

Content: max **2** auto-fix attempts per (agent, stage); on the 3rd failure STOP and escalate (never a 4th spawn). Loop detector: if the same agent returns the same failure signature twice in a row, do NOT re-spawn the same way — change the fix (re-brief / split the task) or escalate. Identical-failure-twice = escalate. Every auto-fix attempt is counted and written to the Run Ledger.

- [ ] **Step 3: Add section `## Run Ledger Protocol`**

Content: maintain `books/<slug>/RUN-LEDGER.md` (append-only). One line per event: `timestamp · stage · agent · action · result · retry-count · next-step`. On startup read in order: RUN-LEDGER.md (last state) → pipeline-state.json → `git log` → then run `validate-state` + `pre-stage-gate` to confirm the resume point. Anything the ledger marks complete is DONE — never re-dispatch it.

- [ ] **Step 4: Add section `## Human Gates (ONLY THESE THREE)`**

Content: list exactly the 3 gates (Blueprint+Title approval; KDP AI questionnaire; PUBLISH). State that everything else auto-advances once `pre-stage-gate` returns CLEARED, and that the orchestrator may NEVER bypass pre-stage-gate (protects against the 2026-06-21 bypass class).

- [ ] **Step 5: Verify sections present + frontmatter intact + nothing removed**

Run: `grep -c 'Retry Budget & Loop-Guard\|Run Ledger Protocol\|Human Gates (ONLY THESE THREE)' .claude/agents/00-coordinator/pipeline-orchestrator.md` → Expected: `3`
Run: `sed -n '4p' .claude/agents/00-coordinator/pipeline-orchestrator.md | grep -qi 'description' ; grep -q '^description: "' .claude/agents/00-coordinator/pipeline-orchestrator.md && echo DESC-QUOTED-OK`
Expected: `DESC-QUOTED-OK`
Run: `grep -c 'SELF-HEALING INTERVENTION PROTOCOL\|PRE-STAGE GATE\|STAGE MAP' .claude/agents/00-coordinator/pipeline-orchestrator.md` → Expected: `>= 3` (existing sections still present)

- [ ] **Step 6: Commit (only if user approved committing)**

`git add .claude/agents/00-coordinator/pipeline-orchestrator.md && git commit -m "feat(automation): orchestrator retry/loop-guard + run ledger + codified 3 gates"`

---

### Task 2: Sync + parse-check + smoke test

**Files:**
- Run: `scripts/sync-agents-to-user.py`

- [ ] **Step 1: Re-sync user-level copies**

Run: `python scripts/sync-agents-to-user.py` → Expected: `mirrored 55 agents`, no errors.

- [ ] **Step 2: Parse-safety check**

Run the bf-*.md parse check → Expected: `unparseable agent files: 0`.

- [ ] **Step 3: Confirm the three sections survived the sync**

Run: `grep -c 'Retry Budget & Loop-Guard\|Run Ledger Protocol\|Human Gates (ONLY THESE THREE)' ~/.claude/agents/bf-00-coordinator-pipeline-orchestrator.md` → Expected: `3`.

- [ ] **Step 4: Live smoke test**

Spawn `pipeline-orchestrator` with a SMOKE-TEST-ONLY prompt: "Do not run any pipeline. Reply two lines: `READY: pipeline-orchestrator`, and the max auto-fix retry count before escalation stated in your instructions." Confirm it replies READY and states `2`.

- [ ] **Step 5: Verification-before-completion**

Confirm against spec success criteria: 3 sections present + synced, retry cap = 2, ledger format defined, 3 gates listed, no existing sections removed, parse clean. Done.

---

## Self-Review
- **Spec coverage:** Gap A → Task 1 Step 2; Gap B → Step 3; Gap C → Step 4; sync/smoke/success → Task 2. Covered.
- **Placeholder scan:** No TBD/TODO; section names and the retry number (2) are concrete.
- **Consistency:** The three exact heading strings are used identically in Task 1 Step 1/5 and Task 2 Step 3.
