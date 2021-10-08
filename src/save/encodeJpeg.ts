import { encode } from 'jpeg-js';

import { Image, ImageKind, ColorDepth } from '../Image';

export interface IEncodeJpegOptions {
  quality?: number;
}

export function encodeJpeg(
  image: Image,
  options: IEncodeJpegOptions = {}
): Uint8Array {
  const { quality = 50 } = options;

  if (image.kind !== ImageKind.RGBA) {
    image = image.convertColor(ImageKind.RGBA);
  }
  if (image.depth !== ColorDepth.UINT8) {
    image = image.convertDepth(ColorDepth.UINT8);
  }

  // Image data after depth conversion will always be UInt8Array
  // @ts-ignore
  const buffer = encode(image, quality).data;
  return new Uint8Array(buffer, buffer.byteOffset, buffer.byteLength);
}
