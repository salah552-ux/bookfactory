# ALGO-INTELLIGENCE CANDIDATE — drafted 2026-09-01 — NOT YET PROMOTED

**Architect: review, then merge approved entries into ALGO-INTELLIGENCE.md and bump its version.**

*This candidate covers changes found via WebSearch on 2026-09-01, targeting the window since ALGO-INTELLIGENCE.md v1.2 (2026-06-12). Searches consulted: Kindlepreneur, Publishers Marketplace, Jane Friedman, ALLi / Self-Publishing Advice Centre, Written Word Media, Authors Guild, and Amazon official advertising documentation.*

---

## SWEEP SUMMARY

| Confidence | Count |
|------------|-------|
| HIGH       | 2     |
| MEDIUM     | 4     |
| LOW        | 1     |
| **Total**  | **7** |

Two findings are HIGH confidence and actionable now. One (§CAND-1, royalty ceiling) is the most commercially significant KDP change since 2023 and directly affects every pricing decision the publisher-agent makes.

---

## FINDING CAND-1 — KDP 70% Royalty Ceiling Raised to $12.99

**CONFIDENCE: HIGH** — announced by Publishers Marketplace (Michael Cader, 2026-07-10); confirmed independently by Jane Friedman, ALLi (selfpublishingadvice.org), and the Authors Guild. Multiple corroborating sources across industry trade press and practitioner media.

**Effective date:** July 7, 2026.

**Claim:** Amazon has raised the upper price boundary for the 70% royalty option from $9.99 to $12.99, effective 7 July 2026 on Amazon.com (and equivalent adjustments on other KDP marketplaces). This is the first expansion of the 70% price band since 2007.

**What changed specifically:**
- Old band: $2.99–$9.99 → 70% royalty. Books priced $10.00–$12.99 were locked to 35%.
- New band: $2.99–$12.99 → 70% royalty. Books in the $10.00–$12.99 range now earn 70%.
- The 35% royalty option and $2.99 minimum remain unchanged.
- **Authors must manually opt in** for existing titles priced between $10.00 and $12.99 — the change is not automatic. KDP will not switch existing pricing plans without author action.
- For titles published after July 7, 2026, the 70% plan is available immediately up to $12.99.

**Authors Guild statement:** welcomed the change, noting the $9.99 ceiling had long compressed pricing for longer works, box sets, and specialised nonfiction.

**Sources:**
- Publishers Marketplace, Michael Cader, 2026-07-10: https://lunch.publishersmarketplace.com/2026/07/kdp-raises-price-ceiling-for-70-percent-royalty-rate-for-the-first-time/
- Jane Friedman blog: https://janefriedman.com/kindle-direct-publishing-extends-70-percent-royalty-on-ebooks-from-9-99-price-point-to-12-99/
- ALLi / Self-Publishing Advice Centre: https://selfpublishingadvice.org/amazon-raises-kdp/
- Authors Guild statement: https://authorsguild.org/news/statement-on-amazon-kdp-raising-70-percent-royalty-ceiling/

**Impact on pipeline agents:**

- **publisher-agent** — CRITICAL UPDATE NEEDED. All pricing recommendations in KDP-LISTING.md output must now reflect the $12.99 ceiling for 70% royalty. Any book currently advised to price at £/$9.99 or below to preserve 70% royalty has more headroom. Specialised non-fiction, longer works, and box sets should be re-evaluated against the new ceiling.
- **marketing-agent** — Update ACoS break-even calculations in MARKETING-PLAN.md. At $12.99 × 70% = $9.09 royalty (minus delivery). This significantly widens the sustainable ad spend window for higher-priced titles.
- **amazon-ads-agent** — Bid and budget calculations that assumed 70% royalty maxes at $9.99 are now incorrect for books priced $10–$12.99. Re-run break-even models for any active book in this price range.
- **kdp-seo-agent** — Pricing guidance in SEO-STRATEGY.md should note the new ceiling when advising on price–keyword relevance pairing.

**Recommended addition to ALGO-INTELLIGENCE.md:** Add as §18, under the existing §9 (Price as a Relevance Signal).

---

## FINDING CAND-2 — DRM-Free EPUB/PDF Download Feature (January 20, 2026) — Not Captured in v1.1 or v1.2

**CONFIDENCE: HIGH** — covered by Kindlepreneur, Jane Friedman, and ALLi (selfpublishingadvice.org). Amazon's own KDP documentation supports the feature.

**Note:** This change predates the v1.2 cutoff (2026-06-12) but was not captured in v1.1 (2026-06-03) or v1.2 (2026-06-12). Including here for the Architect to add to the main document.

