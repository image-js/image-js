import { IJS, ImageColorModel } from '..';
import { getClamp } from '../utils/clamp';
import { getOutputImage } from '../utils/getOutputImage';

import * as greyAlgorithms from './greyAlgorithms';

export type GreyAlgorithms = keyof typeof greyAlgorithms;

/**
 * Call back that converts the RGB channels to grey. It is clamped afterwards.
 *
 * @callback GreyAlgorithmCallback
 * @param {number} red - value of the red channel
 * @param {number} green - value of the green channel
 * @param {number} blue - value of the blue channel
 * @returns {number} value of the grey channel
 */
export type GreyAlgorithmCallback = (
  red: number,
  green: number,
  blue: number,
  image: IJS,
) => number;

export interface GreyOptions {
  /**
   * Specify the grey algorithm to use.
   *
   * @default 'luma709'
   */
  algorithm?: GreyAlgorithms | GreyAlgorithmCallback;
  /**
   * Specify wether to keep an alpha channel in the new image or not.
   *
   * @default false
   */
  keepAlpha?: boolean;
  /**
   * Specify wether to merge the alpha channel with the gray pixel or not.
   *
   * @default true
   */
  mergeAlpha?: boolean;
  /**
   * Image to which to output.
   */
  out?: IJS;
}

/**
 * Convert the current image to grayscale.
 * The source image has to be RGB or RGBA.
 * If there is an alpha channel you have to specify what to do:
 * - keepAlpha :  keep the alpha channel, you will get a GREYA image
 * - mergeAlpha : multiply each pixel of the image by the alpha, you will get a GREY image
 *
 * @param image - Original color image to convert to grey.
 * @param options - The grey conversion options.
 * @returns The resulting grey image.
 */
export function grey(image: IJS, options: GreyOptions = {}): IJS {
  let { algorithm = 'luma709', keepAlpha = false, mergeAlpha = true } = options;

  if (
    image.colorModel !== ImageColorModel.RGB &&
    image.colorModel !== ImageColorModel.RGBA
  ) {
    throw new Error('Image color model is not RGB or RGBA');
  }

  keepAlpha = keepAlpha && image.alpha;
  mergeAlpha = mergeAlpha && image.alpha;
  if (keepAlpha) {
    mergeAlpha = false;
  }

  let newColorModel = keepAlpha ? ImageColorModel.GREYA : ImageColorModel.GREY;

  let newImage = getOutputImage(image, options, {
    newParameters: { colorModel: newColorModel },
  });

  let method: GreyAlgorithmCallback;
  if (typeof algorithm === 'function') {
    method = algorithm;
  } else {
    // eslint-disable-next-line import/namespace
    method = greyAlgorithms[algorithm];
  }

  let clamp = getClamp(newImage);

  for (let i = 0; i < image.size; i++) {
    const red = image.getValueByIndex(i, 0);
    const green = image.getValueByIndex(i, 1);
    const blue = image.getValueByIndex(i, 2);
    let newValue;
    if (mergeAlpha) {
      const alpha = image.getValueByIndex(i, 3);
      newValue = clamp(
        (method(red, green, blue, image) * alpha) / image.maxValue,
      );
    } else {
      newValue = clamp(method(red, green, blue, image));
      if (keepAlpha) {
        const alpha = image.getValueByIndex(i, 3);
        newImage.setValueByIndex(i, 1, alpha);
      }
    }
    newImage.setValueByIndex(i, 0, newValue);
  }

  return newImage;
}
