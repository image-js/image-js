import { getLineLength } from './lines.js';
import type { Point } from './points.js';

/**
 * Compute the perimeter of a polygon.
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

/**
 * Compute the area of a polygon.
 * Based on the algorithm described on
 * @see {@link https://web.archive.org/web/20100405070507/http://valis.cs.uiuc.edu/~sariel/research/CG/compgeom/msg00831.html}
 * @param points - Array of polygon vertices.
 * @returns The area.
 */
export function getPolygonArea(points: Point[]): number {
  let area = 0;
  for (let current = 0; current < points.length; current++) {
    const next = (current + 1) % points.length;
    area += points[current].column * points[next].row;
    area -= points[current].row * points[next].column;
  }
  return Math.abs(area / 2);
}
