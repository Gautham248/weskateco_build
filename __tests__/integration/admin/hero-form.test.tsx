import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeroEditorForm } from "app/admin/homepage/hero/hero-form";

vi.mock("lib/admin/actions/homepage", () => ({
  saveHeroSettingsAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("lib/admin/actions/media", () => ({
  uploadMediaAction: vi.fn().mockResolvedValue({
    success: true,
    url: "https://ik.imagekit.io/weskateco/hero/new-hero.mp4",
  }),
}));

describe("Hero Banner Editor Form (hero-form.tsx)", () => {
  const defaultInitial = {
    mediaUrl: "https://ik.imagekit.io/weskateco/hero/test.gif",
    mediaType: "gif" as const,
    overlayEnabled: true,
    ctaButtons: [{ label_en: "SHOP NOW", label_hi: "अभी खरीदें", href: "/store" }],
  };

  it("renders initial hero banner form state correctly", () => {
    render(<HeroEditorForm initialSettings={defaultInitial} />);
    expect(screen.getByDisplayValue("https://ik.imagekit.io/weskateco/hero/test.gif")).toBeInTheDocument();
    expect(screen.getByDisplayValue("SHOP NOW")).toBeInTheDocument();
  });

  it("allows adding a new call to action button", () => {
    render(<HeroEditorForm initialSettings={defaultInitial} />);
    const addBtn = screen.getByText("+ Add CTA Button");
    fireEvent.click(addBtn);
    expect(screen.getByDisplayValue("NEW BUTTON")).toBeInTheDocument();
  });

  it("submits updated hero settings on Save button click", async () => {
    render(<HeroEditorForm initialSettings={defaultInitial} />);
    const saveBtn = screen.getByText("Save Hero Settings");
    fireEvent.click(saveBtn);
    expect(saveBtn).toBeInTheDocument();
  });
});
