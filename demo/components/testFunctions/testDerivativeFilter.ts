import { DerivativeFilters, Image, ImageColorModel } from '../../../src';

/**
 * Apply a derivative filter to the source image.
 *
 * @param image - Input image.
 * @returns The treated image.
 */
export function testDerivativeFilter(image: Image): Image {
  image = image.convertColor(ImageColorModel.GREY);
  return image.derivativeFilter({ filter: DerivativeFilters.PREWITT });
}
