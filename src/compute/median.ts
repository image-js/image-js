// @ts-expect-error: median-quisckselect has no types
import quickMedian from 'median-quickselect';

import { IJS } from '../IJS';
/**
 * Returns the median pixel of the image.
 *
 * @param image - Image to process.
 * @returns Median pixel.
 */
export function median(image: IJS): number[] {
  let pixel = new Array(image.channels).fill(0);

  for (let i = 0; i < image.channels; i++) {
    const channel = image.getChannel(i);
    pixel[i] = quickMedian(channel);
  }

  return pixel;
}
