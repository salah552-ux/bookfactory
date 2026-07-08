#!/usr/bin/env node
/*
 * self-heal.cjs — BookFactory auto-repair engine (the "immune system" repair stage).
 *
 * The four-stage immune loop is: pre-flight DETECTS -> self-heal REPAIRS ->
 * WRITER-REGRESSION-TEST VERIFIES (after prompt-level repairs) -> LESSONS.md LEARNS.
 * This script owns the REPAIR stage. It fixes only mechanically-safe, evidence-based
 * fault classes and REPORTS everything else — it never guesses, never edits state
 * JSON, never touches a manuscript, never modifies an image, and never deletes.
 *
 * AUTO-REPAIR (classes 1-3, applied on a normal run):
 *   1. Unquoted agent descriptions — the silent-drop bug class. An unquoted YAML
 *      `description:` that contains a colon-space ("Foo: bar") is parsed as a nested
 *      mapping, the frontmatter fails, and Claude Code SILENTLY drops the agent from
 *      the registry (this bit 6 agents incl. kdp-upload-agent — see LESSONS.md
 *      2026-06-29). We auto-quote ONLY that evidence-based fault (unquoted AND
 *      colon-space), byte-for-byte. Unquoted-but-safe descriptions (no colon-space)
 *      parse fine and are LEFT UNTOUCHED — quoting them would be cosmetic churn and
 *      would violate the additive-only contract this engine works under.
 *   2. Stale user-level agent mirror — if any canonical project agent is newer than
 *      its %USERPROFILE%/.claude/agents/bf-*.md counterpart (or the counterpart is
 *      missing), run scripts/sync-agents-to-user.py once (its sanctioned behavior).
 *   3. Missing run ledgers — every books/<slug>/ with a pipeline-state.json but no
 *      RUN-LEDGER.md gets a fresh minimal ledger created (additive).
 *
 * REPORT-ONLY (classes 4-6, never auto-edited):
 *   4. Corrupt state/manifest JSON  -> CRITICAL (quarantine; never auto-edit).
 *   5. Cover JPEG missing JFIF APP0 -> WARN (see LESSONS.md JFIF lesson).
 *   6. Undersized Kindle EPUB       -> WARN (cover likely missing from build).
 *
 * Usage:
 *   node scripts/self-heal.cjs            # apply classes 1-3, report 4-6
 *   node scripts/self-heal.cjs --dry-run  # print what WOULD be fixed; write nothing
 *
 * Exit code: 0 = no CRITICAL remains after repairs. 1 = at least one CRITICAL.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const FACTORY = path.resolve(__dirname, "..");
const AGENTS_DIR = path.join(FACTORY, ".claude", "agents");
const BOOKS_DIR = path.join(FACTORY, "books");
const MANIFEST_PATH = path.join(FACTORY, ".claude", "agents", "PIPELINE-MANIFEST.json");
const LOG_PATH = path.join(FACTORY, "automation", "reports", "self-heal-log.md");
const USERPROFILE = process.env.USERPROFILE || os.homedir();
const MIRROR_DIR = path.join(USERPROFILE, ".claude", "agents");
const EPUB_MIN_BYTES = 500 * 1024; // Kindle EPUB gate — mirrors validate-state INV-10 / build-manuscript.sh

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");

const C = { RED: "\x1b[31m", YEL: "\x1b[33m", GRN: "\x1b[32m", CYA: "\x1b[36m", DIM: "\x1b[2m", BOLD: "\x1b[1m", OFF: "\x1b[0m" };

const fixes = [];     // {cls, msg}   — repairs applied (or would-apply in dry-run)
const warnings = [];  // {cls, msg}
const criticals = []; // {cls, msg}
const infos = [];     // {cls, msg}   — non-actionable context

function nowStamp() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

// --- log: append one line per applied fix (real runs only; created if absent) ---
let logInitialised = false;
function appendLog(cls, detail) {
  if (DRY_RUN) return;
  try {
    if (!logInitialised && !fs.existsSync(LOG_PATH)) {
      fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
      fs.writeFileSync(
        LOG_PATH,
        "# self-heal log\n\nAppend-only. One line per auto-repair applied by `scripts/self-heal.cjs`.\n\n"
      );
    }
    logInitialised = true;
    fs.appendFileSync(LOG_PATH, `- ${nowStamp()} · ${cls} · ${detail}\n`);
  } catch (_) { /* logging must never crash a repair run */ }
}

