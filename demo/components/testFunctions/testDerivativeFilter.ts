import { DerivativeFilters, IJS, ImageColorModel } from '../../../src';

/**
 * Apply a derivative filter to the source image.
 *
 * @param image - Input image.
 * @returns The treated image.
 */
export function testDerivativeFilter(image: IJS): IJS {
  image = image.convertColor(ImageColorModel.GREY);
  return image.derivativeFilter({ filter: DerivativeFilters.PREWITT });
}
