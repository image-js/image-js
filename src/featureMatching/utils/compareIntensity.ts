import type { Image } from '../../Image.js';
import type { Point } from '../../geometry/index.js';
import { sum } from '../../utils/geometry/points.js';

export interface CompareIntensityOptions {
  /**
   * Origin of the points coordinates relative to the top-left corner.
   * @default `image.getCoordinates('center')`
   */
  origin?: Point;
}

/**
 * Compare the intensity of two pixels of a GREY image.
 * @param image - Source image of the pixels.
 * @param p1 - First point.
 * @param p2 - Second point.
 * @param options - Options.
 * @returns Wether p1 is darker that p2.
 */
export function compareIntensity(
  image: Image,
  p1: Point,
  p2: Point,
  options: CompareIntensityOptions = {},
): boolean {
  const { origin = image.getCoordinates('center') } = options;

  const absoluteP1 = sum(p1, origin);
  const absoluteP2 = sum(p2, origin);
  const intensity1 = image.getValueByPoint(absoluteP1, 0);
  const intensity2 = image.getValueByPoint(absoluteP2, 0);

  return intensity1 < intensity2;
}
