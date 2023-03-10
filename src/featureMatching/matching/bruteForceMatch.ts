import { BriefDescriptor } from '../descriptors/getBriefDescriptors';

import { getHammingDistance } from './getHammingDistance';

// todo: implement bruteForceManyMatches -> N best matches for each source descriptor

export interface BruteForceMatchOptions {
  /**
   * Should the matches be sorted from best to worst?
   *
   * @default false
   */
  sort?: boolean;
  /**
   * Number of best matches to return
   *
   * @default source.length
   */
  nbBestMatches?: number;
}

export interface Match {
  /**
   * Index of the source keypoint.
   */
  sourceIndex: number;
  /**
   * Index of the destination keypoint.
   */
  destinationIndex: number;
  /**
   * Distance from source to destination keypoints.
   */
  distance: number;
}

/**
 * Find the best match for each of the source descriptors using brute force matching.
 *
 * @param source - Source descriptors.
 * @param destination - Destination descriptors.
 * @param options - Brute force amtch options.
 * @returns The best match for each source descriptor.
 */
export function bruteForceOneMatch(
  source: BriefDescriptor[],
  destination: BriefDescriptor[],
  options: BruteForceMatchOptions = {},
): Match[] {
  const { sort = !!options.nbBestMatches, nbBestMatches = source.length } =
    options;

  const matches: Match[] = [];
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
    matches.push({
      sourceIndex,
      destinationIndex: index,
      distance: minDistance,
    });
  }
  if (sort) {
    matches.sort((a, b) => a.distance - b.distance);
  }
  return matches.slice(0, nbBestMatches);
}
