import type { Point } from './points.js';

export interface Line {
  /**
   * Line slope.
   */
  a: number;
  /**
   * Line y-intercept.
   */
  b: number;
  /**
   * Line is vertical.
   */
  vertical: boolean;
}

/**
 * Compute the length of a segment defined by two points.
 * @param p1 - First point.
 * @param p2 - Second point.
 * @returns Length of the segment.
 */
export function getLineLength(p1: Point, p2: Point): number {
  return Math.hypot(p1.column - p2.column, p1.row - p2.row);
}
