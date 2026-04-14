import type { Mask } from '../Mask.js';
import type { Point } from '../utils/geometry/points.js';

import { getBorderPointsMoore } from './getBorderPointsMoore.js';
import { getBorderPointsPavlidis } from './getBorderPointsPavlidis.ts';
import type { GetBorderPointsOptions } from './maskAnalysis.types.js';

/**
 * Return an array with the coordinates of the pixels that are on the border of the mask.
 * The reference is the top-left corner of the ROI.
 * @param mask - Mask to process.
 * @param options - Get border points options.
 * @returns The array of border pixels.
 */
export function getBorderPoints(
  mask: Mask,
  options: GetBorderPointsOptions = {},
): Point[] {
  const { innerBorders = false, allowCorners = false } = options;

  if (!allowCorners) {
    return getBorderPointsMoore(mask, { innerBorders });
  } else {
    return getBorderPointsPavlidis(mask, { innerBorders });
  }
}
