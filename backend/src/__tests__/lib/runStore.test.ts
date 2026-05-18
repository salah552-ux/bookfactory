import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import crypto from "node:crypto";
import {
  startRunRecord,
  appendRunChunk,
  finishRunRecord,
  listRuns,
  readRun,
  flushRun,
} from "../../lib/runStore.js";
import { BOOKFACTORY_ROOT } from "../../paths.js";

// Use a unique prefix per test run to avoid collisions with real run data
const PREFIX = `test-${crypto.randomUUID().slice(0, 8)}`;
const RUNS_DIR = join(BOOKFACTORY_ROOT, ".bookfactory-runs");

function id(label: string) {
  return `${PREFIX}-${label}`;
}

function makeRun(
  label: string,
  startedAt = Date.now()
): Omit<
  Parameters<typeof startRunRecord>[0],
  never
> {
  return {
    runId: id(label),
    agent: "test-agent",
    book: "test-book",
    startedAt,
  };
}

afterAll(async () => {
  // Clean up only the run files created by this test suite
  if (!existsSync(RUNS_DIR)) return;
  const { readdir, unlink } = await import("node:fs/promises");
  const files = await readdir(RUNS_DIR);
  for (const f of files) {
    if (f.startsWith(PREFIX)) {
      await unlink(join(RUNS_DIR, f)).catch(() => undefined);
    }
  }
});

// We also need at least one run to exist before testing listRuns ordering
beforeAll(async () => {
  // Pre-create a sentinel run so RUNS_DIR exists
  await startRunRecord(makeRun("sentinel", 1));
  await flushRun(id("sentinel"));
});

describe("startRunRecord", () => {
  it("creates a run file with empty chunks array", async () => {
    await startRunRecord(makeRun("start-1"));
    await flushRun(id("start-1"));
    const rec = await readRun(id("start-1"));
    expect(rec).not.toBeNull();
    expect(rec!.chunks).toEqual([]);
  });

  it("persists agent and book metadata", async () => {
    await startRunRecord(makeRun("meta-1"));
    await flushRun(id("meta-1"));
    const rec = await readRun(id("meta-1"));
    expect(rec!.agent).toBe("test-agent");
    expect(rec!.book).toBe("test-book");
  });
});

describe("appendRunChunk", () => {
  it("appends a chunk to an existing run", async () => {
    await startRunRecord(makeRun("chunk-1"));
    await appendRunChunk(id("chunk-1"), {
      stream: "stdout",
      text: "hello",
      ts: 1,
    });
    await flushRun(id("chunk-1"));
    const rec = await readRun(id("chunk-1"));
    expect(rec!.chunks).toHaveLength(1);
    expect(rec!.chunks[0]).toMatchObject({ stream: "stdout", text: "hello" });
  });

  it("appends multiple chunks in insertion order", async () => {
    await startRunRecord(makeRun("chunk-order"));
    await appendRunChunk(id("chunk-order"), {
      stream: "stdout",
      text: "a",
      ts: 1,
    });
    await appendRunChunk(id("chunk-order"), {
      stream: "stderr",
      text: "b",
      ts: 2,
    });
    await appendRunChunk(id("chunk-order"), {
      stream: "stdout",
      text: "c",
      ts: 3,
    });
    await flushRun(id("chunk-order"));
    const rec = await readRun(id("chunk-order"));
    expect(rec!.chunks.map((c) => c.text)).toEqual(["a", "b", "c"]);
  });

  it("silently does nothing when the run does not exist yet", async () => {
    await expect(
      appendRunChunk(`${PREFIX}-nonexistent`, {
        stream: "stdout",
        text: "x",
        ts: 0,
      })
    ).resolves.toBeUndefined();
  });
});

describe("finishRunRecord", () => {
  it("sets exitCode on the run", async () => {
    await startRunRecord(makeRun("finish-1"));
    await finishRunRecord(id("finish-1"), 0);
    await flushRun(id("finish-1"));
    const rec = await readRun(id("finish-1"));
    expect(rec!.exitCode).toBe(0);
  });

  it("records a non-zero exit code", async () => {
    await startRunRecord(makeRun("finish-2"));
    await finishRunRecord(id("finish-2"), 1);
    await flushRun(id("finish-2"));
    const rec = await readRun(id("finish-2"));
    expect(rec!.exitCode).toBe(1);
  });

  it("sets finishedAt to a recent timestamp", async () => {
    const before = Date.now();
    await startRunRecord(makeRun("finish-ts"));
    await finishRunRecord(id("finish-ts"), 0);
    await flushRun(id("finish-ts"));
    const after = Date.now();
    const rec = await readRun(id("finish-ts"));
    expect(rec!.finishedAt).toBeGreaterThanOrEqual(before);
    expect(rec!.finishedAt).toBeLessThanOrEqual(after);
  });

  it("silently does nothing when the run does not exist", async () => {
    await expect(
      finishRunRecord(`${PREFIX}-nonexistent`, 0)
    ).resolves.toBeUndefined();
  });
});

describe("listRuns", () => {
  it("returns an array", async () => {
    const runs = await listRuns();
    expect(Array.isArray(runs)).toBe(true);
  });

  it("returns runs sorted by startedAt descending", async () => {
    const now = Date.now();
    await startRunRecord(makeRun("sort-1", now - 2000));
    await startRunRecord(makeRun("sort-2", now - 1000));
    await startRunRecord(makeRun("sort-3", now));
    await flushRun(id("sort-1"));
    await flushRun(id("sort-2"));
    await flushRun(id("sort-3"));

    const runs = await listRuns();
    const ids = runs.map((r) => r.runId);
    const i1 = ids.indexOf(id("sort-1"));
    const i2 = ids.indexOf(id("sort-2"));
    const i3 = ids.indexOf(id("sort-3"));
    expect(i3).toBeLessThan(i2);
    expect(i2).toBeLessThan(i1);
  });

  it("strips chunks from listed runs (fetched separately via run.read)", async () => {
    await startRunRecord(makeRun("no-chunks-list"));
    await appendRunChunk(id("no-chunks-list"), {
      stream: "stdout",
      text: "data",
      ts: 1,
    });
    await flushRun(id("no-chunks-list"));

    const runs = await listRuns();
    const run = runs.find((r) => r.runId === id("no-chunks-list"));
    expect(run).toBeDefined();
    expect(run!.chunks).toEqual([]);
  });

  it("respects the limit parameter", async () => {
    const runs = await listRuns(1);
    expect(runs.length).toBeLessThanOrEqual(1);
  });
});

describe("readRun", () => {
  it("returns null for a non-existent runId", async () => {
    expect(await readRun(`${PREFIX}-does-not-exist`)).toBeNull();
  });

  it("returns the full run record including chunks", async () => {
    await startRunRecord(makeRun("full-read"));
    await appendRunChunk(id("full-read"), {
      stream: "stdout",
      text: "line1",
      ts: 1,
    });
    await flushRun(id("full-read"));
    const rec = await readRun(id("full-read"));
    expect(rec!.chunks[0].text).toBe("line1");
  });
});
