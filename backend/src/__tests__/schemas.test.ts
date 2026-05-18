import { describe, it, expect } from "vitest";
import {
  PingMsg,
  AgentRunMsg,
  AgentCancelMsg,
  PipelineReadMsg,
  PipelinePatchMsg,
  FileReadMsg,
  FileWriteMsg,
  FileListMsg,
  BuildRunMsg,
  KdpPublishConfirmMsg,
  RunsListMsg,
  RunReadMsg,
  BookCreateMsg,
  ClientMsg,
} from "../schemas.js";

describe("PingMsg", () => {
  it("accepts { type: 'ping' }", () => {
    expect(PingMsg.safeParse({ type: "ping" }).success).toBe(true);
  });

  it("rejects a different type string", () => {
    expect(PingMsg.safeParse({ type: "pong" }).success).toBe(false);
  });

  it("rejects missing type", () => {
    expect(PingMsg.safeParse({}).success).toBe(false);
  });
});

describe("AgentRunMsg", () => {
  it("accepts a minimal valid message", () => {
    expect(
      AgentRunMsg.safeParse({
        type: "agent.run",
        runId: "r1",
        agent: "market-researcher",
      }).success
    ).toBe(true);
  });

  it("accepts optional book and prompt fields", () => {
    expect(
      AgentRunMsg.safeParse({
        type: "agent.run",
        runId: "r1",
        agent: "market-researcher",
        book: "my-book",
        prompt: "go",
      }).success
    ).toBe(true);
  });

  it("rejects missing runId", () => {
    expect(
      AgentRunMsg.safeParse({ type: "agent.run", agent: "x" }).success
    ).toBe(false);
  });

  it("rejects empty runId", () => {
    expect(
      AgentRunMsg.safeParse({ type: "agent.run", runId: "", agent: "x" })
        .success
    ).toBe(false);
  });

  it("rejects empty agent name", () => {
    expect(
      AgentRunMsg.safeParse({ type: "agent.run", runId: "r1", agent: "" })
        .success
    ).toBe(false);
  });
});

describe("AgentCancelMsg", () => {
  it("accepts a valid message", () => {
    expect(
      AgentCancelMsg.safeParse({ type: "agent.cancel", runId: "r1" }).success
    ).toBe(true);
  });

  it("rejects empty runId", () => {
    expect(
      AgentCancelMsg.safeParse({ type: "agent.cancel", runId: "" }).success
    ).toBe(false);
  });
});

describe("PipelineReadMsg", () => {
  it("accepts a valid message", () => {
    expect(
      PipelineReadMsg.safeParse({ type: "pipeline.read", book: "my-book" })
        .success
    ).toBe(true);
  });

  it("rejects empty book slug", () => {
    expect(
      PipelineReadMsg.safeParse({ type: "pipeline.read", book: "" }).success
    ).toBe(false);
  });
});

describe("PipelinePatchMsg", () => {
  it("accepts a valid message with a patch object", () => {
    expect(
      PipelinePatchMsg.safeParse({
        type: "pipeline.patch",
        book: "my-book",
        patch: { stage: 3 },
      }).success
    ).toBe(true);
  });

  it("rejects a non-object patch", () => {
    expect(
      PipelinePatchMsg.safeParse({
        type: "pipeline.patch",
        book: "my-book",
        patch: "not-an-object",
      }).success
    ).toBe(false);
  });
});

describe("FileReadMsg", () => {
  it("accepts a valid path", () => {
    expect(
      FileReadMsg.safeParse({
        type: "file.read",
        path: "books/my-book/BLUEPRINT.md",
      }).success
    ).toBe(true);
  });

  it("rejects empty path", () => {
    expect(
      FileReadMsg.safeParse({ type: "file.read", path: "" }).success
    ).toBe(false);
  });
});

describe("FileWriteMsg", () => {
  it("accepts a valid message with content", () => {
    expect(
      FileWriteMsg.safeParse({
        type: "file.write",
        path: "books/my-book/ch1.md",
        content: "# Chapter 1",
      }).success
    ).toBe(true);
  });

  it("accepts empty content string", () => {
    expect(
      FileWriteMsg.safeParse({
        type: "file.write",
        path: "books/my-book/ch1.md",
        content: "",
      }).success
    ).toBe(true);
  });

  it("accepts optional sha", () => {
    expect(
      FileWriteMsg.safeParse({
        type: "file.write",
        path: "books/my-book/ch1.md",
        content: "x",
        sha: "abc123",
      }).success
    ).toBe(true);
  });
});

describe("FileListMsg", () => {
  it("accepts a valid directory path", () => {
    expect(
      FileListMsg.safeParse({ type: "file.list", path: "books" }).success
    ).toBe(true);
  });
});

describe("BuildRunMsg", () => {
  const validScripts = [
    "build-manuscript.sh",
    "build-pdf.sh",
    "build-print-pdf.sh",
    "new-book.sh",
    "approve-chapter.sh",
  ] as const;

  it.each(validScripts)("accepts script '%s'", (script) => {
    expect(
      BuildRunMsg.safeParse({ type: "build.run", runId: "r1", script }).success
    ).toBe(true);
  });

  it("rejects an unknown script name", () => {
    expect(
      BuildRunMsg.safeParse({
        type: "build.run",
        runId: "r1",
        script: "rm-rf.sh",
      }).success
    ).toBe(false);
  });

  it("rejects missing script", () => {
    expect(
      BuildRunMsg.safeParse({ type: "build.run", runId: "r1" }).success
    ).toBe(false);
  });
});

