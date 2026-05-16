import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/PageHeader";
import { AgentRunnerModal } from "@/components/AgentRunnerModal";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import { FileText, Play } from "lucide-react";

const SERIES_FILES = [
  { name: "SERIES-FACTS.md",                  label: "Series Facts" },
  { name: "SERIES-ROADMAP.md",                label: "Roadmap" },
  { name: "SERIES-CONTINUITY-2026-04-27.md",  label: "Latest Continuity" },
  { name: "CONTINUITY-REPORT.md",             label: "Continuity Report" },
  { name: "CANVA-BRAND-KIT.md",               label: "Brand Kit" },
];

const SERIES_AGENTS = [
  "series-manager",
  "series-sync-agent",
  "series-continuity-guardian",
  "arc-manager-agent",
];

export function Series() {
  const status = useWsStatus();
  const [snapshots, setSnapshots] = useState<Record<string, string>>({});
  const [openFile, setOpenFile] = useState<string | null>(null);
  const [runAgent, setRunAgent] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "open") return;
    for (const f of SERIES_FILES) {
      ws.send({ type: "file.read", path: f.name });
    }
  }, [status]);

  useWsEvent("file.snapshot", (m) => {
    if (SERIES_FILES.some((f) => f.name === m.path)) {
      setSnapshots((s) => ({ ...s, [m.path]: m.content }));
    }
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <PageHeader
        meta="Catalogue"
        title="Series"
        description="Cross-book continuity, brand consistency, ARC programmes."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {SERIES_FILES.map((f) => {
            const content = snapshots[f.name];
            const preview = content?.slice(0, 600);
            const isOpen = openFile === f.name;
            return (
              <Card key={f.name}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="font-mono text-sm truncate">
                        {f.name}
                      </CardTitle>
                      <div className="text-[11px] text-slate-500 mt-0.5">{f.label}</div>
                    </div>
                    <button
                      onClick={() => setOpenFile(isOpen ? null : f.name)}
                      className="text-[11px] text-brand-tan hover:underline shrink-0"
                    >
                      {isOpen ? "Collapse" : "Expand"}
                    </button>
                  </div>
                </CardHeader>
                <CardBody>
                  {content === undefined ? (
                    <div className="text-xs text-slate-500">loading…</div>
                  ) : isOpen ? (
                    <pre className="text-xs font-mono whitespace-pre-wrap text-slate-300 max-h-[60vh] overflow-auto bg-black/30 rounded-md p-4 ring-1 ring-slate-800/60">
                      {content}
                    </pre>
                  ) : (
                    <div className="text-xs text-slate-400 line-clamp-6 whitespace-pre-wrap leading-relaxed">
                      {preview}
                      {(content?.length ?? 0) > 600 && "…"}
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Series agents</CardTitle>
          </CardHeader>
          <CardBody className="space-y-1.5">
            {SERIES_AGENTS.map((a) => (
              <button
                key={a}
                onClick={() => setRunAgent(a)}
                className="flex w-full items-center justify-between rounded-md border border-slate-800/60 bg-slate-900/40 px-3 py-2 text-left hover:bg-slate-900/70 transition-colors"
              >
                <code className="text-xs text-slate-200 font-mono">{a}</code>
                <Play className="size-3 text-slate-500" />
              </button>
            ))}
            <div className="hairline my-3" />
            <p className="text-[11px] text-slate-500">
              <FileText className="inline size-3 mr-1" />
              Files load from the repo root via the backend WS.
            </p>
          </CardBody>
        </Card>
      </div>

      <AgentRunnerModal
        open={!!runAgent}
        onClose={() => setRunAgent(null)}
        agent={runAgent}
      />
    </div>
  );
}
