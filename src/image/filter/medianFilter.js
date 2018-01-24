import { validateArrayOfChannels } from '../../util/channel';
import { asc as sortAsc } from 'num-sort';
import Image from '../Image';

/**
* Each pixel of the image becomes the median of the neightbour
 * pixels.
 * @memberof Image
* @instance
* @param {object} options
* @param {(undefined|number|string|[number]|[string])} [options.channels=undefined] Specify which channels should be processed
*      * undefined : we take all the channels but alpha
*      * number : this specific channel
*      * string : converted to a channel based on rgb, cmyk, hsl or hsv (one letter code)
*      * [number] : array of channels as numbers
*      * [string] : array of channels as one letter string
* @param {number} [options.radius=1] distance of the square to take the mean of.
* @param {string} [options.border='copy'] algorithm that will be applied after to deal with borders
* @return {Image}
*/
export default function medianFilter(options = {}) {
  let { radius = 1, channels, border = 'copy' } = options;

  this.checkProcessable('median', {
    bitDepth: [8, 16]
  });

  if (radius < 1) {
    throw new Error('Kernel radius should be greater than 0');
  }

  channels = validateArrayOfChannels(this, channels, true);

  let kWidth = radius;
  let kHeight = radius;
  let newImage = Image.createFrom(this);

  let size = (kWidth * 2 + 1) * (kHeight * 2 + 1);
  let middle = Math.floor(size / 2);
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
        let newValue = kernel.sort(sortAsc)[middle];

        newImage.data[index] = newValue;
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

}//End median function

