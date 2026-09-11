import { EigenvalueDecomposition, Matrix } from 'ml-matrix';

import type { Image } from '../../Image.ts';
import type { Point } from '../../index_full.ts';
import checkProcessable from '../../utils/validators/checkProcessable.ts';

/**
 * A function that calculates eigenvalues to calculate feature score for Harris and Shi-Tomasi algorithms.
 * @param image - Single-channel image to compute the eigen values on.
 * @param origin - Center of the window, where the corner should be.
 * @param windowSize - Size of the window, where data should be scanned.
 * @returns Array of two eigenvalues.
 */
export function getEigenvaluesForScore(
  image: Image,
  origin: Point,
  windowSize = 5,
) {
  if (!(windowSize % 2)) {
    throw new TypeError('windowSize must be an odd integer');
  }
  checkProcessable(image, { channels: 1 });
  const windowRadius = (windowSize - 1) / 2;
  const padded = windowSize + 2;
  const startRow = origin.row - windowRadius - 1;
  const startColumn = origin.column - windowRadius - 1;
  if (!Number.isInteger(startRow) || !Number.isInteger(startColumn)) {
    throw new TypeError('Origin row and column must be integers');
  }
  const { width, height, data } = image.getRawImage();
  if (
    startRow < 0 ||
    startColumn < 0 ||
    startRow + padded > height ||
    startColumn + padded > width
  ) {
    throw new RangeError(
      `Size is out of range (row:${startRow}, column:${startColumn}, width:${padded}, height:${padded})`,
    );
  }

  let xxSum = 0;
  let xySum = 0;
  let yySum = 0;
  for (let i = 1; i < padded - 1; i++) {
    const rowOffset = (startRow + i) * width + startColumn;
    for (let j = 1; j < padded - 1; j++) {
      const index = rowOffset + j;
      const topLeft = data[index - width - 1];
      const top = data[index - width];
      const topRight = data[index - width + 1];
      const left = data[index - 1];
      const right = data[index + 1];
      const bottomLeft = data[index + width - 1];
      const bottom = data[index + width];
      const bottomRight = data[index + width + 1];

      // SOBEL X
      const gx =
        -topLeft + topRight - 2 * left + 2 * right - bottomLeft + bottomRight;

      // SOBEL Y
      const gy =
        -topLeft - 2 * top - topRight + bottomLeft + 2 * bottom + bottomRight;

      xxSum += gx * gx;
      xySum += gx * gy;
      yySum += gy * gy;
    }
  }

  const structureTensor = new Matrix([
    [xxSum, xySum],
    [xySum, yySum],
  ]);

  return new EigenvalueDecomposition(structureTensor).realEigenvalues;
}
