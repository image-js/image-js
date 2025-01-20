import type { Mask } from '../Mask.js';

import type { Mbr } from './maskAnalysis.types.js';
import { getExtendedBorderPoints } from './utils/getExtendedBorderPoints.js';
import { getMbrFromPoints } from './utils/getMbrFromPoints.js';
import { monotoneChainConvexHull } from './utils/monotoneChainConvexHull.js';

/**
 * Get the four corners of the minimum bounding rectangle of an ROI.
 * @param mask - The ROI to process.
 * @returns The array of corners.
 */
export function getMbr(mask: Mask): Mbr {
  const vertices = monotoneChainConvexHull(getExtendedBorderPoints(mask));

  return getMbrFromPoints(vertices);
}
