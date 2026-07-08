# RUN LEDGER — cortisol-gut-health

Append-only orchestration ledger. One line per event.
Format: `timestamp · stage · agent · action · result · retry-count · next-step`

Book: Cortisol Gut Health (WORKING TITLE) · Genre: NONFICTION-HEALTH · Series: Fix Your Gut for Good (Book 5 CANDIDATE) · Market: US / Amazon.com
Run goal (Architect directive 2026-07-05): drive Stages 00→01, STOP at Stage 02 human gate (blueprint + title approval). Live data only; no invented numbers; escalate on scrape failure rather than estimate.

---

- 2026-07-05T08:40Z · scaffold · new-book.sh · create book folder (slug cortisol-gut-health) · PARTIAL (core files created; python3 Windows-store stub failed → .md-to-pdf.json + PIPELINE.md row skipped; bash quoting syntax error line 448) · 0 · orchestrator to repair scaffold gaps
- 2026-07-05T08:40Z · scaffold · pipeline-orchestrator · edit pipeline-state.json (genre=NONFICTION-HEALTH, writer_agent=health-writer, series Book 5 CANDIDATE, market US/Amazon.com, niche=cortisol-gut-health, kdp_editions prose-first) · PASS · 0 · seed .md-to-pdf.json, create ledger, pre-stage-gate 00
