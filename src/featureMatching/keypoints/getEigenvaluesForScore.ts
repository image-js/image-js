import type { Image } from '../../Image.ts';
import { rawDirectConvolution } from '../../filters/convolution.ts';
import type { Point } from '../../index_full.ts';
import { SOBEL_X, SOBEL_Y } from '../../utils/constants/kernels.js';

/**
 * A function that calculates eigenvalues to calculate feature score for Harris and Shi-Tomasi algorithms.
 * @param image - Image take data from.
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
  const kernelRadius = (SOBEL_X.length - 1) / 2;
  const half = (windowSize - 1) / 2;
  const padded = windowSize + 2 * kernelRadius;
  const cropOrigin = {
    row: origin.row - half - kernelRadius,
    column: origin.column - half - kernelRadius,
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

  const trace = xxSum + yySum;
  const det = xxSum * yySum - xySum * xySum;
  const disc = Math.sqrt((trace * trace) / 4 - det);

  const lambda1 = trace / 2 + disc;
  const lambda2 = trace / 2 - disc;

  return [lambda1, lambda2];
}
