#!/usr/bin/env node
/*
 * harvest-autocomplete.cjs — harvests REAL buyer search language, free,
 * straight from Amazon's own public autocomplete (suggestions) endpoint.
 * This is primary-source data: the phrase suggestions Amazon itself serves
 * to a real shopper typing in the search box, for a given seed phrase.
 *
 * ZERO TOLERANCE: never invents a suggestion. A response that cannot be
 * parsed produces status FETCH_FAILED for that query, never a fabricated
 * or guessed phrase. An empty `suggestions: []` from Amazon (a genuine
 * "no matches") is a real observation and is kept as [] — that is NOT the
 * same thing as a parse failure, and the two are never conflated.
 *
 * Endpoint (verified live 2026-07-11 — see .superpowers/sdd/
 * validation-upgrades-report.md for the observed response schema):
 *   .com:   https://completion.amazon.com/api/2017/suggestions
 *             ?mid=ATVPDKIKX0DER&alias=digital-text&prefix=<urlencoded>
 *   .co.uk: https://completion.amazon.co.uk/api/2017/suggestions
 *             ?mid=A1F83G8C2ARO7P&alias=digital-text&prefix=<urlencoded>
 * Response shape: { alias, prefix, suffix, suggestions: [ { suggType,
 * type, value, refTag, ... } ], predictiveText, suggestionTitleId,
 * responseId, shuffled }. The buyer-language string is `suggestions[i].value`.
 *
 * Usage:
 *   node scripts/harvest-autocomplete.cjs <marketplace> <seed...> [--out <file>] [--expand]
 *     marketplace: "com" | "co.uk"  (literal tokens only — anything else is
 *                  a hard error, this script never silently defaults)
 *     seed...    : one or more seed phrases (each a single CLI argument —
 *                  quote multi-word seeds, e.g. "gut health")
 *     --expand   : for each seed, ALSO query "<seed> a" through "<seed> z"
 *                  (26 extra requests per seed) and merge the results into
 *                  that seed's suggestion set. Default (flag omitted): only
 *                  the plain seed is queried.
 *     --out <file>: also write the full JSON (pretty-printed) to <file>.
 *                  Suggested convention (not enforced):
 *                    intelligence/reports/autocomplete-<niche>-<date>.json
 *
 * Rate limit: at least 300ms between any two HTTP requests this process
 * makes, enforced globally across all seeds/expansions in a single run.
 *
 * Output (stdout, single line): { marketplace, fetched_at, endpoint,
 *   seeds: [ { seed, suggestions: [strings], status } ], status }
 *   Per-seed status: "OK" (every query for this seed parsed), "PARTIAL"
 *   (some queries parsed, some failed — --expand only), "FETCH_FAILED"
 *   (no query for this seed parsed). Top-level status aggregates the same
 *   way across all seeds.
 *
 * Module exports (for tests — no network involved): { parseSuggestions,
 * buildUrl }.
 */
const https = require("https");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const RATE_LIMIT_MS = 300;

const MARKETPLACES = {
  com: { host: "completion.amazon.com", mid: "ATVPDKIKX0DER" },
  "co.uk": { host: "completion.amazon.co.uk", mid: "A1F83G8C2ARO7P" },
};

// ---------------------------------------------------------------------------
// buildUrl — pure, testable. Throws on any marketplace token that isn't the
// literal "com" or "co.uk" (never silently defaults — see header note).
// ---------------------------------------------------------------------------
function buildUrl(marketplace, prefix) {
  const cfg = MARKETPLACES[marketplace];
  if (!cfg) {
    throw new Error(
      `Invalid marketplace '${marketplace}' — must be the literal token "com" or "co.uk".`
    );
  }
  const qs = [
    ["mid", cfg.mid],
    ["alias", "digital-text"],
    ["prefix", prefix],
  ]
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  return `https://${cfg.host}/api/2017/suggestions?${qs}`;
}

// The base endpoint (no prefix filled in) — used for the report's
// documentary "endpoint" field.
function baseEndpoint(marketplace) {
  const cfg = MARKETPLACES[marketplace];
  if (!cfg) {
    throw new Error(
      `Invalid marketplace '${marketplace}' — must be the literal token "com" or "co.uk".`
    );
  }
  return `https://${cfg.host}/api/2017/suggestions?mid=${cfg.mid}&alias=digital-text`;
}

