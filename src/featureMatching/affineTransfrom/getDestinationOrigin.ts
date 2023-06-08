import {
  bruteForceOneMatch,
  getBestKeypointsInRadius,
  getBriefDescriptors,
  getOrientedFastKeypoints,
} from '..';
import { Point, Image } from '../..';

export interface GetDestinationOriginOptions {
  /**
   * @default 31
   */
  keypointWindowSize?: number;
  /**
   * @default 10
   */
  bestKeypointRadius?: number;
}

/**
 *
 * @param reference
 * @param destination
 * @param options
 */
export function getDestinationOrigin(
  reference: Image,
  destination: Image,
  options: GetDestinationOriginOptions = {},
): Point {
  const { keypointWindowSize = 31, bestKeypointRadius = 10 } = options;
  // find keypoints

  const allreferenceKeypoints = getOrientedFastKeypoints(reference, {
    centroidPatchDiameter: keypointWindowSize,
  });
  const referenceKeypoints = getBestKeypointsInRadius(
    allreferenceKeypoints,
    bestKeypointRadius,
  );

  const allDestinationKeypoints = getOrientedFastKeypoints(destination, {
    centroidPatchDiameter: keypointWindowSize,
  });
  const destinationKeypoints = getBestKeypointsInRadius(
    allDestinationKeypoints,
    bestKeypointRadius,
  );

  // compute brief descriptors
  const referenceDescriptors = getBriefDescriptors(
    reference,
    referenceKeypoints,
  ).descriptors;

  const destinationDescriptors = getBriefDescriptors(
    destination,
    destinationKeypoints,
  ).descriptors;

  // match reference and destination keypoints
  const matches = bruteForceOneMatch(
    referenceDescriptors,
    destinationDescriptors,
  );

  console.log(matches);

  // find inliers with ransac
  // compute affine transform from destination to reference
  // compute crop origin in destination
}
