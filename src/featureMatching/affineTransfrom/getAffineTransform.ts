import { getAffineTransform as mlGetAffineTransform } from 'ml-affine-transform';
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

export interface GetAffineTransformOptions {
  /**
   * @default 31
   */
  keypointWindowSize?: number;
  /**
   * @default 10
   */
  bestKeypointRadius?: number;
  /**
   * Verify scale and rotation are in acceptable limits.
   *
   * @default false
   */
  checkLimits?: boolean;
  /**
   * Maximal acceptable scale error. The scale between source and destination should be in range [0.9, 1.1].
   */
  maxScaleError?: 0.1;
  /**
   * Maximal rotation accepted between source and destination in degrees.
   */
  maxAngleError?: 5;
}

export interface AffineTransform {
  /**
   * Translation of source points along x and y axes.
   */
  translation: Point;
  /**
   * Clockwise angle in degrees.
   */
  rotation: number;
  /**
   * Scaling factor from source to destination.
   */
  scale: number;
}

export interface GetAffineTransformResult {
  /**
   * Affine transformation from source to destination.
   */
  transform: AffineTransform;
  /**
   * Number of matches of feature matching between source and destination.
   * The bigger this number is, the better.
   */
  nbMatches: number;
}

/**
 * Get the translation of the destination image required to align it on the source image.
 *
 * @param source - Source image.
 * @param destination - Destination image.
 * @param options - Get destination translation options.
 * @returns The translation.
 */
export function getAffineTransform(
  source: Image,
  destination: Image,
  options: GetAffineTransformOptions = {},
): GetAffineTransformResult {
  const {
    keypointWindowSize = 31,
    bestKeypointRadius = 10,
    maxScaleError = 0.1,
    maxAngleError = 5,
    checkLimits = false,
  } = options;

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

    sourcePoints = inliers.map((i) => sourcePoints[i]);
    destinationPoints = inliers.map((i) => destinationPoints[i]);
  }

  // compute affine transform from destination to reference

  const sourceMatrix = getMatrixFromPoints(sourcePoints);
  const destinationMatrix = getMatrixFromPoints(destinationPoints);
  const affineTransform = mlGetAffineTransform(sourceMatrix, destinationMatrix);

  if (checkLimits) {
    if (Math.abs(affineTransform.scale - 1) > maxScaleError) {
      throw new Error(
        `Source and destination scales are too different. Scaling factor is ${affineTransform.scale}`,
      );
    }
    if (Math.abs(affineTransform.rotation - 1) > maxAngleError) {
      throw new Error(
        `Source and destination orientations are too different. Rotation is ${affineTransform.rotation} degrees.`,
      );
    }
  }

  // compute crop origin in destination

  return {
    transform: {
      rotation: affineTransform.rotation,
      scale: affineTransform.scale,
      translation: {
        column: Math.round(affineTransform.translation.x),
        row: Math.round(affineTransform.translation.y),
      },
    },
    nbMatches: matches.length,
  };
}
