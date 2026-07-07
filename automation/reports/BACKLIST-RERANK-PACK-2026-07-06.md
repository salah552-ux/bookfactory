# BACKLIST RE-RANK PACK — 2026-07-06

**Prepared for:** The Architect
**Scope:** The 4 live BookFactory titles flagged as underselling.
**Basis:** `intelligence/ALGO-INTELLIGENCE.md` v1.3 (esp. §18 COSMO, §19 Rufus, §20 NLP title suppression, §21 sustained engagement, §22 review drip, §23 Backlist Re-Rank Playbook) + `intelligence/LESSONS.md` + each book's KDP-LISTING.md, FACTS.md, and pipeline-state.json.

---

## ⚠️ READ THIS FIRST — WHAT THIS PACK IS AND IS NOT

- **This pack is RECOMMENDATIONS ONLY.** Every item is for the Architect to review and apply manually on the KDP dashboard. Nothing here has been (or should be) pushed to Amazon by an agent. No KDP login, no metadata write, no outward action was taken to produce this file.
- **No pipeline-state.json was written.** (One book, `h-pylori-recovery-plan`, may be under edit by another agent; its state file was read only.)
- **No invented numbers, quotes, sales estimates, budgets, or projections appear anywhere.** Every factual claim in the rewritten descriptions already exists in that book's FACTS.md / KDP-LISTING.md. No new claim was introduced.
- **Anything not verifiable from files on disk is flagged `VERIFY ON LIVE PAGE`.** Amazon category names drift, auto-recategorisation happens (v1.3 §23 Lever 5), and several on-disk listings may not match what is actually live. Confirm on the product page before acting.
- **v1.3 hard cautions carried into every book below:** do NOT republish to reset the new-release window; do NOT run a concentrated review burst; do NOT keyword-stuff the title. (ALGO §23 "What NOT to do".)
- **Baseline first (ALGO §23 Lever 6):** before changing anything on a given book, log its current BSR, review count, KENP/day and category rank via `calibration_engine.py add-observation`, then re-observe at Day 14 and Day 30. The levers below are hypotheses to test, not guaranteed uplifts.

---

## Portfolio-level cross-cutting finding (applies to 3 of 4 books)

The single most repeated problem across the portfolio is **category placement, not copy.** Two live books are confirmed sitting in a category that does not match their metadata intent, and a third has an unresolved category-slot conflict on disk. Under v1.3 §18/§23 Lever 5, category–intent mismatch actively suppresses a book (Amazon can auto-move it, and the conversion data for the wrong category depresses rank). This is a higher-leverage fix than any blurb rewrite and it costs nothing but a dashboard edit. Category audits below are flagged per book.

---
---

# 1. Fix Your Gut for Good: Stop Relapsing

- **ASIN:** B0GXYLWS1W
- **Status on disk:** live; `07-publishing` complete. `pipeline-state.json` line 7 records "US marketplace verification completed… confirmed live at amazon.com/dp/B0GXYLWS1W."
- **Market note / FLAG:** the task brief labels this UK-market, but the on-disk state and the KDP-LISTING price everything in **USD ($9.99 list, $2.99 displayed)** and confirm the live page on **amazon.com (US)**. `VERIFY ON LIVE PAGE` which marketplace is primary before acting; the audit below assumes the US listing that the state file documents.

## 1.1 Current listing audit

**Title (as written in KDP-LISTING.md §1, entered as one string):**
> "Fix Your Gut for Good: Stop Relapsing — The 4-Phase SIBO Protocol for Root Cause Recovery — What Your Doctor Didn't Tell You About Why You Keep Coming Back"

- **§20 NLP / readability risk (LOW-MEDIUM confidence lever).** This is three clauses joined by two em dashes and runs ~150 characters. It reads closer to a keyword list than natural human language ("…SIBO Protocol for Root Cause Recovery — What Your Doctor Didn't Tell You About Why You Keep Coming Back"). v1.3 §20 reports NLP scoring that favours one strong key phrase in a readable title over a stacked string. This is a *candidate for tightening*, not a mandate — a live title change is a heavier decision than a blurb edit and carries its own risks; flag to Architect, do not auto-change.
- **Description first-200-characters (§1 + §19).** Current opening H2 + first sentence:
  > "You Did Everything Right. It Still Came Back. Here's Why." … "If you've completed a course of rifaximin — or a month of low-FODMAP, or both — and you're still bloating…"
  This is genuinely strong, mechanism-led reader-problem language and is *already* close to what §19 wants. Its one weakness for the semantic/retrieval layer: the literal condition phrase readers actually type ("SIBO keeps coming back", "bloating after antibiotics") sits below the fold rather than inside the first 200 indexed characters. Small reframe opportunity, not a rewrite emergency.
