import { GetBorderPointOptions } from '../maskAnalysis';
import { Point } from '../utils/geometry/points';

import { Roi } from './Roi';

/**
 * Return an array with the coordinates of the pixels that are on the border of the ROI.
 * The reference is the top-left corner of the ROI.
 *
 * @param roi - ROI to process.
 * @param options - Get border points options.
 * @returns The array of border pixels.
 */
export function getBorderPoints(
  roi: Roi,
  options: GetBorderPointOptions = {},
): Array<Point> {
  const mask = roi.getMask();

  return mask.getBorderPoints(options);
}
