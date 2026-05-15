import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import type { RunRecord } from "@/stores/runs";

const streamClass: Record<string, string> = {
  stdout: "text-slate-200",
  stderr: "text-red-300",
  tool: "text-amber-300",
};

export function RunLog({ run, className }: { run?: RunRecord; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [run?.chunks.length]);

  if (!run) {
    return (
      <div className={cn("p-6 text-sm text-slate-500", className)}>
        No active run. Trigger one from the Agents or Demo page.
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-xs">
        <div className="flex items-center gap-3 text-slate-300">
          <span className="font-mono">{run.runId.slice(0, 10)}</span>
          {run.agent && (
            <span className="px-2 py-0.5 rounded-full bg-brand-navy/40 text-brand-tan">
              {run.agent}
            </span>
          )}
          {run.script && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-300">
              {run.script}
            </span>
          )}
          {run.book && <span className="text-slate-500">{run.book}</span>}
        </div>
        <div className="text-slate-500">
          {run.finishedAt ? (
            <>
              exit {run.exitCode} ·{" "}
              {((run.finishedAt - run.startedAt) / 1000).toFixed(1)}s
            </>
          ) : (
            "running…"
          )}
        </div>
      </div>
      <div
        ref={ref}
        className="flex-1 overflow-auto bg-black/40 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap"
      >
        {run.chunks.length === 0 ? (
          <div className="text-slate-600">waiting for output…</div>
        ) : (
          run.chunks.map((c, i) => (
            <span key={i} className={streamClass[c.stream] ?? "text-slate-300"}>
              {c.text}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
