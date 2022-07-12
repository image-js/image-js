import { line } from 'bresenham-zingl';

import { Mask } from '../Mask';
import { Point } from '../utils/geometry/points';
import { maskToOutputMask } from '../utils/getOutputImage';

export interface DrawLineOnMaskOptions {
  /**
   * Mask to which the result has to be put.
   */
  out?: Mask;
}

/**
 * Draw a line defined by two points onto a mask.
 *
 * @param mask - Mask to process.
 * @param from - Line starting point.
 * @param to - Line ending point.
 * @param options - Draw Line options.
 * @returns The mask with the line drawing.
 */
export function drawLineOnMask(
  mask: Mask,
  from: Point,
  to: Point,
  options: DrawLineOnMaskOptions = {},
): Mask {
  const newMask = maskToOutputMask(mask, options, { clone: true });
  line(
    Math.round(from.column),
    Math.round(from.row),
    Math.round(to.column),
    Math.round(to.row),
    (column: number, row: number) => {
      newMask.setBit(column, row, 1);
    },
  );
  return newMask;
}
