import { ColorDepth, Image } from '..';
import {
  PREWITT_X,
  PREWITT_Y,
  SCHARR_X,
  SCHARR_Y,
  SOBEL_X,
  SOBEL_Y,
} from '../utils/constants/kernels';
import type { BorderType } from '../utils/interpolateBorder';

export const DerivativeFilter = {
  SOBEL: 'sobel',
  SCHARR: 'scharr',
  PREWITT: 'prewitt',
  // todo: handle even sized kernels to implement Roberts' filter
  // for 2x2 matrices, the current pixel corresponds to the top-left
  //  ROBERTS = 'roberts',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DerivativeFilter =
  (typeof DerivativeFilter)[keyof typeof DerivativeFilter];

export interface DerivativeFilterOptions {
  /**
   * Algorithm to use for the derivative filter.
   *
   * @default SOBEL
   */
  filter?: DerivativeFilter;
  /**
   * Specify how the borders should be handled.
   *
   * @default 'replicate'
   */
  borderType?: BorderType;
  /**
   * Value of the border if BorderType is 'constant'.
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
  image: Image,
  options: DerivativeFilterOptions = {},
): Image {
  const { filter = 'sobel' } = options;
  let kernelX = SOBEL_X;
  let kernelY = SOBEL_Y;

  switch (filter) {
    case 'sobel':
      break;
    case 'scharr':
      kernelX = SCHARR_X;
      kernelY = SCHARR_Y;
      break;
    case 'prewitt':
      kernelX = PREWITT_X;
      kernelY = PREWITT_Y;
      break;
    default:
      throw new Error('derivativeFilter: unrecognised derivative filter.');
  }

  return image.gradientFilter({ kernelX, kernelY, ...options });
}
