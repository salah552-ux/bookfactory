#!/usr/bin/env node
/*
 * preflight.cjs — BookFactory factory-readiness pre-flight check.
 *
 * ONE command that verifies the whole factory is runnable BEFORE any expensive
 * pipeline run. It is intent-independent: it checks the RESULT on disk (agent
 * registry, manifest, intelligence freshness, learning memory, reference files,
 * per-book state, build tooling, scheduler, shipped artifacts) so it catches a
 * broken factory no matter how it got broken. Read-only — it never writes,
 * builds, or dispatches anything.
 *
 * Usage:
 *   node scripts/preflight.cjs        # run every check, print the report
 *
 * Severity model (matches validate-state.cjs):
 *   CRITICAL — the factory cannot be trusted to run; blocks the verdict.
 *   WARN     — degraded / informational; does not block, but worth knowing.
 *
 * Exit code: 0 = no CRITICAL failures (PREFLIGHT: GO).
 *            1 = at least one CRITICAL failure (PREFLIGHT: NO-GO).
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const FACTORY = path.resolve(__dirname, "..");
const AGENTS_DIR = path.join(FACTORY, ".claude", "agents");
const MANIFEST_PATH = path.join(AGENTS_DIR, "PIPELINE-MANIFEST.json");
const INTEL_DIR = path.join(FACTORY, "intelligence");
const BOOKS_DIR = path.join(FACTORY, "books");

const C = { RED: "\x1b[31m", YEL: "\x1b[33m", GRN: "\x1b[32m", DIM: "\x1b[2m", BOLD: "\x1b[1m", OFF: "\x1b[0m" };

const DAY = 86400000;
const HOME = process.env.USERPROFILE || process.env.HOME || "";
const MIRROR_DIR = HOME ? path.join(HOME, ".claude", "agents") : "";
const EXPECTED_AGENT_COUNT = 55; // documented baseline; drift only warns

let criticals = 0;
let warns = 0;

// ---- output helpers ---------------------------------------------------------
function section(n, title) {
  console.log(`\n${C.BOLD}${n}. ${title}${C.OFF}`);
}
function ok(label, detail) {
  console.log(`  ${C.GRN}✓${C.OFF} ${label}${detail ? ` ${C.DIM}— ${detail}${C.OFF}` : ""}`);
}
function warn(label, detail) {
  warns++;
  console.log(`  ${C.YEL}✗ WARN${C.OFF} ${label}${detail ? ` — ${detail}` : ""}`);
}
function crit(label, detail) {
  criticals++;
  console.log(`  ${C.RED}${C.BOLD}✗ CRITICAL${C.OFF} ${label}${detail ? ` — ${detail}` : ""}`);
}

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function ageDays(p) {
  return (Date.now() - fs.statSync(p).mtimeMs) / DAY;
}
function walkMd(dir) {
  const out = [];
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return out; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkMd(full));
    else if (e.isFile() && e.name.endsWith(".md")) out.push(full);
  }
  return out;
}
// Extract the YAML frontmatter block (text between the first two `---` fences).
function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : null;
}

// ---- 1. Agent registry safety ----------------------------------------------
section(1, "Agent registry safety");
{
  const files = walkMd(AGENTS_DIR);
  let nameBearing = 0;
  let unquotedSafe = 0;
  const silentDrop = []; // {file, reason}
  // A YAML plain scalar is silently mis-parsed (agent dropped) when it contains
  // a colon-space ": " or starts with an indicator character. A double-quoted
  // value is always safe. This is the exact bug class from the 2026 registry
  // overflow (unquoted description with colon-space silently dropping agents).
  const INDICATOR = /^[-?:,\[\]{}#&*!|>'"%@`]/;
  for (const f of files) {
    let fm;
    try { fm = frontmatter(fs.readFileSync(f, "utf8")); } catch (_) { continue; }
    if (!fm) continue;
    if (!/^name:\s*\S/m.test(fm)) continue; // not a dispatchable agent
    nameBearing++;
    const dm = fm.match(/^description:\s*(.*)$/m);
    const rel = path.relative(FACTORY, f);
    if (!dm || dm[1].trim() === "") {
      silentDrop.push({ rel, reason: "no description on a named agent" });
      continue;
    }
    const val = dm[1].trim();
    if (val.startsWith('"')) continue; // double-quoted → safe
    if (val.includes(": ") || INDICATOR.test(val)) {
      silentDrop.push({ rel, reason: "unquoted description with colon-space / indicator — YAML silent-drop (agent will not load)" });
    } else {
      unquotedSafe++; // plain scalar, no colon-space — loads fine, but quoting is the guard
    }
  }
  if (silentDrop.length === 0) {
    ok(`${nameBearing} agent files parsed, none at silent-drop risk`, `${nameBearing - unquotedSafe}/${nameBearing} descriptions double-quoted; ${unquotedSafe} plain but colon-space-free`);
  } else {
    for (const s of silentDrop) crit(`${s.rel}`, s.reason);
  }

  // Mirror drift: %USERPROFILE%/.claude/agents/bf-*.md vs project agent count.
  let mirrorCount = null;
  try {
    mirrorCount = fs.readdirSync(MIRROR_DIR).filter((f) => /^bf-.*\.md$/.test(f)).length;
  } catch (_) { mirrorCount = null; }
  if (mirrorCount === null) {
    warn("Home-directory agent mirror not found", `${MIRROR_DIR || "(no home dir)"} — cannot verify dispatch mirror`);
  } else if (mirrorCount !== nameBearing) {
    warn("Agent mirror drift", `project has ${nameBearing} named agents, mirror bf-*.md has ${mirrorCount} (expected ~${EXPECTED_AGENT_COUNT}) — re-sync the home mirror`);
  } else {
    ok("Agent mirror in sync", `${mirrorCount} bf-*.md files match ${nameBearing} project agents`);
  }
}

// ---- 2. Manifest integrity --------------------------------------------------
section(2, "Manifest integrity");
{
  if (!fs.existsSync(MANIFEST_PATH)) {
    crit("PIPELINE-MANIFEST.json missing", path.relative(FACTORY, MANIFEST_PATH));
  } else {
    try {
      const m = readJSON(MANIFEST_PATH);
      if (m.gates && typeof m.gates === "object" && !Array.isArray(m.gates)) {
        ok("PIPELINE-MANIFEST.json valid", `parses as JSON, ${Object.keys(m.gates).length} gate(s) defined`);
      } else {
        crit("PIPELINE-MANIFEST.json has no 'gates' object", "manifest present but the gates contract is missing");
      }
    } catch (e) {
      crit("PIPELINE-MANIFEST.json does not parse", e.message);
    }
  }
}

// ---- 3. Intelligence freshness (RULE 0B) -----------------------------------
section(3, "Intelligence freshness");
{
  const harvested = path.join(INTEL_DIR, "harvested.json");
  if (!fs.existsSync(harvested)) {
    crit("intelligence/harvested.json missing", "RULE 0B intelligence gate cannot pass");
  } else {
    const age = ageDays(harvested);
    if (age > 30) crit("intelligence/harvested.json is stale", `${age.toFixed(1)} days old (RULE 0B limit: 30) — re-run harvester-agent`);
    else ok("intelligence/harvested.json fresh", `${age.toFixed(1)} days old (limit 30)`);
  }
  const algo = path.join(INTEL_DIR, "ALGO-INTELLIGENCE.md");
  if (!fs.existsSync(algo)) {
    warn("intelligence/ALGO-INTELLIGENCE.md missing", "algorithm knowledge doc absent");
  } else {
    const age = ageDays(algo);
    if (age > 45) warn("intelligence/ALGO-INTELLIGENCE.md is stale", `${age.toFixed(1)} days old (limit 45) — run algo-intelligence-agent`);
    else ok("intelligence/ALGO-INTELLIGENCE.md fresh", `${age.toFixed(1)} days old (limit 45)`);
  }
}

// ---- 4. Learning memory present --------------------------------------------
section(4, "Learning memory");
{
  const lessons = path.join(INTEL_DIR, "LESSONS.md");
  if (!fs.existsSync(lessons)) {
    warn("intelligence/LESSONS.md missing", "cross-book learning memory absent");
  } else {
    const txt = fs.readFileSync(lessons, "utf8");
    const evidence = (txt.match(/\*Evidence:\*/g) || []).length;
    if (evidence >= 1) ok("intelligence/LESSONS.md present", `${evidence} evidence-cited lesson(s)`);
    else warn("intelligence/LESSONS.md has no evidence lines", "expected at least 1 '*Evidence:*' entry");
  }
}

