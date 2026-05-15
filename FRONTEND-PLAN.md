# BookFactory Frontend — Locked Plan v1.0

**Status:** Plan locked, awaiting real backend drop into `/backend/` for contract reconciliation.
**Stack:** Vite + React 18 + TypeScript + Tailwind + shadcn/ui + WebSocket (streaming).
**Deployment:** Local-first, deployable later (Vercel/Cloudflare-ready, env-driven URLs).
**Scope:** Single control surface for every BookFactory function — all 44 agents, all 11 stages, all build scripts, all books.
**Author/Owner:** S.A. Ibrahim.

> ⚠️ Sections marked **[ASSUMED]** are pending verification against the real backend in `/backend/`.
> Once the backend lands, this doc gets a reconciliation pass and the assumptions are either confirmed or rewritten.

---

## 1. What this UI must do

The UI is **the** interface for BookFactory. It must let one operator drive the entire pipeline from market research to post-launch ads, across multiple books in flight, without ever dropping to a terminal.

Concrete responsibilities:

1. **Show the truth.** Render `pipeline-state.json` for every book, live, with stage progress, gate status, scores, and the next required human action.
2. **Trigger any agent.** Run any of the 44 specialists with one click — single, parallel pair, or full-stage batch — and stream the agent's output back live.
3. **Respect the gates.** brief-validator before writers, fact-checker + book-reviewer + compliance-officer after every chapter, quality-gate between stages, KDP `PUBLISH` typed-word gate. None of these are bypassable from the UI.
4. **Wrap the build scripts.** `new-book.sh`, `build-manuscript.sh`, `build-pdf.sh`, `build-print-pdf.sh`, `approve-chapter.sh`, cover-render scripts — every one gets a button with streaming output.
5. **Edit the files.** BLUEPRINT.md, FACTS.md, KDP-LISTING.md, MARKETING-PLAN.md, chapter markdown, pipeline-state.json — all editable in-browser with schema validation for JSON.
6. **Manage series.** Series-wide views, continuity reports, cross-book consistency, ARC programmes, series-FACTS.
7. **Run post-launch.** AMS bid adjustments, BSR tracking, free-day timing, A+ content updates — all live, weekly cadence baked in.

---

## 2. Backend contract [ASSUMED — pending backend drop]

The backend lives outside this repo currently and will be copied into `/backend/`. Until then, this is the WebSocket contract I'm targeting. If your real backend differs, this gets rewritten on contact.

### Connection

- Single WebSocket endpoint, e.g. `ws://localhost:PORT/ws` (configurable via `VITE_WS_URL`).
- Optional HTTP base for one-shot reads (`VITE_API_URL`) if the backend prefers REST for snapshot data.
- Auth: bearer token in WS query param or first message. Local dev = no token required.

### Client → Server messages

```ts
// Agent invocation
{ type: "agent.run",      runId, agent, book?, args, parallel?: boolean }
{ type: "agent.cancel",   runId }

// Pipeline state
{ type: "pipeline.read",  book }
{ type: "pipeline.patch", book, patch }            // RFC 6902 or shallow merge
{ type: "pipeline.subscribe",   book }             // get pushed updates on this book
{ type: "pipeline.unsubscribe", book }

// Filesystem
{ type: "file.read",   path }
{ type: "file.write",  path, content, sha? }       // sha for optimistic concurrency
{ type: "file.list",   path }
{ type: "file.watch",  path }
{ type: "file.unwatch", path }

// Build scripts
{ type: "build.run",   runId, script, book?, args }

// Quality gates
{ type: "gate.check",  stage, book }               // wraps quality-gate agent
{ type: "gate.brief.validate", book, brief }       // wraps brief-validator

// Orchestrator
{ type: "orchestrator.run", book, stopAt? }        // pipeline-orchestrator agent
{ type: "orchestrator.pause", book }

// KDP publish (hard gate)
{ type: "kdp.publish.confirm", book, phrase }      // backend rejects unless phrase === "PUBLISH"

// Misc
{ type: "ping" }
```

### Server → Client messages

