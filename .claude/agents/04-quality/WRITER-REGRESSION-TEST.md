# Writer Regression Test ("Golden Test")

The reproducible quality check run after any change to a writer agent or a voice bible — proof the change didn't break writing quality before it ever touches a real book.

---

## Purpose & Trigger

Run this test after ANY edit to:
- A writer agent (`health-writer`, `fiction-writer`, `murder-mystery-writer`, `business-writer`)
- A Voice Bible (`HEALTH-VOICE-BIBLE.md`, `FICTION-VOICE-BIBLE.md`, `BUSINESS-VOICE-BIBLE.md`)
- The Bestseller DNA Protocol
- `book-reviewer`'s gates (the 12-metric scorecard, the 4-Axis Quality Gate, or Genre-Aware Bible Selection)

The point is to catch prompt regressions in a cheap, disposable sample — before the same broken instruction gets baked into a real chapter, in a real book, discovered only when book-reviewer or a human catches it three stages later. This test is the fire drill: fixed brief in, fixed rubric out, five minutes, zero book-folder writes.

---

## The Test (per affected writer lane)

Run one lane if only that lane's writer/bible changed. Run all three if the shared machinery changed (Bestseller DNA Protocol, or a book-reviewer gate that applies across genres).

### Step 1 — Spawn the edited writer with the fixed standard brief

Use the exact brief text below for the affected lane — verbatim, so the test is reproducible run to run. Do not paraphrase or improve it.

**health-writer brief:**
> Write a ~500-word passage for a general gut-health guide chapter opening: the reader's bloating-after-lunch experience, one mechanism explained with an everyday analogy, closing on a forward hook. Use only widely established physiology; cite nothing specific; this is a STYLE test.
>
> Note: this is a regression style-test with no book context. AUTHOR-DNA does not apply — there is no specific book's author-voice file to read. Apply your full standard machinery otherwise: the Voice Bible, the Anti-AI Ban List, the Research Rule's honesty-about-uncertainty standard, and the Exemplar Patterns for opening/closing a chapter.

**fiction-writer / murder-mystery-writer brief:**
> Write a ~500-word cosy-mystery scene opening: an amateur sleuth notices something wrong at a village event; end on a turn.
>
> Note: this is a regression style-test with no book context. AUTHOR-DNA does not apply — there is no specific book's author-voice file to read. Apply your full standard machinery otherwise: the Fiction Voice Bible, its Ban List, and its Exemplar Patterns.

**business-writer brief:**
> Write a ~500-word chapter opening about the reader drowning in a disorganized workday; one concrete mini-story; end with one action they can take today.
>
> Note: this is a regression style-test with no book context. AUTHOR-DNA does not apply — there is no specific book's author-voice file to read. Apply your full standard machinery otherwise: the Business Voice Bible, its Ban List, and its Exemplar Patterns.

### Step 2 — Writer applies its full machinery

The writer reads and writes against its genre's Voice Bible exactly as it would for a real chapter (Ban List, Voice Standards, Research Rule where applicable, Exemplar Patterns). The only thing skipped is AUTHOR-DNA — there is no book, so there is no book-specific author-voice file to conform to. Everything else fires normally.

### Step 3 — Spawn book-reviewer on the sample

Run `book-reviewer` against the sample using its 4-Axis Quality Gate, with Genre-Aware Bible Selection pointed at the same bible the writer used:

| Lane | Bible for both writer and reviewer |
|---|---|
| health | `.claude/agents/03-writing/HEALTH-VOICE-BIBLE.md` |
| fiction / murder-mystery | `.claude/agents/03-writing/FICTION-VOICE-BIBLE.md` |
| business | `.claude/agents/03-writing/BUSINESS-VOICE-BIBLE.md` |

The sample has no chapters-context (no APPROVALS.md history, no FACTS.md, no prior chapters) — score **Axis 4 (Cross-chapter continuity / drift) as N/A**, not PASS and not BLOCK. Do not fabricate a prior chapter to score it against. The 12-metric scorecard's Metric 9 (Continuity) is likewise N/A for the same reason — note it as such rather than scoring it against nothing.

### Step 4 — Verdict

**PASS** = zero Ban List hits (Axis 1 clear) AND every applicable axis (1, 2, 3 — Axis 4 is N/A) at or above its floor per the bible's 4-Axis Quality Gate.

**FAIL** = any applicable axis below its floor, or any Ban List violation at all.

Note: the 4-Axis Gate's own floor for Axis 1 is "more than two distinct violations = BLOCK" — for this regression test, treat that floor as written (it is the bible's real standard) but report the exact count and quotes regardless, so even a single violation is visible to whoever reads the report.

---

## On FAIL

The prompt or bible edit that immediately preceded the failure is the prime suspect — this test only runs after such an edit, so treat the recent diff as guilty until proven innocent.

1. Report the quoted failing lines from the sample verbatim, with the axis or metric each one violates.
2. Revert or fix the EDIT that caused the regression (the writer agent's prompt, or the bible section that changed). **Never loosen the bible's standards or the reviewer's floors to make the test pass** — the test exists to protect those standards, not to be satisfied by weakening them.
3. Re-run the test from Step 1 with the same fixed brief.
4. If the failure teaches something durable about writer-prompt design or bible drafting (not just "this one edit was wrong"), record a lesson in `intelligence/LESSONS.md` under the "Writing & Voice" section, following its entry format exactly: `- **[YYYY-MM-DD] system** — lesson text. *Evidence:* <source>.` Cite the regression report file (see Artifacts below) as the evidence source.

---

## Artifacts

Save the sample and the reviewer verdict to:

```
automation/reports/regression/<YYYY-MM-DD>-<lane>.md
```

Where `<lane>` is one of `health`, `fiction`, `business`. Contents: the full sample text, the book-reviewer scorecard/axis output, and the PASS/FAIL verdict. If all three lanes are tested in one run (a shared-machinery change), write three separate dated files, one per lane.

**Never write regression samples into any `books/` folder.** These are not book content, not a chapter, not a real author's manuscript — they are disposable test fixtures. A regression sample sitting inside a book folder risks being mistaken for real content by a later stage.

---

## Hard Rules

- **Style-test only.** No real book content is produced or implied. The samples contain no book-specific facts, no invented statistics presented as real, and no claims that need FACTS.md verification — the health brief explicitly forbids citing anything specific.
- **Samples are never shipped.** Not to `books/`, not to KDP, not into any manuscript. They exist only to prove the writer/bible/reviewer machinery still works.
- **Keep it cheap.** ~500 words per lane, one writer spawn + one reviewer spawn per lane. Do not expand this into a multi-chapter test, a full brief-validator run, or a fact-checker pass — those are unnecessary for a style-only regression check and would defeat the purpose of a fast, cheap gate.
- **AUTHOR-DNA is explicitly out of scope** for this test — say so in the brief every time, so the writer doesn't stall looking for a book-specific voice file that doesn't exist for a test run.
