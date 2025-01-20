import type { OrientedFastKeypoint } from './getOrientedFastKeypoints.js';
import { getKeypointsInRadius } from './utils/getKeypointsInRadius.js';

/**
 * Return the best keypoints within the given radius in pixels.
 * @param keypoints - Keypoints to process.
 * @param radius - Minimum distance in pixels between two keypoints.
 * @returns The filtered keypoints.
 */
export function getBestKeypointsInRadius(
  keypoints: OrientedFastKeypoint[],
  radius = 5,
): OrientedFastKeypoint[] {
  const size = keypoints.length;

  const keypointsInRadius = getKeypointsInRadius(keypoints, radius);

  const toIgnore = new Uint8Array(size).fill(0);

  for (let i = 0; i < size; i++) {
    const keypoint = keypoints[i];
    for (const secondKeypointIndex of keypointsInRadius[i]) {
      const secondKeypoint = keypoints[secondKeypointIndex];
      if (keypoint.score < secondKeypoint.score) {
        toIgnore[i] = 1;
        continue;
      }
    }
  }

  const result: OrientedFastKeypoint[] = [];
  for (let i = 0; i < size; i++) {
    if (!toIgnore[i]) {
      result.push(keypoints[i]);
    }
  }

  return result;
}
