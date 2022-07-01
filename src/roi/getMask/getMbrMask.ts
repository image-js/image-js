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
 * https://www.researchgate.net/profile/Lennert_Den_Boer2/publication/303783472_A_Fast_Algorithm_for_Generating_a_Minimal_Bounding_Rectangle/links/5751a14108ae6807fafb2aa5.pdf
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
  const corners = mask.getMbr();
  const dimensions = getMbrMaskSize(corners);
  const result = new Mask(dimensions.width, dimensions.height);
  return result.drawPolygon(corners, { filled });
}

/**
 * Compute the MBR mask dimensions from the rectangle corners.
 *
 * @param corners - The corners of the MBR.
 * @returns The width and height of the mask.
 */
export function getMbrMaskSize(corners: Point[]): {
  width: number;
  height: number;
} {
  const sortedColumns = corners.sort((a, b) => {
    return a.column - b.column;
  });
  const width = Math.ceil(
    Math.abs(sortedColumns[0].column - sortedColumns[3].column),
  );

  const sortedRows = corners.sort((a, b) => {
    return a.row - b.row;
  });
  const height = Math.ceil(Math.abs(sortedRows[0].row - sortedRows[3].row));

  return { width, height };
}
