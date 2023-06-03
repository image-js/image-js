import { Image } from '..';

import { computeSsim, SsimOptions } from './computeSsim';

/**
 * Compute the Structural Dissimilarity (DSSIM) of two GREY images.
 * @see {@link https://en.wikipedia.org/wiki/Structural_similarity}
 * @param image - First image.
 * @param otherImage - Second image.
 * @param options - Options.
 * @returns SSIM of the two images.
 */
export function computeDssim(
  image: Image,
  otherImage: Image,
  options: SsimOptions = {},
): number {
  const ssim = computeSsim(image, otherImage, options).mssim;
  return (1 - ssim) / 2;
}
