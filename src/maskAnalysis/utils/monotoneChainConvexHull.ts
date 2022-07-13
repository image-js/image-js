import { Point } from '../../utils/geometry/points';

interface McchOptions {
  /**
   * Whether the input points are already sorted or not (sort by column and then row).
   *
   * @default false
   */
  sorted?: boolean;
}

/**
 * Computes the convex hull of a binary image using Andrew's Monotone Chain Algorithm
 * http://www.algorithmist.com/index.php/Monotone_Chain_Convex_Hull
 *
 * @param points - An array of points.
 * @param options - MCCH Algorithm options.
 * @returns Coordinates of the convex hull in clockwise order.
 */
export function monotoneChainConvexHull(
  points: Point[],
  options: McchOptions = {},
): Point[] {
  const { sorted = false } = options;
  if (!sorted) {
    points = points.slice().sort(byXThenY);
  }

  const n = points.length;
  const result = new Array(n * 2);
  let k = 0;

  for (let i = 0; i < n; i++) {
    const point = points[i];
    while (k >= 2 && cw(result[k - 2], result[k - 1], point) <= 0) {
      k--;
    }
    result[k++] = point;
  }

  const t = k + 1;
  for (let i = n - 2; i >= 0; i--) {
    const point = points[i];
    while (k >= t && cw(result[k - 2], result[k - 1], point) <= 0) {
      k--;
    }
    result[k++] = point;
  }

  return result.slice(0, k - 1);
}

function cw(p1: Point, p2: Point, p3: Point) {
  return (
    (p2.row - p1.row) * (p3.column - p1.column) -
    (p2.column - p1.column) * (p3.row - p1.row)
  );
}

function byXThenY(point1: Point, point2: Point) {
  if (point1.column === point2.column) {
    return point1.row - point2.row;
  }
  return point1.column - point2.column;
}

// 0 -> column, 1 -> row
