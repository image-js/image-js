import type { Image } from '../../image_js.ts';

/**
 * Apply a derivative filter to the source image.
 * @param image - Input image.
 * @returns The treated image.
 */
export function testDerivativeFilter(image: Image): Image {
  image = image.convertColor('GREY');
  return image.derivativeFilter({ filter: 'prewitt' });
}
