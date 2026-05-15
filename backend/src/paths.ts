import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const BACKEND_ROOT = path.resolve(here, "..");

export const BOOKFACTORY_ROOT = path.resolve(
  BACKEND_ROOT,
  process.env.BOOKFACTORY_ROOT ?? ".."
);

export const BOOKS_DIR = path.join(BOOKFACTORY_ROOT, "books");
export const AGENTS_DIR = path.join(BOOKFACTORY_ROOT, ".claude", "agents");
export const PIPELINE_MANIFEST = path.join(AGENTS_DIR, "PIPELINE-MANIFEST.json");
export const PIPELINE_STATE_TEMPLATE = path.join(
  BOOKFACTORY_ROOT,
  "pipeline-state.template.json"
);
export const PIPELINE_STATE_SCHEMA = path.join(
  BOOKFACTORY_ROOT,
  "pipeline-state.schema.json"
);

export function bookDir(slug: string): string {
  return path.join(BOOKS_DIR, slug);
}

export function bookStateFile(slug: string): string {
  return path.join(bookDir(slug), "pipeline-state.json");
}

/**
 * Resolve a request path safely under BOOKFACTORY_ROOT.
 * Throws if the resolved path escapes the root.
 */
export function safeResolve(relOrAbs: string): string {
  const resolved = path.isAbsolute(relOrAbs)
    ? path.resolve(relOrAbs)
    : path.resolve(BOOKFACTORY_ROOT, relOrAbs);
  const rootWithSep = BOOKFACTORY_ROOT.endsWith(path.sep)
    ? BOOKFACTORY_ROOT
    : BOOKFACTORY_ROOT + path.sep;
  if (resolved !== BOOKFACTORY_ROOT && !resolved.startsWith(rootWithSep)) {
    throw new Error(`Path escapes BOOKFACTORY_ROOT: ${relOrAbs}`);
  }
  return resolved;
}

/**
 * Convert an absolute path back to a project-relative path.
 */
export function toRel(abs: string): string {
  return path.relative(BOOKFACTORY_ROOT, abs);
}
