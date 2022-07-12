import { fromMask, IJS, ImageColorModel } from '../../../src';
import { RoiKind } from '../../../src/roi/getRois';
/**
 * Make the image translucent, excepted where the largest black ROI is.
 * @param image Image to process.
 * @returns Processed image.
 */
export function testPaintMask(image: IJS): IJS {
  const grey = image.convertColor(ImageColorModel.GREY);
  const mask = grey.threshold({ threshold: 100 });

  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: RoiKind.BLACK });

  const biggestRoi = rois.sort((a, b) => b.surface - a.surface)[0];

  const roiMask = biggestRoi.getMask();

  const faded = image.fillAlpha(Math.round(image.maxValue / 4));

  return faded.paintMask(roiMask, {
    origin: biggestRoi.origin,
    blend: false,
    color: [null, null, null, 255],
  });
}
