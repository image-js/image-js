import { Image } from '..';

/**
 * Compute the Peak signal-to-noise ratio (PSNR) between two images.
 * The larger the PSNR, the more similar the images.
 * https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio
 *
 * @param image - First image.
 * @param otherImage - Second image.
 * @returns PSNR of the two images in decibels.
 */
export function psnr(image: Image, otherImage: Image): number {
  const rmse = image.rmse(otherImage);

  return 20 * Math.log10(image.maxValue / (rmse + Number.MIN_VALUE));
}
