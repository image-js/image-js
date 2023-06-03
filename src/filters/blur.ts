import { Image } from '../Image';
import { BorderType } from '../utils/interpolateBorder';

import { separableConvolution } from './convolution';

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
   * @default 'reflect101'
   */
  borderType?: BorderType;
  /**
   * Value of the border if BorderType is 'constant'.
   * @default 0
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
  const kernelX = new Array(width).fill(1);
  const kernelY = new Array(height).fill(1);

  return separableConvolution(image, kernelX, kernelY, {
    normalize: true,
    ...options,
  });
}
