import type { Image } from '../../Image.js';

import type { Point } from './points.js';

export interface RemoveClosePointsOptions {
  /**
   * The minimum distance between points in the returned filtered points. If the distance is less or equal to 0, no point is removed.
   * @default `0`
   */
  distance: number;
  /**
   * Shows what kind of extremum is being computed.
   * @default `'maximum'`
   */
  kind: 'minimum' | 'maximum';
  /**
   * Channel number of an image where the extremum should be found.
   * @default `0`
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
export function removeClosePoints(
  points: Point[],
  image: Image,
  options: RemoveClosePointsOptions,
) {
  const distance = options?.distance || 0;
  const kind = options?.kind || 'maximum';

  if (options?.channel === undefined && image.channels > 1) {
    throw new Error(
      'image channel must be specified or image must have only one channel',
    );
  }
  const channel = options?.channel || 0;
  const isMax = kind === 'maximum';

  const sortedPoints = points.slice();
  sortedPoints.sort(getSort(image, channel, isMax));

  if (distance > 0) {
    for (let i = 0; i < sortedPoints.length; i++) {
      for (let j = i + 1; j < sortedPoints.length; j++) {
        if (
          Math.hypot(
            sortedPoints[i].column - sortedPoints[j].column,
            sortedPoints[i].row - sortedPoints[j].row,
          ) < distance
        ) {
          sortedPoints.splice(j, 1);
          j--;
        }
      }
    }
  }

  return sortedPoints;
}

function getSort(image: Image, channel: number, isDescending: boolean) {
  if (isDescending) {
    return function sortDescending(a: Point, b: Point) {
      return (
        image.getValue(b.column, b.row, channel) -
        image.getValue(a.column, a.row, channel)
      );
    };
  } else {
    return function sortAscending(a: Point, b: Point) {
      return (
        image.getValue(a.column, a.row, channel) -
        image.getValue(b.column, b.row, channel)
      );
    };
  }
}
