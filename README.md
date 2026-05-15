# BookFactory

Full-stack control surface for the BookFactory publishing pipeline. 44 specialist agents, 11 stages, every gate enforced, every build wrapped, live-streaming agent output. Drives the entire flow from market research to KDP launch and post-launch ads from a single browser.

## Quick start

```bash
# Dev mode — host Node + Vite, fastest iteration
bash start-ui.sh

# Open http://127.0.0.1:5173
```

Or deploy via Docker:

```bash
bash start-ui.sh prod
bash start-ui.sh logs
bash start-ui.sh stop
```

## Repo layout

```
/                              repo root — books/, agents, build scripts (the BookFactory)
/backend/                      Fastify + WebSocket server (Node 22, TS)
/frontend/                     Vite + React + Tailwind UI (the control surface)
/scripts/                      assemble / cover / screenshot helpers
/.claude/agents/               44 specialist agents organised by 11 stages
/books/                        per-book project folders
/docker-compose.yml            one-command deploy
/start-ui.sh                   dev / prod launcher
/FRONTEND-PLAN.md              the locked architecture doc
/CLAUDE.md                     orchestrator rules — read first
```

## What the UI does

| Route | Purpose |
|-------|---------|
| `/` | Fleet — every book + live stage tracker |
| `/books/new` | New book wizard wrapping `new-book.sh` |
| `/books/:slug` | Per-book hub — stage tracker, builds, files, publish gate |
| `/books/:slug/writing` | Chapter pipeline: brief-validator → writer → fact-checker → book-reviewer ≥96 → compliance-officer |
| `/books/:slug/stage/:id` | Generic stage panel (works for all 10 stages) |
| `/books/:slug/files` | File browser + Monaco editor (markdown + JSON) |
| `/books/:slug/state` | Schema-validated `pipeline-state.json` editor |
| `/series` | Series facts, roadmap, continuity, brand kit |
| `/agents` | All 44 agents catalogued, one-click run modal |
| `/runs` | Persistent run history, live streaming output |
| `/settings` | Backend URL, auth token, brand reference |

## Architecture in two minutes

```
┌──────────────────────────────┐         ┌──────────────────────────────┐
│  Browser                     │   WS    │  Backend (Fastify)           │
│  Vite + React                ├────────►│  - Spawns `claude` CLI       │
│  - Zustand for runs          │         │  - Reads/writes books/       │
│  - TanStack Query for reads  │         │  - Wraps build scripts        │
│  - Monaco editors            │         │  - Watches FS, broadcasts     │
│  - Recharts (lazy)           │         │  - Persists runs to disk      │
└──────────────────────────────┘         │  - Enforces auth + gates      │
                                         └──────────────┬───────────────┘
                                                        │
                                          spawn `claude -p ... --output-format stream-json`
                                                        │
                                                        ▼
                                            ┌───────────────────────┐
                                            │ Claude Code CLI       │
                                            │ Runs the right agent  │
                                            └───────────────────────┘
```

- WebSocket is the single transport. Messages are zod-validated on both sides.
- Backend shells out to the host's `claude` CLI for agent invocations — no API keys held server-side.
- File ops are scoped to `BOOKFACTORY_ROOT`; path escapes are rejected.
- Run state is persisted under `.bookfactory-runs/` so history survives restarts.

## Environment

Backend (`backend/.env`):
```env
PORT=8787
HOST=127.0.0.1
BOOKFACTORY_ROOT=..
CLAUDE_CLI=claude
AUTH_MODE=none          # set to "token" for production
AUTH_TOKEN=             # required when AUTH_MODE=token
LOG_LEVEL=info
```

Frontend (`frontend/.env`):
```env
VITE_WS_URL=/ws
VITE_API_URL=/api
```

In Docker, `frontend/nginx.conf` proxies `/ws` to the backend container.

## Gates enforced by the UI and backend

1. **brief-validator before every writer** — the chapter pipeline UI literally disables the writer button until brief-validator passes.
2. **96/120 from book-reviewer to save a chapter** — Save button gated by the parsed score.
3. **Quality-gate between stages** — every stage panel surfaces its agents + human gate.
4. **KDP `PUBLISH` typed-word** — the modal accepts only the literal `PUBLISH`; the backend re-validates server-side.
5. **`launch_ready` flag in `pipeline-state.json`** — the Publishing stage panel surfaces it.

## Build commands wrapped

`new-book.sh`, `build-manuscript.sh`, `build-pdf.sh`, `build-print-pdf.sh`, `approve-chapter.sh` — every one has a button in the UI with streaming output.

## Screenshots

```bash
# Both servers must be running first.
node scripts/screenshot-ui.mjs
# → .screenshots/*.png  (gitignored)
```

## Stack

- **Backend**: Node 22, Fastify, @fastify/websocket, zod, chokidar, fast-glob
- **Frontend**: React 18, TypeScript strict, Vite 5, Tailwind, TanStack Query, Zustand, Monaco (lazy), Recharts (lazy), zod, ajv
- **Deploy**: Docker multi-stage builds, nginx for the static frontend, host-mounted Claude CLI

## Status

| Phase | What | Done |
|-------|------|------|
| 1 | Foundation: WS + fleet + agents + runs | ✓ |
| 2 | File watcher + Monaco editors | ✓ |
| 3 | Chapter pipeline + agent runner modal + publish gate | ✓ |
| 4 | Generic stage panel for all 10 stages + auth + fonts | ✓ |
| 5 | Persistent runs + new book + series + post-launch charts | ✓ |
| 6 | Docker + one-command launch + code-split | ✓ |
