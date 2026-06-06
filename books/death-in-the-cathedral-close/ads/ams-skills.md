# AMS Skills — Death in the Cathedral Close
## Accumulated from campaign sessions. Update after every weekly run.

---

## BOOK ECONOMICS (read from pipeline-state.json each session — verify these are current)

| Metric | Value |
|--------|-------|
| List price (GBP) | £6.99 |
| Royalty per sale | £4.77 |
| Break-even ACOS | 68.2% |
| Target ACOS | 51.2% (break-even × 0.75) |
| Scale threshold | 38.4% (target × 0.75 — confidently profitable) |
| Cut threshold | 85.0% (break-even × 1.25 — significantly losing) |

**These replace the generic 30%/40%/55% thresholds in the base agent.**

Decision logic using book-specific thresholds:
- ACOS < 38%: SCALE — raise bid 10%, increase budget
- ACOS 38–51%: HOLD — profitable at target, do not change
- ACOS 51–68%: WATCH — marginal, one more week
- ACOS 68–85%: CUT BID — losing money, reduce bid 15%
- ACOS > 85%: PAUSE — significant loss, pause immediately

---

## KEYWORD PERFORMANCE HISTORY

Track each keyword across weeks. Replace estimates with real data as it arrives.

| Keyword | Match | Week 1 ACOS | Week 2 ACOS | Week 3 ACOS | Week 4 ACOS | Status | Current Bid |
|---------|-------|------------|------------|------------|------------|--------|-------------|
| church murder mystery england | Exact | — | — | — | — | Not started | — |
| traditional british mystery older protagonist | Exact | — | — | — | — | Not started | — |
| english cosy mystery village community | Exact | — | — | — | — | Not started | — |
| cozy mystery amateur sleuth retired | Exact | — | — | — | — | Not started | — |
| whodunit mystery novel england | Exact | — | — | — | — | Not started | — |
| british cosy mystery series | Exact | — | — | — | — | Not started | — |
| cozy mystery books like thursday murder club | Exact | — | — | — | — | Not started | — |

*Fill in real ACOS from campaign reports each week.*

---

## SEARCH TERM HARVEST LOG

Track what has been promoted and negated. Prevents duplicate work each session.

### Promoted to Exact Match
| Search Term | Promoted On | From Campaign | Starting Bid | Current ACOS |
|-------------|------------|--------------|-------------|-------------|
| (none yet) | | | | |

### Negated Terms
| Search Term | Negated On | Match Type | Campaign | Reason |
|-------------|-----------|-----------|---------|--------|
| (none yet) | | | | |

---

## ASIN TARGET PERFORMANCE

| ASIN | Book | Impressions | Clicks | Orders | ACOS | Status |
|------|------|------------|--------|--------|------|--------|
| (populate when Campaign 4 goes live) | | | | | | |

---

## CPC ACTUALS (replace estimates once live)

| Keyword | Est. CPC (pre-launch) | Actual CPC Week 1 | Actual CPC Week 2 |
|---------|----------------------|------------------|--------------------|
| church murder mystery england | £0.10–£0.20 | — | — |
| traditional british mystery older protagonist | £0.25–£0.40 | — | — |
| english cosy mystery village community | £0.15–£0.28 | — | — |
| cozy mystery amateur sleuth retired | £0.15–£0.28 | — | — |
| whodunit mystery novel england | £0.25–£0.40 | — | — |

---

## BUDGET ALLOCATION HISTORY

| Week | Campaign 1 (Auto) | Campaign 2 (Broad) | Campaign 3 (Exact) | Campaign 4 (ASIN) | Total/Day |
|------|------------------|-------------------|-------------------|-------------------|-----------|
| Launch | — | — | — | — | — |

---

## WEEKLY ACOS TREND

| Week | Portfolio ACOS | vs Target (51.2%) | Spend | Ad Revenue | Net |
|------|---------------|-------------------|-------|-----------|-----|
| (not started) | | | | | |

---

## SESSION LOG

| Date | Agent | Action | Key Learning |
|------|-------|--------|-------------|
| 2026-05-03 | amazon-ads-agent | Pre-campaign intelligence harvest | Break-even ACOS 68.2%. Launch keyword priority: church murder mystery england first. 5 reviews needed before any campaigns. CVR model: 2%/4%/7% at 0/5/15+ reviews. |

*Add a row after every session — both amazon-ads-agent and ams-optimizer-agent sessions.*
