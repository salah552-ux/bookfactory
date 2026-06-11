# Cover Brief — The H. Pylori Recovery Plan
**Series:** Fix Your Gut for Good — Book 3
**Author:** S.A. Ibrahim
**Stage:** 06 — Production | design-agent | 2026-06-11
**Status:** Rendered, KDP-compliant (8/8), thumbnail-legible. Ready for review.

---

## 1. Concept (one sentence)
A navy clinical-authority cover that owns the one lane every incumbent H. pylori
title leaves empty — *"even when antibiotics have failed"* — while extending the
locked *Fix Your Gut for Good* series DNA so a reader instantly recognises it as
the next book from the same publisher.

## 2. Mood / reference points
- Investigative non-fiction hardback spine (deep navy, cream serif) — the
  authority register the experienced, already-disappointed reader trusts.
- Book 1 (*Fix Your Gut for Good*, 47/50) — the proven series template, copied
  structurally and re-coloured for Book 3.
- A clinician's case file / log sheet — the faint diagnostic grid texture in the
  lower third signals "diagnostic tool, not another generic protocol."

## 3. Colour palette (series DNA — LOCKED + Book-3 differentiation)
| Hex | Role | Source |
|---|---|---|
| `#0E1B2C` | Deep navy background | Series spine — LOCKED (COVER-PSYCHOLOGY §8) |
| `#F3EEE3` | Warm cream — title, subtitle | Series spine — LOCKED |
| `#C8A15A` | Gold — author name, rules, hook underline | Series spine — LOCKED |
| `#C68A2E` | Ochre — edge rules + the "antibiotics failed" lane | Book-3 warm accent (Rule S4: Book 1 = oxblood, Book 3 = ochre) |

## 4. Composition (where the eye goes)
1. **H. PYLORI** (232px cream serif) — the keyword hook, the largest decodable
   element, the thumb-stop. This is the search term the right reader is typing.
2. **RECOVERY PLAN** (168px) — completes the title, signals a structured path.
3. **EVEN WHEN ANTIBIOTICS HAVE FAILED** (ochre) — the differentiator lane; the
   reader who is *still positive* reads this and feels the book was built for them.
4. Series brand (top) + author in gold (bottom) — series recognition + trust.

## 5. Typography
- Title / subtitle: **Libre Baskerville Bold** — series-locked, editorial
  authority, fully legible at 100px (verified).
- No script, no thin weights, no italics in the title block (COVER-PSYCHOLOGY §6).

## 6. What this cover is NOT doing
No food photography, no gut/stomach anatomy, no probiotic bottles, no clinical
teal/blue, no sage/mint, no pastel, no "Complete Guide", no "Beginners", no
"Heal/Cure" verb in title position, no stamps, no author photo, no imprint.
Every item on the COVER-PSYCHOLOGY §10 trap list is absent.

## 7. Files
- `exports/final/cover.html` — deterministic HTML source (single self-contained file)
- `exports/final/cover-kdp-final.jpg` — 1600×2560 KDP master (8/8 compliance)
- `exports/final/cover-kdp.jpg` — same image under the filename build-manuscript.sh reads to embed the EPUB cover
- `exports/cover/cover-kdp-final.jpg` + `exports/cover/cover.html` — mirror copies
- `exports/final/cover-thumb-100.png` — 100px squint-test thumbnail (Q1 evidence)

**Render command:** `node exports/final/render-cover.js`
