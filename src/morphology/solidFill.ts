import type { Mask } from '../Mask.js';
import { maskToOutputMask } from '../utils/getOutputImage.js';

export interface SolidFillOptions {
  /**
   * Consider pixels connected by corners?
   * @default `false`
   */
  allowCorners?: boolean;
  /**
   * Image to which the inverted image has to be put.
   */
  out?: Mask;
}

/**
 * Fill holes in regions of interest.
 * @param mask - Mask to process.
 * @param options - Flood fill options.
 * @returns The filled mask.
 */
export function solidFill(mask: Mask, options: SolidFillOptions = {}): Mask {
  const { allowCorners = false } = options;

  const newImage = maskToOutputMask(mask, options, { clone: true });
  const inverted = mask.invert();
  const cleared = inverted.clearBorder({ allowCorners });
  return newImage.or(cleared, { out: newImage });
}
