#!/usr/bin/env node
/*
 * fetch-live-baseline.cjs — fetches a live Amazon product page's PUBLIC
 * ranking data (Best Sellers Rank, sub-category ranks, review count) via a
 * plain stdlib HTTPS GET, so the weekly heartbeat can self-observe live
 * books without any AI/browser-in-chat overhead. Falls back to Playwright
 * (optional-require only) if the stdlib fetch is bot-blocked or fails.
 *
 * ZERO TOLERANCE: never invents a number. Any field not confidently parsed
 * from the fetched page is null. A missing "Best Sellers Rank" line on a
 * genuine product page is a REAL observation (no_bsr_line: true, status OK)
 * — not a parse failure.
 *
 * Usage:
 *   node scripts/fetch-live-baseline.cjs <asin> [marketplace] [--log <book-slug>]
 *     marketplace: "com" (default) | "co.uk"
 *     --log <slug>: on a successful fetch (status OK), pipes the parsed
 *                    fields into `node scripts/log-launch-metrics.cjs <slug> ...`
 *                    as a child process. If status is not OK, the logger is
 *                    never invoked and this script exits 1.
 *
 * Module exports (for tests — no network involved): { parseBaseline, buildLoggerArgs }
 */
const https = require("https");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const BLOCK_MARKERS = [
  "Robot Check",
  "api-services-support@amazon.com",
  "Enter the characters you see below",
];

// Text markers that close off the "Best Sellers Rank" block so trailing,
// unrelated page content is never scanned for rank-shaped patterns.
const BSR_BOUNDARY_MARKERS = [
  "Customer Reviews",
  "Product description",
  "Is Discontinued",
  "</table>",
];
const BSR_WINDOW_CAP = 1500; // raw HTML chars, used when no boundary marker is found nearby

// ---------------------------------------------------------------------------
// Small text helpers
// ---------------------------------------------------------------------------

function decodeEntities(s) {
  return String(s).replace(/&amp;/gi, "&");
}

// Replaces every HTML tag with a single boundary marker () instead of a
// space, then collapses runs of boundary-markers+whitespace into one marker.
// This lets category-name extraction stop cleanly at the next tag boundary
// (e.g. the closing </a> around a category link) instead of running on into
// unrelated trailing page text — while still tolerating tags that interpose
// between "#340" and "in Category" in real Amazon markup.
function stripTagsKeepBoundaries(html) {
  let out = String(html).replace(/<[^>]+>/g, "");
  out = out.replace(/&nbsp;/gi, " ");
  out = out.replace(/[\s]*[\s]*/g, "");
  out = out.replace(/[ \t]+/g, " ");
  return out;
}

