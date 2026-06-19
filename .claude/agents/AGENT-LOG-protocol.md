# AGENT-LOG Protocol — Read/Write Discipline for Every Agent

This protocol is mandatory for every agent that touches a book. It ties together the
three pre-write / post-stage safety systems already in the pipeline. It does not
replace them — it tells you WHEN to read and write, and WHEN to invoke the gates.

Canonical files (do not duplicate these — link to them):

| Concern | Canonical file |
|---------|----------------|
| Per-book run history | `books/{slug}/AGENT-LOG.md` |
| Log format spec + rules | `.claude/agents/00-coordinator/agent-log-guide.md` |
| State manager agent (pipeline-state.json) | `.claude/agents/00-coordinator/agent-log.md` |
| Blank-log template | `templates/AGENT-LOG-template.md` |
| Pre-write brief check | `.claude/agents/02-planning/brief-validator.md` (canonical) |
| Post-stage completeness check | `.claude/agents/00-coordinator/quality-gate.md` |
| Global agent rules | `.claude/agents/AGENT-RULES.md` |

---

## 1. Before you start work — READ

1. Read `books/{slug}/AGENT-LOG.md`. Look at the most recent rows (bottom of file).
   - If the previous stage shows `failed` or `partial` with no resolution row after it,
     STOP and surface it to the orchestrator. Do not build on a broken state.
2. Read `AGENT-RULES.md` (Rule 1 — no invented numbers — applies to all output).
3. Read the source-of-truth files your stage depends on (BLUEPRINT.md, FACTS.md,
   SERIES-FACTS.md, pipeline-state.json).

## 2. After you finish — WRITE

Append exactly ONE row to `books/{slug}/AGENT-LOG.md`. Append only — newest at the
bottom. Never edit or delete a previous row.

If the file does not exist, create it by copying `templates/AGENT-LOG-template.md`
into `books/{slug}/AGENT-LOG.md`, replacing `{Book Title}` and `{TODAY}`, then append
your row.

Log EVERY run — complete, partial, failed, or skipped. The log is the audit trail and
the orchestrator's memory layer; a missing entry is a broken chain.

Specialist agents without direct file access output their log row as structured text;
the orchestrator writes it on their behalf (see agent-log-guide.md Rule 5).

---

## 3. Creating a fresh log for a new book

`new-book.sh` does this automatically: it copies `templates/AGENT-LOG-template.md` to
`books/{slug}/AGENT-LOG.md` and seeds the scaffold row. If you ever find a book without
a log, create one from the template before doing anything else.

---

## 4. When to invoke the GATES

These two agents are hard stops. The orchestrator invokes them; specialist agents must
not skip past them.

### Brief Validator — BEFORE every writing agent (stages 02–05)

Run `validate brief [book-slug]` before any writing agent receives its brief. It
cross-checks the brief against BLUEPRINT.md, FACTS.md, SERIES-FACTS.md, the
characters/ canon, and prior AGENT-LOG.md entries — catching wrong names, ages,
relationships, setting details, and continuity conflicts before a word is written.

- Output: `books/{slug}/BRIEF-VALIDATION.md` with PASS or FAIL, plus an AGENT-LOG.md row.
- FAIL = writing agent is BLOCKED. Fix the brief, re-run, do not proceed on a FAIL.
- The validator never rewrites the brief and never writes prose.

Canonical agent: `.claude/agents/02-planning/brief-validator.md`. This is the single
authoritative brief-validator — it writes BRIEF-VALIDATION.md and reads SERIES-FACTS.md.
(The former lighter inline copy at `.claude/agents/00-coordinator/brief-validator.md`
has been removed; do not recreate it.)

### Quality Gate — AFTER each stage, BEFORE the next unlocks

Run `quality gate [book-slug] [stage-number]` after a stage completes. It verifies all
expected deliverables exist and are non-empty (per Rule 7 — content-based, not
file-existence), thresholds are met, human gates are confirmed, AGENT-LOG.md shows the
stage complete, and there are no red flags (0-byte EPUB, missing chapters). It also runs
the milestone-alert sweep across live books.

- Output: GATE OPEN (next stage unlocks) or GATE BLOCKED (failures listed), plus the
  `quality_gate` field in pipeline-state.json and an AGENT-LOG.md row.
- One failure = BLOCK. The gate never fixes failures itself — it reports them for the
  orchestrator to route.

Canonical agent: `.claude/agents/00-coordinator/quality-gate.md`.

---

## 5. Log format split (authoritative)

Two log layouts exist in the pipeline. Which one applies depends on the book.

### 7-column format — Book 2 onwards (the standard)

All NEW books, starting from Book 2, use the 7-column format defined in the template:

`Timestamp | Agent | Stage | Task | Output | Files | Notes | Status`

The canonical template is at `templates/AGENT-LOG-template.md`. `new-book.sh` copies it
automatically. This is the only format any new book should ever use. The format spec and
column definitions live in `.claude/agents/00-coordinator/agent-log-guide.md`.

### Legacy formats — the four existing books (frozen, do not rewrite)

These four books predate the 7-column standard and use their own current log format:

- `death-in-the-cathedral-close`
- `fix-your-gut-for-good`
- `h-pylori-recovery-plan`
- `the-7-day-gut-reset`

Leave their logs exactly as they are. Do NOT migrate, reshape, or re-column them. When
appending a new row to one of these books, match the column count already present in
that book's file. Rewriting an existing log to change its shape is forbidden — it breaks
the append-only audit trail.

(The older 5-column layout — `Timestamp | Agent | Stage | Status | Summary` — came from
AGENT-RULES.md Rule 3 and may appear in these legacy logs.)

---

## 6. Rules recap

1. Read the log before starting; write one row after finishing. Always.
2. Append only. Never edit or delete a prior row.
3. ISO 8601 UTC timestamps only.
4. brief-validator runs before every writing agent. No exceptions.
5. quality-gate runs after every stage. No exceptions.
6. A FAIL/BLOCK from either gate is a hard stop — fix and re-run, never bypass.
7. No invented numbers anywhere (AGENT-RULES.md Rule 1).
