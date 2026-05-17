@echo off
REM BookFactory Windows launcher — diagnostic edition.
REM
REM Double-click this file OR run it from PowerShell:
REM   .\start-ui.bat
REM
REM Worker windows are NOT minimised so you can see real errors.
REM Everything is logged to start-ui.log in the same folder.

setlocal EnableDelayedExpansion
set "HERE=%~dp0"
cd /d "%HERE%"

REM Wipe previous log
break > start-ui.log

echo. & echo. >> start-ui.log
echo ===================================================== >> start-ui.log
echo  BookFactory launcher - %DATE% %TIME% >> start-ui.log
echo ===================================================== >> start-ui.log
echo. >> start-ui.log

echo.
echo =====================================================
echo  BookFactory launcher
echo =====================================================
echo  Logs to: %HERE%start-ui.log
echo.

REM ---------- Check Node ----------
where node >nul 2>&1
if errorlevel 1 (
  echo [X] Node.js is not installed or not on PATH.
  echo     Install from https://nodejs.org/  ^(LTS version^)
  echo [X] Node.js missing >> start-ui.log
  pause
  exit /b 1
)
for /f "delims=" %%v in ('node --version') do set "NODE_VER=%%v"
echo [OK] Node %NODE_VER%
echo [OK] Node %NODE_VER% >> start-ui.log

REM ---------- Check npm ----------
where npm >nul 2>&1
if errorlevel 1 (
  echo [X] npm not on PATH.
  echo [X] npm missing >> start-ui.log
  pause
  exit /b 1
)
for /f "delims=" %%v in ('npm --version') do set "NPM_VER=%%v"
echo [OK] npm %NPM_VER%
echo [OK] npm %NPM_VER% >> start-ui.log

REM ---------- Check curl ----------
where curl >nul 2>&1
if errorlevel 1 (
  echo [!] curl not found. Server health probes will be skipped.
  echo [!] curl missing >> start-ui.log
  set "NO_CURL=1"
) else (
  echo [OK] curl present
)

REM ---------- Check folder structure ----------
if not exist "backend\package.json" (
  echo [X] backend\package.json not found. Are you running this from the bookfactory folder?
  echo     Current folder: %HERE%
  echo [X] backend/package.json missing in %HERE% >> start-ui.log
  pause
  exit /b 1
)
if not exist "frontend\package.json" (
  echo [X] frontend\package.json not found. Wrong folder.
  echo [X] frontend/package.json missing >> start-ui.log
  pause
  exit /b 1
)
echo [OK] backend\ + frontend\ folders present
echo [OK] folder structure OK >> start-ui.log

REM ---------- Ports ----------
set "BACKEND_PORT=8787"
set "FRONTEND_PORT=5180"

netstat -ano | findstr ":%BACKEND_PORT% " | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
  echo [X] Port %BACKEND_PORT% is already in use. Close whatever is using it, or change BACKEND_PORT.
  netstat -ano | findstr ":%BACKEND_PORT% " >> start-ui.log
  pause
  exit /b 1
)
netstat -ano | findstr ":%FRONTEND_PORT% " | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
  echo [X] Port %FRONTEND_PORT% is already in use. Close whatever is using it.
  netstat -ano | findstr ":%FRONTEND_PORT% " >> start-ui.log
  pause
  exit /b 1
)
echo [OK] Ports %BACKEND_PORT% + %FRONTEND_PORT% are free
echo [OK] ports free >> start-ui.log

REM ---------- Install deps ----------
if not exist "backend\node_modules" (
  echo [..] First run - installing backend dependencies. This can take 1-2 minutes...
  echo [..] backend npm install starting >> start-ui.log
  pushd backend
  call npm install --no-audit --no-fund 2>&1
  set "INSTALL_ERR=!ERRORLEVEL!"
  popd
  if not !INSTALL_ERR!==0 (
    echo [X] backend npm install failed with code !INSTALL_ERR!
    echo     Check your internet connection and try again.
    echo [X] backend install failed code !INSTALL_ERR! >> start-ui.log
    pause
    exit /b 1
  )
  echo [OK] backend deps installed
  echo [OK] backend deps installed >> start-ui.log
) else (
  echo [OK] backend deps already installed
)

