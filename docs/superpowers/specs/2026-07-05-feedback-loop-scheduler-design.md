# Feedback Loop + Scheduler — Design Spec

**Date:** 2026-07-05
**Goal:** The system learns from real sales outcomes automatically, on a schedule — a self-improving factory instead of one the Architect must drive.

## What exists (build on, don't duplicate)
`automation/CRON-MANIFEST.md` (2026-06-07): 6 cloud jobs designed (watchdog, milestones, intel-freshness, algo-sweep, integrity, briefing) — but the roster is stale (2 UK books; 4 books are live now incl. US-market vagus) and CCR routines auto-expire (~7 days per the manifest), so the layer is dormant. `run-daemon-local.sh` exists for local claude-CLI cron runs. `post-launch-tracker` + `post-launch-agent` exist but never write lessons.

## The gap being closed
Data flows IN (trackers, watchdogs) but nothing flows into `intelligence/LESSONS.md` or back into strategy. And nothing runs unless the Architect asks.

## Components

### C1 — Job 7: Weekly Feedback Heartbeat (new, the keystone)
`automation/prompts/job7-weekly-heartbeat.md` — a fully self-contained weekly prompt (zero-context executable). Steps per LIVE book:
1. Scrape the PUBLIC Amazon product page (BSR, review count, rating, price) — public pages only; no KDP login.
2. Log metrics via the post-launch-tracker pattern (LAUNCH-TRACKER.md + pipeline-state).
3. **Reality audit:** compare live page vs pipeline-state (status/ASIN/price) — flag drift (the h-pylori class of bug).
4. **Outcome lessons:** append evidence-backed entries to `intelligence/LESSONS.md` (e.g., a change that preceded a BSR/review shift — evidence cited to the tracker data). No invented numbers.
5. **Algo-shift flag:** if observed behavior contradicts ALGO-INTELLIGENCE.md, flag "re-run algo-intelligence-agent".
6. Output one compact weekly ACTION BRIEF for the Architect.

### C2 — Agent wiring (additive)
`post-launch-tracker` + `post-launch-agent`: after each weekly reading, append outcome lessons to `intelligence/LESSONS.md` per its entry rules (dated, book slug, evidence) and flag algo shifts.

### C3 — Scheduler (local, reliable)
- New `run-weekly-heartbeat.cmd` (Windows) invoking `claude -p` with the job7 prompt file (daemon pattern; claude CLI already logged in locally).
- Registered via Windows Task Scheduler (`schtasks`) weekly. Local execution because the heartbeat WRITES to the repo (LESSONS.md, trackers) — cloud routines can't (manifest constraint #1/#2).
- `CRON-MANIFEST.md` updated: current live-book roster (4 live incl. vagus US), Job 7 entry, registration commands, note that cloud jobs 1-6 are expired and how to re-register if wanted.

## Success criteria
- job7 prompt file exists, fully self-contained (paths, slugs, thresholds inline).
- Both post-launch agents reference LESSONS.md (grep-verifiable); frontmatters quoted; sync clean.
- `schtasks` weekly task registered and verifiable via `schtasks /query`.
- CRON-MANIFEST roster current.

## Out of scope
Re-registering the 6 cloud jobs (documented, user's call); KDP-internal metrics (needs logged-in browser); ads automation.
