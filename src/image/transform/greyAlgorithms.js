/**
 * @typedef {('luma709'|'luma601'|'maximum'|'minimum'|'average'|'minmax'|'red'|'green'|'blue'|'cyan'|'magenta'|'yellow'|'black'|'hue'|'saturation'|'lightness')} GreyAlgorithm
 */

export const methods = {
  luma709(data, i) { // sRGB
    // return data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
    // Let's do a little trick ... in order not convert the integer to a double we do
    // the multiplication with integer to reach a total of 32768 and then shift the bits
    // of 15 to the right
    // This does a Math.floor and may lead to small (max 1) difference
    // Same result, > 10% faster on the full grey conversion
    return (data[i] * 6966 + data[i + 1] * 23436 + data[i + 2] * 2366) >> 15;
  },
  luma601(data, i) { // NTSC
    // return this.data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    return (data[i] * 9798 + data[i + 1] * 19235 + data[i + 2] * 3735) >> 15;
  },
  maximum(data, i) {
    return Math.max(data[i], data[i + 1], data[i + 2]);
  },
  minimum(data, i) {
    return Math.min(data[i], data[i + 1], data[i + 2]);
  },
  average(data, i) {
    return ((data[i] + data[i + 1] + data[i + 2]) / 3) >> 0;
  },
  minmax(data, i) {
    return (Math.max(data[i], data[i + 1], data[i + 2]) + Math.min(data[i], data[i + 1], data[i + 2])) / 2;
  },
  red(data, i) {
    return data[i];
  },
  green(data, i) {
    return data[i + 1];
  },
  blue(data, i) {
    return data[i + 2];
  },
  cyan(data, i, image) {
    let black = methods.black(data, i, image);
    return (image.maxValue - data[0] - black) / (1 - black / image.maxValue) >> 0;
  },
  magenta(data, i, image) {
    let black = methods.black(data, i, image);
    return (image.maxValue - data[1] - black) / (1 - black / image.maxValue) >> 0;
  },
  yellow(data, i, image) {
    let black = methods.black(data, i, image);
    return (image.maxValue - data[2] - black) / (1 - black / image.maxValue) >> 0;
  },
  black(data, i, image) {
    return Math.min(image.maxValue - data[i], image.maxValue - data[i + 1], image.maxValue - data[i + 2]);
  },
  hue(data, i, image) {
    let min = methods.min(data, i);
    let max = methods.max(data, i);
    if (max === min) {
      return 0;
    }
    let hue = 0;
    let delta = max - min;

    switch (max) {
      case data[i]:
        hue = (data[i + 1] - data[i + 2]) / delta + (data[i + 1] < data[i + 2] ? 6 : 0);
        break;
      case data[i + 1]:
        hue = (data[i + 2] - data[i]) / delta + 2;
        break;
      case data[i + 2]:
        hue = (data[i] - data[i + 1]) / delta + 4;
        break;
      default:
        throw new Error('unreachable');
    }
    return (hue / 6 * image.maxValue) >> 0;
  },
  saturation(data, i, image) { // from HSV model
    let min = methods.min(data, i);
    let max = methods.max(data, i);
    let delta = max - min;
    return (max === 0) ? 0 : delta / max * image.maxValue;
  },
  lightness(data, i) {
    let min = methods.min(data, i);
    let max = methods.max(data, i);
    return (max + min) / 2;
  }
};

Object.defineProperty(methods, 'luminosity', { enumerable: false, value: methods.lightness });
Object.defineProperty(methods, 'luminance', { enumerable: false, value: methods.lightness });
Object.defineProperty(methods, 'min', { enumerable: false, value: methods.minimum });
Object.defineProperty(methods, 'max', { enumerable: false, value: methods.maximum });
Object.defineProperty(methods, 'brightness', { enumerable: false, value: methods.maximum });


export const names = {};
Object.keys(methods).forEach((name) => {
  names[name] = name;
});
