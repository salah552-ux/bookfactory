#!/usr/bin/env node
// Tests for fetch-live-baseline.cjs. Pure unit tests over synthetic HTML
// fixture strings built in-test — NO network, NO real book state touched.
const assert = require("assert");
const { parseBaseline, buildLoggerArgs } = require("../fetch-live-baseline.cjs");

const SOURCE = "amazon.com/dp/B0GXYLWS1W public page, script fetch 2026-07-11";

// -----------------------------------------------------------------------
// 1. .com-style detail-bullets fixture: full BSR block + sub-rank + reviews.
// -----------------------------------------------------------------------
{
  const html = [
    "<html><body>",
    '<div id="detailBulletsWrapper_feature_div">',
    '<ul class="detail-bullet-list">',
    "<li>",
    '<span class="a-list-item">',
    '<span class="a-text-bold">Best Sellers Rank:</span>',
    "<span>",
    "#2,355,773 in Kindle Store (See Top 100 in Kindle Store)",
    '<ul class="zg_hrsr">',
    '<li class="zg_hrsr_item">',
    '<span class="zg_hrsr_rank">#340</span> in ',
    '<a href="/gp/bestsellers/x">Irritable Bowel Syndrome (Kindle Store)</a>',
    "</li>",
    "</ul>",
    "</span>",
    "</span>",
    "</li>",
    "</ul>",
    "</div>",
    '<div id="detailBullets_averageCustomerReviews">',
    '<span id="acrCustomerReviewText">0 customer reviews</span>',
    "</div>",
    "<h2>Product details</h2>",
    "<div>ASIN B0GXYLWS1W</div>",
    "</body></html>",
  ].join("\n");

  const r = parseBaseline(html);
  assert.strictEqual(r.bsr_main, 2355773, "main BSR parsed as integer, commas stripped");
  assert.strictEqual(r.sub_ranks.length, 1, "one sub-rank found");
  assert.strictEqual(r.sub_ranks[0].rank, 340, "sub-rank number parsed");
  assert.ok(/Irritable Bowel Syndrome/.test(r.sub_ranks[0].category), "sub-rank category captured");
  assert.strictEqual(r.reviews, 0, "0 customer reviews is a real observed value, not null");
  assert.strictEqual(r.no_bsr_line, false);
  assert.strictEqual(r.status, "OK");
}

// -----------------------------------------------------------------------
// 2. Product details section present, but NO Best Sellers Rank line at all
//    — a REAL observation (no_bsr_line true), not a parse failure.
// -----------------------------------------------------------------------
{
  const html = [
    "<html><body>",
    "<h2>Product details</h2>",
    "<ul>",
    '<li><span class="a-text-bold">Publisher</span> : Reflex Press (April 21, 2026)</li>',
    '<li><span class="a-text-bold">Language</span> : English</li>',
    "</ul>",
    '<span id="acrCustomerReviewText">0 customer reviews</span>',
    "</body></html>",
  ].join("\n");

  const r = parseBaseline(html);
  assert.strictEqual(r.no_bsr_line, true, "no BSR line detected");
  assert.strictEqual(r.bsr_main, null, "no BSR main rank invented");
  assert.deepStrictEqual(r.sub_ranks, []);
  assert.strictEqual(r.reviews, 0, "reviews still parsed even with no BSR line");
  assert.strictEqual(r.status, "OK", "missing BSR line alone is a real state, not PARSE_INCOMPLETE");
}

// -----------------------------------------------------------------------
// 3. Robot-check / bot-block page → BLOCKED. Must be detected WITHOUT
//    network — parseBaseline's own block classifier handles this.
// -----------------------------------------------------------------------
{
  const html = [
    "<html><body>",
    "<h4>Sorry, we just need to make sure you're not a robot.</h4>",
    '<form action="/errors/validateCaptcha" method="get">',
    "<p>Enter the characters you see below</p>",
    "</form>",
    "<p>For best results, please make sure your browser is accepting cookies.</p>",
    "</body></html>",
  ].join("\n");

  const r = parseBaseline(html);
  assert.strictEqual(r.status, "BLOCKED", "robot-check page classified as BLOCKED");
  assert.strictEqual(r.bsr_main, null, "nothing parsed from a blocked page");
  assert.strictEqual(r.reviews, null);
}

