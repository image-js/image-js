import { circle } from 'bresenham-zingl';

import { Point } from '../geometry';

/**
 * Get the coordinates of the points on a circle. The reference is the center of the circle.
 * Caution: the points are not sorted.
 *
 * @param radius - Radius of the circle.
 * @returns The coordinates of the points on a circle of given diameter.
 */
export function getCirclePoints(radius: number): Point[] {
  let circlePoints: Point[] = [];

  circle(radius, radius, radius, (column: number, row: number) => {
    circlePoints.push({ row: row - radius, column: column - radius });
  });

  return circlePoints;
}

/**
 * Get the coordinates of the points that are on right, bottom, left and top at a given radius. The reference is the center of the circle.
 * First point is the most on the right, then points are in clockwise order.
 *
 * @param radius - Radius of the circle.
 * @returns The coordinates of the compass points.
 */
export function getCompassPoints(radius: number): Point[] {
  let circlePoints: Point[] = [];

  circle(radius, radius, radius, (column: number, row: number) => {
    circlePoints.push({ row: row - radius, column: column - radius });
  });

  return [
    { row: 0, column: radius },
    { row: radius, column: 0 },
    { row: 0, column: -radius },
    { row: -radius, column: 0 },
  ];
}
