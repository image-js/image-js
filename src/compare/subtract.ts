import { Image } from '../Image.js';
import { Mask } from '../Mask.js';
import checkProcessable from '../utils/validators/checkProcessable.js';
import { validateForComparison } from '../utils/validators/validators.js';

export interface SubtractImageOptions {
  /**
   * Return the absolute difference for each pixel.
   * @default `false`
   */
  absolute?: boolean;
}

export function subtract(
  image: Image,
  otherImage: Image,
  options?: SubtractImageOptions,
): Image;
export function subtract(
  image: Mask,
  otherImage: Mask,
  options?: SubtractImageOptions,
): Mask;
export function subtract(
  image: Image | Mask,
  otherImage: Image | Mask,
  options: SubtractImageOptions,
): Image | Mask;
/**
 * Calculate a new image that is the subtraction between the current image and the otherImage.
 * @param image - Image from which to subtract.
 * @param otherImage - Image to subtract.
 * @param options - Subtract options.
 * @returns The subtracted image.
 */
export function subtract(
  image: Image | Mask,
  otherImage: Image | Mask,
  options: SubtractImageOptions = {},
): Image | Mask {
  const { absolute = false } = options;

  if (image instanceof Image) {
    checkProcessable(image, {
      bitDepth: [1, 8, 16],
      components: [1, 3],
      alpha: false,
    });
  }

  validateForComparison(image, otherImage);

  const newImage = image.clone();
  if (newImage instanceof Image) {
    for (let index = 0; index < image.size; index++) {
      for (let channel = 0; channel < image.channels; channel++) {
        const value =
          image.getValueByIndex(index, channel) -
          otherImage.getValueByIndex(index, channel);
        if (absolute) {
          if (value < 0) {
            newImage.setValueByIndex(index, channel, -value);
          } else {
            newImage.setValueByIndex(index, channel, value);
          }
        } else if (value < 0) {
          newImage.setValueByIndex(index, channel, 0);
        } else {
          newImage.setValueByIndex(index, channel, value);
        }
      }
    }
  } else if (image instanceof Mask && otherImage instanceof Mask) {
    for (let index = 0; index < image.size; index++) {
      const value =
        image.getBitByIndex(index) - otherImage.getBitByIndex(index);
      if (absolute) {
        newImage.setBitByIndex(index, value ? 1 : 0);
      } else {
        newImage.setBitByIndex(index, value > 0 ? 1 : 0);
      }
    }
  }

  return newImage;
}
