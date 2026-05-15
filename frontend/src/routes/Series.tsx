import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AgentRunnerModal } from "@/components/AgentRunnerModal";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import { FileText } from "lucide-react";

const SERIES_FILES = [
  { name: "SERIES-FACTS.md", label: "Series Facts" },
  { name: "SERIES-ROADMAP.md", label: "Roadmap" },
  { name: "SERIES-CONTINUITY-2026-04-27.md", label: "Latest Continuity" },
  { name: "CONTINUITY-REPORT.md", label: "Continuity Report" },
  { name: "CANVA-BRAND-KIT.md", label: "Brand Kit" },
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
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight">Series</h1>
        <p className="text-sm text-slate-400 mt-1">
          Cross-book continuity, brand consistency, and ARC programmes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {SERIES_FILES.map((f) => {
            const content = snapshots[f.name];
            const preview = content?.slice(0, 600);
            const isOpen = openFile === f.name;
            return (
              <Card key={f.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      <span className="font-mono text-sm">{f.name}</span>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{f.label}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setOpenFile(isOpen ? null : f.name)}
                      >
                        {isOpen ? "Collapse" : "Expand"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {content === undefined ? (
                    <div className="text-xs text-slate-500">loading…</div>
                  ) : isOpen ? (
                    <pre className="text-xs font-mono whitespace-pre-wrap text-slate-300 max-h-[60vh] overflow-auto">
                      {content}
                    </pre>
                  ) : (
                    <div className="text-xs text-slate-400 line-clamp-6 whitespace-pre-wrap">
                      {preview}
                      {(content?.length ?? 0) > 600 && "…"}
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Series agents</CardTitle>
            </CardHeader>
            <CardBody className="space-y-1.5">
              {SERIES_AGENTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setRunAgent(a)}
                  className="flex w-full items-center justify-between rounded border border-slate-800 px-3 py-2 text-left hover:bg-slate-800/40"
                >
                  <code className="text-sm text-slate-200">{a}</code>
                  <FileText className="size-3 text-slate-500" />
                </button>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      <AgentRunnerModal
        open={!!runAgent}
        onClose={() => setRunAgent(null)}
        agent={runAgent}
      />
    </div>
  );
}
