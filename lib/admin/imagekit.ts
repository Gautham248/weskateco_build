import { ImageKit } from "@imagekit/nodejs";

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/**
 * Videos go to the same ImageKit bucket as images, but ImageKit's per-file
 * allowance is plan-dependent and far larger for video: 100MB on free, 300MB
 * on Lite, 2GB on Pro (@imagekit/nodejs resources/files/files.d.ts).
 *
 * Deliberately a separate constant from MAX_UPLOAD_BYTES so that raising the
 * video ceiling can never loosen the image one. Override with
 * IMAGEKIT_MAX_VIDEO_BYTES where the plan permits more.
 */
export const ALLOWED_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  // Some browsers report a .mov as this rather than video/quicktime.
  "video/x-quicktime",
  "video/x-matroska",
];

const DEFAULT_MAX_VIDEO_UPLOAD_BYTES = 100 * 1024 * 1024;

function resolveMaxVideoUploadBytes(): number {
  const raw = process.env.IMAGEKIT_MAX_VIDEO_BYTES;

  if (!raw) {
    return DEFAULT_MAX_VIDEO_UPLOAD_BYTES;
  }

  const parsed = Number.parseInt(raw, 10);

  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_MAX_VIDEO_UPLOAD_BYTES;
}

export const MAX_VIDEO_UPLOAD_BYTES = resolveMaxVideoUploadBytes();

export const UPLOAD_FOLDER = "/weskateco/products";

/**
 * Hero media is kept out of the product folder. scripts/seed-hero.ts targets the
 * same path, so seeded and uploaded hero slides end up in one place.
 */
export const HERO_UPLOAD_FOLDER = "/weskateco/hero";

let client: ImageKit | undefined;

/**
 * Server-only. The private key is read here and never sent to the browser -
 * uploads go through app/admin/api/upload rather than direct-to-ImageKit.
 */
export function getImageKitClient(): ImageKit {
  if (!client) {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!privateKey) {
      throw new Error(
        "IMAGEKIT_PRIVATE_KEY is not set. Admin image uploads are unavailable.",
      );
    }

    client = new ImageKit({ privateKey });
  }

  return client;
}

export function isAllowedImageType(mimeType: string): boolean {
  return ALLOWED_IMAGE_MIME_TYPES.includes(mimeType);
}

export function isAllowedVideoType(mimeType: string): boolean {
  return ALLOWED_VIDEO_MIME_TYPES.includes(mimeType);
}

/**
 * Extension fallbacks, used only when the browser reports no usable MIME type.
 * Lowercase: uppercase is extremely common in the wild for exactly the format
 * this exists to support - iPhones and macOS produce clip.MOV, not clip.mov.
 */
export const ALLOWED_VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "mkv"];

export const ALLOWED_IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "gif",
];

/** Browsers send this when they could not work out the type themselves. */
const UNKNOWN_MIME_TYPES = new Set(["", "application/octet-stream"]);

export type UploadKind = "image" | "video" | "unknown";

function fileExtension(fileName: string): string {
  const lower = fileName.toLowerCase();
  const dot = lower.lastIndexOf(".");

  return dot === -1 ? "" : lower.slice(dot + 1);
}

/**
 * Decides which allowlist and which size ceiling apply to an upload.
 *
 * The allowlists stay authoritative. The extension is consulted only when the
 * browser reported nothing we can go on, so a file whose MIME type is present
 * but not allowlisted is rejected outright - the extension can never widen what
 * the server accepts. This matters because browsers disagree wildly about
 * QuickTime: some report video/quicktime, some video/x-quicktime, some
 * video/x-mov, and some nothing at all, which previously sent a perfectly good
 * .mov down the image branch and produced a confusing image-only 415.
 */
export function resolveUploadKind(
  mimeType: string,
  fileName: string,
): UploadKind {
  const mime = (mimeType || "").toLowerCase();

  if (isAllowedVideoType(mime)) {
    return "video";
  }

  if (isAllowedImageType(mime)) {
    return "image";
  }

  if (UNKNOWN_MIME_TYPES.has(mime)) {
    const extension = fileExtension(fileName);

    if (ALLOWED_VIDEO_EXTENSIONS.includes(extension)) {
      return "video";
    }

    if (ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
      return "image";
    }
  }

  return "unknown";
}
