/**
 * Integration tests for the daemon's processBook function, using a real temp
 * filesystem for books/, NOTIFICATIONS.md, AUTOMATION-LOG.md, and per-book
 * spend logs. The daemon runs in dry-run mode so no claude CLI is invoked.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, mkdir, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  processBook,
  listBookSlugs,
  readPipelineState,
} from "../../daemon/orchestrator.js";
import type { DaemonConfig, PipelineState } from "../../daemon/types.js";

let root: string;
let config: DaemonConfig;

async function writeBook(slug: string, state: Partial<PipelineState>) {
  const dir = join(root, "books", slug);
  await mkdir(dir, { recursive: true });
  const full: PipelineState = {
    book_slug: slug,
    book_title: `Title ${slug}`,
    current_stage: 1,
    human_gates: {
      market_intelligence_approved: false,
      blueprint_approved: false,
      cover_approved: false,
      final_approval_passed: false,
      ai_questionnaire_confirmed: false,
      published: false,
    },
    ...state,
  };
  await writeFile(
    join(dir, "pipeline-state.json"),
    JSON.stringify(full, null, 2),
    "utf8"
  );
}

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "bf-orchestrator-test-"));
  await mkdir(join(root, "books"), { recursive: true });
  config = {
    maxInvocationsPerDay: 5,
    pauseFile: join(root, "PAUSE_AUTOMATION"),
    bookfactoryRoot: root,
    activityLogFile: join(root, "AUTOMATION-LOG.md"),
    notificationsFile: join(root, "NOTIFICATIONS.md"),
    dryRun: true,
  };
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

describe("listBookSlugs", () => {
  it("returns an empty array when books/ is empty", async () => {
    expect(await listBookSlugs(join(root, "books"))).toEqual([]);
  });

  it("returns all directories under books/ sorted", async () => {
    await writeBook("zebra", { current_stage: 1 });
    await writeBook("alpha", { current_stage: 1 });
    await writeBook("mango", { current_stage: 1 });
    expect(await listBookSlugs(join(root, "books"))).toEqual([
      "alpha",
      "mango",
      "zebra",
    ]);
  });

  it("skips hidden directories", async () => {
    await writeBook("real-book", { current_stage: 1 });
    await mkdir(join(root, "books", ".hidden"), { recursive: true });
    expect(await listBookSlugs(join(root, "books"))).toEqual(["real-book"]);
  });

  it("returns an empty array when books/ does not exist", async () => {
    const missing = join(root, "no-such-dir");
    expect(await listBookSlugs(missing)).toEqual([]);
  });
});

describe("readPipelineState", () => {
  it("returns null when pipeline-state.json is missing", async () => {
    await mkdir(join(root, "books", "no-state"), { recursive: true });
    expect(
      await readPipelineState(join(root, "books", "no-state"))
    ).toBeNull();
  });

  it("returns the parsed state when present", async () => {
    await writeBook("book-1", { current_stage: 3 });
    const state = await readPipelineState(join(root, "books", "book-1"));
    expect(state?.current_stage).toBe(3);
    expect(state?.book_slug).toBe("book-1");
  });

  it("returns null when the JSON is malformed", async () => {
    const dir = join(root, "books", "bad-json");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "pipeline-state.json"), "not json", "utf8");
    expect(await readPipelineState(dir)).toBeNull();
  });
});

describe("processBook — no state", () => {
  it("returns no_state when pipeline-state.json is missing", async () => {
    await mkdir(join(root, "books", "empty"), { recursive: true });
    const result = await processBook("empty", config);
    expect(result.action).toBe("no_state");
  });
});

describe("processBook — blocked by human gate", () => {
  it("notifies and skips when a gate is blocking", async () => {
    await writeBook("blocked-book", {
      current_stage: 2,
      human_gates: {
        market_intelligence_approved: false,
        blueprint_approved: false,
        cover_approved: false,
        final_approval_passed: false,
        ai_questionnaire_confirmed: false,
        published: false,
      },
    });
    const result = await processBook("blocked-book", config);
    expect(result.action).toBe("blocked");
    expect(result.detail).toContain("market_intelligence_approved");

    const notif = await readFile(config.notificationsFile, "utf8");
    expect(notif).toContain("blocked-book");
    expect(notif).toContain("market_intelligence_approved");
  });

  it("does not write a spend entry when blocked", async () => {
    await writeBook("blocked-book", { current_stage: 2 });
    await processBook("blocked-book", config);

    const spendFile = join(root, "books", "blocked-book", ".spend-log.json");
    await expect(readFile(spendFile, "utf8")).rejects.toThrow();
  });
});

describe("processBook — invokable (dry run)", () => {
  it("returns invoked and writes a spend entry", async () => {
    await writeBook("open-book", { current_stage: 1 });
    const result = await processBook("open-book", config);
    expect(result.action).toBe("invoked");

    const spendRaw = await readFile(
      join(root, "books", "open-book", ".spend-log.json"),
      "utf8"
    );
    const spend = JSON.parse(spendRaw) as {
      entries: Array<{ dryRun?: boolean; agent: string }>;
    };
    expect(spend.entries).toHaveLength(1);
    expect(spend.entries[0].agent).toBe("pipeline-orchestrator");
    expect(spend.entries[0].dryRun).toBe(true);
  });
});

describe("processBook — spend cap", () => {
  it("skips invocation once the daily cap is reached", async () => {
    await writeBook("hot-book", { current_stage: 1 });
    const bookDir = join(root, "books", "hot-book");
    const today = new Date().toISOString();
    const entries = Array.from({ length: config.maxInvocationsPerDay }, (_, i) => ({
      ts: today,
      agent: "pipeline-orchestrator",
      runId: `prev-${i}`,
    }));
    await writeFile(
      join(bookDir, ".spend-log.json"),
      JSON.stringify({ entries }),
      "utf8"
    );

    const result = await processBook("hot-book", config);
    expect(result.action).toBe("spend_cap");
  });

  it("invokes when previous day's entries exceed cap but today is empty", async () => {
    await writeBook("yesterday-book", { current_stage: 1 });
    const bookDir = join(root, "books", "yesterday-book");
    const yesterday = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const entries = Array.from({ length: 100 }, (_, i) => ({
      ts: yesterday,
      agent: "pipeline-orchestrator",
      runId: `old-${i}`,
    }));
    await writeFile(
      join(bookDir, ".spend-log.json"),
      JSON.stringify({ entries }),
      "utf8"
    );

    const result = await processBook("yesterday-book", config);
    expect(result.action).toBe("invoked");
  });
});

describe("processBook — fully published book", () => {
  it("invokes (post-launch agents can still run) when all gates are approved", async () => {
    await writeBook("published-book", {
      current_stage: 10,
      human_gates: {
        market_intelligence_approved: true,
        blueprint_approved: true,
        cover_approved: true,
        final_approval_passed: true,
        ai_questionnaire_confirmed: true,
        published: true,
      },
    });
    const result = await processBook("published-book", config);
    expect(result.action).toBe("invoked");
  });
});
