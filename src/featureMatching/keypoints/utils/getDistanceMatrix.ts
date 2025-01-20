import type { OrientedFastKeypoint } from '../getOrientedFastKeypoints.js';

export type DistanceMatrix = Float64Array[];

/**
 * Compute the squared distance from each keypoint to the other ones.
 * @param keypoints - Keypoints to process.
 * @returns Distance matrix.
 */
export function getDistanceMatrix(
  keypoints: OrientedFastKeypoint[],
): DistanceMatrix {
  const size = keypoints.length;

  const matrix = new Array<Float64Array>(size);
  for (let i = 0; i < size; i++) {
    matrix[i] = new Float64Array(size).fill(0);
  }

  for (let i = 0; i < size; i++) {
    const point1 = keypoints[i].origin;
    for (let j = i; j < size; j++) {
      if (i === j) {
        matrix[i][j] = 0;
      }
      const point2 = keypoints[j].origin;
      const squaredDistance =
        (point1.row - point2.row) ** 2 + (point1.column - point2.column) ** 2;
      matrix[i][j] = squaredDistance;
      matrix[j][i] = squaredDistance;
    }
  }

  return matrix;
}
