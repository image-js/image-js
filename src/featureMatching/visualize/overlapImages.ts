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
 *
 * @param image1
 * @param image2
 * @param options
 */
export function overlapImages(
  image1: Image,
  image2: Image,
  options: OverlapImageOptions = {},
): Image {
  const { origin = { row: 0, column: 0 } } = options;

  const grey1 = image1.grey().invert();
  const grey2 = image2.grey().invert();

  const empty = Image.createFrom(grey1, {
    colorModel: ImageColorModel.GREY,
  });

  const alignedGrey2 = grey2.copyTo(empty, { origin });

  const result = merge([grey1, alignedGrey2, empty]);

  return result;
}
