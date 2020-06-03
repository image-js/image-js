// http://www.easyrgb.com/index.php?X=MATH&H=18#text18
// check rgbToHsl : https://bgrins.github.io/TinyColor/docs/tinycolor.html

import Image from '../Image';
import { RGB, HSL } from '../model/model';

/**
 * Make a copy of the current image and convert the color model to HSL
 * The source image has to be RGB !
 * @memberof Image
 * @instance
 * @return {Image} - New image in HSL color model
 * @example
 * var hslImage = image.hsl();
 * // we can create one image per channel
 * var channels = hslImage.split();
 */
export default function hsl() {
  this.checkProcessable('hsl', {
    bitDepth: [8, 16],
    alpha: [0, 1],
    colorModel: [RGB],
  });

  let newImage = Image.createFrom(this, {
    colorModel: HSL,
  });

  let threshold = Math.floor(this.maxValue / 2);
  let ptr = 0;
  let data = this.data;
  for (let i = 0; i < data.length; i += this.channels) {
    let red = data[i];
    let green = data[i + 1];
    let blue = data[i + 2];

    let max = Math.max(red, green, blue);
    let min = Math.min(red, green, blue);
    let hue = 0;
    let saturation = 0;
    let luminance = (max + min) / 2;
    if (max !== min) {
      let delta = max - min;
      saturation =
        luminance > threshold ? delta / (2 - max - min) : delta / (max + min);
      switch (max) {
        case red:
          hue = (green - blue) / delta + (green < blue ? 6 : 0);
          break;
        case green:
          hue = (blue - red) / delta + 2;
          break;
        case blue:
          hue = (red - green) / delta + 4;
          break;
        default:
          throw new Error('unreachable');
      }
      hue /= 6;
    }

    newImage.data[ptr++] = hue * this.maxValue;
    newImage.data[ptr++] = saturation * this.maxValue;
    newImage.data[ptr++] = luminance;
    if (this.alpha) {
      newImage.data[ptr++] = data[i + 3];
    }
  }

  return newImage;
}
