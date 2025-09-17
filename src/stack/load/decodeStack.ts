import imageType from 'image-type';
import { match } from 'ts-pattern';

import type { Stack } from '../../Stack.js';

import { decodeStackFromApng } from './decodeApng.ts';
import { decodeStackFromTiff } from './decodeTiff.js';

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
  return match(type)
    .with({ mime: 'image/tiff' }, () => decodeStackFromTiff(typedArray))
    .with({ mime: 'image/png' }, () => decodeStackFromApng(typedArray))
    .otherwise(() => {
      throw new RangeError(`invalid data format: ${type?.mime}`);
    });
}
