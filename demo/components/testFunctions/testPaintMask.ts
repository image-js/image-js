import { fromMask, IJS, ImageColorModel } from '../../../src';
import { RoiKind } from '../../../src/roi/getRois';

export function testPaintMask(image: IJS): IJS {
  const grey = image.convertColor(ImageColorModel.GREY);
  const mask = grey.threshold({ threshold: 50 });

  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: RoiKind.BLACK });

  const biggestRoi = rois.sort((a, b) => b.surface - a.surface)[0];

  const roiMask = biggestRoi.getMask();

  const faded = image.fillAlpha(Math.round(image.maxValue / 2));

  return faded.paintMask(roiMask, {
    row: biggestRoi.row,
    column: biggestRoi.column,
    color: [0, 0, 255, 255],
  });
}
