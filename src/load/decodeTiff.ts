import { decode } from 'tiff';

import { BitDepth, Image } from '../Image';

type TiffIfd = ReturnType<typeof decode>[number];

/**
 * Decode a TIFF. See the tiff module.
 *
 * @param buffer - The data to decode.
 * @returns The decoded image.
 */
export function decodeTiff(buffer: Uint8Array): Image {
  let result = decode(buffer);
  return getImageFromIFD(result[0]);
  // TODO: handle stacks (many IFDs)
}

/**
 * Create image from a single IFD.
 *
 * @param ifd - The IFD.
 * @returns The decoded image.
 */
function getImageFromIFD(ifd: TiffIfd): Image {
  if (ifd.type === 3) {
    // Palette
    const data = new Uint16Array(3 * ifd.width * ifd.height);
    const palette = ifd.palette as [number, number, number][];
    let ptr = 0;
    for (let index of ifd.data) {
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
      // TODO: implement metadata
      //meta: getMetadata(ifd),
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
      // meta: getMetadata(ifd),
    });
  }
}
