#!/usr/bin/env node
/*
 * validate-state.cjs — BookFactory pipeline state invariant checker.
 *
 * Reads the contract in .claude/agents/PIPELINE-MANIFEST.json ("gates" +
 * "invariants") and validates each book's pipeline-state.json against it,
 * cross-checked against the filesystem and git. Intent-independent: it checks
 * the RESULT, so it catches corruption no matter how it got there (manual edit,
 * agent bug, mid-stage crash).
 *
 * Usage:
 *   node scripts/validate-state.cjs                 # scan all books, full report
 *   node scripts/validate-state.cjs <book-slug>     # one book, full report
 *   node scripts/validate-state.cjs --hook          # active books only, terse, for the Stop hook
 *
 * Exit code: 0 = clean (no CRITICAL). 1 = at least one CRITICAL violation.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { scanBook } = require("./format-eligibility.cjs");

const FACTORY = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(FACTORY, ".claude", "agents", "PIPELINE-MANIFEST.json");
const BOOKS_DIR = path.join(FACTORY, "books");

const args = process.argv.slice(2);
const HOOK_MODE = args.includes("--hook");
const targetBook = args.find((a) => !a.startsWith("--"));

const C = { RED: "\x1b[31m", YEL: "\x1b[33m", GRN: "\x1b[32m", DIM: "\x1b[2m", BOLD: "\x1b[1m", OFF: "\x1b[0m" };

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

// Minimal glob: supports `*` within the final path segment (e.g. manuscript/*chapter*.md).
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
  return fs.readdirSync(absDir).filter((f) => rx.test(f));
}

const manifest = readJSON(MANIFEST_PATH);
const GATES = manifest.gates || {};

// --- git: repo-level branch check (INV-4), evaluated once ---
let branchInfo = { branch: null, ahead: 0 };
try {
  branchInfo.branch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: FACTORY }).toString().trim();
  if (/^stage-/.test(branchInfo.branch)) {
    branchInfo.ahead = parseInt(
      execSync("git rev-list --count master..HEAD", { cwd: FACTORY }).toString().trim() || "0", 10
    );
  }
} catch (_) { /* not a git repo or no master — skip INV-4 */ }

function stageOrder(stages) {
  // Preserve the insertion order of the stages object as the canonical sequence.
  return Object.keys(stages);
}

