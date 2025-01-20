import type { FastKeypoint } from '../keypoints/getFastKeypoints.js';

/**
 * Get the shade the keypoint with given index should have (the color is an indicator
 * of the score). The keypoints should be sorted with highest score first.
 * @param keypoints - The sorted keypoints.
 * @param index - Index of the keypoint.
 * @param colors - The colors from which to pick (sorted from brightest to darkest).
 * @returns The color the keypoint should have.
 */
export function getKeypointColor(
  keypoints: FastKeypoint[],
  index: number,
  colors: number[][],
): number[] {
  const maxScore = keypoints[0].score;
  const minScore = (keypoints.at(-1) as FastKeypoint).score;
  if (minScore === maxScore) {
    return colors[0];
  }
  const score = keypoints[index].score;
  const colorIndex =
    colors.length -
    1 -
    Math.floor(
      ((colors.length - 1) * (score - minScore)) / (maxScore - minScore),
    );
  return colors[colorIndex];
}
