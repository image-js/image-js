import { BriefDescriptor } from '../descriptors/getBriefDescriptors';

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
 * The distance of the resulting matches is the minimum distance between the two.
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

  for (let srcDstMatch of srcDstMatches) {
    for (let dstSrcMatch of dstSrcMatches) {
      if (
        srcDstMatch.sourceIndex === dstSrcMatch.destinationIndex &&
        srcDstMatch.destinationIndex === dstSrcMatch.sourceIndex
      ) {
        result.push({
          distance: Math.min(srcDstMatch.distance, dstSrcMatch.distance),
          sourceIndex: srcDstMatch.sourceIndex,
          destinationIndex: dstSrcMatch.destinationIndex,
        });
      }
    }
  }

  return result;
}
