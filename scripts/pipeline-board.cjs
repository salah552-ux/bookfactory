#!/usr/bin/env node
/*
 * pipeline-board.cjs - catalogue-wide mission control for BookFactory.
 *
 * One glance at every book: current stage, the next actionable stage, whether its
 * entry gate is open, overall state validity, and the EXACT next command to run.
 * Reduces manual touch from "open each book and reason about it" to a single command.
 *
 * It reuses the same contract (PIPELINE-MANIFEST.json gates) and the same validator
 * (validate-state.cjs) so the board can never disagree with the enforcement floor.
 *
 * Usage:
 *   node scripts/pipeline-board.cjs            # whole catalogue
 *   node scripts/pipeline-board.cjs --ready    # only books with an OPEN next gate
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const FACTORY = path.resolve(__dirname, "..");
const BOOKS = path.join(FACTORY, "books");
const MANIFEST = JSON.parse(fs.readFileSync(path.join(FACTORY, ".claude", "agents", "PIPELINE-MANIFEST.json"), "utf8"));
const GATES = MANIFEST.gates || {};
const C = { R: "\x1b[31m", Y: "\x1b[33m", G: "\x1b[32m", D: "\x1b[2m", B: "\x1b[1m", CY: "\x1b[36m", O: "\x1b[0m" };

const readyOnly = process.argv.includes("--ready");

function validClean(slug) {
  try { execSync(`node "${path.join(FACTORY, "scripts", "validate-state.cjs")}" ${slug}`, { cwd: FACTORY, stdio: "pipe" }); return true; }
  catch { return false; }
}

const slugs = fs.readdirSync(BOOKS).filter((d) => fs.existsSync(path.join(BOOKS, d, "pipeline-state.json")));
const rows = [];

for (const slug of slugs) {
  let st;
  try { st = JSON.parse(fs.readFileSync(path.join(BOOKS, slug, "pipeline-state.json"), "utf8")); }
  catch { rows.push({ slug, err: "unreadable state" }); continue; }
  const stages = st.stages || {};
  const order = Object.keys(stages);
  const isComplete = (k) => stages[k] && stages[k].status === "complete";
  const published = (st.human_gates || {}).published === true;
  const nextStage = order.find((k) => !isComplete(k));

  let gateOpen = true, gateMsg = "";
  if (nextStage) {
    const gate = GATES[nextStage];
    if (gate && gate.gate_in) {
      const unmet = gate.gate_in.filter((f) => (st.human_gates || {})[f] !== true);
      if (unmet.length) { gateOpen = false; gateMsg = "needs " + unmet.join(", "); }
    }
  }
  rows.push({
    slug,
    title: st.book_title || slug,
    series_no: st.series_number,
    current: nextStage ? order[Math.max(0, order.indexOf(nextStage) - 1)] : "all complete",
    next: nextStage || "—",
    published, gateOpen, gateMsg,
    valid: validClean(slug),
    done: !nextStage,
  });
}

console.log(`\n${C.B}BookFactory — Pipeline Board${C.O}  ${C.D}${new Date().toISOString().slice(0,10)}${C.O}`);
console.log("=".repeat(78));

for (const r of rows.sort((a, b) => (a.series_no || 99) - (b.series_no || 99))) {
  if (r.err) { console.log(`${C.R}✗ ${r.slug} — ${r.err}${C.O}`); continue; }
  if (readyOnly && (r.done || r.published || !r.gateOpen || !r.valid)) continue;

  const tag = r.published ? `${C.G}LIVE${C.O}` : r.done ? `${C.G}built→gate${C.O}` : `${C.CY}${r.next}${C.O}`;
  const v = r.valid ? `${C.G}valid${C.O}` : `${C.R}INVALID${C.O}`;
  const bk = r.series_no ? `Bk${r.series_no}` : "  -";
  console.log(`\n${C.B}${bk} ${r.title}${C.O}  ${C.D}(${r.slug})${C.O}`);
  console.log(`   state ${v} · next: ${tag}${r.gateOpen ? "" : `  ${C.Y}[GATE CLOSED: ${r.gateMsg}]${C.O}`}`);
  // the one next command
  if (r.published) {
    console.log(`   ${C.D}→ live; post-launch monitoring${C.O}`);
  } else if (r.done) {
    console.log(`   ${C.D}→ all stages built; awaiting human publish gate${C.O}`);
  } else if (!r.valid) {
    console.log(`   ${C.D}→ fix state first:  node scripts/validate-state.cjs ${r.slug}${C.O}`);
  } else if (!r.gateOpen) {
    console.log(`   ${C.D}→ grant gate (${r.gateMsg}) in pipeline-state.json, then:  node scripts/advance.cjs ${r.slug} --begin${C.O}`);
  } else {
    console.log(`   ${C.D}→ node scripts/advance.cjs ${r.slug} --begin${C.O}`);
  }
}

console.log("\n" + "=".repeat(78));
const live = rows.filter((r) => r.published).length;
const building = rows.filter((r) => !r.published && !r.done).length;
const atGate = rows.filter((r) => r.done && !r.published).length;
const invalid = rows.filter((r) => !r.valid && !r.err).length;
console.log(`${rows.length} books · ${live} live · ${atGate} built/at-gate · ${building} in build · ${invalid ? C.R + invalid + " INVALID" + C.O : "0 invalid"}`);
console.log(readyOnly ? `${C.D}(--ready filter: showing only books with an open next gate)${C.O}\n` : `${C.D}Tip: --ready shows only books you can advance right now.${C.O}\n`);
