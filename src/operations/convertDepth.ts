import { IJS, ColorDepth } from '../IJS';

/**
 * Convert the color depth of an image.
 *
 * @param image - Image to convert.
 * @param newDepth - Depth to convert to.
 * @returns Converted image.
 */
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

/**
 * Convert image depth to 16 bits.
 *
 * @param image - Image to convert.
 * @returns Converted image.
 */
function convertToUint16(image: IJS): IJS {
  const newImage = new IJS(image.width, image.height, {
    depth: ColorDepth.UINT16,
    colorModel: image.colorModel,
  });

  for (let i = 0; i < image.size; i++) {
    for (let j = 0; j < newImage.channels; j++) {
      newImage.setValueByIndex(i, j, image.getValueByIndex(i, j) << 8);
    }
  }
  return newImage;
}

/**
 * Convert image depth to 8 bits.
 *
 * @param image - Image to convert.
 * @returns Converted image.
 */
function convertToUint8(image: IJS): IJS {
  const newImage = new IJS(image.width, image.height, {
    depth: ColorDepth.UINT8,
    colorModel: image.colorModel,
  });
  for (let i = 0; i < image.size; i++) {
    for (let j = 0; j < newImage.channels; j++) {
      newImage.setValueByIndex(i, j, image.getValueByIndex(i, j) >> 8);
    }
  }
  return newImage;
}
