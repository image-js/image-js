import { fromMask, Image } from '../../../src';

/**
 * Draw the convex Hull polygon of the largest ROI in green and display the filled ROI in purple.
 *
 * @param image - Input image.
 * @returns The image with the convex Hull.
 */
export function testGetConvexHull(image: Image): Image {
  const grey = image.convertColor('GREY');
  const mask = grey.threshold({ threshold: 35 });
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: 'black' });

  const roi = rois.sort((a, b) => b.surface - a.surface)[0];
  if (roi) {
    const roiMask = roi.getMask();
    let convexHull = roiMask.getConvexHull();

    let result = image.paintMask(roiMask, {
      origin: roi.origin,
      color: [0, 0, 255, 255],
    });

    result = result.drawPolygon(convexHull.points, {
      origin: roi.origin,
      strokeColor: [0, 255, 0, 255],
    });
    return result;
  } else {
    return image;
  }
}
