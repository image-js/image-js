import { Image } from '../Image';

/**
 * Compute the variance of an image.
 * https://en.wikipedia.org/wiki/Variance
 *
 * @param image - Image to process.
 * @returns The variance of the image.
 */
export function variance(image: Image): number {
  const mean = image.mean({ channelwise: false }) as number;

  let sum = 0;
  for (let i = 0; i < image.size; i++) {
    for (let channel = 0; channel < image.channels; channel++) {
      sum += Math.pow(image.getValueByIndex(i, channel) - mean, 2);
    }
  }

  const nbValues = image.size * image.channels;
  return sum / nbValues;
}
