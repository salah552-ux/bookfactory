/**
 * Queue processor — intake layer for the BookFactory pipeline.
 *
 * Status lifecycle:
 *
 *   pending       → bootstrap book folder, set to "researching"
 *   researching   → per-book loop runs stage-1 research agents.
 *                   When MARKET-INTELLIGENCE.md appears, queue processor
 *                   invokes the Master Orchestrator review (one claude call
 *                   that internally iterates up to MAX_REVIEW_ROUNDS times,
 *                   spawning additional research agents if it finds gaps),
 *                   then sets status to "master_review".
 *   master_review → queue processor reads MASTER-REVIEW.json written by the
 *                   Master Orc. On "brief_ready" → status "brief_ready".
 *   brief_ready   → human gate: NOTIFICATIONS.md tells you to read
 *                   NICHE-DECISION-BRIEF.md and edit .queue.json.
 *   approved      → queue processor sets market_intelligence_approved = true,
 *                   status → "in_pipeline". Stage 2 unlocked.
 *   rejected      → status → "archived". Pipeline never runs.
 *   in_pipeline   → nothing; per-book loop handles all further stages.
 *   archived      → terminal.
 */
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import path from "node:path";
import type { DaemonConfig, QueueEntry, QueueFile } from "./types.js";
import { appendActivityEntry, appendGateHit } from "./notifications.js";

// How many research iterations the Master Orchestrator may request.
const MAX_REVIEW_ROUNDS = 3;

// ── File I/O ────────────────────────────────────────────────────────────────

export async function readQueue(queueFile: string): Promise<QueueFile> {
  try {
    const raw = await fs.readFile(queueFile, "utf8");
    return JSON.parse(raw) as QueueFile;
  } catch {
    return { entries: [] };
  }
}

export async function writeQueue(
  queueFile: string,
  queue: QueueFile
): Promise<void> {
  await fs.writeFile(queueFile, JSON.stringify(queue, null, 2) + "\n", "utf8");
}

// ── Helpers ─────────────────────────────────────────────────────────────────

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function genreCode(genre: string): string {
  const map: Record<string, string> = {
    health:   "NON-FICTION-HEALTH",
    business: "NON-FICTION-BUSINESS",
    fiction:  "FICTION-GENERAL",
    mystery:  "FICTION-MYSTERY",
    fantasy:  "FICTION-FANTASY",
    thriller: "FICTION-THRILLER",
    romance:  "FICTION-ROMANCE",
    scifi:    "FICTION-SCIFI",
  };
  return map[genre.toLowerCase()] ?? genre.toUpperCase();
}

export async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

// ── Master Orchestrator review ───────────────────────────────────────────────

export interface MasterReviewDecision {
  decision: "brief_ready" | "need_more_research";
  round: number;
  go_recommendation?: "strong_go" | "conditional_go" | "no_go";
  confidence?: "high" | "medium" | "low";
  gaps?: string[];
}

export async function readMasterReviewDecision(
  bookDir: string
): Promise<MasterReviewDecision | null> {
  try {
    const raw = await fs.readFile(
      path.join(bookDir, "MASTER-REVIEW.json"),
      "utf8"
    );
    return JSON.parse(raw) as MasterReviewDecision;
  } catch {
    return null;
  }
}

/**
 * Invoke the claude CLI to run the Master Orchestrator research review.
 * The agent reads all research outputs, internally iterates up to
 * MAX_REVIEW_ROUNDS requesting additional research if needed, then writes
 * NICHE-DECISION-BRIEF.md (the human-facing brief) and MASTER-REVIEW.json.
 */
