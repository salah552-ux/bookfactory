# BookFactory — Cross-Book Learning Memory (LESSONS.md)

**Readers:** Every agent, via the orchestrator's brief. Read this before starting work on any stage — it records what the pipeline has already learned the hard way so mistakes are not repeated.

**Writers:** `pipeline-orchestrator` only. Append at stage close and post-launch. Rules for writing:
- Every entry MUST cite real evidence (a file, report, state field, or logged event in this repo). No invented facts, numbers, quotes, or events.
- No £/$ amounts or sales estimates unless directly quoting a repo file — and then cite that file.
- Supersede, don't delete: if a lesson changes, add a corrected entry with the new date and mark the old one superseded. Keep the audit trail.
- Entry format: `- **[YYYY-MM-DD] [book-slug or system]** — lesson text. *Evidence:* <source>.`

---

## Market & Positioning

- **[2026-06-19] vagus-nerve-gut-reset-workbook** — A generic "gut health" angle was NOT open — the higher-review Kindle tier already owned it. Sharpen the spine to a specific condition or named mechanism (IBS/bloating, gut-brain axis) rather than "gut health" broadly. *Evidence:* intelligence/reports/vagus_nerve_blueprint_2026-06-19.md §9 (competitors "The Vagus Nerve Switch"/"Unlock The Power of Your Vagus Nerve" claim the gut angle; "'Gut' alone is no longer open").
- **[2026-06-19] vagus-nerve-gut-reset-workbook** — A number/time hook (10-Minute, 28-Day, 4-Week) is table stakes in this niche, not a differentiator — every winning indie title leads with one, so it cannot be the point of difference on its own. *Evidence:* intelligence/reports/vagus_nerve_blueprint_2026-06-19.md §1 ("Time-bound hooks are universal … A number/time hook is table stakes, not a differentiator").
- **[2026-06-19] vagus-nerve-gut-reset-workbook** — Price to the proven winning band, not the floor: the $0.99 Kindle titles sat at deep BSR, so cutting price did not buy rank. Blueprint set Kindle $6.99 / paperback $14.99 matching the two real indie leaders. *Evidence:* intelligence/reports/vagus_nerve_blueprint_2026-06-19.md §5 ("Avoid the $0.99 Kindle race to the bottom … cutting price did not buy rank").

## Writing & Voice

- **[2026-06-15] system** — AI-sounding prose was a recurring problem, which is why the HEALTH-VOICE-BIBLE exists as a hard gate: health-writer must write in it and book-reviewer must score against it; prose that hits the Anti-AI Ban List fails regardless of factual accuracy. *Evidence:* .claude/agents/03-writing/HEALTH-VOICE-BIBLE.md ("Anti-AI Ban List … each one is a tell that prose was machine-generated"; book-reviewer enforces it as the rubric).
- **[2026-06-26] vagus-nerve-gut-reset-workbook** — When converting fill-in blocks to prose, keep the numeric arc coherent and give the differentiator week the most depth: the Maya worked-example baseline→recap numbers were made to track, and Week 3 (the gut differentiator) was written deepest. *Evidence:* pipeline-state.json stages."03-writing".completion_notes (Maya baseline 21/30 → 30-day recap 21→13; "Week 3 … is the deepest week").

## Covers & Design

- **[2026-06-28] system** — Cover JPEGs need a proper JFIF APP0 header or pandoc mishandles them: a valid 1600x2560 baseline JPEG that started `ff d8 ff db` (no JFIF header) made pandoc emit "could not determine image size for cover"; injecting the standard JFIF APP0 segment (now `ff d8 ff e0`) cleared the warning with image content unchanged. *Evidence:* pipeline-state.json agent_log 2026-06-28T17:38:00Z (COVER-WARNING RESOLUTION VERIFY).
- **[2026-06-26] vagus-nerve-gut-reset-workbook** — An AI-generated cover must be declared as Images=AI in the KDP AI questionnaire at upload; record that flag on the cover-approval note so it is not forgotten at the human gate. *Evidence:* pipeline-state.json human_gates.cover_approved_note ("AI-generated cover — declare Images=AI in KDP questionnaire").
- **[2026-06-29] vagus-nerve-gut-reset-workbook** — A KDP paperback edition is blocked without a wrap cover (front+spine+back PDF); an eBook-only 1600x2560 cover lets Kindle ship but leaves the print edition incomplete. Produce the wrap cover before promising paperback. *Evidence:* pipeline-state.json paperback_wrap_cover_todo + agent_log 2026-06-29 kdp-upload-agent blocker.

## Publishing & KDP

