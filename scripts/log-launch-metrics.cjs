#!/usr/bin/env node
/*
 * log-launch-metrics.cjs — the ONLY entry point for real KDP dashboard numbers.
 *
 * ZERO TOLERANCE: any metric flag REQUIRES --source; without it this script
 * refuses to write. It never invents, estimates, or back-fills a number.
 * The Architect reads the KDP dashboard / Author Central and runs:
 *
 *   node scripts/log-launch-metrics.cjs <book-slug> \
 *     --bsr 123456 --bsr-sub 2345 --reviews 3 --rating 4.5 \
 *     --ku-pages 210 --units 2 --week 6 [--promo] [--note "free days ran"] \
 *     --source "KDP dashboard 2026-07-09"
 *
 * Activation + re-rank bookkeeping (no source needed — boolean facts, dated):
 *   node scripts/log-launch-metrics.cjs <book-slug> --activate aplus_submitted
 *   node scripts/log-launch-metrics.cjs <book-slug> --rerank-applied
 *
 * Writes: books/<slug>/pipeline-state.json (post_launch block, additive)
 *         books/<slug>/LAUNCH-TRACKER.md   (appends one weekly-table row)
 */
const fs = require("fs");
const path = require("path");
const { ACTIVATION_FIELDS } = require("./postlaunch-audit.cjs");

const METRIC_FLAGS = ["bsr", "bsr-sub", "reviews", "rating", "ku-pages", "units", "week"];

function parseArgs(argv) {
  const out = { activate: [], promo: false, rerankApplied: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) { if (!out.slug) out.slug = a; continue; }
    const key = a.slice(2);
    if (key === "promo") out.promo = true;
    else if (key === "rerank-applied") out.rerankApplied = true;
    else if (key === "activate") out.activate.push(argv[++i]);
    else out[key] = argv[++i];
  }
  return out;
}

function buildObservation(flags, today) {
  const hasMetric = METRIC_FLAGS.some((k) => flags[k] !== undefined);
  if (!hasMetric) return null;
  if (!flags.source || !String(flags.source).trim()) {
    throw new Error('REFUSED: metrics require --source (e.g. --source "KDP dashboard 2026-07-09"). No number enters the system without a real source.');
  }
  const num = (flag, v) => {
    if (v === undefined) return null;
    const n = Number(v);
    if (!Number.isFinite(n)) {
      throw new Error(`REFUSED: --${flag} '${v}' is not a valid number. A malformed numeric flag would serialize to null — indistinguishable from "not measured" — so it is rejected instead of silently written.`);
    }
    return n;
  };
  return {
    date: today,
    week: num("week", flags.week),
    bsr_main: num("bsr", flags.bsr),
    bsr_sub1: num("bsr-sub", flags["bsr-sub"]),
    reviews: num("reviews", flags.reviews),
    rating: num("rating", flags.rating),
    ku_pages: num("ku-pages", flags["ku-pages"]),
    units_paid: num("units", flags.units),
    promo: !!flags.promo,
    note: flags.note || null,
    source: String(flags.source).trim(),
  };
}

function applyToState(state, { obs = null, activate = [], rerankApplied = false }, today) {
  // validate before mutating anything
  for (const f of activate) {
    if (!ACTIVATION_FIELDS.includes(f)) {
      throw new Error(`Unknown activation field '${f}'. Valid: ${ACTIVATION_FIELDS.join(", ")}`);
    }
  }
  const pl = (state.post_launch = state.post_launch || {});
  pl.observations = pl.observations || [];
  pl.launch_activation = pl.launch_activation || {};
  pl.rerank = pl.rerank || { applied_date: null };
  if (obs) pl.observations.push(obs);
  for (const f of activate) {
    pl.launch_activation[f] = true;
    pl.launch_activation[`${f}_date`] = today;
  }
  if (rerankApplied) pl.rerank.applied_date = today;
  return state;
}

