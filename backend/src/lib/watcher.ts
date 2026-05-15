import chokidar, { type FSWatcher } from "chokidar";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { BOOKS_DIR, BOOKFACTORY_ROOT, toRel } from "../paths.js";
import { broadcast } from "../ws/handler.js";
import { readState } from "./state.js";

let watcher: FSWatcher | null = null;

/**
 * Watch books/ for pipeline-state.json changes and books/<slug>/** for any
 * file changes. Broadcasts pipeline.changed to subscribers, file.changed to
 * all open connections.
 */
export function startWatcher(): void {
  if (watcher) return;

  watcher = chokidar.watch([BOOKS_DIR], {
    ignored: [/(^|[\/\\])\../, /node_modules/, /\.git/, /exports\//],
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 50 },
  });

  watcher.on("change", (abs) => void onChange(abs));
  watcher.on("add", (abs) => void onChange(abs));
  watcher.on("error", (err) => {
    // Swallow watcher noise — never crash the server.
    console.error("[watcher]", err);
  });
}

export async function stopWatcher(): Promise<void> {
  if (!watcher) return;
  await watcher.close();
  watcher = null;
}

async function onChange(abs: string): Promise<void> {
  const rel = toRel(abs);
  const sha = await sha256OfFile(abs);
  if (!sha) return;

  // Pipeline-state changes go to subscribers as a typed event.
  if (path.basename(abs) === "pipeline-state.json") {
    const slug = bookSlugFromPath(abs);
    if (slug) {
      const state = await readState(slug);
      broadcast(
        (cs) => cs.subscribedBooks.has(slug),
        { type: "pipeline.changed", book: slug, state, source: "fs" }
      );
    }
  }

  // Always emit a generic file.changed — clients can filter.
  broadcast(
    () => true,
    { type: "file.changed", path: rel, sha, source: "fs" }
  );
}

function bookSlugFromPath(abs: string): string | null {
  const rel = path.relative(BOOKS_DIR, abs);
  if (rel.startsWith("..")) return null;
  const parts = rel.split(path.sep);
  return parts[0] ?? null;
}

async function sha256OfFile(abs: string): Promise<string | null> {
  try {
    const buf = await fs.readFile(abs);
    return crypto.createHash("sha256").update(buf).digest("hex");
  } catch {
    return null;
  }
}

// Re-export for unused-warning silence in other modules.
export { BOOKFACTORY_ROOT };
