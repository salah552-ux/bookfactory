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

### JOB 7 — KDP Inbox Bridge + Drive Backup
- **Schedule:** Monday 09:00 weekly (cron `0 9 * * 1`)
- **Type:** CCR cloud agent + Gmail MCP + Google Drive MCP
- **Reads:** Gmail inbox (last 8 days, KDP/Amazon-publishing mail only); all three `books/*/pipeline-state.json`; `automation/CRON-MANIFEST.md`; `automation/DAILY-BRIEF.md`
- **Writes:** `automation/reports/kdp-inbox-<date>.md`; labels matched threads `BookFactory/KDP-Alerts` (Label_11); backs up the state files + manifest + brief to the Drive folder **BookFactory** (`1U6bceYXMcb3gMufzJwM1j0w0eVJieEK4`) as dated verbatim copies
- **Reality note:** KDP does NOT email per-sale or per-review data — that lives only behind the KDP login. This job catches the KDP emails that DO arrive (royalty/payment, Select-term, content/policy/blocked-listing, ads billing) and provides off-machine state backup. Emits findings as STATE DELTA blocks; never edits state directly.
- **Trigger ID:** `trig_01Gm98aEwW1xDgApoemWgnSM`

### JOB 8 — Review Velocity Tracker
- **Schedule:** Friday 09:00 weekly (cron `0 9 * * 5`)
- **Type:** CCR cloud agent + WebFetch (public Amazon) + Gmail MCP (secondary)
- **Reads:** both live `pipeline-state.json` (prior `review_count` + weekly_log); public `amazon.co.uk/dp/<ASIN>` pages
- **Writes:** `automation/reports/review-velocity-<date>.md`; emits STATE DELTA for `post_launch.review_count` / `avg_rating` / new weekly_log entry (does not edit state directly, to avoid conflicting with the daily Watchdog)
- **Reality note:** Amazon does NOT email on new customer reviews — the public product page is the only reliable review count. Computes reviews/week and ETA to each ad-activation gate (5/10/15/25/50). Flags "stalled — review generation needed" when velocity is 0.
- **Trigger ID:** `trig_015xnnhTF3tvsUW4ajDQAFkY`

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

## Registered IDs (registered 2026-06-07 by Opus orchestrator)

| Job | Trigger ID | Cron (UTC) | Next run (UTC) | Status |
|-----|-----------|------------|----------------|--------|
| 1 Watchdog | `trig_012AcuM1gJ57WADyrkykkwGe` | `2 7 * * *` | 2026-06-07 07:02 | enabled |
| 2 Milestones | `trig_017VkDSRLLCcs8M7gvJSXA32` | `5 7 * * *` | 2026-06-07 07:05 | enabled |
| 3 Intel Freshness | `trig_01Qz2wiYHb52xYbE787gqMWU` | `3 8 * * 1` | 2026-06-08 08:03 (Mon) | enabled |
| 4 Algo Sweep | `trig_01PgH7pMs2Vgr19v6En6xFMR` | `4 8 1 * *` | 2026-07-01 08:04 (1st) | enabled |
| 5 Integrity | `trig_01G9ChcmxWx8UmWos1DYMHSG` | `0 23 * * 0` | 2026-06-07 23:02 (Sun) | enabled |
| 6 Morning Briefing | `trig_01YR79mVRYA2chTaS6VqHfT7` | `28 7 * * *` | 2026-06-07 07:28 | enabled |
| 7 KDP Inbox + Drive Backup | `trig_01Gm98aEwW1xDgApoemWgnSM` | `0 9 * * 1` | 2026-06-08 09:00 (Mon) | enabled |
| 8 Review Velocity | `trig_015xnnhTF3tvsUW4ajDQAFkY` | `0 9 * * 5` | 2026-06-12 09:00 (Fri) | enabled |
| Weekly Post-Launch Monitor | `trig_01WRDL6yyAWN9KVMxHthua6P` | `0 8 * * 1` | 2026-06-08 08:01 (Mon) | enabled — FIXED 2026-06-07 |

