import imageType from 'image-type';

import { Image } from '../Image';

import { decodeJpeg } from './decodeJpeg';
import { decodePng } from './decodePng';
import { decodeTiff } from './decodeTiff';

/**
 * Decode input data. Data format is automatically detected.
 * Possible formats: png, jpeg and tiff.
 *
 * @param data - Data to decode.
 * @returns The decoded image.
 */
export function decode(data: ArrayBufferView): Image {
  const typedArray = new Uint8Array(
    data.buffer,
    data.byteOffset,
    data.byteLength,
  );
  const type = imageType(typedArray);
  switch (type?.mime) {
    case 'image/png':
      return decodePng(typedArray);
    case 'image/jpeg':
      return decodeJpeg(typedArray);
    case 'image/tiff':
      return decodeTiff(typedArray);
    default:
      throw new RangeError(`invalid data format: ${type?.mime}`);
  }
}
