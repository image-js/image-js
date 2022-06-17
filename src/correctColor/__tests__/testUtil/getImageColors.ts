import { RgbColor } from 'colord';

import { IJS } from '../../../IJS';

/**
 * Extract the colors of an image in order to use them for color correction. Should be used on small images only (smaller than 10x10 pixels).
 *
 * @param image - Image from which to get the colors.
 * @returns Array of colors.
 */
export function getImageColors(image: IJS): RgbColor[] {
  let colors: RgbColor[] = [];

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
