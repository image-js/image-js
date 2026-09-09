import type { Mask } from '../Mask.ts';

import type { Mbr } from './maskAnalysis.types.ts';
import { getExtendedBorderPoints } from './utils/getExtendedBorderPoints.ts';
import { getMbrFromPoints } from './utils/getMbrFromPoints.ts';
import { monotoneChainConvexHull } from './utils/monotoneChainConvexHull.ts';

/**
 * Get the four corners of the minimum bounding rectangle of an ROI.
 * @param mask - The ROI to process.
 * @returns The array of corners.
 */
export function getMbr(mask: Mask): Mbr {
  const vertices = monotoneChainConvexHull(getExtendedBorderPoints(mask));

  return getMbrFromPoints(vertices);
}