```ts
// Agent / build run lifecycle
{ type: "run.started",  runId, agent|script, book, ts }
{ type: "run.chunk",    runId, stream: "stdout"|"stderr"|"tool", text }
{ type: "run.tool",     runId, tool, args }        // optional — for nice UI rendering
{ type: "run.artefact", runId, path, kind }        // file produced (MARKET-INTELLIGENCE.md, etc.)
{ type: "run.score",    runId, rubric, score, breakdown } // book-reviewer, final-approval
{ type: "run.finished", runId, exitCode, durationMs }

// Pipeline state changes
{ type: "pipeline.snapshot", book, state }
{ type: "pipeline.changed",  book, state, source }

// Filesystem events
{ type: "file.snapshot", path, content, sha }
{ type: "file.changed",  path, sha, source }
{ type: "file.list.snapshot", path, entries }

// Gates
{ type: "gate.result",   stage, book, status: "PASS"|"BLOCK", failures }
{ type: "brief.result",  book, status, errors }

// Errors
{ type: "error", runId?, code, message, detail? }

// Heartbeat
{ type: "pong" }
```

### Validation

Every inbound message validated with zod at the client. Untrusted-content discipline applies — agent stdout/stderr is rendered as text, never as HTML, never `dangerouslySetInnerHTML`.

---

## 3. Information architecture

```
/                              Home — fleet view of every book
/books/new                     Wizard wrapping new-book.sh
/books/:slug                   Book hub — stage tabs
   /overview                   pipeline-state.json rendered as a stage tracker
   /research                   01-research stage
   /planning                   02-planning stage
   /writing                    03-writing — chapters list + per-chapter pipeline
   /writing/:ch                Single chapter — 4-agent pipeline view, brief, manuscript
   /quality                    04-quality
   /optimisation               05-optimisation
   /production                 06-production — builds, covers, final-approval
   /publishing                 07-publishing — KDP listing, marketing, pre-launch, ads, publish gate
   /products                   08-products — Etsy listings, digital products
   /post-launch                10-postlaunch — AMS, A+, BSR
   /files                      File browser for this book
   /state                      Raw pipeline-state.json editor (schema-validated)
/series                        Series dashboard (Cathedral Close, Fix Your Gut, etc.)
/series/:slug                  Single series — continuity, ARC, roadmap
/agents                        Catalogue of all 44 agents — descriptions, manual runner
/agents/:id                    Single agent page — run history, schema for args
/runs                          All runs across all books — log table
/runs/:runId                   Single run — full streaming log, artefacts, retry
/settings                      Backend URL, auth, brand kit, KDP gate phrase, env
```

### Per-stage panel pattern

Every stage tab has the same skeleton:

```
[ Stage Header — stage name, status, gate state, "Run full stage" button ]
[ Agents in this stage — one card per agent with Run / View Last Output / Args ]
[ Deliverables — list of expected output files, link to view ]
[ Human Gate — checkbox bound to pipeline-state.json field, with instruction text ]
[ Stage Log — chronological feed of runs for this stage ]
```

Parallel pairs (per CLAUDE.md) render as a single "Run pair" button that fires both agents in one WS message with `parallel: true`.

---

## 4. Page details (the critical ones)

### 4.1 Home — Fleet View

- Grid of book cards (one per `books/*/pipeline-state.json`).
- Each card shows: cover thumb, title, genre, current stage, % through stage, score (if scored), next required action, last activity timestamp.
- Top bar: "New book", global agent runner, settings.
- Right rail: live activity stream across all books (run.started / run.finished).

### 4.2 Book hub — `/books/:slug/overview`

- Horizontal stage tracker (00 → 10), each stage colour-coded:
  - Grey = not started
  - Blue = in progress
  - Yellow = waiting on human gate
  - Green = passed quality-gate
  - Red = blocked (failure)
- Click a stage → that stage's panel opens.
- Sidebar: book metadata, genre, author, latest scores, links to manuscript / blueprint / facts.

### 4.3 Writing tab — the highest-traffic page

This is where the chapter pipeline runs. Critical requirements from CLAUDE.md:

