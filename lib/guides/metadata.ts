import type { Metadata } from "next";

/**
 * Shared metadata for the guide pages. The locale layout's title template
 * (`%s | WeSkate Co`) appends the site name, so titles passed here must NOT
 * include it themselves.
 */
export function guideMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { type: "website" },
  };
}