- **Category signal is the real problem (see 1.4).** The live US category path recorded in state (line 155) is `Books > Medical Books > Medicine > Internal Medicine > Pathology > Diseases > Digestive Organs` — **not** the IBS/SIBO sub-category the whole listing (KDP-LISTING §5) and blurb intent target. Under §23 Lever 5 this is a metadata↔category intent mismatch and the highest-leverage fix on this book.

## 1.2 Rewritten description (paste-ready HTML)

Reframe only: front-loads the reader's literal problem phrase into the first 200 characters for A9 first-200 indexing (§1) + COSMO/Rufus retrieval (§18/§19). **Every factual claim below already appears in the current KDP-LISTING.md and FACTS.md** (43.7% 9-month rifaximin relapse rate; ~42% lactulose breath-test sensitivity; MMC; type-specific sequencing; 4-phase framework; Doctor Communication Toolkits). No new claim added.

```html
<h2>Your SIBO keeps coming back. You didn't fail the protocol.</h2>
<p>You finished the rifaximin. You did the weeks of low-FODMAP. You felt better — and then the bloating came back, exactly like before. If you have relapsed once, twice, or more and been told your tests are normal, the problem was never that you did it wrong. The problem is that the treatment cleared the bacteria without ever addressing why they keep returning.</p>
<p><i>Stop Relapsing</i> is the SIBO book built around the mechanism behind relapse. Studies show 43.7% of patients relapse within nine months of successful rifaximin treatment. This book explains why that happens to so many people, and gives you a specific, sequenced plan to change it.</p>
<p>The 4-Phase framework treats relapse prevention as the main event, not a footnote:</p>
<ul>
<li><b>Phase 1 — Assessment:</b> identify your specific SIBO type and the root cause no antibiotic touches. Includes why the lactulose breath test misses more than half of true positives (~42% sensitivity) and what a negative result actually means.</li>
<li><b>Phase 2 — Eradication:</b> the right treatment in the right order for your type — hydrogen, methane (IMO), and hydrogen sulfide need different protocols in a specific sequence.</li>
<li><b>Phase 3 — Reintroduction:</b> the step almost everyone skips — why "feeling better" is not the same as being better.</li>
<li><b>Phase 4 — Root cause resolution:</b> the migrating motor complex, the gut's housekeeping mechanism, and the most overlooked reason cleared SIBO returns within months.</li>
</ul>
<p>You also get four scripted Doctor Communication Toolkits — word-for-word language for the appointment when it is closing down and you still haven't got what you came for.</p>
<p>This is for the confirmed relapser: someone who did the research, followed the instructions, and is still not well — because the framework they were given was incomplete. If you're ready to stop treating the bacteria and start closing the door that keeps letting them back in, scroll up and get your copy.</p>
<p><i>This book is educational and is not a substitute for medical care. Persistent gut symptoms should be reviewed by your doctor.</i></p>
```

*Note:* the closing italic line mirrors the disclaimer style used in the vagus and h-pylori listings and the book's own copyright-page disclaimer; it is a safety caution, not a factual claim. Drop it if the Architect prefers the current no-disclaimer description.

## 1.3 Keyword slot review (backend, 7 slots)

Rule applied (unchanged from listing + §1/§18): no repetition of any word already in the title/subtitle ("SIBO", "relapse", "root cause", "recovery", "protocol", "doctor"), phrase-match long-tail, ASCII, ≤50 bytes. No search-volume numbers are asserted.

| # | Current slot | Reasoning | Recommendation |
|---|---|---|---|
| 1 | `small intestinal bacterial overgrowth treatment` (48) | Spelled-out formal variant of the title's "SIBO"; genuine added long-tail; multi-concept phrase (good for COSMO §18). | **KEEP** |
| 2 | `SIBO relapse prevention` | ⚠️ "SIBO" and "relapse" are BOTH already in the title/subtitle — per §18 + v1.2 no-repeat rule this slot is largely wasted. | **REPLACE** → suggest `bloating after antibiotics not working` (37) — reader's literal problem phrase, zero title overlap. Candidate only; do not assert volume. |
| 3 | `gut motility disorder treatment` | Captures MMC/motility-adjacent intent; no title overlap; research-literate phrase. | **KEEP** |
| 4 | `IBS bloating root cause fix` | ⚠️ contains "root cause" (in subtitle). Bridges to larger IBS pool but the repeat weakens it. | **TWEAK** → `IBS bloating relief that lasts` (29) removes the title-word repeat while keeping the IBS bridge. |
| 5 | `bacterial overgrowth diet and antibiotics guide` (48) | Strong multi-concept phrase, treatment-comparison intent; no title overlap. | **KEEP** |
| 6 | `prokinetics gut health protocol` | ⚠️ "protocol" is in the title. "Prokinetics" is a genuine open-lane term. | **TWEAK** → `prokinetics for gut motility` (28) drops the repeated "protocol". |
| 7 | `leaky gut bloating relief treatment` | Lay-term crossover from the larger gut-health pool; no title overlap; borderline manuscript density but acceptable for a backend slot. | **KEEP** |

