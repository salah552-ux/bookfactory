import { describe, it, expect, beforeEach } from "vitest";
import { useRunStore } from "@/stores/runs";

beforeEach(() => {
  useRunStore.getState().clear();
});

describe("upsertStart", () => {
  it("adds a new run with empty chunks", () => {
    useRunStore.getState().upsertStart({
      runId: "r1",
      agent: "market-researcher",
      book: "my-book",
      startedAt: 1000,
    });

    const { runs, order } = useRunStore.getState();
    expect(runs["r1"]).toBeDefined();
    expect(runs["r1"].chunks).toEqual([]);
    expect(runs["r1"].agent).toBe("market-researcher");
    expect(order).toContain("r1");
  });

  it("prepends new runs to the order array (newest first)", () => {
    useRunStore.getState().upsertStart({ runId: "r1", startedAt: 1000 });
    useRunStore.getState().upsertStart({ runId: "r2", startedAt: 2000 });

    const { order } = useRunStore.getState();
    expect(order.indexOf("r2")).toBeLessThan(order.indexOf("r1"));
  });

  it("does not duplicate the runId in order when called again for the same run", () => {
    useRunStore.getState().upsertStart({ runId: "r1", startedAt: 1000 });
    useRunStore.getState().upsertStart({ runId: "r1", startedAt: 1001 });

    const { order } = useRunStore.getState();
    expect(order.filter((id) => id === "r1")).toHaveLength(1);
  });
});

describe("appendChunk", () => {
  it("appends a chunk to an existing run", () => {
    useRunStore.getState().upsertStart({ runId: "r1", startedAt: 1000 });
    useRunStore
      .getState()
      .appendChunk("r1", { stream: "stdout", text: "hello", ts: 1 });

    const { runs } = useRunStore.getState();
    expect(runs["r1"].chunks).toHaveLength(1);
    expect(runs["r1"].chunks[0].text).toBe("hello");
  });

  it("appends chunks in order", () => {
    useRunStore.getState().upsertStart({ runId: "r1", startedAt: 1000 });
    useRunStore
      .getState()
      .appendChunk("r1", { stream: "stdout", text: "a", ts: 1 });
    useRunStore
      .getState()
      .appendChunk("r1", { stream: "stderr", text: "b", ts: 2 });
    useRunStore
      .getState()
      .appendChunk("r1", { stream: "stdout", text: "c", ts: 3 });

    const { runs } = useRunStore.getState();
    expect(runs["r1"].chunks.map((c) => c.text)).toEqual(["a", "b", "c"]);
  });

  it("does nothing for an unknown runId", () => {
    const before = useRunStore.getState().runs;
    useRunStore
      .getState()
      .appendChunk("nonexistent", { stream: "stdout", text: "x", ts: 1 });
    expect(useRunStore.getState().runs).toBe(before); // same reference — no update
  });
});

describe("finish", () => {
  it("sets exitCode on the run", () => {
    useRunStore.getState().upsertStart({ runId: "r1", startedAt: 1000 });
    useRunStore.getState().finish("r1", 0);

    const { runs } = useRunStore.getState();
    expect(runs["r1"].exitCode).toBe(0);
  });

  it("sets a non-zero exit code", () => {
    useRunStore.getState().upsertStart({ runId: "r1", startedAt: 1000 });
    useRunStore.getState().finish("r1", 1);

    expect(useRunStore.getState().runs["r1"].exitCode).toBe(1);
  });

  it("sets finishedAt to a recent timestamp", () => {
    const before = Date.now();
    useRunStore.getState().upsertStart({ runId: "r1", startedAt: 1000 });
    useRunStore.getState().finish("r1", 0);
    const after = Date.now();

    const { finishedAt } = useRunStore.getState().runs["r1"];
    expect(finishedAt).toBeGreaterThanOrEqual(before);
    expect(finishedAt).toBeLessThanOrEqual(after);
  });

  it("does nothing for an unknown runId", () => {
    const before = useRunStore.getState().runs;
    useRunStore.getState().finish("nonexistent", 0);
    expect(useRunStore.getState().runs).toBe(before);
  });

  it("preserves existing chunks when finishing", () => {
    useRunStore.getState().upsertStart({ runId: "r1", startedAt: 1000 });
    useRunStore
      .getState()
      .appendChunk("r1", { stream: "stdout", text: "output", ts: 1 });
    useRunStore.getState().finish("r1", 0);

    expect(useRunStore.getState().runs["r1"].chunks[0].text).toBe("output");
  });
});

describe("clear", () => {
  it("removes all runs and order", () => {
    useRunStore.getState().upsertStart({ runId: "r1", startedAt: 1000 });
    useRunStore.getState().upsertStart({ runId: "r2", startedAt: 2000 });
    useRunStore.getState().clear();

    const { runs, order } = useRunStore.getState();
    expect(Object.keys(runs)).toHaveLength(0);
    expect(order).toHaveLength(0);
  });
});
