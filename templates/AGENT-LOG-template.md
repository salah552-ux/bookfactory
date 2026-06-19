# AGENT LOG — {Book Title}

<!--
APPEND-ONLY. Newest entries go at the BOTTOM. Never edit or delete a previous row.
Every agent reads this file BEFORE starting and appends ONE row AFTER finishing.
Format spec and rules: .claude/agents/00-coordinator/agent-log-guide.md
Protocol (when to read/write, gate invocation): .claude/agents/AGENT-LOG-protocol.md

Column definitions:
  Timestamp   — ISO 8601 UTC, e.g. 2026-06-19T14:30:00Z
  Agent       — exact agent slug, e.g. health-writer, brief-validator, quality-gate
  Stage       — pipeline stage number + name, e.g. 03-writing
  Task        — one sentence: what the agent was asked to do
  Output      — one sentence: what action was taken / what was produced
  Files       — files created or modified (comma-separated), or — if none
  Notes       — errors, deviations, or character/fact discrepancies noticed, or — if none
  Status      — complete / partial / failed / skipped
-->

| Timestamp | Agent | Stage | Task | Output | Files | Notes | Status |
|-----------|-------|-------|------|--------|-------|-------|--------|
| {TODAY}Z | new-book.sh | 00-scaffold | Scaffold new book directory | BLUEPRINT.md stub, FACTS.md, pipeline-state.json, canonical style files, AGENT-LOG.md created | BLUEPRINT.md, FACTS.md, pipeline-state.json, AGENT-LOG.md | — | complete |
