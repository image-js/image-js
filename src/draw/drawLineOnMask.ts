import { Mask } from '../Mask';
import { maskToOutputMask } from '../utils/getOutputImage';

export interface Point {
  /**
   * Point row.
   *
   */
  row: number;
  /**
   * Point column.
   *
   */
  column: number;
}

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
) {
  const newMask = maskToOutputMask(mask, options, { clone: true });

  const { rowIncrement, columnIncrement, steps } = getIncrements(from, to);

  let { row, column } = from;

  for (let step = 0; step <= steps; step++) {
    const rowPoint = Math.round(row);
    const columnPoint = Math.round(column);
    if (
      rowPoint >= 0 &&
      columnPoint >= 0 &&
      rowPoint < newMask.height &&
      columnPoint < newMask.width
    ) {
      newMask.setBit(columnPoint, rowPoint, 1);
    }

    row += rowIncrement;
    column += columnIncrement;
  }

  return newMask;
}

/**
 * Compute variables used to draw a line.
 *
 * @param from - Starting point.
 * @param to - Ending point
 * @returns Useful variables.
 */
export function getIncrements(
  from: Point,
  to: Point,
): { rowIncrement: number; columnIncrement: number; steps: number } {
  const dRow = to.row - from.row;
  const dColumn = to.column - from.column;
  const steps = Math.max(Math.abs(dRow), Math.abs(dColumn));

  const rowIncrement = dRow / steps;
  const columnIncrement = dColumn / steps;
  return { rowIncrement, columnIncrement, steps };
}
