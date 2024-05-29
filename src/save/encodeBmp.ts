//@ts-expect-error ts package not ready yet
import * as bmp from 'fast-bmp';

import { Image } from '../Image';
import { Mask } from '../Mask';

/**
 * Creates a BMP buffer from a mask.
 * @param mask - The mask instance.
 * @returns The buffer.
 */
export function encodeBmp(mask: Image | Mask) {
  if (!(mask instanceof Mask)) {
    throw new TypeError('Image bmp encoding is not implemented.');
  }
  const compressedBitMask = new Uint8Array(Math.ceil(mask.size / 8));
  let destIndex = 0;
  for (let index = 0; index < mask.size; index++) {
    if (index % 8 === 0 && index !== 0) {
      destIndex++;
    }
    if (destIndex !== compressedBitMask.length - 1) {
      compressedBitMask[destIndex] <<= 1;
      compressedBitMask[destIndex] |= mask.getBitByIndex(index);
    } else {
      compressedBitMask[destIndex] |= mask.getBitByIndex(index);
      compressedBitMask[destIndex] <<= 7 - (index % 8);
    }
  }

  return bmp.encode({
    width: mask.width,
    height: mask.height,
    components: 1,
    bitDepth: 1,
    channels: 1,
    data: compressedBitMask,
  });
}
