# BookFactory Agent Rules — Applies to ALL Agents

These rules override any default behaviour. Every agent in this pipeline must comply.

---

## RULE 1 — ZERO TOLERANCE: NO INVENTED NUMBERS

You may NEVER output any of the following without a source citation in parentheses immediately after:

- Any £ or $ amount (budget, spend, royalty estimate, cost)
- Any sales estimate (X sales/day, X downloads, X borrows)
- Any rate or percentage (conversion %, CTR, ACOS, open rate)
- Any timeline projection (in 30 days you will have X)
- Any marketing budget recommendation (spend £X on ads)
- Any subscriber count for a promotional platform (unless you have read it from a verified source this session)

**Required format when a number is truly necessary:**
`[number] (source: [exact source — e.g. KDP rate card, harvested BSR data, pipeline-state.json])`

**If no real source exists for a number, write exactly:**
`We need real data for this before making a recommendation.`

This is not a guideline. Violation = invented number = misinformation = pipeline failure.

---

## RULE 2 — EXACT OUTPUT PATHS, NO FILENAME VARIATIONS

Every agent must write its output to the EXACT path specified in its frontmatter `output:` field and in this orchestrator's Agent Awareness Protocol. No variations in filename, no alternate spellings, no "v2" or dated suffixes, no "FINAL" markers, no lowercase/uppercase swaps.

- Correct: `books/{slug}/MARKET-INTELLIGENCE.md`
- Wrong: `market-intelligence.md`, `MARKET-INTELLIGENCE-v2.md`, `MARKET_INTELLIGENCE.md`, `books/{slug}/research/MARKET-INTELLIGENCE.md`

Downstream agents are briefed to READ these exact paths. A renamed output breaks the entire chain silently — the next agent finds nothing and either fails or proceeds blind.

If you believe a path is wrong, stop and surface it. Do not invent a new one.

---

## RULE 3 — LOG EVERY RUN TO AGENT-LOG.md

After completing your task — pass, fail, retry, or block — append exactly one line to `books/{slug}/AGENT-LOG.md`:

```
[ISO timestamp] | [agent-name] | [stage] | [status: PASS/BLOCK/COMPLETE/FAIL/RETRY-N] | [one-line summary]
```

If `AGENT-LOG.md` does not exist in the book's root, create it with this header block, then append:

```
# AGENT LOG — [Book Title]

| Timestamp | Agent | Stage | Status | Summary |
|-----------|-------|-------|--------|---------|
```

One line per run. No multi-line entries. No prose. The log is machine-parseable.

---

## RULE 4 — NO SPECIALIST WORK OUTSIDE YOUR STAGE

Each agent does only the work assigned to its stage. The orchestrator routes. Agents do not route themselves.

- Do not write chapters if you are a research agent
- Do not publish if you are a writing agent
- Do not invent market data if you are a planning agent

---

## RULE 5 — INTELLIGENCE LAYER MUST RUN FIRST

No Stage 01 (research) output is valid unless:
- `intelligence/harvested.json` exists AND was scraped within the last 30 days
- `intelligence/opportunity.db` exists
- `intelligence/reports/` contains at least one analysis report for the relevant niche

If these conditions are not met, stop and output:
```
⛔ INTELLIGENCE GATE BLOCKED
Real market data is missing. Run the intelligence layer first:
  1. node intelligence/seed_asins.js  (or harvester-agent)
  2. python intelligence/load_to_db.py
  3. python intelligence/analyzer.py
Then re-run the pipeline.
```

---

## RULE 6 — HUMAN GATES ARE HARD STOPS

Never advance past a human gate without confirmation in pipeline-state.json. No exceptions.

---

## RULE 7 — VERIFICATION IS CONTENT-BASED, NEVER FILE-EXISTENCE

When an agent or gate checks the output of another agent, "the file exists" is not sufficient. Always verify:
- The file is non-empty
- Word count / size threshold met (per `pipeline-orchestrator.md` verification thresholds table)
- Required sections, fields, or numbers are present
- Rule 1 compliance (no uncited £/$/% near sales claims)

A 0-byte file or a stub that says "TODO" counts as a failure, not a success.

---

## RULE 9 — READ THE FAILURE STORE BEFORE STARTING

Before beginning any task, read `BookFactory/intelligence/failure-store.json`. Check the `failures` array for any entries where:
- `agent` matches your agent name, OR
- `failure_type` matches a risk in your current task

If a matching failure exists and `resolved: false`, surface it to the orchestrator before proceeding.

---

## RULE 8 — FAILURE PROTOCOL: STATE WHAT YOU CANNOT COMPLETE

If you cannot finish your task, do NOT silently produce a partial output and return success. Instead, output exactly:

```
⛔ AGENT FAILURE — [agent-name]
What I could not produce: [exact missing artifact or section]
Why: [one sentence — missing input, blocked tool, ambiguous brief, rate limit]
What I produced anyway: [list any partial artifacts on disk]
What the orchestrator should do: [retry with X / escalate / abandon stage]
```

Then write the same line to `AGENT-LOG.md` with status `FAIL`. The orchestrator's Self-Healing protocol depends on this signal.
