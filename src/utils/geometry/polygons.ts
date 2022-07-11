import { getLineLength } from './lines';
import { Point } from './points';

/**
 * Compute the perimeter of a polygon.
 *
 * @param points - Array of polygon vertices.
 * @returns The perimeter.
 */
export function getPolygonPerimeter(points: Point[]): number {
  let perimeter = 0;
  for (let i = 0; i < points.length; i++) {
    perimeter += getLineLength(points[(i + 1) % points.length], points[i]);
  }
  return perimeter;
}
