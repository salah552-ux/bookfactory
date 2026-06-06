# LAUNCH TRACKER — Fix Your Gut for Good: Stop Relapsing
## ASIN: B0GXYLWS1W | Live since: date unknown (approx. April 2026) | KDP Select: YES

---

> **BASELINE NOTE — 2026-05-31**
> This tracker was created by the pipeline-orchestrator audit on 2026-05-31. No weekly metrics have been logged yet — live BSR, review count, and KU pages require user input from the KDP dashboard. The post-launch-tracker agent cannot fetch this data autonomously; it must be supplied by the Architect from the KDP Sales Dashboard and Author Central.
>
> **URGENT ACTION REQUIRED:** Log Week 1 metrics immediately using `track launch fix-your-gut-for-good`. Paste values from the KDP dashboard.

---

## WEEKLY METRICS TABLE

| Week | Date | BSR Main | BSR Sub 1 | Reviews | Rating | KU Pages | Units Sold | Interventions Fired |
|------|------|----------|-----------|---------|--------|----------|------------|---------------------|
| — | 2026-05-31 | BASELINE — no data logged yet | — | 0 (pipeline-state) | null | null | null | none |

---

## KNOWN STATE (from pipeline-state.json — 2026-05-31)

| Field | Value | Source |
|-------|-------|--------|
| ASIN | B0GXYLWS1W | pipeline-state.json |
| KDP Status | live | pipeline-state.json |
| Live Date | not recorded | pipeline-state.json — fill in from Author Central |
| List Price (USD) | $9.99 | pipeline-state.json |
| List Price (GBP) | not recorded | pipeline-state.json — check KDP dashboard |
| Royalty % | 70% | pipeline-state.json |
| KDP Select | YES | pipeline-state.json |
| KDP Select Free Days Used | not recorded | check KDP dashboard |
| Countdown Deal Eligible From | not recorded | pipeline-state.json — check KDP dashboard |
| Review Count (pipeline record) | 0 | pipeline-state.json — may be stale |
| Avg Rating | null | pipeline-state.json |
| Ads Active | false | pipeline-state.json |
| A+ Content Live | false | pipeline-state.json |
| A+ Content Submitted | false | pipeline-state.json |
| Author Central UK | not live | pipeline-state.json |
| Author Central US | not live | pipeline-state.json |

---

## MILESTONE WATCH (as of 2026-05-31)

| Milestone | Status | Date | Action |
|-----------|--------|------|--------|
| 5 reviews — ADS SOFT TRIGGER | NOT MET | unknown | Build PAUSED Auto SP campaign at £1–2/day once hit |
| 10 reviews — AD GATE OPEN | NOT MET | unknown | Activate ads at £3–5/day |
| Countdown Deal window | UNKNOWN — check KDP | unknown | Confirm eligible date from KDP |
| BookFunnel link in back matter | NOT LIVE | blocking | See BOOKFUNNEL-SETUP.md |
| A+ Content | written, not submitted | blocking | Requires Brand Registry enrollment |
| Author Central UK + US | not live | urgent | Set up before any ad spend |

---

## INTERVENTION RULES STATUS

All rules from post-launch-tracker will fire on next logged week entry. Cannot evaluate without live data:
- BSR_STALL: needs 2 weeks of BSR data
- AD_GATE_OPEN: review_count >= 10 — not confirmed
- COUNTDOWN_WINDOW: needs live_date and countdown_deal_eligible_from
- BOOKBUB_ELIGIBLE: review_count >= 50 — not met
- KU_SURGE: needs 2 weeks of KENP data
- ADS_TRIGGER_AT_5_REVIEWS: review_count >= 5 — not confirmed

---

## TREND DIAGNOSIS (updated weekly)

**BSR trend:** UNKNOWN — no data logged
**Review velocity:** UNKNOWN — no data logged
**KU engagement:** UNKNOWN — no data logged
**Overall health:** GREY — no data. Cannot determine without KDP dashboard input.

**Next action:** Log Week 1 data immediately. Run `track launch fix-your-gut-for-good` and paste KDP dashboard values.

---

## HOW TO LOG WEEKLY DATA

Run: `track launch fix-your-gut-for-good`

Paste these values from the KDP Sales Dashboard + Author Central:
```
BSR main (overall Kindle): [number]
BSR subcategory 1 (category name): [number]
BSR subcategory 2 (category name): [number]
Reviews total (as of today): [number]
Average rating: [number]
KU pages read this week (KENP): [number]
Units sold this week (paid + free): [number]
Week number since launch: [number]
Date of reading: [YYYY-MM-DD]
KDP Select enrolled: yes
KDP Select free days used: [number out of 5]
Days since publish: [number]
```
