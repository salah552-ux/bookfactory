# RE-RANK FIELD SHEET — 2026-07-09

**For:** The Architect, at the KDP dashboard. Work top to bottom, one book at a time.
**Source:** automation/reports/BACKLIST-RERANK-PACK-2026-07-06.md (all content derived from it — no new claims). Anything marked `VERIFY ON LIVE PAGE` must be confirmed on the live product page before acting.
**Before touching a book:** log its current numbers first (baseline discipline, ALGO v1.3 §23 Lever 6):
`node scripts/log-launch-metrics.cjs <slug> --bsr <n> --reviews <n> --source "KDP dashboard 2026-07-09"`
**After finishing a book:** record it:
`node scripts/log-launch-metrics.cjs <slug> --rerank-applied`

## Global cautions (from the pack — apply to every book)
- [ ] Do NOT republish to reset the new-release window
- [ ] Do NOT run a concentrated review burst
- [ ] Do NOT keyword-stuff any title

**Portfolio-level note (pack, "Portfolio-level cross-cutting finding"):** the single most repeated problem across the portfolio is category placement, not copy — this is a higher-leverage fix than any blurb rewrite and costs nothing but a dashboard edit.

**Recommendations only.** Nothing in this pack has been pushed to Amazon by an agent. No KDP login, no metadata write, no outward action was taken to produce the source pack.

---

## 1. Fix Your Gut for Good: Stop Relapsing (fix-your-gut-for-good, ASIN B0GXYLWS1W)

*Pack source: §1 (lines 27–91).*

### A. Baseline logged?
- [ ] `log-launch-metrics` baseline run (command above), e.g.:
  `node scripts/log-launch-metrics.cjs fix-your-gut-for-good --bsr <n> --reviews <n> --source "KDP dashboard 2026-07-09"`
- [ ] `VERIFY ON LIVE PAGE` which marketplace is primary before acting (pack §1 Market note/FLAG): the task brief labelled this UK-market, but on-disk state and KDP-LISTING price everything in USD ($9.99 list, $2.99 displayed) and confirm the live page on amazon.com (US). The pack's audit assumes the US listing the state file documents.

### B. Category (highest-leverage per the pack)
- [ ] Current live category verified on product page: `Books > Medical Books > Medicine > Internal Medicine > Pathology > Diseases > Digestive Organs` (pack §1.1/§1.4, recorded from state line 155) — `VERIFY ON LIVE PAGE` the exact current category chips and the exact live category-path names before requesting any change (pack §1.4).
- [ ] Intended categories per KDP-LISTING §5 (pack §1.1): IBS + Abdominal Disorders + Kindle IBS.
- [ ] Candidate to change to (pack §1.4 — Architect decides, not the pack): `Health, Fitness & Dieting > Diseases & Physical Ailments > Irritable Bowel Syndrome` (KDP dashboard → edit book details → categories).
- [ ] Recorded: `node scripts/log-launch-metrics.cjs fix-your-gut-for-good --activate category_verified_live`

### C. Description
- [ ] Paste the rewritten description from pack §1.2 (copy verbatim from the pack — do not retype). Note (pack §1.2): the closing italic disclaimer line is a safety caution, not a factual claim — drop it if the Architect prefers the current no-disclaimer description.

### D. Backend keywords (7 slots)
*From pack §1.3.*

| Slot | Current slot (pack §1.3) | Action from pack | New value (verbatim from pack) |
|------|---------------------------|-------------------|----------------------------------|
| 1 | `small intestinal bacterial overgrowth treatment` (48) | KEEP | — (no change) |
| 2 | `SIBO relapse prevention` | REPLACE | `bloating after antibiotics not working` (37) — candidate only; no search volume asserted |
| 3 | `gut motility disorder treatment` | KEEP | — (no change) |
| 4 | `IBS bloating root cause fix` | TWEAK | `IBS bloating relief that lasts` (29) |
| 5 | `bacterial overgrowth diet and antibiotics guide` (48) | KEEP | — (no change) |
| 6 | `prokinetics gut health protocol` | TWEAK | `prokinetics for gut motility` (28) |
| 7 | `leaky gut bloating relief treatment` | KEEP | — (no change) |

### E. Done
- [ ] `node scripts/log-launch-metrics.cjs fix-your-gut-for-good --rerank-applied`

---

## 2. Death in the Cathedral Close (death-in-the-cathedral-close, ASIN B0GZD1S8HF)

*Pack source: §2 (lines 95–159).*