## 1.4 Category audit note (FLAG — do not decide)

- **Confirmed mismatch.** Intended categories (KDP-LISTING §5): IBS + Abdominal Disorders + Kindle IBS. Live US path on disk: `…Pathology > Diseases > Digestive Organs`. This looks like an Amazon auto-recategorisation event (§10 + §23 Lever 5).
- **Candidate to flag (Architect decides, not this pack):** realign to the specific, winnable sub-category the metadata and blurb intent already point at — `Health, Fitness & Dieting > Diseases & Physical Ailments > Irritable Bowel Syndrome` — so category, keywords, and blurb agree (§18 semantic match). `VERIFY ON LIVE PAGE` the exact current category chips and the exact live category-path names before requesting any change.

## 1.5 Review-drip + external-traffic actions (from §21–§23 only)

- **Lever 6 (baseline):** log current BSR, review count, KENP/day, category rank before touching anything.
- **Lever 3 (sustained review drip, §22):** if this book had a launch burst then silence, do NOT run another burst. A slow reactivation — a handful of honest, **verified-purchase** reviews spread across Weeks 1–4 — is the safer, higher-ranking pattern.
- **Lever 4 (external-traffic revival, §5 HIGH confidence):** fresh direct-to-`amazon.com/dp/B0GXYLWS1W` links from a Pinterest / Reddit (r/SIBO, r/ibs) / newsletter push feed Amazon Attribution. Highest-leverage lever for a live book because it costs nothing and the attribution signal is Amazon-published. Use the raw `/dp/[ASIN]` URL — routing through Linktree/landing pages breaks the signal (§5).
- **Lever 1 (metadata refresh):** apply 1.2 + 1.3 + 1.4 together so category/keyword/blurb intent all agree.

---
---

# 2. Death in the Cathedral Close

- **ASIN:** B0GZD1S8HF · UK · fiction (cozy/British mystery)
- **Status on disk:** live 2026-05-03; `10-postlaunch` in progress.
- **Underselling evidence (on disk):** first live BSR logged 2026-06-02 (Countdown Deal Day 1) = **Overall #1,370,902** (pipeline-state line 110). Deep rank confirms the underselling flag.

## 2.1 Current listing audit

The **copy is strong and largely §19-aligned already** — the problem here is almost entirely category, not description.

- **Description opening (KDP-LISTING §3):**
  > "She spent thirty-five years reading the dead. She didn't expect to find one here." … "For readers of *The Thursday Murder Club* and the Hamish Macbeth series…"
  This is exactly what §19 (Rufus retrieval) rewards: a natural human hook plus comp-author anchors in paragraph 1. Comp titles in the first lines feed conversational "books like Thursday Murder Club" queries. **No rewrite needed for discovery reasons** — keep it.
- **Title/subtitle (§20):** "Death in the Cathedral Close" + "The Cathedral Close Mysteries — Book 1" is clean, readable, series-bearing. Passes §20. No change.
- **The real audit finding — a live category is missing.** State line 90/110: "CATEGORY MISMATCH CONFIRMED — Cozy not live." The listing intends 3 categories (Amateur Sleuth + Cozy + British & Irish) but the **highest-CTR "Cozy" badge is not live on the product page.** For a cozy mystery, absence from the Cozy browse node is a direct discoverability hole (§13 low-CTR / wrong-category signal).

## 2.2 Rewritten description (paste-ready HTML)

The current description already performs on the semantic layer, so this is a **light-touch version** that (a) front-loads the genre + comp phrase readers literally search ("British cosy mystery", "like The Thursday Murder Club") into the first 200 characters and (b) preserves every existing element. No plot fact is invented — all detail below already appears in the current KDP-LISTING.md description and FACTS.md (Helen 70 / retired forensic pathologist; Marcus the organist; Canon Edmund Hale; a 40-person close; fair-play, solvable before the reveal).

