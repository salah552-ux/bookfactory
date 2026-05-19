#!/usr/bin/env bash
# BookFactory local daemon runner.
# Run this on your own machine — the claude CLI must be logged in
# via `claude login` (uses your Claude Pro subscription, no API key needed).
#
# Set up as a cron job:
#   crontab -e
#   0 */6 * * * /path/to/bookfactory/run-daemon-local.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/.daemon-local.log"
MAX_LOG_LINES=500

log() { echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] $*" | tee -a "$LOG_FILE"; }

# Trim log so it doesn't grow forever
if [ -f "$LOG_FILE" ]; then
  tail -n "$MAX_LOG_LINES" "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
fi

log "=== daemon run start ==="

# Check kill switch
if [ -f "$SCRIPT_DIR/PAUSE_AUTOMATION" ]; then
  log "PAUSE_AUTOMATION present — skipping run"
  exit 0
fi

# Check claude CLI is available and authenticated
if ! command -v claude &>/dev/null; then
  log "ERROR: claude CLI not found. Install with: npm install -g @anthropic-ai/claude-code"
  exit 1
fi

# Pull latest changes before running
log "pulling latest from GitHub..."
git -C "$SCRIPT_DIR" pull --ff-only origin master 2>&1 | while read -r line; do log "  git: $line"; done

# Install backend deps if node_modules is missing
if [ ! -d "$SCRIPT_DIR/backend/node_modules" ]; then
  log "installing backend dependencies..."
  npm --prefix "$SCRIPT_DIR/backend" install --no-audit --no-fund 2>&1 | while read -r line; do log "  npm: $line"; done
fi

# Run the live daemon (DAEMON_LIVE=true skips dry-run mode)
log "running live daemon..."
cd "$SCRIPT_DIR/backend"
DAEMON_LIVE=true BOOKFACTORY_ROOT="$SCRIPT_DIR" npm run daemon:live 2>&1 | while read -r line; do log "  daemon: $line"; done

# Commit everything the agents produced
log "staging agent output..."
git -C "$SCRIPT_DIR" config user.name  "bookfactory-daemon"
git -C "$SCRIPT_DIR" config user.email "daemon@bookfactory.local"

# Stage all book changes (manuscripts, pipeline-state, spend logs, etc.)
git -C "$SCRIPT_DIR" add books/ 2>/dev/null || true
git -C "$SCRIPT_DIR" add NOTIFICATIONS.md  2>/dev/null || true
git -C "$SCRIPT_DIR" add AUTOMATION-LOG.md 2>/dev/null || true

if git -C "$SCRIPT_DIR" diff --staged --quiet; then
  log "no changes to commit"
else
  COMMIT_MSG="daemon: $(date -u +'%Y-%m-%dT%H:%M:%SZ') local run"
  git -C "$SCRIPT_DIR" commit -m "$COMMIT_MSG"
  git -C "$SCRIPT_DIR" push origin master
  log "pushed: $COMMIT_MSG"
fi

log "=== daemon run complete ==="
