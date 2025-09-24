import { decode } from 'tiff';

import type { BitDepth } from '../Image.js';
import { Image } from '../Image.js';

import { getMetadata } from './getMetadata.js';

type TiffIfd = ReturnType<typeof decode>[number];

/**
 * Decode a TIFF. See the tiff module.
 * @param buffer - The data to decode.
 * @returns The decoded image.
 */
export function decodeTiff(buffer: Uint8Array): Image {
  const result = decode(buffer, { pages: [0] });
  return getImageFromIFD(result[0]);
}

/**
 * Create image from a single IFD.
 * @param ifd - The IFD.
 * @returns The decoded image.
 */
export function getImageFromIFD(ifd: TiffIfd): Image {
  if (ifd.data instanceof Float32Array || ifd.data instanceof Float64Array) {
    throw new Error('Float TIFF data is not supported.');
  }

  if (ifd.type === 3) {
    const hasAlpha = ifd.samplesPerPixel === 2;
    const pixelLength = hasAlpha ? 4 : 3;
    const data = new Uint16Array(pixelLength * ifd.width * ifd.height);
    const palette = ifd.palette as Array<[number, number, number]>;
    let ptr = 0;
    if (hasAlpha) {
      for (
        let index = 0;
        index < ifd.data.length;
        index += ifd.samplesPerPixel
      ) {
        const color = palette[ifd.data[index]];
        data[ptr++] = color[0];
        data[ptr++] = color[1];
        data[ptr++] = color[2];
        // To ensure that the value is 16 bits.
        data[ptr++] = Math.round(
          (ifd.data[index + 1] / 2 ** ifd.bitsPerSample) * 65535,
        );
      }
    } else {
      for (
        let index = 0;
        index < ifd.data.length;
        index += ifd.samplesPerPixel
      ) {
        const color = palette[ifd.data[index]];
        data[ptr++] = color[0];
        data[ptr++] = color[1];
        data[ptr++] = color[2];
      }
    }

    return new Image(ifd.width, ifd.height, {
      data,
      colorModel: hasAlpha ? 'RGBA' : 'RGB',
      bitDepth: 16,
      meta: getMetadata(ifd),
    });
  } else if (ifd.type === 1 || ifd.type === 0) {
    if (ifd.bitsPerSample !== 1) {
      return new Image(ifd.width, ifd.height, {
        data: ifd.data,
        bitDepth: ifd.bitsPerSample as BitDepth,
        colorModel: ifd.alpha ? 'GREYA' : 'GREY',
        meta: getMetadata(ifd),
      });
    } else {
      return new Image(ifd.width, ifd.height, {
        data: ifd.data.map((pixel) => pixel * 255),
        bitDepth: 8 as BitDepth,
        colorModel: 'GREY',
        meta: getMetadata(ifd),
      });
    }
  } else {
    return new Image(ifd.width, ifd.height, {
      data: ifd.data,
      bitDepth: ifd.bitsPerSample as BitDepth,
      colorModel: ifd.alpha ? 'RGBA' : 'RGB',
      meta: getMetadata(ifd),
    });
  }
}
