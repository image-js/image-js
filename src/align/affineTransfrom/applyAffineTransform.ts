import type { ModelFunction } from 'ml-ransac';

import type { Point } from '../../geometry/index.js';

/**
 * Apply a given transform to a set of points.
 * @param points - Points to process.
 * @param model - The transformation function.
 * @returns The transformed points.
 */
export function applyAffineTransfom(
  points: Point[],
  model: ModelFunction<Point>,
): Point[] {
  const result: Point[] = [];

  for (const point of points) {
    const transformed = model(point);
    const roundedPoint = {
      row: Math.round(transformed.row),
      column: Math.round(transformed.column),
    };
    result.push(roundedPoint);
  }

  return result;
}
