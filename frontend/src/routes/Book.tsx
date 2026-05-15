import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StageTracker } from "@/components/StageTracker";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import { ArrowLeft, FileText, FolderTree, PenLine, Upload } from "lucide-react";
import { PublishGateModal } from "@/components/PublishGateModal";

export function Book() {
  const { slug = "" } = useParams<{ slug: string }>();
  const status = useWsStatus();
  const [state, setState] = useState<unknown>(null);
  const [files, setFiles] = useState<Array<{ name: string; type: string }>>([]);
  const [publishOpen, setPublishOpen] = useState(false);

  useEffect(() => {
    if (status === "open") {
      ws.send({ type: "pipeline.read", book: slug });
      ws.send({ type: "pipeline.subscribe", book: slug });
      ws.send({ type: "file.list", path: `books/${slug}` });
    }
  }, [slug, status]);

  useWsEvent("pipeline.snapshot", (m) => {
    if (m.book === slug) setState(m.state);
  });
  useWsEvent("pipeline.changed", (m) => {
    if (m.book === slug) setState(m.state);
  });
  useWsEvent("file.list.snapshot", (m) => {
    if (m.path === `books/${slug}`) setFiles(m.entries);
  });

  const s = (state ?? {}) as Record<string, unknown>;
  const title = (s.book_title as string | undefined) ?? slug;
  const genre = (s.genre as string | undefined) ?? "—";

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft className="size-3" /> Fleet
      </Link>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">{title}</h1>
          <div className="text-sm text-slate-500 mt-1 font-mono">{slug}</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            to={`/books/${slug}/writing`}
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            <PenLine className="size-3" /> Writing
          </Link>
          <Link
            to={`/books/${slug}/files`}
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            <FolderTree className="size-3" /> Files
          </Link>
          <Link
            to={`/books/${slug}/state`}
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            <FileText className="size-3" /> State JSON
          </Link>
          <button
            onClick={() => setPublishOpen(true)}
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-900"
          >
            <Upload className="size-3" /> Publish gate
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="text-xs text-slate-400">
            <span className="text-slate-500 mr-2">Genre</span>
            <span className="text-slate-200">{genre}</span>
          </div>
          <StageTracker state={state} />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Builds</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            <BuildButton script="build-manuscript.sh" slug={slug} />
            <BuildButton script="build-pdf.sh" slug={slug} />
            <BuildButton script="build-print-pdf.sh" slug={slug} />
            <BuildButton script="approve-chapter.sh" slug={slug} />
            <p className="text-[11px] text-slate-500 pt-2">
              Output streams under <Link className="text-brand-tan underline" to="/runs">Runs</Link>.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Files</CardTitle>
          </CardHeader>
          <CardBody className="max-h-72 overflow-auto">
            <ul className="text-xs font-mono text-slate-300 space-y-1">
              {files.map((f) => (
                <li key={f.name} className="flex items-center gap-2">
                  <span
                    className={
                      f.type === "dir" ? "text-brand-tan" : "text-slate-500"
                    }
                  >
                    {f.type === "dir" ? "📁" : "📄"}
                  </span>
                  <span>{f.name}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Raw pipeline-state.json</CardTitle>
        </CardHeader>
        <CardBody>
          <pre className="text-xs bg-black/40 p-3 rounded overflow-auto max-h-80 font-mono text-slate-300">
{JSON.stringify(state, null, 2)}
          </pre>
        </CardBody>
      </Card>

      <PublishGateModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        book={slug}
      />
    </div>
  );
}

function BuildButton({ script, slug }: { script: string; slug: string }) {
  return (
    <Button
      variant="secondary"
      className="w-full justify-start"
      onClick={() =>
        ws.send({
          type: "build.run",
          runId: crypto.randomUUID(),
          script,
          book: slug,
        })
      }
    >
      bash {script} {slug}
    </Button>
  );
}
