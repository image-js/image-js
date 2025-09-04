import imageType from 'image-type';
import { match } from 'ts-pattern';

import type { Image } from '../Image.js';

import { decodeBmp } from './decodeBmp.ts';
import { decodeJpeg } from './decodeJpeg.js';
import { decodePng } from './decodePng.js';
import { decodeTiff } from './decodeTiff.js';
/**
 * Decode input data. Data format is automatically detected.
 * Possible formats: png, jpeg and tiff.
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
  return match(type)
    .with({ mime: 'image/png' }, () => decodePng(typedArray))
    .with({ mime: 'image/jpeg' }, () => decodeJpeg(typedArray))
    .with({ mime: 'image/tiff' }, () => decodeTiff(typedArray))
    .with({ mime: 'image/bmp' }, () => decodeBmp(typedArray))
    .otherwise(() => {
      throw new RangeError(`invalid data format: ${type?.mime}`);
    });
}
