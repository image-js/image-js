import type { Image } from '../Image.js';
import type { Point } from '../geometry/index.js';

export interface VarianceOptions {
  /**
   * Points to calculate variance from.
   */
  points: Point[];
}

/**
 * Compute the variance of each channel of an image.
 * @see {@link https://en.wikipedia.org/wiki/Variance}
 * @param image - Image to process.
 * @param options - Variance options.
 * @returns The variance of the channels of the image.
 */
export function variance(image: Image, options?: VarianceOptions): number[] {
  const mean = image.mean(options);
  const sum = new Array<number>(image.channels).fill(0);
  if (options) {
    for (const point of options.points) {
      for (let channel = 0; channel < image.channels; channel++) {
        sum[channel] +=
          (image.getValue(point.column, point.row, channel) - mean[channel]) **
          2;
      }
    }
  } else {
    for (let i = 0; i < image.size; i++) {
      for (let channel = 0; channel < image.channels; channel++) {
        sum[channel] +=
          (image.getValueByIndex(i, channel) - mean[channel]) ** 2;
      }
    }
  }
  const nbValues = options
    ? options.points.length * image.channels
    : image.size * image.channels;
  return sum.map((channel) => channel / nbValues);
}
