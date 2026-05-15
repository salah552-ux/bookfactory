import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";
import { BOOKFACTORY_ROOT } from "../paths.js";

const RUNS_DIR = path.join(BOOKFACTORY_ROOT, ".bookfactory-runs");

export interface RunChunk {
  stream: "stdout" | "stderr" | "tool";
  text: string;
  ts: number;
}

export interface RunRecord {
  runId: string;
  agent?: string;
  script?: string;
  book?: string;
  startedAt: number;
  finishedAt?: number;
  exitCode?: number;
  chunks: RunChunk[];
}

async function ensureDir() {
  await fs.mkdir(RUNS_DIR, { recursive: true });
}

/**
 * Wait for any queued persistence work for a runId to drain. Useful for
 * smoke tests and for the WS layer to guarantee a snapshot is on disk
 * before responding to runs.list.
 */
export function flushRun(runId: string): Promise<void> {
  return queues.get(runId) ?? Promise.resolve();
}

function fileFor(runId: string): string {
  // runId can contain UUIDs only — sanitise just in case.
  const safe = runId.replace(/[^A-Za-z0-9_-]/g, "_");
  return path.join(RUNS_DIR, `${safe}.json`);
}

/**
 * Per-runId write chain. All mutations for the same runId queue behind the
 * previous one, avoiding read-modify-write races between start/chunk/finish.
 */
const queues = new Map<string, Promise<void>>();
function enqueue(runId: string, fn: () => Promise<void>): Promise<void> {
  const prev = queues.get(runId) ?? Promise.resolve();
  const next = prev.then(fn).catch(() => undefined);
  queues.set(runId, next);
  // Note: deliberately don't delete on settle — flushRun must always be
  // able to find the latest promise. Memory growth is bounded by number
  // of unique runIds, which is small (one per agent invocation).
  return next;
}

export function startRunRecord(r: Omit<RunRecord, "chunks">): Promise<void> {
  return enqueue(r.runId, async () => {
    await ensureDir();
    const rec: RunRecord = { ...r, chunks: [] };
    await fs.writeFile(fileFor(r.runId), JSON.stringify(rec), "utf8");
  });
}

export function appendRunChunk(runId: string, c: RunChunk): Promise<void> {
  return enqueue(runId, async () => {
    const file = fileFor(runId);
    let rec: RunRecord;
    try {
      const raw = await fs.readFile(file, "utf8");
      rec = JSON.parse(raw) as RunRecord;
    } catch {
      // No start record yet — bail. The start enqueue will arrive next.
      return;
    }
    rec.chunks.push(c);
    if (rec.chunks.length > 5000) rec.chunks = rec.chunks.slice(-5000);
    await fs.writeFile(file, JSON.stringify(rec), "utf8");
  });
}

export function finishRunRecord(
  runId: string,
  exitCode: number
): Promise<void> {
  return enqueue(runId, async () => {
    const file = fileFor(runId);
    let rec: RunRecord;
    try {
      const raw = await fs.readFile(file, "utf8");
      rec = JSON.parse(raw) as RunRecord;
    } catch {
      return;
    }
    rec.finishedAt = Date.now();
    rec.exitCode = exitCode;
    await fs.writeFile(file, JSON.stringify(rec), "utf8");
  });
}

export async function listRuns(limit = 200): Promise<RunRecord[]> {
  if (!fssync.existsSync(RUNS_DIR)) return [];
  const files = await fs.readdir(RUNS_DIR);
  const records: RunRecord[] = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      const raw = await fs.readFile(path.join(RUNS_DIR, f), "utf8");
      const rec = JSON.parse(raw) as RunRecord;
      // Strip chunks from the list — they fetch separately via run.read.
      records.push({ ...rec, chunks: [] });
    } catch {
      // ignore
    }
  }
  records.sort((a, b) => b.startedAt - a.startedAt);
  return records.slice(0, limit);
}

export async function readRun(runId: string): Promise<RunRecord | null> {
  try {
    const raw = await fs.readFile(fileFor(runId), "utf8");
    return JSON.parse(raw) as RunRecord;
  } catch {
    return null;
  }
}
