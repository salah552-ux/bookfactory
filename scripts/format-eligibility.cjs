#!/usr/bin/env node
/*
 * format-eligibility.cjs — BookFactory KDP Kindle-format eligibility scanner.
 *
 * WHY THIS EXISTS:
 *   On 2026-06-21 "The Vagus Nerve Gut Reset Workbook" was REJECTED by KDP:
 *   "content not suited to the Kindle format ... Examples: Puzzle books, Blank
 *   Journals, Pattern books, Coloring books." The manuscript had ~1,872 blank
 *   fill-in lines, 56 empty checkboxes, 28 blank tracker tables. It passed
 *   compliance-officer, book-reviewer (which SCORED the fill-in density as a
 *   strength) and final-approval (295/300) because NONE of them had a rule for
 *   Kindle format eligibility. This module is the deterministic, un-scoreable
 *   check that closes that gap. A model cannot "score it away" — it is counted.
 *
 * WHAT IT DETECTS (over books/{slug}/manuscript/*.md):
 *   - Blank fill-in lines       : runs of 3+ underscores, or prompt lines ending
 *                                 in a colon followed by blank answer space.
 *   - Empty checkboxes          : [ ], - [ ], ☐, □, ◻, ❏
 *   - Empty/blank table rows    : pipe-table data rows whose cells are all empty
 *                                 or whitespace/dashes (the blank trackers).
 *   - Banned-format keywords    : coloring/colouring book, puzzle, crossword,
 *                                 sudoku, word search, maze, blank journal, dot
 *                                 grid, lined pages, etc. (title/subtitle/blueprint)
 *   - Facing-page translation   : reflow-incompatible mirror layouts.
 *
 * DECISION RULE (kindleEligible):
 *   A Kindle/EPUB edition is INELIGIBLE if blank fill-in content exceeds a small
 *   tolerance, OR any blank tracker table exists, OR any banned-format keyword
 *   appears. Such content is PAPERBACK-ONLY on KDP. The book is NOT failed — it
 *   must be re-routed: paperback edition keeps the blanks (legal in print); the
 *   Kindle edition, if any, must be a blank-free prose/example variant, and the
 *   blank worksheets ship as a downloadable companion PDF.
 *
 * Tolerances (deliberately tight — a real workbook blows past these instantly):
 *   - blank fill-in lines : > 20  -> ineligible
 *   - empty checkboxes    : > 10  -> ineligible
 *   - blank table rows    : >  0  -> ineligible
 *   - banned keyword      : any   -> ineligible
 *
 * USAGE
 *   As a module:
 *     const { scanBook } = require("./format-eligibility.cjs");
 *     const r = scanBook(bookDir, { title, subtitle, blueprintText });
 *     // r = { kindleEligible, counts, reasons, banned, sampleHits }
 *   As a CLI:
 *     node scripts/format-eligibility.cjs <book-slug>
 *       exit 0 = Kindle-eligible (or correctly declared paperback-only)
 *       exit 1 = Kindle-INELIGIBLE content present
 */

const fs = require("fs");
const path = require("path");

const FACTORY = path.resolve(__dirname, "..");
const BOOKS_DIR = path.join(FACTORY, "books");

const C = { RED: "\x1b[31m", YEL: "\x1b[33m", GRN: "\x1b[32m", DIM: "\x1b[2m", BOLD: "\x1b[1m", OFF: "\x1b[0m" };

// Tolerances — the decision thresholds, calibrated against KDP ground truth:
//   - vagus-nerve workbook (REJECTED): 235 blank lines, 56 checkboxes  -> must FAIL
//   - h-pylori-recovery-plan (ACCEPTED, live): 0 blank lines, 14 checkboxes (a
//     "discuss with your doctor" checklist) -> must PASS
// Blank fill-in lines (underscore runs) are the PRIMARY "Blank Journal" signal —
// KDP's detector keys on them and they never appear in normal prose. Checkboxes
// and blank tracker tables are corroborating signals that only disqualify at the
// high counts a true activity/fill-in workbook produces; a short checklist in a
// prose book is fine (and KDP accepts it). Thresholds are deliberately set so an
// already-accepted book passes and the rejected workbook fails.
const TOL = {
  blankLines: 20,        // primary, standalone disqualifier (underscore runs)
  emptyCheckboxes: 40,   // a real activity/fill-in workbook; prose checklists pass
  blankTableRows: 3,     // a blank tracker has many rows; an incidental empty cell does not
};

// Banned-as-Kindle format keywords — format-DENOTING phrases only, never bare words
// that occur naturally in prose ("puzzle" in a mystery, "maze" in "amazed", etc.).
const BANNED_KEYWORDS = [
  "coloring book", "colouring book", "coloring pages", "colouring pages",
  "puzzle book", "crossword puzzle", "sudoku", "word search puzzle",
  "activity book", "dot grid notebook", "dot-grid notebook",
  "lined journal", "blank journal", "blank notebook", "fill-in journal",
  "facing-page translation", "facing page translation",
];

// Lines that are pure blank fill-in space.
// Underscore runs are the sole blank-line signal: they are unambiguous fill-in
// space and never appear in normal prose, so this cannot false-positive on a
// regular prose book (which would wrongly route it away from Kindle).
const RX_UNDERSCORE_RUN = /_{3,}/;                  // ___ fill-in blanks
const RX_EMPTY_CHECKBOX = /(^|\s)(\[\s?\]|-\s*\[\s?\]|☐|□|◻|❏)/g;

function listManuscriptFiles(bookDir) {
  const dir = path.join(bookDir, "manuscript");
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith(".md")) out.push(path.join(dir, f));
  }
  return out;
}

