import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

config({ path: "c:/Users/salah/BookFactory/.env" });

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const COVER_PROMPT = `A typography-led nonfiction book cover with NO illustration and NO photography of humans, food, or anatomy. The composition is a vertical 5:8 portrait with a deep ink-navy background field (#0E1B2C) occupying the entire canvas. The layout is a strict centered editorial grid with generous margins (8% on left/right, 7% top, 9% bottom). Top third: a large two-line display title reading "STOP" on line one and "RELAPSING" on line two, in a high-contrast transitional serif (Libre Baskerville Bold), bone-white color (#F3EEE3), tight tracking, each line filling roughly 80% of the cover width. A single thin horizontal rule in oxblood red (#7A1E1E) cuts through the middle of the word "RELAPSING" like a clean editor's strike-through — the rule is precise, 2px at output resolution, and does not extend past the letterforms. Middle third: empty negative space for quiet, except for a small oxblood rule (30% of cover width, centered) sitting above a two-line subtitle in bone-white Libre Baskerville small caps, letter-spaced wide: first line reads "THE 4-PHASE SIBO PROTOCOL" with the word "SIBO" set one point size larger than the surrounding words so it remains legible at thumbnail scale; second line reads "FOR ROOT CAUSE RECOVERY". Bottom eighth: the author name "S.A. IBRAHIM" in Libre Baskerville small caps, desaturated gold (#C8A15A), centered, small. Beneath it, a tiny "REFLEX PRESS" mark in the same gold, half the size. Lighting and mood: Flat, even, editorial — no gradients, no vignettes, no drop shadows on the type. The surface should feel like matte hardback book cloth with an extremely subtle fine linen texture. Mood: investigative nonfiction, clinical authority, controlled fury. Color: Dominant deep ink navy #0E1B2C. Primary type bone white #F3EEE3. Single accent oxblood #7A1E1E used only on the strike-through rule and the small rule above subtitle. Tertiary desaturated gold #C8A15A for author name and imprint. No other colors. No gradients. Style: Typography-led editorial nonfiction book cover in the tradition of serious narrative nonfiction (Empire of Pain, Why We Sleep). Not illustrated. Not photographic. Not wellness. Negative constraints: NO gut or intestine imagery. NO anatomical illustration. NO photograph of a person, food, or kitchen. NO sage green, terracotta, or pastel colors. NO script font. NO gradient background. NO drop shadow on title. NO watercolor. NO stethoscope or pill. NO stock-photo look. Output format: portrait orientation, high resolution, print-ready, suitable for KDP book cover.`;

const VARIATION_A = `Same deep ink navy (#0E1B2C) background. Same type system (Libre Baskerville Bold). Flush-left composition: a vertical oxblood rule (#7A1E1E) runs the full height of the cover along the left margin (8% from edge). "STOP" and "RELAPSING" stack tight to the right of this vertical rule, flush-left, top third of cover, bone white (#F3EEE3), very large. A second small horizontal oxblood rule crosses only the word "RELAPSING" from the vertical rule rightward. Subtitle sits bottom-left above author name: "THE 4-PHASE SIBO PROTOCOL / FOR ROOT CAUSE RECOVERY" in small caps, bone white. "S.A. IBRAHIM" and "REFLEX PRESS" flush-left, desaturated gold (#C8A15A), bottom. Feels like a journal or monograph. Same negative constraints as main prompt: no gut imagery, no anatomy, no photos, no wellness aesthetic.`;

const VARIATION_B = `Same deep ink navy (#0E1B2C) background. Same type system. Centered composition but with a visible grid: thin oxblood horizontal rules (#7A1E1E) mark the top and bottom thirds of the cover like chapter dividers in a clinical report. "FIX YOUR GUT FOR GOOD" sits above the top rule in Libre Baskerville small caps, desaturated gold (#C8A15A), very small — series branding line. Below the top rule: "STOP" in massive Libre Baskerville Bold, bone white, fills the full width. "RELAPSING" directly beneath, same scale, with the strike-through rule. Between the two horizontal rules: subtitle "THE 4-PHASE SIBO PROTOCOL FOR ROOT CAUSE RECOVERY" in small caps. Below the bottom rule: "S.A. IBRAHIM / REFLEX PRESS" in gold small caps. Same negative constraints: no gut imagery, no anatomy, no photos, no wellness aesthetic.`;

async function generateCover(prompt, filename) {
  console.log(`Generating: ${filename}...`);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        responseModalities: ["IMAGE"],
      },
    });

    const outputDir = "c:/Users/salah/BookFactory/books/fix-your-gut-for-good/exports/cover";
    mkdirSync(outputDir, { recursive: true });

    const parts = response.candidates[0].content.parts;
    const imagePart = parts.find(p => p.inlineData);
    if (!imagePart) throw new Error("No image in response");

    const buffer = Buffer.from(imagePart.inlineData.data, "base64");
    const filepath = join(outputDir, filename);
    writeFileSync(filepath, buffer);
    console.log(`✅ Saved: ${filepath}`);
    return filepath;
  } catch (err) {
    console.error(`❌ Error generating ${filename}:`, err.message);
    throw err;
  }
}

async function main() {
  console.log("Fix Your Gut for Good — Cover Generation");
  console.log("=========================================");

  await generateCover(COVER_PROMPT, "cover-main.png");
  await generateCover(VARIATION_A, "cover-variation-a.png");
  await generateCover(VARIATION_B, "cover-variation-b.png");

  console.log("\n✅ All covers generated.");
  console.log("📁 Location: books/fix-your-gut-for-good/exports/cover/");
}

main();
