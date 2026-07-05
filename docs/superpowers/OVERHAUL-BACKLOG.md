# System Overhaul — Backlog / Reminders

Big goal: massively improve automation + agent capabilities for higher-quality books & digital assets.
Split into 4 slices. Status as of 2026-07-01:

- [x] **Slice 1 — Book Quality (health)** — DONE. Health Voice Bible + health-writer + book-reviewer 4-axis gate.
      ⚠️ NOT yet committed to git. Spec: `docs/superpowers/specs/2026-07-01-health-book-quality-upgrade-design.md`,
      Plan: `docs/superpowers/plans/2026-07-01-health-book-quality-upgrade.md`.
      TODO later: clone the pattern to fiction/business/mystery writers.
- [ ] **Slice 2 — Digital assets** — ⏸️ DEFERRED (user paused 2026-07-01, will return).
      📌 REMINDER: pick up here. Scoping Q not yet answered: biggest pain = visual quality / volume /
      product selection / listing quality? Agents in scope: product-extractor, digital-product-designer,
      design-agent, + bookfactory-designer / canva-bulk-create skills.
- [x] **Slice 3 — Automation** — DONE + committed (f1f654d). Orchestrator retry/loop-guard + Run Ledger + 3 gates.
- [~] **Slice 4 — Agent brains** — IN PROGRESS. Phased 1→2→3:
      - [x] #1 Model audit — DONE + committed (2555d73). 19 quality-critical agents → Opus 4.8.
      - [ ] #2 Cross-book learning memory (shared LESSONS.md agents read/append). NEXT.
      - [ ] #3 Prompt refresh (agents not touched in slices 1/3).
