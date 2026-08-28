import { describe, it, expect, vi } from "vitest";

vi.mock("lib/admin/auth", () => ({
  getSessionToken: vi.fn().mockResolvedValue("valid-token"),
  verifySessionToken: vi.fn().mockResolvedValue(true),
}));

vi.mock("lib/admin/imagekit", () => ({
  uploadToImageKit: vi.fn().mockResolvedValue({
    url: "https://ik.imagekit.io/weskateco/hero/test.jpg",
  }),
}));

import { uploadMediaAction } from "lib/admin/actions/media";

describe("Media Upload Server Action (lib/admin/actions/media.ts)", () => {
  it("should fail if no file is provided", async () => {
    const formData = new FormData();
    const res = await uploadMediaAction(formData);
    expect(res.success).toBe(false);
    expect(res.error).toBe("No file selected");
  });

  it("should fail if file size exceeds 50MB", async () => {
    const largeBuffer = new ArrayBuffer(55 * 1024 * 1024); // 55MB
    const largeFile = new File([largeBuffer], "large-video.mp4", { type: "video/mp4" });
    const formData = new FormData();
    formData.append("file", largeFile);

    const res = await uploadMediaAction(formData);
    expect(res.success).toBe(false);
    expect(res.error).toContain("exceeds 50MB limit");
  });

  it("should successfully upload a valid image file", async () => {
    const file = new File(["test image content"], "hero.jpg", { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "/weskateco/hero");

    const res = await uploadMediaAction(formData);
    expect(res.success).toBe(true);
    expect(res.url).toEqual({ url: "https://ik.imagekit.io/weskateco/hero/test.jpg" });
  });
});
