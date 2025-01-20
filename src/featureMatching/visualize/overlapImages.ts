import { Image, ImageCoordinates } from '../../Image.js';
import type { Point } from '../../geometry/index.js';
import { merge } from '../../operations/index.js';
import { ImageColorModel } from '../../utils/constants/colorModels.js';

export interface OverlapImageOptions {
  /**
   * Origin of the second image relatively to top-left corner of first image.
   * @default `{row: 0, column: 0}`
   */
  origin?: Point;

  /**
   * Desired rotation of image 2 in degrees around its top-left corner.
   * @default `0`
   */
  angle?: number;

  /**
   * Factor by which to scale the second image.
   *  @default `1`
   */
  scale?: number;
}

/**
 * Overlap two images and specify. The first image can be translated,
 * rotated and scaled to match the second one.
 * The first image is drawn in red and the second one in green.
 * @param image1 - First image.
 * @param image2 - Second image.
 * @param options - Overlap image options.
 * @returns The overlapping images.
 */
export function overlapImages(
  image1: Image,
  image2: Image,
  options: OverlapImageOptions = {},
): Image {
  const { origin = { row: 0, column: 0 }, angle = 0, scale = 1 } = options;

  if (scale === 0) {
    throw new Error('Scale cannot be 0');
  }

  if (image1.colorModel !== ImageColorModel.GREY) {
    image1 = image1.grey();
  }
  if (image2.colorModel !== ImageColorModel.GREY) {
    image2 = image2.grey();
  }
  const inverted1 = image1.invert();
  const inverted2 = image2.invert();

  const rotated = inverted1.transformRotate(angle, {
    center: ImageCoordinates.TOP_LEFT,
  });
  const scaled = rotated.resize({ xFactor: scale, yFactor: scale });

  const empty = Image.createFrom(inverted2);

  const alignedGrey1 = scaled.copyTo(empty, { origin });

  const result = merge([alignedGrey1, inverted2, empty]);

  return result;
}
