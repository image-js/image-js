import { IJS, ColorDepth } from '../IJS';

export function convertDepth(image: IJS, newDepth: ColorDepth): IJS {
  if (image.depth === newDepth) {
    throw new Error('cannot convert image to same depth');
  }

  if (newDepth === ColorDepth.UINT16) {
    return convertToUint16(image);
  } else {
    return convertToUint8(image);
  }
}

function convertToUint16(image: IJS): IJS {
  const newImage = new IJS({
    width: image.width,
    height: image.height,
    depth: ColorDepth.UINT16,
    kind: image.kind,
  });

  for (let i = 0; i < image.data.length; i++) {
    newImage.data[i] = image.data[i] << 8;
  }

  return newImage;
}

function convertToUint8(image: IJS): IJS {
  const newImage = new IJS({
    width: image.width,
    height: image.height,
    depth: ColorDepth.UINT8,
    kind: image.kind,
  });

  for (let i = 0; i < image.data.length; i++) {
    newImage.data[i] = image.data[i] >> 8;
  }

  return newImage;
}
