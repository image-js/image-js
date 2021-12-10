import { IJS, ImageColorModel } from '../IJS';
import { Mask } from '../Mask';
import { getOutputImage } from '../utils/getOutputImage';

export interface ConvertColorOptions {
  out?: IJS;
}

/**
 * Convert image to a different color model.
 *
 * @param image - Image to convert.
 * @param colorModel - New color model.
 * @param options - Convert color options.
 * @returns The converted image.
 */
export function convertColor(
  image: IJS | Mask,
  colorModel: ImageColorModel,
  options: ConvertColorOptions = {},
): IJS {
  const canConvert = new Map([
    [
      ImageColorModel.GREY,
      [ImageColorModel.GREYA, ImageColorModel.RGB, ImageColorModel.RGBA],
    ],
    [
      ImageColorModel.GREYA,
      [ImageColorModel.GREY, ImageColorModel.RGB, ImageColorModel.RGBA],
    ],
    [
      ImageColorModel.RGB,
      [ImageColorModel.GREYA, ImageColorModel.GREY, ImageColorModel.RGBA],
    ],
    [
      ImageColorModel.RGBA,
      [ImageColorModel.GREYA, ImageColorModel.GREY, ImageColorModel.RGB],
    ],
    [ImageColorModel.BINARY, [ImageColorModel.GREY]],
  ]);

  if (image.colorModel === colorModel) {
    throw new Error(`Cannot convert color, image is already ${colorModel}`);
  }

  const canConvertTo = canConvert.get(image.colorModel);
  if (!canConvertTo || !canConvertTo.includes(colorModel)) {
    throw new Error(
      `conversion from ${image.colorModel} to ${colorModel} not implemented`,
    );
  }

  const output = getOutputImage(image, options, {
    newParameters: { colorModel: colorModel },
  });

  if (
    image.colorModel === ImageColorModel.GREY ||
    image.colorModel === ImageColorModel.GREYA
  ) {
    convertGreyToAny(image, output);
  }

  if (
    image.colorModel === ImageColorModel.RGB ||
    image.colorModel === ImageColorModel.RGBA
  ) {
    if (
      colorModel === ImageColorModel.RGB ||
      colorModel === ImageColorModel.RGBA
    ) {
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
}
/**
 * Copy alpha channel of source to dest.
 *
 * @param source - Source image.
 * @param dest - Destination image.
 */
export function copyAlpha(source: IJS, dest: IJS): void {
  if (source.size !== dest.size) {
    throw new Error('source and destination have different sizes');
  }
  if (!source.alpha) {
    throw new Error('source image does not have alpha');
  }
  if (!dest.alpha) {
    throw new Error('destination does not have alpha');
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
 *
 * @param image - Image to convert.
 * @param newImage - Converted image.
 */
function convertGreyToAny(image: IJS, newImage: IJS): void {
  for (let i = 0; i < image.size; i++) {
    for (let j = 0; j < newImage.components; j++) {
      newImage.setValueByIndex(i, j, image.getValueByIndex(i, 0));
    }
  }
}

/**
 * Convert RGB image to RGB. Allows to use convert with an RGB target whatever the image color model is.
 *
 * @param image - Image to convert.
 * @param newImage - Converted image.
 */
function convertRgbToRgb(image: IJS, newImage: IJS): void {
  for (let i = 0; i < image.size; i++) {
    for (let j = 0; j < 3; j++) {
      newImage.setValueByIndex(i, j, image.getValueByIndex(i, j));
    }
  }
}

/**
 * Convert RGB image to GREY.
 *
 * @param image - Image to convert.
 * @param newImage - Converted image.
 */
function convertRgbToGrey(image: IJS, newImage: IJS): void {
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
 *
 * @param mask - Mask to convert.
 * @param newImage - Converted image.
 */
export function convertBinaryToGrey(mask: Mask, newImage: IJS): void {
  for (let i = 0; i < mask.size; i++) {
    newImage.setValueByIndex(
      i,
      0,
      mask.getBitByIndex(i) ? newImage.maxValue : 0,
    );
  }
}
