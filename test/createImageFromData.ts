import type {
  BitDepth,
  ImageColorModel,
  ImageDataArray,
  ImageOptions,
} from '../src/index.js';
import { Image, colorModels } from '../src/index.js';

export type CreateImageOptions = Pick<ImageOptions, 'bitDepth'>;

/**
 * Create a new Image object from image data.
 * @param data - Image data.
 * @param colorModel - Image color model.
 * @param options - Additional options to create the image.
 * @returns The new image.
 */
export function createImageFromData(
  data: number[][] | string,
  colorModel: ImageColorModel,
  options: CreateImageOptions = {},
): Image {
  const { bitDepth = 8 } = options;
  if (Array.isArray(data)) {
    return createImageFrom2DArray(data, colorModel, bitDepth);
  } else {
    return createImageFromString(data, colorModel, bitDepth);
  }
}

/**
 * Create a new Image object from a 2D matrix.
 * @param data - Image data.
 * @param colorModel - Image color model.
 * @param bitDepth - Bit depth.
 * @returns - The new image.
 */
function createImageFrom2DArray(
  data: number[][],
  colorModel: ImageColorModel,
  bitDepth: BitDepth,
): Image {
  const { channels } = colorModels[colorModel];
  const height = data.length;
  const width = data[0].length / channels;
  const imageData = createDataArray(height * width * channels, bitDepth);
  for (let row = 0; row < height; row++) {
    if (data[row].length % channels !== 0) {
      throw new RangeError(
        `length of row ${row} (${data[row].length}) is not a multiple of channels (${channels})`,
      );
    }
    if (data[row].length !== width * channels) {
      throw new RangeError(
        `length of row ${row} (${
          data[row].length / channels
        }) does not match width (${width})`,
      );
    }

    for (let col = 0; col < width; col++) {
      for (let channel = 0; channel < channels; channel++) {
        imageData[row * width * channels + col * channels + channel] =
          data[row][col * channels + channel];
      }
    }
  }
  return new Image(width, height, {
    bitDepth,
    colorModel,
    data: imageData,
  });
}

/**
 * Create a new Image object from data encoded in a string.
 * @param data - Image data.
 * @param colorModel - Image color model.
 * @param bitDepth - Bit depth.
 * @returns - The new image.
 */
function createImageFromString(
  data: string,
  colorModel: ImageColorModel,
  bitDepth: BitDepth,
): Image {
  const { channels } = colorModels[colorModel];
  const trimmed = data.trim();
  const lines = trimmed.split('\n');
  const height = lines.length;
  const width = lines[0].trim().split(/[^0-9]+/).length / channels;
  const imageData = createDataArray(height * width * channels, bitDepth);
  for (let row = 0; row < height; row++) {
    const line = lines[row].trim();
    const values = line.split(/[^0-9]+/).map((v) => Number.parseInt(v, 10));
    if (values.length % channels !== 0) {
      throw new RangeError(
        `length of row ${row} (${values.length}) is not a multiple of channels (${channels})`,
      );
    }
    if (values.length !== width * channels) {
      throw new RangeError(
        `length of row ${row} (${
          values.length / channels
        }) does not match width (${width})`,
      );
    }

    for (let col = 0; col < width; col++) {
      for (let channel = 0; channel < channels; channel++) {
        imageData[row * width * channels + col * channels + channel] =
          values[col * channels + channel];
      }
    }
  }
  return new Image(width, height, {
    bitDepth,
    colorModel,
    data: imageData,
  });
}

/**
 * Create a new data typed array for an image.
 * @param size - Total size of the data array.
 * @param bitDepth - Bit depth.
 * @returns The created array.
 */
function createDataArray(size: number, bitDepth: BitDepth): ImageDataArray {
  if (bitDepth === 8) {
    return new Uint8Array(size);
  } else {
    return new Uint16Array(size);
  }
}
