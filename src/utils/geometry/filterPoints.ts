import { Image } from '../..';

import { Point } from './points';

interface FilterPointsOptions {
  /**
   * The number of points that should be removed if they are close to extremum.
   * @default 0
   */
  removeClosePoints?: number;
  /**
   * Shows what kind of extremum is being computed.
   * @default 'maximum'
   */
  kind?: 'minimum' | 'maximum';
  /**
   * Channel number of an image where the extremum should be found.
   * @default 0
   */
  channel?: number;
}
/**
 * Finds extreme values of an image which are not stacked together.
 * @param points - Array of points that should be combined to improve.
 * @param image - Image which extrema are calculated from.
 * @param options - FilterPointsOptions
 * @returns Array of Points.
 */
export function filterPoints(
  points: Point[],
  image: Image,
  options: FilterPointsOptions,
) {
  const { removeClosePoints = 0, kind = 'maximum' } = options;
  let { channel } = options;
  if (channel === undefined) {
    if (image.channels > 1) {
      throw new Error(
        'image channel must be specified or image must have only one channel',
      );
    } else {
      channel = 0;
    }
  }

  const isMax = kind === 'maximum';

  const sortedPoints = points.slice().sort((a, b) => {
    return (
      image.getValue(a.column, a.row, channel as number) -
      image.getValue(b.column, b.row, channel as number)
    );
  });
  if (!isMax) {
    sortedPoints.reverse();
  }

  if (removeClosePoints > 0) {
    for (let i = 0; i < sortedPoints.length; i++) {
      for (let j = i + 1; j < sortedPoints.length; j++) {
        if (
          Math.hypot(
            sortedPoints[i].column - sortedPoints[j].column,
            sortedPoints[i].row - sortedPoints[j].row,
          ) < removeClosePoints &&
          image.getValue(
            sortedPoints[i].column,
            sortedPoints[i].row,
            channel,
          ) >=
            image.getValue(sortedPoints[j].column, sortedPoints[j].row, channel)
        ) {
          sortedPoints.splice(j, 1);
          j--;
        }
      }
    }
  }
  return sortedPoints;
}