**Note on time zone:** CCR cron is interpreted in UTC. The cron strings above
were authored to read as the intended local clock times (07:00, 07:30, etc.) and
fire at those UTC minutes. In British Summer Time (UTC+1) the Architect will see
them land ~1h later local. If exact local-clock timing matters, shift each cron
hour back by 1 and `RemoteTrigger update` the trigger.

**Pre-existing one-shot / external triggers:**
- `trig_01TB3c2cTEWyn1mPi3HxDHNR` — Cathedral Close category fix (one-shot, Jun 9)
- `trig_013FrPUMfNB4ZqKc6GtPxYQi` — Cathedral Close £0.99 price (one-shot, Jun 8)
- `trig_019uZk9G94bE1nhUABBoNcAP` — Countdown Deal reminder (fired, disabled)

**Weekly Post-Launch Monitor — now FIXED and folded into this system (2026-06-07):**
- `trig_01WRDL6yyAWN9KVMxHthua6P` — was pointed at the non-existent slug
  `books/untitled-cosy-mystery/` AND used the KDP internal id `AT25QRT6FPTE6`
  as if it were the public ASIN. Both corrected: now reads
  `books/death-in-the-cathedral-close/`, fetches the real public ASIN
  `B0GZD1S8HF` on `amazon.co.uk`, and is aligned with current state
  (Countdown Deal done, category fix scheduled, report-only with STATE DELTA).

---

## ⚠️ UNRESOLVED PRICING CONFLICT — Cathedral Close (flagged 2026-06-07, needs Architect decision)

Two one-shot triggers give contradictory instructions for the same book, and the
pipeline-state + Weekly Monitor assume a third value. This is a money decision —
NOT auto-resolved.

| Source | Instruction |
|--------|-------------|
| `trig_013FrPUMfNB4ZqKc6GtPxYQi` (fires Jun 8) | Set price **permanently to £0.99 / $0.99** — "series-starter price, do NOT raise back up" |
| `trig_01TB3c2cTEWyn1mPi3HxDHNR` (fires Jun 9) | Says the deal "ran June 2–8 at £0.99"; category-fix context implies price returns to £6.99 |
| `pipeline-state.json` + Weekly Monitor | Assume list price reverts to **£6.99** after the Countdown Deal |

Also note the **dates disagree**: pipeline-state records the Countdown Deal as
2026-06-02 → 2026-06-09, while the price trigger says it ran 06-02 → 06-08.

**Architect must decide:** is Book 1's permanent price £0.99 (loss-leader series
funnel) or £6.99 (standalone)? Whichever is chosen, update `pipeline-state.json`
`publishing.list_price_gbp` and the Weekly Monitor prompt so all three agree.
Until then the Watchdog may false-alarm on a price "mismatch."

---

## Repo visibility / CCR access decision (2026-06-07)

The repo is kept **private**. CCR cloud agents access it via the
`session_context.sources[].git_repository` field (the connected GitHub account on
the claude.ai environment clones it for each run) — confirmed working by the
pre-existing Weekly Post-Launch Monitor trigger which uses the same mechanism.
No GitHub token is embedded in any trigger body. Agent strategies stay protected.
The local repo is therefore **not pushed** by this session; the daemon and the
cloud jobs push to `master` on their own cadence.

---

## Velocity-cliff alert

Implemented inside **Job 1 (Watchdog)** as the rule "BSR worsened by >40% vs last
recorded value (velocity-cliff)" rather than as a local Claude Code hook. A local
PreToolUse/Stop hook cannot observe Amazon sales velocity (no live data at hook
time), so the cloud Watchdog is the correct home for this signal. The Watchdog
surfaces it in ACTION REQUIRED and the Morning Briefing relays it.

---

## How to change a schedule
1. Edit the cron + prompt here and in `prompts/`.
2. `RemoteTrigger update` with the trigger_id and the new body.
3. Update the Registered IDs table.
