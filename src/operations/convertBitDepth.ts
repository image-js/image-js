import { Image, BitDepth } from '../Image';

/**
 * Convert the bit depth of an image.
 * @param image - Image to convert.
 * @param newBitDepth - Bit depth to convert to.
 * @returns Converted image.
 */
export function convertBitDepth(image: Image, newBitDepth: BitDepth): Image {
  if (image.bitDepth === newBitDepth) {
    throw new RangeError('cannot convert image to same bitDepth');
  }

  if (newBitDepth === 16) {
    return convertToUint16(image);
  } else {
    return convertToUint8(image);
  }
}

/**
 * Convert bit depth to 16 bits.
 * @param image - Image to convert.
 * @returns Converted image.
 */
function convertToUint16(image: Image): Image {
  const newImage = new Image(image.width, image.height, {
    bitDepth: 16,
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
 * Convert bit depth to 8 bits.
 * @param image - Image to convert.
 * @returns Converted image.
 */
function convertToUint8(image: Image): Image {
  const newImage = new Image(image.width, image.height, {
    bitDepth: 8,
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
