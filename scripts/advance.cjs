#!/usr/bin/env node
/*
 * advance.cjs — BookFactory pipeline runner / gatekeeper.
 *
 * Stages are executed by the orchestrator (agents), not by this script — but a
 * stage may not BEGIN or be marked COMPLETE except through these gates, which
 * reuse the same contract (.claude/agents/PIPELINE-MANIFEST.json "gates") and
 * the same validator (scripts/validate-state.cjs). The Stop hook is the floor
 * that catches anything skipping the runner; the runner is the happy path that
 * stops mistakes before they happen.
 *
 * Usage:
 *   node scripts/advance.cjs <book>              # status dashboard + what's next
 *   node scripts/advance.cjs <book> --begin      # precondition gate for the next stage
 *   node scripts/advance.cjs <book> --complete   # postcondition gate; marks the stage complete
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const FACTORY = path.resolve(__dirname, "..");
const MANIFEST = JSON.parse(fs.readFileSync(path.join(FACTORY, ".claude", "agents", "PIPELINE-MANIFEST.json"), "utf8"));
const GATES = MANIFEST.gates || {};
const C = { RED: "\x1b[31m", YEL: "\x1b[33m", GRN: "\x1b[32m", DIM: "\x1b[2m", BOLD: "\x1b[1m", CYN: "\x1b[36m", OFF: "\x1b[0m" };

const args = process.argv.slice(2);
const book = args.find((a) => !a.startsWith("--"));
const BEGIN = args.includes("--begin");
const COMPLETE = args.includes("--complete");

if (!book) {
  console.error("Usage: node scripts/advance.cjs <book-slug> [--begin|--complete]");
  process.exit(2);
}

const bookDir = path.join(FACTORY, "books", book);
const statePath = path.join(bookDir, "pipeline-state.json");
if (!fs.existsSync(statePath)) {
  console.error(`No pipeline-state.json for '${book}'`);
  process.exit(2);
}

function loadRaw() { return fs.readFileSync(statePath, "utf8"); }
function loadState() { return JSON.parse(loadRaw()); }

// Resolve genre family -> agent names from the manifest, for the dispatch brief.
function genreFamily(state) {
  const g = String(state.genre || "").toUpperCase();
  if (g.includes("MYSTERY")) return "FICTION-MYSTERY";
  if (g.includes("BUSINESS")) return "NONFICTION-BUSINESS";
  if (g.includes("FICTION") && !g.includes("NON")) return "FICTION";
  return "NONFICTION-HEALTH";
}

// Map a per-book state stage key (e.g. "03-writing") to the manifest stage entry by numeric prefix.
function manifestStage(stageKey) {
  const pfx = stageKey.slice(0, 2);
  return (MANIFEST.stages || []).find((s) => String(s.id).slice(0, 2) === pfx) || null;
}

function resolveAgents(stageKey, state) {
  const ms = manifestStage(stageKey);
  if (!ms) return [];
  const fam = MANIFEST.genres[genreFamily(state)] || {};
  let agents = ms.agents || (ms.steps ? ms.steps.flatMap((s) => s.agents || []) : []);
  return agents.map((a) =>
    a === "[genre.writing_agent]" ? (fam.writing_agent || a)
      : a === "[genre.planning_agent]" ? (fam.planning_agent || a) : a
  );
}

// Run the shared validator for this book; return {clean, output}.
function validate() {
  try {
    const out = execSync(`node "${path.join(FACTORY, "scripts", "validate-state.cjs")}" ${book}`, { cwd: FACTORY }).toString();
    return { clean: true, output: out };
  } catch (e) {
    return { clean: false, output: (e.stdout ? e.stdout.toString() : "") + (e.stderr ? e.stderr.toString() : "") };
  }
}

function outputsPresent(stageKey) {
  const gate = GATES[stageKey];
  const missing = [];
  if (gate && gate.required_outputs) {
    for (const pat of gate.required_outputs) {
      if (pat.includes("..")) continue;
      const dir = path.dirname(pat), fileGlob = path.basename(pat);
      const absDir = path.join(bookDir, dir);
      let hit = false;
      if (fs.existsSync(absDir)) {
        const rx = new RegExp("^" + fileGlob.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$", "i");
        hit = fs.readdirSync(absDir).some((f) => rx.test(f));
      }
      if (!hit) missing.push(pat);
    }
  }
  return missing;
}

const state = loadState();
const order = Object.keys(state.stages);
const isComplete = (k) => state.stages[k] && state.stages[k].status === "complete";
const firstIncomplete = order.find((k) => !isComplete(k));

// ── default: status dashboard ────────────────────────────────────────────────
if (!BEGIN && !COMPLETE) {
  console.log(`\n${C.BOLD}${state.book_title || book}${C.OFF}  ${C.DIM}(${book})${C.OFF}`);
  console.log(`${C.DIM}current_stage: ${state.current_stage} · genre: ${state.genre} · published: ${(state.human_gates || {}).published === true}${C.OFF}\n`);
  for (const k of order) {
    const st = state.stages[k].status;
    const mark = st === "complete" ? `${C.GRN}✓${C.OFF}` : st === "in_progress" ? `${C.YEL}▸${C.OFF}` : `${C.DIM}·${C.OFF}`;
    let note = "";
    const gate = GATES[k];
    if (gate && gate.gate_in && gate.gate_in.length) {
      const unmet = gate.gate_in.filter((f) => (state.human_gates || {})[f] !== true);
      if (unmet.length) note = `${C.YEL}gate: ${unmet.join(", ")} not granted${C.OFF}`;
    }
    console.log(`  ${mark} ${k.padEnd(18)} ${C.DIM}${st}${C.OFF}  ${note}`);
  }
  const v = validate();
  console.log(`\n  state: ${v.clean ? C.GRN + "valid" + C.OFF : C.RED + "INVALID — run: node scripts/validate-state.cjs " + book + C.OFF}`);
  console.log(`  next:  ${firstIncomplete ? C.CYN + firstIncomplete + C.OFF + ` — run --begin to gate-check` : C.GRN + "all stages complete" + C.OFF}\n`);
  process.exit(0);
}

// ── --begin: precondition gate for the next incomplete stage ─────────────────
if (BEGIN) {
  if (!firstIncomplete) { console.log(`${C.GRN}All stages complete — nothing to begin.${C.OFF}`); process.exit(0); }
  const stageKey = firstIncomplete;
  const problems = [];

  const v = validate();
  if (!v.clean) problems.push(`state is INVALID — resolve existing violations first:\n${v.output.split("\n").filter((l) => /CRITICAL/.test(l)).join("\n")}`);

  const gate = GATES[stageKey];
  if (gate && gate.gate_in) {
    for (const f of gate.gate_in) {
      if ((state.human_gates || {})[f] !== true) problems.push(`entry gate not granted: human_gates.${f} must be true before ${stageKey} may begin.`);
    }
  }

  console.log(`\n${C.BOLD}BEGIN gate — ${stageKey}${C.OFF}  ${C.DIM}(${book})${C.OFF}`);
  if (problems.length) {
    console.log(`${C.RED}${C.BOLD}REFUSED${C.OFF} — ${problems.length} blocker(s):`);
    problems.forEach((p) => console.log(`  ${C.RED}✗${C.OFF} ${p}`));
    console.log("");
    process.exit(1);
  }
  const agents = resolveAgents(stageKey, state);
  const req = (gate && gate.required_outputs) || [];
  console.log(`${C.GRN}CLEARED${C.OFF} — dispatch this stage:`);
  console.log(`  agents:           ${agents.length ? agents.join(" → ") : "(see manifest folder " + (manifestStage(stageKey) || {}).folder + ")"}`);
  console.log(`  required outputs: ${req.length ? req.join(", ") : "(none declared)"}`);
  console.log(`  ${C.DIM}When done, run: node scripts/advance.cjs ${book} --complete${C.OFF}\n`);
  process.exit(0);
}

// ── --complete: postcondition gate; mark the stage complete ──────────────────
if (COMPLETE) {
  if (!firstIncomplete) { console.log(`${C.GRN}All stages already complete.${C.OFF}`); process.exit(0); }
  const stageKey = firstIncomplete;
  console.log(`\n${C.BOLD}COMPLETE gate — ${stageKey}${C.OFF}  ${C.DIM}(${book})${C.OFF}`);

  const missing = outputsPresent(stageKey);
  if (missing.length) {
    console.log(`${C.RED}${C.BOLD}REFUSED${C.OFF} — required outputs not on disk:`);
    missing.forEach((m) => console.log(`  ${C.RED}✗${C.OFF} ${m}`));
    console.log(`  ${C.DIM}Produce these, then re-run --complete.${C.OFF}\n`);
    process.exit(1);
  }

  // Targeted, format-preserving status flip. Refuse if the pattern is ambiguous.
  const raw = loadRaw();
  const stageRe = new RegExp(`("${stageKey}"\\s*:\\s*\\{[^}]*?"status"\\s*:\\s*")(not_started|in_progress|pending|awaiting-human-gate)(")`);
  if (!stageRe.test(raw)) {
    console.log(`${C.YEL}Outputs present and valid, but could not safely locate ${stageKey}.status to auto-flip.${C.OFF}`);
    console.log(`  ${C.DIM}Set "${stageKey}".status to "complete" manually, then re-run validate-state.cjs.${C.OFF}\n`);
    process.exit(1);
  }
  const stamp = new Date().toISOString().slice(0, 19) + "Z";
  let updated = raw.replace(stageRe, `$1complete$3`);
  // add completed_at right after the status if not already present in that block
  updated = updated.replace(
    new RegExp(`("${stageKey}"\\s*:\\s*\\{[^}]*?"status"\\s*:\\s*"complete")(\\s*,)`),
    (m, p1, p2) => /completed_at/.test(m) ? m : `${p1}, "completed_at": "${stamp}"${p2 === "," ? "," : p2}`.replace('""', '"')
  );
  fs.writeFileSync(statePath, updated);

  const v = validate();
  if (!v.clean) {
    // roll back — never leave the state worse than we found it
    fs.writeFileSync(statePath, raw);
    console.log(`${C.RED}${C.BOLD}REFUSED${C.OFF} — marking ${stageKey} complete would violate an invariant. Rolled back.`);
    console.log(v.output.split("\n").filter((l) => /CRITICAL/.test(l)).map((l) => "  " + l).join("\n") + "\n");
    process.exit(1);
  }
  console.log(`${C.GRN}${C.BOLD}COMPLETE${C.OFF} — ${stageKey} marked complete (${stamp}); state still valid.`);
  console.log(`  ${C.DIM}Next: node scripts/advance.cjs ${book} --begin${C.OFF}\n`);
  process.exit(0);
}
