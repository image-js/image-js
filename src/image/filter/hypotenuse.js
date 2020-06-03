import { validateArrayOfChannels } from '../../util/channel';
import Image from '../Image';

/**
 * Calculate a new image that is the hypotenuse between the current image and the otherImage.
 * @memberof Image
 * @instance
 * @param {Image} otherImage
 * @param {object} [options={}]
 * @param {number} [options.bitDepth=this.bitDepth]
 * @param {number[]|string[]} [options.channels] : to which channel to apply the filter. By default all but alpha.
 * @return {Image}
 */
export default function hypotenuse(otherImage, options = {}) {
  let { bitDepth = this.bitDepth, channels } = options;
  this.checkProcessable('hypotenuse', {
    bitDepth: [8, 16, 32],
  });
  if (this.width !== otherImage.width || this.height !== otherImage.height) {
    throw new Error('hypotenuse: both images must have the same size');
  }
  if (
    this.alpha !== otherImage.alpha ||
    this.bitDepth !== otherImage.bitDepth
  ) {
    throw new Error(
      'hypotenuse: both images must have the same alpha and bitDepth',
    );
  }
  if (this.channels !== otherImage.channels) {
    throw new Error(
      'hypotenuse: both images must have the same number of channels',
    );
  }

  let newImage = Image.createFrom(this, { bitDepth: bitDepth });

  channels = validateArrayOfChannels(this, { channels: channels });

  let clamped = newImage.isClamped;

  for (let j = 0; j < channels.length; j++) {
    let c = channels[j];
    for (let i = c; i < this.data.length; i += this.channels) {
      let value = Math.hypot(this.data[i], otherImage.data[i]);
      if (clamped) {
        // we calculate the clamped result
        newImage.data[i] = Math.min(
          Math.max(Math.round(value), 0),
          newImage.maxValue,
        );
      } else {
        newImage.data[i] = value;
      }
    }
  }

  return newImage;
}
