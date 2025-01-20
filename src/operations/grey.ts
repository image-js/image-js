import type { Image } from '../Image.js';
import { getClamp } from '../utils/clamp.js';
import type { ImageColorModel } from '../utils/constants/colorModels.js';
import { getOutputImage } from '../utils/getOutputImage.js';
import { assert } from '../utils/validators/assert.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

import * as greyAlgorithms from './greyAlgorithms.js';

export const GreyAlgorithm = {
  LUMA_709: 'luma709',
  LUMA_601: 'luma601',
  MAX: 'max',
  MIN: 'min',
  AVERAGE: 'average',
  MINMAX: 'minmax',
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
  BLACK: 'black',
  CYAN: 'cyan',
  MAGENTA: 'magenta',
  YELLOW: 'yellow',
  HUE: 'hue',
  SATURATION: 'saturation',
  LIGHTNESS: 'lightness',
} as const satisfies Record<string, keyof typeof greyAlgorithms>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GreyAlgorithm = (typeof GreyAlgorithm)[keyof typeof GreyAlgorithm];

{
  // Check that all the algorithms are in the enum.
  const algos = new Set<string>(Object.values(GreyAlgorithm));
  for (const algo of Object.keys(greyAlgorithms)) {
    assert(
      algos.has(algo),
      `Grey algorithm ${algo} is missing in the GreyAlgorithm enum`,
    );
  }
}

/**
 * Call back that converts the RGB channels to grey. It is clamped afterwards.
 * @callback GreyAlgorithmCallback
 * @param {number} red - Value of the red channel.
 * @param {number} green - Value of the green channel.
 * @param {number} blue - Value of the blue channel.
 * @returns {number} Value of the grey channel.
 */
export type GreyAlgorithmCallback = (
  red: number,
  green: number,
  blue: number,
  image: Image,
) => number;

export interface GreyOptions {
  /**
   * Specify the grey algorithm to use.
   * @default `'luma709'`
   */
  algorithm?: GreyAlgorithm | GreyAlgorithmCallback;
  /**
   * Specify wether to keep an alpha channel in the new image or not.
   * @default `false`
   */
  keepAlpha?: boolean;
  /**
   * Specify wether to merge the alpha channel with the gray pixel or not.
   * @default `true`
   */
  mergeAlpha?: boolean;
  /**
   * Image to which to output.
   */
  out?: Image;
}

/**
 * Convert the current image to grayscale.
 * The source image has to be RGB or RGBA.
 * If there is an alpha channel you have to specify what to do:
 * - keepAlpha :  keep the alpha channel, you will get a GREYA image.
 * - mergeAlpha : multiply each pixel of the image by the alpha, you will get a GREY image.
 * @param image - Original color image to convert to grey.
 * @param options - The grey conversion options.
 * @returns The resulting grey image.
 */
export function grey(image: Image, options: GreyOptions = {}): Image {
  let { keepAlpha = false, mergeAlpha = true } = options;
  const { algorithm = 'luma709' } = options;

  checkProcessable(image, {
    colorModel: ['RGB', 'RGBA'],
  });

  keepAlpha = keepAlpha && image.alpha;
  mergeAlpha = mergeAlpha && image.alpha;
  if (keepAlpha) {
    mergeAlpha = false;
  }

  const newColorModel: ImageColorModel = keepAlpha ? 'GREYA' : 'GREY';

  const newImage = getOutputImage(image, options, {
    newParameters: { colorModel: newColorModel },
  });

  let method: GreyAlgorithmCallback;
  if (typeof algorithm === 'function') {
    method = algorithm;
  } else {
    method = greyAlgorithms[algorithm];
  }

  const clamp = getClamp(newImage);

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
