import { describe, it, expect, vi } from "vitest";

vi.mock("lib/admin/auth", () => ({
  getSessionToken: vi.fn().mockResolvedValue("valid-token"),
  verifySessionToken: vi.fn().mockResolvedValue(true),
}));

vi.mock("lib/admin/sanity-write", () => ({
  createDoc: vi.fn().mockResolvedValue({ _id: "created-doc-99" }),
  deleteDoc: vi.fn().mockResolvedValue({ _id: "created-doc-99", deleted: true }),
}));

import { createBrandAction, deleteBrandAction, createAcademyProgrammeAction } from "lib/admin/actions/content";

describe("Admin E2E Content Management CRUD Flow", () => {
  it("should execute complete Brand creation and deletion flow", async () => {
    const createRes = await createBrandAction({
      name: "Test Brand",
      handle: "test-brand",
      shopifyCollectionHandle: "test-collection",
    });

    expect(createRes.success).toBe(true);

    const deleteRes = await deleteBrandAction("created-doc-99");
    expect(deleteRes.success).toBe(true);
  });

  it("should execute Academy Programme creation flow", async () => {
    const programmeRes = await createAcademyProgrammeAction({
      title_en: "Street Skating Masterclass",
      city: "Mumbai",
      bookingEnabled: true,
      skillLevels: ["Intermediate", "Advanced"],
    });

    expect(programmeRes.success).toBe(true);
  });
});
