import Image from '../Image';
import { GREY } from '../model/model';

/**
 * Create a new grey Image by combining the channels of the current image.
 * @memberof Image
 * @instance
 * @param {function} method
 * @param {object} [options]
 * @param {boolean} [options.mergeAlpha=false]
 * @param {boolean} [options.keepAlpha=false]
 * @return {Image}
 */
export default function combineChannels(
  method = defaultCombineMethod,
  options = {},
) {
  let { mergeAlpha = false, keepAlpha = false } = options;

  mergeAlpha &= this.alpha;
  keepAlpha &= this.alpha;

  this.checkProcessable('combineChannels', {
    bitDepth: [8, 16],
  });

  let newImage = Image.createFrom(this, {
    components: 1,
    alpha: keepAlpha,
    colorModel: GREY,
  });

  let ptr = 0;
  for (let i = 0; i < this.size; i++) {
    // TODO quite slow because we create a new pixel each time
    let value = method(this.getPixel(i));
    if (mergeAlpha) {
      newImage.data[ptr++] =
        (value * this.data[i * this.channels + this.components]) /
        this.maxValue;
    } else {
      newImage.data[ptr++] = value;
      if (keepAlpha) {
        newImage.data[ptr++] = this.data[i * this.channels + this.components];
      }
    }
  }

  return newImage;
}

function defaultCombineMethod(pixel) {
  return (pixel[0] + pixel[1] + pixel[2]) / 3;
}
