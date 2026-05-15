import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { safeResolve, toRel } from "../paths.js";

export interface FileSnapshot {
  path: string;
  content: string;
  sha: string;
}

export interface ListEntry {
  name: string;
  type: "file" | "dir";
  size?: number;
}

export async function readTextFile(reqPath: string): Promise<FileSnapshot> {
  const abs = safeResolve(reqPath);
  const content = await fs.readFile(abs, "utf8");
  return { path: toRel(abs), content, sha: sha256(content) };
}

export async function writeTextFile(
  reqPath: string,
  content: string,
  expectedSha?: string
): Promise<FileSnapshot> {
  const abs = safeResolve(reqPath);
  if (expectedSha) {
    const existing = await safeRead(abs);
    if (existing !== null && sha256(existing) !== expectedSha) {
      throw new Error("sha mismatch — file changed on disk");
    }
  }
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, content, "utf8");
  return { path: toRel(abs), content, sha: sha256(content) };
}

export async function listDir(reqPath: string): Promise<{
  path: string;
  entries: ListEntry[];
}> {
  const abs = safeResolve(reqPath);
  const dirents = await fs.readdir(abs, { withFileTypes: true });
  const entries: ListEntry[] = [];
  for (const d of dirents) {
    if (d.name.startsWith(".") && d.name !== ".env.example") continue;
    if (d.isDirectory()) {
      entries.push({ name: d.name, type: "dir" });
    } else if (d.isFile()) {
      const stat = await fs.stat(path.join(abs, d.name));
      entries.push({ name: d.name, type: "file", size: stat.size });
    }
  }
  entries.sort((a, b) =>
    a.type === b.type ? a.name.localeCompare(b.name) : a.type === "dir" ? -1 : 1
  );
  return { path: toRel(abs), entries };
}

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

async function safeRead(abs: string): Promise<string | null> {
  try {
    return await fs.readFile(abs, "utf8");
  } catch {
    return null;
  }
}
