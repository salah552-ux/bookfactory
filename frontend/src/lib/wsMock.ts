/**
 * Mock WebSocket client for the hosted demo. Activated when VITE_DEMO is
 * truthy at build time. Emits canned, realistic-looking events so every
 * screen renders with plausible data and the user can click around the
 * full UI without a backend.
 *
 * It is intentionally a small, in-memory simulation — not a re-implementation
 * of the real backend.
 */
import type { ServerMsg } from "./schemas";

type Listener = (msg: ServerMsg) => void;
type StatusListener = (status: WsStatus) => void;
export type WsStatus = "idle" | "connecting" | "open" | "closed" | "error";

const DEMO_BOOKS = [
  {
    slug: "fix-your-gut-for-good",
    state: {
      book_title: "Fix Your Gut For Good",
      genre: "NONFICTION-HEALTH",
      current_stage: "07-publishing",
      market_intelligence_approved: true,
      blueprint_approved: true,
      stages: {
        "01": { complete: true },
        "02": { complete: true },
        "03": { complete: true },
        "04": { complete: true },
        "05": { complete: true },
        "06": { complete: true },
        "07": { status: "in_progress" },
      },
      writing: { writer_agent: "health-writer" },
    },
  },
  {
    slug: "the-dust-between-seconds",
    state: {
      book_title: "The Dust Between Seconds",
      genre: "FICTION",
      current_stage: "03-writing",
      market_intelligence_approved: true,
      blueprint_approved: true,
      stages: {
        "01": { complete: true },
        "02": { complete: true },
        "03": { status: "in_progress" },
      },
      writing: { writer_agent: "fiction-writer" },
    },
  },
  {
    slug: "untitled-cosy-mystery",
    state: {
      book_title: "Death in the Cathedral Close",
      genre: "FICTION-MYSTERY",
      current_stage: "02-planning",
      market_intelligence_approved: true,
      stages: {
        "01": { complete: true },
        "02": { status: "in_progress" },
      },
      writing: { writer_agent: "murder-mystery-writer" },
    },
  },
];

const DEMO_AGENTS = [
  // Coordinator
  ["00-coordinator", "agent-log", "Reads + writes pipeline-state.json. Persistent memory of the pipeline."],
  ["00-coordinator", "brief-validator", "Cross-checks chapter briefs against BLUEPRINT.md and FACTS.md before any writer fires."],
  ["00-coordinator", "pipeline-guide", "Master pipeline navigator."],
  ["00-coordinator", "pipeline-orchestrator", "Autonomous pipeline driver."],
  ["00-coordinator", "quality-gate", "Runs between every stage. Verifies deliverables before unlocking the next."],
  // Research
  ["01-research", "market-researcher", "Validates the niche, finds gaps, checks competition. Green/yellow/red signal."],
  ["01-research", "competitive-positioning-agent", "Mines reviews of competing books to find reader gaps."],
  ["01-research", "deep-market-intelligence-agent", "Live Amazon data via Playwright. BSR → daily sales conversion."],
  // Planning
  ["02-planning", "novel-writer", "Strategic creative director for fiction builds."],
  ["02-planning", "book-architect", "Designs the full non-fiction book structure."],
  ["02-planning", "title-and-subtitle-lab", "Generates 25+ title combos scored against KDP patterns."],
  // Writing
  ["03-writing", "health-writer", "Warm, authoritative health prose. Never AI-sounding."],
  ["03-writing", "fiction-writer", "All fiction genres — distinctive prose, page-turning momentum."],
  ["03-writing", "murder-mystery-writer", "Cosy crime + police procedural specialist."],
  ["03-writing", "business-writer", "Punchy business / self-help / productivity."],
  // Quality
  ["04-quality", "fact-checker", "Verifies every factual claim against primary sources."],
  ["04-quality", "book-reviewer", "12-metric quality gate — must score 96+/120."],
  ["04-quality", "compliance-officer", "FTC, FDA, KDP, Apple Books policy review + implementation."],
  ["04-quality", "proofreader-agent", "Typos, hyphenation, consistency."],
  // Optimisation
  ["05-optimisation", "hook-optimizer-agent", "Audits and rewrites every chapter's opening + closing paragraph."],
  ["05-optimisation", "review-bait-optimizer", "Identifies the highest-leverage review trigger moments."],
  // Production
  ["06-production", "manuscript-style-designer", "Genre-correct KDP CSS, PDF config, book config."],
  ["06-production", "design-agent", "Covers, A+ content, social graphics. Figma + Playwright."],
  ["06-production", "paperback-interior-agent", "Print-ready PDF for KDP + IngramSpark."],
  ["06-production", "final-approval-agent", "300-point rubric. Nothing ships under 270/300."],
  // Publishing
  ["07-publishing", "publisher-agent", "Full KDP listing — title, subtitle, description, keywords, categories."],
  ["07-publishing", "marketing-agent", "90-day execution plan with specific numbers and deadlines."],
  ["07-publishing", "reach-agent", "All organic content per channel — Reddit, BookTok, Pinterest, Quora."],
  ["07-publishing", "pre-launch-agent", "ARC, review drops, AMS specs, launch day sequence."],
  ["07-publishing", "amazon-ads-agent", "Data-driven Amazon Ads. 4-campaign launch stack."],
  ["07-publishing", "kdp-upload-agent", "KDP browser upload. Never publishes without typed PUBLISH."],
  // Products
  ["08-products", "product-extractor", "Mines manuscripts for digital product opportunities."],
  ["08-products", "digital-product-designer", "Etsy-ready listings + Canva briefs."],
  // Series
  ["09-series", "series-manager", "Multi-series publishing director."],
  ["09-series", "series-sync-agent", "Keeps facts consistent across every series book."],
  ["09-series", "series-continuity-guardian", "Cross-book conflict detection."],
  ["09-series", "arc-manager-agent", "Advance Review Copy programme."],
  // Post-launch
  ["10-postlaunch", "post-launch-agent", "90-day performance monitoring + free-day timing."],
  ["10-postlaunch", "ams-optimizer-agent", "Weekly AMS bid adjustments."],
  ["10-postlaunch", "aplus-content-agent", "A+ Content modules below the product description."],
];

