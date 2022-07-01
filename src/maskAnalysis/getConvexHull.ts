import { Mask } from '../Mask';
import { Point } from '../utils/geometry/points';

import { monotoneChainConvexHull as mcch } from './utils/monotoneChainConvexHull';

/**
 * Get the vertices of the convex Hull polygon of a mask
 *
 * @param mask - Mask to process
 * @returns Array of the vertices of the convex Hull
 */
export function getConvexHull(mask: Mask): Point[] {
  const borderPoints = mask.getBorderPoints();
  return mcch(borderPoints);
}
