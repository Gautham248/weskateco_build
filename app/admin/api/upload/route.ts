import { getAdminSession } from "lib/admin/auth";
import {
  getImageKitClient,
  isAllowedImageType,
  MAX_UPLOAD_BYTES,
  UPLOAD_FOLDER,
} from "lib/admin/imagekit";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MEGABYTE = 1024 * 1024;

export async function POST(request: NextRequest) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected a multipart form upload." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  const folder = formData.get("folder");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!isAllowedImageType(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, AVIF, and GIF images are allowed." },
      { status: 415 },
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `Images must be under ${MAX_UPLOAD_BYTES / MEGABYTE}MB.` },
      { status: 413 },
    );
  }

  try {
    const uploaded = await getImageKitClient().files.upload({
      file,
      fileName: file.name,
      folder: typeof folder === "string" && folder ? folder : UPLOAD_FOLDER,
      useUniqueFileName: true,
    });

    if (!uploaded.url || !uploaded.fileId) {
      throw new Error("ImageKit returned an incomplete response.");
    }

    return NextResponse.json({
      url: uploaded.url,
      fileId: uploaded.fileId,
      name: uploaded.name ?? file.name,
      width: uploaded.width ?? null,
      height: uploaded.height ?? null,
    });
  } catch (error) {
    console.error("ImageKit upload failed:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 502 });
  }
}
