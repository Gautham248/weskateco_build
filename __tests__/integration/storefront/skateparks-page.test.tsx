import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SkateparksList from "components/skatepark/skateparks-list";

vi.mock("lib/sanity/queries", () => ({
  getSkateparks: vi.fn().mockResolvedValue([
    {
      _id: "sp1",
      name: "Cubbon Park DIY",
      city: "Bengaluru",
      constructionStatus: "in_progress",
      completionPercentage: 80,
      description_en: "Concrete bowl & street section build",
    },
  ]),
}));

describe("SkateparksList Component (skateparks-list.tsx)", () => {
  it("renders live Sanity skatepark project with progress percentage", async () => {
    const Component = await SkateparksList();
    if (!Component) throw new Error("Component returned null");
    render(Component);
    expect(screen.getByText("Cubbon Park DIY")).toBeInTheDocument();
    expect(screen.getByText("📍 Bengaluru")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
  });
});
