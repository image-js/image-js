import { decode } from 'jpeg-js';

import { IJS, ImageColorModel } from '../IJS';

/**
 * Decode a jpeg. See the jpeg-js npm module.
 *
 * @param buffer - The data to decode.
 */
export function decodeJpeg(buffer: Uint8Array): IJS {
  const jpeg = decode(buffer, { useTArray: true });
  return new IJS(jpeg.width, jpeg.height, {
    data: jpeg.data,
    colorModel: ImageColorModel.RGBA,
  });
}
