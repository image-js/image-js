import type { ArrayPoint, Point } from './geometry/points.js';

/**
 * Convert object points into array points.
 * @param points - Array of points as objects.
 * @returns Array of points as arrays.
 */
export function arrayPointsToObjects(points: Point[]): ArrayPoint[] {
  const result: ArrayPoint[] = [];

  for (const point of points) {
    result.push([point.column, point.row]);
  }
  return result;
}