function validateBook(slug) {
  const bookDir = path.join(BOOKS_DIR, slug);
  const statePath = path.join(bookDir, "pipeline-state.json");
  const v = []; // {level, code, msg}
  let state;
  try {
    state = readJSON(statePath);
  } catch (e) {
    return { slug, violations: [{ level: "CRITICAL", code: "STATE", msg: `pipeline-state.json unreadable: ${e.message}` }] };
  }

  const stages = state.stages || {};
  const order = stageOrder(stages);
  const isComplete = (k) => stages[k] && stages[k].status === "complete";

  // INV-1 monotonic completion
  let lastCompleteIdx = -1;
  order.forEach((k, i) => { if (isComplete(k)) lastCompleteIdx = i; });
  for (let i = 0; i < lastCompleteIdx; i++) {
    if (!isComplete(order[i])) {
      v.push({ level: "CRITICAL", code: "INV-1", msg: `${order[i]} is '${stages[order[i]].status}' but a later stage (${order[lastCompleteIdx]}) is complete — pipeline ran past an open gate.` });
    }
  }

  // INV-2 declared outputs exist + INV-2b required_outputs present (for each complete stage)
  for (const k of order) {
    if (!isComplete(k)) continue;
    const declared = (stages[k].outputs || []);
    for (const outRaw of declared) {
      const out = String(outRaw).trim().split(/\s+/)[0]; // first path token; ignore descriptive annotations like "(FREE GIFT section)"
      const m = globMatches(bookDir, out);
      if (m === null) continue;            // descriptive/relative-range entry — unverifiable, skip
      if (m.length === 0) {
        v.push({ level: "CRITICAL", code: "INV-2", msg: `${k} marked complete but declared output missing on disk: ${out}` });
      }
    }
    // INV-2b / INV-12: required contract outputs for a complete stage.
    // Default severity is now CRITICAL (INV-12): a complete stage missing a
    // contract output is a hard block. Severity is overridable per gate via
    // required_outputs_severity (kept for forward-compat; CRITICAL is the floor).
    const gate = GATES[k];
    if (gate && gate.required_outputs) {
      const sev = gate.required_outputs_severity === "WARN" ? "WARN" : "CRITICAL";
      for (const pat of gate.required_outputs) {
        const m = globMatches(bookDir, pat);
        if (m && m.length === 0) {
          v.push({ level: sev, code: sev === "CRITICAL" ? "INV-12" : "INV-2b", msg: `${k} complete but required contract output missing: ${pat}` });
        }
      }
    }

    // Stage completion authority: only the orchestrator may close a stage.
    const SCR = manifest.stage_completion_rule;
    if (SCR && SCR.required_field) {
      const actor = stages[k][SCR.required_field];
      if (actor !== SCR.required_value) {
        const sev = SCR.severity === "WARN" ? "WARN" : "CRITICAL";
        v.push({ level: sev, code: "INV-13", msg: `${k} is complete but ${SCR.required_field}='${actor === undefined ? "(unset)" : actor}', not '${SCR.required_value}' — only the orchestrator may close a stage.` });
      }
    }
  }

  // INV-3 current_stage agreement
  if (typeof state.current_stage === "number" && lastCompleteIdx >= 0) {
    const expected = parseInt(order[lastCompleteIdx].slice(0, 2), 10);
    // allow current_stage to be the in-progress stage just past the last complete one
    const inprog = order.find((k) => stages[k].status === "in_progress");
    const inprogIdx = inprog ? parseInt(inprog.slice(0, 2), 10) : null;
    if (state.current_stage !== expected && state.current_stage !== inprogIdx) {
      v.push({ level: "WARN", code: "INV-3", msg: `current_stage=${state.current_stage} but furthest complete stage is ${order[lastCompleteIdx]}.` });
    }
  }

  // INV-5 stale PENDING in a book whose stages are complete
  if (lastCompleteIdx >= 0) {
    try {
      for (const f of fs.readdirSync(bookDir)) {
        if (!f.endsWith(".md")) continue;
        const txt = fs.readFileSync(path.join(bookDir, f), "utf8");
        if (/PENDING[^\n]{0,40}APPROVAL/i.test(txt)) {
          v.push({ level: "WARN", code: "INV-5", msg: `stale "PENDING ... APPROVAL" left in ${f} while stages are complete.` });
        }
      }
    } catch (_) { /* ignore */ }
  }

  // INV-6 publish lock (the irreversible one)
  const hg = state.human_gates || {};
  const pub = state.publishing || {};
  if (hg.published === true) {
    if (!pub.asin) v.push({ level: "CRITICAL", code: "INV-6", msg: `human_gates.published=true but publishing.asin is not set — cannot be genuinely live.` });
    if (hg.ai_questionnaire_confirmed !== true) v.push({ level: "CRITICAL", code: "INV-6", msg: `human_gates.published=true but ai_questionnaire_confirmed is not true.` });
  }

  // INV-7 quality before production.
  // Absent proof (legacy/older state schema) => WARN (can't prove). A recorded
  // failing score => CRITICAL (a real quality breach that still went to production).
  if (isComplete("06-production")) {
    const q = state.quality_scores || {};
    const avg = q.book_reviewer_avg;
    if (avg === undefined || avg === null) {
      v.push({ level: "WARN", code: "INV-7", msg: `06-production complete but no book_reviewer_avg in state — cannot prove the >=96 quality gate was met (legacy schema?).` });
    } else if (typeof avg !== "number" || avg < 96) {
      v.push({ level: "CRITICAL", code: "INV-7", msg: `06-production complete but book_reviewer_avg (${avg}) < 96.` });
    }
    const fc = q.fact_check_result;
    if (fc === undefined || fc === null) {
      v.push({ level: "WARN", code: "INV-7", msg: `06-production complete but no fact_check_result in state — cannot prove fact-check PASS (legacy schema?).` });
    } else if (fc !== "PASS") {
      v.push({ level: "CRITICAL", code: "INV-7", msg: `06-production complete but fact_check_result is '${fc}', not PASS.` });
    }

    // INV-9 final-approval score gate
    const fa = q.final_approval_score;
    if (fa === undefined || fa === null) {
      v.push({ level: "CRITICAL", code: "INV-9", msg: `06-production complete but no final_approval_score in state — must be >= 270.` });
    } else if (typeof fa !== "number" || fa < 270) {
      v.push({ level: "CRITICAL", code: "INV-9", msg: `06-production complete but final_approval_score (${fa}) < 270.` });
    }

    // INV-10 EPUB built and sized — only required when a Kindle edition is declared.
    // kdp_editions.kindle === false => paperback-only book, no EPUB expected.
    const editions = state.kdp_editions || {};
    const kindleDeclared = editions.kindle !== false; // default true (legacy/standard)
    if (kindleDeclared) {
      const epubPath = path.join(bookDir, "exports", "final", "manuscript-kdp.epub");
      if (!fs.existsSync(epubPath)) {
        v.push({ level: "CRITICAL", code: "INV-10", msg: `06-production complete but exports/final/manuscript-kdp.epub does not exist (kdp_editions.kindle is not false).` });
      } else {
        const kb = fs.statSync(epubPath).size / 1024;
        if (kb < 500) {
          v.push({ level: "CRITICAL", code: "INV-10", msg: `06-production complete but EPUB is ${kb.toFixed(0)}KB (< 500KB) — cover missing or build incomplete.` });
        }
      }
    }
  }

  // INV-14 Kindle format eligibility (applies whenever a Kindle/EPUB edition exists or is declared).
  // Deterministic scan: blank fill-in lines / empty checkboxes / blank tracker tables / banned
  // format keywords make the content a "Blank Journal/Workbook/Coloring/Puzzle" book — paperback-only
  // on KDP. This is the check that would have caught the 2026-06-21 vagus-nerve rejection.
  {
    const editions = state.kdp_editions || {};
    const epubOnDisk = fs.existsSync(path.join(bookDir, "exports", "final", "manuscript-kdp.epub"));
    const kindleDeclared = editions.kindle !== false; // default true
    // Only enforce if a Kindle edition is declared OR an EPUB was actually built.
    if (kindleDeclared || epubOnDisk) {
      let meta = { title: state.book_title, subtitle: state.book_subtitle, blueprintText: "" };
      for (const bp of ["BLUEPRINT.md", "KDP-LISTING.md"]) {
        const p = path.join(bookDir, bp);
        if (fs.existsSync(p)) { try { meta.blueprintText += fs.readFileSync(p, "utf8"); } catch (_) {} }
      }
      let r;
      try { r = scanBook(bookDir, meta); } catch (_) { r = null; }
      if (r && !r.kindleEligible) {
        const detail = r.reasons.join(" ");
        v.push({ level: "CRITICAL", code: "INV-14", msg: `Kindle/EPUB edition declared or built, but manuscript is NOT Kindle-eligible: ${detail} Re-route to paperback-only (set kdp_editions.kindle:false) or build a blank-free Kindle variant + companion PDF.` });
      }
    }
  }

  // INV-11 no AI disclosure in any copyright file (applies regardless of stage)
  const AI_DISCLOSURE_RX = /AI Disclosure|drafted with the assistance of AI/i;
  const manuscriptDir = path.join(bookDir, "manuscript");
  for (const dir of [bookDir, manuscriptDir]) {
    if (!fs.existsSync(dir)) continue;
    let entries;
    try { entries = fs.readdirSync(dir); } catch (_) { continue; }
    for (const f of entries) {
      if (!/copyright/i.test(f) || !f.endsWith(".md")) continue;
      try {
        const txt = fs.readFileSync(path.join(dir, f), "utf8");
        if (AI_DISCLOSURE_RX.test(txt)) {
          v.push({ level: "CRITICAL", code: "INV-11", msg: `AI disclosure language found in ${path.relative(bookDir, path.join(dir, f))} — must be stripped before publication.` });
        }
      } catch (_) { /* ignore */ }
    }
  }

  // INV-8 gate_in satisfied (WARN — prep-ahead permitted, publish locked by INV-6)
  for (const k of order) {
    const st = stages[k] && stages[k].status;
    if (st !== "complete" && st !== "in_progress") continue;
    const gate = GATES[k];
    if (!gate || !gate.gate_in) continue;
    for (const field of gate.gate_in) {
      if (hg[field] !== true) {
        v.push({ level: "WARN", code: "INV-8", msg: `${k} has begun but its entry gate '${field}' is not true.` });
      }
    }
  }

  const parked = /^(parked|archived)$/i.test(String(state.lifecycle || ""));
  return { slug, violations: v, published: hg.published === true, parked };
}

