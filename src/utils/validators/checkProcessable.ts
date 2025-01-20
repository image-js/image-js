import type { BitDepth, Image } from '../../Image.js';
import type { Mask } from '../../Mask.js';
import type { ImageColorModel } from '../constants/colorModels.js';

const formatter = new Intl.ListFormat('en', { type: 'disjunction' });

interface CheckOptions {
  bitDepth?: BitDepth[] | BitDepth;
  alpha?: boolean[] | boolean;
  colorModel?: ImageColorModel[] | ImageColorModel;
  components?: number[] | number;
  channels?: number[] | number;
}

/**
 * This method checks if a process can be applied on the current image.
 * @param image - Image for which compatibility has to be checked.
 * @param options - Check processable options.
 */
export default function checkProcessable(
  image: Image | Mask,
  options: CheckOptions = {},
) {
  let { bitDepth, alpha, colorModel, components, channels } = options;
  if (bitDepth) {
    if (!Array.isArray(bitDepth)) {
      bitDepth = [bitDepth];
    }
    if (!bitDepth.includes(image.bitDepth)) {
      throw new RangeError(
        `image bitDepth must be ${format(bitDepth)} to apply this algorithm`,
      );
    }
  }
  if (alpha) {
    if (!Array.isArray(alpha)) {
      alpha = [alpha];
    }
    if (!alpha.includes(image.alpha)) {
      throw new RangeError(
        `image alpha must be ${format(alpha)} to apply this algorithm`,
      );
    }
  }
  if (colorModel) {
    if (!Array.isArray(colorModel)) {
      colorModel = [colorModel];
    }
    if (!colorModel.includes(image.colorModel)) {
      throw new RangeError(
        `image colorModel must be ${format(
          colorModel,
        )} to apply this algorithm`,
      );
    }
  }
  if (components) {
    if (!Array.isArray(components)) {
      components = [components];
    }
    if (!components.includes(image.components)) {
      const errorMessage = `image components must be ${format(
        components,
      )} to apply this algorithm`;
      if (components.length === 1 && components[0] === 1) {
        throw new RangeError(
          `${errorMessage}. The image can be converted using "image.grey()"`,
        );
      } else {
        throw new RangeError(errorMessage);
      }
    }
  }
  if (channels) {
    if (!Array.isArray(channels)) {
      channels = [channels];
    }
    if (!channels.includes(image.channels)) {
      throw new RangeError(
        `image channels must be ${format(channels)} to apply this algorithm`,
      );
    }
  }
}

type ArrayType = number[] | ImageColorModel[] | BitDepth[] | boolean[];

/**
 * Format array to a string.
 * @param array - Array to format.
 * @returns The formatted string.
 */
export function format(array: ArrayType) {
  return formatter.format(array.map(String));
}
