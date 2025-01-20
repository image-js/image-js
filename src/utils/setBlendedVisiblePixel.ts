import type { Image } from '../Image.js';
import type { Mask } from '../Mask.js';

import { setBlendedPixel } from './setBlendedPixel.js';

/**
 * Blend the given pixel with the pixel at the specified location in the image if the pixel is in image's bounds.
 * @param image - The image with which to blend.
 * @param column - Column of the target pixel.
 * @param row - Row of the target pixel.
 * @param color - Color with which to blend the image pixel. @default `'Opaque black'`.
 */
export function setBlendedVisiblePixel(
  image: Image | Mask,
  column: number,
  row: number,
  color?: number[],
) {
  if (column >= 0 && column < image.width && row >= 0 && row < image.height) {
    setBlendedPixel(image, column, row, color);
  }
}
