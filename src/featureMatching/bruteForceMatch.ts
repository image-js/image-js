import { BriefDescriptor } from './getBriefDescriptors';
import { getHammingDistance } from './utils/getHammingDistance';

// todo: implement bruteForceManyMatches -> N best matches for each source descriptor

export interface BestMatch {
  sourceIndex: number;
  destinationIndex: number;
  distance: number;
}

/**
 * Find the best match for each of the source descriptors using brute force matching.
 *
 * @param source - Source descriptors.
 * @param destination - Destination descriptors.
 * @returns The best match for each source descriptor.
 */
export function bruteForceOneMatch(
  source: BriefDescriptor[],
  destination: BriefDescriptor[],
): BestMatch[] {
  const bestMatches: BestMatch[] = [];
  for (let sourceIndex = 0; sourceIndex < source.length; sourceIndex++) {
    let minDistance = Number.POSITIVE_INFINITY;
    let index = 0;
    for (
      let destinationIndex = 0;
      destinationIndex < destination.length;
      destinationIndex++
    ) {
      const distance = getHammingDistance(
        source[sourceIndex],
        destination[destinationIndex],
      );
      if (distance < minDistance) {
        minDistance = distance;
        index = destinationIndex;
      }
    }
    bestMatches.push({
      sourceIndex,
      destinationIndex: index,
      distance: minDistance,
    });
  }
  return bestMatches;
}
