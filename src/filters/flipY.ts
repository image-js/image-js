import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';

/**
 * Apply a flipY filter to an image.
 *
 * @param image - Image to process.
 * @returns The processed image.
 */
export default function flipY(image: IJS): IJS {
  checkProcessable(image, 'flipY', {
    bitDepth: [8, 16],
  });

  for (let i = 0; i < Math.floor(image.height / 2); i++) {
    for (let j = 0; j < image.width; j++) {
      const currentRow = i;
      const oppositeRow = image.height - i - 1;

      for (let k = 0; k < image.channels; k++) {
        const tmp = image.getValue(currentRow, j, k);
        image.setValue(currentRow, j, k, image.getValue(oppositeRow, j, k));
        image.setValue(oppositeRow, j, k, tmp);
      }
    }
  }

  return image;
}
