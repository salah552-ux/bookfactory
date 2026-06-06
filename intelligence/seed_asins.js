/**
 * Seeds known ASINs from Playwright session + fetches BSR from product pages.
 * Uses ASINs already captured, fetches full product data.
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const OUTPUT_PATH = path.join(__dirname, "harvested.json");

// ASINs captured from Playwright browser_evaluate on Amazon UK
const SEED_PRODUCTS = [
  { asin: "B0GFX8K9GQ", title: "Gut: The 8-million-copy #1 bestseller", price_ebook: 5.99, star_rating: null, niche: "gut health", marketplace: "UK" },
  { asin: "B0C888GXWL", title: "Gut Fix: Discover the herbal remedies, diet tips, and supplements", price_ebook: 0.00, star_rating: 4.4, niche: "gut health", marketplace: "UK" },
  { asin: "B0CTCBR3VB", title: "The Food For Life Cookbook", price_ebook: 1.99, star_rating: 4.4, niche: "gut health", marketplace: "UK" },
  { asin: "B073DPZHL5", title: "The Clever Guts Diet Recipe Book", price_ebook: 2.99, star_rating: 4.5, niche: "gut health", marketplace: "UK" },
  { asin: "B06XGP7WZX", title: "The Clever Guts Diet", price_ebook: 4.99, star_rating: 4.5, niche: "gut health", marketplace: "UK" },
  { asin: "B0D5CS2F23", title: "The 20-Minute Gut Health Fix", price_ebook: 12.99, star_rating: 4.4, niche: "gut health", marketplace: "UK" },
  { asin: "B0C91NC6MS", title: "The 4-Week Gut Health Protocol for Beginners", price_ebook: 13.99, star_rating: 4.4, niche: "gut health", marketplace: "UK" },
  { asin: "B0FYJHG4MP", title: "Gut Health and Mental Clarity: A Simple Microbiome Reset Plan", price_ebook: 0.00, star_rating: 4.2, niche: "gut health", marketplace: "UK" },
  { asin: "B09FDDVJQD", title: "Super Gut: A Four-Week Plan to Reprogram Your Microbiome", price_ebook: 9.99, star_rating: 4.6, niche: "gut health", marketplace: "UK" },
  { asin: "B0GQJ32FKZ", title: "A Powerful Guide to Gut Health", price_ebook: 0.00, star_rating: 5.0, niche: "gut health", marketplace: "UK" },
  { asin: "B0FJYKYTN5", title: "Self Health Gut Guide", price_ebook: 0.00, star_rating: 4.6, niche: "gut health", marketplace: "UK" },
  { asin: "B0FMQ1MQPY", title: "The Complete Low-FODMAP Diet Cookbook", price_ebook: 13.99, star_rating: 4.2, niche: "gut health", marketplace: "UK" },
  { asin: "B0CNBYT8Z5", title: "The Science-Backed Anti-Inflammatory Diet for Beginners", price_ebook: 0.00, star_rating: 4.1, niche: "gut health", marketplace: "UK" },
  { asin: "B0CM1X6C33", title: "The Gut Stuff", price_ebook: 9.99, star_rating: 4.2, niche: "gut health", marketplace: "UK" },
  { asin: "B0DYJHFHQ1", title: "Gut Health for Beginners: Boost Energy, Balance Weight", price_ebook: 0.00, star_rating: 4.8, niche: "gut health", marketplace: "UK" },
  { asin: "B0F9FQ59GN", title: "Gut Health Beyond Basics", price_ebook: 0.00, star_rating: 4.4, niche: "gut health", marketplace: "UK" },
  { asin: "B0FXTFPCMY", title: "The Power of Gut Health", price_ebook: 4.99, star_rating: 4.7, niche: "gut health", marketplace: "UK" },
  { asin: "B09QHT4ND5", title: "What Every Woman Needs to Know About Her Gut", price_ebook: 2.99, star_rating: 4.4, niche: "gut health", marketplace: "UK" },
  { asin: "B075JDWB8R", title: "The Mind-Gut Connection", price_ebook: 8.99, star_rating: 4.5, niche: "gut health", marketplace: "UK" },
  { asin: "1916662226", title: "The Complete Guide to Taming Chronic Inflammation", price_ebook: 11.38, star_rating: 4.3, niche: "gut health", marketplace: "UK" },
];

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "en-GB,en;q=0.9",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Connection": "keep-alive",
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchPage(hostname, urlPath) {
  return new Promise((resolve) => {
    const req = https.request({ hostname, path: urlPath, headers: HEADERS }, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", () => resolve({ status: 0, body: "" }));
    req.setTimeout(15000, () => { req.destroy(); resolve({ status: 0, body: "" }); });
    req.end();
  });
}

function parseNum(text) {
  if (!text) return null;
  const m = String(text).match(/([\d,]+)/);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : null;
}

function extractBSR(html) {
  const result = {};
  const idx = html.indexOf("Best Sellers Rank");
  if (idx === -1) return result;

  const section = html.substring(idx, idx + 2000);

  // Overall rank: "93,113 in Kindle Store"
  const overallMatch = section.match(/([\d,]+)\s+in\s+(Kindle Store|Books)/i);
  if (overallMatch) {
    result.bsr_overall = parseNum(overallMatch[1]);
    result.bsr_category1 = overallMatch[2].trim();
  }

  // Sub-category ranks from zg_hrsr list: "33 in Natural Foods"
  const subPattern = />\s*([\d,]+)\s+in\s+<a[^>]+>([^<]+)<\/a>/g;
  const subMatches = [];
  let m;
  while ((m = subPattern.exec(section)) !== null && subMatches.length < 2) {
    subMatches.push({ rank: parseNum(m[1]), cat: m[2].trim() });
  }
  if (subMatches[0]) {
    result.bsr_category1_rank = subMatches[0].rank;
    result.bsr_category1 = subMatches[0].cat;
  }
  if (subMatches[1]) {
    result.bsr_category2_rank = subMatches[1].rank;
    result.bsr_category2 = subMatches[1].cat;
  }

  return result;
}

function extractReviews(html) {
  const m = html.match(/([\d,]+)\s+(?:global\s+)?ratings/i);
  return m ? parseNum(m[1]) : null;
}

function extractKU(html) {
  return /kindle.unlimited/i.test(html) && !/not.available/i.test(html.substring(html.indexOf("kindle.unlimited") - 100, html.indexOf("kindle.unlimited") + 100));
}

async function main() {
  console.log(`Fetching BSR data for ${SEED_PRODUCTS.length} seeded products...\n`);
  const enriched = [];

  for (let i = 0; i < SEED_PRODUCTS.length; i++) {
    const p = { ...SEED_PRODUCTS[i], scraped_at: new Date().toISOString() };
    console.log(`[${i+1}/${SEED_PRODUCTS.length}] ${p.asin} - ${p.title.substring(0, 45)}...`);

    const res = await fetchPage("www.amazon.co.uk", `/dp/${p.asin}`);
    if (res.status === 200) {
      const bsr = extractBSR(res.body);
      Object.assign(p, bsr);
      const reviews = extractReviews(res.body);
      if (reviews) p.review_count = reviews;
      p.on_ku = extractKU(res.body);
      console.log(`  BSR: ${p.bsr_overall || "N/A"} | Reviews: ${p.review_count || "N/A"} | KU: ${p.on_ku}`);
    } else {
      console.log(`  [!] Status ${res.status} - no BSR data`);
    }

    enriched.push(p);
    await sleep(2000);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(enriched, null, 2));
  console.log(`\nDone — ${enriched.length} products saved to ${OUTPUT_PATH}`);
}

main().catch(console.error);