**Effective date:** January 20, 2026.

**Claim:** Amazon now allows verified purchasers to download EPUB and PDF files for KDP ebooks that were published without Digital Rights Management (DRM). This makes DRM-free books portable across non-Kindle devices.

**What changed specifically:**
- Applies only to DRM-free titles published through KDP.
- For books published **after December 9, 2025**: DRM-free books automatically become eligible for EPUB/PDF download.
- For books published **before December 9, 2025**: opt-in is required through the KDP account settings — DRM-free status alone does not automatically enable downloads for these older titles.
- Buyers receive an EPUB file (for non-Kindle devices) and/or a PDF file (for offline storage).
- Books with DRM enabled are not affected — DRM titles remain Kindle-only.

**Author consideration:** DRM-free removes friction for legitimate readers but also reduces the barrier to file copying and redistribution. Authors who previously had DRM disabled may want to reconsider their settings. Authors publishing new titles must make an active DRM decision at upload — previously, defaulting to no-DRM had no download portability consequence.

**Sources:**
- Kindlepreneur: https://kindlepreneur.com/amazon-drm-epub-downloads/
- Jane Friedman: https://janefriedman.com/amazon-customers-can-now-easily-download-drm-free-ebooks/
- ALLi / Self-Publishing Advice: https://selfpublishingadvice.org/amazon-shifts-drm-rules/

**Impact on pipeline agents:**

- **kdp-upload-agent** — IMPORTANT. The upload checklist must include an explicit DRM decision step. Default to "DRM enabled" unless the Architect has decided otherwise for a specific title. Note: DRM-off now has a meaningful practical consequence (purchaser gets portable EPUB) that it did not have before January 2026.
- **publisher-agent** — No direct listing impact, but should note DRM status in the upload package passed to kdp-upload-agent.

**Recommended addition:** Add as §19.

---

## FINDING CAND-3 — KU KENP Rate: Declining Trend — July 2026 at $0.004221/page

**CONFIDENCE: MEDIUM** — Written Word Media tracks this monthly and is a credible independent source. Single source (could not corroborate with a second independent tracker this session).

**Claim:** The Kindle Unlimited KENP per-page payout rate has declined from approximately $0.004820 in April 2026 to $0.004221 in July 2026 — a drop of approximately 12.4% in three months. The July 2026 Global Fund total was $67.6 million.

**Context:** The existing ALGO-INTELLIGENCE.md (§8 / §14) cites "~£0.004–0.005 per page at 2025 rates" as the approximate range. The July 2026 figure ($0.004221) is at the lower end of this band and trending downward, driven by increasing total page reads (more books enrolled in KU, more AI-generated content flooding the programme) against a fund that does not scale proportionately.

**August 2026 rate:** Not yet published. Amazon typically announces KENP rates around the 15th of the following month. The August 2026 figure is expected circa September 15, 2026.

**Source:**
- Written Word Media KDP Global Fund tracker: https://www.writtenwordmedia.com/kdp-global-fund-payouts/

**Impact on pipeline agents:**

- **marketing-agent** — KU revenue-per-borrow estimates in MARKETING-PLAN.md should use $0.004–0.0043 per page (downward-revised) rather than $0.005. For a 60,000-word novel (~240 KENPC), at $0.004221: approximately $1.01 per completed borrow. At the prior $0.005 assumption: $1.20. Recalculate ROI projections using the lower figure.
- **amazon-ads-agent** — KU effective ACOS calculations must use updated KENP rate. A KU-heavy niche has lower per-engagement revenue than prior models assumed.
- **post-launch-agent** / **ams-optimizer-agent** — Monthly tracking should flag if rate falls below $0.004; at that level KDP Select exclusivity becomes difficult to justify on revenue grounds alone for non-fiction.

**Recommended update:** Update §8 KENP rate guidance to reflect the 2026 measured trend ($0.0042–0.0048 range observed, trending downward).

---

## FINDING CAND-4 — Amazon Ads Now Available on Goodreads (DSP Supply Source)

**CONFIDENCE: MEDIUM** — Confirmed on Amazon's own advertising announcements page (advertising.amazon.com) and by the ppc.land industry tracker. Announced October 2025; currently US-only. Predates v1.2 but not captured in the existing document.

**Claim:** Goodreads is now available as a named supply source within Amazon DSP (Demand-Side Platform), allowing Sponsored Display ads and DSP display creative to appear on Goodreads pages. Self-service advertisers can access Goodreads inventory directly through the DSP ad console.

