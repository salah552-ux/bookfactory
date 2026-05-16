import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/PageHeader";
import { StageTracker } from "@/components/StageTracker";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import {
  ArrowLeft,
  FileText,
  FolderTree,
  Hammer,
  PenLine,
  Upload,
} from "lucide-react";
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
  const currentStage = (s.current_stage as string | undefined) ?? "—";

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="size-3.5" /> Fleet
      </Link>

      <PageHeader
        eyebrow={`Book · ${slug}`}
        title={title}
        subtitle={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400">
            <span>
              <span className="text-slate-500">Genre</span>{" "}
              <span className="text-slate-200 ml-1">{genre}</span>
            </span>
            <span>
              <span className="text-slate-500">Current</span>{" "}
              <span className="text-slate-200 ml-1 font-mono">{currentStage}</span>
            </span>
          </span>
        }
        actions={
          <>
            <Link to={`/books/${slug}/writing`}>
              <Button variant="secondary" size="sm">
                <PenLine className="size-3.5" /> Writing
              </Button>
            </Link>
            <Link to={`/books/${slug}/files`}>
              <Button variant="secondary" size="sm">
                <FolderTree className="size-3.5" /> Files
              </Button>
            </Link>
            <Link to={`/books/${slug}/state`}>
              <Button variant="secondary" size="sm">
                <FileText className="size-3.5" /> State
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setPublishOpen(true)}
            >
              <Upload className="size-3.5" /> Publish gate
            </Button>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Pipeline</CardTitle>
        </CardHeader>
        <CardBody>
          <StageTracker state={state} bookSlug={slug} />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Hammer className="size-4 text-brand-tan" />
              <CardTitle>Builds</CardTitle>
            </div>
          </CardHeader>
          <CardBody className="space-y-2">
            <BuildButton script="build-manuscript.sh" slug={slug} />
            <BuildButton script="build-pdf.sh" slug={slug} />
            <BuildButton script="build-print-pdf.sh" slug={slug} />
            <BuildButton script="approve-chapter.sh" slug={slug} />
            <p className="text-[11px] text-slate-500 pt-1">
              Output streams to{" "}
              <Link className="text-brand-tan hover:underline" to="/runs">
                Runs
              </Link>
              .
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FolderTree className="size-4 text-brand-tan" />
              <CardTitle>Files</CardTitle>
            </div>
          </CardHeader>
          <CardBody className="max-h-72 overflow-auto">
            {files.length === 0 ? (
              <div className="text-[11px] text-slate-500">empty</div>
            ) : (
              <ul className="text-xs font-mono text-slate-300 space-y-1">
                {files.map((f) => (
                  <li key={f.name} className="flex items-center gap-2">
                    <span
                      className={
                        f.type === "dir" ? "text-brand-tan" : "text-slate-500"
                      }
                    >
                      {f.type === "dir" ? "▸" : "•"}
                    </span>
                    <span>{f.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Raw pipeline-state.json</CardTitle>
        </CardHeader>
        <CardBody>
          <pre className="text-xs bg-black/40 p-4 rounded-md overflow-auto max-h-80 font-mono text-slate-300 ring-1 ring-slate-800/60">
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
      className="w-full justify-start font-mono text-xs"
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
