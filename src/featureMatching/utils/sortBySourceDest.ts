import { Match } from '../matching/bruteForceMatch';

/**
 * Sort array of matches by source index and then destination index.
 *
 * @param matches - Array of matches to sort.
 * @returns Sorted copy of the array of matches.
 */
export function sortBySourceDest(matches: Match[]): Match[] {
  return matches.slice().sort((match1, match2) => {
    if (match1.sourceIndex < match2.sourceIndex) return -1;
    if (match1.sourceIndex > match2.sourceIndex) return 1;
    return match1.destinationIndex - match2.destinationIndex;
  });
}
