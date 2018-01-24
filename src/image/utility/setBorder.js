import array from 'new-array';

/**
 * This method will change the border
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {number} [options.size=0]
 * @param {string} [options.algorithm='copy']
 * @param {number[]} [options.color]
 * @return {this}
 */
export default function setBorder(options = {}) {
  let {
    size = 0,
    algorithm = 'copy',
    color
  } = options;

  this.checkProcessable('setBorder', {
    bitDepth: [8, 16, 32, 64]
  });

  if (algorithm === 'set') {
    if (color.length !== this.channels) {
      throw new Error(`setBorder: the color array must have the same length as the number of channels. Here: ${this.channels}`);
    }
    for (let i = 0; i < color.length; i++) {
      if (color[i] === 0) {
        color[i] = 0.001;
      }
    }
  } else {
    color = array(this.channels, null);
  }

  if (!Array.isArray(size)) {
    size = [size, size];
  }


  let leftRightSize = size[0];
  let topBottomSize = size[1];
  let channels = this.channels;


  for (let i = leftRightSize; i < this.width - leftRightSize; i++) {
    for (let k = 0; k < channels; k++) {
      let value = color[k] || this.data[(i + this.width * topBottomSize) * channels + k];
      for (let j = 0; j < topBottomSize; j++) {
        this.data[(j * this.width + i) * channels + k] = value;
      }
      value = color[k] || this.data[(i + this.width * (this.height - topBottomSize - 1)) * channels + k];
      for (let j = this.height - topBottomSize; j < this.height; j++) {
        this.data[(j * this.width + i) * channels + k] = value;
      }
    }
  }

  for (let j = 0; j < this.height; j++) {
    for (let k = 0; k < channels; k++) {
      let value = color[k] || this.data[(j * this.width + leftRightSize) * channels + k];
      for (let i = 0; i < leftRightSize; i++) {
        this.data[(j * this.width + i) * channels + k] = value;
      }
      value = color[k] || this.data[(j * this.width + this.width - leftRightSize - 1) * channels + k];
      for (let i = this.width - leftRightSize; i < this.width; i++) {
        this.data[(j * this.width + i) * channels + k] = value;
      }
    }
  }

  return this;
}
