import type { Image } from '../Image.js';
import { getClamp } from '../utils/clamp.js';
import { getOutputImage } from '../utils/getOutputImage.js';
import checkProcessable from '../utils/validators/checkProcessable.js';
import { validateChannels } from '../utils/validators/validators.js';

export interface LevelOptions {
  /**
   * Specify which channels should be processed. To process the alpha as well,
   * specify the channels as [0,1,2,3] for RGBA images and [0,1] for GREYA.
   * @default All components of the image the image (no alpha).
   */
  channels?: number[];
  /**
   * Input lower bound.
   * @default `image.minMax().min`
   */
  inputMin?: number | number[];
  /**
   * Input upper bound.
   * @default `image.minMax().min`
   */
  inputMax?: number | number[];
  /**
   * output lower bound.
   * @default `0`
   */
  outputMin?: number | number[];
  /**
   * Output upper bound.
   * @default `image.maxValue`
   */
  outputMax?: number | number[];
  /**
   * Specifies the shape of the curve connecting the two points.
   *  @default `1`
   */
  gamma?: number | number[];
  /**
   * Image to which to output.
   */
  out?: Image;
}

/**
 * Level the image using the optional input and output value. The default options allow to increase the image's contrast.
 * @param image - Image to process.
 * @param options - Level options.
 * @returns The levelled image.
 */
export function level(image: Image, options: LevelOptions = {}) {
  const minMax = image.minMax();
  let {
    inputMin = minMax.min,
    inputMax = minMax.max,
    outputMin = 0,
    outputMax = image.maxValue,
    gamma = 1,
  } = options;
  const {
    channels = new Array(image.components).fill(0).map((value, index) => index),
  } = options;

  validateChannels(channels, image);

  checkProcessable(image, {
    bitDepth: [8, 16],
  });

  const newImage = getOutputImage(image, options, { clone: true });

  const clamp = getClamp(image);

  inputMin = getValueArray(inputMin, image.channels);
  inputMax = getValueArray(inputMax, image.channels);
  outputMin = getValueArray(outputMin, image.channels);
  outputMax = getValueArray(outputMax, image.channels);
  gamma = getValueArray(gamma, image.channels);

  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      for (const channel of channels) {
        const currentValue = image.getValue(column, row, channel);

        const clamped = Math.max(
          Math.min(currentValue, inputMax[channel]),
          inputMin[channel],
        );

        let ratio = clamp(
          (clamped - inputMin[channel]) /
            (inputMax[channel] - inputMin[channel]),
        );

        if (Number.isNaN(ratio)) ratio = 0;

        const result = clamp(
          ratio ** (1 / gamma[channel]) *
            (outputMax[channel] - outputMin[channel]) +
            outputMin[channel],
        );

        newImage.setValue(column, row, channel, result);
      }
    }
  }
  return newImage;
}

/**
 * Get an array with correct values for each channel to process.
 * @param value - Number or array to transform to the final array.
 * @param imageChannels - Number of channels processed in the level function.
 * @returns Array of values for each channel.
 */
function getValueArray(
  value: number | number[],
  imageChannels: number,
): number[] {
  if (Array.isArray(value)) {
    if (value.length === imageChannels) {
      return value;
    } else {
      throw new RangeError(
        'array length is not compatible with channel option',
      );
    }
  } else {
    return new Array(imageChannels).fill(value);
  }
}
