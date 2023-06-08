import { ModelFunction } from '../..';

import { Point } from './getMatrixFromPoints';

/**
 * Apply a given transform to a set of points.
 *
 * @param points - Points to process.
 * @param model - The transformation function.
 * @returns The transformed points.
 */
export function applyAffineTransfom(
  points: Point[],
  model: ModelFunction<Point>,
): Point[] {
  let result: Point[] = [];

  for (let point of points) {
    const transformed = model(point);
    const roundedPoint = {
      row: Math.round(transformed.row),
      column: Math.round(transformed.column),
    };
    result.push(roundedPoint);
  }

  return result;
}
