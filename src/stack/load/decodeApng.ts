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
      colorModel = 'GREY';
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
  for (const image of decodedApng.frames) {
    images.push(
      new Image(decodedApng.width, decodedApng.height, {
        data: image.data,
        colorModel,
      }),
    );
  }
  const stack = new Stack(images);
  return stack;
}
