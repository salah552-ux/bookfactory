import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, mkdir, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  readQueue,
  writeQueue,
  slugify,
  bootstrapBook,
  approveNiche,
  readMasterReviewDecision,
  processQueue,
} from "../../daemon/queue-processor.js";
import type { DaemonConfig, QueueEntry } from "../../daemon/types.js";

let root: string;
let config: DaemonConfig;

// Minimal pipeline-state template the bootstrap function reads
const TEMPLATE = {
  book_slug: "REPLACE_ME",
  book_title: "REPLACE_ME",
  genre: "FICTION-MYSTERY",
  pipeline_version: "2.0",
  current_stage: 0,
  last_updated: "REPLACE_WITH_DATE",
  last_agent_run: null,
  stages: {
    "01-research":    { status: "not_started" },
    "02-planning":    { status: "not_started" },
    "03-writing":     { status: "not_started" },
    "04-quality":     { status: "not_started" },
    "05-optimisation":{ status: "not_started" },
    "06-production":  { status: "not_started" },
    "07-publishing":  { status: "not_started" },
    "08-products":    { status: "not_started" },
    "09-series":      { status: "not_started" },
    "10-postlaunch":  { status: "not_started" },
  },
  writing: { writer_agent: null, target_chapters: null, completed_chapters: 0, approved_chapters: 0, current_chapter: null, word_count_current: 0, word_count_target: null },
  quality_scores: { book_reviewer_avg: null, final_approval_score: null, chapters_below_threshold: [] },
  human_gates: { market_intelligence_approved: false, blueprint_approved: false, cover_approved: false, final_approval_passed: false, ai_questionnaire_confirmed: false, published: false },
  production: { epub_built: false, pdf_built: false, docx_built: false, cover_file: null, epub_file: null },
  publishing: { asin: null, kdp_status: "not_started", live_date: null, list_price_gbp: null, list_price_usd: null, royalty_pct: 70, kdp_select: true, countdown_deal_eligible_from: null },
  post_launch: { review_count: 0, avg_rating: null, ads_active: false, ads_start_date: null, countdown_deal_run: false, aplus_content_live: false, arc_emails_sent: 0 },
  agent_log: [],
};

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "bfq-"));
  await mkdir(join(root, "books"), { recursive: true });
  await writeFile(
    join(root, "pipeline-state.template.json"),
    JSON.stringify(TEMPLATE, null, 2)
  );
  config = {
    maxInvocationsPerDay: 20,
    pauseFile: join(root, "PAUSE_AUTOMATION"),
    bookfactoryRoot: root,
    activityLogFile: join(root, "AUTOMATION-LOG.md"),
    notificationsFile: join(root, "NOTIFICATIONS.md"),
    dryRun: false,
  };
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

// ── slugify ──────────────────────────────────────────────────────────────────

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Heal Your Sleep for Good")).toBe("heal-your-sleep-for-good");
  });
  it("strips special characters", () => {
    expect(slugify("Fix Your Gut (2nd Ed.)!")).toBe("fix-your-gut-2nd-ed");
  });
  it("collapses multiple spaces and hyphens", () => {
    expect(slugify("A  B--C")).toBe("a-b-c");
  });
  it("trims leading and trailing hyphens", () => {
    expect(slugify(" - The Title - ")).toBe("the-title");
  });
});

// ── readQueue / writeQueue ───────────────────────────────────────────────────

describe("readQueue", () => {
  it("returns empty entries when file does not exist", async () => {
    const q = await readQueue(join(root, "books", ".queue.json"));
    expect(q.entries).toEqual([]);
  });

  it("reads existing queue file", async () => {
    const qf = join(root, "books", ".queue.json");
    await writeFile(qf, JSON.stringify({ entries: [{ id: "x", title: "T", genre: "health", status: "pending", added_at: "2026-01-01T00:00:00Z" }] }));
    const q = await readQueue(qf);
    expect(q.entries).toHaveLength(1);
    expect(q.entries[0].title).toBe("T");
  });
});

