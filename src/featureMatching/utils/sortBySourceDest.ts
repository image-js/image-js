import type { Match } from '../matching/bruteForceMatch.js';

/**
 * Sort array of matches by source index and then destination index.
 * @param matches - Array of matches to sort.
 * @returns Sorted copy of the array of matches.
 */
export function sortBySourceDest(matches: Match[]): Match[] {
  const sorted = matches.slice();
  sorted.sort((match1, match2) => {
    if (match1.sourceIndex < match2.sourceIndex) return -1;
    if (match1.sourceIndex > match2.sourceIndex) return 1;
    return match1.destinationIndex - match2.destinationIndex;
  });
  return sorted;
}

/**
 * Sort array of matches by destination index and then source index.
 * @param matches - Array of matches to sort.
 * @returns Sorted copy of the array of matches.
 */
export function sortByDestSource(matches: Match[]): Match[] {
  const sorted = matches.slice();
  sorted.sort((match1, match2) => {
    if (match1.destinationIndex < match2.destinationIndex) return -1;
    if (match1.destinationIndex > match2.destinationIndex) return 1;
    return match1.sourceIndex - match2.sourceIndex;
  });
  return sorted;
}
