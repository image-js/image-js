import { IJS, ImageColorModel } from '../src';
import { colorModels } from '../src/utils/colorModels';

export function createImageFromData(
  data: number[][] | string,
  colorModel: ImageColorModel,
): IJS {
  if (Array.isArray(data)) {
    return createImageFrom2DArray(data, colorModel);
  } else {
    return createImageFromString(data, colorModel);
  }
}

function createImageFrom2DArray(
  data: number[][],
  colorModel: ImageColorModel,
): IJS {
  const { channels } = colorModels[colorModel];
  const height = data.length;
  const width = data[0].length / channels;
  const imageData = new Uint8Array(height * width * channels);
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
    depth: 8,
    colorModel,
    data: imageData,
  });
}

function createImageFromString(data: string, colorModel: ImageColorModel): IJS {
  const { channels } = colorModels[colorModel];
  const trimmed = data.trim();
  const lines = trimmed.split('\n');
  const height = lines.length;
  const width = lines[0].trim().split(/[^0-9]+/).length / channels;
  const imageData = new Uint8Array(height * width * channels);
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
    depth: 8,
    colorModel,
    data: imageData,
  });
}
