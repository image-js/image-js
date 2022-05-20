import { Mask } from '../Mask';

import { Roi } from './Roi';

/**
 * Generate a mask the size of the bounding rectangle of the ROI, where the pixels inside the ROI are set to true and the rest to false.
 *
 * @param roi - The ROI to generate a mask for.
 * @returns The ROI mask.
 */
export function getMask(roi: Roi): Mask {
  let mask = new Mask(roi.width, roi.height);

  for (let row = 0; row < roi.height; row++) {
    for (let column = 0; column < roi.width; column++) {
      if (roi.getMapValue(roi.column + column, roi.row + row) === roi.id) {
        mask.setBit(column, row, 1);
      } else {
        mask.setBit(column, row, 0);
      }
    }
  }

  return mask;
}
