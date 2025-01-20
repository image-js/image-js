import type { Image } from '../../Image.js';
import type { Point } from '../../geometry/index.js';

/**
 * Crop the source image to given dimensions around the origin.
 * @param image - Source image.
 * @param origin - Center point for the crop.
 * @param patchSize - Size of the returned image.
 * @returns The square image around the origin extracted from the source image.
 */
export function extractSquareImage(
  image: Image,
  origin: Point,
  patchSize: number,
): Image {
  const cropOffset = (patchSize - 1) / 2;
  const cropOrigin = {
    column: origin.column - cropOffset,
    row: origin.row - cropOffset,
  };

  return image.crop({
    origin: cropOrigin,
    width: patchSize,
    height: patchSize,
  });
}
