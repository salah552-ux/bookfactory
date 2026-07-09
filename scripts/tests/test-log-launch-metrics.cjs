#!/usr/bin/env node
// Tests for log-launch-metrics.cjs. Uses ONLY temp dirs — never real books/.
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  parseArgs, buildObservation, applyToState, trackerRow, appendToTracker,
} = require("../log-launch-metrics.cjs");

const TODAY = "2026-07-09";

// 1. parseArgs: slug, metric flags, repeatable --activate, booleans.
{
  const f = parseArgs(["my-book", "--bsr", "123456", "--reviews", "2", "--source", "KDP dashboard 2026-07-09", "--promo", "--activate", "aplus_submitted", "--activate", "author_central_live", "--rerank-applied"]);
  assert.strictEqual(f.slug, "my-book");
  assert.strictEqual(f.bsr, "123456");
  assert.strictEqual(f.promo, true);
  assert.strictEqual(f.rerankApplied, true);
  assert.deepStrictEqual(f.activate, ["aplus_submitted", "author_central_live"]);
}

// 2. ZERO TOLERANCE: any metric without --source throws (nothing is written).
assert.throws(() => buildObservation({ bsr: "1000" }, TODAY), /REFUSED/);
assert.throws(() => buildObservation({ bsr: "1000", source: "  " }, TODAY), /REFUSED/);

// 3. Metrics with a source build a full observation; unset metrics are null.
{
  const obs = buildObservation({ bsr: "123456", reviews: "2", source: "KDP dashboard 2026-07-09" }, TODAY);
  assert.strictEqual(obs.date, TODAY);
  assert.strictEqual(obs.bsr_main, 123456);
  assert.strictEqual(obs.reviews, 2);
  assert.strictEqual(obs.units_paid, null);
  assert.strictEqual(obs.source, "KDP dashboard 2026-07-09");
}

// 4. No metric flags at all → null (activation-only runs need no source).
assert.strictEqual(buildObservation({}, TODAY), null);

// 5. applyToState pushes the observation, records activation with a date, sets rerank date.
{
  const state = { human_gates: { published: true } };
  const obs = buildObservation({ bsr: "5000", source: "KDP dashboard 2026-07-09" }, TODAY);
  applyToState(state, { obs, activate: ["category_verified_live"], rerankApplied: true }, TODAY);
  assert.strictEqual(state.post_launch.observations.length, 1);
  assert.strictEqual(state.post_launch.launch_activation.category_verified_live, true);
  assert.strictEqual(state.post_launch.launch_activation.category_verified_live_date, TODAY);
  assert.strictEqual(state.post_launch.rerank.applied_date, TODAY);
}

// 6. Unknown activation field → throws, state untouched.
{
  const state = {};
  assert.throws(() => applyToState(state, { activate: ["made_up_field"] }, TODAY), /Unknown activation field/);
}

// 7. trackerRow renders the existing 9-column LAUNCH-TRACKER table shape, source in last cell.
{
  const obs = buildObservation({ week: "1", bsr: "123456", reviews: "0", source: "KDP dashboard 2026-07-09" }, TODAY);
  const row = trackerRow(obs);
  assert.strictEqual((row.match(/\|/g) || []).length, 10, "9 cells = 10 pipes");
  assert.ok(row.includes("123456"));
  assert.ok(row.includes("src: KDP dashboard 2026-07-09"));
}

// 8. appendToTracker inserts under the WEEKLY METRICS header (not a later table), creates file if absent.
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bf-tracker-"));
  const p = path.join(dir, "LAUNCH-TRACKER.md");
  const existing = [
    "# LAUNCH TRACKER — my-book", "",
    "## WEEKLY METRICS TABLE", "",
    "| Week | Date | BSR Main | BSR Sub 1 | Reviews | Rating | KU Pages | Units Sold | Interventions Fired |",
    "|------|------|----------|-----------|---------|--------|----------|------------|---------------------|",
    "| — | 2026-05-31 | BASELINE | — | 0 | null | null | null | none |", "",
    "## MILESTONE WATCH", "",
    "| Milestone | Status |", "|-----------|--------|", "| 5 reviews | NOT MET |",
  ].join("\n");
  fs.writeFileSync(p, existing);
  appendToTracker(p, "my-book", "| 1 | 2026-07-09 | 123456 | — | 0 | — | — | — | none · src: KDP dashboard 2026-07-09 |");
  const txt = fs.readFileSync(p, "utf8");
  const weeklyIdx = txt.indexOf("2026-07-09 | 123456");
  const milestoneIdx = txt.indexOf("## MILESTONE WATCH");
  assert.ok(weeklyIdx > -1 && weeklyIdx < milestoneIdx, "row must land in the weekly table, before MILESTONE WATCH");
  assert.ok(txt.includes("| — | 2026-05-31 | BASELINE"), "existing rows preserved (additive-only)");

  // creates a fresh tracker when missing
  const p2 = path.join(dir, "NEW-TRACKER.md");
  appendToTracker(p2, "new-book", "| 1 | 2026-07-09 | 9999 | — | 0 | — | — | — | none · src: KDP dashboard 2026-07-09 |");
  assert.ok(fs.readFileSync(p2, "utf8").includes("| 1 | 2026-07-09 | 9999"));
}

// 9. appendToTracker preserves CRLF line endings in an existing CRLF tracker.
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bf-crlf-"));
  const p = path.join(dir, "LAUNCH-TRACKER.md");
  const crlf = [
    "# LAUNCH TRACKER — crlf-book", "",
    "| Week | Date | BSR Main | BSR Sub 1 | Reviews | Rating | KU Pages | Units Sold | Interventions Fired |",
    "|------|------|----------|-----------|---------|--------|----------|------------|---------------------|",
    "| — | 2026-05-31 | BASELINE | — | 0 | null | null | null | none |",
  ].join("\r\n");
  fs.writeFileSync(p, crlf);
  appendToTracker(p, "crlf-book", "| 1 | 2026-07-09 | 123456 | — | 0 | — | — | — | none · src: KDP dashboard 2026-07-09 |");
  const out = fs.readFileSync(p, "utf8");
  assert.ok(out.includes("2026-07-09 | 123456"), "row appended");
  assert.strictEqual(out.split("\r\n").length - 1, out.split("\n").length - 1, "every newline is still CRLF — no LF-only lines introduced");
}

console.log("ALL PASS — log-launch-metrics");
