import type { Match } from '../matching/bruteForceMatch.js';

/**
 * Get the shade of the match with given index (the color is an indicator
 * of the distance). The matches should be sorted with smallest distance first.
 * @param matches - The sorted keypoints.
 * @param index - Index of the keypoint.
 * @param colors - The colors from which to pick (sorted from brightest to darkest).
 * @returns The color the keypoint should have.
 */
export function getMatchColor(
  matches: Match[],
  index: number,
  colors: number[][],
): number[] {
  const maxDistance = (matches.at(-1) as Match).distance;
  const minDistance = matches[0].distance;
  if (minDistance === maxDistance) {
    return colors[0];
  }
  const distance = matches[index].distance;
  const colorIndex = Math.floor(
    ((colors.length - 1) * (distance - minDistance)) /
      (maxDistance - minDistance),
  );
  return colors[colorIndex];
}
