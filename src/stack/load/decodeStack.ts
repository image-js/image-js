import imageType from 'image-type';

import { Stack } from '../../Stack';

import { decodeStackFromTiff } from './decodeTiff';

/**
 * Decode input data and create stack. Data format is automatically detected.
 * Possible formats: tiff.
 * @param data - Data to decode.
 * @returns The decoded image.
 */
export function decodeStack(data: ArrayBufferView): Stack {
  const typedArray = new Uint8Array(
    data.buffer,
    data.byteOffset,
    data.byteLength,
  );
  const type = imageType(typedArray);
  switch (type?.mime) {
    case 'image/tiff':
      return decodeStackFromTiff(typedArray);
    default:
      throw new RangeError(`invalid data format: ${type?.mime}`);
  }
}