function trackerRow(obs) {
  const c = (v) => (v === null || v === undefined ? "—" : String(v));
  // Escape literal pipes in free-text note — otherwise a note containing "|" would
  // inject extra markdown table columns and corrupt the row.
  const note = (obs.note || "none").replace(/\|/g, "/");
  const tail = `${note} · src: ${obs.source}`;
  return `| ${c(obs.week)} | ${obs.date} | ${c(obs.bsr_main)} | ${c(obs.bsr_sub1)} | ${c(obs.reviews)} | ${c(obs.rating)} | ${c(obs.ku_pages)} | ${c(obs.units_paid)}${obs.promo ? " (promo)" : ""} | ${tail} |`;
}

const TRACKER_TABLE_HEADER = [
  "## WEEKLY METRICS TABLE",
  "",
  "| Week | Date | BSR Main | BSR Sub 1 | Reviews | Rating | KU Pages | Units Sold | Interventions Fired |",
  "|------|------|----------|-----------|---------|--------|----------|------------|---------------------|",
].join("\n");

function appendToTracker(trackerPath, slug, row) {
  const txt = fs.existsSync(trackerPath)
    ? fs.readFileSync(trackerPath, "utf8")
    : `# LAUNCH TRACKER — ${slug}\n\n${TRACKER_TABLE_HEADER}\n`;
  const eol = txt && txt.includes("\r\n") ? "\r\n" : "\n";
  const lines = txt.split(/\r?\n/);
  // Anchor on the weekly-table header row specifically — the tracker contains
  // several other tables (known state, milestones) that must not receive rows.
  const hdrIdx = lines.findIndex((l) => /^\|\s*Week\s*\|\s*Date\s*\|/i.test(l));
  if (hdrIdx === -1) {
    lines.push("", TRACKER_TABLE_HEADER, row);
  } else {
    let end = hdrIdx + 1; // separator line
    while (end + 1 < lines.length && lines[end + 1].trim().startsWith("|")) end++;
    lines.splice(end + 1, 0, row);
  }
  fs.writeFileSync(trackerPath, lines.join(eol));
}

module.exports = { parseArgs, buildObservation, applyToState, trackerRow, appendToTracker };

if (require.main === module) {
  const FACTORY = path.resolve(__dirname, "..");
  const flags = parseArgs(process.argv.slice(2));
  if (!flags.slug) {
    console.error('Usage: node scripts/log-launch-metrics.cjs <book-slug> [--bsr n --reviews n ... --source "..."] [--activate <field>] [--rerank-applied]');
    process.exit(2);
  }
  const bookDir = path.join(FACTORY, "books", flags.slug);
  const statePath = path.join(bookDir, "pipeline-state.json");
  if (!fs.existsSync(statePath)) {
    console.error(`No pipeline-state.json for '${flags.slug}' — check the slug.`);
    process.exit(2);
  }
  const today = new Date().toISOString().slice(0, 10);
  let obs;
  try { obs = buildObservation(flags, today); }
  catch (e) { console.error(e.message); process.exit(1); }
  if (!obs && flags.activate.length === 0 && !flags.rerankApplied) {
    console.error("Nothing to log — pass metric flags (+--source), --activate <field>, or --rerank-applied.");
    process.exit(2);
  }
  const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
  try { applyToState(state, { obs, activate: flags.activate, rerankApplied: flags.rerankApplied }, today); }
  catch (e) { console.error(e.message); process.exit(1); }
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n");
  if (obs) {
    appendToTracker(path.join(bookDir, "LAUNCH-TRACKER.md"), flags.slug, trackerRow(obs));
    console.log(`Logged observation for ${flags.slug} (${obs.source}).`);
    console.log(`Optional calibration step: python intelligence/calibration_engine.py add-observation ${flags.slug} <niche> ${obs.week == null ? 0 : obs.week} ${obs.bsr_main == null ? 0 : obs.bsr_main} ${obs.units_paid == null ? 0 : obs.units_paid} ${obs.ku_pages == null ? 0 : obs.ku_pages} <price_gbp> ${obs.promo ? 1 : 0} "${obs.source}"`);
  }
  for (const f of flags.activate) console.log(`Activation recorded: ${f} = true (${today})`);
  if (flags.rerankApplied) console.log(`Re-rank applied date recorded: ${today} — Day-14/Day-30 re-observations are now tracked by the audit.`);
}