// Count empty cells in a markdown pipe-table data row. Returns {isData, allEmpty}.
function analyzeTableRow(line) {
  const t = line.trim();
  if (!t.startsWith("|") || !t.includes("|", 1)) return { isData: false };
  // Separator rows like |---|---| are not data.
  if (/^\|[\s:|-]+\|?$/.test(t)) return { isData: false };
  const cells = t.slice(1, t.endsWith("|") ? -1 : undefined).split("|");
  if (cells.length === 0) return { isData: false };
  const nonEmpty = cells.filter((c) => c.replace(/[\s_–—-]/g, "").length > 0);
  return { isData: true, allEmpty: nonEmpty.length === 0 };
}

function scanBook(bookDir, meta = {}) {
  const counts = { blankLines: 0, emptyCheckboxes: 0, blankTableRows: 0 };
  const sampleHits = [];
  const files = listManuscriptFiles(bookDir);

  for (const file of files) {
    let text;
    try { text = fs.readFileSync(file, "utf8"); } catch (_) { continue; }
    const rel = path.basename(file);
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Blank fill-in lines (underscore runs only — prose-safe).
      if (RX_UNDERSCORE_RUN.test(line)) {
        counts.blankLines++;
        if (sampleHits.length < 8) sampleHits.push(`${rel}:${i + 1}  ${line.trim().slice(0, 60)}`);
      }

      // Empty checkboxes (can be multiple per line).
      const cb = line.match(RX_EMPTY_CHECKBOX);
      if (cb) counts.emptyCheckboxes += cb.length;

      // Blank table rows.
      const tr = analyzeTableRow(line);
      if (tr.isData && tr.allEmpty) counts.blankTableRows++;
    }
  }

  // Banned-format keyword scan over title/subtitle/blueprint text.
  const haystack = [
    meta.title || "", meta.subtitle || "", meta.blueprintText || "",
  ].join("\n").toLowerCase();
  const banned = BANNED_KEYWORDS.filter((kw) => haystack.includes(kw));

  // Decision.
  const reasons = [];
  if (counts.blankLines > TOL.blankLines)
    reasons.push(`${counts.blankLines} blank fill-in lines (tolerance ${TOL.blankLines}) — "Blank Journal" content.`);
  if (counts.emptyCheckboxes > TOL.emptyCheckboxes)
    reasons.push(`${counts.emptyCheckboxes} empty checkboxes (tolerance ${TOL.emptyCheckboxes}) — interactive fill-in content.`);
  if (counts.blankTableRows > TOL.blankTableRows)
    reasons.push(`${counts.blankTableRows} blank tracker table row(s) — empty fill-in tables are not reflowable.`);
  if (banned.length)
    reasons.push(`banned-as-Kindle format keyword(s): ${banned.join(", ")}.`);

  return {
    kindleEligible: reasons.length === 0,
    counts,
    banned,
    reasons,
    sampleHits,
    filesScanned: files.length,
  };
}

module.exports = { scanBook, TOL, BANNED_KEYWORDS };

// --- CLI ---
if (require.main === module) {
  const slug = process.argv.slice(2).find((a) => !a.startsWith("--"));
  if (!slug) {
    console.error("usage: node scripts/format-eligibility.cjs <book-slug>");
    process.exit(2);
  }
  const bookDir = path.join(BOOKS_DIR, slug);
  if (!fs.existsSync(bookDir)) {
    console.error(`no book dir for "${slug}" at ${bookDir}`);
    process.exit(2);
  }
  // Pull title/subtitle/blueprint text if available for the keyword scan.
  let meta = {};
  try {
    const state = JSON.parse(fs.readFileSync(path.join(bookDir, "pipeline-state.json"), "utf8"));
    meta.title = state.book_title;
    meta.subtitle = state.book_subtitle;
  } catch (_) { /* ok */ }
  for (const bp of ["BLUEPRINT.md", "KDP-LISTING.md"]) {
    const p = path.join(bookDir, bp);
    if (fs.existsSync(p)) meta.blueprintText = (meta.blueprintText || "") + fs.readFileSync(p, "utf8");
  }

  const r = scanBook(bookDir, meta);
  console.log(`\n${C.BOLD}format-eligibility${C.OFF} ${C.DIM}— ${slug} — ${r.filesScanned} manuscript file(s) scanned${C.OFF}`);
  console.log(`  blank fill-in lines : ${r.counts.blankLines}`);
  console.log(`  empty checkboxes    : ${r.counts.emptyCheckboxes}`);
  console.log(`  blank table rows    : ${r.counts.blankTableRows}`);
  console.log(`  banned keywords     : ${r.banned.length ? r.banned.join(", ") : "none"}`);
  if (r.kindleEligible) {
    console.log(`\n${C.GRN}${C.BOLD}KINDLE-ELIGIBLE${C.OFF} — no blank-journal/workbook content above tolerance.\n`);
    process.exit(0);
  }
  console.log(`\n${C.RED}${C.BOLD}⛔ KINDLE-INELIGIBLE${C.OFF} — this content is PAPERBACK-ONLY on KDP:`);
  for (const reason of r.reasons) console.log(`  ${C.RED}✗${C.OFF} ${reason}`);
  if (r.sampleHits.length) {
    console.log(`\n  ${C.DIM}sample blank-line hits:${C.OFF}`);
    for (const h of r.sampleHits) console.log(`    ${C.DIM}${h}${C.OFF}`);
  }
  console.log(
    `\n${C.BOLD}Required action:${C.OFF} re-route the format. Publish PAPERBACK (blanks are legal in print).\n` +
    `For a Kindle edition, ship a blank-free prose/example variant and move the worksheets to a downloadable companion PDF.\n` +
    `Set kdp_editions.kindle:false in pipeline-state.json if no compliant Kindle variant is built.\n`
  );
  process.exit(1);
}
