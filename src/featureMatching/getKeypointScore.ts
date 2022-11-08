import { Image } from '../Image';
import { Point } from '../geometry';

import { circlePoints } from './isFastKeypoint';

/**
 * Compute the score of a keypoint for non maximal suppression.
 * This value will be used to remove all corners which
 * don't have the highest value within the adjacent keypoints.
 *
 * @param origin - Keypoint coordinates.
 * @param image - Image to process
 * @param threshold - FAST threshold.
 * @returns Score of the corner.
 */
export function getKeypointScore(
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