```html
<h2>A British cosy mystery for readers of The Thursday Murder Club — where the warmth and the darkness come from the same source.</h2>
<p>She spent thirty-five years reading the dead. She didn't expect to find one here.</p>
<p>Dr Helen Marsh is seventy, newly retired from forensic pathology, and quietly useful in the archive of Wychford's ancient cathedral close. When the organist Marcus Vayne is found dead at the foot of the organ gallery — an accident, everyone says — Helen takes sixty seconds to know otherwise. The body temperature is wrong. The hands are wrong. And the coffee mug on the console has been wiped clean.</p>
<p>Alongside Canon Edmund Hale, the cathedral's sharp and principled lawyer, Helen investigates a sealed community of forty people — clergy, clerks, and chapter servants who have kept each other's secrets for decades. Every clue implicates someone they care for. Every revelation costs them something.</p>
<p><b>A fair-play mystery in the classic tradition:</b></p>
<ul>
<li>Two unforgettable leads — a retired forensic pathologist and a cathedral lawyer, both over sixty — whose partnership is the heart of the series</li>
<li>Every clue is present before the reveal. The careful reader can solve it before Chapter 32.</li>
<li>A killer who is warm, credible, and genuinely tragic — a person, not a monster</li>
<li>A medieval English cathedral close in precise, beautiful detail — cold stone, candle wax, and an organ rehearsing in the dark</li>
<li>A fully resolved mystery with an emotional sucker punch in the final pages</li>
</ul>
<p>Each book in The Cathedral Close Mysteries stands alone. <b>Death in the Cathedral Close</b> is the complete first case — beginning with an organ playing in the dark at two in the morning, and ending with something you'll think about for days.</p>
<p><i>Scroll up and start reading.</i></p>
```

## 2.3 Keyword slot review (backend, 7 slots)

All 7 current slots are natural phrases, avoid the title words (death, cathedral, close), and were already density-checked in KDP-LISTING §5. They are in good shape; recommendations are minor.

| # | Current slot | Reasoning | Recommendation |
|---|---|---|---|
| 1 | `british cosy mystery series` (28) | UK-spelling genre anchor + "series" read-through signal. Strong. | **KEEP** |
| 2 | `cozy mystery amateur sleuth retired` (37) | US spelling + accurate protagonist descriptor; multi-concept (COSMO §18). | **KEEP** |
| 3 | `english cosy mystery village community` (39) | Sealed-community intent match. | **KEEP** |
| 4 | `church murder mystery england` (30) | Low-competition, high-intent setting phrase — genuinely open lane. | **KEEP** |
| 5 | `cozy mystery books like thursday murder club` (45) | Comp-based long-tail — the exact phrasing §19 Rufus retrieval favours. | **KEEP (highest value)** |
| 6 | `whodunit mystery novel england` (30) | Fair-play/puzzle intent signal. | **KEEP** |
| 7 | `traditional british mystery older protagonist` (46) | Captures Beaton/Christie + Osman demographic. | **KEEP** |

No slot duplicates the title or another slot's head term. No change strictly required; the leverage on this book is category, not keywords.

## 2.4 Category audit note (FLAG — do not decide)

- **Confirmed gap:** "Cozy" category is not live (state lines 90, 110). Correct intended end-state per state line 90: **Amateur Sleuth + Cozy + British & Irish > Mystery & Thrillers.**
- **Candidate to flag:** confirm all three intended categories are actually live, and in particular restore the **Cozy** placement — it is the badge with the widest cozy-reader CTR. `VERIFY ON LIVE PAGE` the current live category chips first; state notes the KDP change was blocked pending Architect login.

## 2.5 Review-drip + external-traffic actions (from §21–§23 only)

- **Lever 6 (baseline):** BSR here is already being logged in LAUNCH-TRACKER — keep logging at Day 14/30 around any change.
- **Lever 4 (external traffic, §5):** direct-to-`amazon.co.uk/dp/B0GZD1S8HF` (or `.com/dp/` per primary marketplace — `VERIFY ON LIVE PAGE`) links from cozy-reader channels (Pinterest boards, r/cozymystery, a newsletter). Raw `/dp/[ASIN]` only.
- **Lever 3 (sustained review drip, §22):** honest verified-purchase reviews trickled through Weeks 1–4, not a burst. Cozy readers respond well to a companion/reader-magnet ask (the Wychford Close Companion already exists in back matter) — route that to genuine reviews, not incentivised ones.
- **KU structural point (already in listing §9):** the top comps (Osman, Beaton, McCall Smith) are NOT in KU; this book is. Sustained KU-borrow visibility is a real edge — supports the §21 sustained-engagement posture rather than a one-week push.

---
---

# 3. The Vagus Nerve Gut Reset

