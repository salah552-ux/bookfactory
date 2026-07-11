#!/usr/bin/env node
// Tests for track-competitors.cjs. Uses ONLY temp dirs and injected stub
// fetchers — NO network, NO real intelligence/ files touched.
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  validateWatchlist,
  buildLine,
  appendObservation,
  runTrackCompetitors,
} = require("../track-competitors.cjs");

function tmpFile(name) {
  return path.join(fs.mkdtempSync(path.join(os.tmpdir(), "track-competitors-test-")), name);
}

// -----------------------------------------------------------------------
// validateWatchlist — schema validation
// -----------------------------------------------------------------------

// 1. A well-formed watchlist (mirrors the real competitor-watchlist.json
//    shape) validates clean.
{
  const good = {
    niches: {
      "gut-health": {
        marketplace: "co.uk",
        asins: [
          { asin: "B0CTCBR3VB", title: "The Food For Life Cookbook", added: "2026-07-11", source: "intelligence/reports/gut_health_analysis.json bsr_velocity top20" },
        ],
      },
    },
  };
  const r = validateWatchlist(good);
  assert.strictEqual(r.valid, true, `expected valid, got errors: ${JSON.stringify(r.errors)}`);
  assert.deepStrictEqual(r.errors, []);
}

// 2. Missing top-level "niches" key is rejected.
{
  const r = validateWatchlist({});
  assert.strictEqual(r.valid, false);
  assert.ok(r.errors.some((e) => /niches/.test(e)));
}

// 3. Bad marketplace token (not "com"/"co.uk") is rejected.
{
  const bad = { niches: { x: { marketplace: "uk", asins: [] } } };
  const r = validateWatchlist(bad);
  assert.strictEqual(r.valid, false);
  assert.ok(r.errors.some((e) => /marketplace/.test(e)));
}

// 4. asins must be an array; a non-array is rejected with a targeted error.
{
  const bad = { niches: { x: { marketplace: "com", asins: "not-an-array" } } };
  const r = validateWatchlist(bad);
  assert.strictEqual(r.valid, false);
  assert.ok(r.errors.some((e) => /asins/.test(e)));
}

// 5. An asin entry missing "asin" or "title" or "source" is rejected —
//    each missing field reported individually.
{
  const bad = {
    niches: {
      x: {
        marketplace: "com",
        asins: [{ added: "2026-07-11" }],
      },
    },
  };
  const r = validateWatchlist(bad);
  assert.strictEqual(r.valid, false);
  assert.ok(r.errors.some((e) => /asin/.test(e)));
  assert.ok(r.errors.some((e) => /title/.test(e)));
  assert.ok(r.errors.some((e) => /source/.test(e)));
}

// 6. The real repo watchlist file itself validates clean (a live sanity
//    check against the actual Feature-2 artifact — still no network).
{
  const realPath = path.join(__dirname, "..", "..", "intelligence", "competitor-watchlist.json");
  const real = JSON.parse(fs.readFileSync(realPath, "utf8"));
  const r = validateWatchlist(real);
  assert.strictEqual(r.valid, true, `real watchlist must validate: ${JSON.stringify(r.errors)}`);
  assert.ok(real.niches["gut-health"], "gut-health niche present");
  assert.ok(real.niches["vagus-nerve"], "vagus-nerve niche present");
  assert.strictEqual(real.niches["gut-health"].asins.length, 5);
  assert.strictEqual(real.niches["vagus-nerve"].asins.length, 5);
}

// -----------------------------------------------------------------------
// buildLine — rank-history line shape
// -----------------------------------------------------------------------

// 7. A successful fetch result is folded into the documented line shape,
//    field order matching the spec: date, niche, asin, title, marketplace,
//    bsr_main, sub_ranks, reviews, no_bsr_line, status, source.
{
  const line = buildLine({
    date: "2026-07-11",
    niche: "gut-health",
    asin: "B0CTCBR3VB",
    title: "The Food For Life Cookbook",
    marketplace: "co.uk",
    fetched: {
      bsr_main: 403,
      sub_ranks: [{ rank: 12, category: "Gut & Digestive Health" }],
      reviews: 174,
      no_bsr_line: false,
      status: "OK",
      source: "amazon.co.uk/dp/B0CTCBR3VB public page, script fetch 2026-07-11",
    },
  });
  assert.deepStrictEqual(Object.keys(line), [
    "date", "niche", "asin", "title", "marketplace",
    "bsr_main", "sub_ranks", "reviews", "no_bsr_line", "status", "source",
  ]);
  assert.strictEqual(line.bsr_main, 403);
  assert.strictEqual(line.reviews, 174);
  assert.strictEqual(line.status, "OK");
}

// 8. A totally failed fetch (no parseable result at all — e.g. the child
//    process produced no output) still produces a well-shaped line with
//    nulls, never invented numbers, and a FETCH_FAILED status — a failure
//    IS an observation.
{
  const line = buildLine({
    date: "2026-07-11",
    niche: "gut-health",
    asin: "B0FAKE00001",
    title: "Some Competitor Book",
    marketplace: "co.uk",
    fetched: null,
  });
  assert.strictEqual(line.bsr_main, null);
  assert.deepStrictEqual(line.sub_ranks, []);
  assert.strictEqual(line.reviews, null);
  assert.strictEqual(line.no_bsr_line, false);
  assert.strictEqual(line.status, "FETCH_FAILED");
  assert.ok(typeof line.source === "string" && line.source.length > 0, "a failure still records a source/explanation string");
}

