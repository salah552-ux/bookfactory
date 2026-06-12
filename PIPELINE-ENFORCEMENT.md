# Pipeline Enforcement

Built 2026-06-12. Turns the BookFactory pipeline from honour-system handover into enforced gates. Kills the **state/bookkeeping failure class** — stages running past open gates, stranded git branches, publishing without the human gate — the class that silently bit the H. Pylori run five times before it was caught by a manual audit.

It does **not** police content quality (that is the 96/120 review gates), does **not** run inside CCR cloud jobs unless the script is called there too, and a hook can be switched off. It makes silent failure dramatically harder — not literally impossible.

---

## 1. The contract — `.claude/agents/PIPELINE-MANIFEST.json`

Two additive blocks make the manifest machine-readable:

- **`gates`** — keyed by the stage keys used inside each book's `pipeline-state.json`. Each stage has:
  - `required_outputs` — glob patterns (relative to the book dir) that must resolve to ≥1 file before the stage may be marked complete.
  - `gate_in` — `human_gates` fields that must be `true` before the stage may begin.
- **`invariants`** — the rules, with severity (`CRITICAL` blocks; `WARN` reports only).

## 2. The validator — `node scripts/validate-state.cjs [book] [--hook]`

Intent-independent: it checks the **result** (state JSON + filesystem + git), so it catches corruption no matter how it got there (manual edit, agent bug, mid-stage crash).

| Invariant | Severity | Catches |
|-----------|----------|---------|
| INV-1 monotonic completion | CRITICAL | a `complete` stage following a non-complete one (stage ran past an open gate) |
| INV-2 declared outputs exist | CRITICAL | a complete stage whose `outputs[]` paths aren't on disk (crash / stale rename) |
| INV-2b required outputs present | WARN | contract `required_outputs` glob with no match (filename drift) |
| INV-3 current_stage agreement | WARN | `current_stage` out of sync with the furthest complete stage |
| INV-4 no stranded branch | CRITICAL | completed work sitting on an unmerged `stage-*` branch |
| INV-5 no stale PENDING | WARN | a "PENDING … APPROVAL" string left in a doc whose stage is complete |
| INV-6 publish lock | CRITICAL | `published:true` without an `asin` AND `ai_questionnaire_confirmed` |
| INV-7 quality before production | CRITICAL | `06-production` complete with reviewer avg < 96 or fact-check ≠ PASS |
| INV-8 gate_in satisfied | WARN | a begun stage whose entry gate wasn't granted (prep-ahead allowed) |

`--hook` mode emits the Stop-hook `{decision:block}` contract on any CRITICAL for an in-flight (unpublished) book; silent + exit 0 when clean. Legacy/older-schema books stay green (absent quality proof is a WARN, not a CRITICAL).

Usage: `node scripts/validate-state.cjs` (all books) · `node scripts/validate-state.cjs h-pylori-recovery-plan` (one).

## 3. The runner — `node scripts/advance.cjs <book> [--begin|--complete]`

Gatekeeper around stage work (the agents still do the work; the runner refuses to let a stage start or finish out of contract).

- **(no flag)** — status dashboard: every stage, its status, and any ungranted entry gate, plus the validator verdict.
- **`--begin`** — precondition gate. Refuses to start the next stage if its `gate_in` human-gates aren't granted or the state is already invalid. On pass, prints the genre-resolved agents to dispatch + the required outputs.
- **`--complete`** — postcondition gate. Refuses until the stage's `required_outputs` exist on disk, then flips the status (format-preserving) and **rolls back** if doing so would break any invariant.

## 4. The floor — Stop hook

Wired in `.claude/settings.local.json`, runs `validate-state.cjs --hook` at the end of every turn. If any in-flight book has a CRITICAL, the hook blocks the turn from ending until it's fixed. Bypass-proof because the harness runs it, not the agent.

> **Note:** the scripts and the manifest contract are committed; the hook **wiring** lives in `settings.local.json`, which is local/gitignored. It could not be added to the committed `.claude/settings.json` because the auto-mode classifier blocks any edit to that file (it contains `defaultMode: bypassPermissions`). To make the hook wiring durable/committed, add it to `.claude/settings.json` manually or via `/hooks`.

## 5. First run (2026-06-12) found & fixed 5 criticals

1. repo — 3 commits stranded on an unmerged `stage-08` branch → merged to master.
2. h-pylori `04-quality` — stuck `in_progress` under 5 complete stages → set complete (113/120).
3. h-pylori `03-writing` — declared a renamed front-matter file → reconciled to real filenames.
4. h-pylori `09-series` — claimed a `SERIES-CONTINUITY` report never written to disk → phantom removed; continuity must re-run with the Book 2/3 swap.
5. 7-day-reset `01-research` — stale `awaiting-human-gate` while downstream was done → set complete (gate already granted).

Commits: `f76ccc7` (validator + contract + remediation), `3cfd4fc` (runner + Stop-hook block contract).
