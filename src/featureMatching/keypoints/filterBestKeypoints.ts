import { OrientedFastKeypoint } from './getOrientedFastKeypoints';
import { getKeypointsInRadius } from './utils/getKeypointsInRadius';

/**
 * Return the best keypoints within the given radius.
 *
 * @param keypoints - Keypoints to process.
 * @param radius - Minimum distance between two keypoints.
 * @returns The filtered keypoints.
 */
export function filterBestKeypoints(
  keypoints: OrientedFastKeypoint[],
  radius = 5,
): OrientedFastKeypoint[] {
  const size = keypoints.length;

  const keypointsInRadius = getKeypointsInRadius(keypoints, radius);
  console.log({ keypointsInRadius });

  const toIgnore = new Uint8Array(size).fill(0);

  for (let i = 0; i < size; i++) {
    const keypoint = keypoints[i];
    for (let secondKeypointIndex of keypointsInRadius[i]) {
      const secondKeypoint = keypoints[secondKeypointIndex];
      if (keypoint.score < secondKeypoint.score) {
        console.log(i);
        toIgnore[i] = 1;
        continue;
      }
    }
  }

  console.log({ toIgnore });
  const result: OrientedFastKeypoint[] = [];
  for (let i = 0; i < size; i++) {
    if (!toIgnore[i]) {
      result.push(keypoints[i]);
    }
  }

  return result;
}
