# BookFactory Automation — Phase 1 (Orchestrator Daemon)

Phase 1 of the full-system automation plan. Runs the `pipeline-orchestrator`
agent across every book on a schedule, stopping at every human gate.

## What it does

Every 6 hours (or on manual trigger) the daemon:

1. Checks for a `PAUSE_AUTOMATION` file at the repo root → if present, exits.
2. Lists every book under `books/`.
3. For each book:
   - Reads `pipeline-state.json`.
   - Checks if any human gate is blocking. If yes → writes to
     `NOTIFICATIONS.md`, does not invoke the agent.
   - Checks the per-book daily spend cap (default 20 invocations/day). If
     reached → skips.
   - Otherwise → invokes the `pipeline-orchestrator` agent (or dry-runs in
     dry-run mode).
4. Records every decision in `AUTOMATION-LOG.md` and every invocation in
   `books/<slug>/.spend-log.json`.

## The kill switch

If anything goes wrong, run this from the repo root:

```bash
echo "Reason for pausing" > PAUSE_AUTOMATION
```

The next daemon run will exit immediately. The CI workflow also checks this
file before doing anything. Delete the file to resume.

## Modes

| Mode | Trigger | Effect |
|---|---|---|
| **Dry-run** (default) | `npm run daemon` from `backend/` | Logs what it WOULD do, never invokes `claude`. Safe. |
| **Live** | `npm run daemon:live` or `DAEMON_LIVE=true` env | Actually invokes the `claude` CLI for each non-blocked book. |

The GitHub Action defaults to dry-run. Trigger manually with `live=true`
input to go live.

## Per-day spend cap

The daemon refuses to invoke the orchestrator more than 20 times for the same
book in a single UTC day. Override with `DAEMON_MAX_INVOCATIONS_PER_DAY=N`.

## Files the daemon writes

| File | Purpose |
|---|---|
| `NOTIFICATIONS.md` | Human-gate alerts. Read this when you wake up. |
| `AUTOMATION-LOG.md` | Append-only log of every decision. |
| `books/<slug>/.spend-log.json` | Per-book invocation count + history. |

## Recommended Phase 1 rollout

1. Enable the GitHub Action in **dry-run mode** (default).
2. Let it run for one full week. Read `AUTOMATION-LOG.md` daily.
3. Verify it correctly identifies blocked books and respects the cap.
4. Once confident, trigger one **manual live run** via `workflow_dispatch`.
5. If that goes well, change the schedule's default to live in the workflow file.

## What gates are checked

The daemon refuses to invoke the orchestrator when any of these gates is
unapproved AND the book has reached the gate's stage:

| Gate | Required at stage |
|---|---|
| `market_intelligence_approved` | 2 |
| `blueprint_approved` | 3 |
| `cover_approved` | 7 |
| `final_approval_passed` | 7 |
| `ai_questionnaire_confirmed` | 7 |
| `published` | 8 |

These are the same gates the orchestrator agent enforces, doubled up at the
daemon level for safety.

## Disabling the daemon entirely

Edit `.github/workflows/auto-pipeline.yml`, comment out the `schedule:` block,
and commit. The daemon can still be triggered manually via `workflow_dispatch`.
