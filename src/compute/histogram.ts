import { IJS } from '../IJS';
import { validateChannel } from '../utils/validators';

export interface HistogramOptions {
  /**
   * The channel for which to compute the histogram.
   * If it is unspecified, the image must have one channel or the method will
   * throw an error.
   */
  channel?: number;
}

/**
 * Returns a histogram of pixel intensities.
 *
 * @param image - The original image.
 * @param options - Histogram options.
 * @returns - The histogram.
 */
export function histogram(
  image: IJS,
  options: HistogramOptions = {},
): number[] {
  let { channel } = options;
  if (typeof channel !== 'number') {
    if (image.channels !== 1) {
      throw new Error('channel option is mandatory for multi-channel images');
    }
    channel = 0;
  }
  validateChannel(channel, image);
  const hist = new Array(image.maxValue + 1).fill(0);
  for (let i = 0; i < image.size; i++) {
    hist[image.getValueByIndex(i, channel)]++;
  }
  return hist;
}
