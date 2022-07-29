import { ColorDepth, Image, Mask } from '..';
import checkProcessable from '../utils/checkProcessable';

export interface SubtractImageOptions {
  /**
   * Return the absolute difference for each pixel.
   *
   * @default false
   */
  absolute?: boolean;
}

export function subtractImage(
  image: Image,
  otherImage: Image,
  options?: SubtractImageOptions,
): Image;
export function subtractImage(
  image: Mask,
  otherImage: Mask,
  options?: SubtractImageOptions,
): Mask;
export function subtractImage(
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
export function subtractImage(
  image: Image | Mask,
  otherImage: Image | Mask,
  options: SubtractImageOptions = {},
): Image | Mask {
  let { absolute = false } = options;

  if (image instanceof Image) {
    checkProcessable(image, 'subtractImage', {
      bitDepth: [ColorDepth.UINT1, ColorDepth.UINT8, ColorDepth.UINT16],
      components: [1, 3],
      alpha: false,
    });
  }

  if (image.width !== otherImage.width || image.height !== otherImage.height) {
    throw new Error('subtractImage: both images must have the same size');
  }
  if (image.alpha !== otherImage.alpha || image.depth !== otherImage.depth) {
    throw new Error(
      'subtractImage: both images must have the same alpha and depth',
    );
  }
  if (image.channels !== otherImage.channels) {
    throw new Error(
      'subtractImage: both images must have the same number of channels',
    );
  }

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
