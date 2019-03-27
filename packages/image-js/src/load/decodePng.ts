// @ts-ignore
import { decode } from 'fast-png';

import { Image, ImageKind, ColorDepth } from '../Image';

/**
 * Decode a png. See the fast-png npm module.
 * @param buffer The data to decode
 */
export function decodePng(buffer: ArrayBufferView): Image {
  const png = decode(buffer);

  let kind: ImageKind;
  let depth: ColorDepth =
    png.bitDepth === 16 ? ColorDepth.UINT16 : ColorDepth.UINT8;

  switch (png.colourType) {
    case 0:
      kind = ImageKind.GREY;
      break;
    case 2:
      kind = ImageKind.RGB;
      break;
    case 3:
      return loadPalettePNG(png);
    case 4:
      kind = ImageKind.GREYA;
      break;
    case 6:
      kind = ImageKind.RGBA;
      break;
    default:
      throw new Error(`Unexpected colourType: ${png.colourType}`);
  }
  return new Image({
    width: png.width,
    height: png.height,
    kind,
    depth,
    data: png.data
  });
}

interface IPalettePng {
  width: number;
  height: number;
  bitDepth: number;
  data: Uint8Array;
  palette: { [key: number]: [number, number, number] };
}

function loadPalettePNG(png: IPalettePng): Image {
  const pixels = png.width * png.height;
  const data = new Uint8Array(pixels * 3);
  const pixelsPerByte = 8 / png.bitDepth;
  const factor = png.bitDepth < 8 ? pixelsPerByte : 1;
  const mask = parseInt('1'.repeat(png.bitDepth), 2);
  let dataIndex = 0;

  for (let i = 0; i < pixels; i++) {
    const index = Math.floor(i / factor);
    let value = png.data[index];
    if (png.bitDepth < 8) {
      value =
        (value >>> (png.bitDepth * (pixelsPerByte - 1 - (i % pixelsPerByte)))) &
        mask;
    }
    const paletteValue = png.palette[value];
    data[dataIndex++] = paletteValue[0];
    data[dataIndex++] = paletteValue[1];
    data[dataIndex++] = paletteValue[2];
  }

  return new Image(png.width, png.height, {
    data
  });
}
