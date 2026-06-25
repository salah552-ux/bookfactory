#!/usr/bin/env node
/*
 * pre-stage-gate.cjs — BookFactory pre-stage authorisation gate.
 *
 * Runs BEFORE any stage may start. This is the structural enforcement that makes
 * pipeline bypass impossible: no stage agent should be dispatched until this gate
 * returns exit 0. It is the pre-flight complement to validate-state.cjs (which is
 * the post-hoc Stop-hook check).
 *
 * It answers one question: "Is it legal to START stage N for this book right now?"
 *
 * CHECKS (all sourced from .claude/agents/PIPELINE-MANIFEST.json — single source
 * of truth, kept in lockstep with validate-state.cjs):
 *
 *   1. AUTHORITY — every ALREADY-COMPLETE stage carries
 *      executed_by: "pipeline-orchestrator" (stage_completion_rule). If any prior
 *      stage was closed by a non-orchestrator actor, the pipeline was bypassed →
 *      BLOCK. (This is the exact failure mode that caused the incident.)
 *
 *   2. PREREQUISITE OUTPUTS — every stage strictly BEFORE the target stage must
 *      have all gates.required_outputs present on disk, and any sized artifact
 *      (EPUB) must meet its minimum size. A missing or under-sized output means a
 *      prior stage did not really finish → BLOCK.
 *
 *   3. ENTRY GATES — the target stage's gates.gate_in human_gates must all be
 *      true (e.g. blueprint_approved before 03-writing). A stage may not BEGIN
 *      with an open entry gate → BLOCK.
 *
 *   4. AI DISCLOSURE — no *copyright*.md (book root or manuscript/) may contain AI
 *      disclosure language (INV-11). This is checked on every stage start, not
 *      just at publish, so it can never slip through → BLOCK.
 *
 * Usage:
 *   node scripts/pre-stage-gate.cjs <book-slug> <stage-number>
 *      stage-number is the numeric prefix of the stage about to start
 *      (e.g. 3 for "03-writing", 6 for "06-production", 7 for "07-publishing").
 *
 * Exit code: 0 = CLEARED, stage may start. 1 = BLOCKED, do not dispatch any agent.
 */

const fs = require("fs");
const path = require("path");
const { scanBook } = require("./format-eligibility.cjs");

const FACTORY = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(FACTORY, ".claude", "agents", "PIPELINE-MANIFEST.json");
const BOOKS_DIR = path.join(FACTORY, "books");

const C = { RED: "\x1b[31m", YEL: "\x1b[33m", GRN: "\x1b[32m", DIM: "\x1b[2m", BOLD: "\x1b[1m", OFF: "\x1b[0m" };

// Minimum sizes (KB) for sized artifacts — mirror of validate-state.cjs / orchestrator thresholds.
const MIN_SIZE_KB = {
  "exports/final/manuscript-kdp.epub": 500,
};

function die(msg) {
  console.error(`${C.RED}${C.BOLD}pre-stage-gate ERROR:${C.OFF} ${msg}`);
  process.exit(1);
}

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

