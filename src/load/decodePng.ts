import { decode, DecodedPng } from 'fast-png';

import { Image, ImageColorModel, ColorDepth } from '../Image';

/**
 * Decode a PNG. See the fast-png npm module.
 *
 * @param buffer - The data to decode.
 * @returns The decoded image.
 */
export function decodePng(buffer: Uint8Array): Image {
  const png = decode(buffer);

  let colorModel: ImageColorModel;
  const depth: ColorDepth =
    png.depth === 16 ? ColorDepth.UINT16 : ColorDepth.UINT8;

  if (png.palette) {
    return loadPalettePng(png);
  }

  switch (png.channels) {
    case 1:
      colorModel = ImageColorModel.GREY;
      break;
    case 2:
      colorModel = ImageColorModel.GREYA;
      break;
    case 3:
      colorModel = ImageColorModel.RGB;
      break;
    case 4:
      colorModel = ImageColorModel.RGBA;
      break;
    default:
      throw new Error(`Unexpected number of channels: ${png.channels}`);
  }
  return new Image(png.width, png.height, {
    colorModel,
    depth,
    data: png.data,
  });
}

/**
 * Compute PNG data from palette information and return a new image.
 *
 * @param png - Decoded PNG.
 * @returns The new image.
 */
function loadPalettePng(png: DecodedPng): Image {
  if (!png.palette) {
    throw new Error(
      'unexpected: there should be a palette when colourType is 3',
    );
  }
  const pixels = png.width * png.height;
  const data = new Uint8Array(pixels * 3);
  const pixelsPerByte = 8 / png.depth;
  const factor = png.depth < 8 ? pixelsPerByte : 1;
  const mask = Number.parseInt('1'.repeat(png.depth), 2);
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
    data,
  });
}
