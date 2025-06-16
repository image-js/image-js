import * as bmp from 'fast-bmp';

import type { Image } from '../Image.js';
import { Mask } from '../Mask.js';

/**
 * Creates a BMP buffer from a mask.
 * @param mask - The mask instance.
 * @returns The buffer.
 */
export function encodeBmp(mask: Image | Mask) {
  if (!(mask instanceof Mask)) {
    throw new TypeError('Image bmp encoding is not implemented.');
  }
  const imageData = mask.getRawImage();
  return bmp.encode({
    width: imageData.width,
    height: imageData.height,
    components: 1,
    bitsPerPixel: 1,
    channels: 1,
    data: imageData.data,
  });
}
