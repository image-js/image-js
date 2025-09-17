import { decode } from 'fast-bmp';

import { Image } from '../Image.ts';
import { Mask } from '../Mask.ts';
import type { ImageColorModel } from '../utils/constants/colorModels.ts';

/**
 * Decode a BMP. See the fast-bmp npm module.
 * @param data - The data to decode.
 * @returns The decoded image or mask.
 */
export function decodeBmp(data: Uint8Array): Image {
  const decodedData = decode(data);
  if (decodedData.bitsPerPixel === 1) {
    const mask = new Mask(decodedData.width, decodedData.height, {
      data: decodedData.data as Uint8Array,
    });
    return mask.convertColor('GREY');
  } else {
    let colorModel: ImageColorModel;
    switch (decodedData.channels) {
      case 1:
        colorModel = 'GREY';
        break;
      case 3:
        colorModel = 'RGB';
        break;
      default:
        colorModel = 'RGBA';
        break;
    }
    return new Image(decodedData.width, decodedData.height, {
      colorModel,
      data: decodedData.data as Uint8Array,
    });
  }
}
