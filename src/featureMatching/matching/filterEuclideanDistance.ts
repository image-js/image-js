import { FastKeypoint, Match } from '..';
import { Point } from '../..';

export interface FilterEuclideanDistanceMatchesOptions {
  /**
   * The origin of the destination image relative to the top-left corner of the source image.
   * @default { column: 0, row: 0 }
   */
  origin?: Point;
}

/**
 * Use this function to only keep the match from source to destination with
 * the smallest distance (score) for each destination keypoint.
 * @param matches - Matches from source to destination.
 * @param sourceKeypoints - Source keypoints.
 * @param destinationKeypoints - Destination keypoints.
 * @param options - Filter smallest distance matches options.
 * @returns Only the matches from source to destination with the smallest distance.
 */
export function filterEuclideanDistance(
  matches: Match[],
  sourceKeypoints: FastKeypoint[],
  destinationKeypoints: FastKeypoint[],
  options: FilterEuclideanDistanceMatchesOptions = {},
): Match[] {
  const { origin = { column: 0, row: 0 } } = options;

  const sorted = matches.sort(
    (a, b) => a.destinationIndex - b.destinationIndex,
  );

  const result: Match[] = [];
  let sameDestMatches: Match[] = [];
  let currentIndex = sorted[0].destinationIndex;
  for (const match of sorted) {
    if (match.destinationIndex === currentIndex) {
      sameDestMatches.push(match);
    } else {
      result.push(
        ...sameDestMatches
          .sort((a, b) => distanceSquared(a) - distanceSquared(b))
          .slice(0, 1),
      );

      currentIndex = match.destinationIndex;
      sameDestMatches = [match];
    }
  }
  result.push(
    ...sameDestMatches.sort((a, b) => a.distance - b.distance).slice(0, 1),
  );
  return result;

  function distanceSquared(match: Match): number {
    return (
      (sourceKeypoints[match.sourceIndex].origin.row -
        (destinationKeypoints[match.destinationIndex].origin.row -
          origin.row)) **
        2 +
      (sourceKeypoints[match.sourceIndex].origin.column -
        destinationKeypoints[match.destinationIndex].origin.column -
        origin.column) **
        2
    );
  }
}
