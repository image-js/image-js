import { Image, ImageKind } from '../Image';

export function convertColor(image: Image, kind: ImageKind): Image {
  const canConvert = new Map([
    [ImageKind.GREY, [ImageKind.GREYA, ImageKind.RGB, ImageKind.RGBA]],
    [ImageKind.GREYA, [ImageKind.GREY, ImageKind.RGB, ImageKind.RGBA]],
    [ImageKind.RGB, [ImageKind.GREYA, ImageKind.GREY, ImageKind.RGBA]],
    [ImageKind.RGBA, [ImageKind.GREYA, ImageKind.GREY, ImageKind.RGB]]
  ]);

  if (image.kind === kind) {
    throw new Error(`Cannot convert color, image is already ${kind}`);
  }

  // TODO: handle conversion from RGB to GREY
  const canConvertTo = canConvert.get(image.kind);
  if (!canConvertTo || !canConvertTo.includes(kind)) {
    throw new Error(`conversion from ${image.kind} to ${kind} not implemented`);
  }

  const newImage = new Image({
    width: image.width,
    height: image.height,
    depth: image.depth,
    kind
  });

  if (image.kind === ImageKind.GREY || image.kind === ImageKind.GREYA) {
    convertGreyToAny(image, newImage);
  }

  if (image.kind === ImageKind.RGB || image.kind === ImageKind.RGBA) {
    if (kind === ImageKind.RGB || kind === ImageKind.RGBA) {
      convertRgbToRgb(image, newImage);
    } else {
      // GREYA or GREY
      convertRgbToGrey(image, newImage);
    }
  }

  if (!image.alpha && newImage.alpha) {
    newImage.fillAlpha(newImage.maxValue);
  }

  if (image.alpha && newImage.alpha) {
    copyAlpha(image, newImage);
  }

  return newImage;
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
