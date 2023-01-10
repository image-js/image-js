import { Image } from '../../Image';
import { getClampFromTo } from '../../utils/clamp';

export interface GetScoreColorsOptions {
  /**
   * Number of shades to generate.
   *
   * @default 6
   */
  nbShades?: number;
  /**
   * Factor between 0 and 1 by which to multiply the maximal value of the color to obtain the minimum value.
   *
   * @default 0.2
   */
  minValueFactor?: number;
}

/**
 * Generate an array of colors to draw the keypoints depending on their score.
 *
 * @param image - The image from which the keypoints come.
 * @param keypointColor - The desired shade for the colors
 * @param options - Get score colors options.
 * @returns Array of colors.
 */
export function getScoreColors(
  image: Image,
  keypointColor: number[],
  options: GetScoreColorsOptions = {},
): number[][] {
  const { nbShades = 6, minValueFactor = 0.2 } = options;
  const maxValue = Math.max(...keypointColor);
  const minValue = maxValue * minValueFactor;

  const interval = Math.floor((maxValue - minValue) / (nbShades - 1));
  const clamp = getClampFromTo(0, image.maxValue);

  let colors: number[][] = [];
  for (let i = 0; i < nbShades; i++) {
    let color = [];
    for (let channel of keypointColor) {
      color.push(clamp(channel - i * interval));
    }
    colors.push(color);
  }

  return colors;
}
