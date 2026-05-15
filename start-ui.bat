@echo off
REM BookFactory Windows launcher.
REM Double-click this file. It checks Node, installs deps if needed,
REM starts both servers, and opens the UI in your browser.

setlocal EnableDelayedExpansion
set "HERE=%~dp0"
cd /d "%HERE%"

echo.
echo ====================================================
echo  BookFactory UI - Windows launcher
echo ====================================================
echo.

REM Check Node
where node >nul 2>&1
if errorlevel 1 (
  echo [X] Node.js is not installed.
  echo     Download it from https://nodejs.org/  ^(LTS version^)
  echo     Then double-click this file again.
  pause
  exit /b 1
)

for /f "delims=" %%v in ('node --version') do set "NODE_VER=%%v"
echo [OK] Node !NODE_VER!

REM Install deps if needed
if not exist "backend\node_modules" (
  echo [..] Installing backend dependencies. This takes a minute on first run...
  pushd backend
  call npm install --no-audit --no-fund
  if errorlevel 1 ( echo [X] backend npm install failed & popd & pause & exit /b 1 )
  popd
)
if not exist "frontend\node_modules" (
  echo [..] Installing frontend dependencies. This takes a minute on first run...
  pushd frontend
  call npm install --no-audit --no-fund
  if errorlevel 1 ( echo [X] frontend npm install failed & popd & pause & exit /b 1 )
  popd
)

if not exist "backend\.env"  copy backend\.env.example backend\.env >nul 2>&1
if not exist "frontend\.env" copy frontend\.env.example frontend\.env >nul 2>&1

set "BACKEND_PORT=8787"
set "FRONTEND_PORT=5180"

echo [..] Starting backend on port %BACKEND_PORT%...
start "BookFactory backend" /min cmd /c "cd /d %HERE%backend && set PORT=%BACKEND_PORT%&& set HOST=127.0.0.1&& set BOOKFACTORY_ROOT=..&& npm run dev"

echo [..] Starting frontend on port %FRONTEND_PORT%...
start "BookFactory frontend" /min cmd /c "cd /d %HERE%frontend && set VITE_PORT=%FRONTEND_PORT%&& set VITE_BACKEND_PORT=%BACKEND_PORT%&& npx vite --port %FRONTEND_PORT% --strictPort"

echo [..] Waiting for servers to come up...
set /a TRIES=0
:wait_loop
  set /a TRIES+=1
  if !TRIES! GTR 60 (
    echo [X] Servers did not come up after 60 seconds.
    echo     Check the two minimised black windows for errors.
    pause
    exit /b 1
  )
  timeout /t 1 /nobreak >nul
  curl -s -o nul --max-time 1 http://127.0.0.1:%BACKEND_PORT%/health
  if errorlevel 1 goto wait_loop
  curl -s -o nul --max-time 1 http://127.0.0.1:%FRONTEND_PORT%/
  if errorlevel 1 goto wait_loop

echo [OK] Both servers ready.
echo.
echo ====================================================
echo  BookFactory ready
echo  UI:  http://127.0.0.1:%FRONTEND_PORT%
echo  API: http://127.0.0.1:%BACKEND_PORT%/health
echo ====================================================
echo.
echo Opening browser...
start "" "http://127.0.0.1:%FRONTEND_PORT%/"

echo.
echo The UI is running in the two minimised black windows.
echo Close those windows when you want to stop the servers.
echo You can close THIS window anytime.
pause
