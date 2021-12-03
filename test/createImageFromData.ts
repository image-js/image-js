import {
  ColorDepth,
  IJS,
  ImageColorModel,
  ImageDataArray,
  ImageOptions,
} from '../src';
import { colorModels } from '../src/utils/colorModels';

export type CreateImageOptions = Pick<ImageOptions, 'depth'>;

/**
 * Create a new IJS object from image data.
 *
 * @param data - Image data.
 * @param colorModel - Image color model.
 * @param options - Additional options to create the image.
 * @returns The new image.
 */
export function createImageFromData(
  data: number[][] | string,
  colorModel: ImageColorModel,
  options: CreateImageOptions = {},
): IJS {
  const { depth = ColorDepth.UINT8 } = options;
  if (Array.isArray(data)) {
    console.log(colorModel);
    return createImageFrom2DArray(data, colorModel, depth);
  } else {
    return createImageFromString(data, colorModel, depth);
  }
}

/**
 * Create a new IJS object from a 2D matrix.
 *
 * @param data - Image data.
 * @param colorModel - Image color model.
 * @param depth - Color depth.
 * @returns - The new image.
 */
function createImageFrom2DArray(
  data: number[][],
  colorModel: ImageColorModel,
  depth: ColorDepth,
): IJS {
  const { channels } = colorModels[colorModel];
  const height = data.length;
  const width = data[0].length / channels;
  const imageData = createDataArray(height * width * channels, depth);
  for (let row = 0; row < height; row++) {
    if (data[row].length % channels !== 0) {
      throw new Error(
        `length of row ${row} (${data[row].length}) is not a multiple of channels (${channels})`,
      );
    }
    if (data[row].length !== width * channels) {
      throw new Error(
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
  return new IJS(width, height, {
    depth,
    colorModel,
    data: imageData,
  });
}

/**
 * Create a new IJS object from data encoded in a string.
 *
 * @param data - Image data.
 * @param colorModel - Image color model.
 * @param depth - Color depth.
 * @returns - The new image.
 */
function createImageFromString(
  data: string,
  colorModel: ImageColorModel,
  depth: ColorDepth,
): IJS {
  const { channels } = colorModels[colorModel];
  const trimmed = data.trim();
  const lines = trimmed.split('\n');
  const height = lines.length;
  const width = lines[0].trim().split(/[^0-9]+/).length / channels;
  const imageData = createDataArray(height * width * channels, depth);
  for (let row = 0; row < height; row++) {
    const line = lines[row].trim();
    const values = line.split(/[^0-9]+/).map((v) => parseInt(v, 10));
    if (values.length % channels !== 0) {
      throw new Error(
        `length of row ${row} (${values.length}) is not a multiple of channels (${channels})`,
      );
    }
    if (values.length !== width * channels) {
      throw new Error(
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
  return new IJS(width, height, {
    depth,
    colorModel,
    data: imageData,
  });
}

/**
 * Create a new data typed array for an image.
 *
 * @param size - Total size of the data array.
 * @param depth - Color depth.
 * @returns The created array.
 */
function createDataArray(size: number, depth: ColorDepth): ImageDataArray {
  if (depth === ColorDepth.UINT8) {
    return new Uint8Array(size);
  } else {
    return new Uint16Array(size);
  }
}
