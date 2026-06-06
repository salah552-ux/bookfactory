# BookFactory Intelligence Layer

Stage 00 of the pipeline. Nothing gets commissioned without the intelligence layer clearing it first.

## Purpose

Replaces guessing with data-backed conviction. Every new book recommendation is produced by harvesting real Amazon data, running analysis algorithms, and synthesising a blueprint through the Opus brain. Production execution time drops to 1–2 hours once the brain has done its job.

**Don't know what niche to build next?** Start with `find niches` — the niche finder sweeps Amazon category pages proactively and surfaces candidates you haven't thought of yet.

## The Full Sequence (including discovery)

```
DON'T KNOW WHAT TO BUILD?
        ↓
  [0] find niches         ← niche-finder-agent
      Amazon category sweep + also-bought signals
      → NICHE-CANDIDATES-[date].md
        ↓
      HUMAN GATE: Architect picks candidate
      "add niche [slug]" → niches.json updated
        ↓
KNOW WHAT NICHE TO BUILD?
        ↓
  run intelligence [niche]
        ↓
  [1] harvest [niche]
      Playwright scrape → opportunity.db + opportunity-db.json + INTELLIGENCE-LOG.md
        ↓
  [2] analyse opportunities [niche]
      analyzer.py → 5 algorithms → OPPORTUNITY-REPORT-[date]-[niche].md + [niche]_analysis.json
        ↓
  [3] run brain [niche]     ← requires claude-opus-4-8
      Reads opportunity report → reasons from data → BLUEPRINT-[date]-[niche].md
        ↓
      HUMAN GATE: Architect types "approved"
      pipeline-state.json intelligence_gate.gate_cleared = true
        ↓
  [4] Stage 01 research begins
      market-researcher + competitive-positioning-agent
      (uses cached BSR data from Stage 00 — no re-scraping)
```

## Agents

| Agent | File | Model | Trigger |
|-------|------|-------|---------|
| `niche-finder-agent` | `00-intelligence/niche-finder-agent.md` | sonnet-4-6 | `find niches` or `find niches [anchor]` |
| `intelligence-orchestrator-agent` | `00-intelligence/intelligence-orchestrator-agent.md` | sonnet-4-6 | `run intelligence [niche]` |
| `harvester-agent` | `00-intelligence/harvester-agent.md` | sonnet-4-6 | `harvest [niche]` |
| `analyzer-agent` | `00-intelligence/analyzer-agent.md` | sonnet-4-6 | `analyse opportunities [niche]` |
| `opus-brain-agent` | `00-intelligence/opus-brain-agent.md` | **opus-4-8** | `run brain [niche]` |

## Files

```
intelligence/
  opportunity-db.json       ← JSON snapshot layer (NEVER delete — velocity tracking over time)
  opportunity.db            ← SQLite primary store (NEVER delete — full harvest history)
  harvested.json            ← Raw output of most recent harvest (overwritten each run)
  INTELLIGENCE-LOG.md       ← Global log of all Stage 00 runs (NEVER delete)
  NICHE-CANDIDATES-[date].md ← Output of niche-finder-agent runs (one file per run)
  niches.json               ← Niche config: search terms, marketplaces, priority
                               priority 1–2 = active | priority 3 = candidate (added by finder)
  failure-store.json        ← Agent failure log
  database.py               ← SQLite schema + save_products()
  analyzer.py               ← Analysis algorithms (implements analyzer-agent.md formulas exactly)
  harvester.py              ← REFERENCE ONLY — do not run; Amazon blocks raw HTTP scraping
  harvester.js              ← REFERENCE ONLY — do not run; Amazon blocks raw HTTP scraping
  schema.sql                ← Database schema
  reports/                  ← Per-niche OPPORTUNITY-REPORT-[date]-[niche].md + JSON analysis files
  blueprints/               ← BLUEPRINT-[date]-[niche].md files (opus-brain-agent output)
```

## Python Scripts

### analyzer.py (authoritative)

Implements all five algorithms from analyzer-agent.md exactly:

1. **BSR → Sales Velocity** — converts BSR to daily sales estimate range using the community-derived UK table
2. **Saturation Score** — A/B/C formula (A_score×0.4 + B_score×0.3 + C_score×0.3)
3. **Price Elasticity** — median, top5/bottom10 avg, premium tier detection, market character
4. **Content Gap Detection** — title keyword frequency + structural pattern frequency (not hardcoded strings)
5. **Opportunity Score** — four components (demand/saturation/price/gap) each 0–25, total 0–100

Output: `intelligence/reports/[niche-slug]_analysis.json`

### harvester.py and harvester.js (reference only)

These use raw HTTP requests which Amazon blocks almost immediately with CAPTCHAs.
The actual harvest is performed by `harvester-agent.md` using Playwright's `browser_evaluate()`.
These files are kept for their parsing and DB-write logic only.

## Algorithms

### Saturation Score (0–10, lower = less saturated = more opportunity)
```
A = count of books with BSR < 50,000
B = count of new entrants published in last 90 days
C = median review count across the sample

A_score = min(A / 5, 10)
B_score = min(B * 2, 10)
C_score = min(C / 100, 10)

Saturation Score = (A_score × 0.4) + (B_score × 0.3) + (C_score × 0.3)
```

### Opportunity Score (0–100, higher = better opportunity)
```
Demand (0–25):      based on best BSR in niche
Saturation (0–25):  (10 - saturation_score) / 10 × 25
Price (0–25):       PREMIUM TOLERANT=25, WIDE SPREAD=15, COMPRESSED=10
Content gap (0–25): sparse patterns found=25, partial=15, none=5
```

Verdicts: 80+ = ENTER | 60–79 = ENTER WITH ANGLE | 40–59 = CAUTION | <40 = AVOID

## Rules

- The intelligence layer MUST run for a niche within 14 days before Stage 01 begins on any new book.
- BSR → daily sales conversions are community-derived estimates. Label as ESTIMATE everywhere.
- `opportunity.db`, `opportunity-db.json`, and `INTELLIGENCE-LOG.md` accumulate forever — never overwrite historical data.
- `harvested.json` is overwritten on each run — it holds only the most recent scrape.
- The `opus-brain-agent` requires `claude-opus-4-8`. Hard requirement — do not run on Sonnet.
- No intelligence output may be fabricated. If data is missing, write "insufficient data."
- When top BSR slots are held by trad-pub anchors, always strip them out and report the self-pub effective opportunity score separately.
