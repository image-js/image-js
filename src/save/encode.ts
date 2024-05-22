import { Image } from '../Image';
import { Mask } from '../Mask';

import { encodeBmp } from './encodeBmp';
import { encodeJpeg, EncodeJpegOptions } from './encodeJpeg';
import { encodePng, EncodePngOptions } from './encodePng';

export const ImageFormat = {
  PNG: 'png',
  JPG: 'jpg',
  JPEG: 'jpeg',
  BMP: 'bmp',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ImageFormat = (typeof ImageFormat)[keyof typeof ImageFormat];

export interface EncodeOptionsPng {
  format: 'png';
  encoderOptions?: EncodePngOptions;
}
export interface EncodeOptionsJpeg {
  format: 'jpg' | 'jpeg';
  encoderOptions?: EncodeJpegOptions;
}
export interface EncodeOptionsBmp {
  format: 'bmp';
}
const defaultPng: EncodeOptionsPng = { format: 'png' };

/**
 * Encodes the image to the specified format
 * @param image - Image to encode.
 * @param options - Format and options passed to the encoder.
 * @returns The encoded image.
 */
export function encode(
  image: Image | Mask,
  options: EncodeOptionsBmp | EncodeOptionsPng | EncodeOptionsJpeg = defaultPng,
): Uint8Array {
  if (options.format === 'png') {
    return encodePng(image, options.encoderOptions);
  } else if (options.format === 'jpg' || options.format === 'jpeg') {
    return encodeJpeg(image, options.encoderOptions);
  } else if (options.format === 'bmp') {
    return encodeBmp(image);
  } else {
    throw new RangeError(`invalid format: ${options.format}`);
  }
}