**What this means practically:**
- Authors running Sponsored Display campaigns may now see their ads appearing on Goodreads reader profiles, bookshelves, and list pages — without any additional targeting action. Goodreads placement is included automatically as part of Amazon Owned & Operated inventory.
- DSP advertisers can target Goodreads explicitly as a placement.
- This is US-market only as of the announcement.
- Authors **cannot** granularly target Goodreads through the standard Sponsored Products console — it is a DSP-level feature. Sponsored Products may appear in some Goodreads integrations automatically but this is not author-controllable.

**Sources:**
- Amazon official advertising announcements: https://advertising.amazon.com/resources/whats-new/reach-millions-of-reader-with-goodreads-on-amazon-dsp
- ppc.land industry tracker: https://ppc.land/goodreads-joins-amazon-dsp-as-new-supply-source-for-advertisers/
- Reedsy: https://reedsy.com/blog/amazon-ads-for-authors/

**Impact on pipeline agents:**

- **amazon-ads-agent** — Note Goodreads as an automatic Sponsored Display placement in the US. When evaluating impression share and CPM benchmarks, Goodreads inventory may contribute. No separate campaign is required, but if reporting shows unexpectedly high Goodreads impression volume, this is the cause.
- **marketing-agent** — Goodreads placement strengthens the case for running Sponsored Display at launch (reader-intent audience at the precise moment they are evaluating their next read).

**Recommended addition:** Add as §20.

---

## FINDING CAND-5 — AI Disclosure Enforcement: Active Escalation Path Now Confirmed

**CONFIDENCE: MEDIUM** — Multiple independent practitioner sources reporting consistent escalation pattern. No single Amazon-published policy page documented the escalation path explicitly, but the pattern is widely and consistently reported across the author community from 2026 H1.

**Claim:** Amazon's enforcement of the AI content disclosure requirement (§16 in ALGO-INTELLIGENCE.md) has moved from a passive self-declaration system to an active enforcement model with a documented escalation path.

**Escalation path (practitioner-reported, not Amazon-published):**
1. Automated detection via writing-pattern analysis and submission velocity signals
2. Notification email to the author
3. Title suppression during human review
4. Permanent removal of non-compliant title
5. Account-level flag — repeated violations lead to account-wide publishing restrictions and royalties at risk

**Updated status for existing §16 claims:**
- "Amazon does not currently verify declarations automatically" — this appears **outdated**. Multiple sources describe automated detection. UPDATE: revise §16 to note automated detection is now operational.
- "No confirmed suppression of books based on AI disclosure status" — **now contradicted** by practitioner reports. Undisclosed AI books face suppression and removal, even if disclosed AI books do not face ranking penalties.

**Note:** The disclosure itself (declaring AI content) is still stated by Amazon as NOT affecting rankings or discoverability. The enforcement applies to *undisclosed* AI content, not to disclosed AI content.

**Sources:**
- univers.studio KDP AI policy 2026: https://www.univers.studio/blog/kdp-ai-content-policy-2026/
- inkfluenceai.com: https://www.inkfluenceai.com/blog/amazon-kdp-ai-disclosure-policy-2026
- kdpbuilder.com: https://kdpbuilder.com/blog/kdp-ai-disclosure-rules

**Impact on pipeline agents:**

- **kdp-upload-agent** — The AI disclosure gate already in place (from §16) should remain. Add a note: enforcement has active automated detection; undisclosed AI-generated content now risks suppression and account action, not just policy violation. The risk is real, not theoretical.
- **compliance-officer** — Update risk classification for undisclosed AI content from THEORETICAL to CONFIRMED. Treat as a FLAG-level risk item, not LOW.

**Recommended update:** Update §16 status fields: automated detection from UNVERIFIED to CONFIRMED (MEDIUM), suppression of undisclosed content from UNVERIFIED to CONFIRMED (MEDIUM).

---

## FINDING CAND-6 — Duplicate Interior Flagging: Active KDP Enforcement

**CONFIDENCE: MEDIUM** — multiple practitioner blogs and KDP's own low-content guidance page point to this. No single official KDP enforcement announcement found, but the pattern is consistent and widely observed.

**Claim:** Amazon KDP is now actively detecting and actioning books with "duplicate interiors" — multiple listings with near-identical or minimally varied interior content. This is enforced at the account level for repeat offenders, not just the individual title level.

**What triggers this:**
- Near-identical journals, planners, or activity books with only cover variations
- Mass-uploads of books with the same interior in multiple listings
- AI-generated interiors with minimal variation across multiple SKUs

**Enforcement actions reported:**
- Individual title removal
- For repeat offenders: account-wide publishing restrictions
- Note: Amazon's low-content category (journals, trackers, activity books) remains permitted — the trigger is duplicate/near-duplicate interiors, not the category itself.

