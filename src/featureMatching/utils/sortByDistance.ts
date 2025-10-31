import type { Match } from '../matching/bruteForceMatch.js';

/**
 * Source array of matches by ascending distance.
 * @param matches - Array of matches to sort.
 * @returns Sorted copy of the array of matches.
 */
export function sortByDistance(matches: Match[]): Match[] {
  const sorted = matches.slice();
  sorted.sort((match1, match2) => {
    return match1.distance - match2.distance;
  });
  return sorted;
}
