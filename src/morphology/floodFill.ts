import { Mask } from '..';
import { getIndex } from '../utils/getIndex';

import { multipleFloodFill } from './multipleFloodFill';

export interface FloodFillOptions {
  /**
   * Row coordinate of the starting point for the algorithm.
   *
   * @default 0
   */
  row?: number;
  /**
   * Column coordinate of the starting point for the algorithm.
   *
   * @default 0
   */
  column?: number;
  /**
   * Consider pixels connected by corners?
   *
   * @default false
   */
  allowCorners?: boolean;
  /**
   * Specify the output image.
   */
  out?: Mask;
}

/**
 * Apply a flood fill algorithm to an image.
 *
 * @param mask - Mask to process.
 * @param options - Flood fill options.
 * @returns The filled mask.
 */
export function floodFill(mask: Mask, options: FloodFillOptions = {}): Mask {
  let { row = 0, column = 0, allowCorners = false, out } = options;
  const startPixel = getIndex(column, row, mask);
  return multipleFloodFill(mask, {
    startPixels: [startPixel],
    allowCorners,
    out,
  });
}
