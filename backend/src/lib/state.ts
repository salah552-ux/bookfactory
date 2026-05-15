import fs from "node:fs/promises";
import path from "node:path";
import { BOOKS_DIR, bookStateFile, bookDir } from "../paths.js";

export interface BookEntry {
  slug: string;
  state: unknown | null;
}

export async function listBooks(): Promise<BookEntry[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(BOOKS_DIR);
  } catch {
    return [];
  }
  const result: BookEntry[] = [];
  for (const slug of entries) {
    const dirStat = await safeStat(path.join(BOOKS_DIR, slug));
    if (!dirStat?.isDirectory()) continue;
    result.push({ slug, state: await readState(slug) });
  }
  return result.sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function readState(slug: string): Promise<unknown | null> {
  const file = bookStateFile(slug);
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function writeState(slug: string, state: unknown): Promise<void> {
  const file = bookStateFile(slug);
  await ensureDir(bookDir(slug));
  await fs.writeFile(file, JSON.stringify(state, null, 2) + "\n", "utf8");
}

/**
 * Shallow-merge a patch into the existing state object. For nested updates the
 * client should send the merged object — we keep this simple on purpose.
 */
export async function patchState(
  slug: string,
  patch: Record<string, unknown>
): Promise<unknown> {
  const current = (await readState(slug)) ?? {};
  if (typeof current !== "object" || current === null) {
    throw new Error(`pipeline-state for ${slug} is not an object`);
  }
  const merged = { ...(current as Record<string, unknown>), ...patch };
  await writeState(slug, merged);
  return merged;
}

async function safeStat(p: string) {
  try {
    return await fs.stat(p);
  } catch {
    return null;
  }
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}
