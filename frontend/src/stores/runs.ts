import { create } from "zustand";

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

interface RunStore {
  runs: Record<string, RunRecord>;
  order: string[];
  upsertStart: (r: Omit<RunRecord, "chunks">) => void;
  appendChunk: (runId: string, chunk: RunChunk) => void;
  finish: (runId: string, exitCode: number) => void;
  clear: () => void;
}

export const useRunStore = create<RunStore>((set) => ({
  runs: {},
  order: [],
  upsertStart: (r) =>
    set((s) => ({
      runs: { ...s.runs, [r.runId]: { ...r, chunks: [] } },
      order: s.order.includes(r.runId) ? s.order : [r.runId, ...s.order],
    })),
  appendChunk: (runId, chunk) =>
    set((s) => {
      const existing = s.runs[runId];
      if (!existing) return s;
      return {
        ...s,
        runs: {
          ...s.runs,
          [runId]: { ...existing, chunks: [...existing.chunks, chunk] },
        },
      };
    }),
  finish: (runId, exitCode) =>
    set((s) => {
      const existing = s.runs[runId];
      if (!existing) return s;
      return {
        ...s,
        runs: {
          ...s.runs,
          [runId]: { ...existing, finishedAt: Date.now(), exitCode },
        },
      };
    }),
  clear: () => set({ runs: {}, order: [] }),
}));
