import { circle } from 'bresenham-zingl';

import { Point } from '../geometry';

/**
 * Get the coordinates of the points on a circle. The reference is the center of the circle.
 * The first point is the right one and they are then sorted clockwise.
 *
 * @param radius - Radius of the circle.
 * @returns The coordinates of the points on a circle of given diameter.
 */
export function getCirclePoints(radius: number): Point[] {
  let circlePoints: Point[] = [];

  circle(radius, radius, radius, (column: number, row: number) => {
    circlePoints.push({ row: row - radius, column: column - radius });
  });

  let firstQuarter: Point[] = [];
  let secondQuarter: Point[] = [];
  let thirdQuarter: Point[] = [];
  let fourthQuarter: Point[] = [];

  for (let i = 0; i < circlePoints.length / 4; i++) {
    firstQuarter.push(circlePoints[(4 * i) % circlePoints.length]);
    secondQuarter.push(circlePoints[(4 * i + 1) % circlePoints.length]);
    thirdQuarter.push(circlePoints[(4 * i + 2) % circlePoints.length]);
    fourthQuarter.push(circlePoints[(4 * i + 3) % circlePoints.length]);
  }
  return firstQuarter.concat(secondQuarter, thirdQuarter, fourthQuarter);
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
