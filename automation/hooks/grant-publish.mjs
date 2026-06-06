#!/usr/bin/env node
/**
 * GRANT PUBLISH — companion to kdp-publish-guard.mjs
 * Creates a 30-minute approval window so the next KDP publish click is allowed.
 * Usage:  node automation/hooks/grant-publish.mjs <book-slug>
 * The Architect should only run this AFTER typing the literal word PUBLISH.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FLAG = join(__dirname, "..", ".publish-approved");
const slug = process.argv[2] || "(unspecified)";
writeFileSync(
  FLAG,
  `approved_for=${slug}\ngranted_at=${new Date().toISOString()}\nwindow_minutes=30\n`
);
console.log(
  `Publish approval granted for "${slug}". Valid for 30 minutes. ` +
    `Flag: ${FLAG}`
);
