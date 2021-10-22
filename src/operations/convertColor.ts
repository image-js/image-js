import { IJS, ImageColorModel } from '../IJS';
import { getOutputImage } from '../utils/getOutputImage';

export interface ConvertColorOptions {
  out?: IJS;
}

export function convertColor(
  image: IJS,
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
 * @param source - Source image.
 * @param dest - Destination image.
 */
function copyAlpha(source: IJS, dest: IJS): void {
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

function convertGreyToAny(image: IJS, newImage: IJS): void {
  for (let i = 0; i < image.size; i++) {
    for (let j = 0; j < newImage.components; j++) {
      newImage.setValueByIndex(i, j, image.getValueByIndex(i, j));
    }
  }
}

function convertRgbToRgb(image: IJS, newImage: IJS): void {
  for (let i = 0; i < image.size; i++) {
    for (let j = 0; j < 3; j++) {
      newImage.setValueByIndex(i, j, image.getValueByIndex(i, j));
    }
  }
}

function convertRgbToGrey(image: IJS, newImage: IJS): void {
  for (
    let i = 0, iNew = 0;
    i < image.size;
    i += image.channels, iNew += newImage.channels
  ) {
    const r = image.getValueByIndex(i, 0);
    const g = image.getValueByIndex(i, 1);
    const b = image.getValueByIndex(i, 2);
    newImage.setValueByIndex(
      iNew,
      0,
      Math.round(0.299 * r + 0.587 * g + 0.114 * b),
    );
  }
}
