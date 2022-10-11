import { Image } from '../Image';

export interface Stats {
  sum: number[];
  mean: number[];
  median: number[];
}

/**
 * Compute various stats of an image.
 *
 * @param image - Image to process.
 * @returns The stats of the image.
 */
export function pixelStats(image: Image): Stats {
  let sum = new Array(image.channels).fill(0);
  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      for (let channel = 0; channel < image.channels; channel++) {
        sum[channel] += image.getValue(column, row, channel);
      }
    }
  }
  const mean = sum.map((channel) => channel / image.size);
  const median = image.median();
  return { sum, mean, median };
}