- **Series:** Fix Your Gut for Good (Book 4) · US market · Kindle-only edition
- **Status on disk:** **published 2026-07-02** (human clicked Publish; state line 129–131). **ASIN not yet captured** — state line 160–161: "live — ASIN to be recorded from the Amazon product page. NOT invented."
- **FLAG:** live only ~5 days as of this pack (2026-07-06). It is too new to diagnose as "underselling" on data. Priority here is **baseline + sustained-engagement setup**, not a rescue rewrite.

## 3.1 Current listing audit

- **Description already reads for the semantic layer (§18/§19).** Opening H2:
  > "Your gut and your brain run on the same wire. Most gut books never mention it."
  This is natural reader-problem language, names the gut-brain axis mechanism, and front-loads the differentiator. It is close to model §19 copy — **do not overhaul it.**
- **Subtitle (§20):**
  > "Calm the Gut-Brain Axis and Ease Bloating, IBS & Anxiety in 4 Weeks — A Plan of Daily 5-Minute Exercises to Reset Your Nervous System"
  Long (~130 chars) but genuinely readable and benefit-led, not a keyword dump. Acceptable under §20. Minor internal inconsistency worth a glance: subtitle says "4 Weeks" while backend keyword #7 says "28 day" — same thing, but keep them intentional.
- **Compliance framing intact:** the description already ends with the required educational disclaimer ("This book is an educational companion, not a substitute for medical care…") — preserve it in any edit.
- **Biggest gap is operational, not textual:** the **live ASIN is not recorded**, which blocks Lever 6 baseline logging and Lever 4 direct-link attribution. Capturing it is the first action.

## 3.2 Rewritten description (paste-ready HTML)

The current copy is strong, so this is a **minimal tightening** that pulls the reader's literal search phrases ("vagus nerve", "bloating", "IBS", "gut-brain") fully inside the first 200 characters and keeps every existing claim and the disclaimer. **No new claim** — all detail (vagus nerve = longest cranial nerve / gut-brain cable; 4-week / 28-day plan; 12 named 5-minute exercises; Week 3 gut-specific; every claim cited to a named study; free printable companion) already appears in the current KDP-LISTING.md and FACTS.md.

```html
<h2>Calm your vagus nerve, ease bloating and IBS: your gut and brain run on the same wire.</h2>
<p>Every gut-health book tells you what to eat. Almost none tell you about the <b>vagus nerve</b> &mdash; the longest cranial nerve in your body, the physical cable of the gut-brain axis, running from your brainstem straight into your stomach and intestines. When it&rsquo;s calm, digestion flows. When stress shuts it down, your gut is the first thing to suffer.</p>
<p>This is the book that puts it in your hands &mdash; <b>five minutes a day, no diet overhaul, no equipment, no jargon.</b> A guide you read and do, not one you fill in.</p>
<h2>What&rsquo;s inside</h2>
<ul>
<li><b>A complete 4-week daily plan</b> &mdash; 28 short daily readings, each with one five-minute exercise and a real-world example showing exactly how it lands.</li>
<li><b>12 named, step-by-step exercises</b> &mdash; breathwork, humming, gentle cold, and calming movement, each with numbered steps, an accessibility option, and a plain-English reason it works.</li>
<li><b>A full week devoted to your gut</b> &mdash; routines for bloating, before-and-after meals, IBS flares, and the gut-brain axis.</li>
<li><b>You see it actually work</b> &mdash; follow one reader, Maya, as her gut, sleep, and stress shift across the four weeks. A free printable companion is included if you like to track your own numbers.</li>
<li><b>Honest science</b> &mdash; every claim cited to a real, named study, with the sources listed at the back. No invented research, nothing sold to you.</li>
</ul>
<h2>Why this one is different</h2>
<p>No 200 pages of theory before you get to do anything. No supplements, teas, or upsells. Just a clear, kind, four-week plan to train the one nerve your gut depends on &mdash; in the same trusted, plain-spoken voice as the <i>Fix Your Gut for Good</i> series.</p>
<p><b>Five minutes a day. No equipment. Twenty-eight days. Start today.</b></p>
<p><i>This book is an educational companion, not a substitute for medical care. Persistent gut symptoms should be reviewed by your doctor.</i></p>
```

## 3.3 Keyword slot review (backend, 7 slots)

Current slots avoid title/subtitle words (vagus, nerve, gut, reset, calm, gut-brain, axis, bloating, ibs, anxiety, nervous, system) and are multi-concept long-tails. Char counts already logged in-listing (33/35/40/30/35/43/30). Good set.

