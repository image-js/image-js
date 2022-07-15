import { difference, dot, normalize, Point } from './points';

/**
 * Convert radians to degrees
 *
 * @param radians - Angle in radians.
 * @returns  Angle in degrees.
 */
export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Returns the angle between 3 points. The first one is the point where the angle is.
 *
 * @param origin - Origin where the angle has to be measured.
 * @param p1 - First point.
 * @param p2 - Second point.
 * @returns The angle in radians.
 */
export function angle(origin: Point, p1: Point, p2: Point): number {
  let v1 = normalize(difference(p1, origin));
  let v2 = normalize(difference(p2, origin));
  let dotProduct = dot(v1, v2);
  // TODO this code is not correct because it may return the opposite angle
  return Math.acos(dotProduct);
}
