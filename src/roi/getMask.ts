import { Mask } from '../Mask.js';

import type { Roi } from './Roi.js';

export interface GetMaskOptions {
  /**
   * Should the ROI holes be filled in the resulting mask?
   * @default `false`
   */
  solidFill?: boolean;
}

/**
 * Generate a mask of an ROI.
 * @param roi - The ROI to generate a mask for.
 * @param options - Get mask options.
 * @returns The ROI mask.
 */
export function getMask(roi: Roi, options: GetMaskOptions = {}): Mask {
  const { solidFill = false } = options;
  const mask = new Mask(roi.width, roi.height, { origin: roi.origin });

  for (let row = 0; row < roi.height; row++) {
    for (let column = 0; column < roi.width; column++) {
      if (
        roi.getMapValue(roi.origin.column + column, roi.origin.row + row) ===
        roi.id
      ) {
        mask.setBit(column, row, 1);
      } else {
        mask.setBit(column, row, 0);
      }
    }
  }

  if (solidFill) {
    mask.solidFill({ out: mask });
  }

  return mask;
}
