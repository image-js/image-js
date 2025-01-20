import type { RgbColor } from 'colord';

import type { Image } from '../../Image.js';

/**
 * Extract the colors of an image in order to use them for color correction. Should be used on small images only (smaller than 10x10 pixels), because it is these colors that will be used in the model (MLR).
 * @param image - Image from which to get the colors.
 * @returns Array of colors.
 */
export function getImageColors(image: Image): RgbColor[] {
  const colors: RgbColor[] = [];

  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      colors.push({
        r: image.getValue(column, row, 0),
        g: image.getValue(column, row, 1),
        b: image.getValue(column, row, 2),
      });
    }
  }
  return colors;
}
