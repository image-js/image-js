import newArray from 'new-array';

import { validateArrayOfChannels } from '../../util/channel';

/**
 * Level the image for by default have the minimal and maximal values.
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {string} [options.algorithm='range']
 * @param {SelectedChannels} [options.channels] Specify which channels should be processed
 * @param {number} [options.min=this.min] minimal value after levelling
 * @param {number} [options.max=this.max] maximal value after levelling
 * @return {this}
 */
export default function level(options = {}) {
  let {
    algorithm = 'range',
    channels,
    min = this.min,
    max = this.max,
  } = options;

  this.checkProcessable('level', {
    bitDepth: [8, 16, 32],
  });

  channels = validateArrayOfChannels(this, { channels: channels });

  if (channels.length !== this.channel) {
    // if we process only part of the channels and the min or max length corresponds to the number of channels
    // we need to take the corresponding values
    if (Array.isArray(min) && min.length === this.channels) {
      min = min.filter((a, index) => channels.includes(index));
    }
    if (Array.isArray(max) && max.length === this.channels) {
      max = max.filter((a, index) => channels.includes(index));
    }
  }

  switch (algorithm) {
    case 'range':
      if (min < 0) {
        min = 0;
      }
      if (max > this.maxValue) {
        max = this.maxValue;
      }

      if (!Array.isArray(min)) {
        min = newArray(channels.length, min);
      }
      if (!Array.isArray(max)) {
        max = newArray(channels.length, max);
      }

      processImage(this, min, max, channels);
      break;

    default:
      throw new Error(`level: algorithm not implement: ${algorithm}`);
  }

  return this;
}

function processImage(image, min, max, channels) {
  let delta = 1e-5; // sorry no better value that this "best guess"
  let factor = new Array(channels.length);

  for (let i = 0; i < channels.length; i++) {
    if (min[i] === 0 && max[i] === image.maxValue) {
      factor[i] = 0;
    } else if (max[i] === min[i]) {
      factor[i] = 0;
    } else {
      factor[i] = (image.maxValue + 1 - delta) / (max[i] - min[i]);
    }
    min[i] += (0.5 - delta / 2) / factor[i];
  }

  /*
     Note on border effect
     For 8 bits images we should calculate for the space between -0.5 and 255.5
     so that after ronding the first and last points still have the same population
     But doing this we need to deal with Math.round that gives 256 if the value is 255.5
     */

  for (let j = 0; j < channels.length; j++) {
    let c = channels[j];
    if (factor[j] !== 0) {
      for (let i = 0; i < image.data.length; i += image.channels) {
        image.data[i + c] = Math.min(
          Math.max(0, ((image.data[i + c] - min[j]) * factor[j] + 0.5) | 0),
          image.maxValue,
        );
      }
    }
  }
}
