import { encode, IPNGEncoderOptions } from 'fast-png';

import { Image } from '../Image';

export type IEncodePngOptions = IPNGEncoderOptions;

export function encodePng(
  image: Image,
  options?: IPNGEncoderOptions
): Uint8Array {
  return encode(image, options);
}
