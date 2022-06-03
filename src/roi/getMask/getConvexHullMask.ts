// @ts-expect-error Waiting for migration to TS of the package
import mcch from 'monotone-chain-convex-hull';

import { Mask } from '../../Mask';
import { Roi } from '../Roi';

export interface ConvexHullMaskOptions {
  filled?: boolean;
}

/**
 * Create a mask with the pixels on the border of the ROI set to true.
 *
 * @param roi - The ROI to generate a mask for.
 * @param options - Get convex Hull mask options.
 * @returns The ROI mask.
 */
export function getConvexHullMask(
  roi: Roi,
  options: ConvexHullMaskOptions,
): Mask {
  const { filled = false } = options;
  const borderPoints = roi.getBorderPoints();
  // todo: use draw functions on mask to convert the vertices into a polygon
  return mcch(borderPoints);
}
