import { Image } from '..';

/**
 * Compute the mean difference between two images. Ignore values that are zero in both images.
 *
 * @param image - First image.
 * @param otherImage - Second image.
 * @returns Mean difference between the two images.
 */
export function meanDifference(image: Image, otherImage: Image): number {
  const difference = image.subtract(otherImage, { absolute: true });
  let nbValues = 0;
  let sum = 0;
  for (let i = 0; i < image.size; i++) {
    for (let channel = 0; channel < image.channels; channel++) {
      const value = difference.getValueByIndex(i, channel);
      if (
        !(
          image.getValueByIndex(i, channel) === 0 &&
          otherImage.getValueByIndex(i, channel) === 0
        )
      ) {
        nbValues++;
        sum += value;
      }
    }
  }
  if (nbValues !== 0) {
    return sum / nbValues;
  } else {
    return 0;
  }
}
