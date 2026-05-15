import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import type { AgentDescriptor } from "@/lib/schemas";
import { AgentRunnerModal } from "@/components/AgentRunnerModal";

export function Agents() {
  const status = useWsStatus();
  const [agents, setAgents] = useState<AgentDescriptor[]>([]);
  const [query, setQuery] = useState("");
  const [runAgent, setRunAgent] = useState<string | null>(null);

  useEffect(() => {
    if (status === "open") ws.send({ type: "agents.list" });
  }, [status]);
  useWsEvent("agents.snapshot", (m) => setAgents(m.agents));

  const grouped = useMemo(() => {
    const q = query.toLowerCase();
    const filtered = q
      ? agents.filter(
          (a) =>
            a.id.toLowerCase().includes(q) ||
            a.stage.toLowerCase().includes(q) ||
            (a.description?.toLowerCase().includes(q) ?? false)
        )
      : agents;
    const map = new Map<string, AgentDescriptor[]>();
    for (const a of filtered) {
      const list = map.get(a.stage) ?? [];
      list.push(a);
      map.set(a.stage, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [agents, query]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Agents</h1>
          <p className="text-sm text-slate-400 mt-1">
            All {agents.length} specialists, grouped by stage.
          </p>
        </div>
        <Input
          className="max-w-xs"
          placeholder="Filter agents…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {grouped.map(([stage, list]) => (
        <section key={stage}>
          <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-2 font-mono">
            {stage}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {list.map((a) => (
              <Card key={a.path}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{a.id}</CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setRunAgent(a.id)}
                    >
                      Run
                    </Button>
                  </div>
                </CardHeader>
                {a.description && (
                  <CardBody className="text-xs text-slate-400 line-clamp-4">
                    {a.description}
                  </CardBody>
                )}
              </Card>
            ))}
          </div>
        </section>
      ))}

      <AgentRunnerModal
        open={!!runAgent}
        onClose={() => setRunAgent(null)}
        agent={runAgent}
      />
    </div>
  );
}
