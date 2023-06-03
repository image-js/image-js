import { BitDepth, Image } from '..';
import checkProcessable from '../utils/checkProcessable';
import { validateChannels } from '../utils/validators';

export interface HypotenuseOptions {
  /**
   * Bit depth of the resulting image.
   * @default image.bitDepth
   */
  bitDepth?: BitDepth;
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
  let { bitDepth = image.bitDepth, channels = [] } = options;

  for (let i = 0; i < image.components; i++) {
    channels.push(i);
  }

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

  let newImage = Image.createFrom(image, { bitDepth });

  for (const channel of channels) {
    for (let i = 0; i < image.size; i++) {
      let value = Math.hypot(
        image.getValueByIndex(i, channel),
        otherImage.getValueByIndex(i, channel),
      );
      newImage.setValueByIndex(
        i,
        channel,
        value > newImage.maxValue ? newImage.maxValue : value,
      );
    }
  }

  return newImage;
}
