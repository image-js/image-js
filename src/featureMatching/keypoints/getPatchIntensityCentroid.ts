import type { Image } from '../../Image.js';
import type { Point } from '../../geometry/index.js';

import type { GetPatchIntensityMomentOptions } from './getPatchIntensityMoment.js';
import { getPatchIntensityMoment } from './getPatchIntensityMoment.js';

/**
 * Compute the intensity centroid of the circular patch in an image for each channel relatively to the center of the image.
 * Original article: {@link https://doi.org/10.1006/cviu.1998.0719}.
 * @see {@link https://en.wikipedia.org/wiki/Image_moment}
 * @param image - Image to process.
 * @param options - Patch intensity centroid options.
 * @returns The intensity centroid of each channel of the image.
 */
export function getPatchIntensityCentroid(
  image: Image,
  options: GetPatchIntensityMomentOptions = {},
): Point[] {
  const moment10 = getPatchIntensityMoment(image, 1, 0, options);
  const moment01 = getPatchIntensityMoment(image, 0, 1, options);
  const moment00 = getPatchIntensityMoment(image, 0, 0, options);
  const centroid: Point[] = [];

  for (let channel = 0; channel < image.channels; channel++) {
    if (moment00[channel] === 0) {
      centroid.push({
        column: 0,
        row: 0,
      });
    } else {
      centroid.push({
        column: moment10[channel] / moment00[channel],
        row: moment01[channel] / moment00[channel],
      });
    }
  }

  return centroid;
}
