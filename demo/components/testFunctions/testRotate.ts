import type { Image } from '../../image_js.ts';

/**
 * Apply a derivative filter to the source image.
 * @param image - Input image.
 * @returns The treated image.
 */
export function testRotate(image: Image): Image {
  return image.transformRotate(-15, { center: 'bottom-right' });
}
