---
name: agent-log-guide
description: Reference guide explaining the AGENT-LOG.md pattern. Read this before implementing the agent-log system in any book or agent. This document covers the format spec, creation rules, what to write, and when to write it.
model: reference
stage: "00-coordinator"
input: []
output: ["AGENT-LOG.md"]
triggers: []
parallel_with: []
human_gate: false
---

# AGENT-LOG.md — Pattern Guide

## Why this exists

Agents run blind. Without a shared log, no agent knows what previous agents produced, which steps were skipped, or where things went wrong. A character age error (Helen briefed as early 40s, actually 70 in BLUEPRINT.md) was caught late in Book 1 because there was no shared trace. Every agent now leaves a record.

---

## Where the file lives

```
books/{book-slug}/AGENT-LOG.md
```

One file per book. Created at book scaffold time by `new-book.sh`. Never deleted.

---

## Format spec

The AGENT-LOG.md uses a markdown table with the following columns:

```markdown
# AGENT LOG — {Book Title}

| Timestamp | Agent | Stage | Task Summary | Output Summary | Errors / Deviations | Status |
|-----------|-------|-------|--------------|----------------|---------------------|--------|
```

### Column definitions

| Column | Type | Description |
|--------|------|-------------|
| Timestamp | ISO 8601 UTC | `2026-05-10T14:30:00Z` — when the agent ran |
| Agent | string | Exact agent name (matches the agent file slug, e.g. `health-writer`, `brief-validator`) |
| Stage | string | Pipeline stage number and name, e.g. `03-writing`, `04-quality` |
| Task Summary | string | One sentence: what was the agent asked to do? |
| Output Summary | string | One sentence: what files were produced, or what action was taken? |
| Errors / Deviations | string | Any failures, blocks, workarounds, or skipped steps. Use `—` if none. |
| Status | enum | `complete` / `partial` / `failed` / `skipped` |

### Status definitions

| Value | Meaning |
|-------|---------|
| `complete` | Agent finished all tasks. All expected outputs produced. |
| `partial` | Agent finished some tasks. Expected outputs incomplete. Notes required. |
| `failed` | Agent could not complete its task. Blocking error occurred. |
| `skipped` | Agent was not run for this stage. Reason must be noted in Errors column. |

---

## How agents use it

### At session START

Every agent that works on a book must read AGENT-LOG.md before beginning. Check:
- What is the most recent entry?
- Did the last agent complete or fail?
- Are there any noted deviations that affect this run?

Do not start work if the previous stage shows `failed` or `partial` without understanding why.

### At session END

Every agent must append one new row to AGENT-LOG.md after finishing.

**If the file does not exist:** Create it with the full header row first, then append the entry.

**Header to create (if file is missing):**

```markdown
# AGENT LOG — {Book Title}

| Timestamp | Agent | Stage | Task Summary | Output Summary | Errors / Deviations | Status |
|-----------|-------|-------|--------------|----------------|---------------------|--------|
```

**Entry to append:**

```markdown
| 2026-05-10T14:30:00Z | health-writer | 03-writing | Write Chapter 4 (Day Four: The Stress Bridge) | ch-04-day-four.md written, 1,241 words. FACTS.md updated with new Stress Bridge mechanic. | — | complete |
```

---

## What counts as a deviation

Always note deviations — even small ones. The log is for future agents, not for judgment.

Examples of deviations to record:
- Brief contained an error → brief-validator blocked it → brief was corrected before write
- Chapter came in at 800 words, not 1,200 words target
- Agent hit a rate limit mid-run — restarted from chapter 4
- Used an alternate build path (Pandoc direct instead of build-manuscript.sh)
- Skipped a quality check because manuscript was a minor edit

---

## What the orchestrator uses it for

The `pipeline-orchestrator` reads AGENT-LOG.md at the start of every new session to reconstruct what has been done. This replaces the need for the human to re-explain context. The orchestrator's session-start brief should include a summary of the last 3 log entries.

---

## Rules

1. **Never delete rows.** Append only.
2. **Never edit previous rows** unless correcting a factual error (note the correction in the next row).
3. **Use ISO 8601 UTC timestamps.** Do not use "yesterday" or relative times.
4. **One row per agent per run.** If an agent runs twice in a session, write two rows.
5. **The orchestrator is responsible for writing to AGENT-LOG.md** on behalf of subordinate agents that do not have direct file access. Specialist agents should output their log entry as structured text; the orchestrator writes it.
6. **brief-validator must log every run** — both PASS and BLOCK. This provides an audit trail of what was checked before writing started.
7. **quality-gate must log every run** — both PASS and BLOCK. This provides the gate audit trail.

---

## New book setup checklist (run by `new-book.sh`)

When `new-book.sh` creates a new book, it must:

1. Create `books/{slug}/AGENT-LOG.md` with the header row and a seed entry:

```markdown
# AGENT LOG — {Book Title}

| Timestamp | Agent | Stage | Task Summary | Output Summary | Errors / Deviations | Status |
|-----------|-------|-------|--------------|----------------|---------------------|--------|
| {TODAY}Z | new-book.sh | 00-scaffold | Scaffold new book directory | BLUEPRINT.md stub, FACTS.md, pipeline-state.json, canonical style files created. | — | complete |
```

This ensures no agent ever arrives to a missing log file.
