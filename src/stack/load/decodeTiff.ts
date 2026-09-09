import { decode } from 'tiff';

import { Stack } from '../../Stack.ts';
import { getImageFromIFD } from '../../load/decodeTiff.ts';

/**
 * Decode a TIFF and create a stack of images.
 * @param buffer - The data to decode.
 * @returns The stack of images.
 */
export function decodeStackFromTiff(buffer: Uint8Array): Stack {
  const decoded = decode(buffer);
  const images = [];
  for (const IFD of decoded) {
    images.push(getImageFromIFD(IFD));
  }

  return new Stack(images);
}
