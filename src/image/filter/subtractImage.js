import { validateArrayOfChannels } from '../../util/channel';
import Image from '../Image';

/**
 * Calculate a new image that is the subtraction between the current image and the otherImage.
 * @memberof Image
 * @instance
 * @param {Image} otherImage
 * @param {object} [options={}]
 * @param {number} [options.bitDepth=this.bitDepth]
 * @param {number[]|string[]} [options.channels] : to which channel to apply the filter. By default all but alpha.
 * @param {number[]|string[]} [options.absolute=false] :.take the absolute value of the difference (default minimum=0)
 * @return {Image}
 */
export default function subtractImage(otherImage, options = {}) {
  let { bitDepth = this.bitDepth, channels, absolute = false } = options;
  this.checkProcessable('subtractImage', {
    bitDepth: [8, 16],
  });
  if (this.width !== otherImage.width || this.height !== otherImage.height) {
    throw new Error('subtractImage: both images must have the same size');
  }
  if (
    this.alpha !== otherImage.alpha ||
    this.bitDepth !== otherImage.bitDepth
  ) {
    throw new Error(
      'subtractImage: both images must have the same alpha and bitDepth',
    );
  }
  if (this.channels !== otherImage.channels) {
    throw new Error(
      'subtractImage: both images must have the same number of channels',
    );
  }

  let newImage = Image.createFrom(this, { bitDepth: bitDepth });

  channels = validateArrayOfChannels(this, { channels: channels });

  for (let j = 0; j < channels.length; j++) {
    let c = channels[j];
    for (let i = c; i < this.data.length; i += this.channels) {
      let value = this.data[i] - otherImage.data[i];
      if (absolute) {
        newImage.data[i] = Math.abs(value);
      } else {
        newImage.data[i] = Math.max(value, 0);
      }
    }
  }

  return newImage;
}
