import { Mask } from '../Mask';
import { maskToOutputMask } from '../utils/getOutputImage';

import { Point } from './drawLineOnMask';
import { DrawPolylineOnMaskOptions } from './drawPolylineOnMask';
import { deleteDuplicates } from './utils/deleteDuplicates';
import { isAtTheRightOfTheLine, lineBetweenTwoPoints } from './utils/lineUtils';

export interface DrawPolygonOnMaskOptions extends DrawPolylineOnMaskOptions {
  /**
   * Fill polygon.
   */
  filled?: boolean;
}

/**
 * Draw a polygon defined by an array of points on a mask.
 *
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
  const { filled = false, ...otherOptions } = options;

  let newMask = maskToOutputMask(mask, options, { clone: true });

  if (filled === false) {
    return newMask.drawPolyline([...points, points[0]], otherOptions);
  }

  let polygonMask = Mask.createFrom(newMask);

  const filteredPoints = deleteDuplicates(points);

  for (let i = 0; i < filteredPoints.length; i++) {
    const line = lineBetweenTwoPoints(
      filteredPoints[i],
      filteredPoints[(i + 1) % filteredPoints.length],
    );
    for (let row = 0; row < newMask.height; row++) {
      for (let column = 0; column < newMask.width; column++) {
        if (isAtTheRightOfTheLine({ column, row }, line, newMask.height)) {
          if (polygonMask.getBit(column, row)) {
            polygonMask.setBit(column, row, 0);
          } else {
            polygonMask.setBit(column, row, 1);
          }
        }
      }
    }
  }

  for (let row = 0; row < mask.height; row++) {
    for (let column = 0; column < mask.width; column++) {
      if (polygonMask.getBit(column, row)) {
        newMask.setBit(column, row, 1);
      }
    }
  }

  return newMask.drawPolyline([...points, points[0]], otherOptions);
}
