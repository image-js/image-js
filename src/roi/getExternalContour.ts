import type { GetExternalContourOptions } from '../maskAnalysis/getExternalContour.ts';

import type { Roi } from './Roi.ts';

/**
 * Finds external contour of the roi from its mask.
 * @param roi - roi to find contour from.
 * @param options - GetExternalContourOptions.
 * @returns Array of contour points.
 */
export function getExternalContour(
  roi: Roi,
  options?: GetExternalContourOptions,
) {
  const mask = roi.getMask();
  return mask.getExternalContour(options);
}