// Minimal glob: supports `*` within the final path segment. Mirrors validate-state.cjs.
function globMatches(bookDir, pattern) {
  if (pattern.includes(" ... ") || pattern.includes("..")) return null; // descriptive range — unverifiable
  if (!pattern.includes("*")) {
    return fs.existsSync(path.join(bookDir, pattern)) ? [pattern] : [];
  }
  const dir = path.dirname(pattern);
  const fileGlob = path.basename(pattern);
  const absDir = path.join(bookDir, dir);
  if (!fs.existsSync(absDir)) return [];
  const rx = new RegExp("^" + fileGlob.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$", "i");
  return fs.readdirSync(absDir).filter((f) => rx.test(f)).map((f) => path.join(dir, f));
}

// --- args ---
const args = process.argv.slice(2);
const slug = args[0];
const stageArg = args[1];
if (!slug || stageArg === undefined) {
  die("usage: node scripts/pre-stage-gate.cjs <book-slug> <stage-number>");
}
const targetStageNum = parseInt(String(stageArg).replace(/\D/g, ""), 10);
if (Number.isNaN(targetStageNum)) die(`could not parse a stage number from "${stageArg}".`);

// --- load manifest + state ---
let manifest, state;
try { manifest = readJSON(MANIFEST_PATH); } catch (e) { die(`cannot read PIPELINE-MANIFEST.json: ${e.message}`); }

const bookDir = path.join(BOOKS_DIR, slug);
const statePath = path.join(bookDir, "pipeline-state.json");
if (!fs.existsSync(statePath)) die(`no pipeline-state.json for "${slug}" at ${statePath}.`);
try { state = readJSON(statePath); } catch (e) { die(`pipeline-state.json unreadable: ${e.message}`); }

const GATES = manifest.gates || {};
const SCR = manifest.stage_completion_rule || {};
const stages = state.stages || {};
// Canonical stage order = insertion order of the state's stages object.
const order = Object.keys(stages);
const stageNum = (k) => parseInt(k.slice(0, 2), 10);
const targetKey = order.find((k) => stageNum(k) === targetStageNum);

const failures = [];

// ============================================================
// CHECK 1 — AUTHORITY: every already-complete stage was closed by the orchestrator
// ============================================================
if (SCR.required_field && SCR.required_value) {
  for (const k of order) {
    if (!stages[k] || stages[k].status !== "complete") continue;
    const actor = stages[k][SCR.required_field];
    if (actor !== SCR.required_value) {
      failures.push(
        `AUTHORITY [INV-13] — stage "${k}" is complete but ${SCR.required_field}=` +
        `'${actor === undefined ? "(unset)" : actor}', not '${SCR.required_value}'. ` +
        `A non-orchestrator actor closed this stage — the pipeline was bypassed.`
      );
    }
  }
}

// ============================================================
// CHECK 2 — PREREQUISITE OUTPUTS: every stage BEFORE the target must be complete
//           with all required_outputs present and sized
// ============================================================
for (const k of order) {
  if (stageNum(k) >= targetStageNum) continue; // only stages strictly before the target
  const st = stages[k] && stages[k].status;
  if (st !== "complete") {
    failures.push(
      `PREREQUISITE — stage "${k}" is '${st || "(missing)"}', not 'complete'. ` +
      `Cannot start stage ${String(targetStageNum).padStart(2, "0")} before all prior stages finish.`
    );
    continue;
  }
  const gate = GATES[k];
  if (!gate || !gate.required_outputs) continue;
  for (const pat of gate.required_outputs) {
    const m = globMatches(bookDir, pat);
    if (m === null) continue; // unverifiable descriptive pattern
    if (m.length === 0) {
      failures.push(`PREREQUISITE — stage "${k}" complete but required output missing on disk: ${pat}`);
      continue;
    }
    // Size floor for sized artifacts.
    const minKb = MIN_SIZE_KB[pat];
    if (minKb) {
      const abs = path.join(bookDir, m[0]);
      const kb = fs.statSync(abs).size / 1024;
      if (kb < minKb) {
        failures.push(`PREREQUISITE — ${pat} is ${kb.toFixed(0)}KB (< ${minKb}KB) — prior stage build incomplete.`);
      }
    }
  }
}

// ============================================================
// CHECK 3 — ENTRY GATES: the target stage's gate_in human_gates must be true
// ============================================================
const hg = state.human_gates || {};
if (targetKey && GATES[targetKey] && Array.isArray(GATES[targetKey].gate_in)) {
  for (const field of GATES[targetKey].gate_in) {
    if (hg[field] !== true) {
      failures.push(
        `ENTRY GATE — stage "${targetKey}" requires human_gates.${field}=true before it may begin ` +
        `(currently ${hg[field] === undefined ? "(unset)" : hg[field]}).`
      );
    }
  }
}

// ============================================================
// CHECK 4 — AI DISCLOSURE: no copyright file may contain AI disclosure (INV-11)
// ============================================================
const AI_DISCLOSURE_RX = /AI Disclosure|drafted with the assistance of AI/i;
for (const dir of [bookDir, path.join(bookDir, "manuscript")]) {
  if (!fs.existsSync(dir)) continue;
  let entries;
  try { entries = fs.readdirSync(dir); } catch (_) { continue; }
  for (const f of entries) {
    if (!/copyright/i.test(f) || !f.endsWith(".md")) continue;
    try {
      const txt = fs.readFileSync(path.join(dir, f), "utf8");
      if (AI_DISCLOSURE_RX.test(txt)) {
        failures.push(
          `AI DISCLOSURE [INV-11] — disclosure language found in ` +
          `${path.relative(bookDir, path.join(dir, f))}. Must be stripped before any stage proceeds.`
        );
      }
    } catch (_) { /* ignore */ }
  }
}

// ============================================================
// CHECK 5 — KINDLE FORMAT ELIGIBILITY (INV-14): blank-journal/workbook/coloring/
//           puzzle content is paperback-only. Enforced from stage 06 onward (build
//           + upload), when a Kindle edition is declared or about to be produced.
//           This is the structural pre-flight that would have stopped the
//           2026-06-21 vagus-nerve KDP rejection before the EPUB was ever built.
// ============================================================
if (targetStageNum >= 6) {
  const editions = state.kdp_editions || {};
  const kindleDeclared = editions.kindle !== false; // default true
  if (kindleDeclared) {
    let meta = { title: state.book_title, subtitle: state.book_subtitle, blueprintText: "" };
    for (const bp of ["BLUEPRINT.md", "KDP-LISTING.md"]) {
      const p = path.join(bookDir, bp);
      if (fs.existsSync(p)) { try { meta.blueprintText += fs.readFileSync(p, "utf8"); } catch (_) {} }
    }
    let r;
    try { r = scanBook(bookDir, meta); } catch (_) { r = null; }
    if (r && !r.kindleEligible) {
      failures.push(
        `FORMAT ELIGIBILITY [INV-14] — a Kindle edition is declared (kdp_editions.kindle != false) but the ` +
        `manuscript is NOT Kindle-eligible: ${r.reasons.join(" ")} ` +
        `KDP rejects this as a Blank Journal/Workbook. Re-route: set kdp_editions.kindle:false and publish paperback, ` +
        `or build a blank-free Kindle variant + companion PDF before this stage may start.`
      );
    }
  }
}

// ============================================================
// RESULT
// ============================================================
const stageLabel = targetKey || `${String(targetStageNum).padStart(2, "0")}-(unknown)`;
console.log(`\n${C.BOLD}pre-stage-gate${C.OFF} ${C.DIM}— ${slug} — about to start stage ${stageLabel}${C.OFF}`);

if (failures.length === 0) {
  console.log(`${C.GRN}${C.BOLD}CLEARED${C.OFF} — all pre-stage checks passed. Stage ${stageLabel} may start.\n`);
  process.exit(0);
}

console.log(`${C.RED}${C.BOLD}⛔ BLOCKED${C.OFF} — ${failures.length} check(s) failed. DO NOT dispatch any stage agent.\n`);
for (const f of failures) console.log(`  ${C.RED}✗${C.OFF} ${f}`);
console.log(
  `\n${C.BOLD}Required action:${C.OFF} the orchestrator must STOP, report this to the Architect, ` +
  `and resolve every failure above. Re-run this gate until it returns CLEARED before any agent is spawned.\n`
);
process.exit(1);
