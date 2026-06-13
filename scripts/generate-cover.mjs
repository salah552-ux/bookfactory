#!/usr/bin/env node
/*
 * generate-cover.mjs — automated AI cover generation via OpenAI gpt-image-1.
 *
 * This is the same image model behind ChatGPT's image generation, called over the API
 * so cover creation becomes a pipeline step instead of a manual hand-off.
 *
 * It reads the book's COVER-BRIEF.md for the locked concept, asks gpt-image-1 for a
 * portrait cover, then post-processes with sharp to the exact KDP spec
 * (1600x2560, sRGB, JPEG) and validates it.
 *
 * The API key is NEVER hardcoded — it is read from the OPENAI_API_KEY environment
 * variable. Without it, the script prints setup instructions and exits cleanly.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-...  node scripts/generate-cover.mjs <book-slug> [--prompt "override concept"] [--no-text]
 *
 * Output:
 *   books/<slug>/exports/cover/cover-ai-raw.png      (model output)
 *   books/<slug>/exports/cover/cover-kdp-ai.jpg      (KDP-spec, validated)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FACTORY = path.resolve(__dirname, "..");

const argv = process.argv.slice(2);
const slug = argv.find((a) => !a.startsWith("--"));
const promptOverride = (() => { const i = argv.indexOf("--prompt"); return i > -1 ? argv[i + 1] : null; })();
const noText = argv.includes("--no-text");

const KDP = { w: 1600, h: 2560 }; // portrait, ratio 1.6

function die(msg, code = 1) { console.error(msg); process.exit(code); }

if (!slug) die("Usage: node scripts/generate-cover.mjs <book-slug> [--prompt \"...\"] [--no-text]", 2);

const bookDir = path.join(FACTORY, "books", slug);
if (!fs.existsSync(bookDir)) die(`No book at ${bookDir}`, 2);

// ── API key check (never hardcoded) ──────────────────────────────────────────
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.log(`
OPENAI_API_KEY is not set — cannot call gpt-image-1.

To enable automated covers:
  1. Get a key at https://platform.openai.com/api-keys
  2. Run (PowerShell):   $env:OPENAI_API_KEY = "sk-..."
     or (git-bash):      export OPENAI_API_KEY="sk-..."
  3. Re-run:             node scripts/generate-cover.mjs ${slug}

The key is read from the environment only — this script never stores or commits it.
Add OPENAI_API_KEY to your shell profile (or a gitignored .env you source) to persist it.
`);
  process.exit(3);
}

// ── Build the image prompt from COVER-BRIEF.md ───────────────────────────────
function buildPrompt() {
  if (promptOverride) return promptOverride;
  const briefPath = path.join(bookDir, "COVER-BRIEF.md");
  let concept = "";
  if (fs.existsSync(briefPath)) {
    const t = fs.readFileSync(briefPath, "utf8");
    // pull the Creative Direction / concept lines if present
    const m = t.match(/##\s*1[^\n]*\n([\s\S]{0,1200})/i) || t.match(/Concept[:\s]+([\s\S]{0,600})/i);
    concept = (m ? m[1] : t.slice(0, 1000)).replace(/\s+/g, " ").trim();
  }
  // read title/author from pipeline-state for the text instruction
  let title = slug, author = "S.A. Ibrahim";
  try {
    const st = JSON.parse(fs.readFileSync(path.join(bookDir, "pipeline-state.json"), "utf8"));
    title = st.book_title || title;
  } catch { /* ignore */ }
  const textClause = noText
    ? "Do NOT render any text, letters, or words — produce artwork only; typography is added later."
    : `Render the title "${title}" and author "${author}" in clean, professional, correctly-spelled typography with strong contrast and thumbnail legibility.`;
  return [
    `A professional non-fiction book cover, portrait orientation, premium and trustworthy.`,
    concept ? `Concept and art direction: ${concept}` : "",
    textClause,
    `High contrast, legible at thumbnail size, no clutter, no stock-photo look, no watermark.`,
  ].filter(Boolean).join(" ");
}

const prompt = buildPrompt();
console.log(`\nGenerating cover for: ${slug}`);
console.log(`Prompt (${prompt.length} chars): ${prompt.slice(0, 220)}${prompt.length > 220 ? "…" : ""}\n`);

// ── Call gpt-image-1 ─────────────────────────────────────────────────────────
async function generate() {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1024x1536", n: 1, quality: "high" }),
  });
  if (!res.ok) {
    const body = await res.text();
    die(`OpenAI API error ${res.status}: ${body.slice(0, 500)}`, 1);
  }
  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) die("No image returned by the API.", 1);
  return Buffer.from(b64, "base64");
}

// ── Post-process to KDP spec + validate ──────────────────────────────────────
async function finalize(rawBuf) {
  let sharp;
  try { sharp = (await import("sharp")).default; }
  catch { die("sharp is not installed (npm i sharp). Raw image saved; manual resize needed.", 1); }

  const coverDir = path.join(bookDir, "exports", "cover");
  fs.mkdirSync(coverDir, { recursive: true });
  const rawPath = path.join(coverDir, "cover-ai-raw.png");
  fs.writeFileSync(rawPath, rawBuf);

  const outPath = path.join(coverDir, "cover-kdp-ai.jpg");
  await sharp(rawBuf)
    .resize(KDP.w, KDP.h, { fit: "cover", position: "centre" })
    .toColourspace("srgb")
    .jpeg({ quality: 90 })
    .toFile(outPath);

  const meta = await sharp(outPath).metadata();
  const stat = fs.statSync(outPath);
  const checks = [
    ["format", meta.format === "jpeg", meta.format],
    ["width 1600", meta.width === KDP.w, meta.width],
    ["height 2560", meta.height === KDP.h, meta.height],
    ["ratio 1.6", Math.abs(meta.height / meta.width - 1.6) < 0.001, (meta.height / meta.width).toFixed(3)],
    ["sRGB", (meta.space || "").includes("srgb"), meta.space],
    ["< 50MB", stat.size < 50 * 1024 * 1024, `${(stat.size / 1024).toFixed(0)} KB`],
  ];
  console.log("KDP spec validation:");
  let allPass = true;
  for (const [name, ok, val] of checks) { console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}  (${val})`); if (!ok) allPass = false; }
  console.log(`\nRaw:   ${rawPath}`);
  console.log(`Cover: ${outPath}`);
  console.log(allPass
    ? `\n✓ KDP-spec cover ready. Review it, then (if approved) replace exports/final/cover-kdp.jpg and rebuild.\n  Reminder: this is AI-generated — the KDP "Images" questionnaire field must declare it.`
    : `\n✗ Some checks failed — inspect before use.`);
  process.exit(allPass ? 0 : 1);
}

const buf = await generate();
await finalize(buf);
