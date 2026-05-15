# BookFactory Backend

WebSocket control surface for the BookFactory publishing pipeline. Single endpoint, streaming agent output, file ops scoped to the BookFactory root, build script wrappers.

## Quick start

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend boots on `http://127.0.0.1:8787` with the WebSocket at `/ws` and a health check at `/health`.

## Env

| Var | Default | Purpose |
|-----|---------|---------|
| `PORT` | `8787` | HTTP/WS port |
| `HOST` | `127.0.0.1` | Bind address |
| `BOOKFACTORY_ROOT` | `..` (the repo root) | Where books/, .claude/, build scripts live |
| `CLAUDE_CLI` | `claude` | Path to the Claude Code CLI binary |
| `AUTH_MODE` | `none` | `none` or `token` |
| `AUTH_TOKEN` | empty | Required when `AUTH_MODE=token` |
| `LOG_LEVEL` | `info` | Pino log level |

## WebSocket protocol

All messages are JSON with a `type` discriminator. Schemas live in `src/schemas.ts` and are zod-validated server-side.

### Highlights

- `agents.list` → snapshot of all 44 agents (read from `.claude/agents/`)
- `pipeline.list` → state.json for every book under `books/`
- `pipeline.read` / `pipeline.patch` / `pipeline.subscribe` per book
- `file.read` / `file.write` / `file.list` (path scoped to `BOOKFACTORY_ROOT`)
- `agent.run` → spawns `claude -p ... --output-format stream-json` and streams parsed text
- `build.run` → runs one of `build-manuscript.sh`, `build-pdf.sh`, `build-print-pdf.sh`, `new-book.sh`, `approve-chapter.sh`
- `kdp.publish.confirm` → enforces the literal `PUBLISH` typed-word gate

## Safety

- File ops validate every path against `BOOKFACTORY_ROOT`; escapes are rejected.
- `build.run` only accepts a closed enum of script names.
- The KDP publish gate is enforced server-side, not just in the UI.
- Agents are spawned with the user's existing Claude Code auth — no API keys held by this server.

## Status

Phase 1 — foundation:
- [x] Fastify + WS server
- [x] Agent catalogue
- [x] pipeline-state read/write
- [x] File read/write/list
- [x] Claude CLI shell-out with stream-json parsing
- [x] Build script runner
- [x] KDP publish gate
- [ ] File watcher → pipeline.changed broadcasts (Phase 2)
- [ ] Auth token enforcement (Phase 5/deploy)
- [ ] Persistent run history (Phase 3)
