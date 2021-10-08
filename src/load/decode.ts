import { IJS } from '../IJS';

import checkHeader from './checkHeader';
import { decodeJpeg } from './decodeJpeg';
import { decodePng } from './decodePng';

const pngHeader = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const jpegHeader = [0xff, 0xd8, 0xff];

/**
 * Decode input data. Data format is automatically detected.
 * Possible formats: png and jpeg.
 * @param data - data to decode
 */
export function decode(data: ArrayBufferView): IJS {
  const typedArray = new Uint8Array(
    data.buffer,
    data.byteOffset,
    data.byteLength,
  );
  if (checkHeader(typedArray, pngHeader)) {
    return decodePng(typedArray);
  } else if (checkHeader(typedArray, jpegHeader)) {
    return decodeJpeg(typedArray);
  } else {
    throw new Error('unrecognized data format');
  }
}
