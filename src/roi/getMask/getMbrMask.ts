import { Mask } from '../../Mask';
import { Point } from '../../utils/geometry/points';
import { Roi } from '../Roi';

export interface MbrMaskOptions {
  kind: 'mbr';
  /**
   * Specify wether the pixels inside the minimum bounding rectangle should be set to 1.
   *
   * @default true
   */
  filled?: boolean;
}

/**
 * Computes the minimum bounding rectangle of an ROI.
 *
 * @param roi - The ROI to process.
 * @param options - Get MBR mask options.
 * @returns A mask with the minimum boundary rectangle of the ROI.
 */
export function getMbrMask(
  roi: Roi,
  options: MbrMaskOptions = { kind: 'mbr' },
): Mask {
  const { filled = true } = options;
  const mask = roi.getMask();

  const mbr = mask.getMbr();
  const dimensions = getMbrMaskSize(mbr.corners);
  const newMask = new Mask(dimensions.width, dimensions.height);
  return newMask.drawPolygon(mbr.corners, { filled });
}

/**
 * Compute the MBR mask dimensions from the rectangle corners.
 *
 * @param corners - The corners of the MBR.
 * @returns The width and height of the mask.
 */
export function getMbrMaskSize(corners: readonly Point[]): {
  width: number;
  height: number;
} {
  const copy = corners.slice();
  const sortedColumns = copy.sort((a, b) => {
    return a.column - b.column;
  });
  const width = Math.ceil(
    Math.abs(sortedColumns[0].column - sortedColumns[3].column),
  );

  const sortedRows = copy.sort((a, b) => {
    return a.row - b.row;
  });
  const height = Math.ceil(Math.abs(sortedRows[0].row - sortedRows[3].row));

  return { width, height };
}