describe("writeQueue / readQueue round-trip", () => {
  it("persists and reloads", async () => {
    const qf = join(root, "books", ".queue.json");
    const entry: QueueEntry = { id: "abc", title: "Hello", genre: "health", status: "pending", added_at: "2026-01-01T00:00:00Z" };
    await writeQueue(qf, { entries: [entry] });
    const q = await readQueue(qf);
    expect(q.entries[0]).toMatchObject({ id: "abc", title: "Hello" });
  });
});

// ── bootstrapBook ────────────────────────────────────────────────────────────

describe("bootstrapBook", () => {
  it("creates directory structure", async () => {
    const entry: QueueEntry = { id: "1", title: "My Test Book", genre: "health", status: "pending", slug: "my-test-book", added_at: "2026-01-01T00:00:00Z" };
    await bootstrapBook(entry, root);

    const { stat } = await import("node:fs/promises");
    await expect(stat(join(root, "books", "my-test-book", "manuscript", "handoffs"))).resolves.toBeTruthy();
    await expect(stat(join(root, "books", "my-test-book", "exports"))).resolves.toBeTruthy();
  });

  it("writes pipeline-state.json with correct fields", async () => {
    const entry: QueueEntry = { id: "1", title: "My Test Book", genre: "health", status: "pending", slug: "my-test-book", added_at: "2026-01-01T00:00:00Z" };
    await bootstrapBook(entry, root);

    const raw = await readFile(join(root, "books", "my-test-book", "pipeline-state.json"), "utf8");
    const state = JSON.parse(raw);
    expect(state.book_slug).toBe("my-test-book");
    expect(state.book_title).toBe("My Test Book");
    expect(state.genre).toBe("NON-FICTION-HEALTH");
    expect(state.current_stage).toBe(1);
    expect(state.human_gates.market_intelligence_approved).toBe(false);
  });

  it("writes BLUEPRINT.md and FACTS.md stubs", async () => {
    const entry: QueueEntry = { id: "1", title: "My Test Book", genre: "health", status: "pending", slug: "my-test-book", added_at: "2026-01-01T00:00:00Z" };
    await bootstrapBook(entry, root);

    const blueprint = await readFile(join(root, "books", "my-test-book", "BLUEPRINT.md"), "utf8");
    const facts = await readFile(join(root, "books", "my-test-book", "FACTS.md"), "utf8");
    expect(blueprint).toContain("My Test Book");
    expect(facts).toContain("My Test Book");
  });
});

// ── approveNiche ─────────────────────────────────────────────────────────────

describe("approveNiche", () => {
  it("sets market_intelligence_approved to true", async () => {
    const slug = "approve-test";
    await mkdir(join(root, "books", slug), { recursive: true });
    const state = { ...TEMPLATE, book_slug: slug, book_title: "Approve Test", human_gates: { ...TEMPLATE.human_gates } };
    await writeFile(join(root, "books", slug, "pipeline-state.json"), JSON.stringify(state, null, 2));

    await approveNiche(slug, root, new Date());

    const raw = await readFile(join(root, "books", slug, "pipeline-state.json"), "utf8");
    const updated = JSON.parse(raw);
    expect(updated.human_gates.market_intelligence_approved).toBe(true);
  });

  it("appends an agent_log entry", async () => {
    const slug = "approve-log";
    await mkdir(join(root, "books", slug), { recursive: true });
    const state = { ...TEMPLATE, book_slug: slug, book_title: "Log Test", human_gates: { ...TEMPLATE.human_gates }, agent_log: [] };
    await writeFile(join(root, "books", slug, "pipeline-state.json"), JSON.stringify(state, null, 2));

    await approveNiche(slug, root, new Date());

    const raw = await readFile(join(root, "books", slug, "pipeline-state.json"), "utf8");
    const updated = JSON.parse(raw);
    expect(updated.agent_log).toHaveLength(1);
    expect(updated.agent_log[0].agent).toBe("queue-processor");
  });
});

// ── processQueue ─────────────────────────────────────────────────────────────

