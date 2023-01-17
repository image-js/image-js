import { BriefDescriptor } from '../descriptors/getBriefDescriptors';
import { sortBySourceDest } from '../utils/sortBySourceDest';

import { bruteForceOneMatch, Match } from './bruteForceMatch';

/**
 * Get the crosscheck matches from the source and destination descriptors.
 *
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
 *
 * @param srcDstMatches - Best matches computed from source do destination.
 * @param dstSrcMatches - Best matches computed from destination to source.
 * @returns The pairs of keypoints that are mutually the best match.
 */
export function crosscheck(
  srcDstMatches: Match[],
  dstSrcMatches: Match[],
): Match[] {
  let result: Match[] = [];

  const sorted1 = sortBySourceDest(srcDstMatches);
  const sorted2 = sortBySourceDest(dstSrcMatches);

  let pointer1 = 0;
  let pointer2 = 0;

  while (pointer1 < sorted1.length && pointer2 < sorted2.length) {
    const current1 = sorted1[pointer1];
    const current2 = sorted2[pointer2];

    if (current1.sourceIndex > current2.sourceIndex) {
      pointer2++;
    } else if (current1.sourceIndex < current2.sourceIndex) {
      pointer1++;
    } else if (current1.destinationIndex > current2.destinationIndex) {
      pointer2++;
    } else if (current1.destinationIndex < current2.destinationIndex) {
      pointer1++;
    } else {
      result.push({
        distance: Math.max(current1.distance, current2.distance),
        sourceIndex: current1.sourceIndex,
        destinationIndex: current1.destinationIndex,
      });
      pointer1++;
      pointer2++;
    }
  }
  return result;
}
