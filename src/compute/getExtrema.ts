import type { Image } from '../Image.js';
import type { Mask } from '../Mask.js';
import type { Point } from '../geometry/index.js';
import { assertUnreachable } from '../utils/validators/assert.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

export interface ExtremaOptions {
  /**
   * Chooses what kind of extremum to compute.
   * @default `'maximum'`
   */
  kind?: 'minimum' | 'maximum';
  /**
   * Uses mask to check if a point belongs to a ROI or not
   * @default `undefined`
   */
  mask?: Mask;
  /**
   * Chooses what kind of coverage algorithm to use to compute the extremum.
   * @default `'star'`
   */
  algorithm?: 'cross' | 'square' | 'star';
  /**
   * Maximum number of points that can be equal to the extremum
   * @default `2`
   */
  maxEquals?: number;
}
/**
 * Checks the surrounding values of a point. If they are all bigger or smaller than the pixel in question then this point is considered an extremum.
 * @param image - Image to find extrema from.
 * @param options - ExtremaOptions
 * @returns Array of Points.
 */
export function getExtrema(image: Image, options: ExtremaOptions): Point[] {
  const { kind = 'maximum', mask, algorithm = 'star', maxEquals = 2 } = options;
  checkProcessable(image, {
    bitDepth: [8, 16],
  });
  const searchingMinimum = kind === 'minimum';

  const maskExpectedValue = searchingMinimum ? 0 : 1;

  const dx = [1, 0, -1, 0, 1, 1, -1, -1, 2, 0, -2, 0, 2, 2, -2, -2];
  const dy = [0, 1, 0, -1, 1, -1, 1, -1, 0, 2, 0, -2, 2, -2, 2, -2];
  switch (algorithm) {
    case 'cross':
      dx.length = 4;
      dy.length = 4;
      break;
    case 'square':
      dx.length = 8;
      dy.length = 8;
      break;
    case 'star':
      break;
    default:
      assertUnreachable(algorithm);
  }
  const shift = dx.length <= 8 ? 1 : 2; // deal with borders
  const points: Point[] = [];
  for (let channel = 0; channel < image.channels; channel++) {
    for (let currentY = shift; currentY < image.height - shift; currentY++) {
      for (let currentX = shift; currentX < image.width - shift; currentX++) {
        if (mask && mask.getBit(currentX, currentY) !== maskExpectedValue) {
          continue;
        }
        let counter = 0;
        let nbEquals = 0;
        const currentValue = image.getValue(currentX, currentY, channel);
        for (let dir = 0; dir < dx.length; dir++) {
          const currentAroundValue = image.getValue(
            currentX + dx[dir],
            currentY + dy[dir],
            channel,
          );
          if (searchingMinimum) {
            // we search for minima
            if (currentAroundValue > currentValue) {
              counter++;
            }
          } else if (currentAroundValue < currentValue) {
            counter++;
          }
          if (currentAroundValue === currentValue) {
            nbEquals++;
          }
        }
        if (counter + nbEquals === dx.length && nbEquals <= maxEquals) {
          points.push({ column: currentX, row: currentY });
        }
      }
    }
  }

  // TODO How to make a more performant and general way
  // we don't deal correctly here with groups of points that should be grouped if at the
  // beginning one of them is closer to another
  // Seems that we would ened to calculate a matrix and then split this matrix in 'independant matrices'
  // Or to assign a cluster to each point and regroup them if 2 clusters are close to each other
  // later approach seems much better
  return points;
}