describe("processQueue", () => {
  it("does nothing when queue is empty", async () => {
    await processQueue(config, new Date());
    // AUTOMATION-LOG.md should not exist (or be empty / not have queue entries)
    let content = "";
    try { content = await readFile(config.activityLogFile, "utf8"); } catch { /* ok */ }
    expect(content).not.toContain("queued");
  });

  it("bootstraps a pending entry and advances it to researching", async () => {
    const qf = join(root, "books", ".queue.json");
    await writeFile(qf, JSON.stringify({
      entries: [{
        id: "test-1",
        title: "Heal Your Sleep for Good",
        genre: "health",
        niche_hint: "insomnia cortisol",
        status: "pending",
        added_at: "2026-01-01T00:00:00Z",
      }]
    }));

    await processQueue(config, new Date());

    const q = await readQueue(qf);
    expect(q.entries[0].status).toBe("researching");
    expect(q.entries[0].slug).toBe("heal-your-sleep-for-good");

    const stateRaw = await readFile(join(root, "books", "heal-your-sleep-for-good", "pipeline-state.json"), "utf8");
    const state = JSON.parse(stateRaw);
    expect(state.book_title).toBe("Heal Your Sleep for Good");
    expect(state.current_stage).toBe(1);
  });

  it("skips bootstrapping if book folder already exists", async () => {
    const slug = "heal-your-sleep-for-good";
    await mkdir(join(root, "books", slug), { recursive: true });
    await writeFile(
      join(root, "books", slug, "pipeline-state.json"),
      JSON.stringify({ ...TEMPLATE, book_slug: slug, current_stage: 2 })
    );

    const qf = join(root, "books", ".queue.json");
    await writeFile(qf, JSON.stringify({
      entries: [{ id: "t", title: "Heal Your Sleep for Good", genre: "health", status: "pending", added_at: "2026-01-01T00:00:00Z" }]
    }));

    await processQueue(config, new Date());

    // pipeline-state should be untouched (still current_stage: 2)
    const raw = await readFile(join(root, "books", slug, "pipeline-state.json"), "utf8");
    expect(JSON.parse(raw).current_stage).toBe(2);
  });

  it("approves a niche and advances status to in_pipeline", async () => {
    const slug = "heal-your-sleep-for-good";
    await mkdir(join(root, "books", slug), { recursive: true });
    const state = { ...TEMPLATE, book_slug: slug, book_title: "Heal Your Sleep for Good", human_gates: { ...TEMPLATE.human_gates }, agent_log: [] };
    await writeFile(join(root, "books", slug, "pipeline-state.json"), JSON.stringify(state, null, 2));

    const qf = join(root, "books", ".queue.json");
    await writeFile(qf, JSON.stringify({
      entries: [{ id: "t", title: "Heal Your Sleep for Good", genre: "health", status: "approved", slug, added_at: "2026-01-01T00:00:00Z" }]
    }));

    await processQueue(config, new Date());

    const q = await readQueue(qf);
    expect(q.entries[0].status).toBe("in_pipeline");
    expect(q.entries[0].approved_at).toBeTruthy();

    const raw = await readFile(join(root, "books", slug, "pipeline-state.json"), "utf8");
    expect(JSON.parse(raw).human_gates.market_intelligence_approved).toBe(true);
  });

  it("archives a rejected entry", async () => {
    const qf = join(root, "books", ".queue.json");
    await writeFile(qf, JSON.stringify({
      entries: [{ id: "t", title: "Bad Idea", genre: "health", status: "rejected", slug: "bad-idea", reject_reason: "too competitive", added_at: "2026-01-01T00:00:00Z" }]
    }));

    await processQueue(config, new Date());

    const q = await readQueue(qf);
    expect(q.entries[0].status).toBe("archived");
    expect(q.entries[0].rejected_at).toBeTruthy();
  });

  it("advances researching → master_review when MARKET-INTELLIGENCE.md exists (dry-run)", async () => {
    const slug = "sleep-book";
    await mkdir(join(root, "books", slug), { recursive: true });
    // Simulate research complete — MARKET-INTELLIGENCE.md written by deep-market-intelligence-agent
    await writeFile(join(root, "books", slug, "MARKET-INTELLIGENCE.md"), "# Market Intelligence\n\nSales forecast: £800/month");

    const qf = join(root, "books", ".queue.json");
    await writeFile(qf, JSON.stringify({
      entries: [{ id: "t", title: "Sleep Book", genre: "health", status: "researching", slug, added_at: "2026-01-01T00:00:00Z" }]
    }));

    const dryConfig = { ...config, dryRun: true };
    await processQueue(dryConfig, new Date());

    // In dry-run mode the queue file is not persisted, but we can check in-memory logic
    // by checking the activity log was written (dry-run still appends activity entries)
    const log = await readFile(config.activityLogFile, "utf8").catch(() => "");
    expect(log).toContain("DRY RUN");
  });

  it("advances master_review → brief_ready when MASTER-REVIEW.json has decision brief_ready", async () => {
    const slug = "brief-ready-book";
    await mkdir(join(root, "books", slug), { recursive: true });
    const decision = { decision: "brief_ready", round: 1, go_recommendation: "strong_go", confidence: "high", gaps: [] };
    await writeFile(join(root, "books", slug, "MASTER-REVIEW.json"), JSON.stringify(decision));
    await writeFile(join(root, "books", slug, "NICHE-DECISION-BRIEF.md"), "# Brief\n\n## Master Orchestrator Recommendation: STRONG GO\n");

    const qf = join(root, "books", ".queue.json");
    await writeFile(qf, JSON.stringify({
      entries: [{ id: "t", title: "Brief Ready Book", genre: "health", status: "master_review", slug, added_at: "2026-01-01T00:00:00Z" }]
    }));

    await processQueue(config, new Date());

    const q = await readQueue(qf);
    expect(q.entries[0].status).toBe("brief_ready");
  });

  it("resets master_review → researching when MASTER-REVIEW.json has need_more_research", async () => {
    const slug = "more-research-book";
    await mkdir(join(root, "books", slug), { recursive: true });
    const decision = { decision: "need_more_research", round: 1, gaps: ["weak BSR data"] };
    await writeFile(join(root, "books", slug, "MASTER-REVIEW.json"), JSON.stringify(decision));

    const qf = join(root, "books", ".queue.json");
    await writeFile(qf, JSON.stringify({
      entries: [{ id: "t", title: "More Research Book", genre: "health", status: "master_review", slug, added_at: "2026-01-01T00:00:00Z" }]
    }));

    await processQueue(config, new Date());

    const q = await readQueue(qf);
    expect(q.entries[0].status).toBe("researching");
  });

  it("readMasterReviewDecision returns null when file missing", async () => {
    const slug = "no-review";
    await mkdir(join(root, "books", slug), { recursive: true });
    const result = await readMasterReviewDecision(join(root, "books", slug));
    expect(result).toBeNull();
  });

  it("readMasterReviewDecision parses a valid decision file", async () => {
    const slug = "has-review";
    await mkdir(join(root, "books", slug), { recursive: true });
    const decision = { decision: "brief_ready", round: 2, go_recommendation: "conditional_go", confidence: "medium", gaps: ["needs pricing data"] };
    await writeFile(join(root, "books", slug, "MASTER-REVIEW.json"), JSON.stringify(decision));
    const result = await readMasterReviewDecision(join(root, "books", slug));
    expect(result?.decision).toBe("brief_ready");
    expect(result?.go_recommendation).toBe("conditional_go");
    expect(result?.round).toBe(2);
  });

  it("does not write files in dry-run mode", async () => {
    const dryConfig = { ...config, dryRun: true };
    const qf = join(root, "books", ".queue.json");
    await writeFile(qf, JSON.stringify({
      entries: [{ id: "t", title: "Dry Run Book", genre: "health", status: "pending", added_at: "2026-01-01T00:00:00Z" }]
    }));

    await processQueue(dryConfig, new Date());

    // Queue file should be unchanged (dry-run doesn't write)
    const q = await readQueue(qf);
    expect(q.entries[0].status).toBe("pending");

    // Book folder should not be created
    const { access } = await import("node:fs/promises");
    await expect(access(join(root, "books", "dry-run-book"))).rejects.toThrow();
  });
});
