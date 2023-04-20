import { fromMask, Image } from '../../../src';
/**
 * Paint the border of the larger black ROI on the image.
 * @param image The image to process
 * @returns The processed image.
 */
export function testGetContourMask(image: Image): Image {
  const grey = image.convertColor('GREY');
  const mask = grey.threshold();

  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: 'black' });

  const roi = rois.sort((a, b) => b.surface - a.surface)[0];

  let roiMask = roi.getMask({
    solidFill: true,
  });

  return image.paintMask(roiMask, {
    origin: roi.origin,
    color: [0, 255, 0, 255],
  });
}
