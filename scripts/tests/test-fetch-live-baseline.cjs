#!/usr/bin/env node
// Tests for fetch-live-baseline.cjs. Pure unit tests over synthetic HTML
// fixture strings built in-test — NO network, NO real book state touched.
const assert = require("assert");
const { parseBaseline, buildLoggerArgs, decideAndFallback } = require("../fetch-live-baseline.cjs");

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

// -----------------------------------------------------------------------
// 13. FIX 2 — scoped block detection: a genuine product page whose review
//     text happens to contain the literal phrase "Robot Check" must NOT be
//     misclassified BLOCKED. looksLikeProductPage must win over block
//     markers found anywhere in the body.
// -----------------------------------------------------------------------
{
  const html = [
    "<html><body>",
    "<h2>Product details</h2>",
    "<div>ASIN B0GXYLWS1W</div>",
    '<li><span class="a-text-bold">Best Sellers Rank:</span>',
    "<span>#48,210 in Books</span></li>",
    '<div id="reviews">',
    '<span class="review-text">I had to do a Robot Check when I tried to ',
    "reorder this on my phone, but the book itself is fantastic.</span>",
    "</div>",
    '<span id="acrCustomerReviewText">12 customer reviews</span>',
    "</body></html>",
  ].join("\n");
  const r = parseBaseline(html);
  assert.strictEqual(
    r.status,
    "OK",
    "a real product page is never BLOCKED just because 'Robot Check' appears in review text"
  );
  assert.strictEqual(r.bsr_main, 48210, "BSR still parsed correctly off the real product page");
  assert.strictEqual(r.reviews, 12);
}

// -----------------------------------------------------------------------
// 14–16. FIX 1 — decideAndFallback (async, so wrapped in an IIFE below).
//   14. Content-detected block: HTTP 200 (tier1.status === null) + a
//       robot-check body must still trigger the Tier-2 fallback attempt,
//       exactly like an HTTP-status-detected block does — only the page
//       CONTENT reveals this block, which only parseBaseline can see.
//   15. A genuinely OK Tier-1 result (HTTP 200 + real product page) must
//       NOT invoke Tier 2 at all — the unified decision point should not
//       fire needlessly.
//   16. An HTTP-status-detected block (503, tier1.status === "BLOCKED",
//       thin/empty body) that Tier 2 successfully recovers must return the
//       Tier-2 parse, with no fallback note — preserving the pre-existing
//       recovery path through the new unified decision point.
// -----------------------------------------------------------------------
async function runAsyncTests() {
  // 14.
  {
    const robotCheckHtml = [
      "<html><body>",
      "<h4>Sorry, we just need to make sure you're not a robot.</h4>",
      '<form action="/errors/validateCaptcha" method="get">',
      "<p>Enter the characters you see below</p>",
      "</form>",
      "</body></html>",
    ].join("\n");

    let tier2Calls = 0;
    const stubTier2Unavailable = async () => {
      tier2Calls++;
      return { available: false };
    };

    const tier1 = { status: null, html: robotCheckHtml }; // HTTP 200, block only visible in content
    const { parsed, fallback } = await decideAndFallback(tier1, stubTier2Unavailable);
    assert.strictEqual(tier2Calls, 1, "Tier 2 must be attempted for a content-detected block");
    assert.strictEqual(parsed.status, "BLOCKED", "final status is BLOCKED for a content-detected block");
    assert.strictEqual(
      fallback,
      "playwright unavailable",
      "fallback note present when Tier 2 is unavailable, matching the status-based path's behaviour"
    );
  }

  // 15.
  {
    const okHtml = [
      "<html><body>",
      "<h2>Product details</h2>",
      '<li><span class="a-text-bold">Best Sellers Rank:</span>',
      "<span>#100 in Kindle Store</span></li>",
      '<span id="acrCustomerReviewText">5 customer reviews</span>',
      "</body></html>",
    ].join("\n");

    let tier2Calls = 0;
    const stubTier2 = async () => {
      tier2Calls++;
      return { available: false };
    };

    const tier1 = { status: null, html: okHtml };
    const { parsed, fallback } = await decideAndFallback(tier1, stubTier2);
    assert.strictEqual(tier2Calls, 0, "Tier 2 must not be invoked when Tier 1 already parsed OK");
    assert.strictEqual(parsed.status, "OK");
    assert.strictEqual(parsed.bsr_main, 100);
    assert.strictEqual(fallback, null);
  }

  // 16.
  {
    const recoveredHtml = [
      "<html><body>",
      "<h2>Product details</h2>",
      '<li><span class="a-text-bold">Best Sellers Rank:</span>',
      "<span>#7 in Kindle Store</span></li>",
      '<span id="acrCustomerReviewText">9 customer reviews</span>',
      "</body></html>",
    ].join("\n");

    const stubTier2Recovered = async () => ({ available: true, html: recoveredHtml });

    const tier1 = { status: "BLOCKED", html: "" }; // e.g. HTTP 503, thin body
    const { parsed, fallback } = await decideAndFallback(tier1, stubTier2Recovered);
    assert.strictEqual(parsed.status, "OK", "Tier 2 recovery still works through the unified decision point");
    assert.strictEqual(parsed.bsr_main, 7);
    assert.strictEqual(fallback, null, "no fallback note when Tier 2 successfully recovered the page");
  }
}

