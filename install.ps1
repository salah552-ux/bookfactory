# BookFactory — one-shot installer for Windows.
#
# Paste this into PowerShell:
#
#   iex (iwr 'https://raw.githubusercontent.com/salah552-ux/bookfactory/master/install.ps1').Content
#
# It will:
#  1. Check for Node.js, install via winget if missing
#  2. Check for git, install via winget if missing
#  3. Clone the bookfactory repo to your Desktop (or update it if already there)
#  4. Install backend + frontend deps
#  5. Start both servers
#  6. Open the UI in your default browser

$ErrorActionPreference = 'Continue'
$global:LASTEXITCODE = 0

function Write-Step($msg) {
  Write-Host ""
  Write-Host "→ $msg" -ForegroundColor Cyan
}
function Write-OK($msg)    { Write-Host "  ✓ $msg" -ForegroundColor Green }
function Write-Warn($msg)  { Write-Host "  ! $msg" -ForegroundColor Yellow }
function Write-Fail($msg)  { Write-Host "  ✘ $msg" -ForegroundColor Red }

Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  BookFactory — one-shot installer" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan

# ── 1. Node.js ─────────────────────────────────────────────────
Write-Step "Checking Node.js"
$nodeOk = $false
try {
  $nodeVer = & node --version 2>$null
  if ($LASTEXITCODE -eq 0 -and $nodeVer) {
    $major = [int]($nodeVer -replace 'v(\d+).*','$1')
    if ($major -ge 18) { Write-OK "node $nodeVer"; $nodeOk = $true }
    else { Write-Warn "node $nodeVer is too old (need v18+)" }
  }
} catch {}

if (-not $nodeOk) {
  Write-Step "Installing Node.js via winget (this may take 1-2 minutes)..."
  & winget install --id OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements 2>$null
  if ($LASTEXITCODE -ne 0) {
    Write-Fail "winget install failed. Install Node.js manually from https://nodejs.org/ then re-run this installer."
    Write-Host ""; Read-Host "Press Enter to open hosted demo instead"
    Start-Process "https://salah552-ux.github.io/bookfactory/"
    exit 1
  }
  # Refresh PATH so node is found in this session
  $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
  Write-OK "Node installed"
}

# ── 2. git ─────────────────────────────────────────────────────
Write-Step "Checking git"
$gitOk = $false
try {
  & git --version 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) { Write-OK "git present"; $gitOk = $true }
} catch {}

if (-not $gitOk) {
  Write-Step "Installing git via winget..."
  & winget install --id Git.Git --silent --accept-source-agreements --accept-package-agreements 2>$null
  $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
  Write-OK "git installed"
}

# ── 3. Clone / update repo ─────────────────────────────────────
$DEST = Join-Path $env:USERPROFILE "Desktop\bookfactory"

if (Test-Path $DEST) {
  Write-Step "Updating existing repo at $DEST"
  Set-Location $DEST
  & git fetch origin master 2>&1 | Out-Null
  & git checkout master 2>&1 | Out-Null
  & git reset --hard origin/master 2>&1 | Out-Null
  Write-OK "repo updated"
} else {
  Write-Step "Cloning repo to $DEST"
  & git clone https://github.com/salah552-ux/bookfactory.git $DEST 2>&1 | Out-Null
  if (-not (Test-Path (Join-Path $DEST "backend"))) {
    Write-Fail "Clone failed. Network or git problem."
    Start-Process "https://salah552-ux.github.io/bookfactory/"
    exit 1
  }
  Set-Location $DEST
  Write-OK "repo cloned"
}

# ── 4. Install deps ────────────────────────────────────────────
Write-Step "Installing backend dependencies (1-2 min on first run)..."
Set-Location (Join-Path $DEST "backend")
& npm install --no-audit --no-fund 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Fail "backend npm install failed. Falling back to hosted demo."
  Start-Process "https://salah552-ux.github.io/bookfactory/"
  exit 1
}
Write-OK "backend deps installed"

Write-Step "Installing frontend dependencies..."
Set-Location (Join-Path $DEST "frontend")
& npm install --no-audit --no-fund 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Fail "frontend npm install failed."
  Start-Process "https://salah552-ux.github.io/bookfactory/"
  exit 1
}
Write-OK "frontend deps installed"

# ── 5. .env defaults ───────────────────────────────────────────
Set-Location $DEST
if (-not (Test-Path "backend\.env"))  { Copy-Item "backend\.env.example"  "backend\.env" }
if (-not (Test-Path "frontend\.env")) { Copy-Item "frontend\.env.example" "frontend\.env" }

# ── 6. Start servers ───────────────────────────────────────────
$BACKEND_PORT  = 8787
$FRONTEND_PORT = 5180

Write-Step "Starting backend on port $BACKEND_PORT"
$backendCmd = "cd `"$DEST\backend`"; `$env:PORT=$BACKEND_PORT; `$env:HOST='127.0.0.1'; `$env:BOOKFACTORY_ROOT='..'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit","-Command",$backendCmd

Write-Step "Starting frontend on port $FRONTEND_PORT"
$frontendCmd = "cd `"$DEST\frontend`"; `$env:VITE_PORT=$FRONTEND_PORT; `$env:VITE_BACKEND_PORT=$BACKEND_PORT; npx vite --port $FRONTEND_PORT --strictPort"
Start-Process powershell -ArgumentList "-NoExit","-Command",$frontendCmd

# ── 7. Wait + open browser ─────────────────────────────────────
Write-Step "Waiting for servers (up to 60 seconds)..."
$ready = $false
for ($i = 1; $i -le 60; $i++) {
  Start-Sleep -Seconds 1
  try {
    $r1 = Invoke-WebRequest "http://127.0.0.1:$BACKEND_PORT/health"  -UseBasicParsing -TimeoutSec 1 -ErrorAction Stop
    $r2 = Invoke-WebRequest "http://127.0.0.1:$FRONTEND_PORT/"        -UseBasicParsing -TimeoutSec 1 -ErrorAction Stop
    if ($r1.StatusCode -eq 200 -and $r2.StatusCode -eq 200) { $ready = $true; break }
  } catch {}
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
if ($ready) {
  Write-OK "BookFactory is running locally"
  Write-Host "  UI:  http://127.0.0.1:$FRONTEND_PORT" -ForegroundColor Green
  Write-Host "  API: http://127.0.0.1:$BACKEND_PORT/health" -ForegroundColor Green
  Start-Process "http://127.0.0.1:$FRONTEND_PORT/"
} else {
  Write-Warn "Servers didn't come up in 60s. Opening hosted demo as fallback."
  Write-Host "  Check the two PowerShell windows that opened — they have the real error." -ForegroundColor Yellow
  Start-Process "https://salah552-ux.github.io/bookfactory/"
}
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  To stop the servers later: close the two PowerShell windows."
Write-Host "  To start again: double-click start-ui.bat in $DEST"
Write-Host ""
