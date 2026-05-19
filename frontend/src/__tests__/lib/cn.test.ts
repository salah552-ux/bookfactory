import { describe, it, expect } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("returns a single class name unchanged", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  it("joins multiple class names", () => {
    expect(cn("text-sm", "font-bold")).toBe("text-sm font-bold");
  });

  it("deduplicates conflicting Tailwind utilities (last one wins)", () => {
    // tailwind-merge resolves text-sm + text-lg → text-lg
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("ignores falsy values", () => {
    expect(cn("text-sm", false, null, undefined, "font-bold")).toBe(
      "text-sm font-bold"
    );
  });

  it("handles conditional class objects", () => {
    expect(cn({ "text-red-500": true, "text-blue-500": false })).toBe(
      "text-red-500"
    );
  });

  it("returns an empty string when all inputs are falsy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });

  it("merges padding utilities correctly", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
