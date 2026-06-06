/**
 * Seeds cozy mystery ASINs and fetches BSR from Amazon UK product pages.
 */
const https = require("https");
const fs = require("fs");
const path = require("path");

const OUTPUT_PATH = path.join(__dirname, "harvested.json");

const COZY_PRODUCTS = [
  { asin: "B0BVFM9FBV", title: "The Thursday Murder Club", niche: "cozy mystery", marketplace: "UK" },
  { asin: "B09WQWTWZM", title: "The Marlow Murder Club", niche: "cozy mystery", marketplace: "UK" },
  { asin: "B0CGJL8QM9", title: "A Curious Incident at the Vicarage", niche: "cozy mystery", marketplace: "UK" },
  { asin: "B0CW1FQKMX", title: "A Very English Murder", niche: "cozy mystery", marketplace: "UK" },
  { asin: "B0D3ZNTTHF", title: "The Midsummer Murders", niche: "cozy mystery", marketplace: "UK" },
  { asin: "B09B4WLYCK", title: "Death at the Village Fete", niche: "cozy mystery", marketplace: "UK" },
  { asin: "B0BMQHCVKD", title: "Murder at the Book Club", niche: "cozy mystery", marketplace: "UK" },
  { asin: "B0C5KNFLWK", title: "A Cotswolds Murder", niche: "cozy mystery", marketplace: "UK" },
  { asin: "B0BX5BVBYB", title: "The Village Detective", niche: "cozy mystery", marketplace: "UK" },
  { asin: "B0CF4G9T7C", title: "Murder in the English Countryside", niche: "cozy mystery", marketplace: "UK" },
];

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "en-GB,en;q=0.9",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchPage(path) {
  return new Promise((resolve) => {
    const req = https.request({ hostname: "www.amazon.co.uk", path, headers: HEADERS }, (res) => {
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

function extractData(html) {
  const result = {};
  const bsrIdx = html.indexOf("Best Sellers Rank");
  if (bsrIdx > -1) {
    const section = html.substring(bsrIdx, bsrIdx + 2000);
    const overall = section.match(/([\d,]+)\s+in\s+(Kindle Store|Books)/i);
    if (overall) result.bsr_overall = parseNum(overall[1]);
    const subs = [...section.matchAll(/>\s*([\d,]+)\s+in\s+<a[^>]+>([^<]+)<\/a>/g)];
    if (subs[0]) { result.bsr_category1_rank = parseNum(subs[0][1]); result.bsr_category1 = subs[0][2].trim(); }
    if (subs[1]) { result.bsr_category2_rank = parseNum(subs[1][1]); result.bsr_category2 = subs[1][2].trim(); }
  }
  const rev = html.match(/([\d,]+)\s+(?:global\s+)?ratings/i);
  if (rev) result.review_count = parseNum(rev[1]);
  const rat = html.match(/([\d.]+) out of 5 stars/);
  if (rat) result.star_rating = parseFloat(rat[1]);
  // Kindle price
  const priceMatch = html.match(/kindle-price[\s\S]{0,300}?[£]([\d.]+)/i);
  if (priceMatch) result.price_ebook = parseFloat(priceMatch[1]);
  result.on_ku = /kindle.unlimited/i.test(html);
  // Title from page
  const titleMatch = html.match(/<title>([^:]+):/);
  if (titleMatch) result.title = titleMatch[1].trim();
  return result;
}

async function main() {
  let existing = [];
  if (fs.existsSync(OUTPUT_PATH)) {
    existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8"));
  }

  console.log(`Fetching BSR for ${COZY_PRODUCTS.length} cozy mystery products...\n`);
  const results = [];

  for (let i = 0; i < COZY_PRODUCTS.length; i++) {
    const p = { ...COZY_PRODUCTS[i], scraped_at: new Date().toISOString() };
    console.log(`[${i+1}/${COZY_PRODUCTS.length}] ${p.asin}`);
    const res = await fetchPage(`/dp/${p.asin}`);
    if (res.status === 200) {
      Object.assign(p, extractData(res.body));
      console.log(`  BSR: ${p.bsr_overall || "N/A"} | Reviews: ${p.review_count || "N/A"} | Price: £${p.price_ebook || "?"} | KU: ${p.on_ku}`);
    } else {
      console.log(`  [!] Status ${res.status}`);
    }
    results.push(p);
    await sleep(2000);
  }

  // Merge with existing (keep gut health, replace cozy)
  const merged = existing.filter(r => r.niche !== "cozy mystery").concat(results);
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2));
  console.log(`\nDone — ${results.length} cozy mystery products saved`);
}

main().catch(console.error);
