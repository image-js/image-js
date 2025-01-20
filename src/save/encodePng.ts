import type { PngEncoderOptions } from 'fast-png';
import { encode } from 'fast-png';

import type { Image } from '../Image.js';
import { Mask } from '../Mask.js';

export type EncodePngOptions = PngEncoderOptions;

/**
 * Creates a PNG buffer from an image.
 * @param image - The image instance.
 * @param options - PNG encoding options.
 * @returns The buffer.
 */
export function encodePng(
  image: Image | Mask,
  options?: EncodePngOptions,
): Uint8Array {
  if (
    (image.colorModel !== 'RGB' &&
      image.colorModel !== 'RGBA' &&
      image.colorModel !== 'GREY' &&
      image.colorModel !== 'GREYA') ||
    image instanceof Mask
  ) {
    image = image.convertColor('GREY');
  }
  const { bitDepth: depth, ...other } = image.getRawImage();
  return encode(
    {
      depth,
      ...other,
    },
    options,
  );
}
