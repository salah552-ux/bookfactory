# SELF-HEALING — the factory's immune loop

The BookFactory pipeline defends itself with a four-stage immune loop. Detection and
repair are deliberately separate tools so a repair can never masquerade as a pass.

```
   preflight DETECT  ->  self-heal REPAIR  ->  WRITER-REGRESSION-TEST VERIFY  ->  LESSONS.md LEARN
   (scripts/preflight.cjs)  (scripts/self-heal.cjs)   (after prompt-level repairs)   (intelligence/LESSONS.md)
```

1. **DETECT — `node scripts/preflight.cjs`.** Runs the pre-flight checks that surface
   faults before a stage starts. It reports; it does not repair.
2. **REPAIR — `node scripts/self-heal.cjs`.** Applies the small set of mechanically-safe,
   evidence-based repairs (below) and reports everything else. Re-run preflight after it
   to confirm the fault cleared.
3. **VERIFY — `.claude/agents/04-quality/WRITER-REGRESSION-TEST.md`.** Only relevant after a
   *prompt-level* repair (an agent prompt, voice bible, or rubric was changed). Run the
   regression test so a fix to one writer does not silently regress another. Not needed for
   the file-level repairs self-heal performs.
4. **LEARN — `intelligence/LESSONS.md`.** When a new fault class is found and fixed, the
   orchestrator records the lesson (with real repo evidence) so the mistake is not repeated.
   Recurring faults graduate into a preflight check and, where safe, a self-heal repair.

## When to run each

- **Session start / before a stage:** `preflight.cjs` (detect), then `self-heal.cjs` if it
  flags a repairable fault, then `preflight.cjs` again to confirm green.
- **After changing an agent prompt, voice bible, or rubric:** run the WRITER-REGRESSION-TEST
  before trusting the writers again.
- **Anytime as a safety sweep:** `self-heal.cjs --dry-run` shows what *would* be repaired
  without writing a byte.

## What self-heal WILL touch (auto-repair)

Only these three fault classes, and only when the evidence for the fault is unambiguous:

1. **Unquoted agent `description:` with a colon-space** — the silent-drop bug class. This
   exact shape breaks YAML frontmatter and makes Claude Code drop the agent from the registry
   (LESSONS.md 2026-06-29, which took out 6 agents including kdp-upload-agent). Self-heal
   wraps only that fault in double quotes, byte-for-byte. Unquoted descriptions that parse
   fine (no colon-space) are left alone.
2. **Stale user-level agent mirror** — if a canonical project agent is newer than its
   `%USERPROFILE%/.claude/agents/bf-*.md` copy (or the copy is missing), it runs the sanctioned
   `scripts/sync-agents-to-user.py` once to regenerate the mirror.
3. **Missing run ledgers** — a `books/<slug>/` that has a `pipeline-state.json` but no
   `RUN-LEDGER.md` gets a fresh minimal ledger created (additive).

Every applied repair is appended, one line each, to `automation/reports/self-heal-log.md`.

## What self-heal will NEVER touch

- **Never edits state or manifest JSON.** Corrupt `pipeline-state.json` or
  `PIPELINE-MANIFEST.json` is reported as a CRITICAL and quarantined for a human — never
  auto-rewritten.
- **Never edits a manuscript.** No chapter, front matter, or copyright file is touched.
- **Never modifies an image.** A cover missing its JFIF header is reported (with the fix
  reference), not altered.
- **Never deletes anything.** Repairs are additive or in-place-and-minimal only.

Faults outside the three repair classes are **report-only**: corrupt JSON (CRITICAL),
covers missing a JFIF APP0 header (WARN), and undersized Kindle EPUBs under 500KB (WARN).

## Standing rule — escalate what can't be safely fixed

If a fault is not one of the three mechanically-safe repair classes, self-heal reports it and
stops. **Unfixable faults are escalated to the Architect with the evidence** (the file, the
byte signature, the parse error, the size) — self-heal never guesses at a repair it cannot
prove is safe. Detection without a safe mechanical fix is a decision for a human, not the
engine.
