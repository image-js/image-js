import { Image, ColorDepth } from '../Image';

/**
 * Convert the color depth of an image.
 *
 * @param image - Image to convert.
 * @param newDepth - Depth to convert to.
 * @returns Converted image.
 */
export function convertDepth(image: Image, newDepth: ColorDepth): Image {
  if (image.depth === newDepth) {
    throw new Error('convertDepth: cannot convert image to same depth');
  }

  if (newDepth === 16) {
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
function convertToUint16(image: Image): Image {
  const newImage = new Image(image.width, image.height, {
    depth: 16,
    colorModel: image.colorModel,
    origin: image.origin,
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
function convertToUint8(image: Image): Image {
  const newImage = new Image(image.width, image.height, {
    depth: 8,
    colorModel: image.colorModel,
    origin: image.origin,
  });
  for (let i = 0; i < image.size; i++) {
    for (let j = 0; j < newImage.channels; j++) {
      newImage.setValueByIndex(i, j, image.getValueByIndex(i, j) >> 8);
    }
  }
  return newImage;
}
