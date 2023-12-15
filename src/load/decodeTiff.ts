import { decode } from 'tiff';

import { BitDepth, Image } from '../Image';

import { getMetadata } from './getMetadata';

type TiffIfd = ReturnType<typeof decode>[number];

/**
 * Decode a TIFF. See the tiff module.
 * @param buffer - The data to decode.
 * @returns The decoded image.
 */
export function decodeTiff(buffer: Uint8Array): Image {
  const result = decode(buffer);
  return getImageFromIFD(result[0]);
  // TODO: optimize not to decode whole file
}

/**
 * Create image from a single IFD.
 * @param ifd - The IFD.
 * @returns The decoded image.
 */
export function getImageFromIFD(ifd: TiffIfd): Image {
  if (ifd.type === 3) {
    // Palette
    const data = new Uint16Array(3 * ifd.width * ifd.height);
    const palette = ifd.palette as Array<[number, number, number]>;
    let ptr = 0;
    for (const index of ifd.data) {
      const color = palette[index];
      data[ptr++] = color[0];
      data[ptr++] = color[1];
      data[ptr++] = color[2];
    }
    return new Image(ifd.width, ifd.height, {
      data,
      // TODO: handle alpha properly
      colorModel: ifd.alpha ? 'RGBA' : 'RGB',
      // TODO: handle other bit depths
      bitDepth: 16,
      meta: getMetadata(ifd),
    });
  } else {
    return new Image(ifd.width, ifd.height, {
      // TODO: handle float data
      // @ts-expect-error float data not handled yet
      data: ifd.data,
      bitDepth: ifd.bitsPerSample as BitDepth,
      colorModel:
        ifd.type === 2
          ? ifd.alpha
            ? 'RGBA'
            : 'RGB'
          : ifd.alpha
            ? 'GREYA'
            : 'GREY',
      meta: getMetadata(ifd),
    });
  }
}
