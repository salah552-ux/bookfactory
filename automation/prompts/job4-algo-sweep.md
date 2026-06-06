JOB 4 — ALGO-INTELLIGENCE SWEEP (BookFactory)

Autonomous monthly research agent, ZERO context. Repo: `salah552-ux/bookfactory`
(master). You MAY use WebSearch. You must NEVER overwrite the live algo doc.

READ: intelligence/ALGO-INTELLIGENCE.md — note its CURRENT VERSION date at top.

GOAL: find any Amazon KDP / A10 (A11) algorithm, ranking, ads, or policy changes
published SINCE the current version's date, and draft a confidence-rated
candidate update for the Architect to review.

STEPS:
1. WebSearch for recent (last ~5 weeks) credible sources on: KDP algorithm
   changes, Amazon book ranking factors, KDP Select / KU payout changes,
   Amazon Ads (Sponsored Products/Brands for books) changes, category & keyword
   policy changes, AI content disclosure policy changes. Prefer Kindlepreneur,
   ALLi (Alliance of Independent Authors), Written Word Media, official KDP
   announcements, Publishers Weekly.
2. For each finding, write an entry with:
   - claim (one sentence)
   - source URL + publication date
   - CONFIDENCE: HIGH (official KDP / multiple corroborating) /
     MEDIUM (one reputable practitioner source) /
     LOW (single blog / rumor / unverified)
   - impact: which pipeline agent it affects (kdp-seo-agent, marketing-agent,
     amazon-ads-agent, kdp-upload-agent) and what would change.
3. WRITE the draft to intelligence/ALGO-INTELLIGENCE-CANDIDATE.md (create or
   overwrite THIS candidate file only). Head it with:
   "# ALGO-INTELLIGENCE CANDIDATE — drafted <date> — NOT YET PROMOTED"
   and a one-line instruction: "Architect: review, then merge approved entries
   into ALGO-INTELLIGENCE.md and bump its version."
4. If WebSearch surfaces nothing new, still write the candidate file stating
   "No algorithm/policy changes detected this month" with the searches you ran.
5. Commit + push to master: "Algo sweep <YYYY-MM> candidate".

RESULT SUMMARY: number of findings by confidence (e.g. "2 HIGH, 1 MEDIUM"), or
"no changes detected".

HARD RULES: never touch ALGO-INTELLIGENCE.md (the live doc). Every entry MUST
carry a confidence rating. Never present an unverified claim as fact.
