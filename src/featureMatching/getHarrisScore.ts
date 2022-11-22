import Matrix, { EigenvalueDecomposition, WrapperMatrix1D } from 'ml-matrix';

import { Image } from '../Image';
import { Point } from '../geometry';
import { SOBEL_X, SOBEL_Y } from '../utils/constants/kernels';

export interface GetHarrisScoreOptions {
  /**
   * Size of the window to compute the Harris score.
   * Should be an odd number so that the window can be centered on the corner.
   *
   * @default 7
   */
  windowSize: number;
  /**
   * Constant for the score computation. SHould be between 0.04 and 0.06.
   *
   * @default 0.04
   */
  harrisConstant: number;
}
/**
 * Get the Harris score of a corner. The idea behind the algorithm is that a
 * slight shift of a window around a corner along x and y shoud result in
 * a very different image.
 * https://en.wikipedia.org/wiki/Harris_corner_detector#:~:text=The%20Harris%20corner%20detector%20is,improvement%20of%20Moravec's%20corner%20detector.
 *
 * @param image - Image to which the corner belongs.
 * @param origin - Top-left corner of the
 * @param options - Get Harris score options.
 * @returns The Harris score.
 */
export function getHarrisScore(
  image: Image,
  origin: Point,
  options: GetHarrisScoreOptions,
): number {
  const { windowSize = 7, harrisConstant = 0.04 } = options;

  const window = image.crop({ origin, width: windowSize, height: windowSize });
  const xDerivative = window.gradientFilter({ kernelX: SOBEL_X });
  const yDerivative = window.gradientFilter({ kernelY: SOBEL_Y });

  const xMatrix = new WrapperMatrix1D(xDerivative.getRawImage().data, {
    rows: xDerivative.height,
  });
  const yMatrix = new WrapperMatrix1D(yDerivative.getRawImage().data, {
    rows: yDerivative.height,
  });

  const xx = xMatrix.mmul(xMatrix);
  const xy = xMatrix.mmul(yMatrix);
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
    harrisConstant * Math.pow(eigenValues[0] + eigenValues[1], 2)
  );
}
