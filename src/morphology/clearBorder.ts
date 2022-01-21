import { Mask } from '..';
import { borderIterator } from '../utils/borderIterator';

export interface ClearBorderOptions {
  allowCorners?: boolean;
  /**
   * Image to which the inverted image has to be put.
   */
  out?: Mask;
}

const MAX_ARRAY = 0x00ffff; // 65535 should be enough for most of the cases
const toProcess = new Uint16Array(MAX_ARRAY + 1);

/**
 * Set the pixels connected to the border of the image to zero. You can chose to allow corner connection of not with the `allowCorners` option.
 *
 * @param image - The image to process.
 * @param options - Clear border options.
 * @returns The image with cleared borders.
 */
export function clearBorder(
  image: Mask,
  options: ClearBorderOptions = {},
): Mask {
  let { allowCorners = false } = options;

  const maxValue = image.maxValue;

  let from = 0;
  let to = 0;

  let newImage = image.clone();

  // find relevant border pixels
  for (let pixelIndex of borderIterator(image)) {
    if (newImage.getBitByIndex(pixelIndex) === maxValue) {
      toProcess[to++ % MAX_ARRAY] = pixelIndex;
      newImage.setBitByIndex(pixelIndex, 0);
    }
  }

  // find pixels connected to the border pixels
  while (from <= to) {
    const currentPixel = toProcess[from++ % MAX_ARRAY];
    newImage.setBitByIndex(currentPixel, 0);
    if (to - from > MAX_ARRAY) {
      throw new Error(
        'clearBorder could not process image, overflow in the data processing array.',
      );
    }

    // check if on a border
    const topBorder = currentPixel < image.width;
    const leftBorder = currentPixel % image.width === 0;
    const rightBorder = currentPixel % image.width === image.width - 1;
    const bottomBorder = currentPixel > image.size - image.width;

    // check neighbours

    if (!bottomBorder) {
      const bottom = currentPixel + image.width;
      addToProcess(bottom);
    }
    if (!leftBorder) {
      const left = currentPixel - 1;
      addToProcess(left);
    }
    if (!topBorder) {
      const top = currentPixel - image.width;
      addToProcess(top);
    }
    if (!rightBorder) {
      const right = currentPixel + 1;
      addToProcess(right);
    }
    if (allowCorners) {
      if (!leftBorder && !topBorder) {
        const topLeft = currentPixel - image.width - 1;
        addToProcess(topLeft);
      }
      if (!topBorder && !rightBorder) {
        const topRight = currentPixel - image.width + 1;
        addToProcess(topRight);
      }
      if (!leftBorder && !bottomBorder) {
        const bottomLeft = currentPixel + image.width - 1;
        addToProcess(bottomLeft);
      }
      if (!bottomBorder && !rightBorder) {
        const bottomRight = currentPixel + image.width + 1;
        addToProcess(bottomRight);
      }
    }
  }

  return newImage;

  function addToProcess(pixel: number): void {
    if (newImage.getBitByIndex(pixel) === image.maxValue) {
      toProcess[to++ % MAX_ARRAY] = pixel;
    }
  }
}