// ---------------------------------------------------------------------------
// parseSuggestions — pure, testable. Returns an array of suggestion strings
// on success (possibly empty — a real "no matches" observation), or null if
// the body could not be interpreted as a valid suggestions response. NEVER
// invents a value for a malformed suggestion item — such items are skipped.
// ---------------------------------------------------------------------------
function parseSuggestions(rawBody) {
  if (typeof rawBody !== "string" || rawBody.length === 0) return null;
  let data;
  try {
    data = JSON.parse(rawBody);
  } catch (_) {
    return null;
  }
  if (!data || !Array.isArray(data.suggestions)) return null;

  const out = [];
  for (const item of data.suggestions) {
    if (item && typeof item.value === "string" && item.value.trim().length > 0) {
      out.push(item.value);
    }
  }
  return out;
}

module.exports = { parseSuggestions, buildUrl };

// ---------------------------------------------------------------------------
// Network layer + CLI. Not exercised by tests — tests only cover the pure
// functions above (no network in tests, per project convention).
// ---------------------------------------------------------------------------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function httpGet(url) {
  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json,text/javascript,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 15000,
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => resolve(body));
      }
    );
    req.on("timeout", () => req.destroy(new Error("timeout")));
    // Network error or timeout both resolve to "" (unparseable, never
    // invented) rather than rejecting — a per-query failure must not crash
    // the whole run (see the failure-doesn't-abort behaviour of Feature 2).
    req.on("error", () => resolve(""));
  });
}

// A single rate limiter shared across the whole run — every request this
// process makes (across every seed and every --expand letter) is spaced
// at least RATE_LIMIT_MS apart.
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

function statusFromFlags(anyOk, anyFail) {
  if (anyOk && !anyFail) return "OK";
  if (anyOk && anyFail) return "PARTIAL";
  return "FETCH_FAILED";
}

async function harvestSeed(marketplace, seed, expand, rateLimiter) {
  const queries = [seed];
  if (expand) {
    for (const letter of "abcdefghijklmnopqrstuvwxyz") {
      queries.push(`${seed} ${letter}`);
    }
  }

  const collected = [];
  const seen = new Set();
  let anyOk = false;
  let anyFail = false;

  for (const q of queries) {
    await rateLimiter();
    const url = buildUrl(marketplace, q);
    const body = await httpGet(url);
    const parsed = parseSuggestions(body);
    if (parsed === null) {
      anyFail = true;
      continue;
    }
    anyOk = true;
    for (const s of parsed) {
      if (!seen.has(s)) {
        seen.add(s);
        collected.push(s);
      }
    }
  }

  return { seed, suggestions: collected, status: statusFromFlags(anyOk, anyFail) };
}

async function runHarvest(marketplace, seeds, expand) {
  const fetchedAt = new Date().toISOString();
  const rateLimiter = createRateLimiter(RATE_LIMIT_MS);
  const seedResults = [];
  for (const seed of seeds) {
    seedResults.push(await harvestSeed(marketplace, seed, expand, rateLimiter));
  }
  const statuses = seedResults.map((r) => r.status);
  let status;
  if (statuses.every((s) => s === "OK")) status = "OK";
  else if (statuses.every((s) => s === "FETCH_FAILED")) status = "FETCH_FAILED";
  else status = "PARTIAL";

  return {
    marketplace,
    fetched_at: fetchedAt,
    endpoint: baseEndpoint(marketplace),
    seeds: seedResults,
    status,
  };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseCliArgs(argv) {
  const out = { marketplace: null, seeds: [], outFile: null, expand: false };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") {
      out.outFile = argv[++i];
      continue;
    }
    if (a === "--expand") {
      out.expand = true;
      continue;
    }
    positional.push(a);
  }
  out.marketplace = positional[0] || null;
  out.seeds = positional.slice(1);
  return out;
}

async function main() {
  const cli = parseCliArgs(process.argv.slice(2));
  if (!cli.marketplace || !MARKETPLACES[cli.marketplace] || cli.seeds.length === 0) {
    console.error(
      'Usage: node scripts/harvest-autocomplete.cjs <com|co.uk> <seed...> [--out <file>] [--expand]'
    );
    process.exit(2);
  }

  const result = await runHarvest(cli.marketplace, cli.seeds, cli.expand);
  console.log(JSON.stringify(result));

  if (cli.outFile) {
    const outPath = path.isAbsolute(cli.outFile) ? cli.outFile : path.join(ROOT, cli.outFile);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + "\n");
  }

  if (result.status === "FETCH_FAILED") process.exit(1);
}

if (require.main === module) {
  main();
}
