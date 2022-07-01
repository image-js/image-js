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
  return { column: point.column / length, row: point.row / length };
}

/**
 * Rotate an array of points by an angle in radians.
 * The rotation is clockwise and the reference is (0,0).
 *
 * @param radians - Angle in radians.
 * @param points - Source points
 * @returns The points after rotation.
 */
export function rotate(radians: number, points: readonly Point[]): Point[] {
  let result: Point[] = [];
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  for (let point of points) {
    result.push({
      column: cos * point.column - sin * point.row,
      row: sin * point.column + cos * point.row,
    });
  }
  return result;
}

/**
 * Dot product of 2 points assuming vectors starting from (0,0).
 *
 * @param p1 - First point.
 * @param p2 - Second point.
 * @returns Dot product between the two vectors.
 */
export function dot(p1: Point, p2: Point) {
  return p1.column * p2.column + p1.row * p2.row;
}

/**
 * Returns the angle between 3 points. The first one is the point where the angle is.
 *
 * @param origin - Origin where the angle has to be measured.
 * @param p1 - First point.
 * @param p2 - Second point.
 * @returns The angle in radians.
 */
export function angle(origin: Point, p1: Point, p2: Point): number {
  let v1 = normalize(difference(p1, origin));
  let v2 = normalize(difference(p2, origin));
  let dotProduct = dot(v1, v2);
  // TODO this code is not correct because it may return the opposite angle
  return Math.acos(dotProduct);
}
