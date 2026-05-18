import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { rm, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import crypto from "node:crypto";
import { readTextFile, writeTextFile, listDir } from "../../lib/files.js";
import { BOOKFACTORY_ROOT } from "../../paths.js";

// All test files are written inside a unique subdirectory of BOOKFACTORY_ROOT
// so they are within the safe-resolve boundary and cleaned up after the suite.
const TEST_DIR = `_vitest-files-${crypto.randomUUID().slice(0, 8)}`;
const absTestDir = join(BOOKFACTORY_ROOT, TEST_DIR);

function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

/** Helper: relative path inside the test sandbox */
function p(rel: string) {
  return `${TEST_DIR}/${rel}`;
}

beforeAll(async () => {
  await mkdir(absTestDir, { recursive: true });
});

afterAll(async () => {
  await rm(absTestDir, { recursive: true, force: true });
});

describe("readTextFile", () => {
  it("reads an existing file and returns content and sha", async () => {
    const content = "hello world";
    await writeFile(join(absTestDir, "hello.txt"), content, "utf8");
    const snap = await readTextFile(p("hello.txt"));
    expect(snap.content).toBe(content);
    expect(snap.sha).toBe(sha256(content));
    expect(snap.path).toBe(p("hello.txt"));
  });

  it("throws when the file does not exist", async () => {
    await expect(readTextFile(p("no-such-file.txt"))).rejects.toThrow();
  });

  it("throws for a path traversal attempt", async () => {
    await expect(readTextFile("../../etc/passwd")).rejects.toThrow(
      "Path escapes BOOKFACTORY_ROOT"
    );
  });

  it("throws for an absolute path outside the root", async () => {
    await expect(readTextFile("/etc/passwd")).rejects.toThrow(
      "Path escapes BOOKFACTORY_ROOT"
    );
  });
});

describe("writeTextFile", () => {
  it("creates a new file and returns the snapshot", async () => {
    const content = "new content";
    const snap = await writeTextFile(p("new-file.md"), content);
    expect(snap.content).toBe(content);
    expect(snap.sha).toBe(sha256(content));
    expect(snap.path).toBe(p("new-file.md"));
  });

  it("creates parent directories recursively", async () => {
    await writeTextFile(p("deep/nested/dir/file.txt"), "data");
    const snap = await readTextFile(p("deep/nested/dir/file.txt"));
    expect(snap.content).toBe("data");
  });

  it("overwrites an existing file when no sha is provided", async () => {
    await writeTextFile(p("overwrite-me.txt"), "original");
    const snap = await writeTextFile(p("overwrite-me.txt"), "updated");
    expect(snap.content).toBe("updated");
  });

  it("writes successfully when the provided sha matches the existing file", async () => {
    const original = "sha-check content";
    const first = await writeTextFile(p("sha-check.txt"), original);
    const snap = await writeTextFile(p("sha-check.txt"), "updated", first.sha);
    expect(snap.content).toBe("updated");
  });

  it("throws a sha mismatch error when the provided sha is wrong", async () => {
    await writeTextFile(p("sha-mismatch.txt"), "original");
    await expect(
      writeTextFile(p("sha-mismatch.txt"), "updated", "wrong-sha-value")
    ).rejects.toThrow("sha mismatch");
  });

  it("writes without checking sha when the file does not yet exist", async () => {
    const snap = await writeTextFile(p("brand-new.txt"), "content", "any-sha");
    expect(snap.content).toBe("content");
  });

  it("throws for a path traversal attempt", async () => {
    await expect(
      writeTextFile("../../evil.txt", "bad content")
    ).rejects.toThrow("Path escapes BOOKFACTORY_ROOT");
  });
});

describe("listDir", () => {
  it("lists files and directories with dirs sorted before files", async () => {
    const base = p("listtest");
    await mkdir(join(absTestDir, "listtest"), { recursive: true });
    await mkdir(join(absTestDir, "listtest", "adir"), { recursive: true });
    await writeFile(join(absTestDir, "listtest", "bfile.txt"), "b", "utf8");
    await writeFile(join(absTestDir, "listtest", "afile.txt"), "a", "utf8");

    const result = await listDir(base);
    expect(result.path).toBe(base);
    const names = result.entries.map((e) => e.name);
    expect(names.indexOf("adir")).toBeLessThan(names.indexOf("afile.txt"));
    expect(names).toContain("afile.txt");
    expect(names).toContain("bfile.txt");
  });

  it("hides dot files but exposes .env.example", async () => {
    const subdir = "dottest";
    await mkdir(join(absTestDir, subdir), { recursive: true });
    await writeFile(join(absTestDir, subdir, ".hidden"), "h", "utf8");
    await writeFile(join(absTestDir, subdir, ".env.example"), "e", "utf8");
    await writeFile(join(absTestDir, subdir, "visible.txt"), "v", "utf8");

    const result = await listDir(p(subdir));
    const names = result.entries.map((e) => e.name);
    expect(names).not.toContain(".hidden");
    expect(names).toContain(".env.example");
    expect(names).toContain("visible.txt");
  });

  it("includes file sizes in bytes", async () => {
    const subdir = "sizetest";
    await mkdir(join(absTestDir, subdir), { recursive: true });
    await writeFile(join(absTestDir, subdir, "sized.txt"), "12345", "utf8");

    const result = await listDir(p(subdir));
    const file = result.entries.find((e) => e.name === "sized.txt");
    expect(file?.size).toBe(5);
  });

  it("throws for a path traversal attempt", async () => {
    await expect(listDir("../../etc")).rejects.toThrow(
      "Path escapes BOOKFACTORY_ROOT"
    );
  });
});
