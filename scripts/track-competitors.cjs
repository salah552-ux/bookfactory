#!/usr/bin/env node
/*
 * track-competitors.cjs — our Keepa-lite. Reads intelligence/competitor-
 * watchlist.json (real competitor ASINs sourced verbatim from an existing
 * opportunity analysis report — see that file's header) and, for each ASIN,
 * fetches a fresh public BSR/review reading, appending one JSON line per
 * observation to intelligence/rank-history.jsonl. Run weekly to build a
 * free competitor BSR time-series with zero API cost.
 *
 * Reuses scripts/fetch-live-baseline.cjs for the actual network fetch +
 * parse (stdlib https, Playwright Tier-2 fallback, ZERO TOLERANCE parsing
 * — never invents a number). That script exports only its pure classifier
 * functions (parseBaseline, buildLoggerArgs, decideAndFallback), not a
 * network-facing fetchBaseline — so per the task's own fallback clause,
 * this script SPAWNS it as a child process per ASIN (`node
 * fetch-live-baseline.cjs <asin> <marketplace>`, no --log — this is the
 * intelligence layer, not a book's pipeline-state.json) and reads its
 * single JSON stdout line, rather than duplicating its network/fallback
 * logic here.
 *
 * ZERO TOLERANCE: a per-ASIN failure (spawn error, unparseable child
 * output, thrown fetcher) is never skipped silently — it is recorded as
 * its own FETCH_FAILED observation line. A failure IS an observation.
 * Skip-and-continue applies to the REST of the run, never to logging the
 * failure itself.
 *
 * Usage:
 *   node scripts/track-competitors.cjs [--niche <name>]
 *     --niche <name>: only track ASINs under that niche in the watchlist
 *                      (default: every niche in the watchlist).
 *
 * Rate limit: at least 2000ms between any two ASIN fetches in a run.
 *
 * Writes: intelligence/rank-history.jsonl (APPEND-ONLY — one JSON line per
 *         observation: {date, niche, asin, title, marketplace, bsr_main,
 *         sub_ranks, reviews, no_bsr_line, status, source}). Never rewrites
 *         or deletes an existing line.
 *
 * Module exports (for tests — no network involved): { validateWatchlist,
 * buildLine, appendObservation, runTrackCompetitors, fetchViaChild }.
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const RATE_LIMIT_MS = 2000;
const VALID_MARKETPLACES = ["com", "co.uk"];

// ---------------------------------------------------------------------------
// validateWatchlist — pure, testable schema validation. Never mutates,
// never throws — returns { valid, errors }.
// ---------------------------------------------------------------------------
function validateWatchlist(watchlist) {
  const errors = [];
  if (!watchlist || typeof watchlist !== "object") {
    return { valid: false, errors: ["watchlist root must be an object"] };
  }
  if (!watchlist.niches || typeof watchlist.niches !== "object") {
    return { valid: false, errors: ["watchlist.niches must be an object"] };
  }

  for (const [nicheName, nicheEntry] of Object.entries(watchlist.niches)) {
    const nloc = `niches.${nicheName}`;
    if (!nicheEntry || typeof nicheEntry !== "object") {
      errors.push(`${nloc} must be an object`);
      continue;
    }
    if (!VALID_MARKETPLACES.includes(nicheEntry.marketplace)) {
      errors.push(`${nloc}.marketplace must be "com" or "co.uk" (got ${JSON.stringify(nicheEntry.marketplace)})`);
    }
    if (!Array.isArray(nicheEntry.asins)) {
      errors.push(`${nloc}.asins must be an array`);
      continue;
    }
    nicheEntry.asins.forEach((entry, i) => {
      const loc = `${nloc}.asins[${i}]`;
      if (!entry || typeof entry !== "object") {
        errors.push(`${loc} must be an object`);
        return;
      }
      if (typeof entry.asin !== "string" || !entry.asin.trim()) errors.push(`${loc}.asin must be a non-empty string`);
      if (typeof entry.title !== "string" || !entry.title.trim()) errors.push(`${loc}.title must be a non-empty string`);
      if (typeof entry.added !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(entry.added)) errors.push(`${loc}.added must be an ISO date string (YYYY-MM-DD)`);
      if (typeof entry.source !== "string" || !entry.source.trim()) errors.push(`${loc}.source must be a non-empty string`);
    });
  }

  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// buildLine — pure, testable. Folds a watchlist entry + a fetch result (or
// null/failure) into the documented rank-history.jsonl line shape. Never
// invents a value — anything not present in `fetched` becomes null/[]/false,
// exactly mirroring fetch-live-baseline.cjs's own "never invent" contract.
// ---------------------------------------------------------------------------
function buildLine({ date, niche, asin, title, marketplace, fetched }) {
  const f = fetched && typeof fetched === "object" ? fetched : null;
  return {
    date,
    niche,
    asin,
    title,
    marketplace,
    bsr_main: f && f.bsr_main !== undefined ? f.bsr_main : null,
    sub_ranks: f && Array.isArray(f.sub_ranks) ? f.sub_ranks : [],
    reviews: f && f.reviews !== undefined ? f.reviews : null,
    no_bsr_line: !!(f && f.no_bsr_line),
    status: (f && f.status) || "FETCH_FAILED",
    source: (f && f.source) || `no parseable result for ${asin} (fetch/spawn failed)`,
  };
}

// ---------------------------------------------------------------------------
// appendObservation — append-only JSONL writer. Never overwrites; creates
// the parent directory on first use. Preserves existing line endings (CRLF
// on Windows, LF on Unix).
// ---------------------------------------------------------------------------
function appendObservation(filePath, obs) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const eol = fs.existsSync(filePath) && fs.readFileSync(filePath, "utf8").includes("\r\n") ? "\r\n" : "\n";
  fs.appendFileSync(filePath, JSON.stringify(obs) + eol);
}

// ---------------------------------------------------------------------------
// fetchViaChild — spawns fetch-live-baseline.cjs as a child process and
// parses its single JSON stdout line. Network-touching; not exercised by
// tests (tests inject a stub fetchFn into runTrackCompetitors instead).
// ---------------------------------------------------------------------------
function fetchViaChild(asin, marketplace) {
  const scriptPath = path.join(ROOT, "scripts", "fetch-live-baseline.cjs");
  const res = spawnSync(process.execPath, [scriptPath, asin, marketplace], { encoding: "utf8" });
  const stdout = res.stdout || "";
  const firstLine = stdout.split(/\r?\n/).find((l) => l.trim().length > 0);
  if (!firstLine) {
    return {
      asin,
      marketplace,
      bsr_main: null,
      sub_ranks: [],
      reviews: null,
      no_bsr_line: false,
      status: "FETCH_FAILED",
      source: `fetch-live-baseline.cjs produced no output for ${asin} (exit ${res.status}${res.error ? `, spawn error: ${res.error.message}` : ""})`,
    };
  }
  try {
    return JSON.parse(firstLine);
  } catch (_) {
    return {
      asin,
      marketplace,
      bsr_main: null,
      sub_ranks: [],
      reviews: null,
      no_bsr_line: false,
      status: "FETCH_FAILED",
      source: `fetch-live-baseline.cjs produced unparseable output for ${asin}`,
    };
  }
}

// ---------------------------------------------------------------------------
// runTrackCompetitors — the run loop. fetchFn / rateLimiter / rankHistoryPath
// / today are all injectable so this is fully testable without network or
// real files (tests pass stub fetchers and a temp-dir path).
// ---------------------------------------------------------------------------
async function runTrackCompetitors(watchlist, { niche = null, fetchFn = fetchViaChild, rateLimiter, today, rankHistoryPath }) {
  const nicheNames = niche ? [niche] : Object.keys(watchlist.niches || {});
  const results = [];

  for (const nicheName of nicheNames) {
    const nicheEntry = watchlist.niches && watchlist.niches[nicheName];
    if (!nicheEntry) continue; // unknown --niche value — nothing to track, not a crash
    for (const asinEntry of nicheEntry.asins || []) {
      if (rateLimiter) await rateLimiter();

      let fetched;
      try {
        fetched = await fetchFn(asinEntry.asin, nicheEntry.marketplace);
      } catch (e) {
        // A thrown fetcher is a per-ASIN failure, not a run-aborting error —
        // it is recorded as its own FETCH_FAILED observation below.
        fetched = { status: "FETCH_FAILED", source: `fetchFn threw for ${asinEntry.asin}: ${e.message}` };
      }

      const line = buildLine({
        date: today,
        niche: nicheName,
        asin: asinEntry.asin,
        title: asinEntry.title,
        marketplace: nicheEntry.marketplace,
        fetched,
      });

      appendObservation(rankHistoryPath, line);
      results.push(line);
    }
  }

  return results;
}

module.exports = { validateWatchlist, buildLine, appendObservation, runTrackCompetitors, fetchViaChild };

// ---------------------------------------------------------------------------
// Rate limiter helper (production wiring only — not exported/tested).
// ---------------------------------------------------------------------------
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createRateLimiter(minGapMs) {
  let lastAt = 0;
  return async function wait() {
    const now = Date.now();
    const elapsed = now - lastAt;
    if (lastAt !== 0 && elapsed < minGapMs) {
      await sleep(minGapMs - elapsed);
    }
    lastAt = Date.now();
  };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseCliArgs(argv) {
  const out = { niche: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--niche") out.niche = argv[++i];
  }
  return out;
}

async function main() {
  const cli = parseCliArgs(process.argv.slice(2));
  const watchlistPath = path.join(ROOT, "intelligence", "competitor-watchlist.json");

  if (!fs.existsSync(watchlistPath)) {
    console.error(`No watchlist found at ${watchlistPath}`);
    process.exit(2);
  }

  let watchlist;
  try {
    watchlist = JSON.parse(fs.readFileSync(watchlistPath, "utf8"));
  } catch (e) {
    console.error(`Watchlist is not valid JSON: ${e.message}`);
    process.exit(2);
  }

  const { valid, errors } = validateWatchlist(watchlist);
  if (!valid) {
    console.error("Watchlist schema invalid:");
    for (const err of errors) console.error(`  - ${err}`);
    process.exit(2);
  }

  if (cli.niche && !watchlist.niches[cli.niche]) {
    console.error(`Unknown niche '${cli.niche}'. Known niches: ${Object.keys(watchlist.niches).join(", ")}`);
    process.exit(2);
  }

  const rankHistoryPath = path.join(ROOT, "intelligence", "rank-history.jsonl");
  const today = new Date().toISOString().slice(0, 10);
  const rateLimiter = createRateLimiter(RATE_LIMIT_MS);

  const results = await runTrackCompetitors(watchlist, {
    niche: cli.niche,
    fetchFn: fetchViaChild,
    rateLimiter,
    today,
    rankHistoryPath,
  });

  const counts = {};
  for (const r of results) counts[r.status] = (counts[r.status] || 0) + 1;
  const summary = Object.entries(counts).map(([s, n]) => `${s}: ${n}`).join(", ") || "no ASINs tracked";
  console.log(`track-competitors: ${results.length} observation(s) — ${summary}`);
}

if (require.main === module) {
  main();
}
