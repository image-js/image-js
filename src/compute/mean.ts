import { Image } from '../Image';

export interface MeanOptions {
  /**
   * Specify if you want the mean computed on channels
   * individually or on the whole image data at once.
   *
   * @default true
   */
  channelwise?: boolean;
}
/**
 * Compute the mean of an image. The mean can be either computed on each channel
 * individually or on the whole image.
 *
 * @param image - Image to process.
 * @param options - Mean options.
 * @returns The mean pixel.
 */
export function mean(image: Image, options: MeanOptions): number[] | number {
  const { channelwise = true } = options;

  let pixel = new Array(image.channels).fill(0);
  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      for (let channel = 0; channel < image.channels; channel++) {
        pixel[channel] += image.getValue(column, row, channel);
      }
    }
  }
  const channelMeans = pixel.map((channel) => channel / image.size);

  if (channelwise) {
    return channelMeans;
  } else {
    return channelMeans.reduce((a, b) => a + b, 0) / image.channels;
  }
}
