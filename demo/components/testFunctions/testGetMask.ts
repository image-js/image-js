import type { Image } from '../../image_js.ts';
import { fromMask } from '../../image_js.ts';

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
  rois.sort((a, b) => b.surface - a.surface);
  const roi = rois[0];

  const roiMask = roi.getMask({
    solidFill: true,
  });

  return image.paintMask(roiMask, {
    origin: roi.origin,
    color: [0, 255, 0, 255],
  });
}