// Second block-marker variant — the api-services-support@amazon.com signature.
{
  const html = "<html><body><p>To discuss automated access to Amazon data please contact api-services-support@amazon.com.</p></body></html>";
  const r = parseBaseline(html);
  assert.strictEqual(r.status, "BLOCKED", "api-services-support marker also classified as BLOCKED");
}

// -----------------------------------------------------------------------
// 4. Garbage / non-product body (no "Product details", no ASIN echo)
//    → FETCH_FAILED.
// -----------------------------------------------------------------------
{
  const html = "<html><body><h1>404 Not Found</h1><p>We could not find that page. Try searching instead.</p></body></html>";
  const r = parseBaseline(html);
  assert.strictEqual(r.status, "FETCH_FAILED");
  assert.strictEqual(r.bsr_main, null);
  assert.strictEqual(r.reviews, null);
  assert.deepStrictEqual(r.sub_ranks, []);
}

// -----------------------------------------------------------------------
// 5. buildLoggerArgs — full parse includes --bsr, --bsr-sub, --reviews, --source.
// -----------------------------------------------------------------------
{
  const fullResult = {
    bsr_main: 2355773,
    sub_ranks: [{ rank: 340, category: "Irritable Bowel Syndrome (Kindle Store)" }],
    reviews: 0,
    no_bsr_line: false,
    status: "OK",
    source: SOURCE,
  };
  const args = buildLoggerArgs("fix-your-gut-for-good", fullResult);
  assert.strictEqual(args[0], "fix-your-gut-for-good", "slug is first positional arg");
  assert.ok(args.includes("--bsr"), "full parse includes --bsr");
  assert.strictEqual(args[args.indexOf("--bsr") + 1], "2355773");
  assert.ok(args.includes("--bsr-sub"), "full parse includes --bsr-sub");
  assert.strictEqual(args[args.indexOf("--bsr-sub") + 1], "340");
  assert.ok(args.includes("--reviews"), "full parse includes --reviews");
  assert.strictEqual(args[args.indexOf("--reviews") + 1], "0");
  assert.ok(args.includes("--source"), "full parse includes --source");
  assert.strictEqual(args[args.indexOf("--source") + 1], SOURCE);
}

// -----------------------------------------------------------------------
// 6. buildLoggerArgs — no_bsr_line parse must NOT include --bsr, and the
//    note must mention "no BSR line".
// -----------------------------------------------------------------------
{
  const noBsrResult = {
    bsr_main: null,
    sub_ranks: [],
    reviews: 0,
    no_bsr_line: true,
    status: "OK",
    source: SOURCE,
  };
  const args = buildLoggerArgs("vagus-nerve-gut-reset-workbook", noBsrResult);
  assert.ok(!args.includes("--bsr"), "no_bsr_line parse must not fabricate a --bsr flag");
  assert.ok(!args.includes("--bsr-sub"), "no sub-ranks present, so no --bsr-sub either");
  assert.ok(args.includes("--reviews"), "reviews still logged when present");
  assert.ok(args.includes("--note"), "a note is attached");
  const note = args[args.indexOf("--note") + 1];
  assert.ok(/no BSR line/i.test(note), "note mentions the no-BSR-line state");
}

// -----------------------------------------------------------------------
// 7. buildLoggerArgs — sub-ranks are listed in the note when present.
// -----------------------------------------------------------------------
{
  const result = {
    bsr_main: 500000,
    sub_ranks: [
      { rank: 12, category: "Cozy Mystery" },
      { rank: 40, category: "Amateur Sleuth" },
    ],
    reviews: 5,
    no_bsr_line: false,
    status: "OK",
    source: SOURCE,
  };
  const args = buildLoggerArgs("death-in-the-cathedral-close", result);
  const note = args[args.indexOf("--note") + 1];
  assert.ok(note.includes("#12 in Cozy Mystery"), "note lists first sub-rank");
  assert.ok(note.includes("#40 in Amateur Sleuth"), "note lists second sub-rank");
  assert.ok(!/no BSR line/i.test(note), "no-BSR-line phrase absent when a BSR was found");
}

