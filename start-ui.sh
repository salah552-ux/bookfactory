#!/usr/bin/env bash
# BookFactory UI — one-command launcher.
#
# Modes:
#   bash start-ui.sh              # dev mode (foreground, tsx watch + vite)
#   bash start-ui.sh prod         # docker compose up --build -d
#   bash start-ui.sh stop         # stop docker stack
#   bash start-ui.sh logs         # follow docker logs
#
# Dev mode runs backend + frontend on the host (faster reload). Prod mode
# uses docker-compose for an isolated, reproducible deployment.

set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"

MODE="${1:-dev}"

case "$MODE" in
  dev)
    echo "→ Dev mode (host Node + Vite). Backend :8787, frontend :5173."
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

    # Run both with prefixed output. Trap Ctrl-C to clean up both PIDs.
    (cd backend && npm run dev) 2>&1 | sed "s/^/[backend] /" &
    BE_PID=$!
    (cd frontend && npm run dev) 2>&1 | sed "s/^/[frontend] /" &
    FE_PID=$!
    trap 'echo ""; echo "→ Stopping…"; kill $BE_PID $FE_PID 2>/dev/null; wait 2>/dev/null; exit 0' INT TERM
    wait
    ;;

  prod)
    echo "→ Prod mode (docker compose up --build -d)."
    docker compose up --build -d
    echo ""
    echo "→ Frontend: http://localhost:${FRONTEND_PORT:-5173}"
    echo "→ Backend:  http://localhost:8787/health"
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
    exit 1
    ;;
esac
