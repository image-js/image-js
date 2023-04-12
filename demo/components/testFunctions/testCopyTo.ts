import { Image } from '../../../src';

/**
 * Copy a black and a red square to the source image.
 *
 * @param image - Input image.
 * @returns The treated image.
 */
export function testCopyTo(image: Image): Image {
  let result = image.copyTo(image, {
    origin: {
      row: image.height / 2,
      column: image.width / 2,
    },
  });
  let blackSquare = new Image(50, 50, { colorModel: 'RGBA' });
  let redSquare = new Image(150, 150, { colorModel: 'RGBA' });
  redSquare.fillChannel(0, 255);
  redSquare.fillAlpha(100);
  result = blackSquare.copyTo(result, {
    origin: {
      row: 200,
      column: 300,
    },
  });
  redSquare.copyTo(result, {
    origin: {
      column: ((Date.now() / 10) >>> 0) % 500,
      row: ((Date.now() / 10) >>> 0) % 500,
    },
    out: result,
  });
  return result;
}
