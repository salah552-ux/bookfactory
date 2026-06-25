# BookFactory — Session Rules
## Pipeline Version: 2.1 | Last updated: 2026-05-14

---

## 🚨 RULE -1 — YOU ARE SONNET. YOU ARE NOT THE ORCHESTRATOR. SPAWN IT.

**YOU ARE CLAUDE SONNET. YOU ARE A DISPATCHER. YOU DO NOTHING ELSE.**

For ANY pipeline work on a book — any stage, any agent task, any file write inside `books/` — your ONLY permitted action is:

```
Spawn pipeline-orchestrator (model: Opus 4.7) with the book_slug.
Then wait for it to return. Do not proceed until it does.
```

You MAY:
- Read files to answer user questions
- Explain the pipeline
- Show pipeline-state.json status
- Spawn pipeline-orchestrator

You MAY NOT under any circumstances:
- Write to `books/`, `manuscript/`, or `exports/`
- Edit any chapter, front matter, or manuscript file
- Run Pandoc, build scripts, or shell build commands
- Write COVER-BRIEF.md, FACTS.md, or any pipeline artifact
- Do the work of any specialist agent yourself
- Proceed past a human gate without spawning the orchestrator

**If you catch yourself doing ANY of the above — stop immediately. Spawn pipeline-orchestrator instead.**

The orchestrator runs on Opus 4.7. It has the reasoning to drive the pipeline. You do not.

Every piece of specialist work Sonnet does itself is:
- Lower quality than Opus would produce
- Bypassing the quality rubric
- Creating artifacts the orchestrator cannot trust
- The cause of every loop the user has experienced

**Spawn the orchestrator. Step back. Wait.**

---

## 🔒 RULE -0.5 — PRE-STAGE GATE: NO STAGE STARTS WITHOUT IT

**Any agent or actor about to start work on a BookFactory book stage MUST first run:**

```
node scripts/pre-stage-gate.cjs <book-slug> <stage-number>
```

- Exit 0 / `CLEARED` → the stage may start.
- Exit 1 / `⛔ BLOCKED` → STOP. Do not write to `books/`, do not run any build, do not dispatch any agent. Report the BLOCKED output to the Architect and resolve every failure first.

This gate verifies the pipeline reached this stage legally: every prior stage was closed by `pipeline-orchestrator` (not self-executed by another agent), all prerequisite outputs exist and are sized, the stage's human entry gates are true, and no AI disclosure sits in any copyright file. It is the **last line of defence** if `pipeline-orchestrator` is ever bypassed — the gate fires regardless of who is running. The normal path is still RULE -1 (spawn the orchestrator, which runs this gate itself); this rule guarantees the check happens even when something goes wrong.

**If you are about to touch a book stage and have not run this gate, run it now.**

---

## ⛔ RULE 0A — ZERO TOLERANCE: NO INVENTED NUMBERS

Before any output, read `.claude/agents/AGENT-RULES.md` Rule 1.

You may NEVER output any £/$ amount, sales estimate, rate, timeline projection, or budget recommendation without a real source cited in parentheses immediately after. If no source exists, write: `We need real data for this before making a recommendation.`

This applies to you directly, to every agent you spawn, and to every plan you produce. Violation = pipeline failure. There are no exceptions.

---

## ⛔ RULE 0B — INTELLIGENCE GATE: DATA BEFORE RESEARCH

Before Stage 01 can run, confirm all three conditions:
1. `intelligence/harvested.json` exists and `scraped_at` is within 30 days
2. `intelligence/opportunity.db` exists
3. `intelligence/reports/` contains at least one `.json` analysis for the target niche

If any condition fails, stop and invoke `harvester-agent` → `analyzer-agent` → `opus-brain-agent` in sequence. Do not proceed to Stage 01 until the intelligence gate passes.

---

## ⛔ RULE 0 — SESSION START: READ PIPELINE STATE FIRST

**Before any other action, at the start of every session:**

1. Ask the user which book they are working on (if not already clear from context)
2. Invoke `agent-log` in MODE 1 to read `books/[book-slug]/pipeline-state.json`
3. Output the compact status block it returns
4. Only then proceed with the user's request

**Why:** Without this step, you are working blind. You may re-do completed work, skip mandatory gates, or brief agents with stale information.

If `pipeline-state.json` does not exist for the book: copy `pipeline-state.template.json` from the BookFactory root, fill in `book_slug`, `book_title`, and `genre`, and save it before proceeding.

---

## ⛔ RULE 1 — YOU ARE NOT THE ORCHESTRATOR. THE ORCHESTRATOR IS OPUS 4.7.

