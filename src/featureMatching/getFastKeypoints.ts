import { Image } from '../Image';
import { Point } from '../geometry';
import checkProcessable from '../utils/checkProcessable';
import { getCirclePoints, getCompassPoints } from '../utils/getCirclePoints';

export interface GetFastKeypointsOptions {
  /**
   * Maximum number of features to return.
   *
   * @default 500
   */
  maxNbFeatures: number;
}

export interface FastKeypoint {
  /**
   * Location of the keypoint in the image.
   */
  origin: Point;
  /**
   * Score of the keypoint, the smaller it is, the better the feature.
   */
  score: number;
}

/**
 * Find the features in a GREY image according to the FAST (Features from Accelerated Segment Test) algorithm.
 * Based on the paper Machine Learning for High-Speed Corner Detection
 * DOI: https://doi.org/10.1007/11744023_34
 *
 * @param image
 * @param options
 * @returns The FAST keypoints.
 */
export function getFastKeypoints(
  image: Image,
  options: GetFastKeypointsOptions,
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

  const fastRadius = 3;

  const compassPoints = getCompassPoints(fastRadius);
  const circlePoints = getCirclePoints(fastRadius);

  return 0;
}
