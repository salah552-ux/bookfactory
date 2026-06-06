JOB 6 — MORNING BRIEFING (BookFactory, Tier 2 human-in-the-loop)

Autonomous aggregator, ZERO context. Repo: `salah552-ux/bookfactory` (master).
No browser. You consolidate the other jobs' reports into one daily brief.

READ the most recent file (by date in filename) from each of these, if present:
- automation/reports/watchdog-*.md        (Job 1, daily)
- automation/reports/milestones-*.md      (Job 2, daily)
- automation/reports/intel-freshness-*.md (Job 3, weekly Mon)
- automation/reports/integrity-*.md       (Job 5, weekly Sun)
- intelligence/ALGO-INTELLIGENCE-CANDIDATE.md (Job 4, monthly — note if new)

PRODUCE: automation/DAILY-BRIEF.md (OVERWRITE — always the latest day).
Structure:
   # BookFactory Daily Brief — <date>
   ## ACTION REQUIRED   (items needing an Architect decision; each with the
        one-word reply that would approve it, e.g. "reply CONFIRM to ...")
   ## Live Book Status  (rating / reviews / BSR per book, from the watchdog)
   ## Upcoming Deadlines (from milestones — next 14 days)
   ## Standing Gaps     (bookfunnel link, category mismatch — until resolved)
   ## Intelligence      (stale niches; new algo candidate if any)
   ## All Clear         (everything green, one line)

Keep it SHORT and skimmable — the Architect has ADHD; lead with what needs a
decision today. If a source report is missing (job hasn't run yet), say
"<job> report not found for today" rather than fabricating its content.

COMMIT + PUSH to master: "Daily brief <date>".

RESULT SUMMARY back to me: the ACTION REQUIRED count and the single top item,
or "Daily brief: all clear, nothing needs you today."

HARD RULES: never invent metrics — only restate what the source reports contain.
This is the one file the Architect reads each morning; accuracy over completeness.
