# RUN LEDGER — The Vagus Nerve Gut Reset (Book 4, "Fix Your Gut for Good")

<!--
APPEND-ONLY. Newest entries at the BOTTOM. Never edit or delete a prior line.
One line per event: timestamp · stage · agent · action · result · retry-count · next-step
Created 2026-07-02 by pipeline-orchestrator (Run Ledger Protocol) — book was already live before the ledger existed;
this ledger opens at the publish event. Prior history lives in AGENT-LOG.md + pipeline-state.json.agent_log.
-->

| Timestamp | Stage | Agent | Action | Result | Retry | Next step |
|-----------|-------|-------|--------|--------|-------|-----------|
| 2026-07-02T00:00:00Z | 07-publishing | pipeline-orchestrator | Record human PUBLISH — Kindle eBook (KDP title id A2KX8YX44I58CT) LIVE on Amazon; both human gates (AI questionnaire + Publish) satisfied by Architect on live KDP dashboard; state-recording only (no browser/upload/outward action) | partial — published/live recorded (kdp_status=live, live_date=2026-07-02); Stage 07 HELD in_progress (not closed); current_stage stays 6; ASIN null (not invented). validate-state = 1 CRITICAL (INV-6 publish-lock: ASIN pending) — by design | 0 | Close-blockers (NOT to be faked): (1) record the live ASIN off the Amazon product page → clears INV-6; (2) produce KDP-UPLOAD-GUIDE.md → clears INV-12; then orchestrator marks 07-publishing complete. Then (awaiting Architect go-ahead): post-launch-agent weekly monitoring, series-sync/series-continuity for Book 4, AMS loop once review_count>=5. Outstanding separately: paperback wrap cover (design-agent) before any print edition. |
