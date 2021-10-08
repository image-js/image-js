import { IJS, ImageColorModel } from '../IJS';
import { getOutputImage } from '../utils/getOutputImage';

export interface IConvertColorOptions {
  out?: IJS;
}

export function convertColor(
  image: IJS,
  colorModel: ImageColorModel,
  options: IConvertColorOptions = {},
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

function copyAlpha(source: IJS, dest: IJS): void {
  if (!source.alpha) {
    throw new Error('source image does not have alpha');
  }
  if (!dest.alpha) {
    throw new Error('destination does not have alpha');
  }

  for (
    let i = dest.channels - 1, j = source.channels - 1;
    i < dest.data.length;
    i += dest.channels, j += source.channels
  ) {
    dest.data[i] = source.data[j];
  }
}

function convertGreyToAny(image: IJS, newImage: IJS): void {
  for (
    let i = 0, iNew = 0;
    i < image.data.length;
    i += image.channels, iNew += newImage.channels
  ) {
    for (let j = 0; j < newImage.components; j++) {
      newImage.data[iNew + j] = image.data[i];
    }
  }
}

function convertRgbToRgb(image: IJS, newImage: IJS): void {
  for (
    let i = 0, iNew = 0;
    i < image.data.length;
    i += image.channels, iNew += newImage.channels
  ) {
    for (let j = 0; j < 3; j++) {
      newImage.data[iNew + j] = image.data[i + j];
    }
  }
}

function convertRgbToGrey(image: IJS, newImage: IJS): void {
  for (
    let i = 0, iNew = 0;
    i < image.data.length;
    i += image.channels, iNew += newImage.channels
  ) {
    const r = image.data[i];
    const g = image.data[i + 1];
    const b = image.data[i + 2];
    newImage.data[iNew] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
}
