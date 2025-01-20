import { match } from 'ts-pattern';

import type { Image } from '../../Image.js';
import type { Point } from '../../geometry/index.js';
import {
  getCirclePoints,
  getCompassPoints,
} from '../../utils/geometry/getCirclePoints.js';
import { getIndex } from '../../utils/getIndex.js';
import { surroundingPixels } from '../../utils/surroundingPixels.js';
import checkProcessable from '../../utils/validators/checkProcessable.js';
import type { GetHarrisScoreOptions } from '../featureMatching.types.js';

import { getFastScore } from './getFastScore.js';
import { getHarrisScore } from './getHarrisScore.js';
import type { IsFastKeypointOptions } from './isFastKeypoint.js';
import { isFastKeypoint } from './isFastKeypoint.js';

export interface GetFastKeypointsOptions extends IsFastKeypointOptions {
  /**
   * Maximum number of features to return.
   * @default `500`
   */
  maxNbFeatures?: number;
  /**
   * Whether to apply non-max suppression to the keypoints.
   * This removes all keypoints which
   * don't have the highest value within the adjacent keypoints.
   * @default `true`
   */
  nonMaxSuppression?: boolean;
  /**
   * Radius of the circle used for the algorithm.
   * @default `3`
   */
  fastRadius?: number;
  /**
   * Algorithm to use to compute corners score.
   * @default `'FAST'`
   */
  scoreAlgorithm?: 'HARRIS' | 'FAST';
  /**
   * Options for the Harris score computation.
   */
  harrisScoreOptions?: GetHarrisScoreOptions;
}

export interface FastKeypoint {
  /**
   * Location of the keypoint in the image.
   */
  origin: Point;
  /**
   * Score of the keypoint, the bigger it is, the better the feature.
   * It is the criteria used for the non-maximal suppression.
   */
  score: number;
}

/**
 * Find the features in a GREY image according to the FAST (Features from Accelerated Segment Test) algorithm.
 * Based on the paper Machine Learning for High-Speed Corner Detection.
 * DOI: https://doi.org/10.1007/11744023_34.
 * @param image - The image to process.
 * @param options - Get FAST keypoints options.
 * @returns The FAST keypoints.
 */
export function getFastKeypoints(
  image: Image,
  options: GetFastKeypointsOptions = {},
): FastKeypoint[] {
  const {
    fastRadius = 3,
    scoreAlgorithm = 'FAST',
    harrisScoreOptions,
  } = options;

  const circlePoints = getCirclePoints(fastRadius);
  const compassPoints = getCompassPoints(fastRadius);

  const {
    maxNbFeatures = 500,
    nbContiguousPixels = (3 / 4) * circlePoints.length,
    threshold = 20,
    nonMaxSuppression = true,
  } = options;

  checkProcessable(image, {
    channels: [1],
    alpha: false,
  });

  const getScore = match(scoreAlgorithm)
    .with('HARRIS', () => {
      return (image: Image, corner: Point) =>
        getHarrisScore(image, corner, harrisScoreOptions);
    })
    .with('FAST', () => {
      return (image: Image, corner: Point) =>
        getFastScore(image, corner, threshold, circlePoints);
    })
    .exhaustive();

  const allKeypoints: FastKeypoint[] = [];

  const scoreArray = new Float64Array(image.size).fill(
    Number.NEGATIVE_INFINITY,
  );
  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      const corner = { row, column };
      if (
        isFastKeypoint(corner, image, circlePoints, compassPoints, {
          nbContiguousPixels,
          threshold,
        })
      ) {
        const score = getScore(image, corner);
        scoreArray[getIndex(corner.column, corner.row, image, 0)] = score;
        allKeypoints.push({ origin: corner, score });
      }
    }
  }

  let keypoints: FastKeypoint[] = [];
  if (!nonMaxSuppression) {
    keypoints = allKeypoints;
  } else {
    // Non-Maximal Suppression
    for (const keypoint of allKeypoints) {
      const currentScore =
        scoreArray[
          getIndex(keypoint.origin.column, keypoint.origin.row, image, 0)
        ];
      for (let i = 0; i < surroundingPixels.length; i++) {
        const neighbour = surroundingPixels[i];
        const neighbourScore =
          scoreArray[
            getIndex(
              keypoint.origin.column + neighbour.column,
              keypoint.origin.row + neighbour.row,
              image,
              0,
            )
          ];
        if (neighbourScore > currentScore) break;
        if (i === surroundingPixels.length - 1) {
          keypoints.push(keypoint);
        }
      }
    }
  }

  keypoints.sort((a, b) => b.score - a.score);

  return keypoints.slice(0, maxNbFeatures);
}
