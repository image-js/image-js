import type { Mask } from '../Mask.js';
import { borderIterator } from '../utils/borderIterator.js';

import { multipleFloodFill } from './multipleFloodFill.js';

export interface ClearBorderOptions {
  /**
   * Consider pixels connected by corners?
   * @default `false`
   */
  allowCorners?: boolean;
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Mask;
  /**
   * Clear either white or black area touching the border.
   * In practice it will invert the color.
   * @default `'white'`
   */
  color?: 'white' | 'black';
}
/**
 * Set the pixels connected to the border of the mask to zero. You can chose to allow corner connection of not with the `allowCorners` option.
 * @param mask - The mask to process.
 * @param options - Clear border options.
 * @returns The image with cleared borders.
 */
export function clearBorder(
  mask: Mask,
  options: ClearBorderOptions = {},
): Mask {
  const { allowCorners = false, out, color = 'white' } = options;
  return multipleFloodFill(mask, {
    startPixels: borderIterator(mask),
    startPixelValue: color === 'white' ? 1 : 0,
    newPixelValue: color === 'white' ? 0 : 1,
    allowCorners,
    out,
  });
}