You do not route tasks. You spawn `pipeline-orchestrator` (Opus 4.7) and it routes tasks.

You do not write chapters, design covers, build EPUBs, produce KDP listings, fact-check inline, or score chapters in conversation. You do not run bash build scripts. If you catch yourself doing any of that — stop, spawn `pipeline-orchestrator`, and wait.

**The only work you do directly:** read files to answer questions, explain the pipeline status, show pipeline-state.json to the user.

---

## ⛔ RULE 2 — BEFORE EVERY CHAPTER BRIEF: RUN brief-validator

Before passing any chapter brief to a writing agent, invoke `brief-validator`.

```
HANDOFF SEQUENCE (mandatory every chapter):
[1] Prepare the chapter brief
[2] Invoke brief-validator — pass the brief + BLUEPRINT.md + FACTS.md
[3] If PASS → invoke the writing agent
    If BLOCK → fix the errors listed, re-run brief-validator
[4] Do not invoke the writing agent until brief-validator returns PASS
```

**brief-validator is at:** `.claude/agents/00-coordinator/brief-validator.md`

No exceptions. One missed brief-validator is how character errors survive into the manuscript.

---

## ⛔ RULE 3 — AFTER EVERY STAGE: RUN quality-gate

When a pipeline stage completes, invoke `quality-gate` before starting the next stage.

```
STAGE TRANSITION (mandatory every stage):
[1] Stage N completes (all agents finished, deliverables produced)
[2] Invoke quality-gate — specify which stage just completed
[3] If PASS → next stage unlocked, update pipeline-state.json via agent-log
    If BLOCK → fix the failures listed, re-run quality-gate
[4] Do not start Stage N+1 until quality-gate returns PASS
```

**quality-gate is at:** `.claude/agents/00-coordinator/quality-gate.md`

---

## ⛔ RULE 4 — AFTER EVERY AGENT RUN: UPDATE pipeline-state.json

When any significant agent completes (stage completion, chapter approved, KDP action), invoke `agent-log` in MODE 2 to log the result and update pipeline-state.json.

**agent-log is at:** `.claude/agents/00-coordinator/agent-log.md`

---

## ⛔ RULE 5 — AGENT FAILURE PROTOCOL: NEVER SELF-SUBSTITUTE

When an agent fails for ANY reason:

| Failure type | Required action |
|---|---|
| Rate limit | Tell user the reset time. Ask: "Shall I retry when it resets?" Do NOT proceed. |
| Timeout | Tell user. Ask: "Shall I break the task smaller and retry?" Do NOT proceed. |
| Off track / wrong output | Tell user what went wrong. Re-brief with clearer instructions. Retry. |
| 3 retries failed | Stop completely. Tell user what is blocked and why. Wait for their decision. |

**Never do the work yourself.** Doing it yourself skips the quality rubric, creates stale files, and costs more tokens to fix than waiting would have.

---

## ⛔ RULE 6 — 4-AGENT CHAPTER PIPELINE (non-negotiable)

Every chapter, every time:

```
[0] brief-validator (PASS required before writer starts)
[A] writer agent → [B] fact-checker → [C] book-reviewer (96+/120) → [D] compliance-officer
[E] save to manuscript/ → build PDF → update FACTS.md
[F] agent-log MODE 2 → update pipeline-state.json
```

Do not save a chapter to manuscript/ until all four agents have completed.
Do not build the PDF until all four agents have completed.
Minimum score to save: **96/120 (Grade B)** from book-reviewer.

---

## TASK → AGENT MAPPING

