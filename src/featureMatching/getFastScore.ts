import { Image } from '../Image';
import { Point } from '../geometry';

import { circlePoints } from './isFastKeypoint';

/**
 * Compute the score of a keypoint using the function described in the FAST article.
 * DOI: https://doi.org/10.1007/11744023_34
 *
 * @param origin - Keypoint coordinates.
 * @param image - Image to process
 * @param threshold - FAST threshold.
 * @returns Score of the corner.
 */
export function getFastScore(
  origin: Point,
  image: Image,
  threshold: number,
): number {
  const currentIntensity = image.getValue(origin.column, origin.row, 0);

  let brighterSum = 0;
  let darkerSum = 0;
  for (let point of circlePoints) {
    const pointIntensity = image.getValue(
      origin.column + point.column,
      origin.row + point.row,
      0,
    );
    if (pointIntensity >= currentIntensity + threshold) {
      brighterSum += Math.abs(pointIntensity - currentIntensity) - threshold; // circle point is lighter
    } else if (pointIntensity <= currentIntensity - threshold) {
      darkerSum += Math.abs(currentIntensity - pointIntensity) - threshold; // circle point is darker
    }
  }

  return Math.max(brighterSum, darkerSum);
}
