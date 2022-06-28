import { Mask } from '../../Mask';
import { Roi } from '../Roi';
import { monotoneChainConvexHull as mcch } from '../utils/monotoneChainConvexHull';

export interface ConvexHullMaskOptions {
  kind: 'convexHull';
  /**
   * Specify wether the pixels inside the ROI should be set to 1.
   *
   * @default true
   */
  filled?: boolean;
}

/**
 * Create a mask with the pixels on the border of the ROI set to true.
 *
 * @param roi - The ROI to generate a mask for.
 * @param options - Get convex Hull mask options.
 * @returns The ROI mask.
 */
export function getConvexHullMask(
  roi: Roi,
  options: ConvexHullMaskOptions = { kind: 'convexHull' },
): Mask {
  const { filled = true } = options;

  if (roi.surface === 1) {
    let result = new Mask(1, 1);
    result.setBit(0, 0, 1);
    return result;
  }

  const borderPoints = roi.getBorderPoints();
  const vertices = mcch(borderPoints);
  const mask = new Mask(roi.width, roi.height);

  const result = mask.drawPolygon(vertices, { filled });

  return result;
}
