import { Mask } from '../Mask';
import { Point } from '../utils/geometry/points';

import { getExtendedBorderPoints } from './utils/getExtendedBorderPoints';
import { getMbrFromPoints } from './utils/getMbrFromPoints';
import { monotoneChainConvexHull } from './utils/monotoneChainConvexHull';

/**
 * Minimum bounding rectangle of a mask.
 */
export interface Mbr {
  /**
   * Vertices of the MBR in clockwise order.
   */
  points: Point[];
  /**
   * Perimeter of the MBR.
   */
  perimeter: number;
  /**
   * Surface of the MBR.
   */
  surface: number;
  /**
   * Width of the rectangle.
   */
  width: number;
  /**
   * Height of the rectangle.
   */
  height: number;
  /**
   * Angle between the rectangle and a horizontal line in radians.
   */
  angle: number;
  /**
   * Ratio between width and height.
   */
  aspectRatio: number;
}

/**
 * Get the four corners of the minimum bounding rectangle of an ROI.
 * @param mask - The ROI to process.
 * @returns The array of corners.
 */
export function getMbr(mask: Mask): Mbr {
  const vertices = monotoneChainConvexHull(getExtendedBorderPoints(mask));

  return getMbrFromPoints(vertices);
}
