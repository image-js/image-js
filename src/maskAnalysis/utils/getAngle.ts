import { difference, normalize, Point } from '../../utils/geometry/points';

/**
 * The angle that allows to make the line going through p1 and p2 horizontal.
 * This is an optimized version because it assumes that one of the points is on the line y=0.
 *
 * @param p1 - First point.
 * @param p2 - Second point.
 * @returns Rotation angle to make the line horizontal.
 */
export function getAngle(p1: Point, p2: Point): number {
  let diff = difference(p2, p1);
  let vector = normalize(diff);
  let angle = Math.acos(vector.column);
  if (vector.row < 0) return -angle;
  return angle;
}
