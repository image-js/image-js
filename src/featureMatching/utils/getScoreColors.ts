import { Image } from '../../Image';
import { getClampFromTo } from '../../utils/clamp';

/**
 * Generate an array of colors to draw the keypoints depending on their score.
 *
 * @param image - The image from which the keypoints come.
 * @param keypointColor - The desired shade for the colors
 * @param nbShades - Number of shades to generate.
 * @returns Array of colors.
 */
export function getScoreColors(
  image: Image,
  keypointColor: number[],
  nbShades: number,
): number[][] {
  const maxValue = Math.max(...keypointColor);
  const minValue = maxValue * 0.05;

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
