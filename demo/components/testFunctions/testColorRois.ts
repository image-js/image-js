import { IJS, ImageColorModel } from '../../../src';
import { fromMask, RoisColorMode, colorRois } from '../../../src/roi';
import { RoiKind } from '../../../src/roi/getRois';

/**
 * Make a mask out of the image and detect all ROIs. Returns only the white ROIs on a black background.
 *
 * @param image - Input image.
 * @returns The treated image.
 */
export function testColorRois(image: IJS): IJS {
  const grey = image.convertColor(ImageColorModel.GREY);
  const mask = grey.threshold();

  const roiMapManager = fromMask(mask);

  let colorImage = colorRois(roiMapManager, {
    roiKind: RoiKind.WHITE,
    mode: RoisColorMode.RAINBOW,
  });

  // create a black image
  const black = new IJS(image.width, image.height, {
    colorModel: ImageColorModel.RGBA,
  });
  // overlay ROIs on the black image
  black.fill([0, 0, 0, 255]);

  return colorImage.copyTo(black);
}
