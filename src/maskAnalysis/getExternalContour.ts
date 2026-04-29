import type { Mask } from '../Mask.ts';

import { getContourMoore } from './getContourMoore.ts';
import { getContourPavlidis } from './getContourPavlidis.ts';
import type { GetBorderPointsOptions } from './maskAnalysis.types.ts';

export type GetExternalContourOptions = Omit<
  GetBorderPointsOptions,
  'innerBorers'
>;
/**
 * Finds external contour of the mask.
 * @param mask - Mask to find contours from.
 * @param options - GetExternalContourOptions.
 * @returns Array of contour points.
 */
export function getExternalContour(
  mask: Mask,
  options: GetExternalContourOptions = {},
) {
  const { allowCorners = false } = options;
  if (allowCorners) {
    return getContourPavlidis(mask);
  } else {
    return getContourMoore(mask);
  }
}