export async function invokeMasterReview(
  entry: QueueEntry,
  bookDir: string
): Promise<number> {
  const cli = process.env.CLAUDE_CLI || "claude";
  const rounds = entry.review_rounds ?? 0;

  const prompt = [
    `You are the Master Orchestrator for BookFactory.`,
    ``,
    `Your task: Deep-review the market research for a new book and brief the publisher.`,
    ``,
    `Book title: ${entry.title}`,
    `Genre: ${entry.genre}`,
    `Niche hint: ${entry.niche_hint ?? entry.genre}`,
    `Review round: ${rounds + 1} of ${MAX_REVIEW_ROUNDS}`,
    `Working directory: ${bookDir}`,
    ``,
    `STEP 1 — READ ALL RESEARCH`,
    `Read every file in this directory: MARKET-INTELLIGENCE.md, any competitive`,
    `positioning reports, market-researcher outputs, and any existing MASTER-REVIEW.json`,
    `from previous rounds.`,
    ``,
    `STEP 2 — EVALUATE RESEARCH QUALITY`,
    `Score the research on these dimensions (each out of 10):`,
    `  - Revenue estimate quality (is there a specific £/month number with confidence %)`,
    `  - Competition analysis depth (BSR data, daily sales, review counts)`,
    `  - Reader gap clarity (one specific sentence describing what no book does)`,
    `  - Positioning angle strength (a clear, ownable differentiation)`,
    `  - Risk assessment (3+ specific risks identified)`,
    ``,
    `STEP 3 — FILL GAPS (if round < ${MAX_REVIEW_ROUNDS})`,
    `If any dimension scores below 7/10 AND this is not the final round:`,
    `  - Invoke the relevant specialist agents to fill the gap:`,
    `      * Weak revenue data → deep-market-intelligence-agent`,
    `      * Weak competition analysis → competitive-positioning-agent`,
    `      * Weak niche validation → market-researcher`,
    `  - Re-evaluate after each agent completes.`,
    ``,
    `STEP 4 — WRITE THE BRIEF`,
    `When satisfied (all dimensions 7+) OR on final round, write two files:`,
    ``,
    `FILE 1: NICHE-DECISION-BRIEF.md`,
    `Format:`,
    `# Niche Decision Brief — ${entry.title}`,
    `## Master Orchestrator Recommendation: [STRONG GO / CONDITIONAL GO / NO-GO]`,
    ``,
    `**Revenue forecast:** £X/month at 90 days post-launch (confidence: high/medium/low)`,
    `**Competition level:** X/10 (1=blue ocean, 10=saturated)`,
    `**Reader gap:** [One precise sentence — what no existing book delivers]`,
    `**Our angle:** [One sentence — how this book wins]`,
    `**Research quality score:** X/50`,
    ``,
    `### Top 3 risks`,
    `1. ...`,
    `2. ...`,
    `3. ...`,
    ``,
    `### Master Orchestrator analysis`,
    `[3-5 sentences of honest, opinionated assessment]`,
    ``,
    `---`,
    `**To approve:** edit books/.queue.json → change status to "approved"`,
    `**To reject:** change status to "rejected" (add reject_reason if you like)`,
    ``,
    `FILE 2: MASTER-REVIEW.json`,
    `{`,
    `  "decision": "brief_ready",`,
    `  "round": ${rounds + 1},`,
    `  "go_recommendation": "strong_go" | "conditional_go" | "no_go",`,
    `  "confidence": "high" | "medium" | "low",`,
    `  "gaps": []`,
    `}`,
    ``,
    `Do not write MASTER-REVIEW.json until you have written NICHE-DECISION-BRIEF.md.`,
    `The daemon reads MASTER-REVIEW.json as the completion signal.`,
  ].join("\n");

  return new Promise((resolve) => {
    const proc = spawn(
      cli,
      ["-p", prompt, "--output-format", "stream-json", "--verbose"],
      {
        cwd: bookDir,
        env: { ...process.env },
        stdio: ["ignore", "inherit", "inherit"],
      }
    );
    proc.on("error", (err) => {
      console.error(
        `[queue] master review spawn failed for ${entry.slug}:`,
        err.message
      );
      resolve(-1);
    });
    proc.on("close", (code) => resolve(code ?? -1));
  });
}

// ── Book bootstrapping ──────────────────────────────────────────────────────

