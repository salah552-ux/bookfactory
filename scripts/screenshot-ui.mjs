// Render every UI route to a PNG. Run from anywhere; uses globally
// installed playwright.
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import fs from "node:fs/promises";
import path from "node:path";

const OUT = "/home/user/bookfactory/.screenshots";
const BASE = "http://127.0.0.1:5173";

const PAGES = [
  { name: "01-fleet", path: "/" },
  { name: "02-agents", path: "/agents" },
  { name: "03-runs", path: "/runs" },
  { name: "04-demo", path: "/demo" },
  { name: "05-settings", path: "/settings" },
  { name: "06-book-hub", path: "/books/fix-your-gut-for-good" },
  { name: "07-book-writing", path: "/books/fix-your-gut-for-good/writing" },
  { name: "08-book-files", path: "/books/fix-your-gut-for-good/files" },
  { name: "09-book-state", path: "/books/untitled-cosy-mystery/state" },
  { name: "13-stage-research", path: "/books/fix-your-gut-for-good/stage/01-research" },
  { name: "14-stage-planning", path: "/books/fix-your-gut-for-good/stage/02-planning" },
  { name: "15-stage-quality", path: "/books/fix-your-gut-for-good/stage/04-quality" },
  { name: "16-stage-production", path: "/books/fix-your-gut-for-good/stage/06-production" },
  { name: "17-stage-publishing", path: "/books/fix-your-gut-for-good/stage/07-publishing" },
  { name: "18-stage-postlaunch", path: "/books/fix-your-gut-for-good/stage/10-postlaunch" },
  { name: "19-new-book", path: "/books/new" },
  { name: "20-series", path: "/series" },
];

await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();

// Surface console errors so we can debug if anything goes wrong.
page.on("pageerror", (e) => console.error("[pageerror]", e.message));
page.on("console", (m) => {
  if (m.type() === "error") console.warn("[console error]", m.text());
});

for (const { name, path: p } of PAGES) {
  const url = BASE + p;
  console.log("→", url);
  await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
  // Give WS time to populate.
  await page.waitForTimeout(1500);
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log("  saved", file);
}

// Bonus: open the writing page and click into a chapter to capture the pipeline UI.
await page.goto(`${BASE}/books/fix-your-gut-for-good/writing`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
const firstChapter = page.locator("button:has-text('01-chapter-1.md')").first();
if (await firstChapter.count()) {
  await firstChapter.click();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(OUT, "10-chapter-pipeline.png"),
    fullPage: true,
  });
  console.log("  saved 10-chapter-pipeline.png");
}

// Bonus: open the agent runner modal.
await page.goto(`${BASE}/agents`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
const firstRunBtn = page.locator("button:has-text('Run')").first();
if (await firstRunBtn.count()) {
  await firstRunBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(OUT, "11-agent-runner-modal.png"),
    fullPage: false,
  });
  console.log("  saved 11-agent-runner-modal.png");
}

// Bonus: open the publish gate modal.
await page.goto(`${BASE}/books/fix-your-gut-for-good`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const publishBtn = page.locator("button:has-text('Publish gate')").first();
if (await publishBtn.count()) {
  await publishBtn.click();
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(OUT, "12-publish-gate.png"),
    fullPage: false,
  });
  console.log("  saved 12-publish-gate.png");
}

await browser.close();
console.log("done");