// --- select books ---
let slugs;
if (targetBook) {
  slugs = [targetBook];
} else {
  slugs = fs.readdirSync(BOOKS_DIR).filter((d) => fs.existsSync(path.join(BOOKS_DIR, d, "pipeline-state.json")));
}

let criticalCount = 0;
const reports = [];
for (const slug of slugs) {
  const r = validateBook(slug);
  // Hook only polices in-flight books: skip published (live) AND explicitly
  // parked/archived drafts. Parked books still appear in the full report below
  // (`node scripts/validate-state.cjs`) — nothing is hidden from the audit; the
  // hook just doesn't hard-block the turn on work the author has set aside.
  if (HOOK_MODE && (r.published || r.parked)) continue;
  const crit = r.violations.filter((x) => x.level === "CRITICAL");
  criticalCount += crit.length;
  if (HOOK_MODE) {
    if (crit.length) reports.push({ slug: r.slug, violations: crit });
  } else {
    reports.push(r);
  }
}

// --- INV-4 repo-level (attach to output once) ---
const branchViol = branchInfo.ahead > 0
  ? { level: "CRITICAL", code: "INV-4", msg: `${branchInfo.ahead} commit(s) stranded on unmerged branch '${branchInfo.branch}' (not in master).` }
  : null;
if (branchViol) criticalCount++;

