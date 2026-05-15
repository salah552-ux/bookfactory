/**
 * Static stage catalogue. Each entry mirrors PIPELINE-MANIFEST.json but adds
 * the UI-only fields the panel needs: the parallel pair (if any) and the
 * human-gate field bound to pipeline-state.json.
 *
 * Keep in sync with .claude/agents/PIPELINE-MANIFEST.json. When the manifest
 * is delivered over WS (agents.snapshot.manifest), it overrides this default.
 */

export interface StageDef {
  id: string;
  name: string;
  agents: string[];
  parallel?: string[][];
  outputs?: string[];
  human_gate_field?: string;
  human_gate_instruction?: string;
  notes?: string;
}

export const STAGES: StageDef[] = [
  {
    id: "01-research",
    name: "Market Research",
    agents: ["market-researcher", "competitive-positioning-agent", "deep-market-intelligence-agent"],
    parallel: [["market-researcher", "competitive-positioning-agent"]],
    outputs: ["MARKET-INTELLIGENCE.md", "COMPETITIVE-ANALYSIS.md"],
    human_gate_field: "market_intelligence_approved",
    human_gate_instruction:
      "Review MARKET-INTELLIGENCE.md + COMPETITIVE-ANALYSIS.md. Tick the gate when satisfied.",
  },
  {
    id: "02-planning",
    name: "Blueprint & Architecture",
    agents: ["novel-writer", "book-architect", "title-and-subtitle-lab"],
    outputs: ["BLUEPRINT.md", "FACTS.md", "KDP-LISTING.md", "TITLE-LAB.md"],
    human_gate_field: "blueprint_approved",
    human_gate_instruction:
      "Review BLUEPRINT.md — chapter plan, protagonist, structure, series arc.",
    notes: "novel-writer runs for FICTION/FICTION-MYSTERY; book-architect for NONFICTION-*.",
  },
  {
    id: "03-writing",
    name: "Manuscript Writing",
    agents: ["health-writer", "fiction-writer", "murder-mystery-writer", "business-writer"],
    outputs: ["manuscript/ch-*.md", "manuscript/handoffs/ch-*-handoff.md"],
    notes:
      "Use the Writing tab — every chapter must pass brief-validator → writer → fact-checker → book-reviewer ≥96 → compliance-officer.",
  },
  {
    id: "04-quality",
    name: "Quality Assurance",
    agents: ["fact-checker", "book-reviewer", "compliance-officer", "proofreader-agent"],
    parallel: [["fact-checker", "book-reviewer", "proofreader-agent"]],
    outputs: ["FACT-CHECK-REPORT.md", "COMPLIANCE-REPORT.md", "PROOFREAD-REPORT.md"],
  },
  {
    id: "05-optimisation",
    name: "Optimisation",
    agents: ["hook-optimizer-agent", "review-bait-optimizer"],
    parallel: [["hook-optimizer-agent", "review-bait-optimizer"]],
    outputs: ["HOOK-REPORT.md", "REVIEW-VELOCITY-REPORT.md"],
  },
  {
    id: "06-production",
    name: "Production",
    agents: [
      "manuscript-style-designer",
      "design-agent",
      "paperback-interior-agent",
      "final-approval-agent",
    ],
    outputs: [
      "pdf-style.css",
      "DESIGN-PACKAGE.md",
      "PRINT-SPECS.md",
      "FINAL-APPROVAL.md",
    ],
    human_gate_field: "final_approval_passed",
    human_gate_instruction:
      "final-approval-agent must score ≥270/300 across all 6 dimensions.",
  },
  {
    id: "07-publishing",
    name: "Publishing",
    agents: [
      "publisher-agent",
      "marketing-agent",
      "reach-agent",
      "pre-launch-agent",
      "amazon-ads-agent",
      "kdp-upload-agent",
    ],
    outputs: [
      "KDP-LISTING.md",
      "MARKETING-PLAN.md",
      "REACH-PACK.md",
      "PRE-LAUNCH.md",
      "AMS-CAMPAIGNS.md",
    ],
    human_gate_field: "launch_ready",
    human_gate_instruction:
      "pre-launch-agent must mark launch_ready=true. KDP publish needs the typed-PUBLISH gate.",
  },
  {
    id: "08-products",
    name: "Digital Products",
    agents: ["product-extractor", "digital-product-designer"],
    outputs: ["PRODUCTS-*.md"],
  },
  {
    id: "09-series",
    name: "Series",
    agents: [
      "series-manager",
      "series-sync-agent",
      "series-continuity-guardian",
      "arc-manager-agent",
    ],
    outputs: ["SERIES-CONTINUITY-*.md", "ARC-PROGRAMME.md"],
  },
  {
    id: "10-postlaunch",
    name: "Post-launch",
    agents: ["post-launch-agent", "ams-optimizer-agent", "aplus-content-agent"],
    outputs: ["POST-LAUNCH-*.md", "AMS-REPORT.md", "APLUS-CONTENT.md"],
  },
];

export function stageById(id: string): StageDef | undefined {
  return STAGES.find((s) => s.id === id);
}
