import { fromMask, IJS, ImageColorModel } from '../../../src';
import { RoiKind } from '../../../src/roi/getRois';

/**
 * Draw the MBR of the largest ROI.
 *
 * @param image - Input image.
 * @returns The image with the MBR.
 */
export function testGetMbr(image: IJS): IJS {
  const grey = image.convertColor(ImageColorModel.GREY);
  const mask = grey.threshold({ threshold: 35 });
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: RoiKind.BLACK });

  const roi = rois.sort((a, b) => b.surface - a.surface)[0];
  if (roi) {
    const roiMask = roi.getMask();
    let mbr = roiMask.getMbr();

    let result = image.paintMask(roiMask, {
      origin: roi.origin,
      color: [0, 0, 255, 255],
    });

    result = result.drawPolygon(mbr.corners, {
      origin: roi.origin,
      strokeColor: [0, 255, 0, 255],
    });

    return result;
  } else {
    return image;
  }
}
