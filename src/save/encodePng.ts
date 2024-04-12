import { encode, PngEncoderOptions } from 'fast-png';

import { Image } from '../Image';

export type EncodePngOptions = PngEncoderOptions;

/**
 * Creates a PNG buffer from an image.
 * @param image - The image instance.
 * @param options - PNG encoding options.
 * @returns The buffer.
 */
export function encodePng(
  image: Image,
  options?: EncodePngOptions,
): Uint8Array {
  const { bitDepth: depth, ...other } = image.getRawImage();
  return encode(
    {
      depth,
      ...other,
    },
    options,
  );
}
