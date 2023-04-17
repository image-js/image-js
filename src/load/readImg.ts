import { Image } from '../Image';
import { assert } from '../utils/assert';

import { readCanvas } from './readCanvas';
// TODO: Create nodejs version that throws an error

/**
 * Read an image from an HTML image source.
 *
 * @param img - Image source such as an <img> or <svg> element.
 * @returns The read image.
 */
export function readImg(img: CanvasImageSource): Image {
  const canvas = document.createElement('canvas');
  canvas.width = img.width as number;
  canvas.height = img.height as number;
  const ctx = canvas.getContext('2d');
  assert(ctx);
  ctx.drawImage(img, 0, 0);
  return readCanvas(canvas);
}
