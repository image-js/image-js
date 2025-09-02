import { decode } from 'fast-bmp';

import { Image } from '../Image.ts';
import { Mask } from '../Mask.ts';
import type { ImageColorModel } from '../utils/constants/colorModels.ts';

/**
 *Decode a bmp. See the fast-bmp npm module.
 * @param data - The data to decode.
 * @returns The decoded image or mask.
 */
export function decodeBmp(data: Uint8Array): Image | Mask {
  const decodedData = decode(data);
  if (decodedData.bitsPerPixel === 1) {
    return new Mask(decodedData.width, decodedData.height, {
      data: decodedData.data as Uint8Array,
    });
  } else {
    let colorModel: ImageColorModel;
    switch (decodedData.channels) {
      case 1:
        colorModel = 'GREY';
        break;
      case 2:
        colorModel = 'GREYA';
        break;
      case 3:
        colorModel = 'RGB';
        break;
      case 4:
        colorModel = 'RGBA';
        break;
      default:
        throw new RangeError(
          `invalid number of channels: ${decodedData.channels}`,
        );
    }
    return new Image(decodedData.width, decodedData.height, {
      colorModel,
      data: decodedData.data as Uint8Array,
    });
  }
}
