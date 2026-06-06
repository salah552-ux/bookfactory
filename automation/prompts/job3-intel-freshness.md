JOB 3 — INTELLIGENCE FRESHNESS GUARD (BookFactory)

Autonomous agent, ZERO context. Repo: `salah552-ux/bookfactory` (master).
No browser — you only check timestamps and flag staleness.

READ: intelligence/opportunity-db.json
For every key under "niches", read niche_name and last_harvested.

RULE: a niche is STALE if last_harvested is more than 14 days before today.

KNOWN NICHES (verify against the file):
- gut-health (last_harvested 2026-05-13)
- cozy-mystery (last_harvested 2026-06-01)
- vagus-nerve (last_harvested 2026-06-03)

STEPS:
1. Compute age in days for each niche.
2. List stale niches and, for each, the exact commands the Architect's LOCAL
   session must run (the cloud agent CANNOT run the local Playwright harvester):
       harvest <niche>
       analyse opportunities <niche>
3. Write automation/reports/intel-freshness-YYYY-MM-DD.md with a table:
   niche | last_harvested | age_days | status (FRESH/STALE) | command.
4. Append ONE row to intelligence/INTELLIGENCE-LOG.md using its existing pipe
   format: | timestamp | intel-freshness-guard | freshness check | <summary> | <status> |
5. Commit + push to master: "Intel freshness YYYY-MM-DD".

RESULT SUMMARY: number of stale niches and their names, or "All niches fresh".

HARD RULES: do not modify last_harvested. Do not run a harvest. Flag only.
