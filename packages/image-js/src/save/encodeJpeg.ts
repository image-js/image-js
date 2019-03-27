import { encode } from 'jpeg-js';

import { Image, ImageKind, ColorDepth } from '../Image';

export function encodeJpeg(image: Image): ArrayBufferView {
  image = image.convertColor(ImageKind.RGBA);
  //   image = image.convertDepth(ColorDepth.UINT8);

  // Image data after depth conversion will always be UInt8Array
  // @ts-ignore
  return encode(image);
}
