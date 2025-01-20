import type { BriefDescriptor } from '../descriptors/getBriefDescriptors.js';
import {
  sortByDestSource,
  sortBySourceDest,
} from '../utils/sortBySourceDest.js';

import type { Match } from './bruteForceMatch.js';
import { bruteForceOneMatch } from './bruteForceMatch.js';

/**
 * Get the crosscheck matches from the source and destination descriptors.
 * @param source - Source descriptors.
 * @param destination - Destination descriptors.
 * @returns The array of crossckeck matches.
 */
export function getCrosscheckMatches(
  source: BriefDescriptor[],
  destination: BriefDescriptor[],
): Match[] {
  const srcMatches = bruteForceOneMatch(source, destination);
  const dstMatches = bruteForceOneMatch(destination, source);

  return crosscheck(srcMatches, dstMatches);
}

/**
 * Return the indices of pairs the keypoints that are mutually the best match.
 * This means that if B is the best match for A, A should be the best match for B.
 * The distance of the resulting matches is the maximum distance between the two.
 * @param srcDstMatches - Best matches computed from source do destination.
 * @param dstSrcMatches - Best matches computed from destination to source.
 * @returns The pairs of keypoints that are mutually the best match.
 */
export function crosscheck(
  srcDstMatches: Match[],
  dstSrcMatches: Match[],
): Match[] {
  const result: Match[] = [];

  const sortedSrcDst = sortBySourceDest(srcDstMatches);
  const sortedDstSrc = sortByDestSource(dstSrcMatches);

  let pointer1 = 0;
  let pointer2 = 0;

  while (pointer1 < sortedSrcDst.length && pointer2 < sortedDstSrc.length) {
    const match1 = sortedSrcDst[pointer1];
    const match2 = sortedDstSrc[pointer2];

    if (match1.sourceIndex > match2.destinationIndex) {
      pointer2++;
    } else if (match1.sourceIndex < match2.destinationIndex) {
      pointer1++;
    } else if (match1.destinationIndex > match2.sourceIndex) {
      pointer2++;
    } else if (match1.destinationIndex < match2.sourceIndex) {
      pointer1++;
    } else {
      result.push({
        distance: Math.max(match1.distance, match2.distance),
        sourceIndex: match1.sourceIndex,
        destinationIndex: match1.destinationIndex,
      });
      pointer1++;
      pointer2++;
    }
  }
  return result;
}
