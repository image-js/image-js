import { fromMask, Image } from '../../../src/index.js';

/**
 * Extract the pixels of a mask from the image.
 * @param image - Input image.
 * @returns The treated image.
 */
export function testExtract(image: Image): Image {
  const background = new Image(image.width, image.height, {
    colorModel: 'RGBA',
  });

  background.fill([0, 255, 0, 255]);

  const grey = image.convertColor('GREY');
  const mask = grey.threshold();

  const extracted = image.extract(mask);

  return extracted.copyTo(background);
}

/**
 * Extract one specific ROI from the original image.
 * @param image - The image from which to extract the ROI.
 * @returns - The extracted ROI.
 */
export function testExtractRoi(image: Image): Image {
  const grey = image.convertColor('GREY');
  const mask = grey.threshold();

  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois({ kind: 'white', minSurface: 100 });

  const roiMask = rois[0].getMask();

  return image.extract(roiMask, rois[0]);
}
