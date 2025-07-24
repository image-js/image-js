import type { Image } from '../../../src/index.js';
import { Mask, fromMask } from '../../../src/index.js';
/**
 * Paint the border of the larger black ROI on the image.
 * @param image - The image to process
 * @returns The processed image.
 */
export function testGetBorderPoints(image: Image): Image {
  const grey = image.convertColor('GREY');
  const mask = grey.threshold();

  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: 'black' });

  const roi = rois.sort((a, b) => b.surface - a.surface)[0];

  const points = roi.getBorderPoints();

  const borderMask = Mask.fromPoints(roi.width, roi.height, points);

  return image.paintMask(borderMask, {
    origin: roi.origin,
    color: [0, 255, 0, 255],
  });
}
