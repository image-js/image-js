import { decode, DecodedPng } from 'fast-png';

import { BitDepth, Image } from '../Image';
import { ImageColorModel } from '../utils/constants/colorModels';
import { assert } from '../utils/validators/assert';

/**
 * Decode a PNG. See the fast-png npm module.
 * @param buffer - The data to decode.
 * @returns The decoded image.
 */
export function decodePng(buffer: Uint8Array): Image {
  const png = decode(buffer);

  let colorModel: ImageColorModel;
  const bitDepth: BitDepth = png.depth === 16 ? 16 : 8;

  if (png.palette) {
    return loadPalettePng(png);
  }

  switch (png.channels) {
    case 1:
      colorModel = 'GREY';
      break;
    case 2:
      colorModel = 'GREYA';
      break;
    case 3:
      colorModel = 'RGB';
      break;
    case 4:
      colorModel = 'RGBA';
      break;
    default:
      throw new RangeError(`invalid number of channels: ${png.channels}`);
  }
  return new Image(png.width, png.height, {
    colorModel,
    bitDepth,
    data: png.data,
  });
}

/**
 * Compute PNG data from palette information and return a new image.
 * @param png - Decoded PNG.
 * @returns The new image.
 */
function loadPalettePng(png: DecodedPng): Image {
  assert(png.palette);
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
