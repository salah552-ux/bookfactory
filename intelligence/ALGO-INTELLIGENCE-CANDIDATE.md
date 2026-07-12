# ALGO-INTELLIGENCE CANDIDATE — drafted 2026-07-01 — NOT YET PROMOTED

**Architect: review, then merge approved entries into ALGO-INTELLIGENCE.md and bump its version.**

> **Note:** No `ALGO-INTELLIGENCE.md` exists in this repository. This is the **inaugural sweep**. All findings below are new. Once reviewed and approved, the Architect should create `ALGO-INTELLIGENCE.md` with the approved entries as the v1.0 baseline.

---

## Search Coverage (last ~5 weeks: 2026-05-26 → 2026-07-01)

Queries run:
- `KDP algorithm changes Amazon book ranking 2026`
- `Kindle Unlimited KDP Select payout changes 2026`
- `Amazon Sponsored Products ads books changes 2026`
- `KDP AI content disclosure policy changes 2026 self-published authors`
- `Amazon KDP category keyword policy changes 2026 kindlepreneur`
- `Amazon Rufus AI search books KDP ranking impact 2026`
- `KDP Select library ebooks loosen exclusivity 2026 ALLi`
- `Amazon KDP account closures AI content spam crackdown 2026`
- `KDP community announcements May June 2026 new features`
- `Amazon KDP DRM EPUB PDF download January 2026 author impact`
- `Amazon Sponsored Brands authors video ads new 2026`
- `KDP upload frequency limit title throttle 2026 spam prevention`
- `Amazon KDP print royalty change paperback hardcover 2026`
- `KDP Global Fund May June 2026 KENP payout rate`

Sources prioritised: Kindlepreneur, selfpublishingadvice.org (ALLi), writtenwordmedia.com, kdp.amazon.com, selfpublishingadvice.org, TechCrunch, Jane Friedman, Publishers Weekly, advertising.amazon.com.

---

## Findings

---

### FINDING 01 — DRM-Free Books Now Downloadable as EPUB/PDF

**Claim:** Effective January 20, 2026, verified purchasers of DRM-free KDP ebooks can download the file in EPUB and PDF formats. Books published before December 9, 2025 require a manual opt-in by the author in KDP; newer books with DRM off inherit this automatically.