| # | Current slot | Reasoning | Recommendation |
|---|---|---|---|
| 1 | `polyvagal exercises for beginners` | Absent from title; real somatic/polyvagal demand cluster. | **KEEP** |
| 2 | `nervous system regulation exercises` | ⚠️ "nervous system" appears in the subtitle — partial repeat, though "regulation exercises" adds intent. | **KEEP (watch)** — acceptable as a phrase unit; if trimming, swap to `somatic regulation for beginners` (32). |
| 3 | `somatic exercises for anxiety and stress` | High-volume non-title head phrase; multi-concept. | **KEEP** |
| 4 | `ibs bloating relief daily plan` | ⚠️ "ibs" + "bloating" are in the subtitle; "relief daily plan" still adds intent. Gut differentiator lane. | **KEEP (watch)** |
| 5 | `vagus nerve exercises for digestion` | ⚠️ "vagus nerve" is in the title; but "exercises for digestion" is the confirmed open gut lane (COMPETITIVE-INTELLIGENCE GATE 3). Net value positive. | **KEEP** |
| 6 | `breathing exercises for sleep and digestion` (43) | Zero title overlap; strong multi-concept long-tail. | **KEEP (best-value slot)** |
| 7 | `28 day calm body reset program` | ⚠️ "calm" + "reset" are in title/subtitle. Consider a cleaner non-overlapping phrase. | **TWEAK** → `gut brain axis exercises at home` (31) — no title-word repeat, doubles down on the differentiator. Candidate only; no volume asserted. |

## 3.4 Category audit note (FLAG — do not decide)

- Intended categories (KDP-LISTING §8, unchanged by prose rebuild): (1) Mental Health > Anxiety Disorders, (2) Diseases & Physical Ailments > Nervous System, (3) Self-Help > Stress Management, plus a requested Neuroscience shelf.
- **These fit the book's intent well** (anxiety + nervous system + stress + the gut differentiator running through the copy). No mismatch found on disk.
- **Candidate to flag (not decide):** because the confirmed differentiator is gut/IBS/bloating (the open lane vs. Payne/Bennett), consider whether one of the 3 live slots should be a **digestive-health / IBS sub-category** to match the gut-specific Week 3 and the subtitle's "Bloating, IBS" promise (§18 category–intent agreement). `VERIFY ON LIVE PAGE` the actual live categories once the ASIN is captured — the book published only days ago and Amazon may have placed it differently from the request.

## 3.5 Review-drip + external-traffic actions (from §21–§23 only)

- **Lever 6 FIRST — capture the ASIN, then set baseline.** Read the ASIN off the live Amazon product page and log the Day-0 baseline (BSR, reviews, KENP/day). Everything else depends on this.
- **Lever 4 (external traffic, §5):** once the ASIN is known, direct-to-`/dp/[ASIN]` links from vagus-nerve / nervous-system / gut communities (Pinterest, Reddit, newsletter). Raw `/dp/` only.
- **Lever 3 (review drip, §22):** for a 5-day-old book, a **staggered launch seed + a sustained drip through Days 7–30** of honest verified-purchase reviews is the §22-preferred pattern — explicitly NOT a single burst (KU-heavy tier; burst-then-silence risks a manipulation flag).
- **§21 posture:** treat this as a 30-day sustained-engagement window, not a launch-week sprint. Keep light content momentum running past Day 8.

---
---

# 4. The H. Pylori Recovery Plan

- **ASIN (per task brief):** B0H5TZTPRT
- **⚠️ MAJOR STATUS DISCREPANCY — resolve before acting.** The task brief says this book is live. But the on-disk `pipeline-state.json` reads `published: false`, `kdp_status: "not_started"`, `asin: null`, and a **future** `list_live_date: 2026-07-08`. The state file also carries a lifecycle warning that the book is flagged for over-claiming completion. Another agent may be editing this state right now (per the task). **Additionally, the on-disk `KDP-LISTING.md` is an explicit Stage-01 draft** ("it will be superseded by the full Stage 06.5 publishing package once the manuscript exists"). **Therefore everything below is based on the Stage-01 draft listing and MUST be reconciled against what is actually live on `amazon.com/dp/B0H5TZTPRT` before any change.** `VERIFY ON LIVE PAGE` is mandatory for this entire book, more than any other in this pack.

## 4.1 Current listing audit

*(Auditing the Stage-01 draft on disk; the live page may differ.)*

- **Description opening (draft §5):**
  > "Scared of H. Pylori? You Can Clear It." … "You tested positive. Then you Googled it. Now you're scared."
  This is excellent §19 material — it mirrors the exact conversational query an anxious post-diagnosis reader types into Rufus ("h pylori cancer", "still positive after antibiotics"). Strong. Keep the spine.