export async function bootstrapBook(
  entry: QueueEntry,
  bookfactoryRoot: string
): Promise<void> {
  const slug = entry.slug!;
  const bookDir = path.join(bookfactoryRoot, "books", slug);

  await fs.mkdir(path.join(bookDir, "manuscript", "handoffs"), {
    recursive: true,
  });
  await fs.mkdir(path.join(bookDir, "exports"), { recursive: true });

  const templatePath = path.join(
    bookfactoryRoot,
    "pipeline-state.template.json"
  );
  const raw = await fs.readFile(templatePath, "utf8");
  const state = JSON.parse(raw);
  state.book_slug = slug;
  state.book_title = entry.title;
  state.genre = genreCode(entry.genre);
  state.current_stage = 1;
  state.last_updated = new Date().toISOString();
  state.agent_log = [
    {
      timestamp: new Date().toISOString(),
      agent: "queue-processor",
      action: `Bootstrapped from queue — niche: "${entry.niche_hint ?? entry.genre}"`,
      result: "in_progress",
      notes: "Stage 1 research starting next daemon cycle.",
    },
  ];
  await fs.writeFile(
    path.join(bookDir, "pipeline-state.json"),
    JSON.stringify(state, null, 2) + "\n",
    "utf8"
  );

  await fs.writeFile(
    path.join(bookDir, "BLUEPRINT.md"),
    `# ${entry.title} — Blueprint\n\n` +
      `*Generated by book-architect / novel-writer during stage 2.*\n\n` +
      `**Genre:** ${genreCode(entry.genre)}\n` +
      `**Niche hint:** ${entry.niche_hint ?? entry.genre}\n`,
    "utf8"
  );

  await fs.writeFile(
    path.join(bookDir, "FACTS.md"),
    `# ${entry.title} — Continuity Bible\n\n` +
      `*Populated by writer agents during stage 3.*\n`,
    "utf8"
  );
}

// ── Niche approval ──────────────────────────────────────────────────────────

export async function approveNiche(
  slug: string,
  bookfactoryRoot: string,
  now: Date
): Promise<void> {
  const statePath = path.join(
    bookfactoryRoot,
    "books",
    slug,
    "pipeline-state.json"
  );
  const raw = await fs.readFile(statePath, "utf8");
  const state = JSON.parse(raw);
  state.human_gates.market_intelligence_approved = true;
  state.last_updated = now.toISOString();
  if (!Array.isArray(state.agent_log)) state.agent_log = [];
  state.agent_log.push({
    timestamp: now.toISOString(),
    agent: "queue-processor",
    action: "Niche approved by user",
    result: "approved",
    notes: "market_intelligence_approved set to true — stage 2 now unlocked.",
  });
  await fs.writeFile(
    statePath,
    JSON.stringify(state, null, 2) + "\n",
    "utf8"
  );
}

// ── Main entry point ────────────────────────────────────────────────────────

