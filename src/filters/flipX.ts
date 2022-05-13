import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';

/**
 * Apply a flipX filter to an image.
 *
 * @param image - Image to process.
 * @returns The processed image.
 */
export default function flipX(image: IJS): IJS {
  checkProcessable(image, 'flipX', {
    bitDepth: [8, 16],
  });
  for (let i = 0; i < image.height; i++) {
    for (let j = 0; j < Math.floor(image.width / 2); j++) {
      const currentCol = j;
      const oppositeCol = image.width - j - 1;

      for (let k = 0; k < image.channels; k++) {
        const tmp = image.getValue(i, currentCol, k);
        image.setValue(i, currentCol, k, image.getValue(i, oppositeCol, k));
        image.setValue(i, oppositeCol, k, tmp);
      }
    }
  }

  return image;
}
