import { fromMask, IJS, ImageColorModel } from '../../../src';
import { getContourMask } from '../../../src/roi/getMask/getContourMask';
import { RoiKind } from '../../../src/roi/getRois';
/**
 * Paint the border of the larger black ROI on the image.
 * @param image The image to process
 * @returns The processed image.
 */
export function testGetContourMask(image: IJS): IJS {
  const grey = image.convertColor(ImageColorModel.GREY);
  const mask = grey.threshold();

  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: RoiKind.BLACK });

  const roi = rois.sort((a, b) => b.surface - a.surface)[0];

  let roiMask = getContourMask(roi, {
    kind: 'contour',
    filled: true,
    innerBorders: false,
  });

  return image.paintMask(roiMask, {
    row: roi.row,
    column: roi.column,
    color: [0, 255, 0, 255],
  });
}