// --- render ---
function tag(level) {
  if (level === "CRITICAL") return `${C.RED}${C.BOLD}CRITICAL${C.OFF}`;
  return `${C.YEL}WARN${C.OFF}`;
}

if (HOOK_MODE) {
  if (criticalCount === 0) { process.exit(0); } // clean: let the turn end silently
  // Emit the Stop-hook block contract so the turn cannot end with the pipeline corrupt.
  let reason = `BookFactory pipeline state has ${criticalCount} CRITICAL invariant violation(s) — resolve before ending the turn:\n`;
  if (branchViol) reason += `  [INV-4] ${branchViol.msg}\n`;
  for (const r of reports) for (const x of r.violations) reason += `  [${x.code}] (${r.slug}) ${x.msg}\n`;
  reason += `\nRun \`node scripts/validate-state.cjs\` for the full report. Fix the state or merge the branch, then continue.`;
  process.stdout.write(JSON.stringify({ decision: "block", reason }));
  process.exit(0);
}

console.log(`\n${C.BOLD}BookFactory — Pipeline State Validation${C.OFF}`);
console.log(`${C.DIM}contract: .claude/agents/PIPELINE-MANIFEST.json · ${slugs.length} book(s)${C.OFF}\n`);

if (branchViol) console.log(`${C.BOLD}repo${C.OFF}  ${tag("CRITICAL")} [INV-4] ${branchViol.msg}\n`);

for (const r of reports) {
  const parkedTag = r.parked ? ` ${C.YEL}[parked — not hook-blocking, still audited]${C.OFF}` : "";
  if (r.violations.length === 0) {
    console.log(`${C.GRN}✓${C.OFF} ${C.BOLD}${r.slug}${C.OFF} — clean${parkedTag}`);
    continue;
  }
  const crit = r.violations.filter((x) => x.level === "CRITICAL").length;
  const warn = r.violations.filter((x) => x.level === "WARN").length;
  console.log(`${crit ? C.RED + "✗" + C.OFF : C.YEL + "!" + C.OFF} ${C.BOLD}${r.slug}${C.OFF} — ${crit} critical, ${warn} warn${parkedTag}`);
  for (const x of r.violations) console.log(`    ${tag(x.level)} [${x.code}] ${x.msg}`);
}

console.log(`\n${criticalCount === 0 ? C.GRN + "PASS" + C.OFF : C.RED + C.BOLD + "FAIL" + C.OFF} — ${criticalCount} critical violation(s)\n`);
process.exit(criticalCount === 0 ? 0 : 1);
