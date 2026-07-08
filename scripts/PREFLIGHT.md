# Pre-Flight Check — `scripts/preflight.cjs`

One command that verifies the whole factory is **runnable** before any expensive
pipeline run. It is read-only, zero-dependency (Node stdlib only), and
intent-independent — it checks the *result on disk*, so it catches a broken
factory no matter how it broke.

## How to run

```bash
node scripts/preflight.cjs
```

No arguments. It prints a `✓` / `✗` line per check with a one-line detail, then a
summary block ending in `PREFLIGHT: GO` or `PREFLIGHT: NO-GO`.

- **Exit 0** — no CRITICAL failures (`PREFLIGHT: GO`).
- **Exit 1** — at least one CRITICAL failure (`PREFLIGHT: NO-GO`).

## When to run

- **Before any pipeline run.** The `pipeline-orchestrator` should run it at
  startup and refuse to begin expensive work on a NO-GO.
- After changing agent frontmatter, the manifest, or intelligence data.
- Any time the factory has been idle and you are unsure it is still healthy.

It complements `scripts/validate-state.cjs` (per-book state invariants) — in fact
check 6 delegates to it. Preflight is the *factory-wide* runnability gate;
validate-state is the *per-book state* gate.

## What it checks

| # | Check | CRITICAL when… | WARN when… |
|---|-------|----------------|------------|
| 1 | **Agent registry safety** | a named agent has no description, or an unquoted description with a colon-space / YAML indicator (the silent-drop bug class that makes an agent fail to load) | home-dir `bf-*.md` mirror count drifts from the project agent count (baseline ~55) |
| 2 | **Manifest integrity** | `PIPELINE-MANIFEST.json` is missing, unparseable, or has no `gates` object | — |
| 3 | **Intelligence freshness** (RULE 0B) | `intelligence/harvested.json` older than 30 days (prints age) | `intelligence/ALGO-INTELLIGENCE.md` older than 45 days |
| 4 | **Learning memory** | — | `intelligence/LESSONS.md` missing or has no `*Evidence:*` lines |
| 5 | **Core reference files** | any of HEALTH/FICTION/BUSINESS-VOICE-BIBLE, BESTSELLER-DNA-PROTOCOL, COVER-PSYCHOLOGY missing | — |
| 6 | **Per-book state sanity** | any `books/*/pipeline-state.json` is corrupt; or `validate-state.cjs --hook` reports active-book invariant violations | validator can't run / no book states found |
| 7 | **Build tooling** | `pandoc` not on PATH (builds fail without it) | `bash` or `node` not on PATH |
| 8 | **Scheduler** | — | Windows task "BookFactory Weekly Heartbeat" missing, or its last run result is nonzero |
| 9 | **Disk artifacts** | — | a live (published) book's `exports/final/manuscript-kdp.epub` is missing or `< 500KB` |

Note on check 1: a plain unquoted description with **no** colon-space is valid
YAML and loads fine, so it is not flagged. Only descriptions YAML would silently
mis-parse (colon-space or a leading indicator character) are CRITICAL. Quoting
every description is still the recommended guard.

## What GO / NO-GO means

- **`PREFLIGHT: GO`** — every CRITICAL check passed. The factory's registry,
  manifest, intelligence gate, reference files, book states, and build tooling
  are all in a state where a pipeline run can be trusted. Warnings may still be
  present (e.g. an unscheduled heartbeat); they are worth resolving but do not
  block a run.
- **`PREFLIGHT: NO-GO`** — one or more CRITICAL checks failed. Do **not** start a
  pipeline run. Fix every CRITICAL line first (e.g. re-run `harvester-agent` for
  stale intelligence, restore a missing reference file, install `pandoc`, repair
  a corrupt state file), then re-run `node scripts/preflight.cjs` until it
  returns GO.
