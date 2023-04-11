import { Image, Mask } from '..';
import checkProcessable from '../utils/checkProcessable';
import { validateForComparison } from '../utils/validators';

export interface SubtractImageOptions {
  /**
   * Return the absolute difference for each pixel.
   *
   * @default false
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
 *
 * @param image - Image from which to subtract
 * @param otherImage - Image to subtract
 * @param options - Subtract options.
 * @returns The subtracted image
 */
export function subtract(
  image: Image | Mask,
  otherImage: Image | Mask,
  options: SubtractImageOptions = {},
): Image | Mask {
  let { absolute = false } = options;

  if (image instanceof Image) {
    checkProcessable(image, 'subtract', {
      bitDepth: [1, 8, 16],
      components: [1, 3],
      alpha: false,
    });
  }

  validateForComparison('subtract', image, otherImage);

  let newImage = image.clone();
  if (newImage instanceof Image) {
    for (let index = 0; index < image.size; index++) {
      for (let channel = 0; channel < image.channels; channel++) {
        let value =
          image.getValueByIndex(index, channel) -
          otherImage.getValueByIndex(index, channel);
        if (absolute) {
          newImage.setValueByIndex(index, channel, Math.abs(value));
        } else {
          newImage.setValueByIndex(index, channel, Math.max(value, 0));
        }
      }
    }
  } else if (image instanceof Mask && otherImage instanceof Mask) {
    for (let index = 0; index < image.size; index++) {
      let value = image.getBitByIndex(index) - otherImage.getBitByIndex(index);
      if (absolute) {
        newImage.setBitByIndex(index, Math.abs(value) ? 1 : 0);
      } else {
        newImage.setBitByIndex(index, Math.max(value, 0) ? 1 : 0);
      }
    }
  }

  return newImage;
}
