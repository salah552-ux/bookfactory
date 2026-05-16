import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/PageHeader";
import { RunLog } from "@/components/RunLog";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import { useRunStore } from "@/stores/runs";
import { cn } from "@/lib/cn";
import { Rocket } from "lucide-react";

const GENRES: Array<{ id: string; label: string; hint: string }> = [
  { id: "NONFICTION-HEALTH",   label: "Health / Wellness",     hint: "book-architect + health-writer" },
  { id: "NONFICTION-BUSINESS", label: "Business / Productivity", hint: "book-architect + business-writer" },
  { id: "FICTION",             label: "Fiction (general)",     hint: "novel-writer + fiction-writer" },
  { id: "FICTION-MYSTERY",     label: "Mystery / Cosy Crime",  hint: "novel-writer + murder-mystery-writer" },
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
      appendChunk(m.runId, { stream: m.stream, text: m.text, ts: Date.now() });
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
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
      <PageHeader
        eyebrow="Scaffold"
        title="New book"
        subtitle="Wraps new-book.sh. Sets up BLUEPRINT, FACTS, manuscript skeleton, and routes to the correct genre writer."
      />

      <Card>
        <CardHeader>
          <CardTitle>
            <span className="eyebrow mr-3">Step 1</span>Title
          </CardTitle>
        </CardHeader>
        <CardBody className="space-y-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Fix Your Hormones for Good"
            disabled={isRunning}
            className="text-base h-11"
          />
          <div className="text-xs text-slate-500">
            Slug · <code className="text-brand-tan">{slug || "—"}</code>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <span className="eyebrow mr-3">Step 2</span>Genre
          </CardTitle>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GENRES.map((g) => (
            <button
              key={g.id}
              onClick={() => setGenre(g.id)}
              disabled={isRunning}
              className={cn(
                "text-left rounded-lg border p-4 transition-all surface-hover",
                genre === g.id
                  ? "border-brand-tan/60 bg-gradient-to-br from-brand-navy/40 to-slate-900/60 shadow-[var(--glow-tan)]"
                  : "border-slate-800/60 bg-slate-900/40"
              )}
            >
              <div className="text-sm font-semibold text-slate-100">
                {g.label}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono">
                → {g.hint}
              </div>
            </button>
          ))}
        </CardBody>
      </Card>

      <div className="flex items-center gap-3">
        <Button
          variant="gold"
          onClick={create}
          disabled={!title.trim() || !slug || isRunning || status !== "open"}
          size="lg"
        >
          <Rocket className="size-4" /> {isRunning ? "Creating…" : "Create book"}
        </Button>
        {createdSlug && !isRunning && (
          <Button variant="secondary" onClick={() => nav(`/books/${createdSlug}`)}>
            Open {createdSlug} →
          </Button>
        )}
      </div>

      <Card className="h-72">
        <CardHeader>
          <CardTitle>Output</CardTitle>
        </CardHeader>
        <CardBody className="p-0 h-[calc(100%-57px)]">
          <RunLog run={current} className="h-full" />
        </CardBody>
      </Card>
    </div>
  );
}
