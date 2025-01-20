import { getAffineTransform } from 'ml-affine-transform';

import type { Point } from '../../geometry/index.js';

import { getMatrixFromPoints } from './getMatrixFromPoints.js';

/**
 * The fit function for an affine transformation.
 * Get the best transformation parameters for the given source and destination.
 * @param source - Source points.
 * @param destination - Destination points.
 * @returns The model parameters in the format [angle, xTranslation, yTranslation]
 */
export function affineFitFunction(
  source: Point[],
  destination: Point[],
): number[] {
  const sourceMatrix = getMatrixFromPoints(source);
  const destinationMatrix = getMatrixFromPoints(destination);
  const result = getAffineTransform(sourceMatrix, destinationMatrix);
  return [
    result.rotation,
    result.translation.x,
    result.translation.y,
    result.scale,
  ];
}