// ---- 5. Core reference files present ----------------------------------------
section(5, "Core reference files");
{
  const refs = [
    "03-writing/HEALTH-VOICE-BIBLE.md",
    "03-writing/FICTION-VOICE-BIBLE.md",
    "03-writing/BUSINESS-VOICE-BIBLE.md",
    "01-research/BESTSELLER-DNA-PROTOCOL.md",
    "06-production/COVER-PSYCHOLOGY.md",
  ];
  let missing = 0;
  for (const r of refs) {
    if (!fs.existsSync(path.join(AGENTS_DIR, r))) { crit("Reference file missing", `.claude/agents/${r}`); missing++; }
  }
  if (missing === 0) ok("All core reference files present", `${refs.length}/${refs.length} found`);
}

// ---- 6. Per-book state sanity ----------------------------------------------
section(6, "Per-book state sanity");
{
  let slugs = [];
  try {
    slugs = fs.readdirSync(BOOKS_DIR).filter((d) => fs.existsSync(path.join(BOOKS_DIR, d, "pipeline-state.json")));
  } catch (_) { /* no books dir */ }
  let corrupt = 0;
  for (const slug of slugs) {
    try { readJSON(path.join(BOOKS_DIR, slug, "pipeline-state.json")); }
    catch (e) { crit(`${slug}/pipeline-state.json corrupt`, e.message); corrupt++; }
  }
  if (corrupt === 0 && slugs.length) ok("All pipeline-state.json parse", `${slugs.length} book(s)`);
  else if (!slugs.length) warn("No book pipeline-state.json files found", BOOKS_DIR);

  // Delegate invariant validation to the existing validator (hook-mode semantics:
  // active books only; emits a decision:block JSON when active books have CRITICALs).
  const vs = path.join(FACTORY, "scripts", "validate-state.cjs");
  if (fs.existsSync(vs)) {
    const r = spawnSync(process.execPath, [vs, "--hook"], { cwd: FACTORY, encoding: "utf8" });
    if (r.error) {
      warn("validate-state.cjs could not run", r.error.message);
    } else {
      const out = (r.stdout || "").trim();
      if (out.includes('"decision":"block"') || out.includes('"decision": "block"')) {
        let reason = "";
        try { reason = (JSON.parse(out).reason || "").split("\n")[0]; } catch (_) {}
        crit("validate-state.cjs reports active-book invariant violations", reason || "run `node scripts/validate-state.cjs` for detail");
      } else {
        ok("validate-state.cjs --hook clean", `exit ${r.status} — no active-book CRITICALs`);
      }
    }
  } else {
    warn("scripts/validate-state.cjs not found", "cannot delegate invariant validation");
  }
}

