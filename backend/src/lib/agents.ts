import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import { AGENTS_DIR, PIPELINE_MANIFEST } from "../paths.js";
import type { AgentDescriptor } from "../schemas.js";

let cache: { agents: AgentDescriptor[]; manifest: unknown } | null = null;

/**
 * Build the agent catalogue from .claude/agents/. Each agent is a .md file
 * inside a stage folder (00-coordinator, 01-research, ...). Description is
 * pulled from frontmatter or the first non-heading paragraph.
 */
export async function loadAgents(): Promise<{
  agents: AgentDescriptor[];
  manifest: unknown;
}> {
  if (cache) return cache;

  const manifestRaw = await fs.readFile(PIPELINE_MANIFEST, "utf8");
  const manifest = JSON.parse(manifestRaw);

  const files = await fg("*/*.md", { cwd: AGENTS_DIR, dot: false });
  const agents: AgentDescriptor[] = [];

  for (const rel of files) {
    const abs = path.join(AGENTS_DIR, rel);
    const stage = path.dirname(rel);
    const id = path.basename(rel, ".md");
    const content = await fs.readFile(abs, "utf8");
    const description = extractDescription(content);
    agents.push({ id, stage, path: rel, description });
  }

  agents.sort((a, b) =>
    a.stage === b.stage ? a.id.localeCompare(b.id) : a.stage.localeCompare(b.stage)
  );

  cache = { agents, manifest };
  return cache;
}

export function clearAgentCache(): void {
  cache = null;
}

function extractDescription(content: string): string | undefined {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    const desc = fmMatch[1].match(/^description:\s*(.+)$/m);
    if (desc) return desc[1].trim();
  }
  const lines = content.split("\n").filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith("---"));
  if (lines.length > 0) return lines[0].trim().slice(0, 280);
  return undefined;
}
