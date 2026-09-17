import type { HeroItemKind } from "lib/catalog/hero";

const PROBE_TIMEOUT_MS = 5000;
const MEGABYTE = 1024 * 1024;

/** Above these the asset is still allowed, but the admin is warned about weight. */
export const MAX_VIDEO_BYTES = 25 * MEGABYTE;
export const MAX_IMAGE_BYTES = 5 * MEGABYTE;

export type MediaProbeResult =
  | { status: "ok"; warning: string | null }
  | { status: "wrong-type"; contentType: string }
  | { status: "unreachable"; reason: string };

/**
 * Server-only. One HEAD request, and a deliberately asymmetric verdict: a URL
 * that is definitely something else (an HTML page, a JSON endpoint) is rejected,
 * but anything merely unverifiable - a CDN that refuses HEAD, a timeout, a host
 * that is briefly down - is allowed with a warning. Blocking curation because a
 * host is temporarily unreachable would be worse than storing a URL the admin can
 * see was not verified.
 */
export async function probeMediaUrl(
  url: string,
  kind: HeroItemKind,
): Promise<MediaProbeResult> {
  const expectedPrefix = kind === "video" ? "video/" : "image/";

  let response: Response;

  try {
    response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
  } catch (error) {
    return {
      status: "unreachable",
      reason: error instanceof Error ? error.message : "Request failed.",
    };
  }

  // 405 and 501 both mean the host refuses HEAD, which is not evidence against
  // the URL itself, so they land in the lenient bucket with everything else.
  if (!response.ok) {
    return { status: "unreachable", reason: `responded ${response.status}` };
  }

  const rawType = response.headers.get("content-type") ?? "";
  const contentType = rawType.split(";")[0]?.trim().toLowerCase() ?? "";

  if (contentType && !contentType.startsWith(expectedPrefix)) {
    return { status: "wrong-type", contentType };
  }

  const lengthHeader = response.headers.get("content-length");
  const contentLength = lengthHeader ? Number(lengthHeader) : Number.NaN;
  const limit = kind === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;

  if (Number.isFinite(contentLength) && contentLength > limit) {
    return {
      status: "ok",
      warning: `That file is about ${Math.round(
        contentLength / MEGABYTE,
      )}MB, which will slow the homepage down.`,
    };
  }

  if (!contentType) {
    return {
      status: "ok",
      warning:
        "The host did not report a content type, so this could not be fully verified.",
    };
  }

  return { status: "ok", warning: null };
}
