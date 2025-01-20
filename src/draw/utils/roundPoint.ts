import type { Point } from '../../geometry/index.js';

/**
 * Round a point to the nearest integer.
 * @param point - Point to round.
 * @returns The rounded point.
 */
export function roundPoint(point: Point): Point {
  return {
    row: Math.round(point.row),
    column: Math.round(point.column),
  };
}
