/**
 * Human-gate detection. Pure logic — no I/O.
 *
 * A "blocking gate" is one whose stage the book has reached but which has not
 * been approved by the user. The daemon must NEVER invoke the orchestrator
 * on a blocked book.
 */
import type { HumanGate, PipelineState } from "./types.js";

export const GATES: readonly HumanGate[] = [
  {
    name: "market_intelligence_approved",
    blockingStage: 2,
    description: "Market intelligence brief awaiting user approval",
  },
  {
    name: "blueprint_approved",
    blockingStage: 3,
    description: "Book blueprint awaiting user approval",
  },
  {
    name: "cover_approved",
    blockingStage: 7,
    description: "Cover design awaiting user approval",
  },
  {
    name: "final_approval_passed",
    blockingStage: 7,
    description: "Final 300-point approval check not yet passed",
  },
  {
    name: "ai_questionnaire_confirmed",
    blockingStage: 7,
    description: "KDP AI questionnaire awaiting confirmation",
  },
  {
    name: "published",
    blockingStage: 8,
    description: "KDP PUBLISH confirmation pending",
  },
] as const;

/**
 * Return every gate that is currently blocking the book's progress.
 * A gate blocks if the book has reached its stage but the gate is unapproved.
 */
export function findBlockingGates(state: PipelineState): HumanGate[] {
  return GATES.filter(
    (g) =>
      state.current_stage >= g.blockingStage &&
      state.human_gates[g.name] === false
  );
}

/**
 * Convenience predicate. True when the daemon should NOT invoke the
 * orchestrator for this book.
 */
export function isBlocked(state: PipelineState): boolean {
  return findBlockingGates(state).length > 0;
}
