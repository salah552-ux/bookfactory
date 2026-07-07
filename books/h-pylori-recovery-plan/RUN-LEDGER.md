# RUN LEDGER — The H. Pylori Recovery Plan (Book 2, "Fix Your Gut for Good")

<!--
APPEND-ONLY. Newest entries at the BOTTOM. Never edit or delete a prior line.
One line per event: timestamp · stage · agent · action · result · retry-count · next-step
Created 2026-07-06 by pipeline-orchestrator (Run Ledger Protocol) — book was already live before the ledger existed;
this ledger opens at the state-reconciliation event. Prior history lives in AGENT-LOG.md + pipeline-state.json.agent_log.
-->

| Timestamp | Stage | Agent | Action | Result | Retry | Next step |
|-----------|-------|-------|--------|--------|-------|-----------|
| 2026-07-06T00:00:00Z | reconciliation | pipeline-orchestrator | STATE RECONCILIATION — live-status drift. Architect's KDP Bookshelf (session 2026-06-29) shows the book LIVE: "The H. Pylori Recovery Plan by S.A. Ibrahim — Kindle eBook — Live — Submitted on June 17, 2026 — ASIN B0H5TZTPRT — KDP Select enrolled — series: fix your gut for good", while state said parked/published=false/kdp_status=not_started/asin=null. Published outside pipeline tracking; reality wins. Set lifecycle active, human_gates.published true, publishing.asin B0H5TZTPRT, kdp_status live, live_date 2026-06-17, last_updated 2026-07-06 (+notes). State-recording only — no browser/build/KDP action, no other agents. | partial — live-status recorded truthfully; stage-completion audit NOT certified. validate-state before=13 critical / after=13 critical (unchanged): live-status fields don't touch INV-13/INV-12/INV-9. INV-13 executed_by='(unset)' deliberately NOT back-filled (stages closed historically by "master-orchestrator" — fabricating pipeline-orchestrator authorship is what INV-13 guards against). | 0 | Separate, honest follow-up required (NOT to be faked): a proper pipeline-orchestrator re-validation or honest correction of the pre-existing criticals — INV-13 executed_by on all completed stages, INV-12 missing COMPLIANCE-REPORT.md + SERIES-FACTS.md, INV-9 final_approval_score 113<270 — before the book is treated as pipeline-certified. Then Stage 10 post-launch monitoring. |
