import { Point } from './points';

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
 * Get the parameters of a line defined by two points.
 *
 * @param p1 - First line point.
 * @param p2 - Second line point.
 * @returns Line between the points.
 */
export function lineBetweenTwoPoints(p1: Point, p2: Point): Line {
  if (p1.column === p2.column) {
    return { a: 0, b: p1.column, vertical: true }; // we store the x of the vertical line into b
  } else {
    const a = (p2.row - p1.row) / (p2.column - p1.column);
    const b = p1.row - a * p1.column;
    return { a, b, vertical: false };
  }
}

/**
 * Check if a point is on the right side of a line.
 *
 * @param point - Point.
 * @param line - Line.
 * @param height - Image height.
 * @returns Is the point on the right side of the line?
 */
export function isAtTheRightOfTheLine(
  point: Point,
  line: Line,
  height: number,
): boolean {
  const { row, column } = point;
  if (line.vertical) {
    return line.b <= column;
  } else if (line.a === 0) {
    return false;
  } else {
    const xLine = (row - line.b) / line.a;
    return xLine < column && xLine >= 0 && xLine <= height;
  }
}
