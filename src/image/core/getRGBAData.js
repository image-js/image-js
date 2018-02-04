import { RGB } from '../model/model';

/**
 * Retrieve the data of the current image as RGBA 8 bits
 * The source image may be:
 * * a mask (binary image)
 * * a grey image (8 16 bits) with or without alpha channel
 * * a color image (8 or 16 bits) with or without alpha channel in with RGB model
 * @instance
 * @memberof Image
 * @return {Uint8ClampedArray} - Array with the data
 * @example
 * var imageData = image.getRGBAData();
 */
export default function getRGBAData() {
  this.checkProcessable('getRGBAData', {
    components: [1, 3],
    bitDepth: [1, 8, 16, 32]
  });
  let size = this.size;
  let newData = new Uint8ClampedArray(this.width * this.height * 4);
  if (this.bitDepth === 1) {
    for (let i = 0; i < size; i++) {
      let value = this.getBit(i);
      newData[i * 4] = value * 255;
      newData[i * 4 + 1] = value * 255;
      newData[i * 4 + 2] = value * 255;
    }
  } else if (this.bitDepth === 32) {
    // map minimum to 0 and maximum to 255
    this.checkProcessable('getRGBAData', { alpha: 0 });
    if (this.components === 1) {
      const min = this.min;
      const max = this.max;
      const range = max - min;
      for (let i = 0; i < size; i++) {
        const val = (255 * (this.data[i * this.channels] - min) / range) >> 0;
        newData[i * 4] = val;
        newData[i * 4 + 1] = val;
        newData[i * 4 + 2] = val;
      }
    } else if (this.components === 3) {
      this.checkProcessable('getRGBAData', { colorModel: [RGB] });
      const min = Math.min(...this.min);
      const max = Math.max(...this.max);
      const range = max - min;
      for (let i = 0; i < size; i++) {
        const val1 = (255 * (this.data[i * this.channels] - min) / range) >> 0;
        const val2 = (255 * (this.data[i * this.channels + 1] - min) / range) >> 0;
        const val3 = (255 * (this.data[i * this.channels + 2] - min) / range) >> 0;
        newData[i * 4] = val1;
        newData[i * 4 + 1] = val2;
        newData[i * 4 + 2] = val3;
      }
    }
  } else {
    if (this.components === 1) {
      for (let i = 0; i < size; i++) {
        newData[i * 4] = this.data[i * this.channels] >>> (this.bitDepth - 8);
        newData[i * 4 + 1] = this.data[i * this.channels] >>> (this.bitDepth - 8);
        newData[i * 4 + 2] = this.data[i * this.channels] >>> (this.bitDepth - 8);
      }
    } else if (this.components === 3) {
      this.checkProcessable('getRGBAData', { colorModel: [RGB] });
      if (this.colorModel === RGB) {
        for (let i = 0; i < size; i++) {
          newData[i * 4] = this.data[i * this.channels] >>> (this.bitDepth - 8);
          newData[i * 4 + 1] = this.data[i * this.channels + 1] >>> (this.bitDepth - 8);
          newData[i * 4 + 2] = this.data[i * this.channels + 2] >>> (this.bitDepth - 8);
        }
      }
    }
  }
  if (this.alpha) {
    this.checkProcessable('getRGBAData', { bitDepth: [8, 16] });
    for (let i = 0; i < size; i++) {
      newData[i * 4 + 3] = this.data[i * this.channels + this.components] >> (this.bitDepth - 8);
    }
  } else {
    for (let i = 0; i < size; i++) {
      newData[i * 4 + 3] = 255;
    }
  }
  return newData;
}
