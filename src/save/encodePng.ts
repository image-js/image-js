import { encode, PngEncoderOptions } from 'fast-png';

import { IJS } from '../IJS';

export type EncodePngOptions = PngEncoderOptions;

/**
 * Creates a PNG buffer from an image.
 *
 * @param image - The image instance.
 * @param options - PNG encoding options.
 * @returns The buffer.
 */
export function encodePng(image: IJS, options?: EncodePngOptions): Uint8Array {
  return encode(image.getRawImage(), options);
}
