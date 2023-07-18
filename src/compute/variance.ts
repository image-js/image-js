import { Image } from '../Image';

/**
 * Compute the variance of each channel of an image.
 * @see {@link https://en.wikipedia.org/wiki/Variance}
 * @param image - Image to process.
 * @returns The variance of the channels of the image.
 */
export function variance(image: Image): number[] {
  const mean = image.mean();

  const sum = new Array(image.channels).fill(0);
  for (let i = 0; i < image.size; i++) {
    for (let channel = 0; channel < image.channels; channel++) {
      sum[channel] += Math.pow(
        image.getValueByIndex(i, channel) - mean[channel],
        2,
      );
    }
  }

  const nbValues = image.size * image.channels;
  return sum.map((channel) => channel / nbValues);
}
