# Final-Approval-Agent — Session Learnings (APPROVAL-FEEDBACK)

Append-only memory. Read at the start of every run.

---

## 2026-06-21 — The Vagus Nerve Gut Reset Workbook (Fix Your Gut for Good, Book 4)

**Result:** 259/300 — CONDITIONAL (threshold 270). No dimension below 60% floor; Compliance hard gate passed (53/55).

Dimension scores: D1 61/75 · D2 50/50 · D3 52/60 · D4 53/55 · D5 21/35 · D6 22/25.

### Key learnings / recurring patterns

1. **Dimension 5 (Commercial Readiness) is the systematic weak point on production-only runs.**
   Free-promo days, ARC reader plans, A+ Content briefs, and launch pricing strategy are
   routinely NOT produced when a book is built "production only / pending publish." This single
   dimension cost 14 of the 41 lost points here and dragged the total under 270. RECOMMENDATION
   to the orchestrator: add a tiny Stage-05/06 step that emits a LAUNCH-PLAN.md (promo days +
   ARC plan + A+ brief + launch pricing) so commercially-clean books aren't held back by missing
   planning docs rather than missing quality.

2. **Workbook word-count deviation is legitimate — do NOT treat as a manuscript failure.**
   19,391 words / 125 pages was formally adjudicated in QUALITY-GATE.md for the dated daily-spread
   format. Page count is the binding metric. All 12 content chapters exceed 500 words; assembly
   order is clean. Scored manuscript integrity on completeness/quality, not raw word count. Correct.

3. **AI-disclosure scoring is INVERTED for this operation (rubric 4.2 + Architect 2026-06-15).**
   Score the ABSENCE of an in-book AI block as correct. Verified with grep across all 13 files —
   zero matches. Note: rubric 1.3 still literally lists "AI disclosure present → 3 pts", which
   CONTRADICTS 4.2. I resolved in favour of 4.2 (the explicit override) and awarded the 1.3 points
   for correct absence. FLAG: the rubric should be patched so 1.3 no longer rewards an in-book block.

4. **File-layout drift from the rubric is real and must be adapted, not penalised blindly.**
   - Cover lives at exports/final/cover-kdp-final.jpg (NOT exports/cover/). Awarded cover points.
   - kdp-metadata.txt and PACKAGE-MANIFEST.md genuinely DO NOT exist; metadata content lives in
     KDP-LISTING.md. Gave partial credit for content-present, deducted for the missing package files.
     These are cheap to generate and worth flagging for an automated emit step.

5. **Strict metadata deductions worth re-checking each run:**
   - Keyword/title word overlap (slot 1 was 100% title words) — costs 3.2 points and is a genuine
     discoverability waste, not a nitpick.
   - Description <h3> tag sits outside the rubric's enumerated safe set (h2,p,b,ul,li,i). Amazon
     renders h3 in practice, but the rubric is strict. Deducted; flagged as low-real-risk.

6. **Last-line lock missing.** Rubric 1.5 wants the final line locked verbatim in KDP-LISTING.md or
   FACTS.md to verify. Neither file locked one. Could not verify a verbatim match → partial credit.
   Suggest pipeline lock the final line in FACTS.md at writing stage.

