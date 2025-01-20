import type { Image } from '../Image.js';
import { validateChannel } from '../utils/validators/validators.js';

export interface HistogramOptions {
  /**
   * The channel for which to compute the histogram.
   * If it is unspecified, the image must have one channel or the method will
   * throw an error.
   * @default `0`
   */
  channel?: number;
  /**
   * The number of slots that histogram can have.
   * @default 2 ** image.bitDepth
   */
  slots?: number;
}

/**
 * Returns a histogram of pixel intensities.
 * @param image - The original image.
 * @param options - Histogram options.
 * @returns - The histogram.
 */
export function histogram(
  image: Image,
  options: HistogramOptions = {},
): Uint32Array {
  let { channel } = options;
  const { slots = 2 ** image.bitDepth } = options;
  if (!(slots !== 0 && (slots & (slots - 1)) === 0)) {
    throw new RangeError(
      'slots must be a power of 2, for example: 64, 256, 1024',
    );
  }
  if (typeof channel !== 'number') {
    if (image.channels !== 1) {
      throw new TypeError(
        'channel option is mandatory for multi-channel images',
      );
    }
    channel = 0;
  }
  validateChannel(channel, image);

  const hist = new Uint32Array(slots);

  let bitShift = 0;
  const bitSlots = Math.log2(slots);
  bitShift = image.bitDepth - bitSlots;
  for (let i = 0; i < image.size; i++) {
    hist[image.getValueByIndex(i, channel) >> bitShift]++;
  }

  return hist;
}
