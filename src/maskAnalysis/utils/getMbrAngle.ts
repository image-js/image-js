import type { Point } from '../../geometry/index.js';
import { toDegrees } from '../../utils/geometry/angles.js';

import { getAngle } from './getAngle.js';

const leftFirst = (mbrPoint1: Point, mbrPoint2: Point) =>
  mbrPoint1.column <= mbrPoint2.column ? -1 : 1;
const topFirst = (mbrPoint1: Point, mbrPoint2: Point) =>
  mbrPoint1.row >= mbrPoint2.row ? -1 : 1;

/**
 * Get the anti-clockwise angle in degrees between the MBR and a horizontal line.
 * @param mbr - MBR to process.
 * @returns The angle in degrees.
 */
export function getMbrAngle(mbr: readonly Point[]): number {
  const sorted = mbr.slice();
  sorted.sort(leftFirst);
  const left = sorted.slice(0, 2);
  const right = sorted.slice(2, 4);
  left.sort(topFirst);
  right.sort(topFirst);
  const topLeft = left[0];
  const topRight = right[0];
  return -toDegrees(getAngle(topLeft, topRight));
}
