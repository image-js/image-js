import type { Image } from '../Image.js';

/**
 * Find the min and max values of each channel of the image.
 * @param image - Image to process.
 * @returns An object with arrays of the min and max values.
 */
export function getMinMax(image: Image): { min: number[]; max: number[] } {
  const min = new Array(image.channels).fill(image.maxValue);
  const max = new Array(image.channels).fill(0);

  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      for (let channel = 0; channel < image.channels; channel++) {
        const currentValue = image.getValue(column, row, channel);
        if (currentValue < min[channel]) {
          min[channel] = currentValue;
        }
        if (currentValue > max[channel]) {
          max[channel] = currentValue;
        }
      }
    }
  }

  return { min, max };
}
