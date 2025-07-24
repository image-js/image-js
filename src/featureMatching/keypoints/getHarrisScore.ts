import { EigenvalueDecomposition, Matrix, WrapperMatrix1D } from 'ml-matrix';

import type { Image } from '../../Image.js';
import type { Point } from '../../geometry/index.js';
import { SOBEL_X, SOBEL_Y } from '../../utils/constants/kernels.js';
import type { GetHarrisScoreOptions } from '../featureMatching.types.js';

/**
 * Get the Harris score of a corner. The idea behind the algorithm is that a
 * slight shift of a window around a corner along x and y shoud result in
 * a very different image.
 *
 * We distinguish 3 cases:
 * - the score is highly negative: you have an edge
 * - the abolute value of the score is small: the region is flat
 * - the score is highly positive: you have a corner.
 * @see {@link https://en.wikipedia.org/wiki/Harris_corner_detector}
 * @param image - Image to which the corner belongs. It must be a greyscale image with only one channel.
 * @param origin - Center of the window, where the corner should be.
 * @param options - Get Harris score options.
 * @returns The Harris score.
 */
export function getHarrisScore(
  image: Image,
  origin: Point,
  options: GetHarrisScoreOptions = {},
): number {
  const { windowSize = 7, harrisConstant = 0.04 } = options;

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

  return (
    eigenValues[0] * eigenValues[1] -
    harrisConstant * (eigenValues[0] + eigenValues[1]) ** 2
  );
}
