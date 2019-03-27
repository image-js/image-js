import { Image, ImageKind } from '../Image';

export function convertColor(image: Image, kind: ImageKind): Image {
  const canConvert = new Map([
    [ImageKind.GREY, [ImageKind.GREYA, ImageKind.RGB, ImageKind.RGBA]],
    [ImageKind.GREYA, [ImageKind.GREY, ImageKind.RGB, ImageKind.RGBA]]
    //   [ImageKind.RGB, [ImageKind.RGBA]],
    //   [ImageKind.RGBA, [ImageKind.RGB]]
  ]);

  if (image.kind === kind) {
    throw new Error(`Cannot convert color, image is already ${kind}`);
  }

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
    for (
      let i = 0, iNew = 0;
      i < image.data.length;
      i += image.channels, iNew += newImage.channels
    ) {
      for (let j = 0; j < newImage.components; j++) {
        newImage.data[iNew + j] = image.data[i];
      }
    }
    if (!image.alpha && newImage.alpha) {
      newImage.fillAlpha(newImage.maxValue);
    }

    if (image.alpha && newImage.alpha) {
      copyAlpha(image, newImage);
    }
  }

  //   if (image.kind === ImageKind.RGB) {
  //   }

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
