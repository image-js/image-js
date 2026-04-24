import type { Mask } from '../Mask.ts';

import { getContourMoore } from './getContourMoore.ts';
import { getContourPavlidis } from './getContourPavlidis.ts';

export interface GetExternalContourOptions {
  /**
   * Whether to use 8-connectivity instead of 4-connectivity when detecting border pixels.
   * At 4, a pixel is considered a border only if at least one of its 4 orthogonal
   * neighbors (up, down, left, right) is unset.
   * At 8, diagonal neighbors are also considered, so a pixel touching an unset pixel
   * only by a corner is also returned as a border point.
   */
  connectivity?: 4 | 8;
}
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
  const { connectivity = 8 } = options;
  if (connectivity === 4) {
    return getContourPavlidis(mask);
  } else {
    return getContourMoore(mask);
  }
}