- **[2026-06-25] vagus-nerve-gut-reset-workbook** — KDP rejected a fill-in workbook as an ineligible "Blank Journal" (235 blank fill-in lines, 56 empty checkboxes; Kindle-ineligible). Converting the interior to readable PROSE fixed it. Never build fill-in interiors for Kindle; move any tracking to a companion PDF referenced in back matter. *Evidence:* pipeline-state.json rebuild block ("KDP rejected the fill-in WORKBOOK as a Blank Journal … Converting … to a readable PROSE BOOK") and stages."03-writing".reset_reason (tracking → optional companion PDF).
- **[2026-06-26] vagus-nerve-gut-reset-workbook** — Format/eligibility words are banned from Kindle titles/subtitles: the title dropped "Workbook" (folder slug unchanged) and the pipeline scans for banned keywords (the "Blank Journal" contiguous phrase also had to be reworded out of listing/FACTS files to pass the format gate). *Evidence:* pipeline-state.json title_change_log ("drops banned 'Workbook'") and stages."05-optimisation".completion_notes ("reworded the 'Blank Journal' phrase … to avoid the scanner's banned contiguous phrase").
- **[2026-06-26] system** — A Kindle EPUB must be ≥500KB with an embedded cover to pass the pipeline's Kindle gate; an undersized EPUB means the cover failed to embed or the build is incomplete. This is asserted in the build script and re-checked by validate-state (INV-10). *Evidence:* build-manuscript.sh §"Post-build assertion: EPUB must be >= 500KB" and scripts/validate-state.cjs INV-10 (`kb < 500` → CRITICAL).
- **[2026-06-21] vagus-nerve-gut-reset-workbook** — AI disclosure belongs in the KDP upload questionnaire (metadata), NOT printed in the book: compliance removed an in-book "AI Disclosure" block from the copyright page per pipeline policy; the honest questionnaire answers are Text = AI-assisted + human-edited (Anthropic Claude), Images = AI, Translation = None, and remain a human gate at upload. *Evidence:* books/vagus-nerve-gut-reset-workbook/COMPLIANCE-REPORT.md (in-book block removed; questionnaire-only) and pipeline-state.json human_gates.ai_questionnaire_note.
- **[2026-06-19] vagus-nerve-gut-reset-workbook** — Series publishing norms that shipped for this gut-health build: DRM ENABLED, enrolled in KDP Select / KU (near-total KU penetration in the Kindle tier), Amazon.com as the primary marketplace. *Evidence:* pipeline-state.json intelligence_gate.gates_cleared.gate_4 (ENROL in KDP Select), publishing.kdp_select=true, pricing_strategy_note ("Amazon.com (US) primary, KDP Select YES"), and agent_log 2026-07-01 (listing populated with DRM enabled).

## Launch & Marketing

- **[2026-06-21] vagus-nerve-gut-reset-workbook** — A KDP Countdown Deal requires 30 days in KDP Select first, so it may not be eligible on Day 1 of a just-published book; the launch $2.99×7-day promo must be scheduled/verified manually on the KDP dashboard at publish time, not assumed. *Evidence:* pipeline-state.json publishing.countdown_deal_eligibility_note ("Requires published + 30 days in KDP Select … verifies on KDP dashboard at publish time").

## Mistakes — Never Repeat

- **[2026-06-29] system** — Never leave an agent's YAML `description:` unquoted when it contains a colon-space (`": "`): YAML parses the bare scalar as a nested mapping, the frontmatter fails to parse, and Claude Code SILENTLY drops the agent from the registry — this made 6 of 55 agents (incl. kdp-upload-agent) undispatchable. Always quote the description; the sync script now auto-quotes to prevent recurrence. *Evidence:* scripts/AGENT-REGISTRY-FIX.md (root cause + `harden_frontmatter()` fix).
- **[2026-06-28] system** — Don't let a working-label leak into shipped metadata: build-manuscript.sh grabbed the book title from BLUEPRINT.md's H1, so a "(PROSE REBUILD)" working suffix leaked into the EPUB title. Fix — the build now prefers pipeline-state.json's canonical `book_title` and strips working labels from headings. *Evidence:* pipeline-state.json agent_log 2026-06-28 ("BUILD-METADATA FIX — strip '(PROSE REBUILD)' … harden title source").
- **[2026-06-25] vagus-nerve-gut-reset-workbook** — Building a fill-in workbook interior for a Kindle edition at all was the original mistake: it forced a full Stage 02–06 rebuild (new title, prose rewrite, re-QA, new cover) after KDP rejected it. Decide format eligibility BEFORE writing, not after upload. *Evidence:* pipeline-state.json stages 02–06 reset_reason blocks (all reset 2026-06-25 for the prose-book rebuild).
</content>
</invoke>
