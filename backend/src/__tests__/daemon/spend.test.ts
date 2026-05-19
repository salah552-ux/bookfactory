import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  appendSpendEntry,
  countInvocationsToday,
  isOverDailyCap,
  readSpendLog,
  spendLogPath,
} from "../../daemon/spend.js";
import type { SpendLog } from "../../daemon/types.js";

let bookDir: string;

beforeEach(async () => {
  bookDir = await mkdtemp(join(tmpdir(), "bf-spend-test-"));
});

afterEach(async () => {
  await rm(bookDir, { recursive: true, force: true });
});

describe("readSpendLog", () => {
  it("returns an empty log when the file does not exist", async () => {
    expect(await readSpendLog(bookDir)).toEqual({ entries: [] });
  });

  it("returns the parsed log when the file exists", async () => {
    const log: SpendLog = {
      entries: [
        { ts: "2026-05-18T10:00:00.000Z", agent: "x", runId: "r1" },
      ],
    };
    await writeFile(spendLogPath(bookDir), JSON.stringify(log), "utf8");
    expect(await readSpendLog(bookDir)).toEqual(log);
  });

  it("returns empty entries when the file is malformed JSON", async () => {
    await writeFile(spendLogPath(bookDir), "not json", "utf8");
    expect(await readSpendLog(bookDir)).toEqual({ entries: [] });
  });

  it("returns empty entries when entries is missing", async () => {
    await writeFile(spendLogPath(bookDir), JSON.stringify({}), "utf8");
    expect(await readSpendLog(bookDir)).toEqual({ entries: [] });
  });
});

describe("appendSpendEntry", () => {
  it("creates the log file on first append", async () => {
    await appendSpendEntry(bookDir, {
      ts: "2026-05-18T10:00:00.000Z",
      agent: "x",
      runId: "r1",
    });
    const log = await readSpendLog(bookDir);
    expect(log.entries).toHaveLength(1);
    expect(log.entries[0].runId).toBe("r1");
  });

  it("appends to an existing log", async () => {
    await appendSpendEntry(bookDir, {
      ts: "2026-05-18T10:00:00.000Z",
      agent: "x",
      runId: "r1",
    });
    await appendSpendEntry(bookDir, {
      ts: "2026-05-18T11:00:00.000Z",
      agent: "x",
      runId: "r2",
    });
    const log = await readSpendLog(bookDir);
    expect(log.entries.map((e) => e.runId)).toEqual(["r1", "r2"]);
  });

  it("writes pretty-printed JSON for human inspection", async () => {
    await appendSpendEntry(bookDir, {
      ts: "2026-05-18T10:00:00.000Z",
      agent: "x",
      runId: "r1",
    });
    const raw = await readFile(spendLogPath(bookDir), "utf8");
    expect(raw).toContain("\n");
  });
});

describe("countInvocationsToday", () => {
  const now = new Date("2026-05-18T12:00:00.000Z");

  it("counts entries within the same UTC day", () => {
    const log: SpendLog = {
      entries: [
        { ts: "2026-05-18T00:00:01.000Z", agent: "x", runId: "r1" },
        { ts: "2026-05-18T08:30:00.000Z", agent: "x", runId: "r2" },
        { ts: "2026-05-18T23:59:59.000Z", agent: "x", runId: "r3" },
      ],
    };
    expect(countInvocationsToday(log, now)).toBe(3);
  });

  it("excludes entries from previous days", () => {
    const log: SpendLog = {
      entries: [
        { ts: "2026-05-17T23:59:59.000Z", agent: "x", runId: "r1" },
        { ts: "2026-05-18T00:00:01.000Z", agent: "x", runId: "r2" },
      ],
    };
    expect(countInvocationsToday(log, now)).toBe(1);
  });

  it("returns 0 for an empty log", () => {
    expect(countInvocationsToday({ entries: [] }, now)).toBe(0);
  });

  it("skips entries with invalid timestamps", () => {
    const log: SpendLog = {
      entries: [
        { ts: "not-a-date", agent: "x", runId: "r1" },
        { ts: "2026-05-18T10:00:00.000Z", agent: "x", runId: "r2" },
      ],
    };
    expect(countInvocationsToday(log, now)).toBe(1);
  });
});

describe("isOverDailyCap", () => {
  const now = new Date("2026-05-18T12:00:00.000Z");

  it("returns false when below cap", () => {
    const log: SpendLog = {
      entries: [{ ts: "2026-05-18T10:00:00.000Z", agent: "x", runId: "r1" }],
    };
    expect(isOverDailyCap(log, 5, now)).toBe(false);
  });

  it("returns true when at cap exactly", () => {
    const log: SpendLog = {
      entries: Array.from({ length: 5 }, (_, i) => ({
        ts: "2026-05-18T10:00:00.000Z",
        agent: "x",
        runId: `r${i}`,
      })),
    };
    expect(isOverDailyCap(log, 5, now)).toBe(true);
  });

  it("returns true when above cap", () => {
    const log: SpendLog = {
      entries: Array.from({ length: 10 }, (_, i) => ({
        ts: "2026-05-18T10:00:00.000Z",
        agent: "x",
        runId: `r${i}`,
      })),
    };
    expect(isOverDailyCap(log, 5, now)).toBe(true);
  });

  it("returns false when yesterday's entries exceed today's cap", () => {
    // 10 entries from yesterday, cap of 5 → today is empty, so NOT over cap
    const log: SpendLog = {
      entries: Array.from({ length: 10 }, (_, i) => ({
        ts: "2026-05-17T10:00:00.000Z",
        agent: "x",
        runId: `r${i}`,
      })),
    };
    expect(isOverDailyCap(log, 5, now)).toBe(false);
  });
});
