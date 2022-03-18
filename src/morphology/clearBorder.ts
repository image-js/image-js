import { Mask } from '..';
import { borderIterator } from '../utils/borderIterator';
import { maskToOutputMask } from '../utils/getOutputImage';

export interface ClearBorderOptions {
  /**
   * Consider pixels connected by corners?
   *
   * @default false
   */
  allowCorners?: boolean;
  /**
   * Image to which the resulting image has to be put.
   */
  out?: Mask;
}

const MAX_ARRAY = 65536; // 65536 should be enough for most of the cases
const toProcess = new Uint16Array(MAX_ARRAY);

/**
 * Set the pixels connected to the border of the mask to zero. You can chose to allow corner connection of not with the `allowCorners` option.
 *
 * @param image - The mask to process.
 * @param options - Clear border options.
 * @returns The image with cleared borders.
 */
export function clearBorder(
  image: Mask,
  options: ClearBorderOptions = {},
): Mask {
  let { allowCorners = false } = options;

  // toProcess.fill(0);

  let newImage = maskToOutputMask(image, options, { clone: true });

  const maxValue = image.maxValue;

  let from = 0;
  let to = 0;

  // find relevant border pixels
  for (let pixelIndex of borderIterator(image)) {
    if (newImage.getBitByIndex(pixelIndex) === maxValue) {
      toProcess[to++ % MAX_ARRAY] = pixelIndex;
      newImage.setBitByIndex(pixelIndex, 0);
    }
  }

  // find pixels connected to the border pixels
  while (from < to) {
    const currentPixel = toProcess[from++ % MAX_ARRAY];
    newImage.setBitByIndex(currentPixel, 0);
    if (to - from > MAX_ARRAY) {
      throw new Error(
        'clearBorder: could not process image, overflow in the data processing array.',
      );
    }

    // check if pixel is on a border
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
      if (!topBorder) {
        if (!leftBorder) {
          const topLeft = currentPixel - image.width - 1;
          addToProcess(topLeft);
        }
        if (!rightBorder) {
          const topRight = currentPixel - image.width + 1;
          addToProcess(topRight);
        }
      }
      if (!bottomBorder) {
        if (!leftBorder) {
          const bottomLeft = currentPixel + image.width - 1;
          addToProcess(bottomLeft);
        }
        if (!rightBorder) {
          const bottomRight = currentPixel + image.width + 1;
          addToProcess(bottomRight);
        }
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
