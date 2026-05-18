/**
 * Notification and activity logging. Both files are append-only markdown that
 * the author can read to see what the daemon has been doing.
 */
import fs from "node:fs/promises";
import type { HumanGate } from "./types.js";

export interface GateHit {
  ts: Date;
  book: string;
  gates: HumanGate[];
}

export interface ActivityEntry {
  ts: Date;
  book: string;
  action: "invoked" | "blocked" | "spend_cap" | "paused" | "no_state" | "error";
  detail?: string;
}

/**
 * Format a single notification entry. Pure function — exposed for tests.
 */
export function formatGateHit(hit: GateHit): string {
  const ts = hit.ts.toISOString();
  const lines: string[] = [];
  lines.push(`## ${ts} — \`${hit.book}\``);
  lines.push("");
  lines.push("Human gate awaiting action:");
  for (const g of hit.gates) {
    lines.push(`- **${g.name}**: ${g.description}`);
  }
  lines.push("");
  return lines.join("\n");
}

/**
 * Format an activity log entry. Pure function — exposed for tests.
 */
export function formatActivityEntry(entry: ActivityEntry): string {
  const ts = entry.ts.toISOString();
  const detail = entry.detail ? ` — ${entry.detail}` : "";
  return `- \`${ts}\` **${entry.book}** \`${entry.action}\`${detail}\n`;
}

export async function appendGateHit(
  notificationsFile: string,
  hit: GateHit
): Promise<void> {
  const block = formatGateHit(hit);
  await ensureHeader(
    notificationsFile,
    "# BookFactory Automation — Human Gate Notifications\n\n" +
      "The orchestrator daemon writes here when a book hits a gate that needs you.\n\n"
  );
  await fs.appendFile(notificationsFile, block, "utf8");
}

export async function appendActivityEntry(
  activityLogFile: string,
  entry: ActivityEntry
): Promise<void> {
  const line = formatActivityEntry(entry);
  await ensureHeader(
    activityLogFile,
    "# BookFactory Automation — Activity Log\n\n" +
      "Append-only log of every orchestrator daemon decision.\n\n"
  );
  await fs.appendFile(activityLogFile, line, "utf8");
}

async function ensureHeader(file: string, header: string): Promise<void> {
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, header, "utf8");
  }
}
