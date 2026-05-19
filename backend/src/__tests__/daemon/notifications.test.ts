import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  appendActivityEntry,
  appendGateHit,
  formatActivityEntry,
  formatGateHit,
} from "../../daemon/notifications.js";
import { GATES } from "../../daemon/gates.js";

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await mkdtemp(join(tmpdir(), "bf-notif-test-"));
});

afterEach(async () => {
  await rm(tmpDir, { recursive: true, force: true });
});

describe("formatGateHit", () => {
  it("includes the timestamp, book slug, and gate names", () => {
    const ts = new Date("2026-05-18T12:00:00.000Z");
    const gate = GATES.find((g) => g.name === "blueprint_approved")!;
    const out = formatGateHit({ ts, book: "my-book", gates: [gate] });
    expect(out).toContain("2026-05-18T12:00:00.000Z");
    expect(out).toContain("my-book");
    expect(out).toContain("blueprint_approved");
    expect(out).toContain(gate.description);
  });

  it("formats multiple gates as bullet points", () => {
    const ts = new Date();
    const out = formatGateHit({
      ts,
      book: "my-book",
      gates: [
        GATES.find((g) => g.name === "cover_approved")!,
        GATES.find((g) => g.name === "final_approval_passed")!,
      ],
    });
    expect(out).toContain("- **cover_approved**");
    expect(out).toContain("- **final_approval_passed**");
  });
});

describe("formatActivityEntry", () => {
  it("formats an invoked entry", () => {
    const ts = new Date("2026-05-18T12:00:00.000Z");
    const line = formatActivityEntry({
      ts,
      book: "my-book",
      action: "invoked",
      detail: "runId=abc",
    });
    expect(line).toContain("2026-05-18T12:00:00.000Z");
    expect(line).toContain("my-book");
    expect(line).toContain("invoked");
    expect(line).toContain("runId=abc");
    expect(line.endsWith("\n")).toBe(true);
  });

  it("omits the trailing detail when not provided", () => {
    const line = formatActivityEntry({
      ts: new Date(),
      book: "my-book",
      action: "paused",
    });
    expect(line).not.toContain(" — ");
  });
});

describe("appendGateHit", () => {
  it("creates the notifications file with a header on first write", async () => {
    const file = join(tmpDir, "NOTIFICATIONS.md");
    const gate = GATES.find((g) => g.name === "blueprint_approved")!;
    await appendGateHit(file, {
      ts: new Date("2026-05-18T12:00:00.000Z"),
      book: "my-book",
      gates: [gate],
    });
    const content = await readFile(file, "utf8");
    expect(content).toMatch(/^# BookFactory Automation/);
    expect(content).toContain("my-book");
    expect(content).toContain("blueprint_approved");
  });

  it("appends subsequent hits without rewriting the header", async () => {
    const file = join(tmpDir, "NOTIFICATIONS.md");
    const gate = GATES.find((g) => g.name === "blueprint_approved")!;
    await appendGateHit(file, {
      ts: new Date("2026-05-18T12:00:00.000Z"),
      book: "book-1",
      gates: [gate],
    });
    await appendGateHit(file, {
      ts: new Date("2026-05-18T13:00:00.000Z"),
      book: "book-2",
      gates: [gate],
    });
    const content = await readFile(file, "utf8");
    expect(content.match(/^# BookFactory Automation/gm)).toHaveLength(1);
    expect(content).toContain("book-1");
    expect(content).toContain("book-2");
  });
});

describe("appendActivityEntry", () => {
  it("creates the activity log with a header on first write", async () => {
    const file = join(tmpDir, "AUTOMATION-LOG.md");
    await appendActivityEntry(file, {
      ts: new Date("2026-05-18T12:00:00.000Z"),
      book: "my-book",
      action: "invoked",
      detail: "runId=abc",
    });
    const content = await readFile(file, "utf8");
    expect(content).toMatch(/^# BookFactory Automation/);
    expect(content).toContain("invoked");
  });

  it("appends each entry on its own line", async () => {
    const file = join(tmpDir, "AUTOMATION-LOG.md");
    await appendActivityEntry(file, {
      ts: new Date("2026-05-18T12:00:00.000Z"),
      book: "book-1",
      action: "invoked",
    });
    await appendActivityEntry(file, {
      ts: new Date("2026-05-18T12:00:01.000Z"),
      book: "book-2",
      action: "blocked",
      detail: "blueprint_approved",
    });
    const content = await readFile(file, "utf8");
    expect(content).toContain("book-1");
    expect(content).toContain("book-2");
    expect(content).toContain("blueprint_approved");
  });
});
