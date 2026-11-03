/**
 * Minimal ambient types for gifenc, which ships without any.
 *
 * The shapes here were taken from the library's own ESM bundle
 * (gifenc@1.0.3, dist/gifenc.esm.js) rather than guessed. Only the surface this
 * project uses is described; skipLibCheck means an incomplete file will not
 * mask errors elsewhere.
 *
 * Declared as an ambient module rather than a plain typed module because
 * gifenc's package.json has no "types" field, so TypeScript has nothing to
 * resolve on its own.
 */
declare module "gifenc" {
  /** A palette entry is [r, g, b], optionally with an alpha as a fourth value. */
  export type GifPalette = number[][];

  export interface GifFrameOptions {
    /** Required on the first frame. */
    palette?: GifPalette;
    /** Frame delay in milliseconds. */
    delay?: number;
    /** 0 loops forever, which is the GIF default and what a hero wants. */
    repeat?: number;
    transparent?: boolean;
    transparentIndex?: number;
    colorDepth?: number;
    dispose?: number;
    first?: boolean;
  }

  export interface GifEncoder {
    writeHeader(): void;
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      options?: GifFrameOptions,
    ): void;
    /** Must be called once after the last frame, before bytes(). */
    finish(): void;
    bytes(): Uint8Array;
    bytesView(): Uint8Array;
    reset(): void;
    readonly buffer: ArrayBuffer;
  }

  export interface GifEncoderOptions {
    initialCapacity?: number;
    auto?: boolean;
  }

  /**
   * Writes an indexed frame. With `auto` left on, the header is emitted
   * automatically and only the first frame needs a palette.
   */
  export function GIFEncoder(options?: GifEncoderOptions): GifEncoder;

  /** Builds an at-most-`maxColors` palette from RGBA pixel data. */
  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray,
    maxColors: number,
    options?: {
      format?: string;
      clearAlpha?: boolean;
      clearAlphaColor?: number;
      clearAlphaThreshold?: number;
      oneBitAlpha?: boolean | number;
      useSqrt?: boolean;
    },
  ): GifPalette;

  /** Maps RGBA pixel data onto a palette, returning one index per pixel. */
  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray,
    palette: GifPalette,
    format?: string,
  ): Uint8Array;

  export function prequantize(
    rgba: Uint8Array | Uint8ClampedArray,
    options?: {
      roundRGB?: number;
      roundAlpha?: number;
      oneBitAlpha?: boolean | number;
    },
  ): Uint8Array;

  const _default: typeof GIFEncoder;
  export default _default;
}
