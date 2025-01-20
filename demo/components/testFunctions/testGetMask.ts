import type { Image } from '../../../src/index.js';
import { fromMask } from '../../../src/index.js';
/**
 * Paint the border of the larger black ROI on the image.
 * @param image - The image to process
 * @returns The processed image.
 */
export function testGetContourMask(image: Image): Image {
  const grey = image.convertColor('GREY');
  const mask = grey.threshold();

  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: 'black' });

  const roi = rois.sort((a, b) => b.surface - a.surface)[0];

  const roiMask = roi.getMask({
    solidFill: true,
  });

  return image.paintMask(roiMask, {
    origin: roi.origin,
    color: [0, 255, 0, 255],
  });
}