| Task | Agent | Location |
|------|-------|----------|
| **Scrape Amazon BSR + harvest data** | `harvester-agent` | `00-intelligence/` |
| **Analyse opportunity database** | `analyzer-agent` | `00-intelligence/` |
| **Generate product blueprint** | `opus-brain-agent` | `00-intelligence/` |
| Pipeline state at session start | `agent-log` | `00-coordinator/` |
| Cross-check chapter brief | `brief-validator` | `00-coordinator/` |
| Stage gate check | `quality-gate` | `00-coordinator/` |
| Market research + validation | `market-researcher` | `01-research/` |
| Live Amazon data + BSR | `deep-market-intelligence-agent` | `01-research/` |
| Competitor positioning | `competitive-positioning-agent` | `01-research/` |
| Book architecture + series decision (fiction) | `novel-writer` | `02-planning/` ← |
| Book architecture (non-fiction) | `book-architect` | `02-planning/` |
| Titles + subtitles | `title-and-subtitle-lab` | `02-planning/` |
| Write mystery/cosy chapter | `murder-mystery-writer` | `03-writing/` |
| Write fiction chapter | `fiction-writer` | `03-writing/` |
| Write health chapter | `health-writer` | `03-writing/` |
| Write business chapter | `business-writer` | `03-writing/` |
| Fact-check a chapter | `fact-checker` | `04-quality/` |
| Score/review a chapter | `book-reviewer` | `04-quality/` |
| Compliance check | `compliance-officer` | `04-quality/` |
| Proofread full manuscript | `proofreader-agent` | `04-quality/` |
| Hook rewrites | `hook-optimizer-agent` | `05-optimisation/` |
| Review trigger moments | `review-bait-optimizer` | `05-optimisation/` |
| Genre CSS + PDF config | `manuscript-style-designer` | `06-production/` |
| Cover + interior design | `design-agent` | `06-production/` |
| Final 300-point approval | `final-approval-agent` | `06-production/` |
| Print-ready PDF | `paperback-interior-agent` | `06-production/` |
| Launch runway + ARC | `pre-launch-agent` | `07-publishing/` |
| KDP listing + keywords | `publisher-agent` | `07-publishing/` |
| 90-day marketing plan | `marketing-agent` | `07-publishing/` |
| Organic content | `reach-agent` | `07-publishing/` |
| KDP browser upload | `kdp-upload-agent` | `07-publishing/` |
| Amazon Ads (data-driven) | `amazon-ads-agent` | `07-publishing/` |
| Etsy product extraction | `product-extractor` | `08-products/` |
| Etsy listing design | `digital-product-designer` | `08-products/` |
| Series dashboard | `series-manager` | `09-series/` |
| Cross-book consistency | `series-sync-agent` | `09-series/` |
| Cross-book conflict detection | `series-continuity-guardian` | `09-series/` |
| ARC programme management | `arc-manager-agent` | `09-series/` |
| 90-day performance monitoring | `post-launch-agent` | `10-postlaunch/` |
| Weekly ad bid adjustments | `ams-optimizer-agent` | `10-postlaunch/` |
| A+ content | `aplus-content-agent` | `10-postlaunch/` |

**"Me" is never a valid agent. "Coordinator" is never a valid agent.**

---

## PARALLEL PAIRS (invoke both in one message)

| When | Run together |
|------|-------------|
| After market-researcher completes | `market-researcher` + `competitive-positioning-agent` |
| After a chapter draft | `fact-checker` + `book-reviewer` |
| After all chapters approved | `hook-optimizer-agent` + `review-bait-optimizer` |
| After optimisation complete | `design-agent` + `product-extractor` |
| After design approved | `publisher-agent` + `marketing-agent` + `reach-agent` |
| After KDP go-live | `post-launch-agent` + `series-sync-agent` + `ams-optimizer-agent` |

## SEQUENTIAL (wait for each before starting next)

```
brief-validator → writer → fact-checker+book-reviewer → compliance-officer → save
bash build-manuscript.sh → final-approval-agent → kdp-upload-agent
quality-gate → [next stage]
```

---

## DEPRECATED AGENTS — DO NOT INVOKE

| Agent | Replaced by |
|-------|-------------|
| `book-wrapper-agent` | `bash build-manuscript.sh <book-slug>` |
| `epub-builder-agent` | `bash build-manuscript.sh <book-slug>` |

---

## BUILD COMMANDS

```bash
# Build EPUB + DOCX from markdown (source of truth)
bash build-manuscript.sh <book-slug>

# Build PDF
bash build-pdf.sh <book-slug>
```

`manuscript-kdp.html` — reference file only, never upload to KDP.
After any markdown change: re-run build-manuscript.sh before final-approval-agent.

---

## KDP PUBLISH GATE

The kdp-upload-agent will NEVER click Publish until the user types the exact word **PUBLISH**.
"Yes", "ok", "go ahead", "approved" — none of these are valid. Only PUBLISH.

---

## Non-Negotiable Rules

1. Session start → agent-log MODE 1 → read pipeline-state.json → report status
2. Before every chapter brief → brief-validator → PASS required
3. After every stage → quality-gate → PASS required before next stage
4. After every significant agent run → agent-log MODE 2 → update pipeline-state.json
5. No chapter saved without completing the full 4-agent pipeline
6. No EPUB/DOCX built manually — always use `bash build-manuscript.sh`
7. No credential claims for S.A. Ibrahim not actually held
8. BLUEPRINT.md + FACTS.md are source of truth — read before briefing any writing agent
9. Never do pipeline work inline — always invoke the correct agent
10. If an agent fails — tell the user and wait. Never self-substitute.
11. `manuscript-kdp.html` is reference only — never upload to KDP
12. book-wrapper-agent and epub-builder-agent are deprecated — never invoke them
