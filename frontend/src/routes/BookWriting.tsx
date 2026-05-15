import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChapterPipeline } from "@/components/ChapterPipeline";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import { ArrowLeft, FileText, PlayCircle } from "lucide-react";
import { cn } from "@/lib/cn";

interface Entry {
  name: string;
  type: "file" | "dir";
  size?: number;
}

const GENRE_WRITERS: Record<string, string> = {
  "FICTION-MYSTERY": "murder-mystery-writer",
  FICTION: "fiction-writer",
  "NONFICTION-HEALTH": "health-writer",
  "NONFICTION-BUSINESS": "business-writer",
};

export function BookWriting() {
  const { slug = "" } = useParams<{ slug: string }>();
  const status = useWsStatus();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [state, setState] = useState<Record<string, unknown> | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const path = `books/${slug}/manuscript`;

  useEffect(() => {
    if (status !== "open") return;
    ws.send({ type: "file.list", path });
    ws.send({ type: "pipeline.read", book: slug });
    ws.send({ type: "pipeline.subscribe", book: slug });
  }, [status, slug, path]);

  useWsEvent("file.list.snapshot", (m) => {
    if (m.path === path) setEntries(m.entries);
  });
  useWsEvent("pipeline.snapshot", (m) => {
    if (m.book === slug) setState(m.state as Record<string, unknown> | null);
  });
  useWsEvent("pipeline.changed", (m) => {
    if (m.book === slug) setState(m.state as Record<string, unknown> | null);
  });
  useWsEvent("file.changed", (m) => {
    if (m.path.startsWith(path) && status === "open") {
      ws.send({ type: "file.list", path });
    }
  });

  const chapters = entries.filter(
    (e) => e.type === "file" && /^\d{2}-chapter-\d+\.md$/.test(e.name)
  );

  const genre = (state?.genre as string) ?? "";
  const writerAgent =
    (state?.writing as { writer_agent?: string } | undefined)?.writer_agent ??
    GENRE_WRITERS[genre] ??
    "health-writer";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-4">
      <Link
        to={`/books/${slug}`}
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft className="size-3" /> Book hub
      </Link>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Writing</h1>
          <p className="text-sm text-slate-400 mt-1">
            Stage 03 · chapter pipeline · writer ={" "}
            <span className="font-mono text-brand-tan">{writerAgent}</span>
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setSelected(`__NEW__/ch-${chapters.length + 1}.md`)}
        >
          + New chapter
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <Card className="max-h-[80vh] overflow-auto">
          <CardHeader>
            <CardTitle>Chapters</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            {chapters.length === 0 ? (
              <div className="p-4 text-xs text-slate-500">
                No chapters yet. Click <em>New chapter</em> to start.
              </div>
            ) : (
              chapters.map((c) => {
                const isSel = selected === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setSelected(c.name)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-800/40 border-b border-slate-800/60",
                      isSel && "bg-slate-800/70"
                    )}
                  >
                    <FileText className="size-3 text-slate-500" />
                    <span className="font-mono">{c.name}</span>
                  </button>
                );
              })
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {selected ? (
                  <span className="font-mono">{selected}</span>
                ) : (
                  "Select a chapter"
                )}
              </CardTitle>
              {selected && (
                <Link
                  to={`/books/${slug}/files`}
                  className="text-[11px] text-brand-tan hover:underline"
                >
                  Edit in file browser →
                </Link>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {selected ? (
              <ChapterPipeline
                book={slug}
                chapterPath={selected}
                writerAgent={writerAgent}
              />
            ) : (
              <div className="text-sm text-slate-500 flex flex-col items-center justify-center py-12 gap-2">
                <PlayCircle className="size-8 text-slate-700" />
                <p>
                  Pick a chapter on the left to run its 5-step pipeline.
                </p>
                <p className="text-[11px] text-slate-600 max-w-md text-center">
                  Each chapter goes through brief-validator → writer →
                  fact-checker → book-reviewer (96/120 required) →
                  compliance-officer before it can be saved.
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