### A. Baseline logged?
- [ ] `log-launch-metrics` baseline run (command above), e.g.:
  `node scripts/log-launch-metrics.cjs death-in-the-cathedral-close --bsr <n> --reviews <n> --source "KDP dashboard 2026-07-09"`
- Underselling evidence on disk (pack §2): first live BSR logged 2026-06-02 (Countdown Deal Day 1) = Overall #1,370,902 (pipeline-state line 110).

### B. Category (highest-leverage per the pack)
- [ ] Current live category gap: state (lines 90/110) records "CATEGORY MISMATCH CONFIRMED — Cozy not live." The listing intends 3 categories (Amateur Sleuth + Cozy + British & Irish) but the highest-CTR "Cozy" badge is not live on the product page (pack §2.1).
- [ ] `VERIFY ON LIVE PAGE` the current live category chips first (pack §2.4); state notes the KDP change was blocked pending Architect login.
- [ ] Change to / restore (pack §2.4, correct intended end-state per state line 90): **Amateur Sleuth + Cozy + British & Irish > Mystery & Thrillers.**
- [ ] Recorded: `node scripts/log-launch-metrics.cjs death-in-the-cathedral-close --activate category_verified_live`

### C. Description
- [ ] Paste the rewritten description from pack §2.2 (copy verbatim from the pack — do not retype). Note (pack §2.2): this is a light-touch version — the current description already performs on the semantic layer and no rewrite was needed for discovery reasons; this version front-loads the genre + comp phrase while preserving every existing element.

### D. Backend keywords (7 slots)
*From pack §2.3. All 7 slots are recommended KEEP — "No slot duplicates the title or another slot's head term. No change strictly required; the leverage on this book is category, not keywords."*

| Slot | Current slot (pack §2.3) | Action from pack | New value (verbatim from pack) |
|------|---------------------------|-------------------|----------------------------------|
| 1 | `british cosy mystery series` (28) | KEEP | — (no change) |
| 2 | `cozy mystery amateur sleuth retired` (37) | KEEP | — (no change) |
| 3 | `english cosy mystery village community` (39) | KEEP | — (no change) |
| 4 | `church murder mystery england` (30) | KEEP | — (no change) |
| 5 | `cozy mystery books like thursday murder club` (45) | KEEP (highest value) | — (no change) |
| 6 | `whodunit mystery novel england` (30) | KEEP | — (no change) |
| 7 | `traditional british mystery older protagonist` (46) | KEEP | — (no change) |

### E. Done
- [ ] `node scripts/log-launch-metrics.cjs death-in-the-cathedral-close --rerank-applied`

### Other pack flags carried over (§2.5)
- [ ] `VERIFY ON LIVE PAGE` — external-traffic links: direct-to-`amazon.co.uk/dp/B0GZD1S8HF` (or `.com/dp/` per primary marketplace — `VERIFY ON LIVE PAGE`) from cozy-reader channels (Pinterest boards, r/cozymystery, a newsletter). Raw `/dp/[ASIN]` only (pack §2.5 Lever 4).
- [ ] Review drip: honest verified-purchase reviews trickled through Weeks 1–4, not a burst (pack §2.5 Lever 3). Route the existing Wychford Close Companion reader-magnet ask to genuine reviews, not incentivised ones.

---

## 3. The Vagus Nerve Gut Reset (vagus-nerve-gut-reset-workbook, ASIN not yet captured — pack §3)

*Pack source: §3 (lines 163–228). FLAG (pack §3): live only ~5 days as of this pack (2026-07-06) — too new to diagnose as "underselling" on data. Priority is baseline + sustained-engagement setup, not a rescue rewrite.*

### A. Baseline logged?
- [ ] Capture the ASIN FIRST (pack §3.5, Lever 6 FIRST): read the ASIN off the live Amazon product page for "The Vagus Nerve Gut Reset." State (line 160–161) confirms: "live — ASIN to be recorded from the Amazon product page. NOT invented." Do not guess.
- [ ] Then log Day-0 baseline:
  `node scripts/log-launch-metrics.cjs vagus-nerve-gut-reset-workbook --bsr <n> --reviews <n> --source "KDP dashboard 2026-07-09"`
- Everything else on this book depends on this (pack §3.1 "Biggest gap is operational, not textual").