// --- recursive .md walk for the agents tree ---
function walkMd(dir) {
  const out = [];
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return out; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkMd(p));
    else if (e.isFile() && e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

// Extract the frontmatter block (between the first two `---` lines) or null.
function frontmatter(content) {
  const lines = content.split(/\r?\n/);
  if (!lines.length || lines[0].trim() !== "---") return null;
  const end = lines.slice(1).findIndex((l) => l.trim() === "---");
  if (end === -1) return null;
  return { startIdx: 1, endIdx: end + 1 };
}

// Return the frontmatter `name:` value (real agents only) or null.
function agentName(content) {
  const fm = frontmatter(content);
  if (!fm) return null;
  const lines = content.split(/\r?\n/);
  let name = null, hasDesc = false;
  for (let i = fm.startIdx; i < fm.endIdx; i++) {
    const nm = lines[i].match(/^name:\s*(\S.*?)\s*$/);
    if (nm) name = nm[1];
    if (/^description:\s*\S/.test(lines[i])) hasDesc = true;
  }
  return name && hasDesc ? name : null;
}

// ============================================================================
// CLASS 1 — unquoted agent descriptions (silent-drop bug class)
// ============================================================================
function healDescriptions() {
  let unquotedBenign = 0;
  for (const file of walkMd(AGENTS_DIR)) {
    let content;
    try { content = fs.readFileSync(file, "utf8"); } catch (_) { continue; }
    const fm = frontmatter(content);
    if (!fm) continue;

    // Match the description line inside the frontmatter only.
    const m = content.match(/^(description:[ \t]+)(.*)$/m);
    if (!m) continue;
    const prefix = m[1];
    const value = m[2]; // JS `.` excludes \r, so CRLF is preserved outside the match

    if (value === "") continue;                       // block scalar / empty — leave alone
    const first = value[0];
    if (first === '"' || first === "'") continue;     // already quoted
    if (first === "|" || first === ">") continue;      // YAML block scalar — must not wrap

    // Unquoted. Only the colon-space form is the actual parse fault.
    if (!/:\s/.test(value)) { unquotedBenign++; continue; }

    const rel = path.relative(FACTORY, file);
    const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const newLine = `${prefix}"${escaped}"`;

    if (DRY_RUN) {
      fixes.push({ cls: "class-1", msg: `WOULD quote unquoted description (colon-space fault) in ${rel}` });
    } else {
      try {
        fs.writeFileSync(file, content.replace(m[0], newLine));
        fixes.push({ cls: "class-1", msg: `quoted unquoted description (colon-space fault) in ${rel}` });
        appendLog("class-1", `quoted description in ${rel}`);
      } catch (e) {
        criticals.push({ cls: "class-1", msg: `failed to write quoted description to ${rel}: ${e.message}` });
      }
    }
  }
  if (unquotedBenign > 0) {
    infos.push({
      cls: "class-1",
      msg: `${unquotedBenign} unquoted description(s) have no colon-space and parse fine — left untouched (evidence-based scope; additive-only).`,
    });
  }
}

// ============================================================================
// CLASS 2 — stale user-level agent mirror
// ============================================================================
function healMirror() {
  // Build the canonical agent set, deduped by name (path-sorted, first wins) —
  // exactly how sync-agents-to-user.py selects, so the deduped novel-writer
  // redirect stub does not false-trigger a sync every run.
  const files = walkMd(AGENTS_DIR).sort((a, b) => a.localeCompare(b));
  const seen = new Set();
  const reasons = [];
  for (const file of files) {
    let content;
    try { content = fs.readFileSync(file, "utf8"); } catch (_) { continue; }
    const name = agentName(content);
    if (!name || seen.has(name)) continue; // not an agent, or a duplicate name (skipped by sync)
    seen.add(name);

    const stage = path.basename(path.dirname(file));
    const counterpart = path.join(MIRROR_DIR, `bf-${stage}-${path.basename(file)}`);
    let stale = false, why = "";
    if (!fs.existsSync(counterpart)) { stale = true; why = "mirror missing"; }
    else {
      try {
        if (fs.statSync(file).mtimeMs > fs.statSync(counterpart).mtimeMs) { stale = true; why = "source newer than mirror"; }
      } catch (_) { /* ignore stat errors */ }
    }
    if (stale) reasons.push(`${path.relative(FACTORY, file)} (${why})`);
  }

  if (reasons.length === 0) {
    infos.push({ cls: "class-2", msg: `user agent mirror is up to date (${seen.size} agents).` });
    return;
  }

  const sample = reasons.slice(0, 3).join("; ") + (reasons.length > 3 ? ` (+${reasons.length - 3} more)` : "");
  if (DRY_RUN) {
    fixes.push({ cls: "class-2", msg: `WOULD run sync-agents-to-user.py — ${reasons.length} stale mirror(s): ${sample}` });
    return;
  }

  // Run the sanctioned sync once, trying the common python launchers.
  const candidates = ["python", "py", "python3"];
  let ran = false, out = "";
  for (const py of candidates) {
    try {
      out = execFileSync(py, ["scripts/sync-agents-to-user.py"], { cwd: FACTORY, encoding: "utf8" });
      ran = true;
      break;
    } catch (e) {
      if (e && e.code === "ENOENT") continue; // launcher not found — try next
      out = (e.stdout || "") + (e.stderr || "") + (e.message || "");
      ran = true; // it ran but errored — surface it
      break;
    }
  }
  if (ran) {
    fixes.push({ cls: "class-2", msg: `ran sync-agents-to-user.py (${reasons.length} stale mirror(s))` });
    appendLog("class-2", `ran sync-agents-to-user.py; ${reasons.length} stale mirror(s)`);
    for (const line of out.split(/\r?\n/)) if (line.trim()) infos.push({ cls: "class-2", msg: `sync: ${line.trim()}` });
  } else {
    warnings.push({ cls: "class-2", msg: `mirror is stale but no python launcher found (tried ${candidates.join(", ")}) — run scripts/sync-agents-to-user.py manually.` });
  }
}

// ============================================================================
// CLASS 3 — missing run ledgers
// ============================================================================
function healRunLedgers() {
  let books;
  try { books = fs.readdirSync(BOOKS_DIR); } catch (_) { return; }
  for (const slug of books) {
    const bookDir = path.join(BOOKS_DIR, slug);
    if (!fs.existsSync(path.join(bookDir, "pipeline-state.json"))) continue;
    const ledger = path.join(bookDir, "RUN-LEDGER.md");
    if (fs.existsSync(ledger)) continue;

    const date = nowStamp().slice(0, 10);
    // Minimal header: slug title + created-by note + the standard event-table header
    // rows (exact column format from books/the-7-day-gut-reset/RUN-LEDGER.md).
    const body =
      `# RUN-LEDGER — ${slug}\n\n` +
      "Append-only orchestrator ledger. One line per event: `timestamp · stage · agent · action · result · retry · next-step`.\n" +
      "Anything marked COMPLETE here is DONE — never re-dispatch it. On resume: read this first, then pipeline-state.json, then `git log`, then validate-state + pre-stage-gate.\n\n" +
      `_Created by self-heal ${date}._\n\n` +
      "---\n\n" +
      "## Ledger\n\n" +
      "| # | timestamp | stage | agent/actor | action | result | retry | next-step |\n" +
      "|---|-----------|-------|-------------|--------|--------|-------|-----------|\n";

    const rel = path.relative(FACTORY, ledger);
    if (DRY_RUN) {
      fixes.push({ cls: "class-3", msg: `WOULD create ${rel}` });
    } else {
      try {
        fs.writeFileSync(ledger, body);
        fixes.push({ cls: "class-3", msg: `created ${rel}` });
        appendLog("class-3", `created ${rel}`);
      } catch (e) {
        criticals.push({ cls: "class-3", msg: `failed to create ${rel}: ${e.message}` });
      }
    }
  }
}

// ============================================================================
// CLASS 4 — corrupt state/manifest JSON (report-only CRITICAL)
// ============================================================================
function checkJson() {
  const targets = [];
  let books;
  try { books = fs.readdirSync(BOOKS_DIR); } catch (_) { books = []; }
  for (const slug of books) {
    const p = path.join(BOOKS_DIR, slug, "pipeline-state.json");
    if (fs.existsSync(p)) targets.push(p);
  }
  if (fs.existsSync(MANIFEST_PATH)) targets.push(MANIFEST_PATH);

  for (const p of targets) {
    try {
      JSON.parse(fs.readFileSync(p, "utf8"));
    } catch (e) {
      criticals.push({ cls: "class-4", msg: `corrupt JSON (NOT auto-edited — quarantine): ${path.relative(FACTORY, p)} — ${e.message}` });
    }
  }
}

// ============================================================================
// CLASS 5 — cover JPEG missing JFIF APP0 header (report-only WARN)
// ============================================================================
function checkCovers() {
  let books;
  try { books = fs.readdirSync(BOOKS_DIR); } catch (_) { return; }
  for (const slug of books) {
    const finalDir = path.join(BOOKS_DIR, slug, "exports", "final");
    let entries;
    try { entries = fs.readdirSync(finalDir); } catch (_) { continue; }
    for (const f of entries) {
      if (!/^cover-kdp.*\.jpg$/i.test(f)) continue;
      const p = path.join(finalDir, f);
      const buf = Buffer.alloc(4);
      try {
        const fd = fs.openSync(p, "r");
        const n = fs.readSync(fd, buf, 0, 4, 0);
        fs.closeSync(fd);
        if (n < 4) continue;
      } catch (_) { continue; }
      // SOI = ff d8. JFIF APP0 = ff e0 immediately after. ff d8 without ff e0 -> no JFIF.
      const isJpeg = buf[0] === 0xff && buf[1] === 0xd8;
      const hasJfif = buf[2] === 0xff && buf[3] === 0xe0;
      if (isJpeg && !hasJfif) {
        const hex = [...buf].map((b) => b.toString(16).padStart(2, "0")).join(" ");
        warnings.push({
          cls: "class-5",
          msg: `${path.relative(FACTORY, p)} starts ${hex} — JPEG without JFIF APP0; pandoc may reject the cover. Fix per intelligence/LESSONS.md JFIF lesson (inject ff e0 APP0 segment). NOT modified here.`,
        });
      }
    }
  }
}

// ============================================================================
// CLASS 6 — undersized Kindle EPUB (report-only WARN)
// ============================================================================
function checkEpubs() {
  let books;
  try { books = fs.readdirSync(BOOKS_DIR); } catch (_) { return; }
  for (const slug of books) {
    const epub = path.join(BOOKS_DIR, slug, "exports", "final", "manuscript-kdp.epub");
    if (!fs.existsSync(epub)) continue;

    // Only enforce when a Kindle edition is declared (kdp_editions.kindle !== false).
    let kindleDeclared = true;
    try {
      const state = JSON.parse(fs.readFileSync(path.join(BOOKS_DIR, slug, "pipeline-state.json"), "utf8"));
      if (state.kdp_editions && state.kdp_editions.kindle === false) kindleDeclared = false;
    } catch (_) { /* corrupt/missing state handled by class 4; assume kindle declared */ }
    if (!kindleDeclared) continue;

    let size;
    try { size = fs.statSync(epub).size; } catch (_) { continue; }
    if (size < EPUB_MIN_BYTES) {
      warnings.push({
        cls: "class-6",
        msg: `${path.relative(FACTORY, epub)} is ${(size / 1024).toFixed(0)}KB (< 500KB) — cover likely missing from the build. Rebuild with cover via build-manuscript.sh. NOT modified here.`,
      });
    }
  }
}

// ============================================================================
// RUN
// ============================================================================
console.log(`\n${C.BOLD}BookFactory — Self-Heal Engine${C.OFF}${DRY_RUN ? `  ${C.CYA}[DRY RUN — no writes]${C.OFF}` : ""}`);
console.log(`${C.DIM}repair stage of the immune loop · ${nowStamp()}${C.OFF}\n`);

// AUTO-REPAIR classes 1-3
healDescriptions();
healMirror();
healRunLedgers();
// REPORT-ONLY classes 4-6
checkJson();
checkCovers();
checkEpubs();

// --- render ---
if (fixes.length) {
  console.log(`${C.BOLD}Repairs ${DRY_RUN ? "(would apply)" : "applied"}${C.OFF}`);
  for (const f of fixes) console.log(`  ${C.GRN}${DRY_RUN ? "○" : "✓"}${C.OFF} [${f.cls}] ${f.msg}`);
  console.log("");
}
if (criticals.length) {
  console.log(`${C.BOLD}Criticals${C.OFF}`);
  for (const c of criticals) console.log(`  ${C.RED}${C.BOLD}✗ CRITICAL${C.OFF} [${c.cls}] ${c.msg}`);
  console.log("");
}
if (warnings.length) {
  console.log(`${C.BOLD}Warnings (report-only)${C.OFF}`);
  for (const w of warnings) console.log(`  ${C.YEL}! WARN${C.OFF} [${w.cls}] ${w.msg}`);
  console.log("");
}
if (infos.length) {
  console.log(`${C.DIM}Notes${C.OFF}`);
  for (const i of infos) console.log(`  ${C.DIM}· [${i.cls}] ${i.msg}${C.OFF}`);
  console.log("");
}

// --- summary block ---
const verb = DRY_RUN ? "would apply" : "applied";
console.log(`${C.BOLD}Summary${C.OFF}`);
console.log(`  fixes ${verb}: ${fixes.length}`);
console.log(`  warnings:      ${warnings.length}`);
console.log(`  criticals:     ${criticals.length}`);
const ok = criticals.length === 0;
console.log(`\n${ok ? C.GRN + "PASS" + C.OFF : C.RED + C.BOLD + "FAIL" + C.OFF} — ${criticals.length} critical(s) ${ok ? "— no CRITICAL remains" : "remain"} after repairs`);
console.log(`${C.CYA}Next: run node scripts/preflight.cjs to verify.${C.OFF}\n`);

process.exit(ok ? 0 : 1);
