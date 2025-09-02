import * as bmp from 'fast-bmp';

import { Image } from '../Image.js';
import type { Mask } from '../Mask.js';

/**
 * Creates a BMP buffer from a mask.
 * @param image - The mask instance.
 * @returns The buffer.
 */
export function encodeBmp(image: Image | Mask) {
  if (image instanceof Image) {
    return bmp.encode({
      width: image.width,
      height: image.height,
      components: image.components,
      bitsPerPixel: image.channels * image.bitDepth,
      channels: image.channels,
      data: image.getRawImage().data,
    });
  } else {
    return bmp.encode({
      width: image.width,
      height: image.height,
      components: 1,
      bitsPerPixel: 1,
      channels: 1,
      data: image.getRawImage().data,
    });
  }
}