// ---- 7. Build tooling -------------------------------------------------------
section(7, "Build tooling");
{
  function hasTool(cmd) {
    const r = spawnSync(cmd, ["--version"], { shell: true, encoding: "utf8", timeout: 15000 });
    return !r.error && r.status === 0;
  }
  const tools = [
    { name: "bash", severity: "warn" },
    { name: "pandoc", severity: "crit" }, // builds fail without pandoc
    { name: "node", severity: "warn" },
  ];
  for (const t of tools) {
    if (hasTool(t.name)) ok(`${t.name} on PATH`, "resolvable");
    else if (t.severity === "crit") crit(`${t.name} not found on PATH`, "builds (build-manuscript.sh) will fail");
    else warn(`${t.name} not found on PATH`, "required for pipeline builds");
  }
}

// ---- 8. Scheduler -----------------------------------------------------------
section(8, "Scheduler");
{
  const TASK = "BookFactory Weekly Heartbeat";
  const r = spawnSync("schtasks", ["/query", "/tn", TASK, "/v", "/fo", "LIST"], { shell: true, encoding: "utf8", timeout: 15000 });
  if (r.error || r.status !== 0) {
    warn(`Windows task "${TASK}" not found`, "weekly heartbeat is not scheduled");
  } else {
    const m = (r.stdout || "").match(/Last Result:\s*([-\dxA-Fa-f]+)/);
    if (m) {
      const code = parseInt(m[1], m[1].toLowerCase().startsWith("0x") ? 16 : 10);
      if (Number.isNaN(code) || code === 0) ok(`Windows task "${TASK}" present`, "last result 0 (OK)");
      else warn(`Windows task "${TASK}" last run failed`, `Last Result=${m[1]}`);
    } else {
      ok(`Windows task "${TASK}" present`, "scheduled (no last-result field parsed)");
    }
  }
}

