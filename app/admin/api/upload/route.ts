import { getAdminSession } from "lib/admin/auth";
import {
  getImageKitClient,
  MAX_UPLOAD_BYTES,
  MAX_VIDEO_UPLOAD_BYTES,
  resolveUploadKind,
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
  } catch (error) {
    // Logged because this catch is deliberately broad: a body that arrived
    // truncated by the proxy's body-clone limit surfaces here and looks
    // identical to a client that sent the wrong content type.
    console.error("Reading the upload body failed:", error);
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

  // Videos and images have separate allowlists and separate ceilings, so that a
  // roomier video cap can never widen what an image upload accepts. The kind is
  // resolved from the MIME type, falling back to the extension only when the
  // browser reported nothing usable - see resolveUploadKind.
  const kind = resolveUploadKind(file.type, file.name);

  if (kind === "unknown") {
    return NextResponse.json(
      {
        error:
          `Unsupported file "${file.name}"` +
          ` (type reported: "${file.type || "none"}"). ` +
          "Upload an MP4, WebM, MOV or MKV video, " +
          "or a JPEG, PNG, WebP, AVIF or GIF image.",
      },
      { status: 415 },
    );
  }

  if (kind === "video") {
    if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          error: `Videos must be under ${MAX_VIDEO_UPLOAD_BYTES / MEGABYTE}MB.`,
        },
        { status: 413 },
      );
    }
  } else {
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `Images must be under ${MAX_UPLOAD_BYTES / MEGABYTE}MB.` },
        { status: 413 },
      );
    }
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
      // Only populated for video; lets the manager skip re-probing duration.
      duration: uploaded.duration ?? null,
    });
  } catch (error) {
    console.error("ImageKit upload failed:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 502 });
  }
}
