import { Image } from '../Image';
import { Point } from '../geometry';
import checkProcessable from '../utils/checkProcessable';
import { getIndex } from '../utils/getIndex';
import { surroundingPixels } from '../utils/surroundingPixels';

import { getKeypointScore } from './getKeypointScore';
import { isFastKeypoint, IsFastKeypointOptions } from './isFastKeypoint';

export interface GetFastKeypointsOptions extends IsFastKeypointOptions {
  /**
   * Maximum number of features to return.
   *
   * @default 500
   */
  maxNbFeatures?: number;
}

export interface FastKeypoint {
  /**
   * Location of the keypoint in the image.
   */
  origin: Point;
  /**
   * Score of the keypoint, the bigger it is, the better the feature.
   */
  score: number;
}

/**
 * Find the features in a GREY image according to the FAST (Features from Accelerated Segment Test) algorithm.
 * Based on the paper Machine Learning for High-Speed Corner Detection
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
  const {
    maxNbFeatures = 500,
    nbContiguousPixels = 12,
    threshold = 20,
  } = options;

  checkProcessable(image, 'getFastKeypoints', {
    channels: [1],
    alpha: false,
  });

  let possibleCorners: Point[] = [];
  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      if (
        isFastKeypoint({ row, column }, image, {
          nbContiguousPixels,
          threshold,
        })
      ) {
        possibleCorners.push({ row, column });
      }
    }
  }

  // Non-Maximal Suppression
  let scoreArray = new Float64Array(image.size);
  for (let corner of possibleCorners) {
    scoreArray[getIndex(corner.column, corner.row, image, 0)] =
      getKeypointScore(corner, image, threshold);
  }

  const keypoints: FastKeypoint[] = [];
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
        keypoints.push({ origin: corner, score: currentScore });
      }
    }
  }

  keypoints.sort((a, b) => b.score - a.score);

  return keypoints.slice(0, maxNbFeatures);
}
