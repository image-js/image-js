import { Image } from '../Image.js';
import type { Mask } from '../Mask.js';
import { assert } from '../utils/validators/assert.js';

export interface WriteCanvasOptions {
  /**
   * If set to `true`, the canvas element will be resized to fit the image.
   * @default `true`
   */
  resizeCanvas?: boolean;
  /**
   * @default `0`
   */
  dx?: number;
  /**
   *  @default `0`
   */
  dy?: number;
  /**
   * @default `0`
   */
  dirtyX?: number;
  /**
   * @default `0`
   */
  dirtyY?: number;
  /**
   * @default `image.width`
   */
  dirtyWidth?: number;
  /**
   * @default `image.height`
   */
  dirtyHeight?: number;
}

// TODO: Create nodejs version that throws an error
/**
 * Draw the image in an HTML canvas.
 * @param image - The image to draw.
 * @param canvas - The HTML canvas.
 * @param options - Write canvas options.
 */
export function writeCanvas(
  image: Image | Mask,
  canvas: HTMLCanvasElement,
  options: WriteCanvasOptions = {},
): void {
  if (image.colorModel !== 'RGBA') {
    image = image.convertColor('RGBA');
  }
  if (image.bitDepth !== 8 && image instanceof Image) {
    image = image.convertBitDepth(8);
  }
  const {
    resizeCanvas = true,
    dx = 0,
    dy = 0,
    dirtyX = 0,
    dirtyY = 0,
    dirtyWidth = image.width,
    dirtyHeight = image.height,
  } = options;
  if (resizeCanvas) {
    canvas.width = image.width;
    canvas.height = image.height;
  }
  const ctx = canvas.getContext('2d');
  assert(ctx);
  const data = image.getRawImage().data;
  ctx.putImageData(
    new ImageData(
      // @ts-expect-error ImageData types don't support SharedArrayBuffer.
      new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength),
      image.width,
      image.height,
    ),
    dx,
    dy,
    dirtyX,
    dirtyY,
    dirtyWidth,
    dirtyHeight,
  );
}
