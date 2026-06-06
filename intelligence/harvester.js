/**
 * Amazon KDP Intelligence Harvester (Node.js) — REFERENCE ONLY
 * ==============================================================
 * WARNING: This script uses raw https.request for scraping.
 * Amazon detects and blocks this approach (CAPTCHA / 503 / empty results)
 * almost immediately on any substantive request volume.
 *
 * THE ACTUAL HARVEST METHOD is the harvester-agent.md agent, which uses
 * Playwright's browser_evaluate() inside a real browser session. This JS file
 * is kept as a reference for the parsing logic only.
 *
 * DO NOT run this script expecting it to successfully harvest Amazon data.
 * Use: `harvest [niche]` to invoke the real harvester-agent via Playwright.
 *
 * Original run intent: node intelligence/harvester.js [niche] [marketplace]
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const NICHES_PATH = path.join(__dirname, "niches.json");
const OUTPUT_PATH = path.join(__dirname, "harvested.json");

const MARKETPLACES = {
  UK: "www.amazon.co.uk",
  US: "www.amazon.com",
};

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "en-GB,en;q=0.9",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Cache-Control": "max-age=0",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchPage(hostname, path) {
  return new Promise((resolve) => {
    const options = { hostname, path, method: "GET", headers: HEADERS };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", () => resolve({ status: 0, body: "" }));
    req.setTimeout(15000, () => {
      req.destroy();
      resolve({ status: 0, body: "" });
    });
    req.end();
  });
}

function extractText(html, regex) {
  const m = html.match(regex);
  return m ? m[1].replace(/&#\d+;/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').trim() : null;
}

function parsePrice(text) {
  if (!text) return null;
  const m = text.match(/([\d,]+\.?\d*)/);
  return m ? parseFloat(m[1].replace(",", "")) : null;
}

function parseNum(text) {
  if (!text) return null;
  const m = text.match(/([\d,]+)/);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : null;
}

function scrapeSearchResults(html) {
  const products = [];
  const seen = new Set();

  // Extract all [data-asin] blocks
  const asinBlocks = html.match(/data-asin="([A-Z0-9]{10})"[^>]*>[\s\S]{0,3000}?(?=data-asin="|<\/div>\s*<\/div>\s*<\/div>\s*<div[^>]*s-result-item)/g) || [];

  // Simpler: find all ASINs and their surrounding context
  const asinPattern = /data-asin="([A-Z0-9]{10})"/g;
  let match;
  while ((match = asinPattern.exec(html)) !== null) {
    const asin = match[1];
    if (seen.has(asin)) continue;
    seen.add(asin);

    // Get context around this ASIN (next 2000 chars)
    const ctx = html.substring(match.index, match.index + 2000);

    // Title
    const titleMatch = ctx.match(/class="a-size-medium[^"]*"[^>]*>\s*([^<]{5,200})</);
    const title = titleMatch ? titleMatch[1].replace(/&amp;/g, "&").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n)).trim() : null;
    if (!title || title.length < 5) continue;

    // Price
    const priceMatch = ctx.match(/a-offscreen">\s*[£$]([\d,.]+)</);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(",", "")) : null;

    // Rating
    const ratingMatch = ctx.match(/(\d+\.?\d*) out of 5 stars/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

    // Review count
    const reviewMatch = ctx.match(/(\d[\d,]*)\s*(?:rating|review)/i);
    const reviews = reviewMatch ? parseNum(reviewMatch[1]) : null;

    // KU
    const ku = /Kindle Unlimited|a-badge-supplemental/i.test(ctx);

    products.push({ asin, title, price_ebook: price, star_rating: rating, review_count: reviews, on_ku: ku });
  }

  return products;
}

function scrapeProductPage(html, asin) {
  const result = { asin };

  // BSR — look for Best Sellers Rank section
  const bsrSection = html.match(/Best Sellers Rank[\s\S]{0,2000}?(?=<\/ul>|<\/div>|Customers who)/i);
  if (bsrSection) {
    const rankMatches = bsrSection[0].match(/#([\d,]+)\s+in\s+([^<(]+)/g) || [];
    if (rankMatches.length > 0) {
      const first = rankMatches[0].match(/#([\d,]+)\s+in\s+(.+)/);
      if (first) {
        result.bsr_overall = parseNum(first[1]);
        result.bsr_category1 = first[2].trim().replace(/&amp;/g, "&");
      }
      if (rankMatches.length > 1) {
        const second = rankMatches[1].match(/#([\d,]+)\s+in\s+(.+)/);
        if (second) {
          result.bsr_category2_rank = parseNum(second[1]);
          result.bsr_category2 = second[2].trim().replace(/&amp;/g, "&");
        }
      }
    }
  }

  // Review count
  const reviewMatch = html.match(/([\d,]+)\s*(?:global\s+)?ratings?/i);
  if (reviewMatch) result.review_count = parseNum(reviewMatch[1]);

  // Rating
  const ratingMatch = html.match(/([\d.]+) out of 5 stars/);
  if (ratingMatch) result.star_rating = parseFloat(ratingMatch[1]);

  // Kindle price
  const priceMatch = html.match(/kindle-price[\s\S]{0,500}?[£$]([\d,.]+)/i) ||
                     html.match(/Buy now with[^£$]*[£$]([\d,.]+)/i);
  if (priceMatch) result.price_ebook = parseFloat(priceMatch[1].replace(",", ""));

  // KU
  result.on_ku = /kindle.unlimited/i.test(html);

  // Pages
  const pagesMatch = html.match(/([\d,]+)\s*pages?/i);
  if (pagesMatch) result.page_count = parseNum(pagesMatch[1]);

  // Pub date
  const dateMatch = html.match(/(?:Publication date|Date first available)[^:]*:\s*([^<\n]+)/i);
  if (dateMatch) result.pub_date = dateMatch[1].trim();

  return result;
}

async function harvestNiche(niche, marketplace) {
  const host = MARKETPLACES[marketplace];
  const results = [];

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Harvesting: ${niche.name} | ${marketplace}`);
  console.log("=".repeat(50));

  const allProducts = new Map();

  for (const term of niche.search_terms.slice(0, 3)) {
    const encoded = encodeURIComponent(term);
    const searchPath = `/s?k=${encoded}&i=digital-text`;
    console.log(`\n  Searching: "${term}"`);

    const res = await fetchPage(host, searchPath);
    if (res.status !== 200) {
      console.log(`  [!] Got status ${res.status} for "${term}"`);
      await sleep(3000);
      continue;
    }

    const products = scrapeSearchResults(res.body);
    console.log(`  Found ${products.length} products`);
    for (const p of products) {
      if (!allProducts.has(p.asin)) allProducts.set(p.asin, p);
    }

    await sleep(2000);
  }

  console.log(`\n  Total unique: ${allProducts.size}`);
  const productList = Array.from(allProducts.values());

  // Get BSR for top 20
  const top20 = productList.slice(0, 20);
  console.log(`  Getting BSR for ${top20.length} products...`);

  for (let i = 0; i < top20.length; i++) {
    const p = top20[i];
    console.log(`  [${i + 1}/${top20.length}] ${p.asin} - ${(p.title || "").substring(0, 45)}...`);
    const bsrRes = await fetchPage(host, `/dp/${p.asin}`);
    if (bsrRes.status === 200) {
      const bsrData = scrapeProductPage(bsrRes.body, p.asin);
      Object.assign(p, bsrData);
      console.log(`    BSR: ${p.bsr_overall || "N/A"} | Reviews: ${p.review_count || "N/A"} | KU: ${p.on_ku || false}`);
    } else {
      console.log(`    [!] Could not fetch product page (status: ${bsrRes.status})`);
    }
    await sleep(1500);
  }

  for (const p of productList) {
    results.push({
      ...p,
      niche: niche.name,
      marketplace,
      scraped_at: new Date().toISOString(),
    });
  }

  return results;
}

async function main() {
  const niches = JSON.parse(fs.readFileSync(NICHES_PATH, "utf8")).niches;
  const targetNiche = process.argv[2] || null;
  const targetMarketplace = process.argv[3] || null;

  let allResults = [];

  // Load existing results if any
  if (fs.existsSync(OUTPUT_PATH)) {
    allResults = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8"));
    console.log(`Loaded ${allResults.length} existing records`);
  }

  for (const niche of niches) {
    if (targetNiche && niche.name !== targetNiche) continue;
    for (const marketplace of niche.marketplaces) {
      if (targetMarketplace && marketplace !== targetMarketplace) continue;
      const results = await harvestNiche(niche, marketplace);
      allResults = allResults.filter(
        (r) => !(r.niche === niche.name && r.marketplace === marketplace)
      );
      allResults.push(...results);
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allResults, null, 2));
  console.log(`\n${"=".repeat(50)}`);
  console.log(`HARVEST COMPLETE — ${allResults.length} total products`);
  console.log(`Saved to: ${OUTPUT_PATH}`);
  console.log("=".repeat(50));
}

main().catch(console.error);