### Verification methods that worked well
- `file` + PIL both confirmed cover 1600×2560 RGB JPEG (don't trust filename).
- Python char/tag count on the fenced HTML description (2025 chars, tags extracted) beat estimating.
- grep for cure/guaranteed/FDA/100% with context inspection — all "cure" hits were anti-claims.
- HTML tag-balance check (div 43/43, body 1/1) as a quick "opens without errors" proxy.

---

## 2026-06-21 — RE-AUDIT: The Vagus Nerve Gut Reset Workbook (Book 4)

**Result:** 295/300 — APPROVED (was 259 CONDITIONAL). Hard gate (Compliance) 55/55. No dimension below floor.

Dimension scores: D1 70/75 · D2 50/50 · D3 60/60 · D4 55/55 · D5 35/35 · D6 25/25.

### What the remediation fixed (and confirms my prior recommendations worked)
- **D5 jumped 21→35** once LAUNCH-PLAN.md was emitted (KDP Select, pricing, free/Countdown days, ARC plan, A+ brief, long bio, series consistency). This is exactly the "emit a LAUNCH-PLAN.md" fix I flagged last run. Confirmed: a single planning doc recovered 14 points. Orchestrator should make this a standard Stage-06 emit.
- **D6 22→25**: kdp-metadata.txt + PACKAGE-MANIFEST.md now exist in exports/final/. Both were the cheap missing files I flagged. Confirmed worth automating.
- **D3 52→60**: keyword slot 1 rewritten off title words ("polyvagal exercises for beginners"); slots 4 & 6 de-duplicated; description <h3>→<h2> so it's inside the rubric's enumerated safe set. All three of my prior strict deductions cleared.
- **D1 61→70**: copyright disclaimer now 2 paragraphs (+3); FACTS.md now locks the final line verbatim and it matches back-matter byte-for-byte (+3 on 1.5). Remaining −5 is the avg-chapter-score bar (107.75 vs ≥110) — Grade A throughout, not a risk.

### Remaining sub-270 risk: NONE. Only residual deduction is 1.2 avg-score (−5), purely a quality-ceiling nicety on already Grade-A chapters.

### Verification methods (kept)
- `unzip -l` confirmed EPUB/media/file0.jpg + title_page.xhtml embedded — don't trust "epub is 960KB" alone, open the zip.
- Regex tag-balance gotcha: `<div[ >]` MISSES `<div\n` (newline after tag) and under-counts. Use `<div\b` — gave 43/43 (balanced), not the false 42/43.
- PIL + `file` both for cover (1600×2560 RGB baseline). Python char/tag scan on fenced HTML: 2,024 chars, tags {b,h2,i,li,p,ul}.
- grep cure/guaranteed/FDA/100% with context: all "cure" = anti-claims; AI-disclosure grep exit 1 (zero in-book block, correct per 4.2).

---

## 2026-06-28 — FRESH RE-AUDIT: The Vagus Nerve Gut Reset (PROSE edition, Book 4)

**Result:** 291/300 — APPROVED. Hard gates: Compliance 55/55 (PASS); KDP Format Eligibility 4.5 PASS (exit 0, KINDLE-ELIGIBLE); kdp_editions PB+Kindle matches scan. No dimension below floor.

Dimension scores: D1 68/75 · D2 50/50 · D3 60/60 · D4 55/55 · D5 35/35 · D6 23/25.

### The reconciliation that was the whole point of this run (three scores, one product chain)
- **295/300 (2026-06-21) = VOID.** It audited the fill-in WORKBOOK that KDP rejected as a Blank Journal. The product no longer exists. Lives in pipeline-state.json only as `final_approval_score_workbook_void: 295`. NEVER record it as this book's score.
- **289/300 (2026-06-26) = superseded.** First prose audit (D1 70/D2 50/D3 58/D4 55/D5 32/D6 24), but logged as an ADDENDUM at the bottom of the stale 2026-06-21 report whose header still bore the old "...Workbook" title + the void 295. Not cleanly traceable → replaced.
- **291/300 (2026-06-28, this run) = CURRENT, correct.** Clean self-contained six-dimension re-audit, every criterion re-verified on disk. +2 over 289 because the 289 run's D3 (−2 "minor strictness") and D5 (−3 "A+ not built") deductions DON'T hold on strict-rubric re-read: D3 is clean 60/60 (desc 2,225 chars, tags {h2,p,b,i,ul,li}, 7 kws ≤50 off-title) and D5.4 scores the EXISTENCE of the A+ BRIEF (present in LAUNCH-PLAN.md §5), not a built A+ module — so 35/35.

### New learnings / patterns
1. **Build-tag leakage into the EPUB title page is a real, recurring D1.3/D6.1 deduction.** The pandoc source title was "The Vagus Nerve Gut Reset (PROSE REBUILD)" and that "(PROSE REBUILD)" suffix rode into EPUB title_page.xhtml + the <title>. Cosmetic (KDP uses dashboard metadata, not the interior title page) but it costs the 1.3 "title page matches listing exactly" point and 2 of D6.1. FLAG for production: strip working/build tags from the pandoc title before the final build.
2. **The reference HTML stays stale across rebuilds.** manuscript-kdp.html still carried the OLD "...Workbook" <title> + 11 "workbook" hits while the EPUB/PDF were clean. It's reference-only (never uploaded, CLAUDE.md Rule 11) so it's harmless to the listing, but it's a −1/−2 package-cleanliness ding and looks alarming on grep. Worth regenerating with the rest.
3. **Two identical cover files (cover-kdp.jpg + cover-kdp-final.jpg) — verify they're actually identical, don't assume.** sha1sum confirmed same hash (12e1968b…), both 1600×2560 RGB 1:1.6. Good practice: hash-compare the pair rather than trusting the "-final" name.
4. **format-eligibility.cjs is now the load-bearing hard gate on this exact book** — it's the gate that would have caught the 2026-06-21 Blank-Journal rejection. Re-ran it live (exit 0); did NOT trust the prior report's claim. Always re-run the scanner, never inherit its verdict.
5. **python3 is NOT on this box — use `python`.** `python3` → exit 127 (command not found). `python` works for the PIL + char/tag scans.

### Verification methods (kept + added)
- `node scripts/format-eligibility.cjs <slug>` live, honour exit code (PASS = exit 0). Never inherit.
- `file` + PIL for cover (1600×2560 RGB, ratio 2560/1600 = 1.600). `sha1sum` to prove the two cover files are byte-identical.
- `unzip -l`/`unzip -p` the EPUB: confirmed content.opf, nav.xhtml, title_page.xhtml, cover.xhtml, embedded EPUB/media/file0.jpg (744,891 B). Reading title_page.xhtml is how the "(PROSE REBUILD)" leak was caught.
- `python` char/tag scan on fenced HTML desc: 2,225 raw / 2,039 visible chars, tags {b,h2,i,li,p,ul}, all 7 kws ≤50. Title+subtitle 25+133=158 (<200).
- grep cure/guaranteed/FDA/100% with context: all "cure" = anti-claims; "completely effective" = a personal-routine validity statement, not a clinical %; AI-disclosure grep exit 1 (correct absence per 4.2); "workbook" grep exit 1 across manuscript (prose retitle clean).
