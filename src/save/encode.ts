import { Image } from '../Image';

import { encodePng, IEncodePngOptions } from './encodePng';
import { encodeJpeg, IEncodeJpegOptions } from './encodeJpeg';

export enum ImageFormat {
  png = 'png',
  jpg = 'jpg',
  jpeg = 'jpeg'
}

export interface IEncodeOptionsPng {
  format: ImageFormat.png;
  encoderOptions?: IEncodePngOptions;
}
export interface IEncodeOptionsJpeg {
  format: ImageFormat.jpg | ImageFormat.jpeg;
  encoderOptions?: IEncodeJpegOptions;
}

const defaultPng: IEncodeOptionsPng = { format: ImageFormat.png };

/**
 * Encodes the image to an output format.
 * Defaults to PNG.
 * @param image - Image to encode.
 */
export function encode(image: Image): Uint8Array;
/**
 * Encodes the image to PNG.
 * @param image - Image to encode.
 * @param options - Format and options passed to the PNG encoder.
 */
export function encode(image: Image, options: IEncodeOptionsPng): Uint8Array;
/**
 * Encodes the image to JPEG.
 * @param image - Image to encode.
 * @param options - Format and options passed to the JPEG encoder.
 */
export function encode(image: Image, options: IEncodeOptionsJpeg): Uint8Array;
export function encode(
  image: Image,
  options: IEncodeOptionsPng | IEncodeOptionsJpeg = defaultPng
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
