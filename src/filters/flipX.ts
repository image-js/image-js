import type { Image } from '../Image.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

/**
 * Apply a flipX filter to an image.
 * @param image - Image to process.
 * @returns The processed image.
 */
export default function flipX(image: Image): Image {
  checkProcessable(image, {
    bitDepth: [8, 16],
  });
  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < Math.floor(image.width / 2); column++) {
      const currentCol = column;
      const oppositeCol = image.width - column - 1;

      for (let channel = 0; channel < image.channels; channel++) {
        const tmp = image.getValue(currentCol, row, channel);
        image.setValue(
          currentCol,
          row,
          channel,
          image.getValue(oppositeCol, row, channel),
        );
        image.setValue(oppositeCol, row, channel, tmp);
      }
    }
  }

  return image;
}
