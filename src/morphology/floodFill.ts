import { Mask } from '..';
import { maskToOutputMask } from '../utils/getOutputImage';

export interface FloodFillOptions {
  /**
   * Consider pixels connected by corners?
   */
  allowCorners?: boolean;
  /**
   * Image to which the inverted image has to be put.
   */
  out?: Mask;
}

/**
 * Fill holes in regions of interest.
 *
 * @param mask - Mask to process.
 * @param options - Flood fill options.
 * @returns The filled mask.
 */
export function floodFill(mask: Mask, options: FloodFillOptions = {}): Mask {
  let { allowCorners = false } = options;

  let newImage = maskToOutputMask(mask, options);

  let inverted = mask.invert();
  let cleared = inverted.clearBorder({ allowCorners });

  return newImage.or(cleared);
}