class MockWsClient {
  private status: WsStatus = "idle";
  private listeners = new Set<Listener>();
  private statusListeners = new Set<StatusListener>();

  start() {
    this.setStatus("connecting");
    window.setTimeout(() => {
      this.setStatus("open");
      this.send({ type: "hello.replay" }); // triggers hello broadcast
    }, 250);
  }
  stop() {
    this.setStatus("closed");
  }
  on(l: Listener) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }
  onStatus(l: StatusListener) {
    this.statusListeners.add(l);
    l(this.status);
    return () => this.statusListeners.delete(l);
  }
  getStatus() {
    return this.status;
  }

  send(msg: Record<string, unknown>) {
    setTimeout(() => this.handle(msg), 60);
  }

  private handle(msg: Record<string, unknown>) {
    const t = msg.type as string;
    switch (t) {
      case "hello.replay":
        this.emit({
          type: "hello",
          version: "0.1.0-demo",
          bookfactoryRoot: "/demo",
        });
        return;
      case "ping":
        return this.emit({ type: "pong" });
      case "pipeline.list":
        return this.emit({
          type: "pipeline.list.snapshot",
          books: DEMO_BOOKS,
        });
      case "pipeline.read": {
        const slug = msg.book as string;
        const b = DEMO_BOOKS.find((x) => x.slug === slug);
        return this.emit({
          type: "pipeline.snapshot",
          book: slug,
          state: b?.state ?? null,
        });
      }
      case "pipeline.subscribe":
      case "pipeline.unsubscribe":
        return;
      case "pipeline.patch": {
        const slug = msg.book as string;
        const b = DEMO_BOOKS.find((x) => x.slug === slug);
        if (b) Object.assign(b.state as object, msg.patch ?? {});
        this.emit({
          type: "pipeline.snapshot",
          book: slug,
          state: b?.state ?? null,
        });
        this.emit({
          type: "pipeline.changed",
          book: slug,
          state: b?.state ?? null,
          source: "demo",
        });
        return;
      }
      case "agents.list":
        return this.emit({
          type: "agents.snapshot",
          agents: DEMO_AGENTS.map(([stage, id, description]) => ({
            id,
            stage,
            path: `${stage}/${id}.md`,
            description,
          })),
          manifest: { demo: true },
        });
      case "file.list": {
        return this.emit({
          type: "file.list.snapshot",
          path: msg.path as string,
          entries: demoFiles(msg.path as string),
        });
      }
      case "file.read":
        return this.emit({
          type: "file.snapshot",
          path: msg.path as string,
          content: demoFileContent(msg.path as string),
          sha: "demo",
        });
      case "file.write":
        return this.emit({
          type: "file.snapshot",
          path: msg.path as string,
          content: (msg.content as string) ?? "",
          sha: "demo-written",
        });
      case "agent.run":
      case "build.run":
        return this.simulateRun(msg);
      case "runs.list":
        return this.emit({ type: "runs.list.snapshot", runs: [] });
      case "run.read":
        return this.emit({
          type: "error",
          runId: msg.runId as string,
          code: "demo_only",
          message: "Run history is empty in the hosted demo.",
        });
      case "kdp.publish.confirm": {
        const ok = msg.phrase === "PUBLISH";
        return this.emit({
          type: "kdp.publish.result",
          book: msg.book as string,
          ok,
          message: ok
            ? "Demo: publish gate cleared (no real upload)."
            : "Rejected: phrase must be the exact word PUBLISH.",
        });
      }
      case "book.create":
        return this.emit({
          type: "error",
          code: "demo_only",
          message: "Book creation is disabled in the hosted demo — run locally.",
        });
    }
  }

  private simulateRun(msg: Record<string, unknown>) {
    const runId = msg.runId as string;
    const agent = msg.agent as string | undefined;
    const script = msg.script as string | undefined;
    const book = msg.book as string | undefined;
    this.emit({
      type: "run.started",
      runId,
      agent,
      script,
      book,
      ts: Date.now(),
    });
    const lines = [
      `→ ${agent ?? script} invoked${book ? ` for ${book}` : ""}`,
      `[hosted demo] this run is simulated — no real agent fires.`,
      `[hosted demo] run the launcher on your own machine to drive the real pipeline.`,
      agent ? `${agent} would now produce its real output here.` : `${script} would now produce its real output here.`,
      agent === "book-reviewer"
        ? "Score: 102/120 (B). 12-metric breakdown elided in demo."
        : "Sample artefact would land in the book folder.",
    ];
    lines.forEach((text, i) => {
      setTimeout(
        () => this.emit({ type: "run.chunk", runId, stream: "stdout", text: text + "\n" }),
        300 + i * 250
      );
    });
    setTimeout(
      () =>
        this.emit({
          type: "run.finished",
          runId,
          exitCode: 0,
          durationMs: 300 + lines.length * 250,
        }),
      300 + lines.length * 250 + 100
    );
  }

  private emit(msg: ServerMsg) {
    for (const l of this.listeners) l(msg);
  }

  private setStatus(s: WsStatus) {
    this.status = s;
    for (const l of this.statusListeners) l(s);
  }
}

function demoFiles(path: string) {
  if (path.startsWith("books/")) {
    return [
      { name: "BLUEPRINT.md", type: "file" as const, size: 8400 },
      { name: "FACTS.md", type: "file" as const, size: 12200 },
      { name: "KDP-LISTING.md", type: "file" as const, size: 4100 },
      { name: "MARKETING-PLAN.md", type: "file" as const, size: 7800 },
      { name: "manuscript", type: "dir" as const },
    ];
  }
  if (path.endsWith("manuscript")) {
    return Array.from({ length: 10 }, (_, i) => ({
      name: `${String(i + 1).padStart(2, "0")}-chapter-${i + 1}.md`,
      type: "file" as const,
      size: 14000 + i * 200,
    }));
  }
  return [];
}

function demoFileContent(path: string): string {
  const base = path.split("/").pop() ?? path;
  return `# ${base}\n\n_This is a demo file. The hosted demo serves canned content so you can see the layout. Run the launcher on your own machine to read your real books._\n`;
}

export const mockWs = new MockWsClient();
