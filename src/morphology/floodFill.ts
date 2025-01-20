import type { Mask } from '../Mask.js';
import type { Point } from '../geometry/index.js';
import { getIndex } from '../utils/getIndex.js';

import { multipleFloodFill } from './multipleFloodFill.js';

export interface FloodFillOptions {
  /**
   * Origin for the algorithm relative to the top-left corner of the image.
   * @default `{row: 0, column: 0}`
   */
  origin?: Point;
  /**
   * Consider pixels connected by corners?
   * @default `false`
   */
  allowCorners?: boolean;
  /**
   * Specify the output image.
   */
  out?: Mask;
}

/**
 * Apply a flood fill algorithm to an image.
 * @param mask - Mask to process.
 * @param options - Flood fill options.
 * @returns The filled mask.
 */
export function floodFill(mask: Mask, options: FloodFillOptions = {}): Mask {
  const { origin = { row: 0, column: 0 }, allowCorners = false, out } = options;
  const startPixel = getIndex(origin.column, origin.row, mask);
  return multipleFloodFill(mask, {
    startPixels: [startPixel],
    allowCorners,
    out,
  });
}
