# CRON-MANIFEST.md — BookFactory Automation Registry

Central registry of every automated job in the BookFactory pipeline.
Built and registered 2026-06-07 by the master orchestrator (Opus).

All schedules run as **CCR cloud agents** (RemoteTrigger / claude.ai routines).
They authenticate to GitHub via the connected account and read the repo
`salah552-ux/bookfactory` (branch `master`). Times are the Architect's local
timezone unless noted. Trigger IDs are filled in after registration (see the
"Registered IDs" table at the bottom).

---

## Design constraints (read before editing any job)

1. **Cloud agents cannot drive a logged-in KDP browser session** (login + 2FA).
   - The Watchdog therefore scrapes **public** Amazon product pages only
     (`amazon.co.uk/dp/<ASIN>`) — BSR, review count, star rating, price.
   - KDP-internal metrics (KENP read, units sold) stay a **local** Playwright
     job and are NOT in this manifest.
2. **Cloud agents start with ZERO context.** Every prompt below is fully
   self-contained: it names file paths, ASINs, thresholds, and outputs.
3. **No silent overwrites of live docs.** Jobs that produce intelligence write
   to a `-CANDIDATE` file; the Architect promotes it manually.
4. **Alert-only by default.** Tier-1 jobs ping only when a rule fires. The
   Morning Briefing (Tier 2) is the single daily aggregate the Architect reads.
5. **CCR recurring routines auto-expire after 7 days** in some trigger modes —
   if a job stops firing, re-run the registration block in this file.

---

## Live books (canonical reference for all jobs)

| Book | Slug | ASIN | Marketplace | Live date | KDP Select term |
|------|------|------|-------------|-----------|-----------------|
| Fix Your Gut for Good | `fix-your-gut-for-good` | `B0GXYLWS1W` | UK (.co.uk) | 2026-04-21 | ends 2026-07-19 |
| Death in the Cathedral Close | `death-in-the-cathedral-close` | `B0GZD1S8HF` | UK (.co.uk) | 2026-05-03 | Countdown deal 06-02→06-09 |

State files:
- `books/fix-your-gut-for-good/pipeline-state.json`
- `books/death-in-the-cathedral-close/pipeline-state.json`
- `intelligence/opportunity-db.json`
- `intelligence/INTELLIGENCE-LOG.md`
- `intelligence/ALGO-INTELLIGENCE.md`

---

## TIER 1 — Fully autonomous (alert-only)

### JOB 1 — Daily Live-Book Watchdog
- **Schedule:** 07:00 daily (cron `2 7 * * *`)
- **Type:** CCR cloud agent + Playwright public scrape
- **Reads:** the two ASINs above (public Amazon pages), both pipeline-state.json
- **Writes:** `automation/reports/watchdog-<date>.md`; updates `post_launch.weekly_log` only if a metric materially changed
- **Alerts when:** rating drops below 4.0; a new negative (1–2 star) review appears; BSR worsens by >40% day-over-day; price differs from the planned list price; book shows unavailable/blocked.
- **Prompt:** see `prompts/job1-watchdog.md`

### JOB 2 — Milestone Sentinel
- **Schedule:** 07:05 daily (cron `5 7 * * *`)
- **Type:** CCR cloud agent (date-math only, no browser)
- **Reads:** both pipeline-state.json
- **Writes:** `automation/reports/milestones-<date>.md`
- **Alerts when:** a countdown window opens/closes within 3 days (Select term end, countdown-deal eligibility); BookFunnel link still missing (`bookfunnel_link_live:false`); a stage is `in_progress` with no update for >14 days; any flagged gap is still open (`category_mismatch_flagged`, `bookfunnel_gap_flagged`).
- **Prompt:** see `prompts/job2-milestones.md`

