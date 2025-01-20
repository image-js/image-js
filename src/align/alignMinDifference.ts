import type { Image } from '../Image.js';
import type { Mask } from '../Mask.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

export interface AlignMinDifferenceOptions {
  /**
   * Initial step size by which the images will be translated.
   * @default `Math.max(Math.round(Math.min(source.width, source.height, Math.max(xSpan, ySpan)) / 10,),1,)`
   */
  startStep?: number;
  mask?: Mask;
}

/**
 * Aligns two images by finding the translation that minimizes the mean difference of all channels.
 * between them. The source image should fit entirely in the destination image.
 * @param source - Image to align.
 * @param destination - Image to align to.
 * @param options - Align images min difference options.
 * @returns Translation that minimizes the mean difference between the images.
 * Gives the origin of the source image relatively to the top-left corner of the destination image.
 */
export function alignMinDifference(
  source: Image,
  destination: Image,
  options: AlignMinDifferenceOptions = {},
) {
  checkProcessable(source, {
    bitDepth: [8, 16],
  });

  const xSpan = destination.width - source.width;
  const ySpan = destination.height - source.height;
  const {
    startStep = Math.max(
      Math.round(
        Math.min(source.width, source.height, Math.max(xSpan, ySpan)) / 4,
      ),
      1,
    ),
    mask,
  } = options;

  if (xSpan < 0 || ySpan < 0) {
    throw new Error('Source image must fit entirely in destination image');
  }

  let bestDifference = Number.POSITIVE_INFINITY;
  let bestShiftX = 0;
  let bestShiftY = 0;

  let step = startStep;
  let startX = 0;
  let startY = 0;
  let endX = xSpan;
  let endY = ySpan;

  if (mask && mask.size !== source.size) {
    throw new Error('Mask size must be equal to source size');
  }

  const nbPixelsToCheck = mask ? mask.getNbNonZeroPixels() : source.size;

  while (step >= 1) {
    step = Math.round(step);

    for (let shiftX = startX; shiftX <= endX; shiftX += step) {
      for (let shiftY = startY; shiftY <= endY; shiftY += step) {
        let currentDifference = 0;
        next: for (let column = 0; column < source.width; column++) {
          for (let row = 0; row < source.height; row++) {
            if (mask && !mask.getBit(column, row)) {
              continue;
            }
            for (let channel = 0; channel < source.channels; channel++) {
              const sourceValue = source.getValue(column, row, channel);
              const destinationValue = destination.getValue(
                column + shiftX,
                row + shiftY,
                channel,
              );
              const difference = sourceValue - destinationValue;
              if (difference < 0) {
                // Math.abs is super slow, this simple trick is 5x faster
                currentDifference -= difference;
              } else {
                currentDifference += difference;
              }
              if (currentDifference > bestDifference) {
                break next;
              }
            }
          }
        }
        if (currentDifference < bestDifference) {
          bestDifference = currentDifference;
          bestShiftX = shiftX;
          bestShiftY = shiftY;
        }
      }
    }
    step /= 2;
    startX = Math.round(Math.max(0, bestShiftX - step));
    startY = Math.round(Math.max(0, bestShiftY - step));
    endX = Math.round(Math.min(xSpan, bestShiftX + step));
    endY = Math.round(Math.min(ySpan, bestShiftY + step));
  }

  return {
    row: bestShiftY,
    column: bestShiftX,
    similarity: 1 - bestDifference / (nbPixelsToCheck * source.maxValue),
  };
}
