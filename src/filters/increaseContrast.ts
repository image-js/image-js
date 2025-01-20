import type { Image } from '../Image.js';
import { ImageColorModel } from '../utils/constants/colorModels.js';
import checkProcessable from '../utils/validators/checkProcessable.js';

export interface IncreaseContrastOptions {
  /**
   * Image to which to output.
   */
  out?: Image;
  /**
   * Level all channels uniformly in order to preserve the color balance.
   * @default false
   */
  uniform?: boolean;
}

/**
 * Increase the contrast of an image by spanning each channel on the range [0, image.maxValue].
 * This algorithm is based on the level algorithm.
 * @param image - The image to enhance.
 * @param options - Increase contrast options.
 * @returns The enhanced image.
 */
export function increaseContrast(
  image: Image,
  options: IncreaseContrastOptions = {},
): Image {
  const { uniform = false } = options;
  checkProcessable(image, {
    bitDepth: [8, 16],
  });
  const minMax = image.minMax();

  let min: number | number[] = minMax.min;
  let max: number | number[] = minMax.max;

  if (uniform) {
    let maxDiffIndex = -1;
    let previousDiff = -1;
    for (let i = 0; i < minMax.max.length; i++) {
      const difference = minMax.max[i] - minMax.min[i];
      if (difference > previousDiff) {
        maxDiffIndex = i;
        previousDiff = difference;
      }
    }
    min = minMax.min[maxDiffIndex];
    max = minMax.max[maxDiffIndex];
  }

  let channels: number[] = new Array(image.components)
    .fill(0)
    .map((value, index) => index);

  if (image.colorModel === ImageColorModel.GREYA) {
    channels = [0];
  } else if (image.colorModel === ImageColorModel.RGBA) {
    channels = [0, 1, 2];
  }

  return image.level({
    inputMin: min,
    inputMax: max,
    outputMin: 0,
    outputMax: image.maxValue,
    channels,
    ...options,
  });
}
