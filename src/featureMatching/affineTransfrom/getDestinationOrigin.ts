import { getAffineTransform } from 'ml-affine-transform';
import { ransac } from 'ml-ransac';

import {
  bruteForceOneMatch,
  getBestKeypointsInRadius,
  getBriefDescriptors,
  getOrientedFastKeypoints,
} from '..';
import { Point, Image } from '../..';

import { affineFitFunction } from './affineFitFunction';
import { createAffineTransformModel } from './createAffineTransformModel';
import { getEuclidianDistance } from './getEuclidianDistance';
import { getMatrixFromPoints } from './getMatrixFromPoints';

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
 * @param source
 * @param destination
 * @param options
 */
export function getDestinationOrigin(
  source: Image,
  destination: Image,
  options: GetDestinationOriginOptions = {},
): Point {
  const { keypointWindowSize = 31, bestKeypointRadius = 10 } = options;
  // find keypoints

  const allSourceKeypoints = getOrientedFastKeypoints(source, {
    centroidPatchDiameter: keypointWindowSize,
  });
  const sourceKeypoints = getBestKeypointsInRadius(
    allSourceKeypoints,
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
  const sourceDescriptors = getBriefDescriptors(
    source,
    sourceKeypoints,
  ).descriptors;

  const destinationDescriptors = getBriefDescriptors(
    destination,
    destinationKeypoints,
  ).descriptors;

  // match reference and destination keypoints
  const matches = bruteForceOneMatch(sourceDescriptors, destinationDescriptors);

  if (matches.length < 2) {
    throw new Error(
      'Insufficient number of matches found to compute affine transform (less than 2).',
    );
  }
  console.log(matches);

  // extract source and destination points
  let sourcePoints: Point[] = [];
  let destinationPoints: Point[] = [];
  for (const match of matches) {
    sourcePoints.push(sourceKeypoints[match.sourceIndex].origin);
    destinationPoints.push(destinationKeypoints[match.sourceIndex].origin);
  }

  // find inliers with ransac
  if (sourcePoints.length > 2) {
    const inliers = ransac(sourcePoints, destinationPoints, {
      distanceFunction: getEuclidianDistance,
      modelFunction: createAffineTransformModel,
      fitFunction: affineFitFunction,
    }).inliers;
    console.log({ inliers });
    sourcePoints = inliers.map((i) => sourcePoints[i]);
    destinationPoints = inliers.map((i) => destinationPoints[i]);
  }

  const sourceMatrix = getMatrixFromPoints(sourcePoints);
  const destinationMatrix = getMatrixFromPoints(destinationPoints);
  const affineTransform = getAffineTransform(sourceMatrix, destinationMatrix);

  console.log(affineTransform);
  // compute affine transform from destination to reference
  // compute crop origin in destination

  return { row: 0, column: 0 };
}
