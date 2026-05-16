import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { RunLog } from "@/components/RunLog";
import { useRunStore } from "@/stores/runs";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import { ws } from "@/lib/ws";
import { cn } from "@/lib/cn";
import { Activity } from "lucide-react";

export function Runs() {
  const status = useWsStatus();
  const runs = useRunStore((s) => s.runs);
  const order = useRunStore((s) => s.order);
  const upsertStart = useRunStore((s) => s.upsertStart);
  const appendChunk = useRunStore((s) => s.appendChunk);
  const finish = useRunStore((s) => s.finish);
  const [selected, setSelected] = useState<string | null>(null);

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
    for (const c of m.run.chunks) appendChunk(m.run.runId, c);
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
    if (!r || r.chunks.length === 0) {
      ws.send({ type: "run.read", runId: id });
    }
  }

  const current = useMemo(
    () => (selected ? runs[selected] : undefined),
    [selected, runs]
  );

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <PageHeader
        meta="Activity"
        title="Runs"
        description="Every agent invocation and build script run, streamed live and persisted across sessions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
        <Card className="max-h-[72vh] overflow-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>History</CardTitle>
              <span className="text-[11px] text-slate-500">{order.length}</span>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {order.length === 0 ? (
              <EmptyState
                icon={<Activity className="size-5" />}
                title="No runs yet"
                description="Trigger an agent from the Agents page or a build script from any book hub."
              />
            ) : (
              <ul className="divide-y divide-slate-800/50">
                {order.map((id) => {
                  const r = runs[id];
                  const isSel = selected === id;
                  return (
                    <li key={id}>
                      <button
                        onClick={() => openRun(id)}
                        className={cn(
                          "block w-full text-left px-4 py-3 text-xs transition-colors",
                          isSel
                            ? "bg-gradient-to-r from-slate-800/70 to-slate-800/30"
                            : "hover:bg-slate-800/30"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-slate-200 truncate">
                            {r.agent ?? r.script ?? id.slice(0, 8)}
                          </span>
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-2 py-0.5 text-[10px] ring-1",
                              r.finishedAt
                                ? r.exitCode === 0
                                  ? "text-emerald-300 ring-emerald-700/40 bg-emerald-900/20"
                                  : "text-red-300 ring-red-700/40 bg-red-900/20"
                                : "text-amber-300 ring-amber-700/40 bg-amber-900/20"
                            )}
                          >
                            {r.finishedAt
                              ? r.exitCode === 0
                                ? "ok"
                                : `exit ${r.exitCode}`
                              : "running"}
                          </span>
                        </div>
                        <div className="text-slate-500 mt-1 flex items-center justify-between">
                          {r.book && (
                            <span className="font-mono truncate">{r.book}</span>
                          )}
                          <span className="ml-auto">
                            {new Date(r.startedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card className="h-[72vh]">
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardBody className="p-0 h-[calc(100%-57px)]">
            <RunLog run={current} className="h-full" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
