import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/PageHeader";
import { AgentRunnerModal } from "@/components/AgentRunnerModal";
import { parseArtefact } from "@/lib/postLaunchData";
import type { PostLaunchData } from "@/components/PostLaunchCharts";
const PostLaunchCharts = lazy(() =>
  import("@/components/PostLaunchCharts").then((m) => ({
    default: m.PostLaunchCharts,
  }))
);
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import { STAGES, stageById } from "@/lib/stages";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  ExternalLink,
  Play,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/cn";

export function BookStage() {
  const { slug = "", stageId = "" } = useParams<{
    slug: string;
    stageId: string;
  }>();
  const status = useWsStatus();
  const stage = stageById(stageId);

  const [state, setState] = useState<Record<string, unknown> | null>(null);
  const [files, setFiles] = useState<Array<{ name: string; type: string }>>([]);
  const [runAgent, setRunAgent] = useState<string | null>(null);
  const [postLaunchData, setPostLaunchData] = useState<PostLaunchData>({});

  useEffect(() => {
    if (status !== "open") return;
    ws.send({ type: "pipeline.read", book: slug });
    ws.send({ type: "pipeline.subscribe", book: slug });
    ws.send({ type: "file.list", path: `books/${slug}` });
    if (stageId === "10-postlaunch") {
      ws.send({
        type: "file.read",
        path: `books/${slug}/POST-LAUNCH-DATA.json`,
      });
    }
  }, [status, slug, stageId]);

  useWsEvent("pipeline.snapshot", (m) => {
    if (m.book === slug) setState(m.state as Record<string, unknown> | null);
  });
  useWsEvent("pipeline.changed", (m) => {
    if (m.book === slug) setState(m.state as Record<string, unknown> | null);
  });
  useWsEvent("file.list.snapshot", (m) => {
    if (m.path === `books/${slug}`) setFiles(m.entries);
  });
  useWsEvent("file.snapshot", (m) => {
    if (m.path === `books/${slug}/POST-LAUNCH-DATA.json`) {
      setPostLaunchData(parseArtefact(m.content));
    }
  });
  useWsEvent("file.changed", (m) => {
    if (m.path === `books/${slug}/POST-LAUNCH-DATA.json` && status === "open") {
      ws.send({ type: "file.read", path: m.path });
    }
  });

  if (!stage) {
    return (
      <div className="p-10 max-w-3xl mx-auto">
        <p className="text-red-300 text-sm">Unknown stage: {stageId}</p>
        <Link to={`/books/${slug}`} className="text-brand-tan text-xs underline">
          Back to book hub
        </Link>
      </div>
    );
  }

  const gateValue =
    stage.human_gate_field && state
      ? Boolean((state as Record<string, unknown>)[stage.human_gate_field])
      : false;

  function toggleGate() {
    if (!stage?.human_gate_field) return;
    ws.send({
      type: "pipeline.patch",
      book: slug,
      patch: { [stage.human_gate_field]: !gateValue },
    });
  }

  function runParallelGroup(group: string[]) {
    for (const agent of group) {
      ws.send({
        type: "agent.run",
        runId: crypto.randomUUID(),
        agent,
        book: slug,
      });
    }
  }

  const expectedOutputs = stage.outputs ?? [];

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          to={`/books/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Book hub
        </Link>
        <nav className="flex gap-1 text-[11px] flex-wrap justify-end">
          {STAGES.map((s) => (
            <Link
              key={s.id}
              to={`/books/${slug}/stage/${s.id}`}
              className={cn(
                "px-2.5 py-1 rounded-md font-mono transition-colors ring-1",
                s.id === stage.id
                  ? "bg-gradient-to-b from-[#2b507a] to-[#1b3a5c] text-white ring-brand-navy/60"
                  : "bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200 ring-slate-700/50"
              )}
            >
              {s.id.slice(0, 2)}
            </Link>
          ))}
        </nav>
      </div>

      <PageHeader
        meta={stage.id}
        title={stage.name}
        description={stage.notes}
      />

      {stage.id === "10-postlaunch" && (
        <Suspense
          fallback={
            <div className="text-xs text-slate-500">Loading charts…</div>
          }
        >
          <PostLaunchCharts data={postLaunchData} />
        </Suspense>
      )}

      {stage.id === "03-writing" && (
        <Card>
          <CardBody className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-slate-200">
                Writing has its own dedicated pipeline UI.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Brief-validator → writer → fact-checker → book-reviewer ≥96 → compliance-officer.
              </p>
            </div>
            <Link to={`/books/${slug}/writing`}>
              <Button variant="primary" size="sm">
                <PlayCircle className="size-3.5" /> Open Writing
              </Button>
            </Link>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Agents</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              {stage.parallel?.map((group, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-emerald-900/40 bg-gradient-to-br from-emerald-950/30 to-emerald-950/10 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="eyebrow text-emerald-300">Parallel group</div>
                    <Button
                      size="sm"
                      onClick={() => runParallelGroup(group)}
                      disabled={status !== "open"}
                    >
                      <Play className="size-3" /> Run pair
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.map((a) => (
                      <button
                        key={a}
                        onClick={() => setRunAgent(a)}
                        className="text-xs px-2.5 py-1 rounded bg-slate-800/70 hover:bg-slate-700 text-slate-200 font-mono ring-1 ring-slate-700/60"
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <ul className="space-y-1.5">
                {stage.agents.map((a) => (
                  <li
                    key={a}
                    className="flex items-center justify-between rounded-md border border-slate-800/60 bg-slate-900/40 px-4 py-2.5 hover:bg-slate-900/70 transition-colors"
                  >
                    <code className="text-sm text-slate-200 font-mono">{a}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setRunAgent(a)}
                    >
                      <Play className="size-3" /> Run
                    </Button>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {stage.human_gate_field && (
            <Card>
              <CardHeader>
                <CardTitle>Human gate</CardTitle>
              </CardHeader>
              <CardBody>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gateValue}
                    onChange={toggleGate}
                    className="size-4 mt-0.5 accent-brand-tan"
                  />
                  <div>
                    <div className="text-sm text-slate-200">
                      <code className="text-brand-tan">
                        {stage.human_gate_field}
                      </code>
                    </div>
                    {stage.human_gate_instruction && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {stage.human_gate_instruction}
                      </p>
                    )}
                  </div>
                </label>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Deliverables</CardTitle>
            </CardHeader>
            <CardBody className="text-xs">
              {expectedOutputs.length === 0 ? (
                <p className="text-slate-500">None defined.</p>
              ) : (
                <ul className="space-y-2">
                  {expectedOutputs.map((o) => {
                    const exists = files.some(
                      (f) =>
                        f.name === o ||
                        f.name.startsWith(o.replace(/\*$/, ""))
                    );
                    return (
                      <li
                        key={o}
                        className="flex items-center gap-2 text-slate-300"
                      >
                        {exists ? (
                          <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="size-3.5 text-slate-600 shrink-0" />
                        )}
                        <code
                          className={cn(
                            "truncate font-mono",
                            exists ? "text-slate-100" : "text-slate-500"
                          )}
                        >
                          {o}
                        </code>
                        {exists && o.indexOf("*") < 0 && (
                          <Link
                            to={`/books/${slug}/files`}
                            className="ml-auto text-brand-tan hover:text-brand-tan/80"
                            title="Open in file browser"
                          >
                            <ExternalLink className="size-3" />
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <AgentRunnerModal
        open={!!runAgent}
        onClose={() => setRunAgent(null)}
        agent={runAgent}
        defaultBook={slug}
      />
    </div>
  );
}
