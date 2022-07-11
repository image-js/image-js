import { fromMask, getMask, IJS, ImageColorModel } from '../../../src';
import { getContourMask } from '../../../src/roi/getMask/getContourMask';
import { RoiKind } from '../../../src/roi/getRois';

/**
 * Draw the convex Hull polygon of the largest ROI in green and display the filled ROI in purple.
 *
 * @param image - Input image.
 * @returns The image with the convex Hull.
 */
export function testGetConvexHullMask(image: IJS): IJS {
  const grey = image.convertColor(ImageColorModel.GREY);
  const mask = grey.threshold({ threshold: 35 });
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: RoiKind.BLACK });

  const roi = rois.sort((a, b) => b.surface - a.surface)[0];
  if (roi) {
    let convexHull = getMask(roi, {
      kind: 'convexHull',
      filled: false,
    });
    let roiMask = getContourMask(roi, {
      kind: 'contour',
      filled: true,
      innerBorders: false,
    });

    let result = image.paintMask(roiMask, {
      row: roi.row,
      column: roi.column,
      color: [0, 0, 255, 255],
    });

    result = result.paintMask(convexHull, {
      row: roi.row,
      column: roi.column,
      color: [0, 255, 0, 255],
    });

    return result;
  } else {
    return image;
  }
}
