import { describe, it, expect } from "vitest";
import { GATES, findBlockingGates, isBlocked } from "../../daemon/gates.js";
import type { PipelineState } from "../../daemon/types.js";

function state(overrides: {
  stage: number;
  gates?: Partial<PipelineState["human_gates"]>;
}): PipelineState {
  return {
    book_slug: "test",
    book_title: "Test",
    current_stage: overrides.stage,
    human_gates: {
      market_intelligence_approved: false,
      blueprint_approved: false,
      cover_approved: false,
      final_approval_passed: false,
      ai_questionnaire_confirmed: false,
      published: false,
      ...(overrides.gates ?? {}),
    },
  };
}

describe("findBlockingGates", () => {
  it("returns no gates when the book is at stage 1 (before any gates)", () => {
    expect(findBlockingGates(state({ stage: 1 }))).toHaveLength(0);
  });

  it("blocks market_intelligence_approved at stage 2 if not approved", () => {
    const blocked = findBlockingGates(state({ stage: 2 }));
    expect(blocked).toHaveLength(1);
    expect(blocked[0].name).toBe("market_intelligence_approved");
  });

  it("does not block market_intelligence_approved at stage 2 once approved", () => {
    const blocked = findBlockingGates(
      state({ stage: 2, gates: { market_intelligence_approved: true } })
    );
    expect(
      blocked.find((g) => g.name === "market_intelligence_approved")
    ).toBeUndefined();
  });

  it("blocks blueprint_approved at stage 3 if not approved", () => {
    const blocked = findBlockingGates(
      state({ stage: 3, gates: { market_intelligence_approved: true } })
    );
    expect(blocked.find((g) => g.name === "blueprint_approved")).toBeDefined();
  });

  it("returns ALL three stage-7 gates when none are approved at stage 7", () => {
    const blocked = findBlockingGates(
      state({
        stage: 7,
        gates: {
          market_intelligence_approved: true,
          blueprint_approved: true,
        },
      })
    );
    const names = blocked.map((g) => g.name);
    expect(names).toContain("cover_approved");
    expect(names).toContain("final_approval_passed");
    expect(names).toContain("ai_questionnaire_confirmed");
  });

  it("returns only the unapproved stage-7 gates", () => {
    const blocked = findBlockingGates(
      state({
        stage: 7,
        gates: {
          market_intelligence_approved: true,
          blueprint_approved: true,
          cover_approved: true,
          final_approval_passed: false,
          ai_questionnaire_confirmed: true,
        },
      })
    );
    expect(blocked).toHaveLength(1);
    expect(blocked[0].name).toBe("final_approval_passed");
  });

  it("blocks published at stage 8 if not yet confirmed", () => {
    const blocked = findBlockingGates(
      state({
        stage: 8,
        gates: {
          market_intelligence_approved: true,
          blueprint_approved: true,
          cover_approved: true,
          final_approval_passed: true,
          ai_questionnaire_confirmed: true,
        },
      })
    );
    expect(blocked.find((g) => g.name === "published")).toBeDefined();
  });

  it("returns no gates when all gates are approved and book is post-launch", () => {
    const blocked = findBlockingGates(
      state({
        stage: 10,
        gates: {
          market_intelligence_approved: true,
          blueprint_approved: true,
          cover_approved: true,
          final_approval_passed: true,
          ai_questionnaire_confirmed: true,
          published: true,
        },
      })
    );
    expect(blocked).toHaveLength(0);
  });

  it("does NOT block a gate whose stage has not yet been reached", () => {
    // Book at stage 5 — only the first two gates apply
    const blocked = findBlockingGates(state({ stage: 5 }));
    const names = blocked.map((g) => g.name);
    expect(names).toContain("market_intelligence_approved");
    expect(names).toContain("blueprint_approved");
    expect(names).not.toContain("cover_approved");
    expect(names).not.toContain("published");
  });
});

describe("isBlocked", () => {
  it("returns false when no gates are blocking", () => {
    expect(isBlocked(state({ stage: 1 }))).toBe(false);
  });

  it("returns true when at least one gate is blocking", () => {
    expect(isBlocked(state({ stage: 2 }))).toBe(true);
  });
});

describe("GATES configuration", () => {
  it("includes every gate field present in HumanGates", () => {
    const names = GATES.map((g) => g.name).sort();
    expect(names).toEqual([
      "ai_questionnaire_confirmed",
      "blueprint_approved",
      "cover_approved",
      "final_approval_passed",
      "market_intelligence_approved",
      "published",
    ]);
  });

  it("each gate has a non-empty description", () => {
    for (const g of GATES) {
      expect(g.description.length).toBeGreaterThan(0);
    }
  });
});
