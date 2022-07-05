import { line } from 'bresenham-zingl';

import { Mask } from '../Mask';
import { maskToOutputMask } from '../utils/getOutputImage';
import { Point } from '../utils/types';

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
    from.column,
    from.row,
    to.column,
    to.row,
    (column: number, row: number) => {
      newMask.setBit(column, row, 1);
    },
  );
  return newMask;
}
