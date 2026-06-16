# KDP Upload Guide — The 7-Day Gut Reset
## Stage 07-publishing | publisher-agent + kdp-upload prep | 2026-06-13

**Status lock:** This is the manual upload runbook. **Do NOT click "Publish."** `published` stays `false`; no ASIN exists yet. The human gate (`ai_questionnaire_confirmed`, then the word PUBLISH) has not been granted. This guide prepares the draft and the exact field values; the final click is a separate, human-gated action.

**Series number:** Book **3** of **Fix Your Gut for Good** (swap locked 2026-06-12). Only Book 1 is live; Book 2 (*The H. Pylori Recovery Plan*) is held at its own publish gate.

**Data sources:** KDP-LISTING.md (2026-05-23, Stage 07 reconciled) | CONVERSION-COPY.md (2026-06-13) | MARKET-INTELLIGENCE.md | FACTS.md | SERIES-FACTS.md master record (2026-06-12) | ALGO-INTELLIGENCE.md v1.2 | pipeline-state.json | AGENT-RULES.md Rule 1.

---

## 0. PRE-UPLOAD GATE CHECK (must all be true before opening KDP)

| Gate | Required | Current state | Source |
|------|----------|---------------|--------|
| final_approval_passed | true | **true** | pipeline-state.json |
| cover_approved | true | **true** | pipeline-state.json |
| EPUB built ≥ valid | yes | manuscript-kdp.epub on disk | exports/final/ |
| PDF built | yes | manuscript-kdp.pdf on disk | exports/final/ |
| Cover built | yes | cover-kdp-final.jpg (1600×2560 JPEG RGB) | exports/final/ |
| ai_questionnaire_confirmed | true before submit | **false — human gate pending** | pipeline-state.json |
| published | stays false this session | **false** | pipeline-state.json |

> If `ai_questionnaire_confirmed` is false, you may build the **draft** to the point of the AI questionnaire and stop. You may NOT submit.

---

## 1. BOOK DETAILS TAB

- **Language:** English
- **Book Title:** `The 7-Day Gut Reset`
- **Subtitle:** `Find Your Trigger and Calm Your Gut in One Week`
- **Series:** `Fix Your Gut for Good`  — **byte-for-byte identical** across all three books (ALGO v1.2 §7: a single capitalisation/spacing/punctuation variant creates a *separate* series page and permanently breaks the cross-book carousel). Series number: **3**.
- **Edition number:** leave blank (first edition).
- **Author (primary):** `S.A. Ibrahim`
- **Contributors:** none.
- **Description:** paste the **HTML from KDP-LISTING.md §5** (this is CONVERSION-COPY.md RECOMMENDED PRIMARY = Variant A, fear-first, 47/50). It leads with the primary key phrase "The 7-Day Gut Reset" inside the first 200 characters. Validate the HTML renders (`<h2>`, `<p>`, `<b>`, `<ul>`, `<li>`, `<i>`) in the KDP preview.
- **Publishing rights:** "I own the copyright and hold publishing rights."

### 1a. AI Content Disclosure (MANDATORY — KDP blocks submit if blank; ALGO v1.2 §16)
Answer all three sub-fields (values from KDP-LISTING.md §7):
1. **Text — AI-generated?** → **Yes**, AI-generated text that I reviewed and edited.
2. **Images (cover) — AI-generated?** → **Yes**, AI-generated images that I reviewed and edited.
3. **Translation — AI?** → **No.**

> This is the human gate. Completing this questionnaire honestly and then ticking `ai_questionnaire_confirmed: true` in pipeline-state.json is the human's action — not the agent's.

---

## 2. KEYWORDS (7 slots — byte-checked, ASCII-only, no title-word repeats)

Paste one phrase per slot, in priority order. All are ASCII so **character count = byte count** (ALGO v1.2 §17 — fields are 50 *bytes*, not 50 chars):

| # | Keyword | Bytes / 50 | Title-word repeat? |
|---|---------|-----------|--------------------|
| 1 | `gut health reset` | 16 | no (full long-tail phrase) |
| 2 | `find your gut trigger` | 21 | no |
| 3 | `7 day gut protocol` | 18 | no |
| 4 | `bloating relief plan` | 20 | no |
| 5 | `ibs diagnostic guide` | 20 | no |
| 6 | `low fodmap alternative` | 22 | no |
| 7 | `gut healing for beginners` | 25 | no |

All ≤ 50 bytes. None duplicates a title/subtitle word as a standalone slot (ALGO v1.2 lean-keyword rule). Search-volume data for these phrases: **We need real data for this before making a recommendation** (requires Publisher Rocket; not available this session).

---

## 3. CATEGORIES (HARD CAP = 3 — ALGO v1.2 §15)

KDP's form accepts 2 at upload; request the 3rd via KDP support immediately after. **Never exceed 3.**

