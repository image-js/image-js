import { EigenvalueDecomposition, Matrix } from 'ml-matrix';

import type { Image } from '../../Image.ts';
import { rawDirectConvolution } from '../../filters/convolution.ts';
import type { Point } from '../../index_full.ts';
import { SOBEL_X, SOBEL_Y } from '../../utils/constants/kernels.js';
/**
 * A function that calculates eigenvalues to calculate feature score for Harris and Shi-Tomasi algorithms.
 * @param image - Image take data from.
 * @param origin - Center of the window, where the corner should be.
 * @param cropSize - Size of the window, where data should be scanned.
 * @returns Array of two eigenvalues.
 */
export function getEigenvaluesForScore(
  image: Image,
  origin: Point,
  cropSize = 5,
) {
  if (!(cropSize % 2)) {
    throw new TypeError('windowSize must be an odd integer');
  }
  const kernelRadius = (SOBEL_X.length - 1) / 2;
  const windowRadius = (cropSize - 1) / 2;
  const padded = cropSize + 2 * kernelRadius;
  const cropOrigin = {
    row: origin.row - windowRadius - kernelRadius,
    column: origin.column - windowRadius - kernelRadius,
  };
  const window = image.crop({
    origin: cropOrigin,
    width: padded,
    height: padded,
  });
  const xDerivative = rawDirectConvolution(window, SOBEL_X);
  const yDerivative = rawDirectConvolution(window, SOBEL_Y);

  let xxSum = 0;
  let xySum = 0;
  let yySum = 0;

  for (let i = kernelRadius; i < window.height - kernelRadius; i++) {
    for (let j = kernelRadius; j < window.width - kernelRadius; j++) {
      const idx = i * window.width + j;
      const gx = xDerivative[idx];
      const gy = yDerivative[idx];
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
