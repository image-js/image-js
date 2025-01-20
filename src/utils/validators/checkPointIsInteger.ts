import type { Point } from '../../geometry/index.js';

/**
 * Check that the coordinates of a point are integers.
 * @param point - Point to check.
 * @param name - Specify name of the point to include in the error message.
 */
export function checkPointIsInteger(point: Point, name = 'Point'): void {
  if (!Number.isInteger(point.row) || !Number.isInteger(point.column)) {
    throw new TypeError(`${name} row and column must be integers`);
  }
}
