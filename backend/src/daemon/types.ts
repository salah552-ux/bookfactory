/**
 * Daemon type definitions. Mirrors the relevant subset of pipeline-state.json
 * that the orchestrator daemon consumes. Kept narrow on purpose — the daemon
 * never writes to pipeline-state, so we only type the fields it reads.
 */

export interface HumanGates {
  market_intelligence_approved: boolean;
  blueprint_approved: boolean;
  cover_approved: boolean;
  final_approval_passed: boolean;
  ai_questionnaire_confirmed: boolean;
  published: boolean;
}

export interface PipelineState {
  book_slug: string;
  book_title: string;
  current_stage: number;
  human_gates: HumanGates;
  // Additional fields exist (writing, quality_scores, etc.) but the daemon
  // only reads the gate state. Use `unknown` to preserve the rest on read/write.
  [key: string]: unknown;
}

export interface SpendLogEntry {
  ts: string; // ISO 8601
  agent: string;
  runId: string;
  exitCode?: number;
  dryRun?: boolean;
}

export interface SpendLog {
  entries: SpendLogEntry[];
}

// ── Queue types ────────────────────────────────────────────────────────────

export type QueueStatus =
  | "pending"       // user added the idea — not yet bootstrapped
  | "researching"   // book folder created, stage-1 agents running
  | "approved"      // user approved the niche — daemon will unlock stage 2
  | "rejected"      // user rejected — archived, pipeline won't run
  | "in_pipeline"   // niche approved, pipeline advancing normally
  | "archived";     // terminal state for rejected ideas

export interface QueueEntry {
  /** Stable identifier — set on first write, never changed. */
  id: string;
  /** Human-readable title as the user typed it. */
  title: string;
  /** Genre key: health | business | fiction | mystery | fantasy | thriller */
  genre: string;
  /** Optional free-text hint for the research agents. */
  niche_hint?: string;
  status: QueueStatus;
  /** Populated once the book folder is bootstrapped. */
  slug?: string;
  added_at: string;       // ISO 8601
  approved_at?: string;
  rejected_at?: string;
  reject_reason?: string;
}

export interface QueueFile {
  entries: QueueEntry[];
}

// ── Daemon config ──────────────────────────────────────────────────────────

export interface DaemonConfig {
  /** Max orchestrator invocations per book per UTC day. */
  maxInvocationsPerDay: number;
  /** Path to the kill-switch file at repo root. */
  pauseFile: string;
  /** Path to the bookfactory root. */
  bookfactoryRoot: string;
  /** Path to the cumulative activity log. */
  activityLogFile: string;
  /** Path to the human-gate notifications file. */
  notificationsFile: string;
  /** When true, the daemon does not invoke claude — only logs intent. */
  dryRun: boolean;
}

export interface HumanGate {
  /** Gate field name inside PipelineState['human_gates']. */
  name: keyof HumanGates;
  /** The book is blocked once current_stage >= this and the gate is unapproved. */
  blockingStage: number;
  /** Human-readable description for notifications. */
  description: string;
}
