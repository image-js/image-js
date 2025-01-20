import type { Image } from '../Image.js';
import { getOutputImage } from '../utils/getOutputImage.js';

import flipX from './flipX.js';
import flipY from './flipY.js';

export interface FlipOptions {
  /**
   * Image to which the resulting image has to be put.
   * @default `'horizontal'`
   */
  axis?: 'horizontal' | 'vertical' | 'both';
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Image;
}

/**
 * Apply a flip filter to an image.
 * @param image - Image to process.
 * @param options - Flip options.
 * @returns - The processed image.
 */
export function flip(image: Image, options: FlipOptions = {}): Image {
  const { axis = 'horizontal' } = options;
  const newImage = getOutputImage(image, options, { clone: true });
  if (axis === 'horizontal') {
    return flipX(newImage);
  } else if (axis === 'vertical') {
    return flipY(newImage);
  } else {
    return flipY(flipX(newImage));
  }
}
