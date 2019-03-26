import { Image, createFrom } from '..';

/**
 * Invert the colors of an image.
 * @param image - The image to invert.
 */
export function invert(image: Image): Image {
  const newImage = image.clone();
  const { maxValue } = newImage;
  newImage.changeEach((value) => maxValue - value);
  return newImage;
}
