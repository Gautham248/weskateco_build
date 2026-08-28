import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SiteSettingsForm } from "app/admin/settings/settings-form";

vi.mock("lib/admin/actions/site-settings", () => ({
  saveSiteSettingsAction: vi.fn().mockResolvedValue({ success: true }),
}));

describe("Site Settings Form (settings-form.tsx)", () => {
  const initialSettings = {
    companyName: "WeSkate Co",
    announcementBar: {
      enabled: true,
      text_en: "FREE SHIPPING OVER ₹2,999",
      text_hi: "₹2,999 से अधिक पर मुफ़्त शिपिंग",
    },
    contactEmail: "support@weskateco.com",
    contactPhone: "+91 98765 43210",
    socialLinks: {
      instagram: "https://instagram.com/weskateco",
    },
    footerText_en: "© 2026 WeSkate Co",
  };

  it("renders initial site settings values correctly", () => {
    render(<SiteSettingsForm initialSettings={initialSettings} />);
    expect(screen.getByDisplayValue("WeSkate Co")).toBeInTheDocument();
    expect(screen.getByDisplayValue("FREE SHIPPING OVER ₹2,999")).toBeInTheDocument();
    expect(screen.getByDisplayValue("support@weskateco.com")).toBeInTheDocument();
  });

  it("allows editing text fields and clicking save", () => {
    render(<SiteSettingsForm initialSettings={initialSettings} />);
    const emailInput = screen.getByDisplayValue("support@weskateco.com");
    fireEvent.change(emailInput, { target: { value: "hello@weskateco.com" } });
    expect(screen.getByDisplayValue("hello@weskateco.com")).toBeInTheDocument();

    const saveBtn = screen.getByText("Save Site Settings");
    fireEvent.click(saveBtn);
    expect(saveBtn).toBeInTheDocument();
  });
});
