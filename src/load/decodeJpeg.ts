import { decode } from 'jpeg-js';

import { Image, ImageColorModel } from '../Image';

/**
 * Decode a jpeg. See the jpeg-js npm module.
 *
 * @param buffer - The data to decode.
 * @returns The decoded image.
 */
export function decodeJpeg(buffer: Uint8Array): Image {
  const jpeg = decode(buffer, {
    useTArray: true,
    maxMemoryUsageInMB: Number.POSITIVE_INFINITY,
    maxResolutionInMP: Number.POSITIVE_INFINITY,
  });
  return new Image(jpeg.width, jpeg.height, {
    data: jpeg.data,
    colorModel: ImageColorModel.RGBA,
  });
}
