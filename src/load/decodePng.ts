import type { DecodedPng } from 'fast-png';
import { decode } from 'fast-png';

import type { BitDepth } from '../Image.js';
import { Image } from '../Image.js';
import type { ImageColorModel } from '../utils/constants/colorModels.js';
import { assert } from '../utils/validators/assert.js';

/**
 * Decode a PNG. See the fast-png npm module.
 * @param buffer - The data to decode.
 * @returns The decoded image.
 */
export function decodePng(buffer: Uint8Array): Image {
  const png = decode(buffer);

  let colorModel: ImageColorModel;
  const bitDepth: BitDepth = png.depth as BitDepth;
  if (png.palette) {
    return loadPalettePng(png);
  }
  if (bitDepth === 1) {
    return new Image(png.width, png.height, {
      data: decodeBinary(png),
      colorModel: 'GREY',
    });
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
  const data = new Uint8Array(pixels * png.palette[0].length);
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
    for (const paletteChannel of paletteValue) {
      data[dataIndex++] = paletteChannel;
    }
  }

  return new Image(png.width, png.height, {
    data,
    colorModel: png.palette[0].length === 4 ? 'RGBA' : 'RGB',
  });
}

function decodeBinary(png: DecodedPng): Uint8Array {
  const totalPixels = png.width * png.height;
  const result = new Uint8Array(totalPixels);
  const pngData = png.data;
  const padding = png.width % 8;
  const bytesPerLine = Math.ceil(png.width / 8);
  let pixelIndex = 0;
  for (
    let byteIndex = 0;
    byteIndex < pngData.length && pixelIndex < totalPixels;
    byteIndex++
  ) {
    const byte = pngData[byteIndex];
    const limit = byteIndex % bytesPerLine === 0 ? 8 - padding : 0;
    for (
      let bitIndex = 7;
      bitIndex >= limit && pixelIndex < totalPixels;
      bitIndex--
    ) {
      const bit = (byte >> bitIndex) & 1;
      result[pixelIndex++] = bit * 255;
    }
  }
  return result;
}
