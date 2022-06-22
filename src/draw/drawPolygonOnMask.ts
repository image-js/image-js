import { Mask } from '../Mask';
import { maskToOutputMask } from '../utils/getOutputImage';

import { Point } from './drawLineOnMask';
import { DrawPolylineOnMaskOptions } from './drawPolylineOnMask';
import { deleteDouble } from './utils/deleteDouble';
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

  const filteredPoints = deleteDouble(points);

  newMask.drawPolyline([...points, points[0]], otherOptions);
  if (filled === false) {
    return newMask;
  }

  let polygonMask = Mask.createFrom(newMask);

  let matrixBinary: number[][] = [];
  for (let i = 0; i < newMask.height; i++) {
    matrixBinary[i] = [];
    for (let j = 0; j < newMask.width; j++) {
      matrixBinary[i].push(0);
    }
  }
  for (let i = 0; i < filteredPoints.length; i++) {
    const line = lineBetweenTwoPoints(
      filteredPoints[i],
      filteredPoints[(i + 1) % filteredPoints.length],
    );
    for (let row = 0; row < newMask.height; row++) {
      for (let column = 0; column < newMask.width; column++) {
        if (isAtTheRightOfTheLine({ column, row }, line, newMask.height)) {
          polygonMask.getBit(column, row) === 0
            ? polygonMask.setBit(column, row, 1)
            : polygonMask.setBit(column, row, 0);
        }
      }
    }
  }

  // TODO: copy polygonMask to newMask before returning
  return newMask;
}
