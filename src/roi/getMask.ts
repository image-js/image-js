import { Mask } from '../Mask';

import { Roi } from './Roi';
import { getContourMask } from './getMask/getContourMask';
import { getConvexHullMask } from './getMask/getConvexHullMask';

export interface ContourMaskOptions {
  kind: 'contour';
  /**
   * Should the inner borders be returned too?
   *
   * @default false
   */
  innerBorders?: boolean;
  /**
   * Consider pixels connected by corners?
   *
   * @default false
   */
  allowCorners?: boolean;
  /**
   * Specify wether the pixels inside the ROI should be set to 1.
   *
   * @default true
   */
  filled?: boolean;
}

export interface ConvexHullMaskOptions {
  kind: 'convexHull';
  /**
   * Specify wether the pixels inside the ROI should be set to 1.
   *
   * @default true
   */
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