- **Compliance framing is load-bearing here and correct in the draft:** the cancer message is always paired ("real enough to treat… low enough not to panic"), the disclaimer and red-flag line are present, and there is no cure promise. **Any rewrite must preserve the FACTS.md §0 dual message** — every scary number (stat #7, ~76% / "three out of four stomach cancers") must be immediately paired with the de-panic frame (stat #10, RR 0.61 / NNT ≈ 332). This is a BLOCK-level constraint, not a stylistic one.
- **Subtitle (§20):**
  > "How to Eradicate the Infection, Heal Your Stomach Lining, and Understand Your Cancer Risk — Even When Antibiotics Have Failed"
  Long (~123 chars) but reads as natural human language and owns the unoccupied "failed treatment" lane. Passes §20. `VERIFY ON LIVE PAGE` that the live subtitle matches (the em dash renders in the KDP title field; a hyphen fallback exists).
- **Category-slot conflict on disk (see 4.4).** The draft listing §7 locks slot 3 as **Cancer crossover**, but the `pipeline-state.json` note (line 98) says "Category 3 locked to **Nutrition**." These disagree. Must be reconciled against the live page.

## 4.2 Rewritten description (paste-ready HTML)

The draft copy is already §19-aligned, so this is a **light reframe** that pulls the reader's literal fear-query into the first 200 characters and keeps the dual cancer message rigorously intact. **No new claim** — every fact below already appears in the draft KDP-LISTING.md and FACTS.md (Group-1 carcinogen; ~76% / "three out of four stomach cancers" paired with "most carriers never get cancer"; 2024 optimised bismuth quadruple therapy as first-line; clarithromycin triple therapy dropped; rifabutin / furazolidone rescue; test-of-cure ≥4 weeks off antibiotics + off PPI; mastic gum / sulforaphane / L. reuteri as adjuncts alongside, never instead of, treatment). No brand names (FACTS §8).

```html
<h2>Tested positive for H. pylori and scared about cancer? You can clear it — and the real risk is lower than the headlines.</h2>
<p><b>You tested positive. Then you Googled it. Now you're scared.</b></p>
<p>You read that this infection causes around three out of four stomach cancers, and your heart dropped. Maybe your doctor gave you a week of antibiotics and said "don't worry." Maybe you finished them and the re-test came back <i>still positive</i>. Either way, you're standing in your kitchen with a burning, gnawing stomach, frightened, and not sure who to trust.</p>
<p><b>Here is the truth no scare-headline tells you: most people who carry H. pylori never get stomach cancer. The risk is real enough to treat. It is low enough not to panic. Both are true at once, and this book holds them both.</b></p>
<p><i>The H. Pylori Recovery Plan</i> is the evidence-grounded guide for the person who wants to actually clear this infection, heal the damage it left behind, and understand their cancer risk in proportion. It does not sell you a tea or a "natural cure." It explains the mechanism, cites the research by name, and lets you decide.</p>
<p><b>Inside this book:</b></p>
<ul>
<li>The 2024 first-line treatment your doctor should be using now (optimised bismuth quadruple therapy) and why clarithromycin triple therapy was dropped from the guidelines</li>
<li>What to do <b>when antibiotics fail</b> — the rescue therapies (rifabutin-based, furazolidone) almost no consumer book explains</li>
<li>Why roughly one in four treatments fail even when the bacteria are not resistant, and the timing and adherence mistakes that quietly sabotage eradication</li>
<li>The stomach-lining diet: what to eat, what to avoid, and the salt, cured-meat, coffee, and alcohol triggers that keep you inflamed</li>
<li>The adjuncts the 2024&ndash;2025 evidence actually supports (mastic gum, broccoli-sprout sulforaphane, Lactobacillus reuteri) framed honestly as helpers alongside treatment, never instead of it</li>
<li>How to confirm the infection is truly gone (test of cure at least 4 weeks after antibiotics, off acid-blockers first), prevent reinfection, and rebuild your gut</li>
</ul>
<p>This is part of the <b>Fix Your Gut for Good</b> series, for readers who learn better when someone explains the mechanism instead of just handing them instructions. If you're tired of being sold fear and supplements, this is the plan that treats you like an adult.</p>
<p>If you're ready to clear it, heal, and stop being afraid of your own stomach, <b>scroll up and get your copy.</b></p>
<p><i>This book is not a substitute for medical advice. H. pylori treatment requires prescription medication; work with your doctor. Severe or persistent symptoms, blood in stool or vomit, black stools, or unexplained weight loss require medical evaluation.</i></p>
```

## 4.3 Keyword slot review (backend, 7 slots)

Draft slots are byte-verified (31/27/32/34/28/28/27), ASCII, and avoid the title/subtitle words (h, pylori, recovery, plan, eradicate, infection, heal, stomach, lining, cancer, antibiotics). Good discipline. Recommendations are minor.

| # | Current slot | Reasoning | Recommendation |
|---|---|---|---|
| 1 | `stomach ulcer natural treatment` (31) | High-intent lay condition phrase; no title overlap. | **KEEP** |
| 2 | `gastritis relief food guide` (27) | Symptom + format intent; open lane. | **KEEP** |
| 3 | `gut infection diet for beginners` (32) | Beginner-intent long-tail; multi-concept (COSMO §18). | **KEEP** |
| 4 | `mastic gum and probiotics protocol` (34) | Adjunct-searcher intent; matches book content; generic (no brand). | **KEEP** |
| 5 | `failed triple therapy rescue` (28) | Owns the differentiator lane; exact intent of the "still positive" reader. | **KEEP (highest value)** |
| 6 | `gnawing burning stomach pain` (28) | Reader's literal symptom language — strong Rufus/§19 match. | **KEEP** |
| 7 | `helicobacter diet meal plan` (27) | Formal-name variant of "H. pylori" (not in title as spelled) + diet intent. Draft flags this as the only swap-watch candidate. | **KEEP (watch)** — re-check density on the final manuscript before lock (draft §6 notes rows 5 & 7 flagged light). |

*No slot duplicates the title/subtitle. No urgent change; verify these are what's actually live first.*

## 4.4 Category audit note (FLAG — do not decide)

- **Unresolved conflict on disk:** draft listing §7 = slot 3 **Cancer crossover (LOCKED)**; pipeline-state line 98 = "Category 3 locked to **Nutrition**." These contradict each other.
- **Candidate to flag (Architect decides):** determine which of Cancer-crossover vs Digestive-Health/Nutrition is actually live, and whether it matches the book's intent. The draft's rationale for Cancer is that it reaches the anxious buyer at the moment of intent in an unoccupied node; the CATEGORY-SELECTION note prefers Nutrition. This pack does not choose — it flags the conflict. `VERIFY ON LIVE PAGE` the live category chips and reconcile against CATEGORY-SELECTION.md before any change.
- **Also verify:** primary/secondary paths — draft §7 primary = Abdominal Disorders, secondary = Digestive Health. Confirm these are live and that Amazon has not auto-moved the book (§23 Lever 5).

## 4.5 Review-drip + external-traffic actions (from §21–§23 only)

- **Lever 6 (baseline) — but reconcile status first.** Do not log a baseline or act until the live/not-live discrepancy (4.0) is resolved with the other agent / the live page. If genuinely live, capture the ASIN and log Day-0 metrics.
- **Lever 4 (external traffic, §5):** if live, direct-to-`amazon.com/dp/B0H5TZTPRT` links from H. pylori / gastritis / gut-health communities. Raw `/dp/` only. Keep the calm, no-fear tone consistent with the book's moat (FACTS §8 cancer-tone rule) in any post copy.
- **Lever 3 (review drip, §22):** honest verified-purchase reviews as a slow drip, never a burst — especially important given the sensitive cancer topic and the manipulation-flag risk (§22).
- **Series lever (§7 series page):** the series string `Fix Your Gut for Good` must stay byte-identical across Books 1–4 so the cross-book carousel links (this is free, permanent placement). `VERIFY ON LIVE PAGE` the series field matches the other three titles exactly.

---
---

## Per-book one-line summary — biggest fix

1. **Fix Your Gut for Good (B0GXYLWS1W):** the live US page sits in a generic `Pathology > Digestive Organs` shelf, not its intended IBS/SIBO sub-category — a category–intent mismatch (§23 Lever 5) that outranks any copy change; realign category, then de-repeat 2 backend keyword slots.
2. **Death in the Cathedral Close (B0GZD1S8HF):** the highest-CTR "Cozy" category never went live (Overall BSR ~#1.37M) — restore the missing Cozy placement; the description is already Rufus-strong and needs only a light front-load.
3. **The Vagus Nerve Gut Reset:** only ~5 days live and the ASIN was never captured — capture it and set the §23 Lever 6 baseline first; copy is already semantic-layer-aligned, so run sustained review-drip + external traffic rather than a rewrite.
4. **The H. Pylori Recovery Plan (B0H5TZTPRT):** on-disk state says NOT published and the listing is a Stage-01 draft, conflicting with the "live" brief — reconcile the live/not-live status and the Cancer-vs-Nutrition category conflict on the live page before any action; preserve the FACTS §0 dual cancer message in every edit.

**Pack file:** `c:\Users\salah\BookFactory\automation\reports\BACKLIST-RERANK-PACK-2026-07-06.md`

*Recommendations only. No KDP actions taken. No pipeline-state.json written. No invented numbers, quotes, or claims. Verify every uncertain item on the live product page before applying.*
