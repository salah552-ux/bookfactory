#!/usr/bin/env node
/**
 * KDP PUBLISH GUARD — PreToolUse hook
 * ------------------------------------
 * Blocks the kdp-upload-agent (or any tool call) from clicking the KDP
 * "Publish" button unless the Architect has typed the literal word PUBLISH
 * in the conversation, OR a publish approval flag file exists.
 *
 * How it decides a call is a "publish" action:
 *   - A Playwright browser_click whose target text/ref contains "Publish"
 *     (case-insensitive) AND matches a KDP publish control
 *     ("Publish Your Kindle eBook", "Publish Your Paperback", etc.)
 *
 * How approval is granted (any ONE of these):
 *   1. The Architect's most recent message contains the standalone word
 *      "PUBLISH" (the canonical verbal trigger — handled by the agent itself;
 *      this hook is the hard backstop).
 *   2. A flag file exists at automation/.publish-approved with a timestamp
 *      within the last 30 minutes. Create it with:
 *        node automation/hooks/grant-publish.mjs <book-slug>
 *
 * Hook contract:
 *   - Reads the tool-call JSON from stdin (Claude Code PreToolUse payload).
 *   - Exit 0 + no output  => allow.
 *   - Exit 2 + stderr msg  => BLOCK the tool call, surface the message.
 *
 * This is fail-safe: if it cannot parse the payload it ALLOWS (so it never
 * bricks normal operation), but it BLOCKS any unambiguous KDP publish click
 * lacking approval.
 */

import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FLAG = join(__dirname, "..", ".publish-approved");
const APPROVAL_WINDOW_MS = 30 * 60 * 1000;

function read(stream) {
  try {
    return readFileSync(stream, "utf8");
  } catch {
    return "";
  }
}

function approvalFlagValid() {
  if (!existsSync(FLAG)) return false;
  try {
    const age = Date.now() - statSync(FLAG).mtimeMs;
    return age <= APPROVAL_WINDOW_MS;
  } catch {
    return false;
  }
}

const raw = read(0); // stdin fd 0
let payload;
try {
  payload = JSON.parse(raw);
} catch {
  // Cannot parse — fail open (allow). Never brick the pipeline.
  process.exit(0);
}

const toolName = payload.tool_name || payload.toolName || "";
const input = payload.tool_input || payload.toolInput || payload.input || {};
const hay = JSON.stringify(input).toLowerCase();

// Only police Playwright click-type tools.
const isClick =
  /browser_click|browser_fill_form|browser_evaluate|browser_run_code/i.test(
    toolName
  );

// KDP publish controls. Plain "publish" elsewhere (e.g. "Publishing rights")
// must not trip the guard, so require a KDP publish-button phrase.
const isKdpPublish =
  /publish your kindle ebook|publish your paperback|publish your hardcover|"publish"\s*button|>\s*publish\b/.test(
    hay
  ) ||
  // Generic but high-signal: an element whose accessible name is exactly "publish"
  /\bpublish\b/.test(hay) && /kdp\.amazon|amazon\.com\/kdp|publish your/.test(hay);

if (!isClick || !isKdpPublish) {
  process.exit(0); // not a publish click — allow
}

if (approvalFlagValid()) {
  process.exit(0); // approved within window — allow
}

// BLOCK.
process.stderr.write(
  "KDP PUBLISH GUARD: blocked a click on the KDP Publish button.\n" +
    "No valid publish approval found.\n" +
    "To authorise: the Architect must type the literal word PUBLISH, then run\n" +
    "  node automation/hooks/grant-publish.mjs <book-slug>\n" +
    "which creates a 30-minute approval window. Re-run the upload after that.\n"
);
process.exit(2);