### B. Category (highest-leverage per the pack)
- Intended categories (pack §3.4, KDP-LISTING §8): (1) Mental Health > Anxiety Disorders, (2) Diseases & Physical Ailments > Nervous System, (3) Self-Help > Stress Management, plus a requested Neuroscience shelf. These fit the book's intent well — no mismatch found on disk.
- [ ] Candidate to flag (pack §3.4 — Architect decides, not the pack): because the confirmed differentiator is gut/IBS/bloating, consider whether one of the 3 live slots should be a digestive-health / IBS sub-category to match the gut-specific Week 3 and the subtitle's "Bloating, IBS" promise.
- [ ] `VERIFY ON LIVE PAGE` the actual live categories once the ASIN is captured — the book published only days ago and Amazon may have placed it differently from the request (pack §3.4).
- [ ] Recorded (once verified): `node scripts/log-launch-metrics.cjs vagus-nerve-gut-reset-workbook --activate category_verified_live`

### C. Description
- [ ] Paste the rewritten description from pack §3.2 (copy verbatim from the pack — do not retype). Note (pack §3.2): this is a minimal tightening — the current copy is strong and should not be overhauled; preserve the existing educational disclaimer.

### D. Backend keywords (7 slots)
*From pack §3.3.*

| Slot | Current slot (pack §3.3) | Action from pack | New value (verbatim from pack) |
|------|---------------------------|-------------------|----------------------------------|
| 1 | `polyvagal exercises for beginners` | KEEP | — (no change) |
| 2 | `nervous system regulation exercises` | KEEP (watch) | if trimming: `somatic regulation for beginners` (32) |
| 3 | `somatic exercises for anxiety and stress` | KEEP | — (no change) |
| 4 | `ibs bloating relief daily plan` | KEEP (watch) | — (no change) |
| 5 | `vagus nerve exercises for digestion` | KEEP | — (no change) |
| 6 | `breathing exercises for sleep and digestion` (43) | KEEP (best-value slot) | — (no change) |
| 7 | `28 day calm body reset program` | TWEAK | `gut brain axis exercises at home` (31) — candidate only; no search volume asserted |

### E. Done
- [ ] `node scripts/log-launch-metrics.cjs vagus-nerve-gut-reset-workbook --rerank-applied`

### Other pack flags carried over (§3.5)
- [ ] Once the ASIN is known: direct-to-`/dp/[ASIN]` links from vagus-nerve / nervous-system / gut communities (Pinterest, Reddit, newsletter). Raw `/dp/` only (pack §3.5 Lever 4).
- [ ] Review drip: a staggered launch seed + a sustained drip through Days 7–30 of honest verified-purchase reviews — explicitly NOT a single burst (pack §3.5 Lever 3, KU-heavy tier).
- [ ] Treat this as a 30-day sustained-engagement window, not a launch-week sprint; keep light content momentum running past Day 8 (pack §3.5, §21 posture).

---

## 4. The H. Pylori Recovery Plan (h-pylori-recovery-plan, ASIN B0H5TZTPRT per task brief)

*Pack source: §4 (lines 232–301). ⚠️ MAJOR STATUS DISCREPANCY (pack §4): the task brief says this book is live, but the on-disk `pipeline-state.json` reads `published: false`, `kdp_status: "not_started"`, `asin: null`, and a future `list_live_date: 2026-07-08`. The state file also carries a lifecycle warning that the book is flagged for over-claiming completion. Another agent may be editing this state right now. The on-disk `KDP-LISTING.md` is an explicit Stage-01 draft. `VERIFY ON LIVE PAGE` is mandatory for this entire book, more than any other in this pack — everything below is based on the Stage-01 draft and MUST be reconciled against what is actually live on `amazon.com/dp/B0H5TZTPRT` before any action.*

### A. Baseline logged?
- [ ] Reconcile the live/not-live status FIRST (pack §4.5 — "Do not log a baseline or act until the live/not-live discrepancy is resolved with the other agent / the live page"). Confirm on `amazon.com/dp/B0H5TZTPRT` whether the book is genuinely live.
- [ ] Only if confirmed live: capture the Day-0 baseline:
  `node scripts/log-launch-metrics.cjs h-pylori-recovery-plan --bsr <n> --reviews <n> --source "KDP dashboard 2026-07-09"`

