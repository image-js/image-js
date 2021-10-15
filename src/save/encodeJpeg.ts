import { encode } from 'jpeg-js';

import { IJS, ImageColorModel, ColorDepth } from '../IJS';

export interface EncodeJpegOptions {
  quality?: number;
}

export function encodeJpeg(
  image: IJS,
  options: EncodeJpegOptions = {},
): Uint8Array {
  const { quality = 50 } = options;

  if (image.colorModel !== ImageColorModel.RGBA) {
    image = image.convertColor(ImageColorModel.RGBA);
  }
  if (image.depth !== ColorDepth.UINT8) {
    image = image.convertDepth(ColorDepth.UINT8);
  }

  // Image data after depth conversion will always be UInt8Array
  const buffer = encode(image.getRawImage(), quality).data;
  return new Uint8Array(buffer, buffer.byteOffset, buffer.byteLength);
}
