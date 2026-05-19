import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScoreBadge } from "@/components/ScoreBadge";

describe("ScoreBadge — null/undefined score", () => {
  it("renders a dash placeholder when score is null", () => {
    render(<ScoreBadge score={null} />);
    expect(screen.getByText("—/120")).toBeInTheDocument();
  });

  it("renders a dash placeholder when score is undefined", () => {
    render(<ScoreBadge score={undefined} />);
    expect(screen.getByText("—/120")).toBeInTheDocument();
  });

  it("reflects a custom max in the placeholder", () => {
    render(<ScoreBadge score={null} max={100} />);
    expect(screen.getByText("—/100")).toBeInTheDocument();
  });
});

describe("ScoreBadge — grade tiers (default threshold=96, max=120)", () => {
  it("shows grade A for score >= 108 (threshold + 12)", () => {
    render(<ScoreBadge score={108} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("108/120")).toBeInTheDocument();
  });

  it("shows grade A for the maximum score", () => {
    render(<ScoreBadge score={120} />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("shows grade B for score at the threshold (96)", () => {
    render(<ScoreBadge score={96} />);
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("96/120")).toBeInTheDocument();
  });

  it("shows grade B for score between threshold and threshold+12 (97–107)", () => {
    render(<ScoreBadge score={100} />);
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("shows grade C for score between threshold-12 and threshold-1 (84–95)", () => {
    render(<ScoreBadge score={90} />);
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("shows grade F for score below threshold-12 (< 84)", () => {
    render(<ScoreBadge score={80} />);
    expect(screen.getByText("F")).toBeInTheDocument();
  });

  it("shows grade F for score 0", () => {
    render(<ScoreBadge score={0} />);
    expect(screen.getByText("F")).toBeInTheDocument();
  });
});

describe("ScoreBadge — custom threshold and max", () => {
  it("applies a custom threshold for grading", () => {
    // threshold=50, max=100 — score 62 should be B (50 ≤ 62 < 62)
    render(<ScoreBadge score={55} max={100} threshold={50} />);
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("55/100")).toBeInTheDocument();
  });

  it("shows A when score meets threshold + 12 with custom settings", () => {
    render(<ScoreBadge score={65} max={100} threshold={50} />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});

describe("ScoreBadge — tooltip", () => {
  it("includes the threshold and max in the title attribute", () => {
    const { container } = render(<ScoreBadge score={100} />);
    const badge = container.querySelector("[title]");
    expect(badge?.getAttribute("title")).toMatch(/96\/120/);
  });
});
