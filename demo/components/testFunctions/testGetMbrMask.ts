import { fromMask, IJS, ImageColorModel } from '../../../src';
import { getContourMask } from '../../../src/roi/getMask/getContourMask';
import { getMbrMask } from '../../../src/roi/getMask/getMbrMask';
import { RoiKind } from '../../../src/roi/getRois';

/**
 * Draw the MBR of the largest ROI.
 *
 * @param image - Input image.
 * @returns The image with the MBR.
 */
export function testGetMbrMask(image: IJS): IJS {
  const grey = image.convertColor(ImageColorModel.GREY);
  const mask = grey.threshold({ threshold: 30 });
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: RoiKind.BLACK });

  const roi = rois.sort((a, b) => b.surface - a.surface)[0];
  let mbr = getMbrMask(roi, {
    kind: 'mbr',
    filled: false,
  });
  let roiMask = getContourMask(roi, {
    kind: 'contour',
    filled: true,
  });

  let result = image.paintMask(roiMask, {
    row: roi.row,
    column: roi.column,
    color: [0, 0, 255, 255],
  });

  result = result.paintMask(mbr, {
    row: roi.row,
    column: roi.column,
    color: [0, 255, 0, 255],
  });

  return result;
}
