import type { IndexedColors } from 'fast-png';
import { decodeApng } from 'fast-png';

import { Image } from '../../Image.ts';
import { Stack } from '../../Stack.ts';
import type { ImageColorModel } from '../../utils/constants/colorModels.ts';

/**
 * Decodes APNG image into a Stack
 * @param data - APNG data.
 * @returns stack of frames.
 */
export function decodeStackFromApng(data: Uint8Array) {
  const decodedApng = decodeApng(data);
  const images: Image[] = [];
  let colorModel: ImageColorModel;
  switch (decodedApng.channels) {
    case 1:
      if (decodedApng.palette) {
        colorModel = decodedApng.palette[0].length === 3 ? 'RGB' : 'RGBA';
      } else {
        colorModel = 'GREY';
      }
      break;
    case 2:
      colorModel = 'GREYA';
      break;
    case 3:
      colorModel = 'RGB';
      break;
    default:
      colorModel = 'RGBA';
      break;
  }
  if (decodedApng.palette) {
    for (const image of decodedApng.frames) {
      images.push(
        new Image(decodedApng.width, decodedApng.height, {
          data: convertIndexedData(
            image.data as Uint8Array,
            decodedApng.palette,
          ),
          colorModel,
        }),
      );
    }
  } else {
    for (const image of decodedApng.frames) {
      images.push(
        new Image(decodedApng.width, decodedApng.height, {
          data: image.data,
          colorModel,
        }),
      );
    }
  }

  const stack = new Stack(images);

  return stack;
}

function convertIndexedData(data: Uint8Array, palette: IndexedColors) {
  const result = new Uint8Array(data.length * palette[0].length);
  for (let i = 0; i < data.length; i++) {
    for (let channel = 0; channel < palette[0].length; channel++) {
      result[i * palette[0].length + channel] = palette[data[i]][channel];
    }
  }
  return result;
}
