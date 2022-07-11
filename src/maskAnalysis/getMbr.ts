import { Mask } from '../Mask';
import { Point } from '../utils/geometry/points';

import { getExtendedBorderPoints } from './utils/getExtendedBorderPoints';
import { getMbrFromPoints } from './utils/getMbrFromPoints';
import { monotoneChainConvexHull } from './utils/monotoneChainConvexHull';

/**
 * Get the four corners of the minimun bounding rectangle of an ROI.
 *
 * @param mask - The ROI to process.
 * @returns The array of corners.
 */
export function getMbr(mask: Mask): Point[] {
  const vertices = monotoneChainConvexHull(getExtendedBorderPoints(mask));

  return getMbrFromPoints(vertices);
}
