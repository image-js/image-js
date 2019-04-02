import { Image } from '../Image';
import { validateChannel } from '../utils/validators';

export interface IHistogramOptions {
  /**
   * The channel for which to compute the histogram.
   * If it is unspecified, the image must have one channel or the method will
   * throw an error.
   */
  channel?: number;
}

/**
 * Returns a histogram of pixel intensities.
 * @param image
 */
export function histogram(
  image: Image,
  options: IHistogramOptions = {}
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
  for (let i = channel; i < image.data.length; i += image.channels) {
    hist[image.data[i]]++;
  }
  return hist;
}
