/**
 * Coordinates of a point in an image with the top-left corner being the reference point. The point is a [column, row] array.
 */
export type ArrayPoint = [column: number, row: number];

/**
 * Coordinates of a point in an image with the top-left corner being the reference point.
 */ export interface Point {
  /**
   * Point row.
   *
   */
  row: number;
  /**
   * Point column.
   *
   */
  column: number;
}

/**
 * Calculates a new point that is the difference p1 - p2
 *
 * @param p1 - First point.
 * @param p2 - Second Point.
 * @returns Difference between the two points.
 */
export function difference(p1: Point, p2: Point) {
  return { column: p1.column - p2.column, row: p1.row - p2.row };
}

/**
 * Normalize a point (more precisely the vector from the origin to the point).
 *
 * @param point - Point to normalise.
 * @returns - Normalised point.
 */
export function normalize(point: Point) {
  let length = Math.sqrt(point.column ** 2 + point.row ** 2);
  return [point.column / length, point.row / length];
}

/**
 * Rotate an array of points by an angle in radians (counter-clockwise).
 *
 * @param radians - Angle in radians.
 * @param points - Source points
 * @returns The points after rotation.
 */
export function rotate(radians: number, points: Point[]): Point[] {
  let result: Point[] = [];
  let cos = Math.cos(radians);
  let sin = Math.sin(radians);
  for (let i = 0; i < result.length; ++i) {
    result[i] = {
      column: cos * points[i].column - sin * points[i].row,
      row: sin * points[i].column + cos * points[i].row,
    };
  }
  return result;
}
