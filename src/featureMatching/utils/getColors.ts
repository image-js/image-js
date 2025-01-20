import type { Image } from '../../Image.js';
import { getClampFromTo } from '../../utils/clamp.js';
import type { GetColorsOptions } from '../featureMatching.types.js';

/**
 * Generate an array of colors to draw the keypoints depending on their score or the matches depending on the distance.
 * @param image - The source image.
 * @param baseColor - The desired shade for the colors.
 * @param options - Get score colors options.
 * @returns Array of colors.
 */
export function getColors(
  image: Image,
  baseColor: number[],
  options: GetColorsOptions = {},
): number[][] {
  const { nbShades = 6, minValueFactor = 0.2 } = options;
  const maxValue = Math.max(...baseColor);
  const minValue = maxValue * minValueFactor;

  const interval = Math.floor((maxValue - minValue) / (nbShades - 1));
  const clamp = getClampFromTo(0, image.maxValue);

  const colors: number[][] = [];
  for (let i = 0; i < nbShades; i++) {
    const color = [];
    for (const channel of baseColor) {
      color.push(clamp(channel - i * interval));
    }
    colors.push(color);
  }

  return colors;
}
