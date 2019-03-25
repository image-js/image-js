import { BaseImage, createFrom } from '@image-js/core';

/**
 * Invert the colors of an image.
 * @param image - The image to invert.
 */
export function invert<T extends BaseImage>(image: T): T {
  const newImage = createFrom(image);
  const { maxValue } = image;
  for (const [y, x, c, value] of image.values()) {
    newImage.setValue(y, x, c, maxValue - value);
  }
  return newImage;
}
