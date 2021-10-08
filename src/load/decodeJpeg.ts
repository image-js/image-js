import { decode } from 'jpeg-js';

import { Image, ImageKind } from '../Image';

/**
 * Decode a jpeg. See the jpeg-js npm module.
 * @param buffer The data to decode
 */
export function decodeJpeg(buffer: Uint8Array): Image {
  const jpeg = decode(buffer, true);
  return new Image(jpeg.width, jpeg.height, {
    data: jpeg.data,
    kind: ImageKind.RGBA
  });
}
