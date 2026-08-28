import { describe, it, expect, vi } from "vitest";

// Mock next-sanity createClient
vi.mock("next-sanity", () => ({
  createClient: () => ({
    fetch: vi.fn().mockImplementation((query: string) => {
      if (query.includes('type == "siteSettings"')) {
        return Promise.resolve({
          announcementBarEnabled: true,
          announcementBar_en: "FREE SHIPPING OVER ₹2,999",
          contactEmail: "support@weskateco.com",
        });
      }
      if (query.includes('type == "academyProgramme"')) {
        return Promise.resolve([
          { _id: "p1", title_en: "Beginner Workshop", city: "Mumbai", bookingEnabled: true },
        ]);
      }
      if (query.includes('type == "skatepark"')) {
        return Promise.resolve([
          { _id: "s1", name: "Cubbon DIY", city: "Bengaluru", constructionStatus: "in_progress", completionPercentage: 75 },
        ]);
      }
      return Promise.resolve(null);
    }),
  }),
}));

import { getSiteSettings, getAcademyProgrammes, getSkateparks } from "lib/sanity/queries";

describe("Sanity Storefront Query Helpers (lib/sanity/queries.ts)", () => {
  it("should fetch site settings object", async () => {
    const settings = await getSiteSettings();
    expect(settings).not.toBeNull();
    expect(settings?.announcementBar_en).toBe("FREE SHIPPING OVER ₹2,999");
  });

  it("should fetch academy programmes array", async () => {
    const programmes = await getAcademyProgrammes();
    expect(programmes.length).toBe(1);
    expect(programmes[0]?.title_en).toBe("Beginner Workshop");
  });

  it("should fetch skatepark construction projects array", async () => {
    const parks = await getSkateparks();
    expect(parks.length).toBe(1);
    expect(parks[0]?.name).toBe("Cubbon DIY");
    expect(parks[0]?.completionPercentage).toBe(75);
  });
});
