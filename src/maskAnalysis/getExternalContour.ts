import type { Mask } from '../Mask.ts';

import { getBorderPointsMoore } from './getBorderPointsMoore.ts';
import { getBorderPointsPavlidis } from './getBorderPointsPavlidis.ts';

interface GetExternalContourOptions {
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
    return getBorderPointsPavlidis(mask);
  } else if (connectivity === 8) {
    return getBorderPointsMoore(mask);
  } else {
    throw new Error(
      `Invalid connectivity parameter.Acceptable value are 4 and 8. Given value is ${connectivity}`,
    );
  }
}
