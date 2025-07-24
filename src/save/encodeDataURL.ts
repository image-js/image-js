import { encode as uint8encode } from 'uint8-base64';

import type { Image } from '../Image.js';

import type {
  EncodeOptionsBmp,
  EncodeOptionsJpeg,
  EncodeOptionsPng,
} from './encode.js';
import { defaultPng, encode } from './encode.js';
/**
 * Converts image into Data URL string.
 * @param image - Image to get base64 encoding from.
 * @param options - Encoding options.
 * @returns base64 string.
 */
export function encodeDataURL(
  image: Image,
  options: EncodeOptionsBmp | EncodeOptionsPng | EncodeOptionsJpeg = defaultPng,
) {
  const buffer = encode(image, options);
  const base64 = uint8encode(buffer);
  const base64Data = new TextDecoder().decode(base64);
  return `data:image/${options.format};base64,${base64Data}`;
}
