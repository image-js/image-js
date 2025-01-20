import { Image } from '../Image.js';
import { assert } from '../utils/validators/assert.js';

/**
 * Read an image from an HTML canvas element.
 * @param canvas - Canvas element.
 * @returns The read image.
 */
export function readCanvas(canvas: HTMLCanvasElement): Image {
  const ctx = canvas.getContext('2d');
  assert(ctx);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return new Image(imageData.width, imageData.height, {
    data: new Uint8Array(
      imageData.data.buffer,
      imageData.data.byteOffset,
      imageData.data.byteLength,
    ),
    colorModel: 'RGBA',
  });
}
