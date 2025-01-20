import type { Image } from '../../Image.js';

/**
 * Verify all images of array have the same bit depth and color model.
 * @param images - Images to process
 */
export function checkImagesValid(images: Image[]) {
  const colorModel = images[0].colorModel;
  const bitDepth = images[0].bitDepth;

  for (const image of images) {
    if (image.colorModel !== colorModel || image.bitDepth !== bitDepth) {
      throw new RangeError(
        `images must all have the same bit depth and color model`,
      );
    }
  }
}

/**
 * Checks if all the images of an array are the same dimensions.
 * @param images - Images array.
 * @returns `true` if all images have the same dimensions.
 */
export function verifySameDimensions(images: Image[]): boolean {
  const width = images[0].width;
  const height = images[0].height;

  for (const image of images) {
    if (image.width !== width || image.height !== height) {
      return false;
    }
  }
  return true;
}
