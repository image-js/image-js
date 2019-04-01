import { IPNGEncoderOptions } from 'fast-png';

import { Image } from '../Image';

import { encodePng } from './encodePng';
import { encodeJpeg } from './encodeJpeg';

export enum ImageFormat {
  png = 'png',
  jpg = 'jpg',
  jpeg = 'jpeg'
}

export type IEncodeOptions = {
  format?: ImageFormat;
} & IPNGEncoderOptions;

export function encode(image: Image, options: IEncodeOptions = {}): Uint8Array {
  const { format = ImageFormat.png } = options;
  if (format === ImageFormat.png) {
    return encodePng(image, options);
  } else if (format === ImageFormat.jpg || format === ImageFormat.jpeg) {
    return encodeJpeg(image);
  } else {
    throw new RangeError(`unknown format: ${format}`);
  }
}
