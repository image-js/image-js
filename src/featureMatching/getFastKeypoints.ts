import { Image } from '../Image';
import { Point } from '../geometry';
import checkProcessable from '../utils/checkProcessable';
import { getCirclePoints, getCompassPoints } from '../utils/getCirclePoints';
import { getIndex } from '../utils/getIndex';
import { surroundingPixels } from '../utils/surroundingPixels';

import { getFastScore } from './getFastScore';
import { getHarrisScore } from './getHarrisScore';
import { isFastKeypoint, IsFastKeypointOptions } from './isFastKeypoint';

export interface GetFastKeypointsOptions extends IsFastKeypointOptions {
  /**
   * Maximum number of features to return.
   *
   * @default 500
   */
  maxNbFeatures?: number;
  /**
   * Should non-max suppression be applied to the keypoints?
   * This removes all keypoints which
   * don't have the highest value within the adjacent keypoints.
   *
   * @default true
   */
  nonMaxSuppression?: boolean;
  /**
   * Radius of the circle used for the algorithm.
   *
   * @default 3
   */
  fastRadius?: number;
  /**
   * Algorithm to use to compute corners score.
   *
   * @default 'FAST'
   */
  scoreAlgorithm?: 'HARRIS' | 'FAST';
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
 * DOI: https://doi.org/10.1007/11744023_34
 *
 * @param image - The image to process.
 * @param options - Get FAST keypoints options.
 * @returns The FAST keypoints.
 */
export function getFastKeypoints(
  image: Image,
  options: GetFastKeypointsOptions = {},
): FastKeypoint[] {
  const { fastRadius = 3, scoreAlgorithm = 'FAST' } = options;

  const circlePoints = getCirclePoints(fastRadius);
  const compassPoints = getCompassPoints(fastRadius);

  const {
    maxNbFeatures = 500,
    nbContiguousPixels = (3 / 4) * circlePoints.length,
    threshold = 20,
    nonMaxSuppression = true,
  } = options;

  checkProcessable(image, 'getFastKeypoints', {
    channels: [1],
    alpha: false,
  });

  let possibleCorners: Point[] = [];
  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      if (
        isFastKeypoint({ row, column }, image, circlePoints, compassPoints, {
          nbContiguousPixels,
          threshold,
        })
      ) {
        possibleCorners.push({ row, column });
      }
    }
  }

  const allKeypoints: FastKeypoint[] = [];

  let scoreArray = new Float64Array(image.size).fill(Number.NEGATIVE_INFINITY);
  for (let corner of possibleCorners) {
    let score = 0;
    switch (scoreAlgorithm) {
      case 'HARRIS':
        score = getHarrisScore(image, corner);
        break;
      case 'FAST':
        score = getFastScore(image, corner, threshold, circlePoints);
        break;
      default:
        throw new Error(
          `getFastKeypoints: undefined score algorithm ${scoreAlgorithm}`,
        );
    }
    scoreArray[getIndex(corner.column, corner.row, image, 0)] = score;
    allKeypoints.push({ origin: corner, score });
  }

  if (!nonMaxSuppression) {
    allKeypoints.sort((a, b) => b.score - a.score);
    return allKeypoints.slice(0, maxNbFeatures);
  }

  // Non-Maximal Suppression
  const nmsKeypoints: FastKeypoint[] = [];

  for (let corner of possibleCorners) {
    const currentScore =
      scoreArray[getIndex(corner.column, corner.row, image, 0)];
    for (let i = 0; i < surroundingPixels.length; i++) {
      const neighbour = surroundingPixels[i];
      const neighbourScore =
        scoreArray[
          getIndex(
            corner.column + neighbour.column,
            corner.row + neighbour.row,
            image,
            0,
          )
        ];
      if (neighbourScore > currentScore) break;
      if (i === surroundingPixels.length - 1) {
        nmsKeypoints.push({ origin: corner, score: currentScore });
      }
    }
  }

  nmsKeypoints.sort((a, b) => b.score - a.score);

  return nmsKeypoints.slice(0, maxNbFeatures);
}
