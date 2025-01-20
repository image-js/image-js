import type { Image } from '../Image.js';
import { assert } from '../utils/validators/assert.js';

import { readCanvas } from './readCanvas.js';
// TODO: Create nodejs version that throws an error

/**
 * Read an image from an HTML image source.
 * @param img - Image source such as an <img> or <svg> element.
 * @returns The read image.
 */
export function readImg(
  img: Extract<CanvasImageSource, Record<'width' | 'height', number>>,
): Image {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  assert(ctx);
  ctx.drawImage(img, 0, 0);
  return readCanvas(canvas);
}
