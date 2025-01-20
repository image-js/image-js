import type { BitValue, Mask } from '../Mask.js';
import type { Point } from '../utils/geometry/points.js';
import { maskToOutputMask } from '../utils/getOutputImage.js';
import { checkPointIsInteger } from '../utils/validators/checkPointIsInteger.js';

export interface PaintMaskOnMaskOptions {
  /**
   * Top-left corner of the mask relative to a parent image.
   * @default `{row: 0, column: 0}`
   */
  origin?: Point;
  /**
   * Value with which to set the pixel.
   * @default `1`
   */
  value?: BitValue;
  /**
   * Mask to which to output.
   */
  out?: Mask;
}

/**
 * Paint a mask onto an image and the given position and with the given color.
 * @param image - Image on which to paint the mask.
 * @param mask - Mask to paint on the image.
 * @param options - Paint mask options.
 * @returns The painted image.
 */
export function paintMaskOnMask(
  image: Mask,
  mask: Mask,
  options: PaintMaskOnMaskOptions = {},
): Mask {
  const { origin = { row: 0, column: 0 }, value = 1 } = options;
  const { column, row } = origin;

  checkPointIsInteger(origin, 'Origin');

  const result = maskToOutputMask(image, options, { clone: true });

  for (
    let currentRow = Math.max(row, 0);
    currentRow < Math.min(mask.height + row, image.height);
    currentRow++
  ) {
    for (
      let currentColumn = Math.max(column, 0);
      currentColumn < Math.min(mask.width + column, image.width);
      currentColumn++
    ) {
      if (mask.getBit(currentColumn - column, currentRow - row)) {
        result.setBit(currentColumn, currentRow, value);
      }
    }
  }

  return result;
}