// -----------------------------------------------------------------------
// 17. FIX 4 — parseReviews must never surface a non-finite parseInt result.
//     A malformed acrCustomerReviewText value ("," with no digits) matches
//     the loose [\d,]+ shape but parseInt('', 10) is NaN — the guard must
//     fall through to the generic scan (which, here, hits the same
//     malformed text and also fails its guard) and land on null, not NaN.
//     NaN is worse than null: JSON.stringify keeps `reviews: null` visibly
//     honest, whereas `reviews: NaN` would silently pass buildLoggerArgs'
//     `!== null` check and get logged as the literal string "--reviews NaN".
// -----------------------------------------------------------------------
{
  const html = [
    "<html><body>",
    "<h2>Product details</h2>",
    '<span id="acrCustomerReviewText">, customer reviews</span>',
    "</body></html>",
  ].join("\n");
  const r = parseBaseline(html);
  assert.strictEqual(r.reviews, null, "a malformed review count must guard to null, never NaN");
}

// -----------------------------------------------------------------------
// 18. UK no-hash BSR block: live amazon.co.uk (B0CTCBR3VB, fetched
//     2026-07-11) has NO "#" before any rank — "42,191 in Kindle Store
//     ( See Top 100 in Kindle Store ) 1 in Public Health & Preventive
//     Medicine 4 in General Medical Issues Guides 8 in Natural Foods".
//     The "(" See Top 100 "..." parenthetical must not be swallowed into a
//     category name, and its own stray digits ("100") must never be
//     mistaken for a rank.
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
    "42,191 in Kindle Store ( See Top 100 in Kindle Store )",
    '<ul class="zg_hrsr">',
    '<li class="zg_hrsr_item">',
    '<span class="zg_hrsr_rank">1</span> in ',
    '<a href="/gp/bestsellers/x">Public Health &amp; Preventive Medicine</a>',
    "</li>",
    '<li class="zg_hrsr_item">',
    '<span class="zg_hrsr_rank">4</span> in ',
    '<a href="/gp/bestsellers/x">General Medical Issues Guides</a>',
    "</li>",
    '<li class="zg_hrsr_item">',
    '<span class="zg_hrsr_rank">8</span> in ',
    '<a href="/gp/bestsellers/x">Natural Foods</a>',
    "</li>",
    "</ul>",
    "</span>",
    "</span>",
    "</li>",
    "</ul>",
    "</div>",
    "<h2>Product details</h2>",
    "<div>ASIN B0CTCBR3VB</div>",
    '<span id="acrCustomerReviewText">7,810 ratings</span>',
    "</body></html>",
  ].join("\n");

  const r = parseBaseline(html);
  assert.strictEqual(r.bsr_main, 42191, "UK no-hash main BSR parsed as integer, commas stripped");
  assert.strictEqual(r.sub_ranks.length, 3, "three UK no-hash sub-ranks found");
  assert.deepStrictEqual(
    r.sub_ranks.map((s) => s.rank),
    [1, 4, 8],
    "sub-rank numbers parsed without a '#' prefix"
  );
  assert.ok(/Public Health & Preventive Medicine/.test(r.sub_ranks[0].category), "sub-rank 1 category captured");
  assert.ok(/General Medical Issues Guides/.test(r.sub_ranks[1].category), "sub-rank 2 category captured");
  assert.ok(/Natural Foods/.test(r.sub_ranks[2].category), "sub-rank 3 category captured");
  assert.ok(!/See Top 100/.test(r.sub_ranks[0].category), "the '(See Top 100...)' aside never leaks into a category");
  assert.strictEqual(r.status, "OK");
}

