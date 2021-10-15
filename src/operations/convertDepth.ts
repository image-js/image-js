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
  const newImage = new IJS(image.width, image.height, {
    depth: ColorDepth.UINT16,
    colorModel: image.colorModel,
  });

  for (let i = 0; i < image.size; i++) {
    for (let j = 0; j < newImage.components; j++) {
      newImage.setValueByIndex(i, j, image.getValueByIndex(i, j) << 8);
    }
  }
  return newImage;
}

function convertToUint8(image: IJS): IJS {
  const newImage = new IJS(image.width, image.height, {
    depth: ColorDepth.UINT8,
    colorModel: image.colorModel,
  });
  for (let i = 0; i < image.size; i++) {
    for (let j = 0; j < newImage.components; j++) {
      newImage.setValueByIndex(i, j, image.getValueByIndex(i, j) >> 8);
    }
  }
  return newImage;
}
