import { encode, PngEncoderOptions } from 'fast-png';

import { Image } from '../Image';
import { Mask } from '../Mask';

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
  if (!(image instanceof Image)) {
    throw new TypeError('Mask PNG encoding is not supported.');
  }
  if (image.bitDepth !== 8 && image.bitDepth !== 16) {
    image = image.convertBitDepth(8);
  }
  if (
    image.colorModel !== 'RGB' &&
    image.colorModel !== 'RGBA' &&
    image.colorModel !== 'GREY' &&
    image.colorModel !== 'GREYA'
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