### JOB 3 — Intelligence Freshness Guard
- **Schedule:** Monday 08:00 weekly (cron `3 8 * * 1`)
- **Type:** CCR cloud agent
- **Reads:** `intelligence/opportunity-db.json` (`niches.*.last_harvested`)
- **Writes:** `automation/reports/intel-freshness-<date>.md`; appends to `intelligence/INTELLIGENCE-LOG.md`
- **Alerts when:** any niche `last_harvested` is older than 14 days. Lists the exact `harvest <niche>` / `analyse opportunities <niche>` commands to run. (Cloud agent flags; it does not run the local Playwright harvester.)
- **Prompt:** see `prompts/job3-intel-freshness.md`

### JOB 4 — Algo-Intelligence Sweep
- **Schedule:** 1st of month 08:00 (cron `4 8 1 * *`)
- **Type:** CCR cloud agent + WebSearch
- **Reads:** `intelligence/ALGO-INTELLIGENCE.md` (current version)
- **Writes:** `intelligence/ALGO-INTELLIGENCE-CANDIDATE.md` (NEVER overwrites the live doc)
- **Behavior:** WebSearch for KDP / A10 / A11 algorithm + policy changes since the live doc's date. Drafts a confidence-rated candidate entry. Architect promotes manually.
- **Prompt:** see `prompts/job4-algo-sweep.md`

### JOB 5 — State Integrity Audit
- **Schedule:** Sunday 23:00 weekly (cron `0 23 * * 0`)
- **Type:** CCR cloud agent
- **Reads:** all `books/*/pipeline-state.json`
- **Writes:** `automation/reports/integrity-<date>.md`
- **Alerts when:** contradictions found (e.g. `published:true` but `kdp_status` not live; `current_stage` inconsistent with stage statuses; dates out of order; flagged gaps marked resolved elsewhere but still true).
- **Prompt:** see `prompts/job5-integrity.md`

---

## TIER 2 — Human-in-the-loop

### JOB 6 — Morning Briefing
- **Schedule:** 07:30 daily (cron `28 7 * * *`)
- **Type:** CCR cloud agent (aggregator)
- **Reads:** the most recent `automation/reports/*` from Jobs 1–5
- **Writes:** `automation/DAILY-BRIEF.md` (overwrites — always the latest)
- **Behavior:** one consolidated brief. Top section = ACTION REQUIRED items needing a one-word approval; below = green/steady status. This is the single file the Architect opens each morning.
- **Prompt:** see `prompts/job6-briefing.md`

---

## Hooks (local Claude Code — `.claude/settings.local.json`)

| Hook | Event | Script | Purpose |
|------|-------|--------|---------|
| KDP Publish Guard | PreToolUse (Playwright click/eval) | `automation/hooks/kdp-publish-guard.mjs` | Hard-blocks any click on a KDP Publish button unless a 30-min approval window exists. Backstop to the kdp-upload-agent's verbal "PUBLISH" gate. |
| Grant Publish | (manual) | `automation/hooks/grant-publish.mjs <slug>` | Architect runs this after typing PUBLISH to open the 30-min window. |
| Agent-Log Append | SubagentStop (all) | `automation/hooks/agent-log-append.mjs` | Appends every subagent run to `automation/AGENT-LOG.md` (central audit trail). |

Note: hooks live in `.claude/settings.local.json`, NOT `settings.json`, because
the latter carries `defaultMode: bypassPermissions` which the harness protects
from agent writes. `settings.local.json` is merged on top by Claude Code.

---

## Registered IDs (filled after RemoteTrigger create)

| Job | Trigger ID | Status |
|-----|-----------|--------|
| 1 Watchdog | _see registration log_ | |
| 2 Milestones | | |
| 3 Intel Freshness | | |
| 4 Algo Sweep | | |
| 5 Integrity | | |
| 6 Morning Briefing | | |

---

## How to change a schedule
1. Edit the cron + prompt here and in `prompts/`.
2. `RemoteTrigger update` with the trigger_id and the new body.
3. Update the Registered IDs table.
