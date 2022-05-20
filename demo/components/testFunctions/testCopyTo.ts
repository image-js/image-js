import { IJS, ImageColorModel } from '../../../src';

/**
 * Copy a black and a red square to the source image.
 *
 * @param image - Input image.
 * @returns The treated image.
 */
export function testCopyTo(image: IJS): IJS {
  let result = image.copyTo(image, {
    row: image.height / 2,
    column: image.width / 2,
  });
  let blackSquare = new IJS(50, 50, { colorModel: ImageColorModel.RGBA });
  let redSquare = new IJS(150, 150, { colorModel: ImageColorModel.RGBA });
  redSquare.fillChannel(0, 255);
  redSquare.fillAlpha(100);
  result = blackSquare.copyTo(result, {
    row: 200,
    column: 300,
  });
  redSquare.copyTo(result, {
    column: ((Date.now() / 10) >>> 0) % 500,
    row: ((Date.now() / 10) >>> 0) % 500,
    out: result,
  });
  return result;
}
