import type { Match } from './bruteForceMatch.js';

/**
 * Use this function to only keep the match from source to destination with
 * the smallest distance (score) for each destination keypoint.
 * @param matches - Matches from source to destination.
 * @returns Only the matches from source to destination with the smallest distance.
 */
export function filterSmallestDistanceMatches(matches: Match[]): Match[] {
  const sorted = matches.slice();
  sorted.sort((a, b) => a.destinationIndex - b.destinationIndex);

  const result: Match[] = [];
  let sameDestMatches: Match[] = [];
  let currentIndex = sorted[0].destinationIndex;
  for (const match of sorted) {
    if (match.destinationIndex === currentIndex) {
      sameDestMatches.push(match);
    } else {
      sameDestMatches.sort((a, b) => a.distance - b.distance);
      result.push(...sameDestMatches.slice(0, 1));

      currentIndex = match.destinationIndex;
      sameDestMatches = [match];
    }
  }
  sameDestMatches.sort((a, b) => a.distance - b.distance);
  result.push(...sameDestMatches.slice(0, 1));
  return result;
}
