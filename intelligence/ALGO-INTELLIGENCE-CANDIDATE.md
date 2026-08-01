# ALGO-INTELLIGENCE CANDIDATE — drafted 2026-08-01 — NOT YET PROMOTED

**Architect: review, then merge approved entries into ALGO-INTELLIGENCE.md and bump its version.**

---

## Sweep Coverage

- **Current live doc version:** v1.2 — 2026-06-12
- **Search window:** 2026-06-12 → 2026-08-01 (approximately 7 weeks)
- **Searches run:**
  1. Amazon KDP algorithm / A10 ranking changes 2026 (Kindlepreneur, Written Word Media, ALLi, Publishers Weekly)
  2. KDP Select / Kindle Unlimited payout changes 2026 (written-word-media.com/kdp-global-fund-payouts, official KDP)
  3. Amazon KDP AI content disclosure policy update 2026 (kdp.amazon.com, selfpublishingadvice.org)
  4. Amazon Sponsored Products / Sponsored Brands books advertising changes 2026 (advertising.amazon.com)
  5. Amazon KDP category & keyword policy changes July 2026 (Kindlepreneur, kdp.amazon.com)
  6. Amazon KDP "July 2026" policy changes (selfpub.substack.com, selfpublishingadvice.org, janefriedman.com)
  7. KDP 70% royalty ceiling / $12.99 expansion (Publishers Lunch, Jane Friedman, ALLi, selfpub.substack)
  8. KDP category overhaul new options 2026 (getbooksreviewed.com, kidillus.com, manuscriptreport.com)
  9. KENP rate / Sponsored Brands KENP dashboard July 2026 (perpetua.io, scribecount.com)
  10. Amazon Ads agentic AI creative tool / unBoxed Toronto 2026 (advertising.amazon.com)

---

## RESULT SUMMARY

**1 HIGH confidence finding, 1 MEDIUM confidence finding.**
No changes detected to: core A10 ranking signals, KDP Select/KU payout structure, AI content disclosure requirements, or Amazon Ads campaign mechanics for books.

---

## Finding 1 — KDP eBook 70% Royalty Ceiling Raised from $9.99 to $12.99

**CONFIDENCE: HIGH** — official KDP policy change, corroborated by multiple authoritative sources including Publishers Lunch, Jane Friedman, ALLi, and the Substack Self-Publishing News newsletter.

**Claim:** Effective July 7, 2026, Amazon expanded the 70% royalty option price band for eBooks from $2.99–$9.99 to $2.99–$12.99 on Amazon.com (with equivalent adjustments in other KDP marketplaces). This is the first change to the upper price boundary since 2007. Books already priced above $9.99 do not automatically move to 70% — authors must manually switch the royalty option in KDP.

**Sources:**
- Publishers Lunch (July 2026): https://lunch.publishersmarketplace.com/2026/07/kdp-raises-price-ceiling-for-70-percent-royalty-rate-for-the-first-time/
- Jane Friedman (July 2026): https://janefriedman.com/kindle-direct-publishing-extends-70-percent-royalty-on-ebooks-from-9-99-price-point-to-12-99/
- ALLi / Self-Publishing Advice Centre: https://selfpublishingadvice.org/podcast-kdp-raises-its-top-royalty-ceiling/
- Self-Publishing News (July 9, 2026): https://selfpub.substack.com/p/kdp-royalties-just-got-better-july-9-2026
- Author Media (July 13, 2026): https://www.authormedia.com/the-week-that-changed-indie-publishing-kdp-royalties-book-pirates-and-ai-audio-theft/
- Official KDP eBook List Price page: https://kdp.amazon.com/en_US/help/topic/G200634560

**Publication dates:** July 7–13, 2026 (all post-June-12 cutoff). Effective date confirmed: July 7, 2026.

**Pipeline impact:**
- **`publisher-agent`** — must update ebook pricing guidance. The hard $9.99 ceiling for 70% royalty no longer applies. Non-fiction titles (gut health, business) can now be priced at $10.99–$12.99 and still earn 70%. The publisher-agent's current default pricing recommendations and KDP listing guidance should reflect this new band.
- **`marketing-agent`** — launch pricing strategy can now target the $10.99–$12.99 range for premium non-fiction without the royalty penalty. The 70%-vs-35% pricing table in any marketing templates should be updated.
- **`kdp-upload-agent`** — during the KDP upload review card, the pricing section must acknowledge the new $12.99 ceiling for 70% eligibility. Any hardcoded reference to "$9.99 maximum for 70%" is now wrong.

