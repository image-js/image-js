import { fromMask, IJS, ImageColorModel, Mask } from '../../../src';
import { RoiKind } from '../../../src/roi/getRois';
/**
 * Paint the border of the larger black ROI on the image.
 * @param image The image to process
 * @returns The processed image.
 */
export function testGetBorderPoints(image: IJS): IJS {
  const grey = image.convertColor(ImageColorModel.GREY);
  const mask = grey.threshold();

  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: RoiKind.BLACK });

  const roi = rois.sort((a, b) => b.surface - a.surface)[0];

  let points = roi.getBorderPoints();

  let borderMask = Mask.fromPoints(roi.width, roi.height, points);

  return image.paintMask(borderMask, {
    row: roi.row,
    column: roi.column,
    color: [0, 255, 0, 255],
  });
}
