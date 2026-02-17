import { EigenvalueDecomposition, Matrix, WrapperMatrix1D } from 'ml-matrix';

import type { Image } from '../../Image.ts';
import type { Point } from '../../index_full.ts';
import { SOBEL_X, SOBEL_Y } from '../../utils/constants/kernels.js';

export interface GetShiTomasiScoreOptions {
  qualityLevel?: number;
  /**
   * Size of the window to compute the Harris score.
   * Should be an odd number so that the window can be centered on the corner.
   * @default `7`
   */
  windowSize?: number;
}

/**
 * Get the Shi-Tomasi score of a corner. The idea is similar to Harris score, but it removes constant to calculate the score and just takes the minimum from two eigenvalues.
 * We distinguish 3 cases:
 * - the score is highly negative: you have an edge
 * - the absolute value of the score is small: the region is flat
 * - the score is highly positive: you have a corner.
 * @param image - Image to which the corner belongs. It must be a greyscale image with only one channel.
 * @param origin - Center of the window, where the corner should be.
 * @param options  - Get Shi-Tomasi score options.
 * @returns The Shi-Tomasi score.
 */
export function getShiTomasiScore(
  image: Image,
  origin: Point,
  options: GetShiTomasiScoreOptions = {},
): number {
  const { windowSize = 7 } = options;

  if (!(windowSize % 2)) {
    throw new TypeError('windowSize must be an odd integer');
  }

  const cropOrigin = {
    row: origin.row - (windowSize - 1) / 2,
    column: origin.column - (windowSize - 1) / 2,
  };
  const window = image.crop({
    origin: cropOrigin,
    width: windowSize,
    height: windowSize,
  });
  const xDerivative = window.gradientFilter({ kernelX: SOBEL_X });
  const yDerivative = window.gradientFilter({ kernelY: SOBEL_Y });

  const xMatrix = new WrapperMatrix1D(xDerivative.getRawImage().data, {
    rows: xDerivative.height,
  });
  const yMatrix = new WrapperMatrix1D(yDerivative.getRawImage().data, {
    rows: yDerivative.height,
  });

  const xx = xMatrix.mmul(xMatrix);
  const xy = yMatrix.mmul(xMatrix);
  const yy = yMatrix.mmul(yMatrix);

  const xxSum = xx.sum();
  const xySum = xy.sum();
  const yySum = yy.sum();

  const structureTensor = new Matrix([
    [xxSum, xySum],
    [xySum, yySum],
  ]);

  const eigenValues = new EigenvalueDecomposition(structureTensor)
    .realEigenvalues;

  return Math.min(eigenValues[0], eigenValues[1]);
}
