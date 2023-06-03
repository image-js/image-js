import robustPointInPolygon from 'robust-point-in-polygon';

import { Mask } from '../Mask';
import { arrayPointsToObjects } from '../utils/arrayPointsToObjects';
import { Point } from '../utils/geometry/points';
import { maskToOutputMask } from '../utils/getOutputImage';

import { DrawPolylineOnMaskOptions } from './drawPolylineOnMask';
import { deleteDuplicates } from './utils/deleteDuplicates';

export interface DrawPolygonOnMaskOptions extends DrawPolylineOnMaskOptions {
  /**
   * Fill polygon.
   */
  filled?: boolean;
  /**
   * Origin of the rectangle relative to a parent image (top-left corner).
   * @default {row: 0, column: 0}
   */
  origin?: Point;
}

/**
 * Draw a polygon defined by an array of points on a mask.
 * @param mask - Mask to process.
 * @param points - Polygon vertices.
 * @param options - Draw Line options.
 * @returns The mask with the polygon drawing.
 */
export function drawPolygonOnMask(
  mask: Mask,
  points: Point[],
  options: DrawPolygonOnMaskOptions = {},
): Mask {
  const {
    filled = false,
    origin = { column: 0, row: 0 },
    ...otherOptions
  } = options;

  let newMask = maskToOutputMask(mask, options, { clone: true });

  if (!filled) {
    return newMask.drawPolyline([...points, points[0]], {
      origin,
      ...otherOptions,
    });
  }

  const filteredPoints = deleteDuplicates(points);
  const arrayPoints = arrayPointsToObjects(filteredPoints);

  for (let row = 0; row < newMask.height; row++) {
    for (let column = 0; column < newMask.width; column++) {
      if (robustPointInPolygon(arrayPoints, [column, row]) === -1) {
        newMask.setBit(origin.column + column, origin.row + row, 1);
      }
    }
  }

  return newMask.drawPolyline([...points, points[0]], {
    origin,
    ...otherOptions,
  });
}
