import { copyAlpha } from '..';
import { IJS } from '../IJS';
import { getOutputImage } from '../utils/getOutputImage';

export interface InvertOptions {
  /**
   * Image to which the inverted image has to be put.
   */
  out?: IJS;
}

/**
 * Invert the components of an image.
 *
 * @param image - The image to invert.
 * @param options - Invert options.
 * @returns The inverted image.
 */

export function invert(image: IJS, options?: InvertOptions): IJS {
  const newImage = getOutputImage(image, options);
  if (image.alpha) {
    copyAlpha(image, newImage);
  }

  const { maxValue } = newImage;
  for (let i = 0; i < newImage.size; i++) {
    for (let component = 0; component < image.components; component++) {
      newImage.setValueByIndex(
        i,
        component,
        maxValue - image.getValueByIndex(i, component),
      );
    }
  }

  return newImage;
}
