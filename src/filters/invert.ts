import { IJS } from '../IJS';
import { getOutputImage } from '../utils/getOutputImage';

export interface InvertOptions {
  out?: IJS;
}

/**
 * Invert the colors of an image.
 * @param image - The image to invert.
 */
export function invert(image: IJS, options?: InvertOptions): IJS {
  const newImage = getOutputImage(image, options);
  const { maxValue } = newImage;
  for (let i = 0; i < newImage.size; i++) {
    for (let channel = 0; channel < newImage.channels; channel++) {
      newImage.setValueByIndex(
        i,
        channel,
        maxValue - image.getValueByIndex(i, channel),
      );
    }
  }

  return newImage;
}
