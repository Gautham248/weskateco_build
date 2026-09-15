import { ImageKit } from "@imagekit/nodejs";

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const UPLOAD_FOLDER = "/weskateco/products";

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
