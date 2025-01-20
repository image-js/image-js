import robustPointInPolygon from 'robust-point-in-polygon';

import type { Mask } from '../Mask.js';
import { arrayPointsToObjects } from '../utils/arrayPointsToObjects.js';
import type { Point } from '../utils/geometry/points.js';
import { maskToOutputMask } from '../utils/getOutputImage.js';

import type { DrawPolylineOnMaskOptions } from './drawPolylineOnMask.js';
import { deleteDuplicates } from './utils/deleteDuplicates.js';

export interface DrawPolygonOnMaskOptions extends DrawPolylineOnMaskOptions {
  /**
   * Fill polygon.
   */
  filled?: boolean;
  /**
   * Origin of the rectangle relative to a parent image (top-left corner).
   * @default `{row: 0, column: 0}`
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

  const newMask = maskToOutputMask(mask, options, { clone: true });

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
        newMask.setBit(
          Math.round(origin.column) + column,
          Math.round(origin.row) + row,
          1,
        );
      }
    }
  }

  return newMask.drawPolyline([...points, points[0]], {
    origin,
    ...otherOptions,
  });
}
