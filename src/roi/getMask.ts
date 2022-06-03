import { Mask } from '../Mask';

import { Roi } from './Roi';
import { getContourMask } from './getMask/getContourMask';
import { getConvexHullMask } from './getMask/getConvexHullMask';

export interface ContourMaskOptions {
  kind: 'contour';
  innerBorders?: boolean;
  allowCorners?: boolean;
  filled?: boolean;
}

export interface ConvexHullMaskOptions {
  kind: 'convexHull';
  filled?: boolean;
}

export type GetMaskOptions = ContourMaskOptions | ConvexHullMaskOptions;

/**
 * Generate a mask of an ROI. You can specify the kind of mask you want using the `kind` option.
 *
 * @param roi - The ROI to generate a mask for.
 * @param options - Get mask options.
 * @returns The ROI mask.
 */
export function getMask(roi: Roi, options: GetMaskOptions): Mask {
  const { kind = 'contour' } = options;
  switch (kind) {
    case 'contour':
      return getContourMask(roi, options as ContourMaskOptions);
    case 'convexHull':
      return getConvexHullMask(roi, options as ConvexHullMaskOptions);
    default:
      throw new Error('getMask: unsupported mask kind');
  }
}