// -----------------------------------------------------------------------
// 19. Review count precedence is scoped to the FIRST acrCustomerReviewText
//     element only — carousel-contaminated body text (multiple stray
//     "<n> ratings" strings from related-product widgets) must never be
//     picked up. Reuses the UK no-hash BSR block from test 18 plus a real
//     acrCustomerReviewText element ("7,810 ratings") and several stray
//     carousel counts before and after it in the body.
// -----------------------------------------------------------------------
{
  const html = [
    "<html><body>",
    '<div id="carousel-top">',
    '<div class="carousel-item"><span>188 ratings</span></div>',
    '<div class="carousel-item"><span>248 ratings</span></div>',
    "</div>",
    '<div id="averageCustomerReviews_feature_div">',
    '<span id="acrCustomerReviewText">7,810 ratings</span>',
    "</div>",
    "<h2>Product details</h2>",
    "<div>ASIN B0CTCBR3VB</div>",
    '<div id="detailBulletsWrapper_feature_div">',
    '<ul class="detail-bullet-list">',
    "<li>",
    '<span class="a-list-item">',
    '<span class="a-text-bold">Best Sellers Rank:</span>',
    "<span>",
    "42,191 in Kindle Store ( See Top 100 in Kindle Store )",
    '<ul class="zg_hrsr">',
    '<li class="zg_hrsr_item">',
    '<span class="zg_hrsr_rank">1</span> in ',
    '<a href="/gp/bestsellers/x">Public Health &amp; Preventive Medicine</a>',
    "</li>",
    '<li class="zg_hrsr_item">',
    '<span class="zg_hrsr_rank">4</span> in ',
    '<a href="/gp/bestsellers/x">General Medical Issues Guides</a>',
    "</li>",
    '<li class="zg_hrsr_item">',
    '<span class="zg_hrsr_rank">8</span> in ',
    '<a href="/gp/bestsellers/x">Natural Foods</a>',
    "</li>",
    "</ul>",
    "</span>",
    "</span>",
    "</li>",
    "</ul>",
    "</div>",
    '<div id="also-bought-carousel">',
    '<div class="carousel-item"><span>409 ratings</span></div>',
    '<div class="carousel-item"><span>77 ratings</span></div>',
    "</div>",
    "</body></html>",
  ].join("\n");

  const r = parseBaseline(html);
  assert.strictEqual(r.reviews, 7810, "main product's acrCustomerReviewText count used, not a carousel stray count");
  assert.strictEqual(r.bsr_main, 42191, "BSR still parses correctly alongside the carousel noise");
  assert.strictEqual(r.status, "OK");
}

runAsyncTests()
  .then(() => {
    console.log("ALL PASS — fetch-live-baseline");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
