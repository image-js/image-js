import type { Image } from '../Image.js';
import { getOutputImage } from '../utils/getOutputImage.js';
import checkProcessable from '../utils/validators/checkProcessable.js';
import { validateChannels } from '../utils/validators/validators.js';

export interface HypotenuseOptions {
  /**
   * To which channels to apply the filter. By default all but alpha.
   */
  channels?: number[];
}

/**
 * Calculate a new image that is the hypotenuse between the current image and the otherImage.
 * @param image - First image to process.
 * @param otherImage - Second image.
 * @param options - Hypotenuse options.
 * @returns Hypotenuse of the two images.
 */
export function hypotenuse(
  image: Image,
  otherImage: Image,
  options: HypotenuseOptions = {},
): Image {
  const {
    channels = new Array(image.components).fill(0).map((value, index) => index),
  } = options;

  checkProcessable(image, {
    bitDepth: [8, 16],
  });

  if (image.width !== otherImage.width || image.height !== otherImage.height) {
    throw new RangeError('both images must have the same size');
  }
  if (
    image.alpha !== otherImage.alpha ||
    image.bitDepth !== otherImage.bitDepth
  ) {
    throw new RangeError('both images must have the same alpha and bitDepth');
  }
  if (image.channels !== otherImage.channels) {
    throw new RangeError('both images must have the same number of channels');
  }

  validateChannels(channels, image);

  const newImage = getOutputImage(image, {}, { clone: true });

  for (const channel of channels) {
    for (let i = 0; i < image.size; i++) {
      const value = Math.hypot(
        image.getValueByIndex(i, channel),
        otherImage.getValueByIndex(i, channel),
      );

      newImage.setValueByIndex(i, channel, Math.min(value, newImage.maxValue));
    }
  }

  return newImage;
}
