import type { Image } from '../../Image.ts';
import type { Point } from '../../index_full.ts';
import { EigenvalueDecomposition, Matrix, WrapperMatrix1D } from 'ml-matrix';
import { SOBEL_X, SOBEL_Y } from '../../utils/constants/kernels.js';

/**
 * A function that uses
 * @param image
 * @param origin
 * @param windowSize
 * @returns
 */
export function getEigenvaluesForScore(
  image: Image,
  origin: Point,
  windowSize = 7,
) {
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

  return new EigenvalueDecomposition(structureTensor).realEigenvalues;
}
