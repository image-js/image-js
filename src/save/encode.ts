import { P, match } from 'ts-pattern';

import type { Image } from '../Image.js';
import type { Mask } from '../Mask.js';

import { encodeBmp } from './encodeBmp.js';
import type { EncodeJpegOptions } from './encodeJpeg.js';
import { encodeJpeg } from './encodeJpeg.js';
import type { EncodePngOptions } from './encodePng.js';
import { encodePng } from './encodePng.js';

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
export const defaultPng: EncodeOptionsPng = { format: 'png' };

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
  return match(options)
    .with({ format: 'png' }, (options) =>
      encodePng(image, options.encoderOptions),
    )
    .with({ format: P.union('jpg', 'jpeg') }, (options) =>
      encodeJpeg(image, options.encoderOptions),
    )
    .with({ format: 'bmp' }, () => encodeBmp(image))
    .exhaustive();
}
