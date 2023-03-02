import { Image, ImageCoordinates } from '../../../src';

/**
 * Apply a derivative filter to the source image.
 *
 * @param image - Input image.
 * @returns The treated image.
 */
export function testRotate(image: Image): Image {
  return image.transformRotate(-15, { center: ImageCoordinates.BOTTOM_RIGHT });
}
