# Design Agent — Accumulated Feedback
## Session: 2026-04-17 | Book: Stop Relapsing (Fix Your Gut for Good)

---

## TOOL HIERARCHY (learned this session)

**Primary: Figma MCP** — push HTML via `generate_figma_design` to localhost:7823. Figma gives real editable layers, proper vector output, KDP-ready export. This is the correct autonomous path.

**Secondary: HTML + Playwright** — fallback if Figma unavailable. Render cover.html at 1600×2560 via Playwright screenshot. Serve via Node.js HTTP server on port 7823 (`node -e "require('http').createServer((req,res)=>{require('fs').createReadStream('c:/Users/salah/BookFactory/books/fix-your-gut-for-good/exports/cover/'+req.url.slice(1)).pipe(res)}).listen(7823)"`).

**Do NOT use: Canva AI generation** — produces generic, low-quality results for this design style.

---

## WHAT FAILED (do not repeat)

- **Canva AI cover generation** — output was generic and low quality. User explicitly rejected it.
- **Sharp crop from mockup** — produced grey border artifacts. Don't try to crop Flow/mockup images with sharp.
- **CSS covers with tiny subtitle text** — 48px subtitle on 1600px canvas is unreadable at Amazon thumbnail size. Minimum 64px for subtitle, 70px+ preferred.
- **Red oxblood author band (#5C1010)** — user didn't like it. Use gold (#C8A15A) author name directly on dark navy instead.
- **Prescriptive pixel-spec prompts for Nano Banana** — produced worse results. Write evocative creative briefs under 200 words.
- **Horizontal single-row phase markers** — connector lines disappear when numerals are large. Use 2×2 grid or abandon connectors.
- **Flex `justify-content: space-between`** — creates uneven gaps when content doesn't fill height. Use absolute positioning for predictable layout control.

---

## WHAT WORKED

- **STOP / RELAPSING with oxblood strikethrough** — strong visual hook, user approved the concept.
- **Ghost 2×2 phase numeral grid** (I II / III IV) at opacity 0.06-0.09, font-size 340-380px — fills the lower half as background texture.
- **Gold (#C8A15A) author name** on dark navy — elegant, no band needed.
- **Oxblood edge rules** at top and bottom — signals clinical authority.
- **Figma MCP capture** — successfully pushed cover.html to Figma as editable layers. Use `generate_figma_design` with local server URL.

---

## DESIGN SYSTEM (Fix Your Gut for Good series)

| Element | Value |
|---------|-------|
| Background | #0E1B2C (deep navy) |
| Primary text | #F3EEE3 (warm cream) |
| Accent | #7A1E1E (oxblood) |
| Author/gold | #C8A15A |
| Title font | Libre Baskerville Bold |
| Body font | EB Garamond |
| KDP spec | 1600×2560px, JPG, RGB |
| Publisher field | Blank (user's decision) |
| Author name | S.A. Ibrahim (never change) |

---

## COVER GENERATION WORKFLOW (correct order)

1. Read: BLUEPRINT.md → FACTS.md → APPROVALS.md → KDP-LISTING.md
2. Web search: top 5 SIBO/gut health covers on Amazon — what's saturated, what's the gap
3. Write creative brief (under 200 words, evocative not prescriptive)
4. Generate HTML cover at 1600×2560 in `exports/cover/cover.html`
5. Push to Figma via `generate_figma_design` with localhost:7823
6. Score against SCORING-RUBRIC.md
7. If score < 35: revise HTML and re-push. Max 3 iterations.
8. Report Figma URL to user for final approval

---

## CURRENT COVER STATUS (2026-04-17)

- Figma file (v3, APPROVED 47/50): https://www.figma.com/design/cmzxax19PExDj14kl9nyk3
- Figma file (v2, superseded 46/50): https://www.figma.com/design/NAmQB52eaCo5pLAe5Yd3u5
- Figma file (v1, superseded): https://www.figma.com/design/PkE8wJyxF7KJQxTdlHNI0V
- HTML source: c:/Users/salah/BookFactory/books/fix-your-gut-for-good/exports/cover/cover.html
- KDP export: c:/Users/salah/BookFactory/books/fix-your-gut-for-good/exports/cover/cover-kdp-final.jpg
- Status: APPROVED — 47/50, pushed to Figma v3, KDP final copied

---

## SESSION LEARNINGS (2026-04-17 — Scoring & Approval Run)

### Scoring threshold trap
- Initial score was 42/50 (REVISE band) despite strong design. The gap between title block and subtitle created a dead zone that cost thumbnail legibility points.
- Fix: move `.content-block` top from 900px to 800px — eliminates the dead zone, tightens the visual story.

### Subtitle wrap is a thumbnail killer
- 3-line subtitle at 70px/120px padding scored lower than 2-line subtitle at 68px/80px padding.
- Rule: always target 2 lines for subtitle text at 1600px wide. Reduce horizontal padding before reducing font size.
- Minimum subtitle padding: 80px each side (not 120px) to give the text room to breathe on 2 lines.

### Tagline opacity: 0.5 is too faint for WCAG compliance
- Tagline at opacity 0.5 fails the squint test in Color Contrast criterion.
- Minimum tagline opacity: 0.65 on #0E1B2C background with cream (#F3EEE3) text.

### Figma capture workflow confirmed
- Windows open command: `start "" "http://localhost:7823/cover.html#figmacapture=..."`
- The capture script tag must already be in cover.html (it is — leave it there permanently).
- Poll every 6 seconds. Usually completes in 1 poll after the browser opens.
- captureId is single-use — generate a new one each session.

### What scored full marks (10/10 Brand Compliance)
- Navy #0E1B2C background, cream #F3EEE3 text, oxblood #7A1E1E accent, gold #C8A15A author — all correct.
- Series brand "Fix Your Gut for Good" at top in tracked uppercase.
- No publisher imprint anywhere on the cover.
- Author name "S.A. Ibrahim" in gold at bottom with gold rules.

---

## SESSION LEARNINGS (2026-04-17 — v3 Iteration, 46→47/50)

### CSS `::after` pseudo-elements don't render inside flex containers reliably
- Added a gold underline under STOP using `::after` — it did not render in Playwright screenshot.
- Fix: replace `::after` with a real HTML `<div class="stop-underline">` element. Always use real DOM nodes for decorative lines inside flex/absolute positioned containers.

### Ghost phase grid: where to place it for thumbnail legibility
- v2: grid top at 1300px — lower I and II numerals overlapped the tagline zone, and III/IV crept toward author name at compressed sizes.
- v3: grid top at 1500px, opacity reduced from 0.06 to 0.04 — numerals now purely in the bottom third; author zone completely clear. This gained 1 point on Thumbnail Legibility.
- Rule: ghost phase grid must start no higher than 1500px on a 2560px canvas if author block is at bottom 100px.

### The gold divider is the most powerful hierarchy tool on this cover
- v2: 300px wide, 2px thick, oxblood, opacity 0.8 — read as a subtle accent, not a clear section break.
- v3: 520px wide, 5px thick, gold #C8A15A, opacity 1.0 — unmissable section separator. Gained 1 point on Typography Hierarchy.
- Rule: the mid-cover divider should always be gold (not oxblood), at least 480px wide, and minimum 4px tall.

### Oxblood strikethrough: full opacity and extra extension reads as bolder editorial
- v2: 16px height, opacity inherited from parent (0.85), extended 6px beyond letters.
- v3: 22px height, opacity: 1 explicitly set, extended 12px beyond letters with 3px border-radius.
- The thicker strike + full opacity creates a more aggressive, unmissable visual statement. No negative trade-off.

### Author rules: wider + stronger opacity = better thumbnail legibility
- v2: 220px wide, 1px, opacity 0.6 — nearly invisible at thumbnail scale.
- v3: 300px wide, 2px, opacity 0.9 — the gold frame around the author name reads clearly even at 160px thumbnail width.

### Gold as a vertical thread
- The most commercially impactful change in v3: gold now appears in three vertical zones — (1) stop-underline between STOP and RELAPSING, (2) the mid-cover divider bar, (3) the author rules and name.
- This creates a gold axis running top-to-bottom that unifies the cover and signals premium quality.
- This pattern should be carried into all subsequent books in the series.
