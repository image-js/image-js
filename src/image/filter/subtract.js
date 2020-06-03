import { validateArrayOfChannels } from '../../util/channel';
import { checkNumberArray } from '../../util/value';

/**
 * @memberof Image
 * @instance
 * @param {*} value
 * @param {object} [options]
 * @return {this}
 */
export default function subtract(value, options = {}) {
  let { channels } = options;
  this.checkProcessable('subtract', {
    bitDepth: [8, 16],
  });

  channels = validateArrayOfChannels(this, { channels: channels });
  value = checkNumberArray(value);

  if (!isNaN(value)) {
    for (let j = 0; j < channels.length; j++) {
      let c = channels[j];
      for (let i = 0; i < this.data.length; i += this.channels) {
        this.data[i + c] = Math.max(0, (this.data[i + c] - value) >> 0);
      }
    }
  } else {
    if (this.data.length !== value.length) {
      throw new Error('subtract: the data size is different');
    }
    for (let j = 0; j < channels.length; j++) {
      let c = channels[j];
      for (let i = 0; i < this.data.length; i += this.channels) {
        this.data[i + c] = Math.max(
          0,
          Math.min(this.maxValue, (this.data[i + c] - value[i + c]) >> 0),
        );
      }
    }
  }

  return this;
}
