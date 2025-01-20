import type { FastKeypoint } from '../keypoints/getFastKeypoints.js';

/**
 * Scales the coordinates of the keypoints.
 * @param keypoints - Keypoints to scale.
 * @param scale - Scalar by which to multiply the coordinates.
 * @returns Scaled keypoints (copy of the original array).
 */
export function scaleKeypoints(
  keypoints: FastKeypoint[],
  scale: number,
): FastKeypoint[] {
  if (scale === 1) return keypoints.slice();

  return keypoints.map((kpt) => {
    return {
      origin: {
        row: kpt.origin.row * scale,
        column: kpt.origin.column * scale,
      },
      score: kpt.score,
    };
  });
}
