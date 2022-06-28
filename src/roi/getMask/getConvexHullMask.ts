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
  const { filled = false } = options;
  const borderPoints = roi.getBorderPoints();
  // todo: use draw functions on mask to convert the vertices into a polygon

  const vertices = mcch(borderPoints);
  let result = new Mask(roi.width, roi.height);

  return result.drawPolygon(vertices, { filled });
}
