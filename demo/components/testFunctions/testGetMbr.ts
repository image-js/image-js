import type { Image } from '../../../src/index.js';
import { fromMask } from '../../../src/index.js';

/**
 * Draw the MBR of the largest ROI.
 * @param image - Input image.
 * @returns The image with the MBR.
 */
export function testGetMbr(image: Image): Image {
  const grey = image.convertColor('GREY');
  const mask = grey.threshold({ threshold: 35 / 255 });
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: 'black' });

  const roi = rois.sort((a, b) => b.surface - a.surface)[0];
  if (roi) {
    const roiMask = roi.getMask();
    const mbr = roiMask.getMbr();

    let result = image.paintMask(roiMask, {
      origin: roi.origin,
      color: [0, 0, 255, 255],
    });

    result = result.drawPolygon(mbr.points, {
      origin: roi.origin,
      strokeColor: [0, 255, 0, 255],
    });

    return result;
  } else {
    return image;
  }
}
