import { ColorDepth, IJS } from '..';
import { BorderType } from '../utils/interpolateBorder';
import {
  PREWITT_X,
  PREWITT_Y,
  SCHARR_X,
  SCHARR_Y,
  SOBEL_X,
  SOBEL_Y,
} from '../utils/constants/kernels';

export enum DerivativeFilters {
  SOBEL = 'SOBEL',
  SCHARR = 'SCHARR',
  PREWITT = 'PREWITT',
  // todo: handle even sized kernels to implement Roberts' filter
  // for 2x2 matrices, the current pixel corresponds to the top-left
  //  ROBERTS = 'ROBERTS',
}

export interface DerivativeFilterOptions {
  /**
   * Algorithm to use for the derivative filter.
   */
  filter?: DerivativeFilters;
  /**
   * Specify how the borders should be handled.
   *
   * @default BorderType.REPLICATE
   */
  borderType?: BorderType;
  /**
   * Value of the border if BorderType is CONSTANT.
   *
   * @default 0
   */
  borderValue?: number;
  /**
   * Specify the bitDepth of the resulting image.
   *
   * @default image.bitDepth
   */
  bitDepth?: ColorDepth;
}

/**
 * Apply a derivative filter to an image.
 *
 * @param image - Image to process.
 * @param options - Derivative filter options.
 * @returns The processed image.
 */
export function derivativeFilter(
  image: IJS,
  options: DerivativeFilterOptions = {},
): IJS {
  const { filter = DerivativeFilters.SOBEL } = options;
  let kernelX = SOBEL_X;
  let kernelY = SOBEL_Y;

  switch (filter) {
    case DerivativeFilters.SOBEL:
      break;
    case DerivativeFilters.SCHARR:
      kernelX = SCHARR_X;
      kernelY = SCHARR_Y;
      break;
    case DerivativeFilters.PREWITT:
      kernelX = PREWITT_X;
      kernelY = PREWITT_Y;
      break;
    default:
      throw new Error('derivativeFilter: unrecognised derivative filter.');
  }

  return image.gradientFilter({ kernelX, kernelY, ...options });
}
