import newArray from 'new-array';
import isInteger from 'is-integer';

/**
 * Returns a histogram for the specified channel
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {number} [options.maxSlots=256]
 * @param {number} [options.channel]
 * @param {boolean} [options.useAlpha=true]
 * @return {number[]}
 */
export function getHistogram(options = {}) {
  let { maxSlots = 256, channel, useAlpha = true } = options;
  this.checkProcessable('getHistogram', {
    bitDepth: [1, 8, 16]
  });
  if (channel === undefined) {
    if (this.components > 1) {
      throw new RangeError('You need to define the channel for an image that contains more than one channel');
    }
    channel = 0;
  }
  return getChannelHistogram.call(this, channel, { useAlpha, maxSlots });
}

/**
 * Returns an array (number of channels) of array (number of slots) containing
 * the number of data of a specific intensity.
 * Intensity may be grouped by the maxSlots parameter.
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {number} [options.maxSlots] - Number of slots in the resulting
 *      array. The intensity will be evently distributed between 0 and
 *      the maxValue allowed for this image (255 for usual images).
 *      If maxSlots = 8, all the intensities between 0 and 31 will be
 *      placed in the slot 0, 32 to 63 in slot 1, ...
 * @return {Array<Array<number>>}
 * @example
 *      image.getHistograms({
 *          maxSlots: 8,
 *          useAlpha: false
 *      });
 */
export function getHistograms(options = {}) {
  const { maxSlots = 256, useAlpha = true } = options;
  this.checkProcessable('getHistograms', {
    bitDepth: [8, 16]
  });
  let results = new Array((useAlpha) ? this.components : this.channels);
  for (let i = 0; i < results.length; i++) {
    results[i] = getChannelHistogram.call(this, i, { useAlpha, maxSlots });
  }
  return results;
}


function getChannelHistogram(channel, options) {
  let { useAlpha, maxSlots } = options;

  // for a mask, return a number array containing count of black and white points (black = array[0], white = array[1])

  if (this.bitDepth === 1) {
    let blackWhiteCount = [0, 0];
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let value = this.getBitXY(i, j);
        if (value === 0) {
          blackWhiteCount[0] += 1;
        } else if (value === 1) {
          blackWhiteCount[1] += 1;
        }
      }
    }
    return blackWhiteCount;
  }

  let bitSlots = Math.log2(maxSlots);
  if (!isInteger(bitSlots)) {
    throw new RangeError('maxSlots must be a power of 2, for example: 64, 256, 1024');
  }
  // we will compare the bitSlots to the bitDepth of the image
  // based on this we will shift the values. This allows to generate a histogram
  // of 16 grey even if the images has 256 shade of grey

  let bitShift = 0;
  if (this.bitDepth > bitSlots) {
    bitShift = this.bitDepth - bitSlots;
  }

  let data = this.data;
  let result = newArray(Math.pow(2, Math.min(this.bitDepth, bitSlots)), 0);
  if (useAlpha && this.alpha) {
    let alphaChannelDiff = this.channels - channel - 1;

    for (let i = channel; i < data.length; i += this.channels) {
      result[data[i] >> bitShift] += data[i + alphaChannelDiff] / this.maxValue;
    }
  } else {
    for (let i = channel; i < data.length; i += this.channels) {
      result[data[i] >> bitShift]++;
    }
  }

  return result;
}

