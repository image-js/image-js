import { decode as decodeExif } from 'fast-jpeg';
import { decode } from 'jpeg-js';

import { Image } from '../Image.js';

import { getMetadata } from './getMetadata.js';

/**
 * Decode a jpeg. See the jpeg-js npm module.
 * @param buffer - The data to decode.
 * @returns The decoded image.
 */
export function decodeJpeg(buffer: Uint8Array): Image {
  const jpeg = decode(buffer, {
    useTArray: true,
    maxMemoryUsageInMB: Number.POSITIVE_INFINITY,
    maxResolutionInMP: Number.POSITIVE_INFINITY,
  });

  const decodedExif = decodeExif(buffer);
  // TODO : handle stacks (many IFDs?)
  const meta = decodedExif.exif?.[0]
    ? getMetadata(decodedExif.exif[0])
    : undefined;

  return new Image(jpeg.width, jpeg.height, {
    data: jpeg.data,
    colorModel: 'RGBA',
    meta,
  });
}