- Chapter list with status: drafted / fact-checked / reviewed (with score) / compliant / saved / built.
- "New chapter" button → opens brief composer → must pass brief-validator → only then unlocks the writer button.
- Per-chapter pipeline view (vertical stepper):
  1. brief-validator — PASS/BLOCK
  2. writer agent (genre-routed) — streaming output
  3. fact-checker + book-reviewer — run in parallel, scores shown side by side
  4. compliance-officer
  5. Save to manuscript/ (unlocked only when 96/120 from book-reviewer)
  6. Build PDF
  7. agent-log MODE 2 update
- Step buttons are progressive — next step is disabled until previous passes.

### 4.4 Publishing tab — the KDP gate

- Sections: Listing (publisher-agent), Marketing (marketing-agent), Reach (reach-agent), Pre-launch (pre-launch-agent), Ads (amazon-ads-agent), KDP upload (kdp-upload-agent).
- KDP publish requires a typed-word confirmation modal: user must type `PUBLISH` exactly. Backend re-validates the phrase on the WS message.
- Pre-launch shows the launch_ready flag from pipeline-state.json — publish button stays disabled until it's true.

### 4.5 Runs — global log

- Sortable table of every run across every book.
- Click row → `/runs/:runId` opens a full xterm-style log replay (artefacts listed, retry/cancel buttons, link back to the book).
- Filter by agent, book, status, date range.

### 4.6 Settings

