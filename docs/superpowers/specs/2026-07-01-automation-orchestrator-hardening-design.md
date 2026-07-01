# Automation — Autonomous & Self-Healing Orchestrator Hardening (Design Spec)

**Date:** 2026-07-01
**Slice:** Automation (slice 3 of the overhaul)
**Approach:** Combo 1+3 — autonomous self-healing orchestrator + rock-solid state/handoffs. Batch (approach 2) is explicitly deferred until single-book runs are bulletproof.

## What already exists (do NOT rebuild)
`pipeline-orchestrator.md` (727 lines) already has: a Self-Healing Intervention Protocol, active intervention triggers, a restart protocol, a startup sequence that reads state and finds the resume point, a mandatory pre-stage-gate before every stage, an escalation format, and an end-of-run report. Guard/state tooling exists: `scripts/pre-stage-gate.cjs`, `scripts/validate-state.cjs`, `scripts/advance.cjs`, `scripts/pipeline-board.cjs`, `scripts/integration-smoke-test.cjs`.

**Therefore this slice CLOSES GAPS, it does not rewrite the orchestrator.** Three gaps remain, drawn from the real pain (loops that needed babysitting; work repeated after a session reset; unclear which stops are truly required).

## Gap A — Retry budget + loop-guard (prevents infinite spinning)
The orchestrator self-heals but has no explicit cap, so a bad fix can loop.
- Add a hard rule: **max 2 auto-fix attempts per (agent, stage)**. On the 3rd failure → STOP and escalate (never re-spawn a 4th time).
- **Loop detector:** if the same agent returns the same failure signature twice in a row, do NOT retry the same way — either change the fix (re-brief/split) or escalate. Identical-failure-twice = escalate.
- Every auto-fix attempt is counted and logged in the Run Ledger (Gap B).

## Gap B — Run Ledger (clean resume, no repeated work)
`pipeline-state.json` is the machine state; add a human-readable **durable audit trail** so a fresh or post-compaction session resumes cleanly and never re-runs completed work.
- File: `books/<slug>/RUN-LEDGER.md` (append-only, orchestrator-maintained).
- One line per event: timestamp · stage · agent · action · result · retry-count · next-step.
- On startup the orchestrator reads, in order: `RUN-LEDGER.md` (last state) → `pipeline-state.json` → `git log` → then runs `validate-state` + `pre-stage-gate` to confirm the resume point. Anything the ledger marks complete is DONE — do not re-dispatch.

## Gap C — Codify the human gates (only 3; everything else auto-advances)
Make the required human stops explicit and singular so the orchestrator auto-advances everywhere else without asking.
- **The ONLY 3 human gates:** (1) Blueprint + Title approval (Stage 02), (2) KDP AI questionnaire (at upload), (3) **PUBLISH** (typed exactly).
- Everything else auto-advances once `pre-stage-gate` returns CLEARED.
- `pre-stage-gate.cjs` remains the HARD WALL — the orchestrator may never bypass it (protects against the 2026-06-21 bypass class of bug). Autonomy is "don't stop for friction," never "skip a gate."

## Files touched
- EDIT: `.claude/agents/00-coordinator/pipeline-orchestrator.md` — add three sections: `## Retry Budget & Loop-Guard`, `## Run Ledger Protocol`, `## Human Gates (ONLY THESE THREE)`.
- NEW (per book, created at runtime): `books/<slug>/RUN-LEDGER.md` — documented format only; no code.
- After edit: re-run `scripts/sync-agents-to-user.py`; confirm the orchestrator frontmatter `description:` stays quoted and the file still parses.

## Success criteria
- Orchestrator prompt states a concrete retry cap (max 2 auto-fixes / then escalate) and an identical-failure loop rule.
- Orchestrator prompt defines the `RUN-LEDGER.md` format and reads it first on startup.
- Orchestrator prompt lists exactly the 3 human gates and says everything else auto-advances after pre-stage-gate CLEARED.
- No existing orchestrator behavior (self-heal, pre-stage-gate, escalation, stage map) is removed.
- `sync-agents-to-user.py` runs clean; parse check = 0 unparseable; `pipeline-orchestrator` still spawns (smoke test).

## Out of scope (later)
- Batch runner (approach 2) — after single-book autonomy proves out.
- Any change to the guard scripts themselves (they work) — this slice is orchestrator-prompt + ledger only.
- Slice 2 (digital assets) and Slice 4 (agent brains).

## Risk
- Over-autonomy could skip a needed human check → mitigated by keeping pre-stage-gate as the hard wall and codifying the exactly-3 gates.
- Retry cap too low could stop on transient errors → 2 attempts before escalate is the balance; escalation is cheap (a message), re-running a bad loop is not.
