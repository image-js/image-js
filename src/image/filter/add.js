import { validateArrayOfChannels } from '../../util/channel';
import { checkNumberArray } from '../../util/value';

/**
 * Add a specific integer on the specified points of the specified channels
 * @memberof Image
 * @instance
 * @param {*} value
 * @param {object} [options]
 * @return {this} Modified current image
 */
export default function add(value, options = {}) {
  let { channels } = options;
  this.checkProcessable('add', {
    bitDepth: [8, 16]
  });

  channels = validateArrayOfChannels(this, { channels: channels });
  value = checkNumberArray(value);

  // we allow 3 cases, the value may be an array (1D), an image or a single value
  if (!isNaN(value)) {
    for (let j = 0; j < channels.length; j++) {
      let c = channels[j];
      for (let i = 0; i < this.data.length; i += this.channels) {
        this.data[i + c] = Math.min(this.maxValue, (this.data[i + c] + value) >> 0);
      }
    }
  } else {
    if (this.data.length !== value.length) {
      throw new Error('add: the data size is different');
    }
    for (let j = 0; j < channels.length; j++) {
      let c = channels[j];
      for (let i = 0; i < this.data.length; i += this.channels) {
        this.data[i + c] = Math.max(0, Math.min(this.maxValue, (this.data[i + c] + value[i + c]) >> 0));
      }
    }
  }

  return this;
}
