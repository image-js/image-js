import { decode, IDecodedPNG } from 'fast-png';

import { Image, ImageKind, ColorDepth } from '../Image';

/**
 * Decode a png. See the fast-png npm module.
 * @param buffer The data to decode
 */
export function decodePng(buffer: ArrayBufferView): Image {
  const png = decode(buffer);

  let kind: ImageKind;
  const depth: ColorDepth =
    png.depth === 16 ? ColorDepth.UINT16 : ColorDepth.UINT8;

  if (png.palette) {
    return loadPalettePNG(png);
  }

  switch (png.channels) {
    case 1:
      kind = ImageKind.GREY;
      break;
    case 2:
      kind = ImageKind.GREYA;
      break;
    case 3:
      kind = ImageKind.RGB;
      break;
    case 4:
      kind = ImageKind.RGBA;
      break;
    default:
      throw new Error(`Unexpected number of channels: ${png.channels}`);
  }
  return new Image({
    width: png.width,
    height: png.height,
    kind,
    depth,
    data: png.data
  });
}

function loadPalettePNG(png: IDecodedPNG): Image {
  if (!png.palette) {
    throw new Error(
      'unexpected: there should be a palette when colourType is 3'
    );
  }
  const pixels = png.width * png.height;
  const data = new Uint8Array(pixels * 3);
  const pixelsPerByte = 8 / png.depth;
  const factor = png.depth < 8 ? pixelsPerByte : 1;
  const mask = parseInt('1'.repeat(png.depth), 2);
  let dataIndex = 0;

  for (let i = 0; i < pixels; i++) {
    const index = Math.floor(i / factor);
    let value = png.data[index];
    if (png.depth < 8) {
      value =
        (value >>> (png.depth * (pixelsPerByte - 1 - (i % pixelsPerByte)))) &
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
