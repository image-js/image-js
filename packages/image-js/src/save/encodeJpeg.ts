import { encode } from 'jpeg-js';

import { Image, ImageKind, ColorDepth } from '../Image';

export function encodeJpeg(image: Image): ArrayBufferView {
  if (image.kind !== ImageKind.RGBA) {
    image = image.convertColor(ImageKind.RGBA);
  }
  if (image.depth !== ColorDepth.UINT8) {
    throw new Error(`color depth of ${image.depth} not supported`);
  }
  //   image = image.convertDepth(ColorDepth.UINT8);

  // Image data after depth conversion will always be UInt8Array
  // @ts-ignore
  return encode(image).data;
}
