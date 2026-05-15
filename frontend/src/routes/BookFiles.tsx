import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { FileEditor } from "@/components/Editor";
import { ws } from "@/lib/ws";
import { useWsEvent, useWsStatus } from "@/hooks/useWs";
import { ArrowLeft, FileText, Folder } from "lucide-react";
import { cn } from "@/lib/cn";

interface Entry {
  name: string;
  type: "file" | "dir";
}

export function BookFiles() {
  const { slug = "" } = useParams<{ slug: string }>();
  const status = useWsStatus();
  const [pathStack, setPathStack] = useState<string[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const dir = ["books", slug, ...pathStack].join("/");

  useEffect(() => {
    if (status === "open") ws.send({ type: "file.list", path: dir });
  }, [dir, status]);

  useWsEvent("file.list.snapshot", (m) => {
    if (m.path === dir) setEntries(m.entries);
  });

  useWsEvent("file.changed", (m) => {
    if (m.path.startsWith(dir) && status === "open") {
      ws.send({ type: "file.list", path: dir });
    }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-4">
      <Link
        to={`/books/${slug}`}
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft className="size-3" /> Book hub
      </Link>

      <div className="flex items-center gap-2 text-sm text-slate-300">
        <span className="text-slate-500">path:</span>
        <button
          className="hover:text-slate-100"
          onClick={() => setPathStack([])}
        >
          books/{slug}
        </button>
        {pathStack.map((p, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="text-slate-600">/</span>
            <button
              className="hover:text-slate-100"
              onClick={() => setPathStack(pathStack.slice(0, i + 1))}
            >
              {p}
            </button>
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        <Card className="max-h-[70vh] overflow-auto">
          <CardHeader>
            <CardTitle>Browser</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            {pathStack.length > 0 && (
              <button
                onClick={() => setPathStack(pathStack.slice(0, -1))}
                className="block w-full text-left px-3 py-2 text-xs text-slate-400 hover:bg-slate-800/40"
              >
                ← up
              </button>
            )}
            {entries.map((e) => (
              <button
                key={e.name}
                onClick={() =>
                  e.type === "dir"
                    ? setPathStack([...pathStack, e.name])
                    : setSelected(`${dir}/${e.name}`)
                }
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-slate-800/40",
                  selected === `${dir}/${e.name}` && "bg-slate-800/60"
                )}
              >
                {e.type === "dir" ? (
                  <Folder className="size-3 text-brand-tan" />
                ) : (
                  <FileText className="size-3 text-slate-500" />
                )}
                <span
                  className={
                    e.type === "dir" ? "text-slate-200" : "text-slate-300"
                  }
                >
                  {e.name}
                </span>
              </button>
            ))}
            {entries.length === 0 && (
              <div className="p-3 text-xs text-slate-600">empty</div>
            )}
          </CardBody>
        </Card>

        <div>
          {selected ? (
            <FileEditor key={selected} path={selected} height={560} />
          ) : (
            <Card>
              <CardBody className="text-sm text-slate-500">
                Pick a file on the left to edit. Markdown and JSON files are
                supported. Saves go straight to disk via the backend.
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
