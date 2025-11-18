import type { Image } from '../../image_js.ts';

/**
 * Enhance contrast of the source image using level.
 * @param image - Input image.
 * @returns The treated image.
 */
export function testLevel(image: Image): Image {
  return image.level({
    inputMin: 50,
    inputMax: 200,
    outputMin: 255,
    outputMax: 0,
  });
}
