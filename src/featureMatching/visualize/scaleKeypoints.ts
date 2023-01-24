import { FastKeypoint } from '../keypoints/getFastKeypoints';

/**
 * Scales the coordinates of the keypoints.
 *
 * @param keypoints - Keypoints to scale.
 * @param scale - Scalar by which to multiply the coordinates.
 * @returns Scaled keypoints (copy of the original array).
 */
export function scaleKeypoints(
  keypoints: FastKeypoint[],
  scale: number,
): FastKeypoint[] {
  if (scale === 1) return keypoints.slice();

  let result: FastKeypoint[] = [];

  for (let kpt of keypoints) {
    result.push({
      origin: {
        row: kpt.origin.row * scale,
        column: kpt.origin.column * scale,
      },
      score: kpt.score,
    });
  }

  return result;
}
