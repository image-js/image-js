import { circle, line } from 'bresenham-zingl';

import { deleteDuplicates } from '../../draw/utils/deleteDuplicates.js';
import type { Point } from '../../geometry/index.js';

import { sortByColumnRow } from './points.js';

/**
 * Get the coordinates of the points on a circle. The reference is the center of the circle.
 * The first point is the right one and they are then sorted clockwise.
 * @param radius - Radius of the circle.
 * @returns The coordinates of the points on a circle of given diameter.
 */
export function getCirclePoints(radius: number): Point[] {
  const circlePoints: Point[] = [];

  circle(radius, radius, radius, (column: number, row: number) => {
    circlePoints.push({ row: row - radius, column: column - radius });
  });

  const firstQuarter: Point[] = [];
  const secondQuarter: Point[] = [];
  const thirdQuarter: Point[] = [];
  const fourthQuarter: Point[] = [];

  for (let i = 0; i < circlePoints.length; i = i + 4) {
    firstQuarter.push(circlePoints[i % circlePoints.length]);
    secondQuarter.push(circlePoints[(i + 1) % circlePoints.length]);
    thirdQuarter.push(circlePoints[(i + 2) % circlePoints.length]);
    fourthQuarter.push(circlePoints[(i + 3) % circlePoints.length]);
  }
  return firstQuarter.concat(secondQuarter, thirdQuarter, fourthQuarter);
}

const zeroPoint: Point = { row: 0, column: 0 };

/**
 * Get the coordinates of the points in a circle of given radius. The points are sorted by column then row.
 * @param radius - Radius of the circle.
 * @param center - Center of the circle.
 * @returns The coordinates of the points in a circle of given radius.
 */
export function getFilledCirclePoints(
  radius: number,
  center: Point = zeroPoint,
): Point[] {
  const circlePoints: Point[] = [];

  if (radius === 0) {
    return [center];
  }
  if (radius === 1) {
    circlePoints.push(center);
  }
  circle(center.column, center.row, radius, (column: number, row: number) => {
    circlePoints.push({ row, column });

    if (column - 1 > center.column) {
      circlePoints.push(
        ...getLinePoints(
          { row, column: column - 1 },
          { row, column: center.column },
        ),
      );
    } else if (column + 1 < center.column) {
      circlePoints.push(
        ...getLinePoints(
          { row, column: column + 1 },
          { row, column: center.column },
        ),
      );
    }
  });

  const sorted = sortByColumnRow(circlePoints);

  return deleteDuplicates(sorted);
}

/**
 * Get the coordinates of the points on a line.
 * @param from - Starting point.
 * @param to - End point.
 * @returns The coordinates of the points on the line.
 */
export function getLinePoints(from: Point, to: Point): Point[] {
  const linePoints: Point[] = [];
  line(
    from.column,
    from.row,
    to.column,
    to.row,
    (column: number, row: number) => {
      linePoints.push({
        row,
        column,
      });
    },
  );

  return linePoints;
}

/**
 * Get the coordinates of the points that are on right, bottom, left and top at a given radius. The reference is the origin of the circle.
 * First point is the most on the right, then points are in clockwise order.
 * @param radius - Radius of the circle.
 * @returns The coordinates of the compass points.
 */
export function getCompassPoints(radius: number): Point[] {
  const circlePoints: Point[] = [];

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
