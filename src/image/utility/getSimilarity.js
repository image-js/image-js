import newArray from 'new-array';

import { validateArrayOfChannels } from '../../util/channel';

/**
 * Try to match the current pictures with another one. If normalize we normalize separately the 2 images.
 * @memberof Image
 * @instance
 * @param {Image} image - Other image
 * @param {object} [options]
 * @return {number[]|number}
 */
export default function getSimilarity(image, options = {}) {
  let {
    shift = [0, 0],
    average,
    channels,
    defaultAlpha,
    normalize,
    border = [0, 0]
  } = options;

  this.checkProcessable('getSimilarity', {
    bitDepth: [8, 16]
  });

  if (!Array.isArray(border)) {
    border = [border, border];
  }
  channels = validateArrayOfChannels(this, { channels: channels, defaultAlpha: defaultAlpha });

  if (this.bitDepth !== image.bitDepth) {
    throw new Error('Both images must have the same bitDepth');
  }
  if (this.channels !== image.channels) {
    throw new Error('Both images must have the same number of channels');
  }
  if (this.colorModel !== image.colorModel) {
    throw new Error('Both images must have the same colorModel');
  }

  if (typeof average === 'undefined') {
    average = true;
  }

  // we allow a shift
  // we need to find the minX, maxX, minY, maxY
  let minX = Math.max(border[0], -shift[0]);
  let maxX = Math.min(this.width - border[0], this.width - shift[0]);
  let minY = Math.max(border[1], -shift[1]);
  let maxY = Math.min(this.height - border[1], this.height - shift[1]);

  let results = newArray(channels.length, 0);
  for (let i = 0; i < channels.length; i++) {
    let c = channels[i];
    let sumThis = normalize ? this.sum[c] : Math.max(this.sum[c], image.sum[c]);
    let sumImage = normalize ? image.sum[c] : Math.max(this.sum[c], image.sum[c]);

    if (sumThis !== 0 && sumImage !== 0) {
      for (let x = minX; x < maxX; x++) {
        for (let y = minY; y < maxY; y++) {
          let indexThis = x * this.multiplierX + y * this.multiplierY + c;
          let indexImage = indexThis + shift[0] * this.multiplierX + shift[1] * this.multiplierY;
          results[i] += Math.min(this.data[indexThis] / sumThis, image.data[indexImage] / sumImage);
        }
      }
    }
  }

  if (average) {
    return results.reduce((sum, x) => sum + x) / results.length;
  }
  return results;
}
