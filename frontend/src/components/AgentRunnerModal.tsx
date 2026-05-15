import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { RunLog } from "@/components/RunLog";
import { ws } from "@/lib/ws";
import { useWsEvent } from "@/hooks/useWs";
import { useRunStore } from "@/stores/runs";
import { Play, Square } from "lucide-react";

export function AgentRunnerModal({
  open,
  onClose,
  agent,
  defaultBook,
}: {
  open: boolean;
  onClose: () => void;
  agent: string | null;
  defaultBook?: string;
}) {
  const [book, setBook] = useState(defaultBook ?? "");
  const [prompt, setPrompt] = useState("");
  const [runId, setRunId] = useState<string | null>(null);

  const runs = useRunStore((s) => s.runs);
  const upsertStart = useRunStore((s) => s.upsertStart);
  const appendChunk = useRunStore((s) => s.appendChunk);
  const finish = useRunStore((s) => s.finish);

  useEffect(() => {
    if (open) {
      setBook(defaultBook ?? "");
      setPrompt("");
      setRunId(null);
    }
  }, [open, defaultBook]);

  useWsEvent("run.started", (m) => {
    if (m.runId === runId) {
      upsertStart({
        runId: m.runId,
        agent: m.agent,
        script: m.script,
        book: m.book,
        startedAt: m.ts,
      });
    }
  });
  useWsEvent("run.chunk", (m) => {
    if (m.runId === runId)
      appendChunk(m.runId, {
        stream: m.stream,
        text: m.text,
        ts: Date.now(),
      });
  });
  useWsEvent("run.finished", (m) => {
    if (m.runId === runId) finish(m.runId, m.exitCode);
  });

  const current = useMemo(
    () => (runId ? runs[runId] : undefined),
    [runId, runs]
  );

  function start() {
    if (!agent) return;
    const id = crypto.randomUUID();
    setRunId(id);
    upsertStart({
      runId: id,
      agent,
      book: book || undefined,
      startedAt: Date.now(),
    });
    ws.send({
      type: "agent.run",
      runId: id,
      agent,
      book: book || undefined,
      prompt: prompt || undefined,
    });
  }

  function cancel() {
    if (!runId) return;
    ws.send({ type: "agent.cancel", runId });
  }

  const isRunning = !!current && !current.finishedAt;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={agent ? `Run · ${agent}` : "Run agent"}
      width="max-w-4xl"
    >
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Book slug" hint="Optional. Sets the agent's working directory.">
            <Input
              value={book}
              onChange={(e) => setBook(e.target.value)}
              placeholder="fix-your-gut-for-good"
              disabled={isRunning}
            />
          </Field>
          <Field
            label="Prompt"
            hint="Optional — only needed for free-form agent input."
          >
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Write Chapter 4 — focus on the gut–brain axis."
              disabled={isRunning}
              rows={3}
            />
          </Field>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={start} disabled={!agent || isRunning}>
            <Play className="size-4" /> Run
          </Button>
          {isRunning && (
            <Button variant="danger" onClick={cancel}>
              <Square className="size-4" /> Cancel
            </Button>
          )}
          <p className="text-[11px] text-slate-500 ml-auto">
            Runs your local <code>claude</code> CLI. Consumes your Claude quota.
          </p>
        </div>

        <div className="h-80 border border-slate-800 rounded-md overflow-hidden">
          <RunLog run={current} className="h-full" />
        </div>
      </div>
    </Modal>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>
        {hint && (
          <span className="text-[11px] text-slate-500 truncate ml-2">
            {hint}
          </span>
        )}
      </div>
      <div className="mt-1">{children}</div>
    </label>
  );
}
