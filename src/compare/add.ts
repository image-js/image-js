import { Image } from '../Image.js';
import { getClamp } from '../utils/clamp.js';
import checkProcessable from '../utils/validators/checkProcessable.js';
import { validateForComparison } from '../utils/validators/validators.js';
/**
 *
 * Calculate a new image that is the sum between the current image and the otherImage.
 * @param image - Image to which to add.
 * @param otherImage - Image to add.
 * @returns The summed image.
 */
export function add(image: Image, otherImage: Image): Image {
  if (image instanceof Image) {
    checkProcessable(image, {
      bitDepth: [8, 16],
      components: [1, 3],
      alpha: false,
    });
  }

  validateForComparison(image, otherImage);

  const newImage = image.clone();
  const clamp = getClamp(image);
  for (let index = 0; index < image.size; index++) {
    for (let channel = 0; channel < image.channels; channel++) {
      const value =
        image.getValueByIndex(index, channel) +
        otherImage.getValueByIndex(index, channel);
      newImage.setValueByIndex(index, channel, clamp(value));
    }
  }
  return newImage;
}
