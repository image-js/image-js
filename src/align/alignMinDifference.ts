import { Image, ImageColorModel, Point } from '..';
import { subtract } from '../compare/subtract';

export interface AlignMinDifferenceOptions {
  /**
   * Initial step size by which the images will be translated.
   * @default Math.min(source.width, source.height, Math.max(xSpan, ySpan))
   */
  startStep?: number;
}

/**
 * Aligns two images by finding the translation that minimizes the mean difference
 * between them. The source image should fit entirely in the destination image.
 * The images are converted to grayscale internally.
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
): Point {
  const xSpan = destination.width - source.width;
  const ySpan = destination.height - source.height;

  const {
    startStep = Math.min(source.width, source.height, Math.max(xSpan, ySpan)),
  } = options;

  if (xSpan < 0 || ySpan < 0) {
    throw new Error('Source image must fit entirely in destination image');
  }

  if (source.colorModel !== ImageColorModel.GREY) {
    source = source.grey();
  }
  if (destination.colorModel !== ImageColorModel.GREY) {
    destination = destination.grey();
  }

  let bestMean = Number.POSITIVE_INFINITY;
  let bestShiftX = 0;
  let bestShiftY = 0;

  let step = startStep;
  let startX = 0;
  let startY = 0;
  let endX = xSpan;
  let endY = ySpan;
  while (step >= 1) {
    for (let shiftX = startX; shiftX <= endX; shiftX += step) {
      for (let shiftY = startY; shiftY <= endY; shiftY += step) {
        const destinationCropped = destination.crop({
          origin: { row: shiftY, column: shiftX },
          width: source.width,
          height: source.height,
        });
        const imagesDiff = subtract(source, destinationCropped);
        const mean = imagesDiff.mean()[0];
        if (mean < bestMean) {
          console.log({ mean, shiftX, shiftY });
          bestMean = mean;
          bestShiftX = shiftX;
          bestShiftY = shiftY;
        }
      }
    }
    step /= 2;
    startX = Math.max(0, bestShiftX - step);
    startY = Math.max(0, bestShiftY - step);
    endX = Math.min(xSpan, bestShiftX + step);
    endY = Math.min(ySpan, bestShiftY + step);
  }

  return { row: bestShiftY, column: bestShiftX };
}
