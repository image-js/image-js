import { Image } from '..';

/**
 * Compute the Root Mean Square Error (RMSE) between two images. It is just the square root of the MSE.
 * https://en.wikipedia.org/wiki/Root-mean-square_deviation
 *
 * @param image - First image.
 * @param otherImage - Second image.
 * @returns RMSE of the two images.
 */
export function rmse(image: Image, otherImage: Image): number {
  const mse = image.mse(otherImage);

  return Math.sqrt(mse);
}

/**
 * Compute the Mean Square Error (MSE) between two images.
 *
 * @param image - First image.
 * @param otherImage - Second image.
 * @returns MSE of the two images.
 */
export function mse(image: Image, otherImage: Image): number {
  const difference = image.subtract(otherImage, { absolute: true });
  let sum = 0;
  for (let i = 0; i < image.size; i++) {
    for (let channel = 0; channel < image.channels; channel++) {
      const value = difference.getValueByIndex(i, channel);
      sum += Math.pow(value, 2);
    }
  }
  return sum / (image.size * image.channels);
}
