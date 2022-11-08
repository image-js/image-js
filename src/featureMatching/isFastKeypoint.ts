import { Image } from '../Image';
import { Point } from '../geometry';

export interface IsFastKeypointOptions {
  /**
   * Number of contiguous pixels on the circle that should have an intensity difference with current pixel larger than threshold.
   * This value is recommended to be 12.
   *
   * @default 12
   */
  nbContiguousPixels?: number;
  /**
   * Threshold for the intensity difference.
   *
   * @default 20
   */
  threshold?: number;
}

// Points for a circle with radius = 3
export const circlePoints = [
  { row: 0, column: 3 },
  { row: 1, column: 3 },
  { row: 2, column: 2 },
  { row: 3, column: 1 },
  { row: 3, column: 0 },
  { row: 3, column: -1 },
  { row: 2, column: -2 },
  { row: 1, column: -3 },
  { row: 0, column: -3 },
  { row: -1, column: -3 },
  { row: -2, column: -2 },
  { row: -3, column: -1 },
  { row: -3, column: 0 },
  { row: -3, column: 1 },
  { row: -2, column: 2 },
  { row: -1, column: 3 },
];

const quickTestPoints = [
  { row: 0, column: 3 },
  { row: 3, column: 0 },
  { row: 0, column: -3 },
  { row: -3, column: 0 },
];

/**
 * Determine wether a pixel in an image is a corner according to the FAST algorithm.
 *
 * @param origin - Pixel to process.
 * @param image - Image to process
 * @param options - Is FAST keypoint options.
 * @returns Whether the current pixel is a corner or not.
 */
export function isFastKeypoint(
  origin: Point,
  image: Image,
  options: IsFastKeypointOptions = {},
): boolean {
  const { nbContiguousPixels = 12, threshold = 20 } = options;
  const currentIntensity = image.getValue(origin.column, origin.row, 0);
  let brighter = 0;
  let darker = 0;

  // quick test to exlude non corners
  if (nbContiguousPixels >= 12) {
    for (let point of quickTestPoints) {
      const pointIntensity = image.getValue(
        origin.column + point.column,
        origin.row + point.row,
        0,
      );
      if (currentIntensity - pointIntensity > threshold) {
        darker++;
      } else if (pointIntensity - currentIntensity > threshold) {
        brighter++;
      }
    }
    if (darker < 3 && brighter < 3) return false;
  }

  // determine whether points on circle are darker or brighter
  let comparisonArray = [];
  for (let point of circlePoints) {
    const pointIntensity = image.getValue(
      origin.column + point.column,
      origin.row + point.row,
      0,
    );
    if (currentIntensity + threshold <= pointIntensity) {
      comparisonArray.push(-1); // circle point is lighter
    } else if (pointIntensity <= currentIntensity - threshold) {
      comparisonArray.push(1); // circle point is darker
    } else {
      comparisonArray.push(0); // circle point is similar
    }
  }

  // compute number of repeating and touching values
  let currentLength = 1;
  let counterArray = [];
  for (let i = 0; i < comparisonArray.length; i++) {
    const currentValue = comparisonArray[i];
    const nextValue = comparisonArray[(i + 1) % comparisonArray.length];

    if (currentValue === nextValue) {
      if (i === comparisonArray.length - 1) {
        if (counterArray.length === 0) {
          counterArray.push(currentLength);
        } else {
          counterArray[0] += currentLength;
        }
      } else {
        currentLength++;
      }
    } else {
      counterArray.push(currentLength);
      currentLength = 1;
    }
  }

  if (Math.max(...counterArray) >= nbContiguousPixels) {
    return true;
  } else {
    return false;
  }
}
