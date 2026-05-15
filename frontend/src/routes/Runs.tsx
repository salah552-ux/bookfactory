import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { RunLog } from "@/components/RunLog";
import { useRunStore } from "@/stores/runs";
import { useWsEvent } from "@/hooks/useWs";
import { cn } from "@/lib/cn";

export function Runs() {
  const runs = useRunStore((s) => s.runs);
  const order = useRunStore((s) => s.order);
  const upsertStart = useRunStore((s) => s.upsertStart);
  const appendChunk = useRunStore((s) => s.appendChunk);
  const finish = useRunStore((s) => s.finish);
  const [selected, setSelected] = useState<string | null>(null);

  useWsEvent("run.started", (m) => {
    upsertStart({
      runId: m.runId,
      agent: m.agent,
      script: m.script,
      book: m.book,
      startedAt: m.ts,
    });
    if (!selected) setSelected(m.runId);
  });
  useWsEvent("run.chunk", (m) =>
    appendChunk(m.runId, { stream: m.stream, text: m.text, ts: Date.now() })
  );
  useWsEvent("run.finished", (m) => finish(m.runId, m.exitCode));

  const current = useMemo(
    () => (selected ? runs[selected] : undefined),
    [selected, runs]
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="font-display text-3xl tracking-tight mb-6">Runs</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <Card className="max-h-[70vh] overflow-auto">
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardBody className="p-0 divide-y divide-slate-800">
            {order.length === 0 && (
              <div className="p-4 text-xs text-slate-500">
                No runs yet this session.
              </div>
            )}
            {order.map((id) => {
              const r = runs[id];
              return (
                <button
                  key={id}
                  onClick={() => setSelected(id)}
                  className={cn(
                    "block w-full text-left px-3 py-2 text-xs hover:bg-slate-800/40",
                    selected === id && "bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-300">
                      {r.agent ?? r.script ?? id.slice(0, 8)}
                    </span>
                    <span className="text-slate-500">
                      {r.finishedAt ? `exit ${r.exitCode}` : "running"}
                    </span>
                  </div>
                  {r.book && (
                    <div className="text-slate-500 mt-0.5">{r.book}</div>
                  )}
                </button>
              );
            })}
          </CardBody>
        </Card>

        <Card className="h-[70vh]">
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardBody className="p-0 h-[calc(100%-49px)]">
            <RunLog run={current} className="h-full" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
