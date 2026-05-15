import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RunLog } from "@/components/RunLog";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import { useRunStore } from "@/stores/runs";
import { cn } from "@/lib/cn";

const GENRES: Array<{ id: string; label: string; hint: string }> = [
  {
    id: "NONFICTION-HEALTH",
    label: "Health / Wellness",
    hint: "→ book-architect + health-writer",
  },
  {
    id: "NONFICTION-BUSINESS",
    label: "Business / Productivity",
    hint: "→ book-architect + business-writer",
  },
  {
    id: "FICTION",
    label: "Fiction (general)",
    hint: "→ novel-writer + fiction-writer",
  },
  {
    id: "FICTION-MYSTERY",
    label: "Mystery / Cosy Crime",
    hint: "→ novel-writer + murder-mystery-writer",
  },
];

function slugify(t: string) {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

export function NewBook() {
  const status = useWsStatus();
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState<string>("NONFICTION-HEALTH");
  const [runId, setRunId] = useState<string | null>(null);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  const runs = useRunStore((s) => s.runs);
  const upsertStart = useRunStore((s) => s.upsertStart);
  const appendChunk = useRunStore((s) => s.appendChunk);
  const finishStore = useRunStore((s) => s.finish);

  const slug = useMemo(() => slugify(title), [title]);

  useWsEvent("run.started", (m) => {
    if (m.runId === runId)
      upsertStart({
        runId: m.runId,
        script: m.script,
        startedAt: m.ts,
      });
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
    if (m.runId === runId) finishStore(m.runId, m.exitCode);
  });
  useWsEvent("book.created", (m) => {
    if (m.runId === runId) setCreatedSlug(m.slug);
  });

  function create() {
    if (!title.trim() || !slug) return;
    const id = crypto.randomUUID();
    setRunId(id);
    setCreatedSlug(null);
    ws.send({
      type: "book.create",
      runId: id,
      slug,
      title: title.trim(),
      genre: genre as
        | "FICTION-MYSTERY"
        | "FICTION"
        | "NONFICTION-HEALTH"
        | "NONFICTION-BUSINESS",
    });
  }

  const current = runId ? runs[runId] : undefined;
  const isRunning = !!current && !current.finishedAt;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight">New book</h1>
        <p className="text-sm text-slate-400 mt-1">
          Wraps <code>new-book.sh</code>. Scaffolds the full book folder with
          BLUEPRINT, FACTS, manuscript skeleton, and the right writer routing.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Title</CardTitle>
        </CardHeader>
        <CardBody className="space-y-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Fix Your Hormones for Good"
            disabled={isRunning}
          />
          <div className="text-xs text-slate-500">
            Slug: <code className="text-brand-tan">{slug || "—"}</code>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Genre</CardTitle>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {GENRES.map((g) => (
            <button
              key={g.id}
              onClick={() => setGenre(g.id)}
              disabled={isRunning}
              className={cn(
                "text-left rounded-md border px-3 py-3 transition-colors",
                genre === g.id
                  ? "border-brand-tan bg-brand-navy/40"
                  : "border-slate-800 hover:bg-slate-800/40"
              )}
            >
              <div className="text-sm text-slate-100">{g.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                {g.hint}
              </div>
            </button>
          ))}
        </CardBody>
      </Card>

      <div className="flex items-center gap-3">
        <Button
          onClick={create}
          disabled={!title.trim() || !slug || isRunning || status !== "open"}
        >
          {isRunning ? "Creating…" : "Create book"}
        </Button>
        {createdSlug && !isRunning && (
          <Button variant="secondary" onClick={() => nav(`/books/${createdSlug}`)}>
            Open {createdSlug} →
          </Button>
        )}
      </div>

      <div className="h-72 border border-slate-800 rounded-md overflow-hidden">
        <RunLog run={current} className="h-full" />
      </div>
    </div>
  );
}
