import { z } from "zod";

/* ============================================================
 * Client → Server messages
 * ============================================================ */

export const PingMsg = z.object({ type: z.literal("ping") });

export const AgentRunMsg = z.object({
  type: z.literal("agent.run"),
  runId: z.string().min(1),
  agent: z.string().min(1),
  book: z.string().min(1).optional(),
  args: z.record(z.unknown()).optional(),
  prompt: z.string().optional(),
});

export const AgentCancelMsg = z.object({
  type: z.literal("agent.cancel"),
  runId: z.string().min(1),
});

export const PipelineReadMsg = z.object({
  type: z.literal("pipeline.read"),
  book: z.string().min(1),
});

export const PipelineListMsg = z.object({
  type: z.literal("pipeline.list"),
});

export const PipelinePatchMsg = z.object({
  type: z.literal("pipeline.patch"),
  book: z.string().min(1),
  patch: z.record(z.unknown()),
});

export const PipelineSubscribeMsg = z.object({
  type: z.literal("pipeline.subscribe"),
  book: z.string().min(1),
});

export const PipelineUnsubscribeMsg = z.object({
  type: z.literal("pipeline.unsubscribe"),
  book: z.string().min(1),
});

export const FileReadMsg = z.object({
  type: z.literal("file.read"),
  path: z.string().min(1),
});

export const FileWriteMsg = z.object({
  type: z.literal("file.write"),
  path: z.string().min(1),
  content: z.string(),
  sha: z.string().optional(),
});

export const FileListMsg = z.object({
  type: z.literal("file.list"),
  path: z.string().min(1),
});

export const BuildRunMsg = z.object({
  type: z.literal("build.run"),
  runId: z.string().min(1),
  script: z.enum([
    "build-manuscript.sh",
    "build-pdf.sh",
    "build-print-pdf.sh",
    "new-book.sh",
    "approve-chapter.sh",
  ]),
  book: z.string().min(1).optional(),
  args: z.array(z.string()).optional(),
});

export const AgentsListMsg = z.object({
  type: z.literal("agents.list"),
});

export const KdpPublishConfirmMsg = z.object({
  type: z.literal("kdp.publish.confirm"),
  book: z.string().min(1),
  phrase: z.string(),
});

export const ClientMsg = z.discriminatedUnion("type", [
  PingMsg,
  AgentRunMsg,
  AgentCancelMsg,
  PipelineReadMsg,
  PipelineListMsg,
  PipelinePatchMsg,
  PipelineSubscribeMsg,
  PipelineUnsubscribeMsg,
  FileReadMsg,
  FileWriteMsg,
  FileListMsg,
  BuildRunMsg,
  AgentsListMsg,
  KdpPublishConfirmMsg,
]);

export type ClientMsg = z.infer<typeof ClientMsg>;

/* ============================================================
 * Server → Client messages — built as plain TS interfaces so the
 * server can emit them without round-tripping through zod.
 * ============================================================ */

export type ServerMsg =
  | { type: "pong" }
  | { type: "hello"; version: string; bookfactoryRoot: string }
  | { type: "run.started"; runId: string; agent?: string; script?: string; book?: string; ts: number }
  | { type: "run.chunk"; runId: string; stream: "stdout" | "stderr" | "tool"; text: string }
  | { type: "run.artefact"; runId: string; path: string; kind: string }
  | { type: "run.finished"; runId: string; exitCode: number; durationMs: number }
  | { type: "pipeline.snapshot"; book: string; state: unknown }
  | { type: "pipeline.list.snapshot"; books: Array<{ slug: string; state: unknown | null }> }
  | { type: "pipeline.changed"; book: string; state: unknown; source: string }
  | { type: "file.snapshot"; path: string; content: string; sha: string }
  | { type: "file.list.snapshot"; path: string; entries: Array<{ name: string; type: "file" | "dir"; size?: number }> }
  | { type: "file.changed"; path: string; sha: string; source: string }
  | { type: "agents.snapshot"; agents: AgentDescriptor[]; manifest: unknown }
  | { type: "kdp.publish.result"; book: string; ok: boolean; message: string }
  | { type: "error"; runId?: string; code: string; message: string; detail?: unknown };

export interface AgentDescriptor {
  id: string;
  stage: string;
  path: string;
  description?: string;
}