**Source:**
- [Amazon Is Allowing EPUB & PDF Downloads for DRM-Free Kindle Books | Kindlepreneur](https://kindlepreneur.com/amazon-drm-epub-downloads/) — Jan 2026
- [Amazon changes how copyright protection is applied to Kindle Direct's self-published e-books | TechCrunch](https://techcrunch.com/2025/12/10/amazon-changes-how-copyright-protection-is-applied-to-kindle-directs-self-published-ebooks/) — Dec 2025
- [Amazon Shifts DRM Rules for KDP E-Books | selfpublishingadvice.org (ALLi)](https://selfpublishingadvice.org/amazon-shifts-drm-rules/) — 2026
- [Amazon customers can now easily download DRM-free ebooks | Jane Friedman](https://janefriedman.com/amazon-customers-can-now-easily-download-drm-free-ebooks/) — 2026

**CONFIDENCE: HIGH** — Covered by Kindlepreneur, TechCrunch, ALLi/selfpublishingadvice.org, and Jane Friedman. Consistent details across all sources. Official KDP help page also updated.

**Impact:**
- **kdp-upload-agent**: Must present the DRM decision to the author with full context before uploading. Choosing DRM-off now has a direct reader experience consequence (open download). Recommend adding a DRM decision gate to the pre-publish review card.
- **marketing-agent**: DRM-free books can now be downloaded and read on any device. Changes the wide vs. KU calculus slightly — readers who buy on Amazon are no longer locked to the Kindle ecosystem.

---

### FINDING 02 — KDP Select Now Permits Public Library Distribution

**Claim:** Amazon quietly updated KDP Select enrollment terms (around September 2025) to explicitly permit public library distribution — via OverDrive, Hoopla, BorrowBox, and similar platforms — without violating the KU exclusivity requirement. Retail distribution to Apple Books, Kobo, or Barnes & Noble still violates exclusivity.

**Source:**
- [Kindle Unlimited Library Distribution has arrived! | writepublishsell.com](https://writepublishsell.com/ku-ebooks-library-distribution/) — 2026
- [KDP Select Library Distribution Changes | Atmosphere Press](https://atmospherepress.com/kdp-select-library-distribution-indie-authors-2/) — 2026
- [ALLi / @IndieAuthorALLI on X](https://x.com/IndieAuthorALLI/status/1965026499595055428) — confirming "Amazon loosens KDP Select rules so ebooks can reach libraries"

**CONFIDENCE: HIGH** — Confirmed by ALLi social post, Atmosphere Press, and multiple corroborating practitioner sources. No formal Amazon press release, but the policy language change is verifiable in KDP Select terms.

**Impact:**
- **marketing-agent**: The wide-vs-KU trade-off has changed materially. KU can now reach library readers (OverDrive/Hoopla) without going wide. Library placement should be added to the KU opt-in recommendation when appropriate.
- **kdp-upload-agent**: Should inform authors of this exception during the KU enrollment discussion.

---

### FINDING 03 — Sponsored Brands Expanded to Single-Book Authors + Video Ads + AI Creative

**Claim:** Amazon Ads has made Sponsored Brands available to all KDP authors regardless of catalog size (previously required multiple titles). New ad formats added: video ads, custom image ads (AI-generated via Amazon's tool at no charge), and ad groups for campaign organisation. Geographic expansion to India, Mexico, Netherlands, and Japan. Custom image ads showed an average 48% higher CTR on mobile vs. standard product images.

**Source:**
- [Sponsored Brands: Now available for Single-Book Authors | Amazon Ads (official)](https://advertising.amazon.com/resources/whats-new/sponsored-brand-now-available-for-single-book-authors)
- [New features for authors on Sponsored Brand – Custom Image, Video ads, Ad groups | Amazon Ads (official)](https://advertising.amazon.com/resources/whats-new/new-features-for-authors-on-sponsored-brand)
- [International expansion of sponsored ads for authors | Amazon Ads (official)](https://advertising.amazon.com/resources/whats-new/sponsored-products-and-sponsored-brands-ads-expansion)

**CONFIDENCE: HIGH** — Three separate official Amazon Ads announcement pages. No publication date visible on these pages, but the pages exist on advertising.amazon.com with verifiable URLs.

**Impact:**
- **amazon-ads-agent**: Must add a Sponsored Brands campaign to the 4-campaign launch stack (currently Auto-All, Manual-Broad, Manual-Exact, ASIN-Targeting). Single-book authors are now eligible. Video creative brief and custom image brief should be added to the campaign setup workflow.
- **ams-optimizer-agent**: Add Sponsored Brands CTR and ACoS to the weekly optimisation report template.

---

### FINDING 04 — KDP Select Global Fund at Record $66.9M (May 2026)

**Claim:** The KDP Select Global Fund reached $66.9 million in May 2026, up from $61.2 million in October 2025 and $62–64M average in Q1 2026. KENP per-page payout in early 2026 ranged from $0.004202 (January) to $0.004820 (April), with the rate fluctuating month-to-month.

**Source:**
- [Up to Date list of KDP Global Fund Payouts | Written Word Media](https://www.writtenwordmedia.com/kdp-global-fund-payouts/) — updated monthly
- [Amazon KDP Select Royalties: Global Fund Payouts | danieljtortora.com](https://danieljtortora.com/blog/amazon-kdp-select-global-fund-payout)

**CONFIDENCE: MEDIUM** — Written Word Media is a credible, data-driven practitioner source that tracks this monthly. The specific $66.9M May 2026 figure appears in their tracker. Not an official Amazon announcement.

**Impact:**
- **marketing-agent**: Rising Global Fund is a positive signal for KU inclusion decisions. The fund growth trend suggests Amazon is investing in KU, making KU more attractive relative to wide distribution for certain niches.
- **amazon-ads-agent**: Higher KENP rates increase breakeven ACoS thresholds for KU titles — worth updating the CVR model input assumptions.

---

### FINDING 05 — AI Disclosure Enforcement Has Tightened; Account Closures Reported

**Claim:** Amazon's AI-generated content disclosure requirement (mandatory since late 2023) is being actively enforced in 2025–2026. Authors who fail to check the disclosure box for AI-generated text, images, or translations face book removal, and repeat violators face account termination. Amazon does NOT display a public-facing "AI-generated" label on the product page — disclosure is recorded internally only. Enforcement escalated visibly in 2026 with multiple author account closures reported in the indie community.

**Source:**
- [Amazon KDP AI Content Policy 2026: Official Disclosure Rules | univers.studio](https://univers.studio/blog/ai-generated-content-kdp/) — 2026
- [Amazon KDP Announces Major Publishing Rule Changes for Authors in 2026 | writercosmos.com](https://www.writercosmos.com/blog/amazon-kdp-announces-major-publishing-rule-changes-for-authors-in-2026/) — 2026
- [A Few Thoughts about Amazon Closing KDP Author Accounts | vaniamargene.com](https://vaniamargene.com/2026/04/06/a-few-thoughts-about-amazon-closing-kdp-author-accounts/) — April 2026
- [KDP Content Guidelines | kdp.amazon.com (official)](https://kdp.amazon.com/en_US/help/topic/G200672390)

**CONFIDENCE: MEDIUM** — Widely reported by multiple practitioner sources with consistent details. Account closure cases are anecdotal but from multiple independent authors. Official KDP policy page confirms the requirement; enforcement stringency is practitioner-observed.

**Impact:**
- **kdp-upload-agent**: The AI disclosure checkbox is mandatory and must be part of the pre-publish review card. The agent must ask the author to declare whether any content (text, images, or translations) is AI-generated. Gate must block publishing until this is explicitly confirmed.
- **compliance-officer**: Should add an AI disclosure audit step. Any book written or assisted by AI tools must have the disclosure flag confirmed before the compliance sign-off.
- **design-agent**: AI-generated cover images must also be disclosed. This is a separate checkbox from text disclosure.

---

### FINDING 06 — Category Count Capped at 3; Amazon No Longer Grants Additional Categories

**Claim:** Amazon has capped book category placement at 3 categories (down from a historical 10) and is no longer granting requests to add extra categories beyond the initial 3 selected. Additionally, Amazon rolled out hundreds of new subcategories in early 2026, but many have very low traffic (referred to as "ghost categories") — ranking #1 in a ghost category produces negligible sales.

**Source:**
- [How to Choose KDP Categories in 2026 (And Actually Rank #1) | manuscriptreport.com](https://manuscriptreport.com/blog/kdp-category-selection-guide) — 2026
- [Amazon KDP Keywords 2026 | manuscriptreport.com](https://manuscriptreport.com/blog/amazon-kdp-keywords) — 2026
- [Authors! Critical Change to Amazon Categories | claudinewolk.substack.com](https://claudinewolk.substack.com/p/authors-critical-change-to-amazon)
- [Amazon Book Categories: How to Find the Ones Most Authors Miss | Kindlepreneur](https://kindlepreneur.com/how-to-choose-the-best-kindle-ebook-kdp-category/) — 2026

**CONFIDENCE: MEDIUM** — Reported consistently across Kindlepreneur and multiple practitioner sources. The 3-category limit change is widely accepted in the indie author community. The "ghost category" phenomenon is a practitioner observation without official acknowledgement. No specific Amazon announcement with date found.

**Impact:**
- **publisher-agent**: Category selection strategy must be updated. Selecting only 3 categories means each must carry more weight — prioritise categories with genuine reader traffic over low-competition ghost categories. Research traffic before selecting.
- **amazon-ads-agent**: ASIN-targeting campaigns should avoid competitor titles in ghost categories. Category-level targeting also affected.
- **deep-market-intelligence-agent**: Must validate category traffic, not just bestseller rank, before recommending a category to target.

---

### FINDING 07 — Keyword Strategy Shift: Amazon NLP + Rufus AI / Generative Search

**Claim:** Amazon's ranking algorithm now uses NLP (Natural Language Processing) and is integrated with its "Rufus" AI shopping assistant. Rufus answers natural-language reader questions ("a lighthearted book for a stressed mum") by scanning book metadata, reviews, and blurbs for semantic context — not keyword exact-matches. Keyword stuffing is penalised. Repeating words from the book title in the 7 backend keyword slots is now wasteful (Amazon's NLP already indexes title words). Long-tail, reader-intent phrases outperform single keywords.

**Source:**
- [Amazon KDP Algorithm Changes 2026: 11 New Rules for Authors | sfshaw.com](https://sfshaw.com/2026/04/15/amazon-kdp-algorithm-changes-2026-guide/) — April 2026
- [Amazon Rufus Impact on Sellers: AI Analytics Strategy 2026 | novadata.io](https://novadata.io/resources/blog/amazon-rufus-impact-sellers-analytics) — 2026
- [Amazon KDP Algorithm 2026: What Changed and How to Rank | aibookseo.com](https://aibookseo.com/blog/amazon-kdp-algorithm-2026-what-changed-and-how-to-rank-your-book) — 2026
- [Amazon Book Keyword Rules Explained | Kindlepreneur](https://kindlepreneur.com/amazon-book-keyword-rules/) — updated 2026

**CONFIDENCE: MEDIUM** — Rufus AI's existence and role on Amazon is confirmed (it's Amazon's live AI shopping assistant). Its specific impact on book metadata rankings is reported by multiple practitioner sources but without direct Amazon confirmation or official documentation. The NLP / semantic search shift is plausible and consistent with Amazon's broader product search direction.

**Impact:**
- **publisher-agent**: Must update the 7-keyword slot strategy. No title-word repetition. Prioritise long-tail reader-intent phrases over single keywords. Factor in conversational search patterns Rufus would parse.
- **deep-market-intelligence-agent**: Keyword research methodology should include semantic variants and natural-language question formats, not just keyword volume tools.

---

### FINDING 08 — Title Upload Frequency Limit (Anti-Spam Cap)

**Claim:** Amazon introduced daily and weekly caps on new title uploads per KDP account. Authors are reportedly limited to approximately 3 new titles per day and 10 per week (limits may vary by account standing). Duplicate interiors with different covers are flagged and removed. The cap targets AI-generated spam flooding.

**Source:**
- [Amazon's Kindle Direct Publishing Will Limit Daily Number of New Titles | Publishers Weekly](https://www.publishersweekly.com/pw/by-topic/digital/content-and-e-books/article/93207-kdp-will-limit-daily-number-of-new-titles.html)
- [KDP AI Terms Places Limits on Titles | selfpublishingadvice.org (ALLi)](https://selfpublishingadvice.org/self-publishing-news-kdp-ai-new-limits-on-titles/) — 2026
- [NEW UPLOAD LIMITS? How Amazon's Latest KDP Update Affects YOU! | Medium](https://medium.com/@dannyondemand/new-upload-limits-how-amazons-latest-kdp-update-affects-you-fcf97cb5def1)

**CONFIDENCE: MEDIUM** — Publishers Weekly and ALLi's selfpublishingadvice.org both reference title upload limits. The specific 3/day and 10/week figures come from community reports and may vary by account. The general policy direction is confirmed by credible sources.

**Impact:**
- **pipeline-orchestrator**: No direct impact on single-book builds. For series authors publishing multiple titles in rapid succession, this cap is a scheduling constraint. The orchestrator should note this if running multi-book parallel builds.
- **kdp-upload-agent**: Should communicate the upload frequency limit to the author during the publishing workflow, especially for series builds where multiple volumes may be queued.

---

### FINDING 09 — Print Royalty Two-Tier Structure: 60% (≥$9.99) / 50% (<$9.99)

**Claim:** Since June 2025, KDP paperback and hardcover royalties are tiered by list price: 60% royalty rate (minus printing costs) for books priced at $9.99 / £7.99 or above; 50% royalty rate (minus printing costs) for books priced below that threshold. This change is ongoing and affects pricing strategy for print books.

**Source:**
- [Paperback Royalty | kdp.amazon.com (official)](https://kdp.amazon.com/en_US/help/topic/G201834330)
- [KDP Royalty Rates 2026: Complete Guide | kdpeasy.com](https://www.kdpeasy.com/guides/2026-kdp-royalty-rates) — 2026
- [re. Changes to royalty rates for print books | KDP Community](https://www.kdpcommunity.com/s/question/0D5at00000G2ZyqCAF/re-changes-to-royalty-rates-for-print-books-and-color-printing-costs-starting-june-10-2025?language=en_US) — June 2025 community thread

**CONFIDENCE: HIGH** — The tiered print royalty structure is confirmed in the official KDP help page. The KDP Community thread from June 2025 confirms the change date. Multiple third-party sources corroborate.

**Impact:**
- **publisher-agent**: Print pricing recommendations must reflect the 60%/$9.99 threshold. A paperback priced at $9.98 takes a 10-percentage-point royalty penalty. The minimum viable print price should be $9.99 in the US unless there is a specific competitive reason to go below.
- **final-approval-agent**: Print pricing should be verified against this threshold in the 300-point rubric.

---

## Findings Summary

| # | Finding | Confidence | Primary Agents Affected |
|---|---------|------------|------------------------|
| 01 | DRM-free books now downloadable as EPUB/PDF (Jan 20, 2026) | HIGH | kdp-upload-agent, marketing-agent |
| 02 | KDP Select now permits public library distribution (Sept 2025) | HIGH | marketing-agent, kdp-upload-agent |
| 03 | Sponsored Brands open to single-book authors + video/AI ads | HIGH | amazon-ads-agent, ams-optimizer-agent |
| 04 | KDP Select Global Fund at $66.9M in May 2026 (KENP ~$0.0042–$0.0048) | MEDIUM | marketing-agent, amazon-ads-agent |
| 05 | AI disclosure enforcement tightened; account closures reported | MEDIUM | kdp-upload-agent, compliance-officer, design-agent |
| 06 | Category cap at 3; no extra categories granted; ghost category risk | MEDIUM | publisher-agent, amazon-ads-agent, deep-market-intelligence-agent |
| 07 | Keyword strategy shift: NLP + Rufus AI semantic search | MEDIUM | publisher-agent, deep-market-intelligence-agent |
| 08 | Title upload frequency cap (~3/day) anti-spam enforcement | MEDIUM | pipeline-orchestrator, kdp-upload-agent |
| 09 | Print royalty tiered: 60% ≥$9.99 / 50% <$9.99 (since June 2025) | HIGH | publisher-agent, final-approval-agent |

**Total: 3 HIGH, 5 MEDIUM, 0 LOW**

---

## Items Specifically NOT Included (Rejected as LOW / Unverifiable)

- **"A10 organic sales carry 3× the weight of PPC"** — Specific multiplier from a single practitioner blog with no sourcing. Not included.
- **"External traffic gives 40% higher organic ranking"** — Same issue. Statistical claims without data provenance. Not included.
- **"A9 → A10 → A11 terminology"** — "A10" and "A11" are practitioner labels, not official Amazon nomenclature. Amazon has not confirmed these version names. All algorithm behaviour is described by its observable effects only.

---

*Sweep completed 2026-07-01. Next scheduled sweep: 2026-08-01.*
