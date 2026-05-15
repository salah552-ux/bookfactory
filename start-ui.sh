#!/usr/bin/env bash
# BookFactory UI — one-command launcher.
#
# Modes:
#   bash start-ui.sh              # dev mode (foreground, tsx watch + vite)
#   bash start-ui.sh prod         # docker compose up --build -d
#   bash start-ui.sh stop         # stop docker stack
#   bash start-ui.sh logs         # follow docker logs
#
# Port overrides (handy when 5173 / 8787 are already taken on your machine,
# e.g. Podman / Pod Engine grabs 5173 by default):
#   FRONTEND_PORT=5180 BACKEND_PORT=8790 bash start-ui.sh
#
# Dev mode runs backend + frontend on the host (faster reload). Prod mode
# uses docker-compose for an isolated, reproducible deployment.

set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"

MODE="${1:-dev}"
FRONTEND_PORT="${FRONTEND_PORT:-5180}"
BACKEND_PORT="${BACKEND_PORT:-8787}"

case "$MODE" in
  dev)
    echo "→ Dev mode (host Node + Vite)."
    echo "→ Backend :${BACKEND_PORT}   Frontend :${FRONTEND_PORT}"
    echo "→ Open    http://127.0.0.1:${FRONTEND_PORT}"
    echo "→ Ctrl-C to stop. Logs interleave below."
    echo ""

    if [ ! -d backend/node_modules ]; then
      echo "→ Installing backend deps…"
      (cd backend && npm install --no-audit --no-fund)
    fi
    if [ ! -d frontend/node_modules ]; then
      echo "→ Installing frontend deps…"
      (cd frontend && npm install --no-audit --no-fund)
    fi

    if [ ! -f backend/.env ]; then cp backend/.env.example backend/.env; fi
    if [ ! -f frontend/.env ]; then cp frontend/.env.example frontend/.env; fi

    # Pre-flight: make sure the chosen ports are actually free; bail with a
    # helpful message if not.
    for p in "$BACKEND_PORT" "$FRONTEND_PORT"; do
      if command -v lsof >/dev/null 2>&1; then
        IN_USE=$(lsof -iTCP:"$p" -sTCP:LISTEN -t 2>/dev/null || true)
      elif command -v ss >/dev/null 2>&1; then
        IN_USE=$(ss -tlnH "sport = :$p" 2>/dev/null | head -1)
      else
        IN_USE=""
      fi
      if [ -n "$IN_USE" ]; then
        echo "✘ Port $p is already in use by another process."
        echo "  Override it like:  FRONTEND_PORT=5190 BACKEND_PORT=8795 bash start-ui.sh"
        exit 1
      fi
    done

    # Run both with prefixed output. Trap Ctrl-C to clean up both PIDs.
    (cd backend && PORT="$BACKEND_PORT" HOST=127.0.0.1 BOOKFACTORY_ROOT=.. npm run dev) \
      2>&1 | sed "s/^/[backend] /" &
    BE_PID=$!
    # Tell vite the port + tell the bundle where the backend lives via env.
    (cd frontend && \
      VITE_BACKEND_PORT="$BACKEND_PORT" \
      npx vite --port "$FRONTEND_PORT" --strictPort) \
      2>&1 | sed "s/^/[frontend] /" &
    FE_PID=$!
    trap 'echo ""; echo "→ Stopping…"; kill $BE_PID $FE_PID 2>/dev/null; wait 2>/dev/null; exit 0' INT TERM
    wait
    ;;

  prod)
    echo "→ Prod mode (docker compose up --build -d)."
    FRONTEND_PORT="$FRONTEND_PORT" docker compose up --build -d
    echo ""
    echo "→ Frontend: http://localhost:${FRONTEND_PORT}"
    echo "→ Backend:  http://localhost:${BACKEND_PORT}/health"
    echo "→ Logs:     bash start-ui.sh logs"
    ;;

  stop)
    docker compose down
    ;;

  logs)
    docker compose logs -f
    ;;

  *)
    echo "Usage: bash start-ui.sh [dev|prod|stop|logs]"
    echo ""
    echo "Env overrides:"
    echo "  FRONTEND_PORT  default 5180   (avoid 5173 if Podman/Pod Engine is running)"
    echo "  BACKEND_PORT   default 8787"
    exit 1
    ;;
esac