**What would change in pipeline agents:** Any text stating "books priced above $9.99 earn only 35%" or "cap your ebook at $9.99 to retain the 70% rate" must be corrected to $12.99. Authors with existing titles priced $10.00–$12.99 should be prompted to switch their royalty option manually.

---

## Finding 2 — AI-Generated Audio Appearing Without Author Permission (Emerging Threat, No KDP Policy Yet)

**CONFIDENCE: MEDIUM** — multiple independent practitioner reports from July 2026, but no formal KDP policy announcement or enforcement action found. Flagged as an emerging risk, not a confirmed platform change.

**Claim:** Multiple independent reports from July 2026 describe AI-generated audio versions of KDP titles appearing on Amazon and other platforms without authors' knowledge or consent. The mechanism cited is unauthorised scraping of Kindle content to produce synthetic audiobooks. As of the sweep date (2026-08-01), Amazon has not published a formal KDP policy response or new author protection mechanism. The threat is real but the platform's enforcement posture is unconfirmed.

**Sources:**
- Author Media (July 13, 2026): https://www.authormedia.com/the-week-that-changed-indie-publishing-kdp-royalties-book-pirates-and-ai-audio-theft/ (cites this alongside the royalty change as a major week-of development)

**Pipeline impact:**
- **`marketing-agent`** — may want to note the audio rights risk for authors considering DRM-free publication (following the January 2026 EPUB/PDF download policy). Authors enabling DRM-free downloads should be aware of the audio scraping risk.
- **`compliance-officer`** — if/when Amazon publishes a formal response or author protection tool, compliance checks should include verifying no unauthorised audio listings exist for the book.
- **`pre-launch-agent`** — no action required now. Monitor for a formal KDP enforcement announcement. If Amazon introduces a reporting tool or new rights-protection requirement, update accordingly.

**What would change when confirmed:** A new "audio rights" checklist item in the pre-launch and compliance passes, and a note in the DRM decision guidance advising authors of the trade-off.

---

## No Changes Detected (Searches Ran, Nothing New Found Post-June 12)

The following areas were searched specifically for the June 12 → August 1 window and returned **no new changes**:

| Topic | Status |
|---|---|
| A10/A11 core ranking signals (title, subtitle, KENP, velocity, Also-Bought) | No changes — current ALGO-INTELLIGENCE.md §1–§11 remain valid |
| KDP Select / Kindle Unlimited payout structure | No structural change; June 2026 global fund = $67.0M, per-page rate ~$0.0048 (normal variance, not a policy change) |
| AI content disclosure requirements | No new requirements; 2023 policy unchanged |
| KDP category/keyword policies | Category overhaul (958 new categories) was April 2026 — pre-dates this window; no further changes found |
| Amazon Ads Sponsored Products for books | Sponsored Products AI Prompts (GA March 2026) and Sponsored Brands Collections (April 30, 2026) both pre-date this window; no new ads features found for July 2026 |
| KDP print royalty structure | The June 2025 print royalty reduction (60%→50% for books under $9.99) pre-dates this window; no further changes |
| Amazon Ads Creative Agent / unBoxed Toronto | Launched February 2026 / expanded in 2026 — pre-dates this window; excluded from authors directly |

---

## Pre-Window Items for Architect Awareness

These changes occurred **before** June 12, 2026 and therefore should already be in ALGO-INTELLIGENCE.md if not already there. Flagged in case the v1.2 document predates them:

1. **KDP EPUB/PDF downloads for DRM-free books** (effective January 20, 2026) — affects `kdp-upload-agent` DRM decision guidance.
2. **958 new KDP categories added** (April 2026) — many are low-traffic "ghost categories"; affects `kdp-seo-agent` category selection strategy.
3. **Amazon Sponsored Brands Collections** (April 30, 2026) — new multi-ASIN ad format; affects `amazon-ads-agent`.
4. **KDP print royalty 60%→50% for books under $9.99** (June 10, 2025) — affects `publisher-agent` print pricing.

---

*Sweep run by algo-intelligence-agent on 2026-08-01. Do NOT promote this file to ALGO-INTELLIGENCE.md without Architect review.*
