import { match } from 'ts-pattern';

import type { BitDepth, Image } from '../Image.js';
import {
  PREWITT_X,
  PREWITT_Y,
  SCHARR_X,
  SCHARR_Y,
  SOBEL_X,
  SOBEL_Y,
} from '../utils/constants/kernels.js';
import type { BorderType } from '../utils/interpolateBorder.js';

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
   * @default `SOBEL`
   */
  filter?: DerivativeFilter;
  /**
   * Specify how the borders should be handled.
   * @default `'replicate'`
   */
  borderType?: BorderType;
  /**
   * Value of the border if BorderType is 'constant'.
   * @default `0`
   */
  borderValue?: number;
  /**
   * Specify the bit depth of the resulting image.
   * @default `image.bitDepth`
   */
  bitDepth?: BitDepth;
}

/**
 * Apply a derivative filter to an image.
 * @param image - Image to process.
 * @param options - Derivative filter options.
 * @returns The processed image.
 */
export function derivativeFilter(
  image: Image,
  options: DerivativeFilterOptions = {},
): Image {
  const { filter = 'sobel' } = options;

  const kernels = match<
    DerivativeFilter,
    { kernelX: number[][]; kernelY: number[][] }
  >(filter)
    .with('sobel', () => ({ kernelX: SOBEL_X, kernelY: SOBEL_Y }))
    .with('scharr', () => ({ kernelX: SCHARR_X, kernelY: SCHARR_Y }))
    .with('prewitt', () => ({ kernelX: PREWITT_X, kernelY: PREWITT_Y }))
    .exhaustive();

  return image.gradientFilter({ ...kernels, ...options });
}
