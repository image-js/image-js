import type { Point } from '../../geometry/index.js';

/**
 * Compute the distance between point 1 and point 2.
 * @param point1 - First point.
 * @param point2 - Second  point.
 * @returns Euclidean distance.
 */
export function getEuclideanDistance(point1: Point, point2: Point): number {
  return Math.hypot(point1.row - point2.row, point1.column - point2.column);
}
