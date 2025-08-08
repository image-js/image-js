import { Image } from '../Image.js';
import type { Mask } from '../Mask.js';
import type { ImageColorModel } from '../utils/constants/colorModels.js';
import { getOutputImage, maskToOutputImage } from '../utils/getOutputImage.js';

export interface ConvertColorOptions {
  /**
   * Image to which to output.
   */
  out?: Image;
}

/**
 * Convert image to a different color model.
 * @param image - Image to convert.
 * @param colorModel - New color model.
 * @param options - Convert color options.
 * @returns The converted image.
 */
export function convertColor(
  image: Image | Mask,
  colorModel: ImageColorModel,
  options: ConvertColorOptions = {},
): Image {
  const canConvert = new Map<ImageColorModel, ImageColorModel[]>([
    ['GREY', ['GREYA', 'RGB', 'RGBA']],
    ['GREYA', ['GREY', 'RGB', 'RGBA']],
    ['RGB', ['GREY', 'GREYA', 'RGBA']],
    ['RGBA', ['GREY', 'GREYA', 'RGB']],
    ['BINARY', ['GREY', 'RGB', 'RGBA']],
  ]);

  if (image.colorModel === colorModel && colorModel !== 'BINARY') {
    return getOutputImage(
      image as Image,
      { out: options.out },
      { clone: true },
    );
  }

  const canConvertTo = canConvert.get(image.colorModel);
  if (!canConvertTo?.includes(colorModel)) {
    throw new RangeError(
      `conversion from ${image.colorModel} to ${colorModel} not implemented`,
    );
  }

  if (image instanceof Image) {
    const output = getOutputImage(image, options, {
      newParameters: { colorModel },
    });

    if (image.colorModel === 'GREY' || image.colorModel === 'GREYA') {
      convertGreyToAny(image, output);
    }

    if (image.colorModel === 'RGB' || image.colorModel === 'RGBA') {
      if (colorModel === 'RGB' || colorModel === 'RGBA') {
        convertRgbToRgb(image, output);
      } else {
        // GREYA or GREY
        convertRgbToGrey(image, output);
      }
    }

    if (!image.alpha && output.alpha) {
      output.fillAlpha(output.maxValue);
    }

    if (image.alpha && output.alpha) {
      copyAlpha(image, output);
    }
    return output;
  } else if (colorModel === 'GREY') {
    const output = maskToOutputImage(image, options);
    convertBinaryToGrey(image, output);
    return output;
  } else {
    const img = new Image(image.width, image.height, {
      colorModel,
    });
    convertBinaryToRgb(image, img);
    return img;
  }
}

/**
 * Copy alpha channel of source to dest.
 * @param source - Source image.
 * @param dest - Destination image.
 */
export function copyAlpha(source: Image, dest: Image): void {
  if (source.size !== dest.size) {
    throw new RangeError('source and destination have different sizes');
  }
  if (!source.alpha) {
    throw new RangeError('source image does not have alpha');
  }
  if (!dest.alpha) {
    throw new RangeError('destination does not have alpha');
  }

  for (let i = 0; i < dest.size; i++) {
    dest.setValueByIndex(
      i,
      dest.channels - 1,
      source.getValueByIndex(i, source.channels - 1),
    );
  }
}

/**
 * Convert grey image to other color model.
 * @param image - Image to convert.
 * @param newImage - Converted image.
 */
function convertGreyToAny(image: Image, newImage: Image): void {
  for (let i = 0; i < image.size; i++) {
    for (let j = 0; j < newImage.components; j++) {
      newImage.setValueByIndex(i, j, image.getValueByIndex(i, 0));
    }
  }
}

/**
 * Convert RGB image to RGB. Allows to use convert with an RGB target whatever the image color model is.
 * @param image - Image to convert.
 * @param newImage - Converted image.
 */
function convertRgbToRgb(image: Image, newImage: Image): void {
  for (let i = 0; i < image.size; i++) {
    for (let j = 0; j < 3; j++) {
      newImage.setValueByIndex(i, j, image.getValueByIndex(i, j));
    }
  }
}

/**
 * Convert RGB image to GREY.
 * @param image - Image to convert.
 * @param newImage - Converted image.
 */
function convertRgbToGrey(image: Image, newImage: Image): void {
  for (let i = 0; i < image.size; i++) {
    const r = image.getValueByIndex(i, 0);
    const g = image.getValueByIndex(i, 1);
    const b = image.getValueByIndex(i, 2);
    newImage.setValueByIndex(
      i,
      0,
      Math.round(0.299 * r + 0.587 * g + 0.114 * b),
    );
  }
}

/**
 * Convert Mask to GREY.
 * @param mask - Mask to convert.
 * @param newImage - Converted image.
 */
export function convertBinaryToGrey(mask: Mask, newImage: Image): void {
  for (let i = 0; i < mask.size; i++) {
    newImage.setValueByIndex(
      i,
      0,
      mask.getBitByIndex(i) ? newImage.maxValue : 0,
    );
  }
}

/**
 * Convert mask to RGB or RGBA.
 * @param mask - Mask to convert.
 * @param newImage - Converted image.
 */
export function convertBinaryToRgb(mask: Mask, newImage: Image): void {
  const black = new Array(newImage.components).fill(0);
  const white = new Array(newImage.components).fill(newImage.maxValue);
  if (newImage.alpha) {
    black.push(newImage.maxValue);
    white.push(newImage.maxValue);
  }
  for (let i = 0; i < mask.size; i++) {
    newImage.setPixelByIndex(i, mask.getBitByIndex(i) ? white : black);
  }
}
