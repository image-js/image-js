import quickSelectMedian from 'median-quickselect';

import { validateArrayOfChannels } from '../../util/channel';
import Image from '../Image';

/**
 * Each pixel of the image becomes the median of the neighbor pixels.
 * @memberof Image
 * @instance
 * @param {object} options
 * @param {SelectedChannels} [options.channels] - Specify which channels should be processed.
 * @param {number} [options.radius=1] - Distance of the square to take the mean of.
 * @param {string} [options.border='copy'] - Algorithm that will be applied after to deal with borders.
 * @return {Image}
 */
export default function medianFilter(options = {}) {
  let { radius = 1, border = 'copy', channels } = options;

  this.checkProcessable('medianFilter', {
    bitDepth: [8, 16],
  });

  if (radius < 1) {
    throw new Error('radius must be greater than 0');
  }

  channels = validateArrayOfChannels(this, channels, true);

  let kWidth = radius;
  let kHeight = radius;
  let newImage = Image.createFrom(this);

  let size = (kWidth * 2 + 1) * (kHeight * 2 + 1);
  let kernel = new Array(size);

  for (let channel = 0; channel < channels.length; channel++) {
    let c = channels[channel];
    for (let y = kHeight; y < this.height - kHeight; y++) {
      for (let x = kWidth; x < this.width - kWidth; x++) {
        let n = 0;
        for (let j = -kHeight; j <= kHeight; j++) {
          for (let i = -kWidth; i <= kWidth; i++) {
            let index = ((y + j) * this.width + x + i) * this.channels + c;
            kernel[n++] = this.data[index];
          }
        }

        let index = (y * this.width + x) * this.channels + c;

        newImage.data[index] = quickSelectMedian(kernel);
      }
    }
  }
  if (this.alpha && !channels.includes(this.channels)) {
    for (let i = this.components; i < this.data.length; i = i + this.channels) {
      newImage.data[i] = this.data[i];
    }
  }

  newImage.setBorder({ size: [kWidth, kHeight], algorithm: border });

  return newImage;
}
