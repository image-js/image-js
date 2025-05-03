import array from 'new-array';

import Image from '../Image';
import copy from '../internal/copy';

/**
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {number} [options.size=0]
 * @param {string} [options.algorithm='copy']
 * @param {array<number>} [options.color]
 * @return {Image}
 */
export default function pad(options = {}) {
  let {
    size = 0,
    algorithm = 'copy',
    color = [this.maxValue, this.maxValue, this.maxValue],
  } = options;

  this.checkProcessable('pad', {
    bitDepth: [1, 8, 16],
  });

  color = color.length ? color : [color];

  if (algorithm === 'set') {
    if (color.length < this.channels) {
      throw new Error(
        `pad: the color array must at least have the same length as the number of channels. Here: ${this.channels}`,
      );
    }
    if (this.bitDepth !== 1) {
      for (let i = 0; i < color.length; i++) {
        if (color[i] === 0) {
          color[i] = 0.001;
        }
      }
    }
  } else {
    color = array(this.channels, null);
  }

  if (!Array.isArray(size)) {
    size = [size, size];
  }

  let newWidth = this.width + size[0] * 2;
  let newHeight = this.height + size[1] * 2;
  let channels = this.channels;

  let newImage = Image.createFrom(this, {
    width: newWidth,
    height: newHeight,
    position: [-size[0], -size[1]],
  });

  copy(this, newImage, size[0], size[1]);

  if (this.bitDepth !== 1) {
    for (let i = size[0]; i < newWidth - size[0]; i++) {
      for (let k = 0; k < channels; k++) {
        let value =
          color[k] || newImage.data[(size[1] * newWidth + i) * channels + k];
        for (let j = 0; j < size[1]; j++) {
          newImage.data[(j * newWidth + i) * channels + k] = value;
        }
        value =
          color[k] ||
          newImage.data[
            ((newHeight - size[1] - 1) * newWidth + i) * channels + k
          ];
        for (let j = newHeight - size[1]; j < newHeight; j++) {
          newImage.data[(j * newWidth + i) * channels + k] = value;
        }
      }
    }

    for (let j = 0; j < newHeight; j++) {
      for (let k = 0; k < channels; k++) {
        let value =
          color[k] || newImage.data[(j * newWidth + size[0]) * channels + k];
        for (let i = 0; i < size[0]; i++) {
          newImage.data[(j * newWidth + i) * channels + k] = value;
        }
        value =
          color[k] ||
          newImage.data[(j * newWidth + newWidth - size[0] - 1) * channels + k];
        for (let i = newWidth - size[0]; i < newWidth; i++) {
          newImage.data[(j * newWidth + i) * channels + k] = value;
        }
      }
    }
  } else {
    for (let i = size[0]; i < newWidth - size[0]; i++) {
      let value = color[0] || newImage.getBit(size[1] * newWidth + i);
      for (let j = 0; j < size[1]; j++) {
        if (value) newImage.setBit(j * newWidth + i);
      }
      value =
        color[0] || newImage.getBit((newHeight - size[1] - 1) * newWidth + i);
      for (let j = newHeight - size[1]; j < newHeight; j++) {
        if (value) newImage.setBit(j * newWidth + i);
      }
    }

    for (let j = 0; j < newHeight; j++) {
      let value = color[0] || newImage.getBit(j * newWidth + size[0]);
      for (let i = 0; i < size[0]; i++) {
        if (value) newImage.setBit(j * newWidth + i);
      }
      value =
        color[0] || newImage.getBit(j * newWidth + newWidth - size[0] - 1);
      for (let i = newWidth - size[0]; i < newWidth; i++) {
        if (value) newImage.setBit(j * newWidth + i);
      }
    }
  }

  return newImage;
}
