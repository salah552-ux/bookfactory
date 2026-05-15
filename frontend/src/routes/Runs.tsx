import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { RunLog } from "@/components/RunLog";
import { useRunStore } from "@/stores/runs";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import { ws } from "@/lib/ws";
import { cn } from "@/lib/cn";

export function Runs() {
  const status = useWsStatus();
  const runs = useRunStore((s) => s.runs);
  const order = useRunStore((s) => s.order);
  const upsertStart = useRunStore((s) => s.upsertStart);
  const appendChunk = useRunStore((s) => s.appendChunk);
  const finish = useRunStore((s) => s.finish);
  const [selected, setSelected] = useState<string | null>(null);

  // Hydrate from server on connect.
  useEffect(() => {
    if (status === "open") ws.send({ type: "runs.list" });
  }, [status]);

  useWsEvent("runs.list.snapshot", (m) => {
    for (const r of m.runs) {
      upsertStart({
        runId: r.runId,
        agent: r.agent,
        script: r.script,
        book: r.book,
        startedAt: r.startedAt,
      });
      if (r.finishedAt && typeof r.exitCode === "number")
        finish(r.runId, r.exitCode);
    }
  });

  useWsEvent("run.snapshot", (m) => {
    upsertStart({
      runId: m.run.runId,
      agent: m.run.agent,
      script: m.run.script,
      book: m.run.book,
      startedAt: m.run.startedAt,
    });
    for (const c of m.run.chunks) {
      appendChunk(m.run.runId, c);
    }
    if (m.run.finishedAt && typeof m.run.exitCode === "number")
      finish(m.run.runId, m.run.exitCode);
  });

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

  function openRun(id: string) {
    setSelected(id);
    const r = runs[id];
    // If we don't have chunks yet (just summary from persistent list), fetch.
    if (!r || r.chunks.length === 0) {
      ws.send({ type: "run.read", runId: id });
    }
  }

  const current = useMemo(
    () => (selected ? runs[selected] : undefined),
    [selected, runs]
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl tracking-tight">Runs</h1>
        <div className="text-xs text-slate-500">
          {order.length} runs · persistent across sessions
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
        <Card className="max-h-[75vh] overflow-auto">
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardBody className="p-0 divide-y divide-slate-800">
            {order.length === 0 && (
              <div className="p-4 text-xs text-slate-500">
                No runs recorded yet.
              </div>
            )}
            {order.map((id) => {
              const r = runs[id];
              return (
                <button
                  key={id}
                  onClick={() => openRun(id)}
                  className={cn(
                    "block w-full text-left px-3 py-2 text-xs hover:bg-slate-800/40",
                    selected === id && "bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-300 truncate">
                      {r.agent ?? r.script ?? id.slice(0, 8)}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] ml-2",
                        r.finishedAt
                          ? r.exitCode === 0
                            ? "text-emerald-400"
                            : "text-red-400"
                          : "text-amber-400"
                      )}
                    >
                      {r.finishedAt
                        ? r.exitCode === 0
                          ? "ok"
                          : `exit ${r.exitCode}`
                        : "running"}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-0.5 flex justify-between">
                    {r.book && <span>{r.book}</span>}
                    <span className="ml-auto">
                      {new Date(r.startedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </button>
              );
            })}
          </CardBody>
        </Card>

        <Card className="h-[75vh]">
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
