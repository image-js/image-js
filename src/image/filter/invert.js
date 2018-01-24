// we try the faster methods

import { validateArrayOfChannels } from '../../util/channel';

/**
 * Invert an image. The image
 * @memberof Image
 * @instance
 * @param {object} options
 * @param {(undefined|number|string|[number]|[string])} [options.channels=undefined] Specify which channels should be processed
 *      * undefined : we take all the channels but alpha
 *      * number : this specific channel
 *      * string : converted to a channel based on rgb, cmyk, hsl or hsv (one letter code)
 *      * [number] : array of channels as numbers
 *      * [string] : array of channels as one letter string
 * @return {this}
 */
export default function invert(options = {}) {
  let { channels } = options;

  this.checkProcessable('invertOneLoop', {
    bitDepth: [1, 8, 16]
  });

  if (this.bitDepth === 1) {
    // we simply invert all the integers value
    // there could be a small mistake if the number of points
    // is not a multiple of 8 but it is not important
    let data = this.data;
    for (let i = 0; i < data.length; i++) {
      data[i] = ~data[i];
    }
  } else {
    channels = validateArrayOfChannels(this, { channels });

    for (let c = 0; c < channels.length; c++) {
      let j = channels[c];
      for (let i = j; i < this.data.length; i += this.channels) {
        this.data[i] = this.maxValue - this.data[i];
      }
    }
  }

  return this;
}
