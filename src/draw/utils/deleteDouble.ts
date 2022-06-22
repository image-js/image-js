import { Point } from '../drawLineOnMask';

/**
 * Delete double in polygon points.
 *
 * @param points - Polygon points array.
 * @returns Cleaned polygon points array.
 */
export function deleteDouble(points: Point[]): Point[] {
  const finalPoints: Point[] = [];
  for (let i = 0; i < points.length; i++) {
    if (
      points[i].column === points[(i + 1) % points.length].column &&
      points[i].row === points[(i + 1) % points.length].row
    ) {
      continue;
    } else if (
      points[i].column ===
        points[(i - 1 + points.length) % points.length].column &&
      points[i].row === points[(i - 1 + points.length) % points.length].row
    ) {
      continue;
    } else if (
      points[(i + 1) % points.length].column ===
        points[(i - 1 + points.length) % points.length].column &&
      points[(i - 1 + points.length) % points.length].row ===
        points[(i + 1) % points.length].row
    ) {
      continue; // we don't consider newImage point only
    } else {
      finalPoints.push(points[i]);
    }
  }
  return finalPoints;
}