**Sources:**
- pubnook.com KDP Low-Content Book Policy 2026: https://pubnook.com/article/amazon-kdp-low-content-book-policy-2026-whats-allowed-and-what-gets-removed
- Amazon official KDP low-content guidance: https://kdp.amazon.com/en_US/help/topic/GGE5T76TWKA85DJM

**Impact on pipeline agents:**

- **kdp-upload-agent** — If a new title uses an interior format already published in another BookFactory title (e.g., a planner or tracker template), flag for the Architect. Do not publish near-duplicate interiors without confirmation from the Architect that they are sufficiently differentiated.

**Recommended addition:** Add as §21.

---

## FINDING CAND-7 — "Dwell Time" / Page Engagement as Ranking Signal

**CONFIDENCE: LOW** — Multiple practitioner blogs report this in 2026, but no Amazon-published source confirms it. Treat as a working hypothesis only. Do not build hard strategy on this alone.

**Claim:** A10 algorithm updates in 2026 are reported by practitioners to include "dwell time" — how long a browser stays on a book's product page — as an additional ranking signal. Related engagement metrics reportedly tracked include: scroll depth on the product page, Look Inside sample read depth, A+ Content scroll engagement, image zoom events, and add-to-cart rate after browsing.

**What practitioners claim:**
- A reader who spends several minutes reading the Look Inside and then purchases is a stronger ranking signal than a reader who clicks and purchases immediately.
- Listings with A+ Content (comparison charts, rich images, module text) appear to have higher dwell time and corresponding ranking improvement.

**Why LOW confidence:**
- Amazon has not published any specification naming "dwell time" as a ranking factor.
- The signal would be consistent with the existing CVR and engagement mechanics already in §2 (conversion rate) and §6 (A+ Content). It may be practitioner re-labelling of already-documented behaviours rather than a genuinely new signal.
- None of the sources are Kindlepreneur, ALLi, or other primary research publishers — all are practitioner blog observations.

**Sources:**
- sfshaw.com A10 2026 guide: https://sfshaw.com/2026/04/15/amazon-kdp-a10-algorithm-2026-exposed/
- sellersprite.com A10 2026: https://www.sellersprite.com/en/blog/Amazon-SEO-How-the-A10-Algorithm-Works-in-2026
- Medium/Neil Caley A10 survival guide: https://medium.com/@neilcaley/amazon-kdp-is-changing-fast-the-2026-survival-guide-to-ranking-royalties-and-the-a10-algorithm-bac40eda3dd7

**Impact if confirmed:**

- **publisher-agent / aplus-content-agent** — A+ Content would become even more important: richer page content → higher dwell time → better ranking. Prioritise A+ modules with scroll-depth-encouraging layouts (comparison charts, long-form module text).
- **kdp-seo-agent** — Would strengthen the case for a compelling Look Inside (high-quality opening, strong first chapter) as a ranking lever, not just a conversion lever.

**Recommended addition:** Add as §22 with LOW confidence label and strong caveat that it remains unconfirmed by Amazon.

---

## SEARCHES CONDUCTED

1. "Amazon KDP algorithm changes 2026 ranking factors A10"
2. "KDP Select Kindle Unlimited payout changes 2026"
3. "Amazon Ads Sponsored Products books KDP advertising changes 2026"
4. "KDP AI content disclosure policy changes 2026"
5. "Amazon KDP category keyword policy changes 2026"
6. "Kindlepreneur Amazon KDP algorithm update July August 2026"
7. "ALLi Alliance Independent Authors KDP policy update 2026" (selfpublishingadvice.org)
8. "Amazon KDP Sponsored Brands books eligibility changes August 2026"
9. "KDP duplicate content AI-generated books crackdown removal 2026"
10. "Kindle Unlimited global fund July August 2026 KENP rate"
11. "Amazon KDP ebook pricing ceiling $12.99 royalty changes 2026"
12. "Amazon Ads Goodreads book advertising 2026 new placement"
13. "Amazon KDP EPUB PDF DRM-free download January 2026 authors" (Kindlepreneur, Jane Friedman)
14. "Written Word Media KDP news July August 2026" (writtenwordmedia.com)
15. "KDP royalty ceiling $9.99 raised $12.99 July 2026 Publishers Weekly official"
16. "Amazon KDP 'dwell time' ranking factor 2026 page engagement"
17. "Amazon DSP Goodreads advertising launch date 2026 when available"
18. "KDP low content book removal policy stricter 2026 July August enforcement"

---

*Drafted by algo-intelligence-agent (automated sweep) on 2026-09-01. Architect review required before any finding is merged into ALGO-INTELLIGENCE.md.*
