import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { isPaused, readPauseReason } from "../../daemon/pause.js";

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await mkdtemp(join(tmpdir(), "bf-pause-test-"));
});

afterEach(async () => {
  await rm(tmpDir, { recursive: true, force: true });
});

describe("isPaused", () => {
  it("returns false when the pause file does not exist", async () => {
    expect(await isPaused(join(tmpDir, "PAUSE_AUTOMATION"))).toBe(false);
  });

  it("returns true when the pause file exists (even if empty)", async () => {
    const file = join(tmpDir, "PAUSE_AUTOMATION");
    await writeFile(file, "", "utf8");
    expect(await isPaused(file)).toBe(true);
  });

  it("returns true when the pause file has content", async () => {
    const file = join(tmpDir, "PAUSE_AUTOMATION");
    await writeFile(file, "investigating runaway spend", "utf8");
    expect(await isPaused(file)).toBe(true);
  });
});

describe("readPauseReason", () => {
  it("returns null when the pause file does not exist", async () => {
    expect(await readPauseReason(join(tmpDir, "PAUSE_AUTOMATION"))).toBeNull();
  });

  it("returns null when the pause file is empty", async () => {
    const file = join(tmpDir, "PAUSE_AUTOMATION");
    await writeFile(file, "", "utf8");
    expect(await readPauseReason(file)).toBeNull();
  });

  it("returns the first non-empty line", async () => {
    const file = join(tmpDir, "PAUSE_AUTOMATION");
    await writeFile(file, "Investigating runaway spend\nMore detail below", "utf8");
    expect(await readPauseReason(file)).toBe("Investigating runaway spend");
  });

  it("skips blank lines at the top", async () => {
    const file = join(tmpDir, "PAUSE_AUTOMATION");
    await writeFile(file, "\n\n   \nActual reason here\n", "utf8");
    expect(await readPauseReason(file)).toBe("Actual reason here");
  });
});
