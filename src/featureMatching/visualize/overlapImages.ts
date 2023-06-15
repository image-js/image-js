import { Image, ImageColorModel, Point, merge } from '../..';

export interface OverlapImageOptions {
  /**
   * Origin of the second image relatively to top-left corner of first image.
   *
   * @default {row: 0, column: 0}
   */
  origin?: Point;
}

/**
 * Overlap two images and specify the origin of the second one relatively to the first one. The first image is drawn in red and the second one in green.
 *
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
  const { origin = { row: 0, column: 0 } } = options;

  if (image1.colorModel !== ImageColorModel.GREY) {
    image1 = image1.grey();
  }
  if (image2.colorModel !== ImageColorModel.GREY) {
    image2 = image2.grey();
  }
  const inverted1 = image1.invert();
  const inverted2 = image2.invert();

  const empty = Image.createFrom(inverted1);

  const alignedGrey2 = inverted2.copyTo(empty, { origin });

  const result = merge([inverted1, alignedGrey2, empty]);

  return result;
}
