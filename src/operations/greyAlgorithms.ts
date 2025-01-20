import type { Image } from '../Image.js';
import { assert } from '../utils/validators/assert.js';

/**
 * Converts R, G and B values to a single value using Luma 709 standard({@link https://en.wikipedia.org/wiki/Luma_(video)}).
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @returns - Corresponding gray value.
 */
export function luma709(red: number, green: number, blue: number): number {
  // sRGB
  // return red * 0.2126 + green * 0.7152 + blue * 0.0722;
  // Let's do a little trick ... in order not convert the integer to a double we do
  // the multiplication with integer to reach a total of 32768 and then shift the bits
  // of 15 to the right
  // This does a Math.floor and may lead to small (max 1) difference
  // Same result, > 10% faster on the full grey conversion
  return (red * 6966 + green * 23436 + blue * 2366) >> 15;
}
/**
 *  Converts R, G and B values to a single value using Luma 601 standard({@link https://en.wikipedia.org/wiki/Luma_(video)}).
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @returns - Corresponding gray value.
 */
export function luma601(red: number, green: number, blue: number): number {
  // NTSC
  // return this.red * 0.299 + green * 0.587 + blue * 0.114;
  return (red * 9798 + green * 19235 + blue * 3735) >> 15;
}
/**
 * Return the maximal value between red, green and blue.
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @returns - Corresponding gray value.
 */
export function max(red: number, green: number, blue: number): number {
  return Math.max(red, green, blue);
}
/**
 * Return the minimal value between red, green and blue.
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @returns - Corresponding gray value.
 */
export function min(red: number, green: number, blue: number): number {
  return Math.min(red, green, blue);
}
/**
 * Return the average of red, green and blue.
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @returns - Corresponding gray value.
 */
export function average(red: number, green: number, blue: number): number {
  return ((red + green + blue) / 3) >> 0;
}
/**
 * Return the average between the max and min values of red, green and blue.
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @returns - Corresponding gray value.
 */
export function minmax(red: number, green: number, blue: number): number {
  return (Math.max(red, green, blue) + Math.min(red, green, blue)) / 2;
}
/**
 * Return the red value.
 * @param red - Red value of current pixel.
 * @returns - Corresponding gray value.
 */
export function red(red: number): number {
  return red;
}
/**
 * Return the green value.
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @returns - Corresponding gray value.
 */
export function green(red: number, green: number): number {
  return green;
}
/**
 * Return the blue value.
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @returns - Corresponding gray value.
 */
export function blue(red: number, green: number, blue: number): number {
  return blue;
}
/**
 * Return the minimum of the inverses of red, green and blue.
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @param image - Image to convert to grey.
 * @returns - Corresponding gray value.
 */
export function black(
  red: number,
  green: number,
  blue: number,
  image: Image,
): number {
  return Math.min(
    image.maxValue - red,
    image.maxValue - green,
    image.maxValue - blue,
  );
}
/**
 * Returns the cyan component of a pixel.
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @param image - Image to convert to grey.
 * @returns - Corresponding gray value.
 */
export function cyan(
  red: number,
  green: number,
  blue: number,
  image: Image,
): number {
  const blackColor = black(red, green, blue, image);
  return (
    ((image.maxValue - red - blackColor) / (1 - blackColor / image.maxValue)) >>
    0
  );
}
/**
 * Returns the magenta component of a pixel.
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @param image - Image to convert to grey.
 * @returns - Corresponding gray value.
 */
export function magenta(
  red: number,
  green: number,
  blue: number,
  image: Image,
): number {
  const blackColor = black(red, green, blue, image);
  return (
    ((image.maxValue - green - blackColor) /
      (1 - blackColor / image.maxValue)) >>
    0
  );
}
/**
 * Returns the yellow component of a pixel.
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @param image - Image to convert to grey.
 * @returns - Corresponding gray value.
 */
export function yellow(
  red: number,
  green: number,
  blue: number,
  image: Image,
): number {
  const blackColor = black(red, green, blue, image);
  return (
    ((image.maxValue - blue - blackColor) /
      (1 - blackColor / image.maxValue)) >>
    0
  );
}
/**
 * Returns the hue of a pixel as a value between 0 and 255.
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @param image - Source image for the RGB values.
 * @returns - Hue of the pixel.
 */
export function hue(
  red: number,
  green: number,
  blue: number,
  image: Image,
): number {
  const minValue = min(red, green, blue);
  const maxValue = max(red, green, blue);
  if (maxValue === minValue) {
    return 0;
  }
  let hue = 0;
  const delta = maxValue - minValue;

  if (maxValue === red) {
    hue = (green - blue) / delta + (green < blue ? 6 : 0);
  } else if (maxValue === green) {
    hue = (blue - red) / delta + 2;
  } else {
    assert(maxValue === blue);
    hue = (red - green) / delta + 4;
  }

  return ((hue / 6) * image.maxValue) >> 0;
}

/**
 * Returns the saturation component of a pixel.
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @param image - Source image for the RGB values.
 * @returns - Saturation of the pixel.
 */
export function saturation(
  red: number,
  green: number,
  blue: number,
  image: Image,
): number {
  // from HSV model
  const minValue = min(red, green, blue);
  const maxValue = max(red, green, blue);
  const delta = maxValue - minValue;
  return maxValue === 0 ? 0 : (delta / maxValue) * image.maxValue;
}

/**
 * Returns the lightness of a pixel.
 * @param red - Red value of current pixel.
 * @param green - Green value of current pixel.
 * @param blue - Blue value of current pixel.
 * @returns - Lightness of the pixel.
 */
export function lightness(red: number, green: number, blue: number): number {
  const minValue = min(red, green, blue);
  const maxValue = max(red, green, blue);
  return (maxValue + minValue) / 2;
}
