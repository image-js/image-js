import Matrix from 'ml-matrix';

import { Point } from './getMatrixFromPoints';

/**
 * Convert matrix to points.
 *
 * @param matrix - Matrix to process.
 * @returns Array of points.
 */
export function getPointsFromMatrix(matrix: Matrix): Point[] {
  const result: Point[] = [];
  for (let i = 0; i < matrix.columns; i++) {
    result.push({ row: matrix.get(1, i), column: matrix.get(0, i) });
  }

  return result;
}