// Plain-text-only strip (used for the reviews fallback scan).
function stripTags(html) {
  return String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function looksBlocked(html) {
  const text = String(html || "");
  if (BLOCK_MARKERS.some((m) => text.includes(m))) return true;
  if (/<form[^>]*captcha/i.test(text)) return true;
  return false;
}

function looksLikeProductPage(html) {
  const text = String(html || "");
  if (/Product\s+details/i.test(text)) return true;
  // ASIN echo — Amazon product pages print the ASIN in a details table/list
  // (e.g. "ASIN : B0GXYLWS1W" or "ASIN</th><td>B0GXYLWS1W"). Ten-char
  // alphanumeric standard identification number, uppercase.
  if (/\bASIN\b[\s\S]{0,60}?\b([A-Z0-9]{10})\b/.test(text)) return true;
  return false;
}

function findBsrWindow(html, bsrIdx) {
  const searchSpace = html.slice(bsrIdx, bsrIdx + 4000);
  let end = BSR_WINDOW_CAP;
  for (const marker of BSR_BOUNDARY_MARKERS) {
    const idx = searchSpace.indexOf(marker);
    if (idx !== -1 && idx < end) end = idx;
  }
  return html.slice(bsrIdx, bsrIdx + end);
}

// Extracts every "#<rank> in <category>" occurrence from a raw HTML window.
// Returns [{rank, category}, ...] in document order — index 0 is always the
// main rank ("#N in Kindle Store" / "#N in Books"); the rest are sub-ranks.
function extractRanks(windowHtml) {
  const boundaryText = stripTagsKeepBoundaries(windowHtml);
  const out = [];
  const re = /#([\d,]+)[\s]*in[\s]+([^#]+)/g;
  let m;
  while ((m = re.exec(boundaryText))) {
    const rank = parseInt(m[1].replace(/,/g, ""), 10);
    if (!Number.isFinite(rank)) continue;
    const category = decodeEntities(m[2].trim());
    if (!category) continue;
    out.push({ rank, category });
  }
  return out;
}

function parseReviews(html) {
  const text = String(html || "");
  // Preferred: the acrCustomerReviewText element, where the number and the
  // phrase sit in the same text node right after the opening tag.
  const acr = text.match(/id=["']acrCustomerReviewText["'][^>]*>\s*([\d,]+)\s+customer reviews?/i);
  if (acr) return parseInt(acr[1].replace(/,/g, ""), 10);
  // Fallback: scan the whole visible page text for "<n> customer review(s)".
  const plain = stripTags(text);
  const generic = plain.match(/([\d,]+)\s+customer reviews?/i);
  if (generic) return parseInt(generic[1].replace(/,/g, ""), 10);
  return null;
}

// ---------------------------------------------------------------------------
// parseBaseline — the pure, testable, network-free classifier/parser
// ---------------------------------------------------------------------------

function parseBaseline(html) {
  const text = String(html || "");
  const result = {
    bsr_main: null,
    sub_ranks: [],
    reviews: null,
    no_bsr_line: false,
    status: "OK",
  };

  if (looksBlocked(text)) {
    return { ...result, status: "BLOCKED" };
  }

  if (!looksLikeProductPage(text)) {
    return { ...result, status: "FETCH_FAILED" };
  }

  const bsrIdx = text.search(/Best\s+Sellers\s+Rank/i);
  let bsrLineExistsButUnparsed = false;

  if (bsrIdx === -1) {
    result.no_bsr_line = true;
  } else {
    const windowHtml = findBsrWindow(text, bsrIdx);
    const ranks = extractRanks(windowHtml);
    if (ranks.length) {
      result.bsr_main = ranks[0].rank;
      result.sub_ranks = ranks.slice(1);
    } else {
      // A "Best Sellers Rank" label exists but nothing parseable followed it
      // — a genuine parse failure, distinct from the well-known no-BSR case.
      bsrLineExistsButUnparsed = true;
    }
  }

  result.reviews = parseReviews(text);

  const missingReviews = result.reviews === null;
  if (missingReviews || bsrLineExistsButUnparsed) {
    result.status = "PARSE_INCOMPLETE";
  }

  return result;
}

// ---------------------------------------------------------------------------
// buildLoggerArgs — turns a fetch result into log-launch-metrics.cjs CLI args
// ---------------------------------------------------------------------------

function buildLoggerArgs(slug, result) {
  const args = [slug];
  if (result.bsr_main !== null && result.bsr_main !== undefined) {
    args.push("--bsr", String(result.bsr_main));
  }
  if (Array.isArray(result.sub_ranks) && result.sub_ranks.length > 0) {
    args.push("--bsr-sub", String(result.sub_ranks[0].rank));
  }
  if (result.reviews !== null && result.reviews !== undefined) {
    args.push("--reviews", String(result.reviews));
  }
  args.push("--source", result.source);

  const noteParts = [];
  if (Array.isArray(result.sub_ranks) && result.sub_ranks.length) {
    noteParts.push(
      "sub-ranks: " + result.sub_ranks.map((r) => `#${r.rank} in ${r.category}`).join("; ")
    );
  }
  if (result.no_bsr_line) {
    noteParts.push("no BSR line on live page");
  }
  if (noteParts.length) {
    args.push("--note", noteParts.join(" | "));
  }
  return args;
}

module.exports = { parseBaseline, buildLoggerArgs };

// ---------------------------------------------------------------------------
// Network layer (Tier 1 stdlib HTTPS, Tier 2 optional Playwright fallback).
// Not exercised by tests — tests only cover parseBaseline / buildLoggerArgs.
// ---------------------------------------------------------------------------

function httpsGetFollow(url, redirectsLeft, timeoutMs) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: timeoutMs,
      },
      (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirectsLeft > 0) {
          res.resume();
          const nextUrl = new URL(res.headers.location, url).toString();
          settled = true;
          resolve(httpsGetFollow(nextUrl, redirectsLeft - 1, timeoutMs));
          return;
        }
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          settled = true;
          resolve({ statusCode: res.statusCode, body });
        });
      }
    );
    req.on("timeout", () => {
      if (!settled) req.destroy(new Error("timeout"));
    });
    req.on("error", (err) => {
      if (!settled) reject(err);
    });
  });
}

