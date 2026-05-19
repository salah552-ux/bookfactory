import { describe, it, expect } from "vitest";
import { safeResolve, toRel, BOOKFACTORY_ROOT } from "../paths.js";

describe("safeResolve", () => {
  it("resolves a relative path within root", () => {
    const result = safeResolve("books/my-book");
    expect(result).toBe(`${BOOKFACTORY_ROOT}/books/my-book`);
  });

  it("resolves an absolute path inside root", () => {
    const absPath = `${BOOKFACTORY_ROOT}/books/my-book`;
    expect(safeResolve(absPath)).toBe(absPath);
  });

  it("allows the root directory itself", () => {
    expect(safeResolve(".")).toBe(BOOKFACTORY_ROOT);
  });

  it("throws for relative path traversal (../..)", () => {
    expect(() => safeResolve("../../etc/passwd")).toThrow(
      "Path escapes BOOKFACTORY_ROOT"
    );
  });

  it("throws for absolute path outside root", () => {
    expect(() => safeResolve("/etc/passwd")).toThrow(
      "Path escapes BOOKFACTORY_ROOT"
    );
  });

  it("does not allow an absolute path that shares the root name as a prefix but is a sibling", () => {
    // e.g., if root is /foo/bar, then /foo/barbaz must not pass
    const sibling = `${BOOKFACTORY_ROOT}-sibling/file`;
    expect(() => safeResolve(sibling)).toThrow("Path escapes BOOKFACTORY_ROOT");
  });

  it("resolves nested relative paths", () => {
    const result = safeResolve("books/slug/manuscript/ch1.md");
    expect(result).toBe(`${BOOKFACTORY_ROOT}/books/slug/manuscript/ch1.md`);
  });
});

describe("toRel", () => {
  it("converts an absolute path back to a relative path", () => {
    const abs = `${BOOKFACTORY_ROOT}/books/my-book`;
    expect(toRel(abs)).toBe("books/my-book");
  });

  it("returns an empty string for the root directory itself", () => {
    // path.relative('/foo', '/foo') === '' in Node.js
    expect(toRel(BOOKFACTORY_ROOT)).toBe("");
  });

  it("handles nested paths", () => {
    const abs = `${BOOKFACTORY_ROOT}/books/slug/manuscript/ch1.md`;
    expect(toRel(abs)).toBe("books/slug/manuscript/ch1.md");
  });
});
