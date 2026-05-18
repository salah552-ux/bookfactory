/**
 * Per-book spend tracking. Each book has a .spend-log.json that records every
 * orchestrator invocation. The daemon enforces a per-day cap so a runaway loop
 * cannot burn the API budget overnight.
 */
import fs from "node:fs/promises";
import path from "node:path";
import type { SpendLog, SpendLogEntry } from "./types.js";

export function spendLogPath(bookDir: string): string {
  return path.join(bookDir, ".spend-log.json");
}

export async function readSpendLog(bookDir: string): Promise<SpendLog> {
  try {
    const raw = await fs.readFile(spendLogPath(bookDir), "utf8");
    const parsed = JSON.parse(raw) as Partial<SpendLog>;
    if (!parsed || !Array.isArray(parsed.entries)) {
      return { entries: [] };
    }
    return { entries: parsed.entries };
  } catch {
    return { entries: [] };
  }
}

export async function appendSpendEntry(
  bookDir: string,
  entry: SpendLogEntry
): Promise<void> {
  const log = await readSpendLog(bookDir);
  log.entries.push(entry);
  // Keep the file bounded — 5000 entries is far more than a book will ever
  // produce, but a stuck daemon could theoretically grow it without limit.
  if (log.entries.length > 5000) {
    log.entries = log.entries.slice(-5000);
  }
  await fs.writeFile(
    spendLogPath(bookDir),
    JSON.stringify(log, null, 2) + "\n",
    "utf8"
  );
}

/**
 * Count entries that fall within the same UTC day as `now`.
 * Pure function — exposed for tests.
 */
export function countInvocationsToday(log: SpendLog, now: Date): number {
  const dayStart = new Date(now);
  dayStart.setUTCHours(0, 0, 0, 0);
  const dayStartMs = dayStart.getTime();
  return log.entries.filter((e) => {
    const ts = new Date(e.ts).getTime();
    return !Number.isNaN(ts) && ts >= dayStartMs;
  }).length;
}

export function isOverDailyCap(
  log: SpendLog,
  maxPerDay: number,
  now: Date
): boolean {
  return countInvocationsToday(log, now) >= maxPerDay;
}