export async function processQueue(
  config: DaemonConfig,
  now: Date
): Promise<void> {
  const queueFile = path.join(config.bookfactoryRoot, "books", ".queue.json");
  const queue = await readQueue(queueFile);

  if (queue.entries.length === 0) return;

  let changed = false;

  for (const entry of queue.entries) {
    const bookDir = entry.slug
      ? path.join(config.bookfactoryRoot, "books", entry.slug)
      : null;

    // ── pending → researching ──────────────────────────────────────────────
    if (entry.status === "pending") {
      if (!entry.id) entry.id = crypto.randomUUID();
      if (!entry.added_at) entry.added_at = now.toISOString();
      entry.slug = slugify(entry.title);

      const alreadyExists = await fileExists(
        path.join(
          config.bookfactoryRoot,
          "books",
          entry.slug,
          "pipeline-state.json"
        )
      );
      if (!alreadyExists) {
        if (!config.dryRun) {
          await bootstrapBook(entry, config.bookfactoryRoot);
        }
        console.log(
          `[queue] ${config.dryRun ? "DRY RUN — would bootstrap" : "bootstrapped"} "${entry.title}" → books/${entry.slug}`
        );
      }

      entry.status = "researching";
      changed = true;
      await appendActivityEntry(config.activityLogFile, {
        ts: now,
        book: entry.slug,
        action: "queued",
        detail: config.dryRun
          ? `DRY RUN — would bootstrap "${entry.title}"`
          : `Bootstrapped "${entry.title}" — stage-1 research starting`,
      });
    }

    // ── researching → master_review ────────────────────────────────────────
    // Trigger once MARKET-INTELLIGENCE.md exists (research agents complete).
    if (entry.status === "researching" && bookDir) {
      const researchDone = await fileExists(
        path.join(bookDir, "MARKET-INTELLIGENCE.md")
      );
      if (researchDone) {
        const rounds = entry.review_rounds ?? 0;
        console.log(
          `[queue] research complete for "${entry.title}" — ` +
            `${config.dryRun ? "DRY RUN — would invoke" : "invoking"} Master Orchestrator review (round ${rounds + 1})`
        );
        if (!config.dryRun) {
          const exitCode = await invokeMasterReview(entry, bookDir);
          console.log(
            `[queue] master review exited with code ${exitCode} for "${entry.title}"`
          );
        }
        entry.review_rounds = rounds + 1;
        entry.status = "master_review";
        changed = true;
        await appendActivityEntry(config.activityLogFile, {
          ts: now,
          book: entry.slug!,
          action: "queued",
          detail: config.dryRun
            ? `DRY RUN — would run Master Orchestrator review for "${entry.title}"`
            : `Master Orchestrator review round ${rounds + 1} complete for "${entry.title}"`,
        });
      }
    }

    // ── master_review → brief_ready (or back to researching) ──────────────
    if (entry.status === "master_review" && bookDir) {
      const decision = await readMasterReviewDecision(bookDir);
      if (decision) {
        if (decision.decision === "brief_ready") {
          entry.status = "brief_ready";
          changed = true;
          console.log(
            `[queue] Master Orc brief ready for "${entry.title}" — recommendation: ${decision.go_recommendation ?? "see brief"}`
          );
          await appendActivityEntry(config.activityLogFile, {
            ts: now,
            book: entry.slug!,
            action: "queued",
            detail: `Brief ready for "${entry.title}" — ${decision.go_recommendation ?? "see NICHE-DECISION-BRIEF.md"}`,
          });
        } else if (decision.decision === "need_more_research") {
          // Master Orc wants another research pass — reset to researching.
          // The previous MASTER-REVIEW.json is overwritten on the next review.
          entry.status = "researching";
          changed = true;
          console.log(
            `[queue] Master Orc requested more research for "${entry.title}" — gaps: ${decision.gaps?.join(", ")}`
          );
        }
      }
    }

    // ── brief_ready → notify human (every run until approved/rejected) ─────
    if (entry.status === "brief_ready" && bookDir) {
      const briefExists = await fileExists(
        path.join(bookDir, "NICHE-DECISION-BRIEF.md")
      );
      await appendGateHit(config.notificationsFile, {
        ts: now,
        book: entry.slug!,
        gates: [
          {
            name: "market_intelligence_approved",
            blockingStage: 2,
            description: briefExists
              ? `Master Orc brief ready — read books/${entry.slug}/NICHE-DECISION-BRIEF.md then set status to "approved" or "rejected" in books/.queue.json`
              : `Master Orc review complete — set status to "approved" or "rejected" in books/.queue.json`,
          },
        ],
      });
    }

    // ── approved → in_pipeline ─────────────────────────────────────────────
    if (entry.status === "approved" && entry.slug) {
      if (!config.dryRun) {
        await approveNiche(entry.slug, config.bookfactoryRoot, now);
      }
      console.log(
        `[queue] ${config.dryRun ? "DRY RUN — would approve" : "approved"} niche for "${entry.title}"`
      );
      entry.status = "in_pipeline";
      if (!entry.approved_at) entry.approved_at = now.toISOString();
      changed = true;
      await appendActivityEntry(config.activityLogFile, {
        ts: now,
        book: entry.slug,
        action: "niche_approved",
        detail: config.dryRun
          ? `DRY RUN — would unlock stage 2 for "${entry.title}"`
          : `Niche approved — stage 2 now unlocked for "${entry.title}"`,
      });
    }

    // ── rejected → archived ────────────────────────────────────────────────
    if (entry.status === "rejected" && entry.slug) {
      entry.status = "archived";
      if (!entry.rejected_at) entry.rejected_at = now.toISOString();
      changed = true;
      console.log(`[queue] archiving rejected idea "${entry.title}"`);
      await appendActivityEntry(config.activityLogFile, {
        ts: now,
        book: entry.slug,
        action: "niche_rejected",
        detail: `"${entry.title}" rejected${entry.reject_reason ? ` — ${entry.reject_reason}` : ""}`,
      });
    }
  }

  if (changed && !config.dryRun) {
    await writeQueue(queueFile, queue);
  }
}
