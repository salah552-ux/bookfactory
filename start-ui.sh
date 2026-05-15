#!/usr/bin/env bash
# BookFactory UI — one-command launcher with verbose diagnostics.
#
# Usage:
#   bash start-ui.sh              # dev mode (default — host Node + Vite)
#   bash start-ui.sh prod         # docker compose
#   bash start-ui.sh stop         # stop docker stack
#   bash start-ui.sh logs         # follow docker logs
#   bash start-ui.sh doctor       # only run pre-flight checks
#
# Env overrides:
#   FRONTEND_PORT=5190 BACKEND_PORT=8795 bash start-ui.sh
#   HOST_BIND=0.0.0.0 bash start-ui.sh         # bind to all interfaces

HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"

MODE="${1:-dev}"
DEFAULT_BACKEND_PORT="${BACKEND_PORT:-8787}"
DEFAULT_FRONTEND_PORT="${FRONTEND_PORT:-5180}"
HOST_BIND="${HOST_BIND:-127.0.0.1}"
BE_PID=""
FE_PID=""

c_red()   { printf "\033[31m%s\033[0m" "$1"; }
c_green() { printf "\033[32m%s\033[0m" "$1"; }
c_yel()   { printf "\033[33m%s\033[0m" "$1"; }
c_dim()   { printf "\033[2m%s\033[0m" "$1"; }
c_bold()  { printf "\033[1m%s\033[0m" "$1"; }
step()    { printf "%s %s\n" "$(c_dim "→")" "$1"; }
ok()      { printf "%s %s\n" "$(c_green "✓")" "$1"; }
warn()    { printf "%s %s\n" "$(c_yel "!")" "$1"; }
fail()    { printf "%s %s\n" "$(c_red "✘")" "$1" >&2; }

cleanup() {
  echo ""
  step "Stopping…"
  [ -n "$FE_PID" ] && kill "$FE_PID" 2>/dev/null
  [ -n "$BE_PID" ] && kill "$BE_PID" 2>/dev/null
  wait 2>/dev/null
  exit 0
}
trap cleanup INT TERM

port_in_use() {
  local p="$1"
  if command -v lsof >/dev/null 2>&1; then
    lsof -iTCP:"$p" -sTCP:LISTEN -t 2>/dev/null | head -1
  elif command -v ss >/dev/null 2>&1; then
    ss -tlnH "sport = :$p" 2>/dev/null | awk 'NR==1{print "in_use"; exit}'
  elif command -v netstat >/dev/null 2>&1; then
    netstat -tln 2>/dev/null | awk -v p=":$p" '$4 ~ p {print "in_use"; exit}'
  fi
}

find_free_port() {
  local start="$1"
  for try in $(seq "$start" $((start + 20))); do
    if [ -z "$(port_in_use "$try")" ]; then
      echo "$try"
      return 0
    fi
  done
  return 1
}

doctor() {
  printf "\n%s\n" "$(c_bold "BookFactory doctor")"
  echo "─────────────────────────────────────────"

  # Node + npm
  if command -v node >/dev/null 2>&1; then
    local nv; nv="$(node --version 2>&1)"
    local major; major="$(echo "$nv" | sed 's/^v//' | cut -d. -f1)"
    if [ "$major" -ge 18 ] 2>/dev/null; then
      ok "node $nv"
    else
      fail "node $nv — needs v18 or newer. Install from https://nodejs.org/"
      return 1
    fi
  else
    fail "node is not installed. Install from https://nodejs.org/"
    return 1
  fi

  if command -v npm >/dev/null 2>&1; then
    ok "npm $(npm --version 2>&1)"
  else
    fail "npm is missing — should come with node."
    return 1
  fi

  # Repo layout
  [ -d backend ]  && ok "backend/  found"  || { fail "backend/ missing — wrong directory?"; return 1; }
  [ -d frontend ] && ok "frontend/ found" || { fail "frontend/ missing — wrong directory?"; return 1; }
  [ -d books ]    && ok "books/    found" || warn "books/ missing — fleet view will be empty"

  # claude CLI (optional but agents won't run without it)
  if command -v claude >/dev/null 2>&1; then
    ok "claude CLI at $(command -v claude)"
  else
    warn "claude CLI not on PATH — UI still loads, but agent runs will fail."
  fi

  # Ports
  if [ -n "$(port_in_use "$DEFAULT_BACKEND_PORT")" ]; then
    local alt; alt=$(find_free_port $((DEFAULT_BACKEND_PORT + 1)))
    warn "backend port $DEFAULT_BACKEND_PORT busy — will use $alt"
    BACKEND_PORT="$alt"
  else
    ok "backend port $DEFAULT_BACKEND_PORT free"
    BACKEND_PORT="$DEFAULT_BACKEND_PORT"
  fi
  if [ -n "$(port_in_use "$DEFAULT_FRONTEND_PORT")" ]; then
    local alt; alt=$(find_free_port $((DEFAULT_FRONTEND_PORT + 1)))
    warn "frontend port $DEFAULT_FRONTEND_PORT busy — will use $alt"
    FRONTEND_PORT="$alt"
  else
    ok "frontend port $DEFAULT_FRONTEND_PORT free"
    FRONTEND_PORT="$DEFAULT_FRONTEND_PORT"
  fi

  echo "─────────────────────────────────────────"
  return 0
}

