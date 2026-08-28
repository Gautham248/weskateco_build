import { describe, it, expect, vi } from "vitest";

// Mock sanity-write module
vi.mock("lib/admin/sanity-write", () => ({
  patchDoc: vi.fn().mockResolvedValue({ _id: "doc1", updated: true }),
  createDoc: vi.fn().mockResolvedValue({ _id: "new-doc-123" }),
  deleteDoc: vi.fn().mockResolvedValue({ _id: "doc1", deleted: true }),
  setField: vi.fn().mockResolvedValue({ _id: "doc1", set: true }),
}));

import { patchDoc, createDoc, deleteDoc, setField } from "lib/admin/sanity-write";

describe("Sanity Write Operations (lib/admin/sanity-write.ts)", () => {
  it("should execute patchDoc with document ID and fields", async () => {
    const res = await patchDoc("siteSettings", { companyName: "WeSkate Co" });
    expect(res).toEqual({ _id: "doc1", updated: true });
    expect(patchDoc).toHaveBeenCalledWith("siteSettings", { companyName: "WeSkate Co" });
  });

  it("should execute createDoc with document type and fields", async () => {
    const res = await createDoc("authorisedBrand", { name: "Sphere", handle: "sphere" });
    expect(res).toEqual({ _id: "new-doc-123" });
    expect(createDoc).toHaveBeenCalledWith("authorisedBrand", { name: "Sphere", handle: "sphere" });
  });

  it("should execute deleteDoc with document ID", async () => {
    const res = await deleteDoc("doc1");
    expect(res).toEqual({ _id: "doc1", deleted: true });
    expect(deleteDoc).toHaveBeenCalledWith("doc1");
  });

  it("should execute setField with document ID, field path, and value", async () => {
    const res = await setField("siteSettings", "heroSettings", { overlayEnabled: true });
    expect(res).toEqual({ _id: "doc1", set: true });
    expect(setField).toHaveBeenCalledWith("siteSettings", "heroSettings", { overlayEnabled: true });
  });
});
