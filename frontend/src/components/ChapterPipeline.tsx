import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { RunLog } from "@/components/RunLog";
import { ScoreBadge } from "@/components/ScoreBadge";
import { ws } from "@/lib/ws";
import { useWsEvent } from "@/hooks/useWs";
import { useRunStore } from "@/stores/runs";
import { cn } from "@/lib/cn";
import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";

/**
 * The mandatory 4-agent + 1-validator chapter pipeline from CLAUDE.md.
 * Order is non-negotiable. Each step is gated by the previous passing.
 */
const STEPS: Array<{
  id: string;
  agent: string;
  label: string;
  hint: string;
}> = [
  { id: "validate", agent: "brief-validator", label: "Validate brief", hint: "Must PASS before writer fires." },
  { id: "write", agent: "WRITER", label: "Write chapter", hint: "Genre-routed (mystery / health / business / fiction)." },
  { id: "fact", agent: "fact-checker", label: "Fact-check", hint: "Verifies every factual claim." },
  { id: "review", agent: "book-reviewer", label: "Book review", hint: "120-point rubric. 96/120 required to save." },
  { id: "compliance", agent: "compliance-officer", label: "Compliance", hint: "Legal + platform policy review." },
];

type Status = "pending" | "running" | "pass" | "block";

export function ChapterPipeline({
  book,
  chapterPath,
  writerAgent,
}: {
  book: string;
  chapterPath: string;
  writerAgent: string;
}) {
  const [, setStep] = useState(0);
  const [brief, setBrief] = useState("");
  const [statuses, setStatuses] = useState<Status[]>(STEPS.map(() => "pending"));
  const [runIds, setRunIds] = useState<(string | null)[]>(STEPS.map(() => null));
  const [score, setScore] = useState<number | null>(null);

  const runs = useRunStore((s) => s.runs);
  const upsertStart = useRunStore((s) => s.upsertStart);
  const appendChunk = useRunStore((s) => s.appendChunk);
  const finishStore = useRunStore((s) => s.finish);

  useWsEvent("run.started", (m) => {
    if (runIds.includes(m.runId))
      upsertStart({
        runId: m.runId,
        agent: m.agent,
        script: m.script,
        book: m.book,
        startedAt: m.ts,
      });
  });
  useWsEvent("run.chunk", (m) => {
    if (!runIds.includes(m.runId)) return;
    appendChunk(m.runId, {
      stream: m.stream,
      text: m.text,
      ts: Date.now(),
    });
    // Sniff a "Score: 102/120" pattern from book-reviewer output.
    if (m.stream === "stdout") {
      const match = m.text.match(/score:\s*(\d{2,3})\s*\/\s*120/i);
      if (match) setScore(Number(match[1]));
    }
  });
  useWsEvent("run.finished", (m) => {
    const idx = runIds.indexOf(m.runId);
    if (idx < 0) return;
    finishStore(m.runId, m.exitCode);
    setStatuses((prev) => {
      const next = [...prev];
      const passed =
        m.exitCode === 0 &&
        (STEPS[idx].agent !== "book-reviewer" || (score ?? 0) >= 96);
      next[idx] = passed ? "pass" : "block";
      return next;
    });
    if (m.exitCode === 0) setStep((s) => Math.max(s, idx + 1));
  });

  function runStep(idx: number) {
    const agent =
      STEPS[idx].agent === "WRITER" ? writerAgent : STEPS[idx].agent;
    const id = crypto.randomUUID();
    setRunIds((prev) => {
      const next = [...prev];
      next[idx] = id;
      return next;
    });
    setStatuses((prev) => {
      const next = [...prev];
      next[idx] = "running";
      return next;
    });
    upsertStart({
      runId: id,
      agent,
      book,
      startedAt: Date.now(),
    });
    ws.send({
      type: "agent.run",
      runId: id,
      agent,
      book,
      args: { chapter_path: chapterPath, brief },
      prompt:
        idx === 0
          ? `Validate the chapter brief for ${chapterPath}. Brief:\n\n${brief}`
          : `Run ${agent} for ${chapterPath} in book ${book}.`,
    });
  }

  const focusRun = useMemo(() => {
    for (let i = STEPS.length - 1; i >= 0; i--) {
      const id = runIds[i];
      if (id) return runs[id];
    }
    return undefined;
  }, [runIds, runs]);

  const canSave = statuses.every((s, i) =>
    i < STEPS.length ? s === "pass" : true
  ) && (score ?? 0) >= 96;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
          Chapter brief
        </label>
        <Textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="POV, scene goal, focus points, FACTS to weave in, target word count…"
          rows={5}
        />
        <p className="mt-1 text-[11px] text-slate-500">
          The brief is passed to brief-validator, which checks it against
          BLUEPRINT.md and FACTS.md before the writer fires.
        </p>
      </div>

      <ol className="space-y-2">
        {STEPS.map((s, i) => {
          const status = statuses[i];
          const enabled =
            i === 0 ? brief.trim().length > 0 : statuses[i - 1] === "pass";
          return (
            <li
              key={s.id}
              className={cn(
                "flex items-center gap-3 rounded-md border px-3 py-2",
                status === "pass" && "border-emerald-800/60 bg-emerald-950/20",
                status === "running" && "border-amber-800/60 bg-amber-950/20",
                status === "block" && "border-red-800/60 bg-red-950/20",
                status === "pending" && "border-slate-800 bg-slate-900/40"
              )}
            >
              <StepIcon status={status} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-200">{s.label}</span>
                  <span className="text-[11px] text-slate-500">
                    {s.agent === "WRITER" ? writerAgent : s.agent}
                  </span>
                  {s.id === "review" && status !== "pending" && (
                    <ScoreBadge score={score} size="sm" />
                  )}
                </div>
                <div className="text-[11px] text-slate-500">{s.hint}</div>
              </div>
              <Button
                size="sm"
                variant={status === "block" ? "danger" : "secondary"}
                disabled={!enabled || status === "running"}
                onClick={() => runStep(i)}
              >
                {status === "running"
                  ? "Running…"
                  : status === "pass"
                    ? "Re-run"
                    : "Run"}
              </Button>
            </li>
          );
        })}
      </ol>

      <div className="flex items-center gap-2">
        <Button
          disabled={!canSave}
          onClick={() => {
            // Saving = the chapter file already exists on disk. We surface
            // a confirmation by toggling a flag in pipeline-state.json — done
            // via pipeline.patch.
            ws.send({
              type: "pipeline.patch",
              book,
              patch: {
                [`chapter_${chapterPath}_saved`]: true,
                [`chapter_${chapterPath}_score`]: score,
              },
            });
          }}
        >
          Save chapter to manuscript
        </Button>
        <p className="text-[11px] text-slate-500">
          Enabled when all 5 steps pass and book-reviewer ≥ 96/120.
        </p>
      </div>

      <div className="h-72 border border-slate-800 rounded-md overflow-hidden">
        <RunLog run={focusRun} className="h-full" />
      </div>
    </div>
  );
}

function StepIcon({ status }: { status: Status }) {
  switch (status) {
    case "running":
      return <Loader2 className="size-4 text-amber-300 animate-spin" />;
    case "pass":
      return <CheckCircle2 className="size-4 text-emerald-400" />;
    case "block":
      return <XCircle className="size-4 text-red-400" />;
    default:
      return <Circle className="size-4 text-slate-600" />;
  }
}
