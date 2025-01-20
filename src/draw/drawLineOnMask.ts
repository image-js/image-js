import { line } from 'bresenham-zingl';

import type { Mask } from '../Mask.js';
import type { Point } from '../utils/geometry/points.js';
import { maskToOutputMask } from '../utils/getOutputImage.js';

export interface DrawLineOnMaskOptions {
  /**
   * Origin of the line relative to a parent image (top-left corner).
   * @default `{row: 0, column: 0}`
   */
  origin?: Point;
  /**
   * Mask to which the result has to be put.
   */
  out?: Mask;
}

/**
 * Draw a line defined by two points onto a mask.
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
  const { origin = { column: 0, row: 0 } } = options;
  const newMask = maskToOutputMask(mask, options, { clone: true });
  line(
    Math.round(origin.column + from.column),
    Math.round(origin.row + from.row),
    Math.round(origin.column + to.column),
    Math.round(origin.row + to.row),
    (column: number, row: number) => {
      newMask.setVisiblePixel(column, row, [1]);
    },
  );
  return newMask;
}
