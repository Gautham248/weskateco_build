"use server";

import { uploadToImageKit } from "lib/admin/imagekit";
import { getSessionToken, verifySessionToken } from "lib/admin/auth";

export async function uploadMediaAction(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  const token = await getSessionToken();
  const valid = await verifySessionToken(token);
  if (!valid) return { success: false, error: "Unauthorized" };

  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "/weskateco";

  if (!file || file.size === 0) {
    return { success: false, error: "No file selected" };
  }

  // Max 50MB
  if (file.size > 50 * 1024 * 1024) {
    return { success: false, error: "File size exceeds 50MB limit" };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const url = await uploadToImageKit(buffer, file.name, folder);
    return { success: true, url };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return { success: false, error: message };
  }
}
