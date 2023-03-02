import { Image, ImageCoordinates } from '../../Image';
import { Point } from '../../geometry';
import { checkBorderDistance } from '../utils/checkBorderDistance';

export interface GetPatchIntensityMomentOptions {
  /**
   * Center of the circular window.
   *
   * @default The center of the image.
   */
  origin?: Point;
  /**
   * Radius of the circular window.
   *
   * @default 3
   */
  radius?: number;
}

/**
 * Compute the pq order intensity moment of the circular patch with given radius in the image,
 * relatively to the origin defined in the options.
 * Original article: {@link https://doi.org/10.1006/cviu.1998.0719}
 *
 * @see {@link https://en.wikipedia.org/wiki/Image_moment}
 * @param image - Image to process.
 * @param p - Order along x.
 * @param q - Order along y.
 * @param options - Get intensity moment options.
 * @returns The intensity moment of order pq or the circular window.
 */
export function getPatchIntensityMoment(
  image: Image,
  p: number,
  q: number,
  options: GetPatchIntensityMomentOptions = {},
): number[] {
  const { origin = image.getCoordinates(ImageCoordinates.CENTER), radius = 3 } =
    options;

  if (!checkBorderDistance(image, origin, radius)) {
    throw new Error(`desired patch is too close to image border`);
  }

  let moment = new Array(image.channels).fill(0);
  for (let row = origin.row - radius; row < origin.row + radius; row++) {
    for (
      let column = origin.column - radius;
      column < origin.column + radius;
      column++
    ) {
      const xDistance = column - origin.column;
      const yDistance = row - origin.row;

      if (xDistance ** 2 + yDistance ** 2 <= radius ** 2) {
        for (let channel = 0; channel < image.channels; channel++) {
          const intensity = image.getValue(column, row, channel);
          moment[channel] += xDistance ** p * yDistance ** q * intensity;
        }
      }
    }
  }
  return moment;
}