// -----------------------------------------------------------------------
// appendObservation — append-only JSONL writer
// -----------------------------------------------------------------------

// 9. Writing twice to a fresh path produces exactly 2 valid JSON lines,
//    never overwriting the first.
{
  const file = tmpFile("rank-history.jsonl");
  appendObservation(file, { date: "2026-07-11", asin: "AAA", status: "OK" });
  appendObservation(file, { date: "2026-07-11", asin: "BBB", status: "OK" });
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter((l) => l.trim().length > 0);
  assert.strictEqual(lines.length, 2, "two appends produce two lines, never an overwrite");
  const parsed = lines.map((l) => JSON.parse(l));
  assert.strictEqual(parsed[0].asin, "AAA");
  assert.strictEqual(parsed[1].asin, "BBB");
}

// 10. appendObservation creates the parent directory if it does not exist yet.
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "track-competitors-test-"));
  const file = path.join(dir, "nested", "deep", "rank-history.jsonl");
  appendObservation(file, { date: "2026-07-11", asin: "CCC", status: "OK" });
  assert.ok(fs.existsSync(file));
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter((l) => l.trim().length > 0);
  assert.strictEqual(lines.length, 1);
}

// -----------------------------------------------------------------------
// runTrackCompetitors — per-ASIN failure does not abort the run
// -----------------------------------------------------------------------

async function runAsyncTests() {
  // 11. A stub fetcher that throws for one ASIN and succeeds for the others
  //     must still produce an observation for EVERY asin — the run never
  //     aborts partway through.
  {
    const watchlist = {
      niches: {
        "gut-health": {
          marketplace: "co.uk",
          asins: [
            { asin: "AAA111", title: "Book A", added: "2026-07-11", source: "x" },
            { asin: "BBB222", title: "Book B (always fails)", added: "2026-07-11", source: "x" },
            { asin: "CCC333", title: "Book C", added: "2026-07-11", source: "x" },
          ],
        },
      },
    };
    const rankHistoryPath = tmpFile("rank-history.jsonl");
    let calls = 0;
    const stubFetch = async (asin) => {
      calls++;
      if (asin === "BBB222") throw new Error("simulated network failure");
      return {
        bsr_main: 1000 + calls,
        sub_ranks: [],
        reviews: calls,
        no_bsr_line: false,
        status: "OK",
        source: `stub fetch for ${asin}`,
      };
    };
    const noopWait = async () => {};
    const results = await runTrackCompetitors(watchlist, {
      fetchFn: stubFetch,
      rateLimiter: noopWait,
      today: "2026-07-11",
      rankHistoryPath,
    });
    assert.strictEqual(calls, 3, "the stub fetcher was invoked for every ASIN despite one throwing");
    assert.strictEqual(results.length, 3, "every ASIN produced an observation, including the failed one");
    const failed = results.find((r) => r.asin === "BBB222");
    assert.strictEqual(failed.status, "FETCH_FAILED", "the thrown ASIN is recorded as a FETCH_FAILED observation, not skipped silently");
    assert.strictEqual(failed.bsr_main, null);
    const ok1 = results.find((r) => r.asin === "AAA111");
    const ok2 = results.find((r) => r.asin === "CCC333");
    assert.strictEqual(ok1.status, "OK");
    assert.strictEqual(ok2.status, "OK");

    // All 3 (including the failure) were appended to the JSONL file.
    const lines = fs.readFileSync(rankHistoryPath, "utf8").split(/\r?\n/).filter((l) => l.trim().length > 0);
    assert.strictEqual(lines.length, 3, "the failed ASIN's observation is appended too — a failure is an observation");
  }

  // 12. --niche filtering: only the requested niche's ASINs are tracked.
  {
    const watchlist = {
      niches: {
        "gut-health": {
          marketplace: "co.uk",
          asins: [{ asin: "GH1", title: "Gut Book", added: "2026-07-11", source: "x" }],
        },
        "vagus-nerve": {
          marketplace: "co.uk",
          asins: [{ asin: "VN1", title: "Vagus Book", added: "2026-07-11", source: "x" }],
        },
      },
    };
    const rankHistoryPath = tmpFile("rank-history.jsonl");
    const stubFetch = async () => ({ bsr_main: 1, sub_ranks: [], reviews: 1, no_bsr_line: false, status: "OK", source: "stub" });
    const results = await runTrackCompetitors(watchlist, {
      niche: "vagus-nerve",
      fetchFn: stubFetch,
      rateLimiter: async () => {},
      today: "2026-07-11",
      rankHistoryPath,
    });
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].asin, "VN1");
  }
}

runAsyncTests()
  .then(() => {
    console.log("ALL PASS — track-competitors");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
