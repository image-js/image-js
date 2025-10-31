/**
 * Coordinates of a point in an image with the top-left corner being the reference point. The point is a [column, row] array.
 */
export type ArrayPoint = [column: number, row: number];

/**
 * Coordinates of a point in an image with the top-left corner being the reference point.
 */
export interface Point {
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
 * Calculates a new point that is the difference p1 - p2.
 * @param p1 - First point.
 * @param p2 - Second Point.
 * @returns Difference between the two points.
 */
export function difference(p1: Point, p2: Point): Point {
  return { column: p1.column - p2.column, row: p1.row - p2.row };
}

/**
 * Calculates a new point that is the sum p1 + p2.
 * @param p1 - First point.
 * @param p2 - Second Point.
 * @returns Sum of the two points.
 */
export function sum(p1: Point, p2: Point): Point {
  return { column: p1.column + p2.column, row: p1.row + p2.row };
}

/**
 * Normalize a point (more precisely the vector from the origin to the point).
 * @param point - Point to normalize.
 * @returns - Normalized point.
 */
export function normalize(point: Point): Point {
  const length = Math.hypot(point.column, point.row);
  return { column: point.column / length, row: point.row / length };
}

/**
 * Rotate an array of points by an angle in radians.
 * The rotation is clockwise and the reference is (0,0).
 * @param radians - Angle in radians.
 * @param points - Source points.
 * @returns The points after rotation.
 */
export function rotate(radians: number, points: readonly Point[]): Point[] {
  const results: Point[] = [];
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  for (const point of points) {
    results.push({
      column: cos * point.column - sin * point.row,
      row: sin * point.column + cos * point.row,
    });
  }
  return results;
}

/**
 * Dot product of 2 points assuming vectors starting from (0,0).
 * @param p1 - First point.
 * @param p2 - Second point.
 * @returns Dot product between the two vectors.
 */
export function dot(p1: Point, p2: Point) {
  return p1.column * p2.column + p1.row * p2.row;
}

/**
 * Round the coordinates of the point.
 * @param point - The point.
 * @returns Rounded coordinates of the point.
 */
export function round(point: Point): Point {
  return { column: Math.round(point.column), row: Math.round(point.row) };
}

/**
 * Sort an array of points by column then row.
 * @param points - Array of points to sort.
 * @returns Sorted points.
 */
export function sortByColumnRow(points: Point[]): Point[] {
  const sortedPoints = points.slice();
  sortedPoints.sort((point1, point2) => {
    if (point1.column < point2.column) return -1;
    if (point1.column > point2.column) return 1;
    return point1.row - point2.row;
  });
  return sortedPoints;
}
