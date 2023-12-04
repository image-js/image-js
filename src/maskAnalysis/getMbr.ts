import { Mask } from '../Mask';

import { Mbr } from './maskAnalysis.types';
import { getExtendedBorderPoints } from './utils/getExtendedBorderPoints';
import { getMbrFromPoints } from './utils/getMbrFromPoints';
import { monotoneChainConvexHull } from './utils/monotoneChainConvexHull';

/**
 * Get the four corners of the minimum bounding rectangle of an ROI.
 * @param mask - The ROI to process.
 * @returns The array of corners.
 */
export function getMbr(mask: Mask): Mbr {
  const vertices = monotoneChainConvexHull(getExtendedBorderPoints(mask));

  return getMbrFromPoints(vertices);
}
