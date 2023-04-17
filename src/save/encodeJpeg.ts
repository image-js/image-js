import { encode } from 'jpeg-js';

import { Image } from '../Image';

export interface EncodeJpegOptions {
  /**
   * Defines jpeg quality. Integer value between 1 and 100%, 100% being the best quality.
   *
   * @default 50
   */
  quality?: number;
}

/**
 * Creates a JPEG buffer from an image.
 *
 * @param image - The image instance.
 * @param options - JPEG encoding options.
 * @returns The buffer.
 */
export function encodeJpeg(
  image: Image,
  options: EncodeJpegOptions = {},
): Uint8Array {
  const { quality = 50 } = options;

  if (image.colorModel !== 'RGBA') {
    image = image.convertColor('RGBA');
  }
  if (image.bitDepth !== 8) {
    image = image.convertBitDepth(8);
  }

  // Image data after bit depth conversion will always be UInt8Array
  const buffer = encode(image.getRawImage(), quality).data;
  return new Uint8Array(buffer, buffer.byteOffset, buffer.byteLength);
}
