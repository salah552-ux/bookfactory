import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/PageHeader";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import type { AgentDescriptor } from "@/lib/schemas";
import { AgentRunnerModal } from "@/components/AgentRunnerModal";
import { Play, Search } from "lucide-react";

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
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <PageHeader
        meta="Catalogue"
        title="Agents"
        description="44 specialists across 11 stages. Each is a Claude Code agent with its own brief and quality gates. Click run on any to invoke it against a book."
        actions={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
            <Input
              className="pl-9 w-72"
              placeholder="Filter by name, stage, description…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        }
      />

      {grouped.map(([stage, list]) => (
        <section key={stage} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="eyebrow">{stage}</div>
            <div className="flex-1 hairline" />
            <div className="text-[11px] text-slate-500">{list.length} agents</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {list.map((a) => (
              <Card key={a.path} hoverable>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="font-mono text-sm truncate">
                        {a.id}
                      </CardTitle>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setRunAgent(a.id)}
                      className="shrink-0"
                    >
                      <Play className="size-3" /> Run
                    </Button>
                  </div>
                </CardHeader>
                {a.description && (
                  <CardBody className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
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
