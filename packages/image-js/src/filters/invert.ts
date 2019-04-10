import { Image } from '../Image';
import { getOutputImage } from '../utils/getOutputImage';

export interface IInvertOptions {
  out?: Image;
}

/**
 * Invert the colors of an image.
 * @param image - The image to invert.
 */
export function invert(image: Image, options?: IInvertOptions): Image {
  const newImage = getOutputImage(image, options);
  const { maxValue } = newImage;
  for (let i = 0; i < newImage.data.length; i++) {
    newImage.data[i] = maxValue - image.data[i];
  }
  return newImage;
}