- Backend WS URL + HTTP URL.
- Auth token (stored in localStorage for local dev).
- KDP gate phrase verification (read-only — always `PUBLISH`).
- Brand kit toggle (matches `CANVA-BRAND-KIT.md` — navy #1b3a5c, warm tan #c8b99a, Playfair Display + EB Garamond + Lato).
- Theme: light / dark / system.

---

## 5. Tech stack — final

```
Core
  Vite 5
  React 18 + TypeScript (strict)
  React Router v6

Styling
  Tailwind CSS v3
  shadcn/ui                          ← all primitives
  lucide-react                       ← icons
  CSS variables for brand tokens     ← matches CANVA-BRAND-KIT.md

State & data
  TanStack Query v5                  ← snapshot reads, optimistic updates
  Zustand                            ← UI state (selected book, open drawers)
  zod                                ← schema validation for WS + pipeline-state.json
  immer                              ← state patches

WebSocket
  Native WebSocket + a thin reconnection wrapper
  Event bus pattern — components subscribe to WS event types

Editing & rendering
  @monaco-editor/react  (lazy)       ← markdown + JSON editing
  react-markdown + remark-gfm        ← read-only manuscript rendering
  shiki                              ← syntax highlighting
  ajv                                ← validate pipeline-state.json against schema
  xterm.js                           ← run log viewer (terminal feel)

Forms
  react-hook-form + zod resolvers

Charts (for AMS / BSR / post-launch)
  Recharts                           ← simple, good defaults

Dev / build
  Vitest + React Testing Library
  ESLint + Prettier + typescript-eslint
  husky + lint-staged (optional)

Deployable later
  Static build → Vercel / Cloudflare Pages
  Env-driven URLs only — no hardcoded localhost
```

---

## 6. Folder layout

```
/home/user/bookfactory/
├── backend/                         ← your existing backend (to be copied in)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── routes/              ← one folder per route
│   │   │   ├── root.tsx
│   │   │   └── providers.tsx        ← QueryClient, WS, Theme, Router
│   │   ├── components/
│   │   │   ├── ui/                  ← shadcn primitives (generated)
│   │   │   ├── stage/               ← StageTracker, StagePanel, GateButton
│   │   │   ├── agent/               ← AgentCard, AgentRunner, RunLog
│   │   │   ├── chapter/             ← ChapterStepper, BriefComposer
│   │   │   ├── book/                ← BookCard, BookHeader, FleetGrid
│   │   │   ├── editors/             ← MarkdownEditor, JsonEditor
│   │   │   └── kdp/                 ← PublishGateModal
│   │   ├── lib/
│   │   │   ├── ws.ts                ← WebSocket client (reconnect, typed)
│   │   │   ├── api.ts               ← optional HTTP wrapper
│   │   │   ├── schemas/             ← zod schemas — WS messages + pipeline-state
│   │   │   ├── agents.ts            ← static agent catalogue from PIPELINE-MANIFEST.json
│   │   │   └── stages.ts            ← stage definitions
│   │   ├── stores/                  ← zustand stores
│   │   ├── hooks/                   ← useWsEvent, useBookState, useRun
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── brand.css            ← BookFactory brand variables
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   ├── .env.example
│   └── README.md
└── (all existing BookFactory files unchanged)
```

---

## 7. Component inventory (high-leverage components)

These are the components doing the heavy lifting — everything else is shadcn primitives wired together.

| Component | Purpose |
|-----------|---------|
| `<FleetGrid>` | Home page — all books at a glance |
| `<BookCard>` | One book on Home / Series view |
| `<StageTracker>` | Horizontal stage progress bar with click-through |
| `<StagePanel>` | Generic per-stage container — agents, deliverables, gate, log |
| `<AgentCard>` | One agent — Run button, args drawer, last output link |
| `<AgentRunner>` | Modal/drawer for invoking any agent with arg form |
| `<RunLog>` | xterm-style streaming log for a runId |
| `<RunHistoryTable>` | All runs, sortable, filterable |
| `<ChapterStepper>` | 4-agent vertical pipeline UI for one chapter |
| `<BriefComposer>` | Form → brief-validator → writer launch |
| `<GateButton>` | Bound to a pipeline-state.json human-gate field |
| `<PublishGateModal>` | Typed-word `PUBLISH` confirmation |
| `<MarkdownEditor>` | Monaco wrapper for .md files |
| `<JsonEditor>` | Monaco + ajv for pipeline-state.json |
| `<ScoreCard>` | book-reviewer 120-rubric score visualisation |
| `<FactsViewer>` | Read-only render of FACTS.md with anchors |
| `<FileBrowser>` | Tree view of any book folder |
| `<ActivityStream>` | Global live feed of run.* events |
| `<KdpListingForm>` | Title / subtitle / description / keywords / categories editor |
| `<AmsCampaignTable>` | Post-launch ad management |

---

## 8. State strategy

```
TanStack Query        ←  fetch + cache snapshots (file.read, pipeline.read, agent catalogue)
WebSocket events      ←  invalidate Query caches when file.changed / pipeline.changed arrives
Zustand               ←  pure UI state: selectedBookSlug, openRunIds, theme, drawer state
URL                   ←  source of truth for "what is the user looking at"
localStorage          ←  backend URL, auth token, theme preference
```

Rule: never duplicate server state into Zustand. If it lives in pipeline-state.json or a file on disk, it lives in TanStack Query.

---

## 9. Auth + env

```env
VITE_WS_URL=ws://localhost:8787/ws
VITE_API_URL=http://localhost:8787
VITE_AUTH_MODE=none           # none | token
VITE_AUTH_TOKEN=              # used when AUTH_MODE=token
```

- Local dev: AUTH_MODE=none, no token, full access.
- Deployed: AUTH_MODE=token, token issued by backend, stored in localStorage, sent on WS connect.
- All URLs env-driven — no hardcoded localhost anywhere in source.

---

## 10. Build phases

Each phase ends with a working, demoable artefact.

### Phase 1 — Foundation (1 session)
- Vite + React + TS + Tailwind + shadcn scaffold in `/frontend/`.
- Router, providers, theme.
- WS client with reconnection, typed events, zod validation.
- `<RunLog>` component (works with mock events).
- Settings page.
- **Demo:** App boots, connects to WS, settings persisted, mock run can be displayed.

### Phase 2 — Fleet + book hub (1 session)
- `<FleetGrid>` reads all books' pipeline-state.json.
- `<BookCard>`, `<StageTracker>`, `<StagePanel>` shell.
- File browser per book.
- Raw pipeline-state.json editor with schema validation.
- **Demo:** All three books visible, stage progress accurate, click into any book.

### Phase 3 — Generic agent runner (1 session)
- `<AgentRunner>` works for every one of the 44 agents.
- `<RunHistoryTable>` + `/runs/:runId` page.
- Live activity stream on Home.
- **Demo:** Run any agent from the UI, watch it stream, see artefacts appear.

### Phase 4 — Chapter pipeline (1–2 sessions)
- `<BriefComposer>` + brief-validator integration.
- `<ChapterStepper>` 4-agent pipeline.
- Score visualisation (book-reviewer 120 rubric).
- Save-to-manuscript flow with score gating.
- **Demo:** Write a real chapter end-to-end from the UI.

### Phase 5 — Publishing + KDP gate (1 session)
- Publishing tab with all 6 sub-sections.
- `<KdpListingForm>`, `<PublishGateModal>` (typed PUBLISH).
- Pre-launch readiness checklist bound to pipeline-state.json.
- **Demo:** Walk a book through publishing without leaving the browser.

### Phase 6 — Series + post-launch + polish (1 session)
- Series dashboard, continuity reports.
- AMS / BSR / post-launch charts.
- Keyboard shortcuts, dark mode polish, deploy config (Vercel + Cloudflare).
- **Demo:** Full pipeline end-to-end, deployable build produced.

Total estimate: **6–7 sessions** to fully functional. Phase 1+2 alone = usable status board.

---

## 11. Gaps to identify when the real backend arrives

Once `/backend/` is in place I will explicitly check for:

1. Does the backend stream stdout/stderr line-by-line, or buffer? (Affects whether xterm.js is overkill.)
2. Does it expose every agent, or only some? (Catalogue gap.)
3. Does it wrap the build scripts, or assume the frontend calls a shell endpoint? (Security implications.)
4. How does it know which agent to run for which genre? (Read PIPELINE-MANIFEST.json or hardcoded?)
5. Does it enforce the brief-validator → writer order server-side, or trust the client? (It MUST be server-side.)
6. Does it enforce the `PUBLISH` typed word server-side? (It MUST.)
7. How does it surface book-reviewer scores — text-mined from agent output, or structured payload?
8. Is there a notion of "user" / multi-tenant, or single operator?
9. Auth: token, session, OAuth, none?
10. File operations: full read/write of any path under `books/`, or restricted?

Anything that's missing becomes a backend ticket before the relevant frontend phase starts.

---

## 12. Non-negotiables (carried from CLAUDE.md)

- brief-validator before every writer — UI must enforce, backend must enforce.
- 96/120 minimum from book-reviewer to save a chapter — UI gates the save button, backend gates the actual file write.
- quality-gate between every stage — stage transitions require explicit PASS.
- KDP publish requires typed `PUBLISH` — modal + backend validation.
- `manuscript-kdp.html` is reference only — UI never offers it as a KDP upload target.
- Deprecated agents (book-wrapper-agent, epub-builder-agent) — not surfaced in the catalogue at all.
- Build scripts are the only EPUB/DOCX path — `bash build-manuscript.sh` is the button, not custom JS.
- pipeline-state.json is the source of truth — every UI mutation goes through it.

---

## 13. Open questions for you

To finalise after the backend lands:

1. Backend tech (Node + ws? Python + websockets? FastAPI? Hono?) — affects nothing in the UI, but determines deploy strategy.
2. Single user (you), or do other people need access?
3. Should the UI also support pen-name management (multiple author identities), or is S.A. Ibrahim hardcoded?
4. Do you want a built-in keyboard-shortcut palette (Cmd-K) from day one or later?
5. Mobile? My default is desktop-first with the dashboard responsive enough to glance at on a phone, but full editing is desktop-only. Confirm?

---

## 14. Next step

Drop the backend into `/home/user/bookfactory/backend/`. I will:

1. Read every file.
2. Produce `FRONTEND-PLAN-RECONCILIATION.md` listing every ASSUMED section vs reality.
3. Update this doc in place with the corrected contract.
4. Wait for your green light to start Phase 1.

— Plan locked.
