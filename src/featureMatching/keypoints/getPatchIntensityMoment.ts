import type { Image } from '../../Image.js';
import type { Point } from '../../geometry/index.js';
import { getFilledCirclePoints } from '../../utils/geometry/getCirclePoints.js';
import { checkBorderDistance } from '../utils/checkBorderDistance.js';

export interface GetPatchIntensityMomentOptions {
  /**
   * Center of the circular window.
   * @default `image.getCoordinates('center')`
   */
  center?: Point;
  /**
   * Radius of the circular window.
   * @default `3`
   */
  radius?: number;
}

/**
 * Compute the pq order intensity moment of the circular patch with given radius in the image,
 * relatively to the origin defined in the options.
 * Original article: {@link https://doi.org/10.1006/cviu.1998.0719}.
 * @see {@link https://en.wikipedia.org/wiki/Image_moment}
 * @param image - Image to process.
 * @param p - Order along x.
 * @param q - Order along y.
 * @param options - Get intensity moment options.
 * @returns The intensity moment of order pq of the circular window relative to the center.
 */
export function getPatchIntensityMoment(
  image: Image,
  p: number,
  q: number,
  options: GetPatchIntensityMomentOptions = {},
): number[] {
  const { center: origin = image.getCoordinates('center'), radius = 3 } =
    options;

  if (!checkBorderDistance(image, origin, radius)) {
    throw new RangeError(`desired patch is too close to image border`);
  }
  const moment = new Array<number>(image.channels).fill(0);

  const relativeCirclePoints = getFilledCirclePoints(radius);
  for (const point of relativeCirclePoints) {
    for (let channel = 0; channel < image.channels; channel++) {
      const intensity = image.getValue(
        point.column + origin.column,
        point.row + origin.row,
        channel,
      );
      moment[channel] += point.column ** p * point.row ** q * intensity;
    }
  }
  return moment;
}
