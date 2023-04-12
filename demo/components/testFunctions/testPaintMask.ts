import { fromMask, Image } from '../../../src';
/**
 * Make the image translucent, excepted where the largest black ROI is.
 * @param image Image to process.
 * @returns Processed image.
 */
export function testPaintMask(image: Image): Image {
  const grey = image.convertColor('GREY');
  const mask = grey.threshold({ threshold: 100 });

  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: 'black' });

  const biggestRoi = rois.sort((a, b) => b.surface - a.surface)[0];

  const roiMask = biggestRoi.getMask();

  const faded = image.fillAlpha(Math.round(image.maxValue / 4));

  return faded.paintMask(roiMask, {
    origin: biggestRoi.origin,
    blend: false,
    color: [null, null, null, 255],
  });
}
