import type { OrientedFastKeypoint } from '../getOrientedFastKeypoints.js';

import { getDistanceMatrix } from './getDistanceMatrix.js';

export type DistanceMatrix = Float64Array[];

/**
 * Find all keypoints within radius from the current keypoint.
 * @param keypoints - Keypoints to process.
 * @param radius - Radius in which the surrounding keypoints should be.
 * @returns Array of keypoints within radius for each of the keypoints.
 */
export function getKeypointsInRadius(
  keypoints: OrientedFastKeypoint[],
  radius: number,
): number[][] {
  const size = keypoints.length;
  const matrix = getDistanceMatrix(keypoints);

  const squaredRadius = radius ** 2;
  const result: number[][] = [];

  for (let i = 0; i < size; i++) {
    const currentIndices = [];
    for (let j = 0; j < size; j++) {
      if (i === j) continue;
      if (matrix[i][j] <= squaredRadius) {
        currentIndices.push(j);
      }
    }
    result.push(currentIndices);
  }
  return result;
}
