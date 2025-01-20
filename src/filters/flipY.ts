import type { Image } from '../Image.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

/**
 * Apply a flipY filter to an image.
 * @param image - Image to process.
 * @returns The processed image.
 */
export default function flipY(image: Image): Image {
  checkProcessable(image, {
    bitDepth: [8, 16],
  });

  for (let row = 0; row < Math.floor(image.height / 2); row++) {
    for (let column = 0; column < image.width; column++) {
      const currentRow = row;
      const oppositeRow = image.height - row - 1;

      for (let channel = 0; channel < image.channels; channel++) {
        const tmp = image.getValue(column, currentRow, channel);
        image.setValue(
          column,
          currentRow,

          channel,
          image.getValue(column, oppositeRow, channel),
        );
        image.setValue(column, oppositeRow, channel, tmp);
      }
    }
  }

  return image;
}
