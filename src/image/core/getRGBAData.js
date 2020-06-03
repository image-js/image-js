import { RGB } from '../model/model';

/**
 * Retrieve the data of the current image as RGBA 8 bits
 * The source image may be:
 * * a mask (binary image)
 * * a grey image (8 16 bits) with or without alpha channel
 * * a color image (8 or 16 bits) with or without alpha channel in with RGB model
 * @instance
 * @memberof Image
 * @param {object} [options]
 * @param {boolean} [options.clamped] - If true, the function will return a Uint8ClampedArray
 * @return {Uint8Array|Uint8ClampedArray} - Array with the data
 */
export default function getRGBAData(options = {}) {
  const { clamped } = options;
  this.checkProcessable('getRGBAData', {
    components: [1, 3],
    bitDepth: [1, 8, 16, 32],
  });
  const arrayLength = this.width * this.height * 4;
  let newData = clamped
    ? new Uint8ClampedArray(arrayLength)
    : new Uint8Array(arrayLength);
  if (this.bitDepth === 1) {
    fillDataFromBinary(this, newData);
  } else if (this.bitDepth === 32) {
    this.checkProcessable('getRGBAData', { alpha: 0 });
    if (this.components === 1) {
      fillDataFromGrey32(this, newData);
    } else if (this.components === 3) {
      this.checkProcessable('getRGBAData', { colorModel: [RGB] });
      fillDataFromRGB32(this, newData);
    }
  } else {
    if (this.components === 1) {
      fillDataFromGrey(this, newData);
    } else if (this.components === 3) {
      this.checkProcessable('getRGBAData', { colorModel: [RGB] });
      fillDataFromRGB(this, newData);
    }
  }
  if (this.alpha === 1) {
    this.checkProcessable('getRGBAData', { bitDepth: [8, 16] });
    copyAlpha(this, newData);
  } else {
    fillAlpha(this, newData);
  }
  return newData;
}

function fillDataFromBinary(image, newData) {
  for (let i = 0; i < image.size; i++) {
    const value = image.getBit(i);
    newData[i * 4] = value * 255;
    newData[i * 4 + 1] = value * 255;
    newData[i * 4 + 2] = value * 255;
  }
}

function fillDataFromGrey32(image, newData) {
  const min = image.min[0];
  const max = image.max[0];
  const range = max - min;
  for (let i = 0; i < image.size; i++) {
    const val = Math.floor((255 * (image.data[i] - min)) / range);
    newData[i * 4] = val;
    newData[i * 4 + 1] = val;
    newData[i * 4 + 2] = val;
  }
}

function fillDataFromRGB32(image, newData) {
  const min = Math.min(...image.min);
  const max = Math.max(...image.max);
  const range = max - min;
  for (let i = 0; i < image.size; i++) {
    const val1 = Math.floor((255 * (image.data[i * 3] - min)) / range);
    const val2 = Math.floor((255 * (image.data[i * 3 + 1] - min)) / range);
    const val3 = Math.floor((255 * (image.data[i * 3 + 2] - min)) / range);
    newData[i * 4] = val1;
    newData[i * 4 + 1] = val2;
    newData[i * 4 + 2] = val3;
  }
}

function fillDataFromGrey(image, newData) {
  for (let i = 0; i < image.size; i++) {
    newData[i * 4] = image.data[i * image.channels] >>> (image.bitDepth - 8);
    newData[i * 4 + 1] =
      image.data[i * image.channels] >>> (image.bitDepth - 8);
    newData[i * 4 + 2] =
      image.data[i * image.channels] >>> (image.bitDepth - 8);
  }
}

function fillDataFromRGB(image, newData) {
  for (let i = 0; i < image.size; i++) {
    newData[i * 4] = image.data[i * image.channels] >>> (image.bitDepth - 8);
    newData[i * 4 + 1] =
      image.data[i * image.channels + 1] >>> (image.bitDepth - 8);
    newData[i * 4 + 2] =
      image.data[i * image.channels + 2] >>> (image.bitDepth - 8);
  }
}

function copyAlpha(image, newData) {
  for (let i = 0; i < image.size; i++) {
    newData[i * 4 + 3] =
      image.data[i * image.channels + image.components] >> (image.bitDepth - 8);
  }
}

function fillAlpha(image, newData) {
  for (let i = 0; i < image.size; i++) {
    newData[i * 4 + 3] = 255;
  }
}
