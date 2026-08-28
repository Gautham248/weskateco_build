import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnnouncementBar } from "components/layout/announcement-bar";

vi.mock("lib/sanity/queries", () => ({
  getSiteSettings: vi.fn().mockResolvedValue({
    announcementBarEnabled: true,
    announcementBar_en: "FREE SHIPPING ON ALL ORDERS OVER ₹2,999",
    announcementBar_hi: "₹2,999 से अधिक के सभी ऑर्डर पर मुफ़्त शिपिंग",
  }),
}));

describe("AnnouncementBar Component (announcement-bar.tsx)", () => {
  it("renders English announcement text when locale is en", async () => {
    const Component = await AnnouncementBar({ locale: "en" });
    if (!Component) throw new Error("Component returned null");
    render(Component);
    expect(screen.getByText("FREE SHIPPING ON ALL ORDERS OVER ₹2,999")).toBeInTheDocument();
  });

  it("renders Hindi announcement text when locale is hi", async () => {
    const Component = await AnnouncementBar({ locale: "hi" });
    if (!Component) throw new Error("Component returned null");
    render(Component);
    expect(screen.getByText("₹2,999 से अधिक के सभी ऑर्डर पर मुफ़्त शिपिंग")).toBeInTheDocument();
  });
});
