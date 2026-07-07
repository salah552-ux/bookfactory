@echo off
rem BookFactory Weekly Feedback Heartbeat — local scheduled job (see automation/CRON-MANIFEST.md, LOCAL JOBS / Job 7)
rem Requires the claude CLI logged in locally. Registered via Windows Task Scheduler.
cd /d C:\Users\salah\BookFactory
if not exist automation\reports mkdir automation\reports
echo [%date% %time%] heartbeat run start >> automation\reports\heartbeat-run.log
claude -p "Read automation/prompts/job7-weekly-heartbeat.md and execute it exactly as written. Work autonomously end to end; do not ask questions. Public Amazon pages only; never invent numbers." >> automation\reports\heartbeat-run.log 2>&1
echo [%date% %time%] heartbeat run end (exit %errorlevel%) >> automation\reports\heartbeat-run.log
