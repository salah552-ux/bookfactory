#!/usr/bin/env node
/**
 * AGENT-LOG AUTO-APPEND — SubagentStop hook
 * ------------------------------------------
 * After any subagent finishes, append a row to the central automation log so
 * the Architect always has a flat audit trail of every agent run, regardless
 * of whether the agent remembered to write to its own per-book AGENT-LOG.md.
 *
 * Writes to: automation/AGENT-LOG.md  (central, append-only)
 *
 * Hook contract: reads SubagentStop JSON from stdin. Always exits 0 (never
 * blocks). Fail-safe: any parse/IO error is swallowed.
 *
 * Row format (pipe table, matches the per-book AGENT-LOG.md convention):
 *   | timestamp | agent | summary | status |
 */
import { readFileSync, appendFileSync, existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG = join(__dirname, "..", "AGENT-LOG.md");
const HEADER =
  "# Central Agent Log — BookFactory\n\n" +
  "Append-only. Auto-written by automation/hooks/agent-log-append.mjs on every SubagentStop.\n\n" +
  "| Timestamp | Agent | Summary | Status |\n" +
  "|-----------|-------|---------|--------|\n";

function clean(s) {
  return String(s || "").replace(/[\r\n|]+/g, " ").trim().slice(0, 400);
}

try {
  const raw = readFileSync(0, "utf8");
  const p = JSON.parse(raw);

  const agent =
    p.subagent_type || p.agent_name || p.subagentType || p.agent || "subagent";

  // Best-effort summary from whatever the payload exposes.
  let summary =
    p.summary ||
    p.last_message ||
    p.result ||
    (p.tool_response && p.tool_response.summary) ||
    "(no summary in payload)";

  const status = /error|fail|blocked/i.test(JSON.stringify(p))
    ? "check"
    : "complete";

  const row = `| ${new Date().toISOString()} | ${clean(agent)} | ${clean(
    summary
  )} | ${status} |\n`;

  if (!existsSync(LOG)) writeFileSync(LOG, HEADER);
  appendFileSync(LOG, row);
} catch {
  // never block, never crash
}
process.exit(0);
