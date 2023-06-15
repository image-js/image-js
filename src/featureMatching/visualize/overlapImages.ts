import { writeSync, Image, ImageColorModel, Point, merge } from '../..';

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

  if (image1.colorModel !== ImageColorModel.GREY) {
    image1 = image1.grey();
  }
  if (image2.colorModel !== ImageColorModel.GREY) {
    image2 = image2.grey();
  }
  const inverted1 = image1.invert();
  const inverted2 = image2.invert();

  writeSync(`${__dirname}/inverted1.png`, inverted1);
  writeSync(`${__dirname}/inverted2.png`, inverted2);

  const empty = Image.createFrom(inverted1);

  writeSync(`${__dirname}/empty.png`, empty);

  const alignedGrey2 = inverted2.copyTo(empty, { origin });
  writeSync(`${__dirname}/aligned.png`, alignedGrey2);

  const result = merge([inverted1, alignedGrey2, empty]);

  return result;
}
