/**
 * @typedef {('luma709'|'luma601'|'maximum'|'minimum'|'average'|'minmax'|'red'|'green'|'blue'|'cyan'|'magenta'|'yellow'|'black'|'hue'|'saturation'|'lightness')} GreyAlgorithm
 */

export const methods = {
  luma709(red, green, blue) {
    // sRGB
    // return red * 0.2126 + green * 0.7152 + blue * 0.0722;
    // Let's do a little trick ... in order not convert the integer to a double we do
    // the multiplication with integer to reach a total of 32768 and then shift the bits
    // of 15 to the right
    // This does a Math.floor and may lead to small (max 1) difference
    // Same result, > 10% faster on the full grey conversion
    return (red * 6966 + green * 23436 + blue * 2366) >> 15;
  },
  luma601(red, green, blue) {
    // NTSC
    // return this.red * 0.299 + green * 0.587 + blue * 0.114;
    return (red * 9798 + green * 19235 + blue * 3735) >> 15;
  },
  maximum(red, green, blue) {
    return Math.max(red, green, blue);
  },
  minimum(red, green, blue) {
    return Math.min(red, green, blue);
  },
  average(red, green, blue) {
    return ((red + green + blue) / 3) >> 0;
  },
  minmax(red, green, blue) {
    return (Math.max(red, green, blue) + Math.min(red, green, blue)) / 2;
  },
  red(red) {
    return red;
  },
  green(red, green) {
    return green;
  },
  blue(red, green, blue) {
    return blue;
  },
  cyan(red, green, blue, image) {
    let black = methods.black(red, green, blue, image);
    return ((image.maxValue - red - black) / (1 - black / image.maxValue)) >> 0;
  },
  magenta(red, green, blue, image) {
    let black = methods.black(red, green, blue, image);
    return (
      ((image.maxValue - green - black) / (1 - black / image.maxValue)) >> 0
    );
  },
  yellow(red, green, blue, image) {
    let black = methods.black(red, green, blue, image);
    return (
      ((image.maxValue - blue - black) / (1 - black / image.maxValue)) >> 0
    );
  },
  black(red, green, blue, image) {
    return Math.min(
      image.maxValue - red,
      image.maxValue - green,
      image.maxValue - blue,
    );
  },
  hue(red, green, blue, image) {
    let min = methods.min(red, green, blue);
    let max = methods.max(red, green, blue);
    if (max === min) {
      return 0;
    }
    let hue = 0;
    let delta = max - min;

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
    return ((hue / 6) * image.maxValue) >> 0;
  },
  saturation(red, green, blue, image) {
    // from HSV model
    let min = methods.min(red, green, blue);
    let max = methods.max(red, green, blue);
    let delta = max - min;
    return max === 0 ? 0 : (delta / max) * image.maxValue;
  },
  lightness(red, green, blue) {
    let min = methods.min(red, green, blue);
    let max = methods.max(red, green, blue);
    return (max + min) / 2;
  },
};

Object.defineProperty(methods, 'luminosity', {
  enumerable: false,
  value: methods.lightness,
});
Object.defineProperty(methods, 'luminance', {
  enumerable: false,
  value: methods.lightness,
});
Object.defineProperty(methods, 'min', {
  enumerable: false,
  value: methods.minimum,
});
Object.defineProperty(methods, 'max', {
  enumerable: false,
  value: methods.maximum,
});
Object.defineProperty(methods, 'brightness', {
  enumerable: false,
  value: methods.maximum,
});

export const names = {};
Object.keys(methods).forEach((name) => {
  names[name] = name;
});
