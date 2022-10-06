import { Image } from '..';

/**
 * Compute the Structural Similarity (SSIM) of two images.
 * " The resultant SSIM index is a decimal value between -1 and 1,
 * where 1 indicates perfect similarity, 0 indicates no similarity,
 * and -1 indicates perfect anti-correlation." -
 * https://en.wikipedia.org/wiki/Structural_similarity
 *
 * @param image - First image.
 * @param otherImage - Second image.
 * @returns SSIM of the two images.
 */
export function ssim(image: Image, otherImage: Image): number {
  const rmse = image.rmse(otherImage);

  return 20 * Math.log10(image.maxValue / (rmse + Number.MIN_VALUE));
}
