import type { BitDepth, Image } from '../Image.js';
import { getOutputImage } from '../utils/getOutputImage.js';

export interface ConvertBitDepthOptions {
  /**
   * Image to which to output.
   */
  out?: Image;
}

/**
 * Convert the bit depth of an image.
 * @param image - Image to convert.
 * @param newBitDepth - Bit depth to convert to.
 * @param options - Convert bit depth options.
 * @returns Converted image.
 */
export function convertBitDepth(
  image: Image,
  newBitDepth: BitDepth,
  options: ConvertBitDepthOptions = {},
): Image {
  if (image.bitDepth === newBitDepth) {
    return getOutputImage(image, options, { clone: true });
  }

  if (newBitDepth !== 8 && newBitDepth !== 16) {
    throw new RangeError(
      `This image bit depth is not supported: ${newBitDepth}`,
    );
  }
  // Get the output image first - this handles the out option
  const newImage = getOutputImage(image, options, {
    clone: false,
    newParameters: {
      bitDepth: newBitDepth,
      colorModel: image.colorModel,
    },
  });

  return newBitDepth === 8
    ? convertToUint8(image, newImage)
    : convertToUint16(image, newImage);
}

/**
 * Convert bit depth to 16 bits.
 * @param image - Image to convert.
 * @param targetImage - Target image to write to.
 * @returns Converted image.
 */
function convertToUint16(image: Image, targetImage: Image): Image {
  for (let i = 0; i < image.size; i++) {
    for (let j = 0; j < targetImage.channels; j++) {
      targetImage.setValueByIndex(i, j, image.getValueByIndex(i, j) << 8);
    }
  }
  return targetImage;
}

/**
 * Convert bit depth to 8 bits.
 * @param image - Image to convert.
 * @param targetImage - Target image to write to.
 * @returns Converted image.
 */
function convertToUint8(image: Image, targetImage: Image): Image {
  for (let i = 0; i < image.size; i++) {
    for (let j = 0; j < targetImage.channels; j++) {
      targetImage.setValueByIndex(i, j, image.getValueByIndex(i, j) >> 8);
    }
  }
  return targetImage;
}
