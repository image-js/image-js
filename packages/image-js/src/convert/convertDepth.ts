import { Image, ColorDepth } from '../Image';

export function convertDepth(image: Image, newDepth: ColorDepth): Image {
  if (image.depth === newDepth) {
    throw new Error('cannot convert image to same depth');
  }

  if (newDepth === ColorDepth.UINT16) {
    return convertToUint16(image);
  } else {
    return convertToUint8(image);
  }
}

function convertToUint16(image: Image): Image {
  const newImage = new Image({
    width: image.width,
    height: image.height,
    depth: ColorDepth.UINT16,
    kind: image.kind
  });

  for (let i = 0; i < image.data.length; i++) {
    newImage.data[i] = image.data[i] << 8;
  }

  return newImage;
}

function convertToUint8(image: Image): Image {
  const newImage = new Image({
    width: image.width,
    height: image.height,
    depth: ColorDepth.UINT8,
    kind: image.kind
  });

  for (let i = 0; i < image.size; i++) {
    newImage.data[i] = image.data[i] >> 8;
  }

  return newImage;
}
