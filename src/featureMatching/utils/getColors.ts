import { Image } from '../../Image';
import { getClampFromTo } from '../../utils/clamp';

export interface GetColorsOptions {
  /**
   * Number of shades to generate.
   * @default 6
   */
  nbShades?: number;
  /**
   * Factor between 0 and 1 by which to multiply the maximal value of the color to obtain the minimum value.
   * @default 0.2
   */
  minValueFactor?: number;
}

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
