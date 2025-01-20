import { Matrix } from 'ml-matrix';

import type { Point } from '../../geometry/index.js';

/**
 * Convert row/column points to a matrix.
 * Last row is padded with **ones** (ignore third dimension).
 * @param points - Points to process.
 * @returns The matrix.
 */
export function getMatrixFromPoints(points: Point[]): Matrix {
  const matrix = new Matrix(3, points.length);
  for (let i = 0; i < points.length; i++) {
    matrix.set(0, i, points[i].column);
    matrix.set(1, i, points[i].row);
    matrix.set(2, i, 1);
  }

  return matrix;
}
