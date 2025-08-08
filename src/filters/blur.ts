import type { Image } from '../Image.js';
import type { BorderType } from '../utils/interpolateBorder.js';

import { separableConvolution } from './convolution.js';

export interface BlurOptions {
  /**
   * Width of the blurring matrix, must be an odd integer.
   */
  width: number;
  /**
   * Height of the blurring matrix, must be an odd integer.
   */
  height: number;
  /**
   * Explicit how to handle the borders.
   * @default `'reflect101'`
   */
  borderType?: BorderType;
  /**
   * Value of the border if BorderType is 'constant'.
   * @default `0`
   */
  borderValue?: number;
  /**
   * Image to which to output.
   */
  out?: Image;
}

/**
 * Blur an image. The pixel in the center becomes an average of the surrounding ones.
 * @param image - Image to blur.
 * @param options - Blur options.
 * @returns The blurred image.
 */
export function blur(image: Image, options: BlurOptions): Image {
  const { width, height } = options;

  if (width < 1 || width % 2 === 0) {
    throw new RangeError(
      `Invalid property "width". Must be an odd number greater than 0. Received ${width}.`,
    );
  }
  if (height < 1 || height % 2 === 0) {
    throw new RangeError(
      `Invalid property "height". Must be an odd number greater than 0. Received ${height}.`,
    );
  }

  const kernelX = new Array(width).fill(1);
  const kernelY = new Array(height).fill(1);

  return separableConvolution(image, kernelX, kernelY, {
    normalize: true,
    ...options,
  });
}
