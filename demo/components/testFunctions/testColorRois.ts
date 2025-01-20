import { Image } from '../../../src/index.js';
import { fromMask, colorRois } from '../../../src/roi/index.js';

/**
 * Make a mask out of the image and detect all ROIs. Returns only the white ROIs on a black background.
 * @param image - Input image.
 * @returns The treated image.
 */
export function testColorRois(image: Image): Image {
  const grey = image.convertColor('GREY');
  const mask = grey.threshold();

  const roiMapManager = fromMask(mask);

  const colorImage = colorRois(roiMapManager, {
    roiKind: 'white',
    mode: 'rainbow',
  });

  // create a black image
  const black = new Image(image.width, image.height, {
    colorModel: 'RGBA',
  });
  // overlay ROIs on the black image
  black.fill([0, 0, 0, 255]);

  return colorImage.copyTo(black);
}
