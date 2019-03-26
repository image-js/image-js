import { Image } from '../Image';

import checkHeader from './checkHeader';
import { decodePng } from './decodePng';

export function decode(data: ArrayBufferView): Image {
  // PNG
  if (checkHeader(data, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return decodePng(data);
  } else {
    throw new Error('invalid data format');
  }
}
