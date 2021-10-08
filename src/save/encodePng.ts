import { encode, PngEncoderOptions } from 'fast-png';

import { IJS } from '../IJS';

export type EncodePngOptions = PngEncoderOptions;

export function encodePng(image: IJS, options?: EncodePngOptions): Uint8Array {
  return encode(image, options);
}
