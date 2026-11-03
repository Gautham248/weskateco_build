"use client";

import { GIFEncoder, applyPalette, quantize } from "gifenc";

/**
 * Browser-only video-to-GIF conversion for the hero uploader.
 *
 * This runs entirely in the page so no ffmpeg is needed on the server. That
 * matters because the app deploys to Vercel, where the Node runtime has no
 * ffmpeg binary and function timeouts are far too short to decode and re-encode
 * a multi-megabyte clip.
 *
 * The trade-off is that conversion only works if the browser can decode the
 * source. Safari in particular frequently cannot decode a QuickTime .mov, which
 * is the one format people most often want converted - see the error thrown
 * below, which says so plainly rather than failing silently.
 */

export type VideoToGifProgress = {
  frame: number;
  total: number;
};

export type VideoToGifResult = {
  blob: Blob;
  width: number;
  height: number;
  frames: number;
};

export type VideoToGifOptions = {
  /** Target width in pixels. Height follows the source aspect ratio. */
  width?: number;
  fps?: number;
  /** Hard cap on clip length. Bounds both runtime and the encoded size. */
  maxSeconds?: number;
  maxColors?: number;
  onProgress?: (progress: VideoToGifProgress) => void;
  signal?: AbortSignal;
};

const DEFAULTS = {
  width: 600,
  fps: 10,
  maxSeconds: 8,
  maxColors: 64,
} as const;

function seekTo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("The browser could not decode a frame from this video."));
    };
    const cleanup = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.currentTime = time;
  });
}

/** Yields to the event loop so progress paints and the tab stays responsive. */
function nextTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export async function videoToGif(
  file: File,
  options: VideoToGifOptions = {},
): Promise<VideoToGifResult> {
  const width = options.width ?? DEFAULTS.width;
  const fps = options.fps ?? DEFAULTS.fps;
  const maxSeconds = options.maxSeconds ?? DEFAULTS.maxSeconds;
  const maxColors = options.maxColors ?? DEFAULTS.maxColors;

  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";

  // Some browsers will not decode a detached media element, so it is attached
  // (invisibly) rather than left floating.
  video.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none";
  document.body.appendChild(video);

  const cleanup = () => {
    video.removeAttribute("src");
    video.load();
    video.remove();
    URL.revokeObjectURL(objectUrl);
  };

  try {
    video.src = objectUrl;

    await new Promise<void>((resolve, reject) => {
      const onReady = () => {
        cleanupListeners();
        resolve();
      };
      const onError = () => {
        cleanupListeners();
        reject(
          new Error(
            "This browser cannot decode that video. QuickTime .mov files in " +
              "particular are often unsupported - re-export as MP4 (H.264) " +
              "and try again.",
          ),
        );
      };
      const cleanupListeners = () => {
        video.removeEventListener("loadedmetadata", onReady);
        video.removeEventListener("error", onError);
      };

      video.addEventListener("loadedmetadata", onReady);
      video.addEventListener("error", onError);
    });

    const duration = video.duration;

    // Some containers (notably WebM/MKV) report Infinity until fully played.
    if (!Number.isFinite(duration) || duration <= 0) {
      throw new Error(
        "Could not read the video's length, so it cannot be converted.",
      );
    }

    const sourceWidth = video.videoWidth;
    const sourceHeight = video.videoHeight;

    if (!sourceWidth || !sourceHeight) {
      throw new Error("The video has no readable dimensions.");
    }

    const targetWidth = Math.min(width, sourceWidth);
    // Even dimensions keep encoders and scalers on a fast path.
    const targetHeight = Math.max(
      2,
      Math.round((targetWidth * sourceHeight) / sourceWidth / 2) * 2,
    );

    const clipSeconds = Math.min(duration, maxSeconds);
    const totalFrames = Math.max(1, Math.round(clipSeconds * fps));
    const delay = Math.round(1000 / fps);

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
      throw new Error("This browser blocked 2D canvas access.");
    }

    const encoder = GIFEncoder();
    let written = 0;

    for (let index = 0; index < totalFrames; index += 1) {
      if (options.signal?.aborted) {
        throw new DOMException("Conversion cancelled.", "AbortError");
      }

      // Landing just before the frame's nominal time avoids landing on a keyframe
      // boundary that a decoder may skip past.
      const time = Math.min(
        Math.max(0, (index / fps) - 0.001),
        Math.max(0, duration - 0.001),
      );

      await seekTo(video, time);

      context.drawImage(video, 0, 0, targetWidth, targetHeight);

      const pixels = context.getImageData(
        0,
        0,
        targetWidth,
        targetHeight,
      ).data;

      const palette = quantize(pixels, maxColors);
      const indexed = applyPalette(pixels, palette);

      encoder.writeFrame(indexed, targetWidth, targetHeight, {
        palette,
        delay,
      });

      written += 1;
      options.onProgress?.({ frame: written, total: totalFrames });

      await nextTick();
    }

    encoder.finish();

    const blob = new Blob([encoder.bytes()], { type: "image/gif" });

    return {
      blob,
      width: targetWidth,
      height: targetHeight,
      frames: written,
    };
  } finally {
    cleanup();
  }
}

/** clip.mov -> clip.gif, used to name the uploaded file. */
export function gifFileName(name: string): string {
  const dot = name.lastIndexOf(".");

  if (dot <= 0) {
    return `${name}.gif`;
  }

  return `${name.slice(0, dot)}.gif`;
}