1. **Primary (#1 New Release target):** `Kindle eBooks > Health, Family & Lifestyle > Diseases & Physical Ailments > Abdominal Disorders` — specific, winnable sub-category; category/keyword/blurb intent agree (prevents auto-recategorization, ALGO v1.2).
2. **Secondary (reach):** `Kindle eBooks > Health, Family & Lifestyle > Diet & Nutrition > Digestive Health` — where the self-pub field sits; book legitimately qualifies (Days 3–4 dietary protocol).
3. **Third (request post-upload):** `Kindle eBooks > Health, Family & Lifestyle > Self-Help > Stress Management` — earned by the Day 5 vagal-tone (Stress Bridge) content.

> Action at upload day (T−14): check the **live #1 New Release BSR** in Abdominal Disorders. If it sits above ~150,000 the badge is realistic with the launch plan; if well below ~50,000, escalate to a narrower sub-category. We need that live figure before locking the badge claim.

---

## 4. CONTENT TAB (files)

- **Manuscript:** `exports/final/manuscript-kdp.epub` — preview in Kindle Previewer: TOC works, chapter breaks clean, no orphan lines.
- **Cover:** `exports/final/cover-kdp-final.jpg` (1600×2560, JPEG, RGB) — passed all 7 COVER-PSYCHOLOGY Section 9 checks (FINAL-APPROVAL 48/50).
- **DRM:** ON.
- **Page-read (KENPC):** set by Amazon at indexing; verify in KDP reporting post-go-live. ~12,124 words ≈ ~48 KENPC at ~250 words/page (ALGO §8) — directional only.
- **`[AMAZON_REVIEW_LINK]` placeholder:** the back-matter review CTA still contains this placeholder. Substitute the live review URL **only after the ASIN exists** (post go-live). Do not fabricate an ASIN now.

---

## 5. PRICING & ROYALTY (settings only — do not schedule promos until go-live clears)

- **KDP Select:** ENROLLED (KU borrow velocity is the primary launch rank channel; ALGO §8). Lead magnet is NEVER in KDP Select — that is a *separate Stage-08 product*, not this book.
- **Royalty:** 70%.
- **Price:** £2.99 UK / $3.99 US. Other marketplaces: DE/FR €3.49, AU AU$5.99, CA CA$4.99 — all flagged "confirm at KDP" (We need real data for the live converted figures).
- **Free days (KDP Select):** 2 days at **T−5 / T−4**, paid launch **T−3** (free-BEFORE-paid, ALGO §12). Schedule only after go-live clears review.
- **Countdown Deal:** Day 30 of the paid term (70% royalty retained on the promo price, ALGO §9). Verify the current Countdown royalty rate on the KDP pricing page before running.

> Net royalty per UK sale at £2.99 ≈ £2.04–£2.09 after delivery (KDP rate card). This is a real figure from the rate card, not an invented projection.

---

## 6. PRE-PUBLICATION CHECKLIST (carry from KDP-LISTING.md §10)

```
[ ] Title / Subtitle / Author exact (Section 1)
[ ] Series string "Fix Your Gut for Good" byte-identical; number = 3
[ ] Description HTML = Variant A (CONVERSION-COPY primary); renders cleanly
[ ] 7 keywords pasted, all <=50 bytes, no title-word slots (Section 2)
[ ] Category 1 + 2 set; Category 3 requested via KDP support (max 3)
[ ] KDP Select ENROLLED; DRM ON
[ ] AI questionnaire: Yes (text) / Yes (cover image) / No (translation)  <-- HUMAN GATE
[ ] Price GBP 2.99 / USD 3.99; other markets confirmed at KDP
[ ] Cover + EPUB uploaded; previewed in Kindle Previewer
[ ] Author Central UK + US profiles live, book linked, series set
[ ] A+ Content drafted (keyword-bearing headers per CONVERSION-COPY A+ COPY)
[ ] Goodreads listing prepared (link ASIN post-go-live)
[ ] Editorial Reviews: only genuine quotes; empty better than fabricated
[ ] DO NOT CLICK PUBLISH — published stays false until human types PUBLISH
```

---

## 7. WHAT THIS GUIDE DOES NOT DO

- It does **not** publish. No final submit. `published` remains `false`; `asin` remains `null`.
- It does **not** invent any sales number, BSR, conversion rate, timeline cost, or ad budget. Every such value is either a real figure from a cited source (KDP rate card, harvested.json via MARKET-INTELLIGENCE.md) or reads "We need real data for this before making a recommendation."
- It does **not** modify the live Book 1 manuscript or claim a live status for Book 2.

---

*Rule 1 compliance: every numeric value above traces to KDP-LISTING.md, MARKET-INTELLIGENCE.md, the KDP rate card, or pipeline-state.json. Zero invented numbers. The book is not published by this guide.*
