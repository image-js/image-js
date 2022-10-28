import { copyAlpha, Mask } from '..';
import { Image } from '../Image';
import { getOutputImage, maskToOutputMask } from '../utils/getOutputImage';

export interface InvertOptions {
  /**
   * Image to which the inverted image has to be put.
   */
  out?: Image | Mask;
}

export function invert(image: Image, options?: InvertOptions): Image;
export function invert(image: Mask, options?: InvertOptions): Mask;
/**
 * Invert the components of an image.
 *
 * @param image - The image to invert.
 * @param options - Invert options.
 * @returns The inverted image.
 */
export function invert(
  image: Image | Mask,
  options?: InvertOptions,
): Image | Mask {
  if (image instanceof Image) {
    const newImage = getOutputImage(image, options);
    if (image.alpha) {
      copyAlpha(image, newImage);
    }

    const { maxValue, size } = newImage;
    for (let i = 0; i < size; i++) {
      for (let component = 0; component < image.components; component++) {
        newImage.setValueByIndex(
          i,
          component,
          maxValue - image.getValueByIndex(i, component),
        );
      }
    }
    return newImage;
  } else {
    const newImage = maskToOutputMask(image, options);

    for (let i = 0; i < newImage.size; i++) {
      newImage.setBitByIndex(i, !image.getBitByIndex(i));
    }
    return newImage;
  }
}
