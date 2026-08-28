import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AcademyProgrammesList from "components/academy/programmes-list";

vi.mock("lib/sanity/queries", () => ({
  getAcademyProgrammes: vi.fn().mockResolvedValue([
    {
      _id: "prog1",
      title_en: "Skateboarding 101",
      title_hi: "स्केटबोर्डिंग 101",
      city: "Mumbai",
      bookingEnabled: true,
      skillLevels: ["Beginner", "Intermediate"],
      description_en: "Weekend group session at Carter Road",
    },
  ]),
}));

describe("AcademyProgrammesList Component (programmes-list.tsx)", () => {
  it("renders live Sanity programme cards with title and city tag", async () => {
    const Component = await AcademyProgrammesList({ locale: "en" });
    if (!Component) throw new Error("Component returned null");
    render(Component);
    expect(screen.getByText("Skateboarding 101")).toBeInTheDocument();
    expect(screen.getByText("Mumbai")).toBeInTheDocument();
    expect(screen.getByText("Booking Open")).toBeInTheDocument();
  });
});
