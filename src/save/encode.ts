import { Image } from '../Image';

import { encodeJpeg, EncodeJpegOptions } from './encodeJpeg';
import { encodePng, EncodePngOptions } from './encodePng';

export enum ImageFormat {
  png = 'png',
  jpg = 'jpg',
  jpeg = 'jpeg',
}

export interface EncodeOptionsPng {
  format: ImageFormat.png;
  encoderOptions?: EncodePngOptions;
}
export interface EncodeOptionsJpeg {
  format: ImageFormat.jpg | ImageFormat.jpeg;
  encoderOptions?: EncodeJpegOptions;
}

const defaultPng: EncodeOptionsPng = { format: ImageFormat.png };

/**
 * Encodes the image to an output format.
 * Defaults to PNG.
 *
 * @param image - Image to encode.
 * @returns The encoded image
 */
export function encode(image: Image): Uint8Array;
/**
 * Encodes the image to PNG.
 *
 * @param image - Image to encode.
 * @param options - Format and options passed to the PNG encoder.
 * @returns The encoded image
 */
export function encode(image: Image, options: EncodeOptionsPng): Uint8Array;
/**
 * Encodes the image to JPEG.
 *
 * @param image - Image to encode.
 * @param options - Format and options passed to the JPEG encoder.
 * @returns The encoded image
 */
export function encode(image: Image, options: EncodeOptionsJpeg): Uint8Array;
/**
 * Encode an image in JPEG or PNG format.
 *
 * @param image - Image to encode.
 * @param options - Encoding options.
 * @returns The encoded image.
 */
export function encode(
  image: Image,
  options: EncodeOptionsPng | EncodeOptionsJpeg = defaultPng,
): Uint8Array {
  if (options.format === ImageFormat.png) {
    return encodePng(image, options.encoderOptions);
  } else if (
    options.format === ImageFormat.jpg ||
    options.format === ImageFormat.jpeg
  ) {
    return encodeJpeg(image, options.encoderOptions);
  } else {
    throw new RangeError(`unknown format: ${options.format}`);
  }
}
