import { Mask } from '../../Mask';
import { Roi } from '../Roi';
import { ContourMaskOptions } from '../getMask';

/**
 * Generate a mask of the roi. You can either only return the borders, or the filled mask.
 *
 * @param roi - The ROI to generate a mask for.
 * @param options - Get filled mask options.
 * @returns The ROI mask.
 */
export function getContourMask(roi: Roi, options: ContourMaskOptions): Mask {
  const { filled = true, innerBorders = false } = options;

  if (filled) {
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

    if (!innerBorders) {
      mask.solidFill({ out: mask });
    }

    return mask;
  } else {
    const borderPoints = roi.getBorderPoints(options);

    return Mask.fromPoints(roi.width, roi.height, borderPoints);
  }
}