async function runTier1(url) {
  try {
    const { statusCode, body } = await httpsGetFollow(url, 3, 20000);
    if (statusCode === 503) return { status: "BLOCKED", html: body };
    if (statusCode >= 400) return { status: "FETCH_FAILED", html: body };
    return { status: null, html: body };
  } catch (e) {
    return { status: "FETCH_FAILED", html: "" };
  }
}

function loadPlaywright() {
  try {
    return require("playwright");
  } catch (_) {
    /* fall through */
  }
  try {
    return require(path.join(ROOT, "backend", "node_modules", "playwright"));
  } catch (_) {
    return null;
  }
}

async function runTier2(url) {
  const pw = loadPlaywright();
  if (!pw) return { available: false };
  let browser;
  try {
    browser = await pw.chromium.launch({ headless: true });
    const page = await browser.newPage({ userAgent: USER_AGENT });
    await page.goto(url, { timeout: 20000, waitUntil: "domcontentloaded" });
    const html = await page.content();
    return { available: true, html };
  } catch (e) {
    return { available: true, html: null, error: e.message };
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (_) {
        /* ignore */
      }
    }
  }
}

function emptyParsed(status) {
  return { bsr_main: null, sub_ranks: [], reviews: null, no_bsr_line: false, status };
}

async function fetchBaseline(asin, marketplace) {
  const tld = marketplace === "co.uk" ? "co.uk" : "com";
  const url = `https://www.amazon.${tld}/dp/${asin}`;
  const fetchedAt = new Date().toISOString();

  let parsed;
  let fallback = null;

  const tier1 = await runTier1(url);
  if (tier1.status === "BLOCKED" || tier1.status === "FETCH_FAILED") {
    const tier2 = await runTier2(url);
    if (tier2.available && tier2.html) {
      parsed = parseBaseline(tier2.html);
    } else if (tier2.available) {
      parsed = emptyParsed(tier1.status);
      fallback = tier2.error ? `playwright fetch failed: ${tier2.error}` : "playwright fetch failed";
    } else {
      parsed = emptyParsed(tier1.status);
      fallback = "playwright unavailable";
    }
  } else {
    parsed = parseBaseline(tier1.html);
  }

  const result = {
    asin,
    marketplace: tld,
    fetched_at: fetchedAt,
    bsr_main: parsed.bsr_main,
    sub_ranks: parsed.sub_ranks,
    reviews: parsed.reviews,
    no_bsr_line: parsed.no_bsr_line,
    status: parsed.status,
    source: `amazon.${tld}/dp/${asin} public page, script fetch ${fetchedAt.slice(0, 10)}`,
  };
  if (fallback) result.fallback = fallback;
  return result;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseCliArgs(argv) {
  const out = { asin: null, marketplace: "com", log: null };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--log") {
      out.log = argv[++i];
      continue;
    }
    positional.push(a);
  }
  out.asin = positional[0] || null;
  if (positional[1]) out.marketplace = positional[1];
  return out;
}

async function main() {
  const cli = parseCliArgs(process.argv.slice(2));
  if (!cli.asin) {
    console.error("Usage: node scripts/fetch-live-baseline.cjs <asin> [marketplace] [--log <book-slug>]");
    process.exit(2);
  }

  const result = await fetchBaseline(cli.asin, cli.marketplace);
  console.log(JSON.stringify(result));

  if (result.status !== "OK") {
    process.exit(1);
  }

  if (cli.log) {
    const args = buildLoggerArgs(cli.log, result);
    const loggerPath = path.join(ROOT, "scripts", "log-launch-metrics.cjs");
    const child = spawnSync(process.execPath, [loggerPath, ...args], { stdio: "inherit" });
    if (child.status !== 0) process.exit(child.status || 1);
  }
}

if (require.main === module) {
  main();
}