describe("KdpPublishConfirmMsg", () => {
  it("accepts a message with phrase PUBLISH", () => {
    expect(
      KdpPublishConfirmMsg.safeParse({
        type: "kdp.publish.confirm",
        book: "my-book",
        phrase: "PUBLISH",
      }).success
    ).toBe(true);
  });

  it("accepts any phrase string — phrase validation is a handler concern", () => {
    expect(
      KdpPublishConfirmMsg.safeParse({
        type: "kdp.publish.confirm",
        book: "my-book",
        phrase: "wrong",
      }).success
    ).toBe(true);
  });

  it("rejects empty book slug", () => {
    expect(
      KdpPublishConfirmMsg.safeParse({
        type: "kdp.publish.confirm",
        book: "",
        phrase: "PUBLISH",
      }).success
    ).toBe(false);
  });
});

describe("RunsListMsg", () => {
  it("accepts without a limit", () => {
    expect(RunsListMsg.safeParse({ type: "runs.list" }).success).toBe(true);
  });

  it("accepts a valid limit", () => {
    expect(
      RunsListMsg.safeParse({ type: "runs.list", limit: 50 }).success
    ).toBe(true);
  });

  it("rejects a limit of 0", () => {
    expect(
      RunsListMsg.safeParse({ type: "runs.list", limit: 0 }).success
    ).toBe(false);
  });

  it("rejects a limit above 500", () => {
    expect(
      RunsListMsg.safeParse({ type: "runs.list", limit: 501 }).success
    ).toBe(false);
  });
});

describe("RunReadMsg", () => {
  it("accepts a valid runId", () => {
    expect(
      RunReadMsg.safeParse({ type: "run.read", runId: "abc-123" }).success
    ).toBe(true);
  });

  it("rejects empty runId", () => {
    expect(
      RunReadMsg.safeParse({ type: "run.read", runId: "" }).success
    ).toBe(false);
  });
});

describe("BookCreateMsg", () => {
  const base = { type: "book.create", runId: "r1", title: "My Book" };

  it("accepts a valid message for all genres", () => {
    const genres = [
      "FICTION-MYSTERY",
      "FICTION",
      "NONFICTION-HEALTH",
      "NONFICTION-BUSINESS",
    ];
    for (const genre of genres) {
      expect(
        BookCreateMsg.safeParse({ ...base, slug: "my-book", genre }).success
      ).toBe(true);
    }
  });

  it("rejects a slug with uppercase letters", () => {
    expect(
      BookCreateMsg.safeParse({
        ...base,
        slug: "My-Book",
        genre: "FICTION",
      }).success
    ).toBe(false);
  });

  it("rejects a slug starting with a hyphen", () => {
    expect(
      BookCreateMsg.safeParse({
        ...base,
        slug: "-my-book",
        genre: "FICTION",
      }).success
    ).toBe(false);
  });

  it("rejects a slug ending with a hyphen", () => {
    expect(
      BookCreateMsg.safeParse({
        ...base,
        slug: "my-book-",
        genre: "FICTION",
      }).success
    ).toBe(false);
  });

  it("rejects a slug containing spaces", () => {
    expect(
      BookCreateMsg.safeParse({
        ...base,
        slug: "my book",
        genre: "FICTION",
      }).success
    ).toBe(false);
  });

  it("rejects a single-character slug (min length 2)", () => {
    expect(
      BookCreateMsg.safeParse({ ...base, slug: "a", genre: "FICTION" }).success
    ).toBe(false);
  });

  it("rejects a slug longer than 60 characters", () => {
    expect(
      BookCreateMsg.safeParse({
        ...base,
        slug: "a".repeat(61),
        genre: "FICTION",
      }).success
    ).toBe(false);
  });

  it("rejects an unknown genre", () => {
    expect(
      BookCreateMsg.safeParse({
        ...base,
        slug: "my-book",
        genre: "INVALID",
      }).success
    ).toBe(false);
  });
});

describe("ClientMsg discriminated union", () => {
  it("accepts all top-level message types", () => {
    const validMessages = [
      { type: "ping" },
      { type: "agents.list" },
      { type: "pipeline.list" },
      { type: "pipeline.read", book: "my-book" },
      { type: "pipeline.subscribe", book: "my-book" },
      { type: "pipeline.unsubscribe", book: "my-book" },
      { type: "file.read", path: "CLAUDE.md" },
      { type: "file.list", path: "books" },
      { type: "runs.list" },
      { type: "run.read", runId: "r1" },
      {
        type: "kdp.publish.confirm",
        book: "my-book",
        phrase: "PUBLISH",
      },
    ];
    for (const msg of validMessages) {
      expect(ClientMsg.safeParse(msg).success, `type: ${msg.type}`).toBe(true);
    }
  });

  it("rejects an unknown message type", () => {
    expect(
      ClientMsg.safeParse({ type: "unknown.message.type" }).success
    ).toBe(false);
  });

  it("rejects non-object inputs", () => {
    expect(ClientMsg.safeParse("not-an-object").success).toBe(false);
    expect(ClientMsg.safeParse(null).success).toBe(false);
    expect(ClientMsg.safeParse(42).success).toBe(false);
    expect(ClientMsg.safeParse([]).success).toBe(false);
  });
});