wait_for_http() {
  local url="$1"
  local label="$2"
  local tries="${3:-40}"
  for i in $(seq 1 "$tries"); do
    if curl -fsS --max-time 1 "$url" >/dev/null 2>&1; then
      ok "$label ready ($url)"
      return 0
    fi
    sleep 0.5
  done
  fail "$label did not become ready at $url after $((tries / 2))s"
  return 1
}

run_dev() {
  doctor || exit 1

  if [ ! -d backend/node_modules ]; then
    step "Installing backend deps (one-time)…"
    (cd backend && npm install --no-audit --no-fund) || { fail "backend npm install failed"; exit 1; }
  fi
  if [ ! -d frontend/node_modules ]; then
    step "Installing frontend deps (one-time)…"
    (cd frontend && npm install --no-audit --no-fund) || { fail "frontend npm install failed"; exit 1; }
  fi

  [ -f backend/.env ]  || cp backend/.env.example  backend/.env  2>/dev/null || true
  [ -f frontend/.env ] || cp frontend/.env.example frontend/.env 2>/dev/null || true

  step "Starting backend on $HOST_BIND:$BACKEND_PORT…"
  (
    cd backend
    PORT="$BACKEND_PORT" HOST="$HOST_BIND" BOOKFACTORY_ROOT=.. \
      npm run dev 2>&1 | sed "s/^/$(c_dim '[backend] ')/"
  ) &
  BE_PID=$!

  wait_for_http "http://127.0.0.1:$BACKEND_PORT/health" "backend" 60 || {
    fail "backend failed to start — check the [backend] logs above"
    cleanup
  }

  step "Starting frontend on $HOST_BIND:$FRONTEND_PORT…"
  (
    cd frontend
    VITE_PORT="$FRONTEND_PORT" VITE_BACKEND_PORT="$BACKEND_PORT" \
      npx vite --port "$FRONTEND_PORT" --host "$HOST_BIND" --strictPort 2>&1 \
      | sed "s/^/$(c_dim '[frontend]')/"
  ) &
  FE_PID=$!

  wait_for_http "http://127.0.0.1:$FRONTEND_PORT/" "frontend" 60 || {
    fail "frontend failed to start — check the [frontend] logs above"
    cleanup
  }

  echo ""
  echo "═══════════════════════════════════════════════════════════"
  printf " %s %s\n" "$(c_bold 'BookFactory ready ✦')" "$(c_dim "Ctrl-C to stop")"
  echo "═══════════════════════════════════════════════════════════"
  printf "  %s  $(c_bold "http://127.0.0.1:$FRONTEND_PORT")\n" "$(c_green 'UI    ')"
  printf "  %s  http://127.0.0.1:$BACKEND_PORT/health\n"     "$(c_green 'API   ')"
  echo ""
  step "Logs will stream below. Open the UI URL in your browser."
  echo ""

  wait
}

case "$MODE" in
  doctor)
    doctor
    ;;
  dev)
    run_dev
    ;;
  prod)
    step "Starting docker stack…"
    FRONTEND_PORT="$DEFAULT_FRONTEND_PORT" docker compose up --build -d || { fail "docker compose failed"; exit 1; }
    ok "Frontend: http://localhost:${DEFAULT_FRONTEND_PORT}"
    ok "Backend:  http://localhost:${DEFAULT_BACKEND_PORT}/health"
    echo "    Logs:  bash start-ui.sh logs"
    ;;
  stop)
    docker compose down
    ;;
  logs)
    docker compose logs -f
    ;;
  *)
    echo "Usage: bash start-ui.sh [dev|prod|stop|logs|doctor]"
    echo ""
    echo "Env overrides:"
    echo "  FRONTEND_PORT   default 5180 (auto-skips to next free if taken)"
    echo "  BACKEND_PORT    default 8787 (auto-skips to next free if taken)"
    echo "  HOST_BIND       default 127.0.0.1 (use 0.0.0.0 to expose on LAN)"
    exit 1
    ;;
esac
