import { Match } from '../matching/bruteForceMatch';

/**
 * Source array of matches by ascending distance.
 *
 * @param matches - Array of matches to sort.
 * @returns Sorted copy of the array of matches.
 */
export function sortByDistance(matches: Match[]): Match[] {
  return matches.slice().sort((match1, match2) => {
    return match1.distance - match2.distance;
  });
}