### B. Category (highest-leverage per the pack)
- [ ] Unresolved conflict on disk (pack §4.4): draft listing §7 locks slot 3 as **Cancer crossover (LOCKED)**; `pipeline-state.json` note (line 98) says "Category 3 locked to **Nutrition**." These contradict each other.
- [ ] Candidate to flag (pack §4.4 — Architect decides, not the pack): determine which of Cancer-crossover vs Digestive-Health/Nutrition is actually live and whether it matches the book's intent. This pack does not choose — it flags the conflict.
- [ ] Also verify: primary/secondary paths per draft §7 — primary = Abdominal Disorders, secondary = Digestive Health. Confirm these are live and that Amazon has not auto-moved the book (pack §4.4).
- [ ] `VERIFY ON LIVE PAGE` the live category chips and reconcile against CATEGORY-SELECTION.md before any change (pack §4.4).
- [ ] Recorded (once verified): `node scripts/log-launch-metrics.cjs h-pylori-recovery-plan --activate category_verified_live`

### C. Description
- [ ] Paste the rewritten description from pack §4.2 (copy verbatim from the pack — do not retype). **BLOCK-level constraint (pack §4.1):** any rewrite must preserve the FACTS.md §0 dual message — every scary number (stat #7, ~76% / "three out of four stomach cancers") must be immediately paired with the de-panic frame (stat #10, RR 0.61 / NNT ≈ 332). Do not apply this description without that pairing intact.
- [ ] `VERIFY ON LIVE PAGE` that the live subtitle matches (pack §4.1): "How to Eradicate the Infection, Heal Your Stomach Lining, and Understand Your Cancer Risk — Even When Antibiotics Have Failed" (the em dash renders in the KDP title field; a hyphen fallback exists).

### D. Backend keywords (7 slots)
*From pack §4.3. No urgent change; verify these are what's actually live first.*

| Slot | Current slot (pack §4.3) | Action from pack | New value (verbatim from pack) |
|------|---------------------------|-------------------|----------------------------------|
| 1 | `stomach ulcer natural treatment` (31) | KEEP | — (no change) |
| 2 | `gastritis relief food guide` (27) | KEEP | — (no change) |
| 3 | `gut infection diet for beginners` (32) | KEEP | — (no change) |
| 4 | `mastic gum and probiotics protocol` (34) | KEEP | — (no change) |
| 5 | `failed triple therapy rescue` (28) | KEEP (highest value) | — (no change) |
| 6 | `gnawing burning stomach pain` (28) | KEEP | — (no change) |
| 7 | `helicobacter diet meal plan` (27) | KEEP (watch) | re-check density on the final manuscript before lock (draft §6 notes rows 5 & 7 flagged light) |

### E. Done
- [ ] `node scripts/log-launch-metrics.cjs h-pylori-recovery-plan --rerank-applied` (only once status is reconciled and the book is confirmed genuinely live)

### Other pack flags carried over (§4.5)
- [ ] Keep the calm, no-fear tone consistent with the book's moat (FACTS §8 cancer-tone rule) in any post copy (pack §4.5 Lever 4).
- [ ] Review drip: honest verified-purchase reviews as a slow drip, never a burst — especially important given the sensitive cancer topic and the manipulation-flag risk (pack §4.5 Lever 3, §22).
- [ ] `VERIFY ON LIVE PAGE` the series field matches the other three titles exactly (pack §4.5): the series string `Fix Your Gut for Good` must stay byte-identical across Books 1–4 so the cross-book carousel links.

---

## Per-book one-line summary — biggest fix (verbatim from pack, "Per-book one-line summary")

1. **Fix Your Gut for Good (B0GXYLWS1W):** the live US page sits in a generic `Pathology > Digestive Organs` shelf, not its intended IBS/SIBO sub-category — a category–intent mismatch (§23 Lever 5) that outranks any copy change; realign category, then de-repeat 2 backend keyword slots.
2. **Death in the Cathedral Close (B0GZD1S8HF):** the highest-CTR "Cozy" category never went live (Overall BSR ~#1.37M) — restore the missing Cozy placement; the description is already Rufus-strong and needs only a light front-load.
3. **The Vagus Nerve Gut Reset:** only ~5 days live and the ASIN was never captured — capture it and set the §23 Lever 6 baseline first; copy is already semantic-layer-aligned, so run sustained review-drip + external traffic rather than a rewrite.
4. **The H. Pylori Recovery Plan (B0H5TZTPRT):** on-disk state says NOT published and the listing is a Stage-01 draft, conflicting with the "live" brief — reconcile the live/not-live status and the Cancer-vs-Nutrition category conflict on the live page before any action; preserve the FACTS §0 dual cancer message in every edit.

*Recommendations only. No KDP actions taken by producing this sheet. No invented numbers, quotes, or claims — all content derived from `automation/reports/BACKLIST-RERANK-PACK-2026-07-06.md`. Verify every `VERIFY ON LIVE PAGE` item on the live product page before applying.*