// -----------------------------------------------------------------------
// 8. Review count with commas parses correctly: "1,234 customer reviews" -> 1234.
// -----------------------------------------------------------------------
{
  const html = [
    "<html><body>",
    "<h2>Product details</h2>",
    '<span id="acrCustomerReviewText">1,234 customer reviews</span>',
    "</body></html>",
  ].join("\n");
  const r = parseBaseline(html);
  assert.strictEqual(r.reviews, 1234, "comma-formatted review count parsed as integer");
}

// -----------------------------------------------------------------------
// 9. Singular "1 customer review" (no trailing s) still parses.
// -----------------------------------------------------------------------
{
  const html = [
    "<html><body>",
    "<h2>Product details</h2>",
    '<span id="acrCustomerReviewText">1 customer review</span>',
    "</body></html>",
  ].join("\n");
  const r = parseBaseline(html);
  assert.strictEqual(r.reviews, 1);
}

// -----------------------------------------------------------------------
// 10. Table-row BSR layout (older Amazon "Product details" table) is also
//     parsed correctly, not just the detail-bullets <li> layout.
// -----------------------------------------------------------------------
{
  const html = [
    "<html><body>",
    "<h2>Product details</h2>",
    "<table>",
    "<tr><th>Best Sellers Rank</th><td>",
    "#48,210 in Books (",
    '<a href="/bestsellers">See Top 100 in Books</a>',
    ")",
    "<br>",
    '<a href="/x">#9</a> in ',
    '<a href="/x">Diseases &amp; Physical Ailments</a>',
    "</td></tr>",
    "</table>",
    '<span id="acrCustomerReviewText">12 customer reviews</span>',
    "</body></html>",
  ].join("\n");
  const r = parseBaseline(html);
  assert.strictEqual(r.bsr_main, 48210, "table-row layout main rank parsed");
  assert.strictEqual(r.sub_ranks.length, 1);
  assert.strictEqual(r.sub_ranks[0].rank, 9);
  assert.ok(/Diseases & Physical Ailments/.test(r.sub_ranks[0].category), "&amp; entity decoded to &");
  assert.strictEqual(r.reviews, 12);
  assert.strictEqual(r.status, "OK");
}

// -----------------------------------------------------------------------
// 11. "Best Sellers Rank" label present but genuinely unparseable (no
//     "#N in X" pattern follows) -> PARSE_INCOMPLETE, not a fabricated
//     no_bsr_line true and not a silent OK.
// -----------------------------------------------------------------------
{
  const html = [
    "<html><body>",
    "<h2>Product details</h2>",
    "<li>Best Sellers Rank: see Amazon app for live rank</li>",
    '<span id="acrCustomerReviewText">3 customer reviews</span>',
    "</body></html>",
  ].join("\n");
  const r = parseBaseline(html);
  assert.strictEqual(r.no_bsr_line, false, "the label exists, this is not the no-line case");
  assert.strictEqual(r.bsr_main, null, "nothing invented");
  assert.strictEqual(r.status, "PARSE_INCOMPLETE", "unparseable BSR line on a real product page flags incomplete");
}

// -----------------------------------------------------------------------
// 12. Reviews missing entirely on an otherwise-parseable product page ->
//     PARSE_INCOMPLETE (a field genuinely missing, not the no-BSR exception).
// -----------------------------------------------------------------------
{
  const html = [
    "<html><body>",
    "<h2>Product details</h2>",
    '<li><span class="a-text-bold">Best Sellers Rank:</span>',
    "<span>#100,000 in Kindle Store</span></li>",
    "</body></html>",
  ].join("\n");
  const r = parseBaseline(html);
  assert.strictEqual(r.bsr_main, 100000);
  assert.strictEqual(r.reviews, null);
  assert.strictEqual(r.status, "PARSE_INCOMPLETE", "missing review count is a genuine gap, flagged");
}

console.log("ALL PASS — fetch-live-baseline");
