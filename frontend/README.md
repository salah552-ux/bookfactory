# BookFactory Frontend

Vite + React + TypeScript + Tailwind UI for the BookFactory pipeline. Talks to the backend in `/backend/` over WebSocket.

## Quick start

```bash
# 1. Backend
cd ../backend && npm install && npm run dev

# 2. Frontend
cd ../frontend && npm install && npm run dev
```

Open http://127.0.0.1:5173. Vite proxies `/ws` → `ws://127.0.0.1:8787/ws`.

## Pages (Phase 1)

| Route | Purpose |
|-------|---------|
| `/` | Fleet — every book with stage tracker |
| `/agents` | All 44 agents, grouped by stage, with one-click run |
| `/runs` | Run history + live streaming log |
| `/books/:slug` | Single book — pipeline, files, build buttons |
| `/demo` | WebSocket probes for backend sanity-check |
| `/settings` | Backend URL, auth token, brand |

## Stack

- React 18 + TypeScript (strict)
- Vite 5 with proxy for `/ws` and `/api`
- Tailwind CSS with brand tokens (navy `#1b3a5c`, tan `#c8b99a`)
- Zustand for run history, TanStack Query (ready for snapshot reads)
- Native WebSocket with reconnection, zod-validated messages
- React Router v6
- lucide-react icons

## Env

```env
VITE_WS_URL=/ws       # or absolute ws:// for prod
VITE_API_URL=/api
VITE_AUTH_MODE=none
VITE_AUTH_TOKEN=
```

Settings page overrides env via `localStorage`.
