import { z } from "zod";

export const AgentDescriptor = z.object({
  id: z.string(),
  stage: z.string(),
  path: z.string(),
  description: z.string().optional(),
});
export type AgentDescriptor = z.infer<typeof AgentDescriptor>;

export const BookEntry = z.object({
  slug: z.string(),
  state: z.unknown().nullable(),
});
export type BookEntry = z.infer<typeof BookEntry>;

export const ServerMsg = z.discriminatedUnion("type", [
  z.object({ type: z.literal("pong") }),
  z.object({
    type: z.literal("hello"),
    version: z.string(),
    bookfactoryRoot: z.string(),
  }),
  z.object({
    type: z.literal("run.started"),
    runId: z.string(),
    agent: z.string().optional(),
    script: z.string().optional(),
    book: z.string().optional(),
    ts: z.number(),
  }),
  z.object({
    type: z.literal("run.chunk"),
    runId: z.string(),
    stream: z.enum(["stdout", "stderr", "tool"]),
    text: z.string(),
  }),
  z.object({
    type: z.literal("run.artefact"),
    runId: z.string(),
    path: z.string(),
    kind: z.string(),
  }),
  z.object({
    type: z.literal("run.finished"),
    runId: z.string(),
    exitCode: z.number(),
    durationMs: z.number(),
  }),
  z.object({
    type: z.literal("pipeline.snapshot"),
    book: z.string(),
    state: z.unknown(),
  }),
  z.object({
    type: z.literal("pipeline.list.snapshot"),
    books: z.array(BookEntry),
  }),
  z.object({
    type: z.literal("pipeline.changed"),
    book: z.string(),
    state: z.unknown(),
    source: z.string(),
  }),
  z.object({
    type: z.literal("file.snapshot"),
    path: z.string(),
    content: z.string(),
    sha: z.string(),
  }),
  z.object({
    type: z.literal("file.list.snapshot"),
    path: z.string(),
    entries: z.array(
      z.object({
        name: z.string(),
        type: z.enum(["file", "dir"]),
        size: z.number().optional(),
      })
    ),
  }),
  z.object({
    type: z.literal("file.changed"),
    path: z.string(),
    sha: z.string(),
    source: z.string(),
  }),
  z.object({
    type: z.literal("agents.snapshot"),
    agents: z.array(AgentDescriptor),
    manifest: z.unknown(),
  }),
  z.object({
    type: z.literal("kdp.publish.result"),
    book: z.string(),
    ok: z.boolean(),
    message: z.string(),
  }),
  z.object({
    type: z.literal("error"),
    runId: z.string().optional(),
    code: z.string(),
    message: z.string(),
    detail: z.unknown().optional(),
  }),
]);
export type ServerMsg = z.infer<typeof ServerMsg>;