// ---- 9. Disk artifacts (live books) ----------------------------------------
section(9, "Disk artifacts (live books)");
{
  let slugs = [];
  try { slugs = fs.readdirSync(BOOKS_DIR).filter((d) => fs.existsSync(path.join(BOOKS_DIR, d, "pipeline-state.json"))); } catch (_) {}
  let live = 0;
  for (const slug of slugs) {
    let state;
    try { state = readJSON(path.join(BOOKS_DIR, slug, "pipeline-state.json")); } catch (_) { continue; }
    if (!(state.human_gates && state.human_gates.published === true)) continue;
    live++;
    const epub = path.join(BOOKS_DIR, slug, "exports", "final", "manuscript-kdp.epub");
    if (!fs.existsSync(epub)) {
      warn(`${slug} — shipped EPUB missing`, "exports/final/manuscript-kdp.epub not on disk");
    } else {
      const kb = fs.statSync(epub).size / 1024;
      if (kb < 500) warn(`${slug} — shipped EPUB undersized`, `${kb.toFixed(0)}KB (< 500KB)`);
      else ok(`${slug} — shipped EPUB OK`, `${kb.toFixed(0)}KB`);
    }
  }
  if (live === 0) ok("No live (published) books to check", "informational");
}

// ---- 10. Post-launch loop (live books) --------------------------------------
section(10, "Post-launch loop (live books)");
{
  let audit = null;
  try { audit = require("./postlaunch-audit.cjs"); }
  catch (e) { crit("Post-launch hard gate cannot run — postlaunch-audit.cjs failed to load", e.message); }
  if (audit) {
    const results = audit.auditLiveBooks(BOOKS_DIR);
    if (results.length === 0) {
      ok("Every live book has fresh sourced observations + recorded activation");
    } else {
      for (const r of results) {
        for (const f of r.findings) {
          if (f.level === "CRITICAL") crit(`${r.slug} [${f.code}]`, f.msg);
          else warn(`${r.slug} [${f.code}]`, f.msg);
        }
      }
    }
  }
}

// ---- summary ----------------------------------------------------------------
const go = criticals === 0;
console.log(`\n${C.BOLD}────────────────────────────────────────${C.OFF}`);
console.log(`${C.BOLD}Summary:${C.OFF} ${C.RED}${criticals} critical${C.OFF}, ${C.YEL}${warns} warning${C.OFF}`);
console.log(
  go
    ? `${C.GRN}${C.BOLD}PREFLIGHT: GO${C.OFF} — factory is runnable${warns ? ` (${warns} warning(s) noted)` : ""}`
    : `${C.RED}${C.BOLD}PREFLIGHT: NO-GO${C.OFF} — ${criticals} critical failure(s) must be fixed before any pipeline run`
);
console.log("");
process.exit(go ? 0 : 1);
