import type { Point } from '../../utils/geometry/points.js';
import { difference, normalize } from '../../utils/geometry/points.js';

/**
 * The angle in radians of a vector relatively to the x axis.
 * The angle is positive in the clockwise direction.
 * This is an optimized version because it assumes that one of
 * the points is on the line y = 0.
 * @param p1 - First point.
 * @param p2 - Second point.
 * @returns Rotation angle in radians to make the line horizontal. -π <= angle <= π.
 */
export function getAngle(p1: Point, p2: Point): number {
  const diff = difference(p2, p1);
  const vector = normalize(diff);
  const angle = Math.acos(vector.column);
  if (vector.row < 0) return -angle;
  return angle;
}

/**
 * Compute the clockwise angle in radians between the x-axis and the segment p1-p2.
 * @param p1 - First point.
 * @param p2 - Second point.
 * @returns Clockwise angle between x-axis and the segment.
 */
export function getClockwiseAngle(p1: Point, p2: Point): number {
  const diff = difference(p2, p1);
  const vector = normalize(diff);
  const atan = -Math.atan(vector.row / vector.column);
  if (vector.column < 0) {
    if (vector.row < 0) {
      return atan - Math.PI;
    } else {
      return atan + Math.PI;
    }
  } else {
    return atan;
  }
}
