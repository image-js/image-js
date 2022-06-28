import { Mask } from '../Mask';

import { Roi } from './Roi';
import { ContourMaskOptions, getContourMask } from './getMask/getContourMask';
import {
  ConvexHullMaskOptions,
  getConvexHullMask,
} from './getMask/getConvexHullMask';

export type GetMaskOptions = ContourMaskOptions | ConvexHullMaskOptions;

/**
 * Generate a mask of an ROI. You can specify the kind of mask you want using the `kind` option.
 *
 * @param roi - The ROI to generate a mask for.
 * @param options - Get mask options.
 * @returns The ROI mask.
 */
export function getMask(
  roi: Roi,
  options: GetMaskOptions = { kind: 'contour' },
): Mask {
  const { kind } = options;
  switch (kind) {
    case 'contour':
      return getContourMask(roi, options);
    case 'convexHull':
      return getConvexHullMask(roi, options);
    default:
      throw new Error('getMask: unsupported mask kind');
  }
}