if not exist "frontend\node_modules" (
  echo [..] Installing frontend dependencies. 1-2 minutes...
  echo [..] frontend npm install starting >> start-ui.log
  pushd frontend
  call npm install --no-audit --no-fund 2>&1
  set "INSTALL_ERR=!ERRORLEVEL!"
  popd
  if not !INSTALL_ERR!==0 (
    echo [X] frontend npm install failed with code !INSTALL_ERR!
    echo [X] frontend install failed code !INSTALL_ERR! >> start-ui.log
    pause
    exit /b 1
  )
  echo [OK] frontend deps installed
  echo [OK] frontend deps installed >> start-ui.log
) else (
  echo [OK] frontend deps already installed
)

REM ---------- .env files ----------
if not exist "backend\.env"  copy /Y "backend\.env.example"  "backend\.env"  >nul 2>&1
if not exist "frontend\.env" copy /Y "frontend\.env.example" "frontend\.env" >nul 2>&1

REM ---------- Start backend + frontend (NOT minimised) ----------
echo.
echo [..] Starting backend on port %BACKEND_PORT% (window will open)...
start "BookFactory backend" cmd /k "cd /d %HERE%backend && set PORT=%BACKEND_PORT%&& set HOST=127.0.0.1&& set BOOKFACTORY_ROOT=..&& npm run dev"

echo [..] Starting frontend on port %FRONTEND_PORT% (window will open)...
start "BookFactory frontend" cmd /k "cd /d %HERE%frontend && set VITE_PORT=%FRONTEND_PORT%&& set VITE_BACKEND_PORT=%BACKEND_PORT%&& npx vite --port %FRONTEND_PORT% --strictPort"

if defined NO_CURL (
  echo.
  echo [!] Skipping health probes ^(curl missing^). Give it 30-60 seconds.
  echo [!] Opening browser anyway.
  timeout /t 30 /nobreak >nul
  start "" "http://127.0.0.1:%FRONTEND_PORT%/"
  goto :done
)

REM ---------- Wait for servers ----------
echo.
echo [..] Waiting for servers to come up (up to 90 seconds)...
set /a TRIES=0
:wait_loop
  set /a TRIES+=1
  if !TRIES! GTR 90 (
    echo.
    echo [X] Servers didn't come up after 90 seconds.
    echo     Check the two black windows that opened - they show real errors.
    echo     Common causes:
    echo       1. Antivirus blocking node.exe ^(add an exclusion^)
    echo       2. Corporate firewall blocking npm registry
    echo       3. Out-of-date Node ^(need v18+; you have %NODE_VER%^)
    echo [X] startup timeout after 90s >> start-ui.log
    pause
    exit /b 1
  )
  timeout /t 1 /nobreak >nul
  curl -s -o nul --max-time 1 http://127.0.0.1:%BACKEND_PORT%/health
  if errorlevel 1 goto wait_loop
  curl -s -o nul --max-time 1 http://127.0.0.1:%FRONTEND_PORT%/
  if errorlevel 1 goto wait_loop

echo [OK] Both servers ready after !TRIES! seconds.
echo [OK] Both ready >> start-ui.log

:done
echo.
echo =====================================================
echo  BookFactory ready
echo  UI:  http://127.0.0.1:%FRONTEND_PORT%
echo  API: http://127.0.0.1:%BACKEND_PORT%/health
echo =====================================================
echo.
echo Opening browser...
start "" "http://127.0.0.1:%FRONTEND_PORT%/"

echo.
echo The UI is running in the two black windows that opened.
echo Close those windows when you want to stop the servers.
echo You can close THIS window anytime.
echo.
pause
