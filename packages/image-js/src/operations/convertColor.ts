import { Image, ImageKind } from '../Image';
import { getOutputImage } from '../utils/getOutputImage';

export interface IConvertColorOptions {
  out?: Image;
}

export function convertColor(
  image: Image,
  kind: ImageKind,
  options: IConvertColorOptions = {}
): Image {
  const canConvert = new Map([
    [ImageKind.GREY, [ImageKind.GREYA, ImageKind.RGB, ImageKind.RGBA]],
    [ImageKind.GREYA, [ImageKind.GREY, ImageKind.RGB, ImageKind.RGBA]],
    [ImageKind.RGB, [ImageKind.GREYA, ImageKind.GREY, ImageKind.RGBA]],
    [ImageKind.RGBA, [ImageKind.GREYA, ImageKind.GREY, ImageKind.RGB]]
  ]);

  if (image.kind === kind) {
    throw new Error(`Cannot convert color, image is already ${kind}`);
  }

  const canConvertTo = canConvert.get(image.kind);
  if (!canConvertTo || !canConvertTo.includes(kind)) {
    throw new Error(`conversion from ${image.kind} to ${kind} not implemented`);
  }

  const output = getOutputImage(image, options, {
    newParameters: { kind }
  });

  if (image.kind === ImageKind.GREY || image.kind === ImageKind.GREYA) {
    convertGreyToAny(image, output);
  }

  if (image.kind === ImageKind.RGB || image.kind === ImageKind.RGBA) {
    if (kind === ImageKind.RGB || kind === ImageKind.RGBA) {
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

function copyAlpha(source: Image, dest: Image): void {
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

function convertGreyToAny(image: Image, newImage: Image): void {
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

function convertRgbToRgb(image: Image, newImage: Image): void {
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

function convertRgbToGrey(image: Image, newImage: Image): void {
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
