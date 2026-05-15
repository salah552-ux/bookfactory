import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { RunLog } from "@/components/RunLog";
import { ws } from "@/lib/ws";
import { useRunStore } from "@/stores/runs";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";

function makeId() {
  return crypto.randomUUID();
}

export function Demo() {
  const status = useWsStatus();
  const [runId, setRunId] = useState<string | null>(null);
  const runs = useRunStore((s) => s.runs);
  const upsertStart = useRunStore((s) => s.upsertStart);
  const appendChunk = useRunStore((s) => s.appendChunk);
  const finish = useRunStore((s) => s.finish);

  useWsEvent("run.started", (m) =>
    upsertStart({
      runId: m.runId,
      agent: m.agent,
      script: m.script,
      book: m.book,
      startedAt: m.ts,
    })
  );
  useWsEvent("run.chunk", (m) =>
    appendChunk(m.runId, { stream: m.stream, text: m.text, ts: Date.now() })
  );
  useWsEvent("run.finished", (m) => finish(m.runId, m.exitCode));

  function ping() {
    ws.send({ type: "ping" });
  }

  function listBooks() {
    ws.send({ type: "pipeline.list" });
  }

  function listAgents() {
    ws.send({ type: "agents.list" });
  }

  function runHealth() {
    const id = makeId();
    setRunId(id);
    ws.send({
      type: "build.run",
      runId: id,
      script: "build-manuscript.sh",
      args: ["--help"],
    });
  }

  const currentRun = useMemo(
    () => (runId ? runs[runId] : undefined),
    [runId, runs]
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight">Demo</h1>
        <p className="text-sm text-slate-400 mt-1">
          Sanity-check the backend wiring. Status:{" "}
          <span className="font-mono">{status}</span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>WebSocket probes</CardTitle>
        </CardHeader>
        <CardBody className="flex flex-wrap gap-2">
          <Button onClick={ping} disabled={status !== "open"}>
            Ping
          </Button>
          <Button onClick={listBooks} disabled={status !== "open"} variant="secondary">
            pipeline.list
          </Button>
          <Button onClick={listAgents} disabled={status !== "open"} variant="secondary">
            agents.list
          </Button>
          <Button onClick={runHealth} disabled={status !== "open"} variant="ghost">
            Run build-manuscript.sh --help
          </Button>
        </CardBody>
      </Card>

      <Card className="h-[420px]">
        <CardHeader>
          <CardTitle>Run log</CardTitle>
        </CardHeader>
        <CardBody className="p-0 h-[calc(100%-49px)]">
          <RunLog run={currentRun} className="h-full" />
        </CardBody>
      </Card>
    </div>
  );
}
