import Image from '../Image';
import { validateChannel } from '../../util/channel';
import { GREY } from '../model/model';

/**
 * Create a grey image based on the selected channel
 * @memberof Image
 * @instance
 * @param {number|string} channel
 * @param {object} [options]
 * @param {boolean} [options.keepAlpha]
 * @param {boolean} [options.mergeAlpha]
 * @return {Image} A grey image with the extracted channel
 */
export default function getChannel(channel, options = {}) {
  let {
    keepAlpha = false,
    mergeAlpha = false
  } = options;

  keepAlpha &= this.alpha;
  mergeAlpha &= this.alpha;

  this.checkProcessable('getChannel', {
    bitDepth: [8, 16]
  });

  channel = validateChannel(this, channel);

  let newImage = Image.createFrom(this, {
    components: 1,
    alpha: keepAlpha,
    colorModel: GREY
  });
  let ptr = 0;
  for (let j = 0; j < this.data.length; j += this.channels) {
    if (mergeAlpha) {
      newImage.data[ptr++] = this.data[j + channel] * this.data[j + this.components] / this.maxValue;
    } else {
      newImage.data[ptr++] = this.data[j + channel];
      if (keepAlpha) {
        newImage.data[ptr++] = this.data[j + this.components];
      }
    }
  }

  return newImage;
}
