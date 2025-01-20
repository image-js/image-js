import { createRandomArray } from 'ml-spectra-processing';

import type { Point } from '../../geometry/index.js';
import { getClampFromTo } from '../../utils/clamp.js';
import type { GetGaussianPointsOptions } from '../../utils/utils.types.js';

/**
 * Get the coordinates of random points inside of the given dimensions, spread with a
 * gaussian distribution around the center of the dimensions.
 * The reference point with coordinates (0,0) is the center of the patch.
 * @param width - Width in which the points should be.
 * @param height - Height in which the points should be.
 * @param options - Get gaussian points options.
 * @returns An array of random points with a gaussian distribution.
 */
export function getGaussianPoints(
  width: number,
  height: number,
  options: GetGaussianPointsOptions = {},
): Point[] {
  const { nbPoints = 1024, xSeed = 0, ySeed = 1, sigma } = options;

  const xCoordinates = getGaussianValues(width, xSeed, nbPoints, sigma);
  const yCoordinates = getGaussianValues(height, ySeed, nbPoints, sigma);

  const points: Point[] = [];
  for (let i = 0; i < nbPoints; i++) {
    points.push({ column: xCoordinates[i], row: yCoordinates[i] });
  }

  return points;
}

/**
 * Generate an array of values
 * that follow a gaussian distribution with a mean value of zero.
 * @param size - Specifies the width of the gaussian distribution.
 * @param seed - Seed for the random generator.
 * @param nbValues - Number of values wanted.
 * @param sigma - The standard deviation. The default value is the optimal SD for BRIEF.
 * @returns Array of values with gaussian distribution.
 */
export function getGaussianValues(
  size: number,
  seed: number,
  nbValues: number,
  sigma = size / 5,
): Float64Array {
  const width = (size - 1) / 2;

  const array = createRandomArray({
    distribution: 'normal',
    seed,
    length: nbValues,
    standardDeviation: sigma,
    mean: 0,
  });
  const clamp = getClampFromTo(-width, width);

  return array.map((value) => {
    const rounded = Math.round(value);
    return clamp(rounded);
  });
}
