import type { Image } from '../../Image.js';
import type { Point } from '../../geometry/index.js';
import type { GetHarrisScoreOptions } from '../featureMatching.types.js';

import { getEigenvaluesForScore } from './getEigenvaluesForScore.js';

/**
 * Get the Harris score of a corner. The idea behind the algorithm is that a
 * slight shift of a window around a corner along x and y should result in
 * a very different image.
 *
 * We distinguish 3 cases:
 * - the score is highly negative: you have an edge
 * - the absolute value of the score is small: the region is flat
 * - the score is highly positive: you have a corner.
 * @see {@link https://en.wikipedia.org/wiki/Harris_corner_detector}
 * @param image - Image to which the corner belongs. It must be a greyscale image with only one channel.
 * @param origin - Center of the window, where the corner should be.
 * @param options - Get Harris score options.
 * @returns The Harris score.
 */
export function getHarrisScore(
  image: Image,
  origin: Point,
  options: GetHarrisScoreOptions = {},
): number {
  const { harrisConstant = 0.04, windowSize } = options;
  const eigenValues = getEigenvaluesForScore(image, origin, windowSize);

  return (
    eigenValues[0] * eigenValues[1] -
    harrisConstant * (eigenValues[0] + eigenValues[1]) ** 2
  );
}
